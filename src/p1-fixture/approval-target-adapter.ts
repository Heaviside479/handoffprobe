import { cloneSecurityContext } from '../core/index.js';

import type { TargetAdapter, TargetExecutionInput, TargetExecutionResult } from '../core/index.js';

import { executeP0A2aFixture } from '../p0-fixture/a2a/harness.js';

import type { P0A2aRunState } from '../p0-fixture/a2a/executor.js';

import { P0IdentityHandoffAdapter } from '../p0-fixture/handoff/adapter.js';

import type { P0Scenario, SyntheticInvoice } from '../p0-fixture/index.js';

import { EvidenceRecorder } from '../protocol-lab/evidence.js';

import { createP1FixtureState } from './state.js';

import type { P1FixtureMode } from './target-adapter.js';

export interface P1ApprovalBinding {
  approvalId: string;

  approvedTool: string;

  approvedResource: string;

  approvedPayloadHash: string;
}

export interface P1ApprovalDecision {
  allowed: boolean;

  reasons: string[];

  contextApprovalMatches: boolean;

  toolMatches: boolean;

  resourceMatches: boolean;
}

export interface P1ApprovalScenario {
  id: string;

  approval: P1ApprovalBinding;

  executedTool: string;

  executedResource: string;

  p0Scenario: P0Scenario;

  seedInvoices?: readonly SyntheticInvoice[];
}

export interface P1ApprovalTargetOutput {
  scenarioId: string;

  fixture: P1FixtureMode;

  decision: P1ApprovalDecision;

  executed: boolean;

  approvedTool: string;

  executedTool: string;

  approvedResource: string;

  executedResource: string;

  approvedPayloadHash: string;

  sideEffectCounterBefore: number;

  sideEffectCounterAfter: number;

  resourceVersionBefore: number | null;

  resourceVersionAfter: number | null;
}

function evaluateApproval(
  scenario: P1ApprovalScenario,
  context: ReturnType<typeof cloneSecurityContext>,
): P1ApprovalDecision {
  const contextApproval = context.approval;

  const contextApprovalMatches =
    contextApproval?.approvalId === scenario.approval.approvalId &&
    contextApproval.tool === scenario.approval.approvedTool &&
    contextApproval.payloadHash === scenario.approval.approvedPayloadHash;

  const toolMatches = scenario.approval.approvedTool === scenario.executedTool;

  const resourceMatches = scenario.approval.approvedResource === scenario.executedResource;

  const reasons: string[] = [];

  if (!contextApprovalMatches) {
    reasons.push('approval_context_mismatch');
  }

  if (!toolMatches) {
    reasons.push('approval_tool_mismatch');
  }

  if (!resourceMatches) {
    reasons.push('approval_resource_mismatch');
  }

  return {
    allowed: reasons.length === 0,

    reasons,

    contextApprovalMatches,

    toolMatches,

    resourceMatches,
  };
}

export class P1ApprovalTargetAdapter implements TargetAdapter {
  readonly id: string;

  constructor(
    readonly fixture: P1FixtureMode,

    readonly scenario: P1ApprovalScenario,
  ) {
    this.id = ['p1', fixture, scenario.id].join(':');
  }

