import type { EvidenceEvent, SecurityContext } from '../core/index.js';
import type { BoundCrossingVerificationResult } from '../phase9/crossing-corpus/binding.js';
import type { CrossingEffectRecorder } from '../phase9/crossing-corpus/effects.js';
import type { CrossingPreDispatchGate } from '../phase9/crossing-corpus/gate.js';
import type { CrossingObservationState } from '../phase9/crossing-corpus/observation.js';

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
  crossingObservation?: CrossingObservationState;
  crossingAuthorityObservation?: CrossingObservationState;
  crossingEffectRecorder?: CrossingEffectRecorder;
  crossingPreDispatchGate?: CrossingPreDispatchGate;
  crossingVerification?: BoundCrossingVerificationResult;
  crossingCallerOverride?: string;
  a2aAuthorityCaller?: string;
  a2aRequestIdentity?: {
    taskIdSuppliedByClient: boolean;
    contextIdSuppliedByClient: boolean;
  };
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
  crossingObservation?: CrossingObservationState;
  crossingVerification?: BoundCrossingVerificationResult;
}
