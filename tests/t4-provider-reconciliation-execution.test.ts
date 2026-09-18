import { describe, expect, it } from 'vitest';

import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
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

const ACTION_ID = 'action:T4-RECON-1001';
const ATTEMPT_ID = 'attempt:T4-ATT-1';

type CallerOutcome = 'unknown' | 'confirmed_success';
type ResearchOutcome = 'PASS' | 'FAIL' | 'INCONCLUSIVE' | 'ERROR';

type LookupMode = 'exact' | 'missing' | 'action_mismatch' | 'attempt_mismatch' | 'error';

interface CallerState {
  readonly actionId: string;
  readonly attemptId: string;
  outcome: CallerOutcome;
}

interface ProviderExecutionEvidence {
  readonly actionId: string;
  readonly attemptId: string;
  readonly executed: true;
  readonly effectDelta: number;
  readonly mcpToolCallDelta: number;
  readonly fakeToolExecuteDelta: number;
}

interface ReconciliationResult {
  readonly researchOutcome: ResearchOutcome;
  readonly callerOutcome: CallerOutcome;
  readonly reason:
    | 'original_attempt_confirmed'
    | 'execution_evidence_missing'
    | 'action_identity_mismatch'
    | 'attempt_identity_mismatch'
    | 'execution_evidence_incomplete'
    | 'provider_lookup_error';
  readonly effectDeltaDuringLookup: number;
}

class LocalReconciliationProvider {
  readonly effects = new CrossingEffectRecorder();
  readonly recorder: EvidenceRecorder;

  private readonly records = new Map<string, ProviderExecutionEvidence>();

  lookupCount = 0;

  constructor(runId: string) {
    this.recorder = new EvidenceRecorder(runId, 'secure');
  }

  async executeOriginal(actionId: string, attemptId: string): Promise<void> {
    if (this.records.has(attemptId)) {
      throw new Error('T-4.3 original attempt already exists.');
    }

    const effectBefore = this.effects.snapshot();
    const toolCallsBefore = this.recorder.events.filter(
      (event) => event.event === 'mcp.tool.call',
    ).length;
    const fakeExecutionsBefore = this.recorder.events.filter(
      (event) => event.event === 'fake_tool.execute',
    ).length;

    await callReadInvoiceThroughMcp(CONTEXT, this.recorder, undefined, this.effects);

    const effectDelta = this.effects.deltaSince(effectBefore);
    const toolCallsAfter = this.recorder.events.filter(
      (event) => event.event === 'mcp.tool.call',
    ).length;
    const fakeExecutionsAfter = this.recorder.events.filter(
      (event) => event.event === 'fake_tool.execute',
    ).length;

    const evidence: ProviderExecutionEvidence = {
      actionId,
      attemptId,
      executed: true,
      effectDelta: effectDelta.delta,
      mcpToolCallDelta: toolCallsAfter - toolCallsBefore,
      fakeToolExecuteDelta: fakeExecutionsAfter - fakeExecutionsBefore,
    };

    if (
      evidence.effectDelta !== 1 ||
      evidence.mcpToolCallDelta !== 1 ||
      evidence.fakeToolExecuteDelta !== 1
    ) {
      throw new Error('T-4.3 original attempt did not produce exactly one protected effect.');
    }

    this.records.set(attemptId, evidence);
  }

  lookupOriginalAttempt(
    attemptId: string,
    mode: LookupMode = 'exact',
  ): ProviderExecutionEvidence | undefined {
    this.lookupCount += 1;

    if (mode === 'error') {
      throw new Error('Synthetic provider lookup failure.');
    }

    if (mode === 'missing') {
      return undefined;
    }

    const evidence = this.records.get(attemptId);

    if (evidence === undefined) {
      return undefined;
    }

    if (mode === 'action_mismatch') {
      return {
        ...evidence,
        actionId: 'action:T4-OTHER',
      };
    }

    if (mode === 'attempt_mismatch') {
      return {
        ...evidence,
        attemptId: 'attempt:T4-OTHER',
      };
    }

    return {
      ...evidence,
    };
  }
}

