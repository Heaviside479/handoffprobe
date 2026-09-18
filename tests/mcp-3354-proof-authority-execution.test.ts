import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import {
  evaluateP0SemanticAuthority,
  type P0ProtectedOperation,
  type P0SemanticAuthorityDecision,
} from '../src/p0-fixture/index.js';
import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
import type { CrossingPreDispatchGate } from '../src/phase9/crossing-corpus/gate.js';
import {
  createCrossingObservationState,
  recordA2aCrossingObservation,
  toExternalCrossingObservedShape,
  type CrossingObservationState,
} from '../src/phase9/crossing-corpus/observation.js';
import { EvidenceRecorder } from '../src/protocol-lab/evidence.js';
import { callReadInvoiceThroughMcp } from '../src/protocol-lab/mcp/harness.js';
import type { SecurityContext } from '../src/protocol-lab/models.js';

const NARROW_SCOPE = 'mycelium:payment';
const WIDENED_SCOPE = 'mycelium:*';

const NARROW_OPERATION = 'payment.route|scope=mycelium:payment';
const WIDENED_OPERATION = 'payment.route|scope=mycelium:*';

const FIXED_SALT = Buffer.from('11'.repeat(32), 'hex');
const FIXED_NONCE = 'mcp3354-handoffprobe-nonce-001';

const PROGRAM_DESCRIPTION = 'handoffprobe:mcp3354:synthetic-execution-integrity-binding:v1';

const OPERATIONS: readonly P0ProtectedOperation[] = [
  {
    id: NARROW_OPERATION,
    capability: 'payment.route',
    resource: NARROW_SCOPE,
    effect: 'synthetic_payment_route',
  },
  {
    id: WIDENED_OPERATION,
    capability: 'payment.route',
    resource: WIDENED_SCOPE,
    effect: 'synthetic_payment_route_widened',
  },
];

const CONTEXT: SecurityContext = {
  principal: 'user:mcp3354-local',
  caller: 'agent:mcp3354-upstream',
  downstream: 'mcp:local-fixture',
  tenant: 'tenant:mcp3354',
  resource: 'synthetic:payment-route',
  capabilities: ['payment.route'],
};

const AUTHORIZED_ARGUMENTS = {
  action: 'payment.route',
  delegated_scope: NARROW_SCOPE,
  amount_cents: 2000,
} as const;

const WIDENED_ARGUMENTS = {
  action: 'payment.route',
  delegated_scope: WIDENED_SCOPE,
  amount_cents: 2000,
} as const;

interface SyntheticExecutionIntegrityEvidence {
  readonly profile: 'handoffprobe-mcp3354-binding-v1';
  readonly circuitHash: string;
  readonly inputCommitment: string;
  readonly outputCommitment: string;
  readonly nonce: string;
}

interface LayerState {
  proof: 'not_checked' | 'accept' | 'reject';
  authority: 'not_checked' | 'accept' | 'reject' | 'error';
  authorityDecision?: P0SemanticAuthorityDecision;
}

function canonicalizeFixtureSubset(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) {
      throw new Error('MCP #3354 fixture accepts only safe integer numbers.');
    }

    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalizeFixtureSubset).join(',')}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));

    return `{${entries
      .map(([key, entryValue]) => `${JSON.stringify(key)}:${canonicalizeFixtureSubset(entryValue)}`)
      .join(',')}}`;
  }

  throw new Error('Unsupported MCP #3354 fixture value.');
}

