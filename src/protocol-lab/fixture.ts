import { cloneSecurityContext } from '../core/index.js';
import type { HandoffAdapter } from '../core/index.js';
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

  const handoffAdapter = options.handoffAdapter ?? new ProtocolLabHandoffAdapter(fixture);

  const responseText = await executeA2aFixture({
    fixture,
    recorder,
    state,
    context,
    handoffAdapter,
  });

  const translatedContext = state.translatedContext;

  const toolResult = state.toolResult;

  if (translatedContext === undefined) {
    throw new Error('Fixture produced no translated context.');
  }

  if (toolResult === undefined) {
    throw new Error('Fixture produced no fake-tool result.');
  }

  if (state.mcpEra === 'modern') {
    return {
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
  }

  throw new Error(`Fixture did not negotiate modern MCP era: ${String(state.mcpEra)}`);
}
