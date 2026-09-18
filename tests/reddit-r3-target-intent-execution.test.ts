import { describe, expect, it } from 'vitest';

import { evaluateP0Authorization } from '../src/p0-fixture/index.js';
import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
import {
  CrossingPreDispatchRejectedError,
  type CrossingPreDispatchGate,
} from '../src/phase9/crossing-corpus/gate.js';
import {
  createCrossingObservationState,
  recordA2aCrossingObservation,
  toExternalCrossingObservedShape,
} from '../src/phase9/crossing-corpus/observation.js';
import { EvidenceRecorder } from '../src/protocol-lab/evidence.js';
import { callReadInvoiceThroughMcp } from '../src/protocol-lab/mcp/harness.js';
import type { SecurityContext } from '../src/protocol-lab/models.js';

const LOGICAL_TASK = 'task:R3';

const TARGET_A = ['tenant:A', 'resource:A'] as const;
const TARGET_B = ['tenant:B', 'resource:B'] as const;

const VISIBLE_TARGETS = [TARGET_A, TARGET_B] as const;

type Target = readonly [tenant: string, resource: string];

type Scenario = 'positive-control' | 'secure-negative' | 'vulnerable-negative';

type TargetPolicy = 'request_and_task_target' | 'request_only';

interface GateState {
  requestAuthorization: 'not_checked' | 'accept' | 'reject';
  requestAuthorizationReasons: string[];
  taskTargetContinuity: 'not_checked' | 'match' | 'mismatch';
  visible: boolean;
  policy: TargetPolicy;
}

function targetId(target: Target): string {
  return JSON.stringify(target);
}

function targetFromContext(context: SecurityContext): Target {
  return [context.tenant, context.resource];
}

function createTargetBContext(): SecurityContext {
  const authority = {
    principal: 'user:reddit-r3',
    delegate: 'mcp:r3-local-fixture',
    tenant: TARGET_B[0],
    resources: [TARGET_B[1]],
    capabilities: ['license.use'],
  };

  return {
    principal: 'user:reddit-r3',
    caller: 'agent:r3-upstream',
    downstream: 'mcp:r3-local-fixture',
    tenant: TARGET_B[0],
    resource: TARGET_B[1],
    capabilities: ['license.use'],
    upstreamAuthority: structuredClone(authority),
    effectiveAuthority: structuredClone(authority),
  };
}

function evaluateTargetBRequestAuthorization(context: SecurityContext) {
  return evaluateP0Authorization(context, {
    principal: context.principal,
    downstream: context.downstream,
    tenant: context.tenant,
    resource: context.resource,
    capability: 'license.use',
    tool: 'read_invoice',
  });
}

function createObservation(label: string) {
  const observation = createCrossingObservationState();

  recordA2aCrossingObservation(observation, {
    caller: 'agent:r3-upstream',
    messageId: `reddit-r3-${label}-message`,
    taskId: LOGICAL_TASK,
    contextId: 'context:R3',
    transportAuthenticated: true,
    taskServerResolved: true,
    contextServerResolved: true,
  });

  return observation;
}

function createTargetContinuityGate(
  context: SecurityContext,
  taskAuthorizedTargets: readonly Target[],
  policy: TargetPolicy,
  state: GateState,
): CrossingPreDispatchGate {
  return (observation) => {
    const observed = toExternalCrossingObservedShape(observation);

    const tenant = observed.arguments?.tenant;
    const resource = observed.arguments?.resource;

    if (tenant !== TARGET_B[0] || resource !== TARGET_B[1]) {
      throw new Error(
        `R-3 effective target mismatch: expected ${targetId(TARGET_B)}, received ${JSON.stringify([
          tenant,
          resource,
        ])}`,
      );
    }

    /*
     * B receives its own narrow upstream/effective authority.
     *
     * Evaluate the retry through HandoffProbe's existing request-level
     * authorization layer so task-target continuity is isolated as the
     * separate property under test.
     */
    const requestDecision = evaluateTargetBRequestAuthorization(context);

    state.requestAuthorization = requestDecision.allowed ? 'accept' : 'reject';

    state.requestAuthorizationReasons = [...requestDecision.reasons];

    state.visible = VISIBLE_TARGETS.some((target) => targetId(target) === targetId(TARGET_B));

    const taskTargetAllowed = taskAuthorizedTargets.some(
      (target) => targetId(target) === targetId(TARGET_B),
    );

    state.taskTargetContinuity = taskTargetAllowed ? 'match' : 'mismatch';

    const accepted = requestDecision.allowed && (policy === 'request_only' || taskTargetAllowed);

    return {
      decision: accepted
        ? {
            outcome: 'succeed',
            reason: 'accepted',
          }
        : {
            outcome: 'reject',

            /*
             * Fixture-local use of the existing pre-dispatch reason.
             *
             * The effective action target is outside the frozen
             * task-target binding.
             */
            reason: 'action_digest_mismatch',
          },

      observed,

      observationReady: true,

      provenanceReadiness: {
        complete: true,
        missing: [],
      },
    };
  };
}

