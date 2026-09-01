import { describe, expect, it } from 'vitest';

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
import { runProtocolFixture } from '../src/protocol-lab/fixture.js';
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

function createObservation() {
  const observation = createCrossingObservationState();

  recordA2aCrossingObservation(observation, {
    caller: CONTEXT.caller,
    messageId: 'message-gate-001',
    taskId: 'task-gate-001',
    contextId: 'context-gate-001',
    transportAuthenticated: true,
    taskServerResolved: true,
    contextServerResolved: true,
  });

  return observation;
}

function decisionGate(outcome: 'succeed' | 'reject'): CrossingPreDispatchGate {
  return (observation) => ({
    decision:
      outcome === 'succeed'
        ? {
            outcome: 'succeed',
            reason: 'accepted',
          }
        : {
            outcome: 'reject',
            reason: 'caller_mismatch',
          },
    observed: toExternalCrossingObservedShape(observation),
    observationReady: true,
    provenanceReadiness: {
      complete: true,
      missing: [],
    },
  });
}

describe('Phase 9 crossing pre-dispatch gate', () => {
  it('passes an accepted gate through the full fixture and observes one fake-tool effect', async () => {
    const effects = new CrossingEffectRecorder();
    const before = effects.snapshot();

    const result = await runProtocolFixture('secure', {
      runId: 'hp-gate-accepted-001',
      crossingObservation: true,
      crossingEffectRecorder: effects,
      crossingPreDispatchGate: decisionGate('succeed'),
    });

    expect(result.crossingVerification?.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });
    expect(effects.deltaSince(before)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });
    expect(result.evidence.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(1);
    expect(result.evidence.filter((event) => event.event === 'fake_tool.execute')).toHaveLength(1);
  });

  it('blocks a rejected bound decision before the fake tool effect', async () => {
    const effects = new CrossingEffectRecorder();
    const before = effects.snapshot();
    const observation = createObservation();
    const recorder = new EvidenceRecorder('hp-gate-rejected-001', 'secure', 'hp-gate-rejected-001');

    await expect(
      callReadInvoiceThroughMcp(CONTEXT, recorder, observation, effects, decisionGate('reject')),
    ).rejects.toMatchObject({
      name: 'CrossingPreDispatchRejectedError',
      verification: {
        decision: {
          outcome: 'reject',
          reason: 'caller_mismatch',
        },
      },
    });

    expect(effects.deltaSince(before)).toEqual({
      before: 0,
      after: 0,
      delta: 0,
    });
    expect(recorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(0);
    expect(recorder.events.filter((event) => event.event === 'fake_tool.execute')).toHaveLength(0);
    expect(observation.mcpAudience.value).toBe('http://handoffprobe.local/mcp');
    expect(observation.action.tool).toBe('read_invoice');
  });

  it('keeps the pre-mutation caller basis separate from a runtime caller override', async () => {
    const effects = new CrossingEffectRecorder();
    const before = effects.snapshot();
    let authorityCaller: string | null | undefined;

    const gate: CrossingPreDispatchGate = (observation, authorityObservation) => {
      expect(authorityObservation).toBeDefined();

      authorityCaller = authorityObservation?.caller.value;

      expect(observation.caller.value).toBe('agent-c');
      expect(observation.caller.transportAuthenticated).toBe(true);

      return decisionGate('succeed')(observation);
    };

    const result = await runProtocolFixture('secure', {
      runId: 'hp-caller-runtime-seam-001',
      crossingObservation: true,
      crossingEffectRecorder: effects,
      crossingCallerOverride: 'agent-c',
      crossingPreDispatchGate: gate,
    });

    expect(authorityCaller).toBe(CONTEXT.caller);
    expect(result.crossingObservation?.caller.value).toBe('agent-c');
    expect(result.crossingObservation?.caller.transportAuthenticated).toBe(true);
    expect(effects.deltaSince(before)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });
  });

  it('keeps the pre-mutation message basis separate from a runtime message override', async () => {
    const effects = new CrossingEffectRecorder();
    const before = effects.snapshot();

    let authorityMessageId: string | null | undefined;

    const gate: CrossingPreDispatchGate = (observation, authorityObservation) => {
      expect(authorityObservation).toBeDefined();

      authorityMessageId = authorityObservation?.messageId.value;

      expect(observation.messageId.value).toBe('message-999');
      expect(observation.messageId.value).not.toBe(authorityObservation?.messageId.value);

      return decisionGate('succeed')(observation);
    };

    const result = await runProtocolFixture('secure', {
      runId: 'hp-message-runtime-seam-001',
      crossingObservation: true,
      crossingEffectRecorder: effects,
      crossingMessageIdOverride: 'message-999',
      crossingPreDispatchGate: gate,
    });

    expect(authorityMessageId).toBe('hp-message-runtime-seam-001-request');
    expect(result.crossingObservation?.messageId.value).toBe('message-999');

    expect(effects.deltaSince(before)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });
  });

  it('uses a typed rejection error that preserves the verification result', () => {
    const observation = createObservation();
    const verification = decisionGate('reject')(observation);
    const error = new CrossingPreDispatchRejectedError(verification);

    expect(error.name).toBe('CrossingPreDispatchRejectedError');
    expect(error.verification).toBe(verification);
    expect(error.message).toBe('Crossing pre-dispatch gate rejected: caller_mismatch');
  });
});