async function executeWithLostResponse(
  provider: LocalReconciliationProvider,
  actionId: string,
  attemptId: string,
): Promise<CallerState> {
  await provider.executeOriginal(actionId, attemptId);

  return {
    actionId,
    attemptId,
    outcome: 'unknown',
  };
}

function blockBlindFreshPermitRetry(
  caller: CallerState,
  provider: LocalReconciliationProvider,
): {
  readonly blocked: boolean;
  readonly effectDelta: number;
} {
  const before = provider.effects.snapshot();

  const blocked = caller.outcome === 'unknown';

  return {
    blocked,
    effectDelta: provider.effects.deltaSince(before).delta,
  };
}

function reconcileOriginalAttempt(
  caller: CallerState,
  provider: LocalReconciliationProvider,
  mode: LookupMode = 'exact',
): ReconciliationResult {
  const before = provider.effects.snapshot();

  try {
    const evidence = provider.lookupOriginalAttempt(caller.attemptId, mode);

    if (evidence === undefined) {
      return {
        researchOutcome: 'INCONCLUSIVE',
        callerOutcome: caller.outcome,
        reason: 'execution_evidence_missing',
        effectDeltaDuringLookup: provider.effects.deltaSince(before).delta,
      };
    }

    if (evidence.actionId !== caller.actionId) {
      return {
        researchOutcome: 'INCONCLUSIVE',
        callerOutcome: caller.outcome,
        reason: 'action_identity_mismatch',
        effectDeltaDuringLookup: provider.effects.deltaSince(before).delta,
      };
    }

    if (evidence.attemptId !== caller.attemptId) {
      return {
        researchOutcome: 'INCONCLUSIVE',
        callerOutcome: caller.outcome,
        reason: 'attempt_identity_mismatch',
        effectDeltaDuringLookup: provider.effects.deltaSince(before).delta,
      };
    }

    if (
      evidence.effectDelta !== 1 ||
      evidence.mcpToolCallDelta !== 1 ||
      evidence.fakeToolExecuteDelta !== 1
    ) {
      return {
        researchOutcome: 'INCONCLUSIVE',
        callerOutcome: caller.outcome,
        reason: 'execution_evidence_incomplete',
        effectDeltaDuringLookup: provider.effects.deltaSince(before).delta,
      };
    }

    caller.outcome = 'confirmed_success';

    return {
      researchOutcome: 'PASS',
      callerOutcome: caller.outcome,
      reason: 'original_attempt_confirmed',
      effectDeltaDuringLookup: provider.effects.deltaSince(before).delta,
    };
  } catch {
    return {
      researchOutcome: 'ERROR',
      callerOutcome: caller.outcome,
      reason: 'provider_lookup_error',
      effectDeltaDuringLookup: provider.effects.deltaSince(before).delta,
    };
  }
}

async function runCleanScenario() {
  const provider = new LocalReconciliationProvider('t4-3-deterministic');
  const caller = await executeWithLostResponse(provider, ACTION_ID, ATTEMPT_ID);

  const beforeReconciliation = caller.outcome;
  const retry = blockBlindFreshPermitRetry(caller, provider);
  const reconciliation = reconcileOriginalAttempt(caller, provider);

  return {
    beforeReconciliation,
    retry,
    reconciliation,
    effectCount: provider.effects.count,
    lookupCount: provider.lookupCount,
    events: provider.recorder.events.map((event) => event.event),
  };
}

