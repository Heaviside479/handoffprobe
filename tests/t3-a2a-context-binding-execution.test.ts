import { describe, expect, it } from 'vitest';

import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
import type { CrossingPreDispatchGate } from '../src/phase9/crossing-corpus/gate.js';
import {
  createCrossingObservationState,
  recordA2aCrossingObservation,
  toExternalCrossingObservedShape,
  type CrossingObservationState,
  type ExternalCrossingObservedShape,
} from '../src/phase9/crossing-corpus/observation.js';
import { EvidenceRecorder } from '../src/protocol-lab/evidence.js';
import { callReadInvoiceThroughMcp } from '../src/protocol-lab/mcp/harness.js';
import type { SecurityContext } from '../src/protocol-lab/models.js';

const CONTEXT: SecurityContext = {
  principal: 'user:alice',
  caller: 'agent:sales',
  downstream: 'agent:billing',
  tenant: 'tenant:acme',
  resource: 'invoice:INV-1001',
  capabilities: ['invoice.read'],
};

type ResearchOutcome = 'PASS' | 'FAIL' | 'INCONCLUSIVE' | 'ERROR';

function createObservation(
  messageId: string,
  taskId: string,
  contextId: string,
): CrossingObservationState {
  const observation = createCrossingObservationState();

  recordA2aCrossingObservation(observation, {
    caller: CONTEXT.caller,
    messageId,
    taskId,
    contextId,
    transportAuthenticated: true,
    taskServerResolved: true,
    contextServerResolved: true,
  });

  return observation;
}

