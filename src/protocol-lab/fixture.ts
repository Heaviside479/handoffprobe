import { EvidenceRecorder } from './evidence.js';
import { executeA2aFixture } from './a2a/harness.js';
import type { FixtureMode, LabRunState, ProtocolLabResult, SecurityContext } from './models.js';

export const REFERENCE_CONTEXT: SecurityContext = {
  principal: 'user:alice',
  caller: 'agent:sales',
  downstream: 'agent:billing',
  tenant: 'tenant:acme',
  resource: 'invoice:INV-1001',
  capabilities: ['invoice.read'],
};

function cloneReferenceContext(): SecurityContext {
  return {
    ...REFERENCE_CONTEXT,
    capabilities: [...REFERENCE_CONTEXT.capabilities],
  };
}

export async function runProtocolFixture(fixture: FixtureMode): Promise<ProtocolLabResult> {
  const runId = fixture === 'secure' ? 'hp-lab-secure-001' : 'hp-lab-vulnerable-001';

  const context = cloneReferenceContext();

  const recorder = new EvidenceRecorder(runId, fixture);

  const state: LabRunState = {};

  const responseText = await executeA2aFixture({
    fixture,
    recorder,
    state,
    context,
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