function sha256(value: Buffer | string): string {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`;
}

function inputCommitment(argumentsValue: Record<string, unknown>): string {
  const canonical = Buffer.from(canonicalizeFixtureSubset(argumentsValue), 'utf8');

  return sha256(Buffer.concat([FIXED_SALT, canonical]));
}

function runSyntheticProgram(argumentsValue: Record<string, unknown>): Record<string, unknown> {
  return {
    action: argumentsValue.action,
    delegated_scope: argumentsValue.delegated_scope,
    amount_cents: argumentsValue.amount_cents,
    result: 'synthetic-execution-complete',
  };
}

function createExecutionIntegrityEvidence(
  argumentsValue: Record<string, unknown>,
): SyntheticExecutionIntegrityEvidence {
  const output = runSyntheticProgram(argumentsValue);

  return {
    profile: 'handoffprobe-mcp3354-binding-v1',
    circuitHash: sha256(PROGRAM_DESCRIPTION),
    inputCommitment: inputCommitment(argumentsValue),
    outputCommitment: sha256(canonicalizeFixtureSubset(output)),
    nonce: FIXED_NONCE,
  };
}

function verifyExecutionIntegrity(
  evidence: SyntheticExecutionIntegrityEvidence,
  argumentsValue: Record<string, unknown>,
): boolean {
  const expectedOutput = runSyntheticProgram(argumentsValue);

  return (
    evidence.profile === 'handoffprobe-mcp3354-binding-v1' &&
    evidence.circuitHash === sha256(PROGRAM_DESCRIPTION) &&
    evidence.inputCommitment === inputCommitment(argumentsValue) &&
    evidence.outputCommitment === sha256(canonicalizeFixtureSubset(expectedOutput)) &&
    evidence.nonce === FIXED_NONCE
  );
}

function operationForArguments(argumentsValue: Record<string, unknown>): string | undefined {
  const scope = argumentsValue.delegated_scope;

  if (scope === NARROW_SCOPE) {
    return NARROW_OPERATION;
  }

  if (scope === WIDENED_SCOPE) {
    return WIDENED_OPERATION;
  }

  return undefined;
}

function authorityDecisionFor(
  argumentsValue: Record<string, unknown>,
): P0SemanticAuthorityDecision {
  const translated = operationForArguments(argumentsValue);

  if (translated === undefined) {
    return evaluateP0SemanticAuthority({
      universe: OPERATIONS,
      upstreamAllowed: [NARROW_OPERATION],
      translatedAllowed: ['unknown:mcp3354-operation'],
    });
  }

  return evaluateP0SemanticAuthority({
    universe: OPERATIONS,
    upstreamAllowed: [NARROW_OPERATION],
    translatedAllowed: [translated],
  });
}

function createObservation(label: string): CrossingObservationState {
  const observation = createCrossingObservationState();

  recordA2aCrossingObservation(observation, {
    caller: CONTEXT.caller,
    messageId: `mcp3354-${label}-message`,
    taskId: `mcp3354-${label}-task`,
    contextId: 'mcp3354-shared-context',
    transportAuthenticated: true,
    taskServerResolved: true,
    contextServerResolved: true,
  });

  return observation;
}

function createLayeredGate(
  evidence: SyntheticExecutionIntegrityEvidence,
  state: LayerState,
): CrossingPreDispatchGate {
  return (observation) => {
    const observed = toExternalCrossingObservedShape(observation);

    const effectiveArguments = observed.arguments;

    if (effectiveArguments === null) {
      throw new Error('MCP #3354 effective arguments are unavailable at pre-dispatch.');
    }

    if (observed.arguments === undefined) {
      throw new Error('MCP #3354 effective arguments are unavailable at pre-dispatch.');
    }

    const proofAccepted = verifyExecutionIntegrity(evidence, effectiveArguments);

    state.proof = proofAccepted ? 'accept' : 'reject';

    if (!proofAccepted) {
      return {
        decision: {
          outcome: 'reject',
          reason: 'action_digest_mismatch',
        },
        observed,
        observationReady: true,
        provenanceReadiness: {
          complete: true,
          missing: [],
        },
      };
    }

    const authorityDecision = authorityDecisionFor(effectiveArguments);
    state.authorityDecision = authorityDecision;

    if (authorityDecision.status === 'error') {
      state.authority = 'error';

      throw new Error(
        `MCP #3354 semantic authority evaluation failed: ${authorityDecision.reason}`,
      );
    }

    state.authority = authorityDecision.status === 'pass' ? 'accept' : 'reject';

    return {
      decision:
        authorityDecision.status === 'pass'
          ? {
              outcome: 'succeed',
              reason: 'accepted',
            }
          : {
              outcome: 'reject',
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

describe('MCP #3354 execution-integrity / authority boundary', () => {
  it('binds valid execution-integrity evidence to the actual effective request', () => {
    const narrowEvidence = createExecutionIntegrityEvidence({
      ...AUTHORIZED_ARGUMENTS,
    });
    const widenedEvidence = createExecutionIntegrityEvidence({
      ...WIDENED_ARGUMENTS,
    });

    expect(
      verifyExecutionIntegrity(narrowEvidence, {
        ...AUTHORIZED_ARGUMENTS,
      }),
    ).toBe(true);

    expect(
      verifyExecutionIntegrity(widenedEvidence, {
        ...WIDENED_ARGUMENTS,
      }),
    ).toBe(true);

    expect(
      verifyExecutionIntegrity(narrowEvidence, {
        ...WIDENED_ARGUMENTS,
      }),
    ).toBe(false);

    expect(narrowEvidence.inputCommitment).not.toBe(widenedEvidence.inputCommitment);
  });

  it('allows the in-scope control when execution integrity and authority both accept', async () => {
    const effects = new CrossingEffectRecorder();
    const before = effects.snapshot();
    const recorder = new EvidenceRecorder('mcp3354-proof-authority-control', 'secure');
    const observation = createObservation('control');
    const state: LayerState = {
      proof: 'not_checked',
      authority: 'not_checked',
    };

    const evidence = createExecutionIntegrityEvidence({
      ...AUTHORIZED_ARGUMENTS,
    });

    const result = await callReadInvoiceThroughMcp(
      CONTEXT,
      recorder,
      observation,
      effects,
      createLayeredGate(evidence, state),
      undefined,
      {
        tool: 'payment.route',
        arguments: {
          ...AUTHORIZED_ARGUMENTS,
        },
      },
    );

    expect(state.proof).toBe('accept');
    expect(state.authority).toBe('accept');
    expect(state.authorityDecision?.status).toBe('pass');
    expect(state.authorityDecision?.wideningWitnesses).toEqual([]);

    expect(result.crossingVerification?.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });

    expect(effects.deltaSince(before)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });

    expect(recorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(1);

    expect(recorder.events.filter((event) => event.event === 'fake_tool.execute')).toHaveLength(1);
  });

  it('keeps proof acceptance separate from authority rejection and blocks the protected effect', async () => {
    const effects = new CrossingEffectRecorder();
    const before = effects.snapshot();
    const recorder = new EvidenceRecorder('mcp3354-proof-authority-widened', 'secure');
    const observation = createObservation('widened');
    const state: LayerState = {
      proof: 'not_checked',
      authority: 'not_checked',
    };

    const evidence = createExecutionIntegrityEvidence({
      ...WIDENED_ARGUMENTS,
    });

    await expect(
      callReadInvoiceThroughMcp(
        CONTEXT,
        recorder,
        observation,
        effects,
        createLayeredGate(evidence, state),
        undefined,
        {
          tool: 'payment.route',
          arguments: {
            ...WIDENED_ARGUMENTS,
          },
        },
      ),
    ).rejects.toMatchObject({
      name: 'CrossingPreDispatchRejectedError',
      verification: {
        decision: {
          outcome: 'reject',
          reason: 'action_digest_mismatch',
        },
      },
    });

    expect(state.proof).toBe('accept');
    expect(state.authority).toBe('reject');

    expect(state.authorityDecision?.status).toBe('fail');
    expect(state.authorityDecision?.upstreamAllowed).toEqual([NARROW_OPERATION]);
    expect(state.authorityDecision?.effectiveDownstreamAllowed).toEqual([WIDENED_OPERATION]);
    expect(state.authorityDecision?.wideningWitnesses).toEqual([WIDENED_OPERATION]);

    expect(effects.deltaSince(before)).toEqual({
      before: 0,
      after: 0,
      delta: 0,
    });

    expect(recorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(0);

    expect(recorder.events.filter((event) => event.event === 'fake_tool.execute')).toHaveLength(0);
  });
});
