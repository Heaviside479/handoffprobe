import type { SourceReference } from './provenance.js';
import type { SecurityContext } from './security-context.js';

export type EvidenceProtocol = 'A2A' | 'HANDOFF' | 'MCP' | 'TOOL' | 'CORE';

export interface EvidenceEvent {
  runId: string;
  correlationId: string;
  testId?: `HP-${string}`;
  sequence: number;
  fixture?: string;
  protocol: EvidenceProtocol;
  protocolVersion: string;
  boundary: string;
  event: string;
  context: SecurityContext;
  details: Record<string, unknown>;
  provenance: SourceReference[];
}
