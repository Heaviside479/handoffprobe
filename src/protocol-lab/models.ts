import type { EvidenceEvent, SecurityContext } from '../core/index.js';

export type { EvidenceEvent, SecurityContext } from '../core/index.js';

export type FixtureMode = 'secure' | 'vulnerable';

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
