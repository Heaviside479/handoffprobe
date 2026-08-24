import type { EvidenceEvent, FixtureMode, SecurityContext } from './models.js';

function cloneContext(context: SecurityContext): SecurityContext {
  return {
    ...context,
    capabilities: [...context.capabilities],
  };
}

export class EvidenceRecorder {
  readonly events: EvidenceEvent[] = [];

  constructor(
    readonly runId: string,
    readonly fixture: FixtureMode,
  ) {}

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
      sequence: this.events.length + 1,
      fixture: this.fixture,
      protocol: input.protocol,
      protocolVersion: input.protocolVersion,
      boundary: input.boundary,
      event: input.event,
      context: cloneContext(input.context),
      details: input.details ?? {},
    });
  }
}