function scenarioConfig(scenario: Scenario): {
  taskAuthorizedTargets: readonly Target[];
  policy: TargetPolicy;
} {
  switch (scenario) {
    case 'positive-control':
      return {
        taskAuthorizedTargets: [TARGET_A, TARGET_B],
        policy: 'request_and_task_target',
      };

    case 'secure-negative':
      return {
        taskAuthorizedTargets: [TARGET_A],
        policy: 'request_and_task_target',
      };

    case 'vulnerable-negative':
      return {
        taskAuthorizedTargets: [TARGET_A],
        policy: 'request_only',
      };
  }
}

async function runScenario(scenario: Scenario) {
  const config = scenarioConfig(scenario);

  const effects = new CrossingEffectRecorder();
  const before = effects.snapshot();

  /*
   * Attempt 1:
   *
   * The request is properly authorized, but the requested licence is not
   * available on A. The deterministic 403-like denial causes no protected
   * effect.
   */
  const firstAttempt = {
    logicalTask: LOGICAL_TASK,
    target: TARGET_A,
    requestAuthorization: 'accept' as const,
    outcome: '403_license_denied' as const,
    protectedEffectDelta: 0,
  };

  /*
   * Discovery:
   *
   * A and B are visible. Visibility changes neither request authority nor
   * the task-authorized target set.
   */
  const discovery = {
    visibleTargets: VISIBLE_TARGETS,
    protectedEffectDelta: 0,
  };

  const context = createTargetBContext();

  const recorder = new EvidenceRecorder(
    `reddit-r3-${scenario}`,
    scenario === 'vulnerable-negative' ? 'vulnerable' : 'secure',
  );

  const observation = createObservation(scenario);

  const state: GateState = {
    requestAuthorization: 'not_checked',
    requestAuthorizationReasons: [],
    taskTargetContinuity: 'not_checked',
    visible: false,
    policy: config.policy,
  };

  let dispatch: 'allowed' | 'blocked' = 'allowed';

  try {
    await callReadInvoiceThroughMcp(
      context,
      recorder,
      observation,
      effects,
      createTargetContinuityGate(context, config.taskAuthorizedTargets, config.policy, state),
    );
  } catch (error) {
    if (error instanceof CrossingPreDispatchRejectedError) {
      dispatch = 'blocked';
    } else {
      throw error;
    }
  }

  const delta = effects.deltaSince(before);

  return {
    scenario,
    logicalTask: LOGICAL_TASK,

    firstAttempt,
    discovery,

    retryTarget: targetFromContext(context),
    taskAuthorizedTargets: config.taskAuthorizedTargets,

    requestAuthorization: state.requestAuthorization,
    requestAuthorizationReasons: state.requestAuthorizationReasons,
    taskTargetContinuity: state.taskTargetContinuity,
    targetVisible: state.visible,
    policy: state.policy,

    dispatch,
    protectedEffectDelta: delta.delta,

    mcpToolCallCount: recorder.events.filter((event) => event.event === 'mcp.tool.call').length,

    fakeToolExecuteCount: recorder.events.filter((event) => event.event === 'fake_tool.execute')
      .length,

    events: recorder.events.map((event) => event.event),
  };
}