function verification(
  observation: CrossingObservationState,
  decision:
    | {
        outcome: 'succeed';
        reason: 'accepted';
      }
    | {
        outcome: 'reject';
        reason:
          | 'task_mismatch'
          | 'context_mismatch'
          | 'not_yet_valid'
          | 'expired'
          | 'authority_not_current';
      },
): ReturnType<CrossingPreDispatchGate> {
  return {
    decision,
    observed: toExternalCrossingObservedShape(observation),
    observationReady: true,
    provenanceReadiness: {
      complete: true,
      missing: [],
    },
  };
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function sameMcpRequest(
  left: ExternalCrossingObservedShape,
  right: ExternalCrossingObservedShape,
): boolean {
  return (
    left.mcp_audience.value === right.mcp_audience.value &&
    left.mcp_audience.source === right.mcp_audience.source &&
    left.tool === right.tool &&
    sameJson(left.arguments, right.arguments)
  );
}

function taskContextGate(scope: 'task' | 'context'): CrossingPreDispatchGate {
  return (observation, authorityObservation) => {
    if (authorityObservation === undefined) {
      throw new Error('T-3 V3 requires an authority observation.');
    }

    const observed = toExternalCrossingObservedShape(observation);
    const authority = toExternalCrossingObservedShape(authorityObservation);

    if (observed.context_id !== authority.context_id) {
      return verification(observation, {
        outcome: 'reject',
        reason: 'context_mismatch',
      });
    }

    const otherBindingsMatch =
      observed.caller_id === authority.caller_id &&
      observed.message_id === authority.message_id &&
      sameMcpRequest(observed, authority);

    if (!otherBindingsMatch) {
      throw new Error('T-3 V3 fixture changed a non-task authorization binding.');
    }

    if (scope === 'task' && observed.task_id !== authority.task_id) {
      return verification(observation, {
        outcome: 'reject',
        reason: 'task_mismatch',
      });
    }

    return verification(observation, {
      outcome: 'succeed',
      reason: 'accepted',
    });
  };
}

class T3AuthorizationComparisonBlockedError extends Error {
  constructor(readonly researchOutcome: Extract<ResearchOutcome, 'INCONCLUSIVE' | 'ERROR'>) {
    super(`T-3 authorization comparison blocked before dispatch: ${researchOutcome}`);
    this.name = 'T3AuthorizationComparisonBlockedError';
  }
}

function unresolvedAuthorizationGate(
  researchOutcome: Extract<ResearchOutcome, 'INCONCLUSIVE' | 'ERROR'>,
): CrossingPreDispatchGate {
  return (observation) => {
    const observed = toExternalCrossingObservedShape(observation);

    if (observed.tool === null || observed.arguments === null) {
      throw new Error('T-3 V10 requires the final request to be observable.');
    }

    throw new T3AuthorizationComparisonBlockedError(researchOutcome);
  };
}

class T3RequiredRevalidationUnavailableError extends Error {
  constructor() {
    super('Required trusted revalidation source unavailable before protected dispatch.');
    this.name = 'T3RequiredRevalidationUnavailableError';
  }
}

function unavailableRevalidationGate(onCheck: () => void): CrossingPreDispatchGate {
  return (observation) => {
    const observed = toExternalCrossingObservedShape(observation);

    if (observed.tool === null || observed.arguments === null) {
      throw new Error('T-3 V12 requires the final request to be observable.');
    }

    onCheck();
    throw new T3RequiredRevalidationUnavailableError();
  };
}

interface FinalEffectAuthorization {
  readonly status: 'current' | 'revoked';
  readonly now: number;
  readonly notBefore: number;
  readonly expiresAt: number;
}

function perEffectFinalAuthorizationGate(
  authorization: FinalEffectAuthorization,
  onEvaluated: (observed: ExternalCrossingObservedShape) => void,
): CrossingPreDispatchGate {
  return (observation, authorityObservation) => {
    if (authorityObservation === undefined) {
      throw new Error('T-3 V13 requires an authority observation.');
    }

    const observed = toExternalCrossingObservedShape(observation);
    const authority = toExternalCrossingObservedShape(authorityObservation);

    const finalRequestMatches =
      observed.caller_id === authority.caller_id &&
      observed.message_id === authority.message_id &&
      observed.task_id === authority.task_id &&
      observed.context_id === authority.context_id &&
      sameMcpRequest(observed, authority);

    if (!finalRequestMatches) {
      throw new Error('T-3 V13 evaluated request differs from the final dispatch request.');
    }

    onEvaluated(structuredClone(observed));

    if (authorization.now < authorization.notBefore) {
      return verification(observation, {
        outcome: 'reject',
        reason: 'not_yet_valid',
      });
    }

    if (authorization.now >= authorization.expiresAt) {
      return verification(observation, {
        outcome: 'reject',
        reason: 'expired',
      });
    }

    if (authorization.status !== 'current') {
      return verification(observation, {
        outcome: 'reject',
        reason: 'authority_not_current',
      });
    }

    return verification(observation, {
      outcome: 'succeed',
      reason: 'accepted',
    });
  };
}

describe('T-3.3 A2A context-binding research execution', () => {
  it('V3 distinguishes task-bound denial from an explicit context-bound grant', async () => {
    const messageId = 't3-v3-message';
    const authorityTask = 't3-v3-authority-task';
    const otherTask = 't3-v3-other-task';
    const contextId = 't3-v3-context';

    const taskEffects = new CrossingEffectRecorder();
    const taskBefore = taskEffects.snapshot();
    const taskRecorder = new EvidenceRecorder('t3-v3-task-bound', 'secure');

    const taskRuntime = createObservation(messageId, otherTask, contextId);
    const taskAuthority = createObservation(messageId, authorityTask, contextId);

    await expect(
      callReadInvoiceThroughMcp(
        CONTEXT,
        taskRecorder,
        taskRuntime,
        taskEffects,
        taskContextGate('task'),
        taskAuthority,
      ),
    ).rejects.toMatchObject({
      name: 'CrossingPreDispatchRejectedError',
      verification: {
        decision: {
          outcome: 'reject',
          reason: 'task_mismatch',
        },
      },
    });

    expect(taskEffects.deltaSince(taskBefore)).toEqual({
      before: 0,
      after: 0,
      delta: 0,
    });
    expect(taskRecorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(0);

    const contextEffects = new CrossingEffectRecorder();
    const contextBefore = contextEffects.snapshot();
    const contextRecorder = new EvidenceRecorder('t3-v3-context-bound', 'secure');

    const contextRuntime = createObservation(messageId, otherTask, contextId);
    const contextAuthority = createObservation(messageId, authorityTask, contextId);

    const accepted = await callReadInvoiceThroughMcp(
      CONTEXT,
      contextRecorder,
      contextRuntime,
      contextEffects,
      taskContextGate('context'),
      contextAuthority,
    );

    expect(accepted.crossingVerification?.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });
    expect(contextRuntime.taskId.value).toBe(otherTask);
    expect(contextAuthority.taskId.value).toBe(authorityTask);
    expect(contextRuntime.contextId.value).toBe(contextAuthority.contextId.value);
    expect(contextEffects.deltaSince(contextBefore)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });
    expect(contextRecorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(
      1,
    );
  });

  it.each(['INCONCLUSIVE', 'ERROR'] as const)(
    'V10 fails closed for %s without converting the research outcome into vulnerability FAIL',
    async (researchOutcome) => {
      const effects = new CrossingEffectRecorder();
      const before = effects.snapshot();
      const recorder = new EvidenceRecorder(`t3-v10-${researchOutcome.toLowerCase()}`, 'secure');
      const observation = createObservation(
        `t3-v10-${researchOutcome.toLowerCase()}-message`,
        't3-v10-task',
        't3-v10-context',
      );

      await expect(
        callReadInvoiceThroughMcp(
          CONTEXT,
          recorder,
          observation,
          effects,
          unresolvedAuthorizationGate(researchOutcome),
        ),
      ).rejects.toMatchObject({
        name: 'T3AuthorizationComparisonBlockedError',
        researchOutcome,
      });

      expect(researchOutcome).not.toBe('FAIL');
      expect(effects.deltaSince(before)).toEqual({
        before: 0,
        after: 0,
        delta: 0,
      });
      expect(recorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(0);
      expect(recorder.events.filter((event) => event.event === 'fake_tool.execute')).toHaveLength(
        0,
      );
    },
  );

  it('V12 blocks the protected effect when required trusted revalidation is unavailable', async () => {
    const effects = new CrossingEffectRecorder();
    const before = effects.snapshot();
    const recorder = new EvidenceRecorder('t3-v12-revalidation-unavailable', 'secure');
    const observation = createObservation('t3-v12-message', 't3-v12-task', 't3-v12-context');

    let revalidationChecks = 0;

    await expect(
      callReadInvoiceThroughMcp(
        CONTEXT,
        recorder,
        observation,
        effects,
        unavailableRevalidationGate(() => {
          revalidationChecks += 1;
        }),
      ),
    ).rejects.toMatchObject({
      name: 'T3RequiredRevalidationUnavailableError',
    });

    expect(revalidationChecks).toBe(1);
    expect(effects.deltaSince(before)).toEqual({
      before: 0,
      after: 0,
      delta: 0,
    });
    expect(recorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(0);
    expect(recorder.events.filter((event) => event.event === 'fake_tool.execute')).toHaveLength(0);
  });

  it('V13 authorizes each protected effect independently under one task and blocks a later revoked effect', async () => {
    const effects = new CrossingEffectRecorder();
    const before = effects.snapshot();

    const evaluated: ExternalCrossingObservedShape[] = [];

    const firstRecorder = new EvidenceRecorder('t3-v13-effect-1', 'secure');
    const firstRuntime = createObservation(
      't3-v13-message-1',
      't3-v13-shared-task',
      't3-v13-shared-context',
    );
    const firstAuthority = createObservation(
      't3-v13-message-1',
      't3-v13-shared-task',
      't3-v13-shared-context',
    );

    const first = await callReadInvoiceThroughMcp(
      CONTEXT,
      firstRecorder,
      firstRuntime,
      effects,
      perEffectFinalAuthorizationGate(
        {
          status: 'current',
          now: 100,
          notBefore: 50,
          expiresAt: 150,
        },
        (observed) => {
          evaluated.push(observed);
        },
      ),
      firstAuthority,
    );

    expect(first.crossingVerification?.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });

    const secondRecorder = new EvidenceRecorder('t3-v13-effect-2', 'secure');
    const secondRuntime = createObservation(
      't3-v13-message-2',
      't3-v13-shared-task',
      't3-v13-shared-context',
    );
    const secondAuthority = createObservation(
      't3-v13-message-2',
      't3-v13-shared-task',
      't3-v13-shared-context',
    );

    await expect(
      callReadInvoiceThroughMcp(
        CONTEXT,
        secondRecorder,
        secondRuntime,
        effects,
        perEffectFinalAuthorizationGate(
          {
            status: 'revoked',
            now: 110,
            notBefore: 50,
            expiresAt: 150,
          },
          (observed) => {
            evaluated.push(observed);
          },
        ),
        secondAuthority,
      ),
    ).rejects.toMatchObject({
      name: 'CrossingPreDispatchRejectedError',
      verification: {
        decision: {
          outcome: 'reject',
          reason: 'authority_not_current',
        },
      },
    });

    expect(evaluated).toHaveLength(2);
    expect(evaluated[0]?.task_id).toBe('t3-v13-shared-task');
    expect(evaluated[1]?.task_id).toBe('t3-v13-shared-task');
    expect(evaluated[0]?.context_id).toBe('t3-v13-shared-context');
    expect(evaluated[1]?.context_id).toBe('t3-v13-shared-context');

    expect(effects.deltaSince(before)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });

    const firstToolCall = firstRecorder.events.find((event) => event.event === 'mcp.tool.call');

    expect(firstToolCall?.details.tool).toBe(evaluated[0]?.tool);
    expect(firstToolCall?.details.resource).toBe(evaluated[0]?.arguments?.resource);

    expect(firstRecorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(1);
    expect(secondRecorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(
      0,
    );
    expect(
      secondRecorder.events.filter((event) => event.event === 'fake_tool.execute'),
    ).toHaveLength(0);
  });
});
