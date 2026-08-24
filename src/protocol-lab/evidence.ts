import { cloneSecurityContext, redactRecord } from '../core/index.js';
import type { EvidenceEvent, FixtureMode, SecurityContext } from './models.js';

export class EvidenceRecorder {
  readonly events: EvidenceEvent[] = [];

  readonly correlationId: string;

  constructor(
    readonly runId: string,
    readonly fixture: FixtureMode,
    correlationId?: string,
  ) {
    this.correlationId = correlationId ?? runId;
  }

  record(input: {
    protocol: EvidenceEvent['protocol'];
    protocolVersion: string;
    boundary: string;
    event: string;
    context: SecurityContext;
    details?: Record<string, unknown>;
  }): void {
    this.events.push({
      runId: this.runId,
      correlationId: this.correlationId,
      sequence: this.events.length + 1,
      fixture: this.fixture,
      protocol: input.protocol,
      protocolVersion: input.protocolVersion,
      boundary: input.boundary,
      event: input.event,
      context: cloneSecurityContext(input.context),
      details: redactRecord(input.details ?? {}),
      provenance: [],
    });
  }
}