describe('Reddit R-3 authorized tenant switch after denial', () => {
  it('freezes the denial, discovery and independently authorized alternate target', () => {
    const context = createTargetBContext();
    const requestDecision = evaluateTargetBRequestAuthorization(context);

    expect(targetId(TARGET_A)).not.toBe(targetId(TARGET_B));

    expect(VISIBLE_TARGETS.map(targetId)).toEqual([targetId(TARGET_A), targetId(TARGET_B)]);

    expect(targetFromContext(context)).toEqual(TARGET_B);

    expect(requestDecision.allowed).toBe(true);
    expect(requestDecision.reasons).toEqual([]);
    expect(requestDecision.upstreamAuthorityPresent).toBe(true);
    expect(requestDecision.effectiveAuthorityPresent).toBe(true);
    expect(requestDecision.tenantMatches).toBe(true);
    expect(requestDecision.resourceMatches).toBe(true);
    expect(requestDecision.capabilityAllowed).toBe(true);
    expect(requestDecision.authorityNotAmplified).toBe(true);
  });

  it('allows the positive control when the task explicitly authorizes A and B', async () => {
    const result = await runScenario('positive-control');

    expect(result.firstAttempt.requestAuthorization).toBe('accept');
    expect(result.firstAttempt.outcome).toBe('403_license_denied');
    expect(result.firstAttempt.protectedEffectDelta).toBe(0);

    expect(result.discovery.visibleTargets).toEqual([TARGET_A, TARGET_B]);

    expect(result.discovery.protectedEffectDelta).toBe(0);

    expect(result.retryTarget).toEqual(TARGET_B);

    expect(result.requestAuthorization).toBe('accept');
    expect(result.requestAuthorizationReasons).toEqual([]);

    expect(result.taskTargetContinuity).toBe('match');
    expect(result.targetVisible).toBe(true);

    expect(result.dispatch).toBe('allowed');
    expect(result.protectedEffectDelta).toBe(1);

    expect(result.mcpToolCallCount).toBe(1);
    expect(result.fakeToolExecuteCount).toBe(1);
  });

  it('securely blocks B when request authorization is valid but the task remains bound to A', async () => {
    const result = await runScenario('secure-negative');

    expect(result.firstAttempt.protectedEffectDelta).toBe(0);
    expect(result.discovery.protectedEffectDelta).toBe(0);

    expect(result.taskAuthorizedTargets).toEqual([TARGET_A]);
    expect(result.retryTarget).toEqual(TARGET_B);

    expect(result.targetVisible).toBe(true);

    expect(result.requestAuthorization).toBe('accept');
    expect(result.requestAuthorizationReasons).toEqual([]);

    expect(result.taskTargetContinuity).toBe('mismatch');

    expect(result.dispatch).toBe('blocked');
    expect(result.protectedEffectDelta).toBe(0);

    expect(result.mcpToolCallCount).toBe(0);
    expect(result.fakeToolExecuteCount).toBe(0);
  });

  it('reproduces the vulnerable request-only retry path', async () => {
    const result = await runScenario('vulnerable-negative');

    expect(result.taskAuthorizedTargets).toEqual([TARGET_A]);
    expect(result.retryTarget).toEqual(TARGET_B);

    expect(result.targetVisible).toBe(true);

    expect(result.requestAuthorization).toBe('accept');
    expect(result.requestAuthorizationReasons).toEqual([]);

    expect(result.taskTargetContinuity).toBe('mismatch');
    expect(result.policy).toBe('request_only');

    expect(result.dispatch).toBe('allowed');
    expect(result.protectedEffectDelta).toBe(1);

    expect(result.mcpToolCallCount).toBe(1);
    expect(result.fakeToolExecuteCount).toBe(1);
  });

  it('reproduces all three scenario summaries deterministically', async () => {
    for (const scenario of [
      'positive-control',
      'secure-negative',
      'vulnerable-negative',
    ] as const) {
      const first = await runScenario(scenario);
      const second = await runScenario(scenario);

      expect(first).toEqual(second);
    }
  });
});