describe('T-4.3 provider-side original-attempt reconciliation', () => {
  it('preserves unknown caller outcome after response loss despite one completed effect', async () => {
    const provider = new LocalReconciliationProvider('t4-3-response-loss');
    const caller = await executeWithLostResponse(provider, ACTION_ID, ATTEMPT_ID);

    expect(caller.outcome).toBe('unknown');
    expect(provider.effects.count).toBe(1);
    expect(provider.lookupCount).toBe(0);

    expect(
      provider.recorder.events.filter((event) => event.event === 'mcp.tool.call'),
    ).toHaveLength(1);
    expect(
      provider.recorder.events.filter((event) => event.event === 'fake_tool.execute'),
    ).toHaveLength(1);
  });

  it('blocks a blind fresh-permit retry while the original outcome is unknown', async () => {
    const provider = new LocalReconciliationProvider('t4-3-retry-block');
    const caller = await executeWithLostResponse(provider, ACTION_ID, ATTEMPT_ID);

    const retry = blockBlindFreshPermitRetry(caller, provider);

    expect(retry).toEqual({
      blocked: true,
      effectDelta: 0,
    });
    expect(provider.effects.count).toBe(1);
  });

  it('resolves the same original attempt through a read-only provider lookup', async () => {
    const provider = new LocalReconciliationProvider('t4-3-reconcile-pass');
    const caller = await executeWithLostResponse(provider, ACTION_ID, ATTEMPT_ID);

    const result = reconcileOriginalAttempt(caller, provider);

    expect(result).toEqual({
      researchOutcome: 'PASS',
      callerOutcome: 'confirmed_success',
      reason: 'original_attempt_confirmed',
      effectDeltaDuringLookup: 0,
    });
    expect(provider.lookupCount).toBe(1);
    expect(provider.effects.count).toBe(1);
  });

  it.each([
    ['action_mismatch', 'action_identity_mismatch'],
    ['attempt_mismatch', 'attempt_identity_mismatch'],
  ] as const)('keeps the caller unknown for %s provider evidence', async (mode, reason) => {
    const provider = new LocalReconciliationProvider('t4-3-identity-mismatch');
    const caller = await executeWithLostResponse(provider, ACTION_ID, ATTEMPT_ID);

    const result = reconcileOriginalAttempt(caller, provider, mode);

    expect(result.researchOutcome).toBe('INCONCLUSIVE');
    expect(result.researchOutcome).not.toBe('FAIL');
    expect(result.callerOutcome).toBe('unknown');
    expect(result.reason).toBe(reason);
    expect(result.effectDeltaDuringLookup).toBe(0);
    expect(provider.effects.count).toBe(1);
  });

  it('preserves INCONCLUSIVE when provider execution evidence is missing', async () => {
    const provider = new LocalReconciliationProvider('t4-3-missing');
    const caller = await executeWithLostResponse(provider, ACTION_ID, ATTEMPT_ID);

    const result = reconcileOriginalAttempt(caller, provider, 'missing');

    expect(result.researchOutcome).toBe('INCONCLUSIVE');
    expect(result.researchOutcome).not.toBe('FAIL');
    expect(result.callerOutcome).toBe('unknown');
    expect(result.reason).toBe('execution_evidence_missing');
    expect(result.effectDeltaDuringLookup).toBe(0);
    expect(provider.effects.count).toBe(1);
  });

  it('preserves ERROR when the provider lookup itself fails', async () => {
    const provider = new LocalReconciliationProvider('t4-3-error');
    const caller = await executeWithLostResponse(provider, ACTION_ID, ATTEMPT_ID);

    const result = reconcileOriginalAttempt(caller, provider, 'error');

    expect(result.researchOutcome).toBe('ERROR');
    expect(result.researchOutcome).not.toBe('FAIL');
    expect(result.callerOutcome).toBe('unknown');
    expect(result.reason).toBe('provider_lookup_error');
    expect(result.effectDeltaDuringLookup).toBe(0);
    expect(provider.effects.count).toBe(1);
  });

  it('reproduces the clean reconciliation evidence deterministically', async () => {
    const first = await runCleanScenario();
    const second = await runCleanScenario();

    expect(first).toEqual(second);
    expect(first.beforeReconciliation).toBe('unknown');
    expect(first.effectCount).toBe(1);
    expect(first.lookupCount).toBe(1);
  });
});
