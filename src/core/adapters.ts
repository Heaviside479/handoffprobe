import type { EvidenceEvent } from './evidence.js';
import type { SecurityContext } from './security-context.js';

export interface TargetExecutionInput {
  runId: string;
  correlationId: string;
  context: SecurityContext;
  signal: AbortSignal;
}

export interface TargetExecutionResult {
  originalContext: SecurityContext;
  translatedContext: SecurityContext;
  evidence: readonly EvidenceEvent[];
  output: unknown;
}

export interface TargetAdapter {
  readonly id: string;

  execute(input: TargetExecutionInput): Promise<TargetExecutionResult>;
}

export interface HandoffAdapter {
  readonly id: string;

  translate(context: SecurityContext): SecurityContext | Promise<SecurityContext>;
}
