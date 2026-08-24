export type FixtureMode = 'secure' | 'vulnerable';

export interface SecurityContext {
  principal: string;
  caller: string;
  downstream: string;
  tenant: string;
  resource: string;
  capabilities: string[];
}

export interface FakeInvoiceResult {
  invoiceId: string;
  tenant: string;
  principalObserved: string;
  callerObserved: string;
  downstreamObserved: string;
  capabilityObserved: string;
  amountCents: number;
  currency: string;
}

export interface LabRunState {
  translatedContext?: SecurityContext;
  toolResult?: FakeInvoiceResult;
  mcpEra?: string;
}

export interface ProtocolLabResult {
  runId: string;
  fixture: FixtureMode;
  a2aProtocolVersion: '1.0';
  mcpProtocolVersion: '2026-07-28';
  mcpEra: 'modern';
  originalContext: SecurityContext;
  translatedContext: SecurityContext;
  toolResult: FakeInvoiceResult;
  responseText: string;
  evidence: EvidenceEvent[];
}

export interface EvidenceEvent {
  runId: string;
  sequence: number;
  fixture: FixtureMode;
  protocol: 'A2A' | 'HANDOFF' | 'MCP' | 'TOOL';
  protocolVersion: string;
  boundary: string;
  event: string;
  context: SecurityContext;
  details: Record<string, unknown>;
}
