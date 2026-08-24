import type {
  HandoffAdapter,
  TargetAdapter,
  TargetExecutionInput,
  TargetExecutionResult,
} from '../core/index.js';
import { runProtocolFixture } from './fixture.js';
import { ProtocolLabHandoffAdapter } from './handoff/adapter.js';
import type { FixtureMode } from './models.js';

export class ProtocolLabTargetAdapter implements TargetAdapter {
  readonly id: string;

  constructor(
    readonly fixture: FixtureMode,
    readonly handoffAdapter: HandoffAdapter = new ProtocolLabHandoffAdapter(fixture),
  ) {
    this.id = `protocol-lab:${fixture}`;
  }

  async execute(input: TargetExecutionInput): Promise<TargetExecutionResult> {
    if (input.signal.aborted) {
      throw new Error('Protocol lab execution was aborted before start.');
    }

    const result = await runProtocolFixture(this.fixture, {
      runId: input.runId,
      correlationId: input.correlationId,
      context: input.context,
      handoffAdapter: this.handoffAdapter,
    });

    if (input.signal.aborted) {
      throw new Error('Protocol lab execution was aborted.');
    }

    return {
      originalContext: result.originalContext,
      translatedContext: result.translatedContext,
      evidence: result.evidence,
      output: result,
    };
  }
}