  async execute(input: TargetExecutionInput): Promise<TargetExecutionResult> {
    if (input.signal.aborted) {
      throw new Error('P1 approval execution was aborted before start.');
    }

    const originalContext = cloneSecurityContext(input.context);

    const translatedContext = cloneSecurityContext(input.context);

    const recorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

    const state = createP1FixtureState();

    for (const invoice of this.scenario.seedInvoices ?? []) {
      state.invoices[invoice.resource] = {
        ...invoice,
      };
    }

    const before = state.sideEffectCounter;

    const resourceVersionBefore = state.invoices[this.scenario.executedResource]?.version ?? null;

    const decision = evaluateApproval(this.scenario, translatedContext);

    recorder.record({
      protocol: 'HANDOFF',

      protocolVersion: 'handoffprobe-p1-v1',

      boundary: 'a2a-approval -> handoff-approval-policy',

      event: 'p1.approval.binding',

      context: translatedContext,

      details: {
        scenarioId: this.scenario.id,

        approvalId: this.scenario.approval.approvalId,

        approvedTool: this.scenario.approval.approvedTool,

        executedTool: this.scenario.executedTool,

        approvedResource: this.scenario.approval.approvedResource,

        executedResource: this.scenario.executedResource,

        approvedPayloadHash: this.scenario.approval.approvedPayloadHash,

        contextApprovalMatches: decision.contextApprovalMatches,

        toolMatches: decision.toolMatches,

        resourceMatches: decision.resourceMatches,

        allowed: decision.allowed,

        reasons: decision.reasons,
      },
    });

    if (!decision.allowed && this.fixture === 'secure') {
      recorder.record({
        protocol: 'HANDOFF',

        protocolVersion: 'handoffprobe-p1-v1',

        boundary: 'handoff-approval-policy -> mcp',

        event: 'p1.approval.blocked',

        context: translatedContext,

        details: {
          approvalId: this.scenario.approval.approvalId,

          reasons: decision.reasons,

          sideEffectCounterBefore: before,

          sideEffectCounterAfter: state.sideEffectCounter,
        },
      });

      return {
        originalContext,

        translatedContext,

        evidence: recorder.events,

        output: {
          scenarioId: this.scenario.id,

          fixture: this.fixture,

          decision,

          executed: false,

          approvedTool: this.scenario.approval.approvedTool,

          executedTool: this.scenario.executedTool,

          approvedResource: this.scenario.approval.approvedResource,

          executedResource: this.scenario.executedResource,

          approvedPayloadHash: this.scenario.approval.approvedPayloadHash,

          sideEffectCounterBefore: before,

          sideEffectCounterAfter: state.sideEffectCounter,

          resourceVersionBefore,

          resourceVersionAfter: state.invoices[this.scenario.executedResource]?.version ?? null,
        } satisfies P1ApprovalTargetOutput,
      };
    }

    if (!decision.allowed) {
      recorder.record({
        protocol: 'HANDOFF',

        protocolVersion: 'handoffprobe-p1-v1',

        boundary: 'handoff-approval-policy -> mcp',

        event: 'p1.approval.bypassed',

        context: translatedContext,

        details: {
          approvalId: this.scenario.approval.approvalId,

          reasons: decision.reasons,
        },
      });
    }

    const runState: P0A2aRunState = {};

    await executeP0A2aFixture({
      recorder,

      state: runState,

      fixtureState: state,

      context: translatedContext,

      handoffAdapter: new P0IdentityHandoffAdapter(),

      scenario: this.scenario.p0Scenario,

      /*
       * P0 remains secure.
       * Only the P1 approval-policy
       * bypass is intentionally
       * vulnerable here.
       */
      enforcementMode: 'enforce',
    });

    const mcpResult = runState.mcpResult;

    if (mcpResult === undefined) {
      throw new Error('P1 approval execution produced no MCP result.');
    }

    const executed = mcpResult.envelope.authorization.executed;

    const resourceVersionAfter = state.invoices[this.scenario.executedResource]?.version ?? null;

    if (input.signal.aborted) {
      throw new Error('P1 approval execution was aborted.');
    }

    return {
      originalContext,

      translatedContext: cloneSecurityContext(runState.translatedContext ?? translatedContext),

      evidence: recorder.events,

      output: {
        scenarioId: this.scenario.id,

        fixture: this.fixture,

        decision,

        executed,

        approvedTool: this.scenario.approval.approvedTool,

        executedTool: this.scenario.executedTool,

        approvedResource: this.scenario.approval.approvedResource,

        executedResource: this.scenario.executedResource,

        approvedPayloadHash: this.scenario.approval.approvedPayloadHash,

        sideEffectCounterBefore: before,

        sideEffectCounterAfter: state.sideEffectCounter,

        resourceVersionBefore,

        resourceVersionAfter,
      } satisfies P1ApprovalTargetOutput,
    };
  }
}
