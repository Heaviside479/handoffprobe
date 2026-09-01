import { cloneSecurityContext } from '../core/index.js';
import type { HandoffAdapter } from '../core/index.js';
import type { CrossingEffectRecorder } from '../phase9/crossing-corpus/effects.js';
import {
  CrossingPreDispatchRejectedError,
  type CrossingPreDispatchGate,
} from '../phase9/crossing-corpus/gate.js';
import {
  createCrossingObservationState,
  snapshotCrossingObservation,
} from '../phase9/crossing-corpus/observation.js';
import { executeA2aFixture } from './a2a/harness.js';
import { EvidenceRecorder } from './evidence.js';
import { ProtocolLabHandoffAdapter } from './handoff/adapter.js';
import type { FixtureMode, LabRunState, ProtocolLabResult, SecurityContext } from './models.js';

export const REFERENCE_CONTEXT: SecurityContext = {
  principal: 'user:alice',
  caller: 'agent:sales',
  downstream: 'agent:billing',
  tenant: 'tenant:acme',
  resource: 'invoice:INV-1001',
  capabilities: ['invoice.read'],
};

export interface ProtocolFixtureOptions {
  runId?: string;
  correlationId?: string;
  context?: SecurityContext;
  handoffAdapter?: HandoffAdapter;
  crossingObservation?: boolean;
  crossingEffectRecorder?: CrossingEffectRecorder;
  crossingPreDispatchGate?: CrossingPreDispatchGate;
  crossingCallerOverride?: string;
  crossingMessageIdOverride?: string;
}

function defaultRunId(fixture: FixtureMode): string {
  return fixture === 'secure' ? 'hp-lab-secure-001' : 'hp-lab-vulnerable-001';
}

export async function runProtocolFixture(
  fixture: FixtureMode,
  options: ProtocolFixtureOptions = {},
): Promise<ProtocolLabResult> {
  const runId = options.runId ?? defaultRunId(fixture);

  const correlationId = options.correlationId ?? runId;

  const context = cloneSecurityContext(options.context ?? REFERENCE_CONTEXT);

  const recorder = new EvidenceRecorder(runId, fixture, correlationId);

  const state: LabRunState = {};

  if (options.crossingObservation === true) {
    state.crossingObservation = createCrossingObservationState();
    state.crossingAuthorityObservation = createCrossingObservationState();
  }

  if (options.crossingCallerOverride !== undefined) {
    if (state.crossingObservation === undefined) {
      throw new Error('Crossing caller override requires crossing observation.');
    }

    state.crossingCallerOverride = options.crossingCallerOverride;
  }

  if (options.crossingMessageIdOverride !== undefined) {
    if (state.crossingObservation === undefined) {
      throw new Error('Crossing message ID override requires crossing observation.');
    }

    state.crossingMessageIdOverride = options.crossingMessageIdOverride;
  }

  if (options.crossingEffectRecorder !== undefined) {
    state.crossingEffectRecorder = options.crossingEffectRecorder;
  }

  if (options.crossingPreDispatchGate !== undefined) {
    const configuredGate = options.crossingPreDispatchGate;

    state.crossingPreDispatchGate = (observation, authorityObservation) => {
      const verification = configuredGate(observation, authorityObservation);
      state.crossingVerification = verification;
      return verification;
    };
  }

  const handoffAdapter = options.handoffAdapter ?? new ProtocolLabHandoffAdapter(fixture);

  let responseText: string;

  try {
    responseText = await executeA2aFixture({
      fixture,
      recorder,
      state,
      context,
      handoffAdapter,
    });
  } catch (error) {
    if (state.crossingVerification?.decision.outcome === 'reject') {
      throw new CrossingPreDispatchRejectedError(state.crossingVerification);
    }

    throw error;
  }

  const translatedContext = state.translatedContext;

  const toolResult = state.toolResult;

  if (translatedContext === undefined) {
    throw new Error('Fixture produced no translated context.');
  }

  if (toolResult === undefined) {
    throw new Error('Fixture produced no fake-tool result.');
  }

  if (state.mcpEra === 'modern') {
    const result: ProtocolLabResult = {
      runId,
      fixture,
      a2aProtocolVersion: '1.0',
      mcpProtocolVersion: '2026-07-28',
      mcpEra: state.mcpEra,
      originalContext: context,
      translatedContext,
      toolResult,
      responseText,
      evidence: recorder.events,
    };

    if (state.crossingObservation === undefined) {
      return result;
    }

    const crossingResult: ProtocolLabResult = {
      ...result,
      crossingObservation: snapshotCrossingObservation(state.crossingObservation),
    };

    if (state.crossingVerification === undefined) {
      return crossingResult;
    }

    return {
      ...crossingResult,
      crossingVerification: state.crossingVerification,
    };
  }

  throw new Error(`Fixture did not negotiate modern MCP era: ${String(state.mcpEra)}`);
}
