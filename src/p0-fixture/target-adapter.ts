import { cloneSecurityContext } from '../core/index.js';
import type {
  HandoffAdapter,
  TargetAdapter,
  TargetExecutionInput,
  TargetExecutionResult,
} from '../core/index.js';
import { EvidenceRecorder } from '../protocol-lab/evidence.js';
import { executeP0A2aFixture } from './a2a/harness.js';
import type { P0A2aRunState } from './a2a/executor.js';
import { P0IdentityHandoffAdapter } from './handoff/adapter.js';
import type { P0EnforcementMode, P0McpExecutionResult } from './mcp/types.js';
import type { P0FixtureMode, P0Scenario } from './scenario.js';
import { createP0FixtureState } from './state.js';

export interface P0TargetOutput {
  scenarioId: string;
  fixture: P0FixtureMode;
  enforcementMode: P0EnforcementMode;
  responseText: string;
  mcpResult: P0McpExecutionResult;
}

export class P0TargetAdapter implements TargetAdapter {
  readonly id: string;

  readonly enforcementMode: P0EnforcementMode;

  constructor(
    readonly fixture: P0FixtureMode,
    readonly scenario: P0Scenario,
    readonly handoffAdapter: HandoffAdapter = new P0IdentityHandoffAdapter(),
    enforcementMode?: P0EnforcementMode,
  ) {
    this.enforcementMode = enforcementMode ?? (fixture === 'secure' ? 'enforce' : 'bypass');

    this.id = ['p0', fixture, scenario.id, handoffAdapter.id, this.enforcementMode].join(':');
  }

  async execute(input: TargetExecutionInput): Promise<TargetExecutionResult> {
    if (input.signal.aborted) {
      throw new Error('P0 execution was aborted before start.');
    }

    const originalContext = cloneSecurityContext(input.context);

    const recorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

    const fixtureState = createP0FixtureState();

    const runState: P0A2aRunState = {};

    const responseText = await executeP0A2aFixture({
      recorder,
      state: runState,
      fixtureState,
      context: originalContext,
      handoffAdapter: this.handoffAdapter,
      scenario: this.scenario,
      enforcementMode: this.enforcementMode,
    });

    if (input.signal.aborted) {
      throw new Error('P0 execution was aborted.');
    }

    const translatedContext = runState.translatedContext;

    const mcpResult = runState.mcpResult;

    if (translatedContext === undefined) {
      throw new Error('P0 target produced no translated context.');
    }

    if (mcpResult === undefined) {
      throw new Error('P0 target produced no MCP result.');
    }

    const output: P0TargetOutput = {
      scenarioId: this.scenario.id,
      fixture: this.fixture,
      enforcementMode: this.enforcementMode,
      responseText,
      mcpResult,
    };

    return {
      originalContext,
      translatedContext: cloneSecurityContext(translatedContext),
      evidence: recorder.events,
      output,
    };
  }
}
