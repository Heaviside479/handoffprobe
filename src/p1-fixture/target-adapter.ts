import { cloneSecurityContext } from '../core/index.js';

import type { TargetAdapter, TargetExecutionInput, TargetExecutionResult } from '../core/index.js';

import { P0TargetAdapter } from '../p0-fixture/index.js';

import type { P0Scenario, P0TargetOutput } from '../p0-fixture/index.js';

import { EvidenceRecorder } from '../protocol-lab/evidence.js';

import { createP1FixtureState, evaluateP1Delegation, registerP1Delegation } from './state.js';

import type { P1DelegationDecision, P1DelegationRecord, P1DelegationRequest } from './state.js';

export type P1FixtureMode = 'secure' | 'vulnerable';

export interface P1AuthorizationScenario {
  id: string;

  delegation: P1DelegationRecord;

  request: P1DelegationRequest;

  logicalTime: number;

  p0Scenario: P0Scenario;
}

export interface P1AuthorizationTargetOutput {
  scenarioId: string;

  fixture: P1FixtureMode;

  delegationId: string;

  logicalTime: number;

  decision: P1DelegationDecision;

  executed: boolean;

  sideEffectCounterBefore: number;

  sideEffectCounterAfter: number;

  p0Output?: P0TargetOutput;
}

export class P1AuthorizationTargetAdapter implements TargetAdapter {
  readonly id: string;

  constructor(
    readonly fixture: P1FixtureMode,
    readonly scenario: P1AuthorizationScenario,
  ) {
    this.id = ['p1', fixture, scenario.id].join(':');
  }

  async execute(input: TargetExecutionInput): Promise<TargetExecutionResult> {
    if (input.signal.aborted) {
      throw new Error('P1 execution was aborted before start.');
    }

    const originalContext = cloneSecurityContext(input.context);

    const translatedContext = cloneSecurityContext(input.context);

    const recorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

    const state = createP1FixtureState();

    registerP1Delegation(state, this.scenario.delegation);

    const decision = evaluateP1Delegation(
      state,
      this.scenario.delegation.id,
      this.scenario.logicalTime,
      this.scenario.request,
    );

    recorder.record({
      protocol: 'HANDOFF',

      protocolVersion: 'handoffprobe-p1-v1',

      boundary: 'a2a-delegation -> handoff-authorization',

      event: 'p1.authorization',

      context: translatedContext,

      details: {
        scenarioId: this.scenario.id,

        delegationId: this.scenario.delegation.id,

        logicalTime: this.scenario.logicalTime,

        issuedAt: this.scenario.delegation.issuedAt,

        expiresAt: this.scenario.delegation.expiresAt,

        delegationChain: this.scenario.delegation.chain,

        requiredChain: this.scenario.request.requiredChain,

        taskId: this.scenario.request.taskId,

        runId: this.scenario.request.runId,

        allowed: decision.allowed,

        reasons: decision.reasons,

        expired: decision.expired,

        chainMatches: decision.chainMatches,
      },
    });

    /*
     * Secure fixture:
     * invalid P1 authority is stopped before
     * the protected MCP execution.
     *
     * Vulnerable fixture:
     * the handoff ignores the failed P1
     * authority decision and continues into
     * the normal A2A -> MCP execution path.
     */

    if (!decision.allowed && this.fixture === 'secure') {
      recorder.record({
        protocol: 'HANDOFF',

        protocolVersion: 'handoffprobe-p1-v1',

        boundary: 'handoff-authorization -> mcp',

        event: 'p1.authorization.blocked',

        context: translatedContext,

        details: {
          scenarioId: this.scenario.id,

          delegationId: this.scenario.delegation.id,

          reasons: decision.reasons,

          sideEffectCounterBefore: 0,

          sideEffectCounterAfter: 0,
        },
      });

      return {
        originalContext,

        translatedContext,

        evidence: recorder.events,

        output: {
          scenarioId: this.scenario.id,

          fixture: this.fixture,

          delegationId: this.scenario.delegation.id,

          logicalTime: this.scenario.logicalTime,

          decision,

          executed: false,

          sideEffectCounterBefore: 0,

          sideEffectCounterAfter: 0,
        } satisfies P1AuthorizationTargetOutput,
      };
    }

    if (!decision.allowed) {
      recorder.record({
        protocol: 'HANDOFF',

        protocolVersion: 'handoffprobe-p1-v1',

        boundary: 'handoff-authorization -> mcp',

        event: 'p1.authorization.bypassed',

        context: translatedContext,

        details: {
          scenarioId: this.scenario.id,

          delegationId: this.scenario.delegation.id,

          reasons: decision.reasons,
        },
      });
    }

    /*
     * The inner P0 target always uses its
     * secure enforcement mode.
     *
     * This is important: P1 is testing the
     * missing cross-boundary expiry/lineage
     * protection, not disabling the already
     * working P0 authorization checks.
     */
    const downstream = new P0TargetAdapter('secure', this.scenario.p0Scenario);

    const inner = await downstream.execute(input);

    const p0Output = inner.output as P0TargetOutput;

    const before = p0Output.mcpResult.envelope.before.sideEffectCounter;

    const after = p0Output.mcpResult.envelope.after.sideEffectCounter;

    const offset = recorder.events.length;

    const innerEvidence = inner.evidence.map((event, index) => ({
      ...event,

      sequence: offset + index + 1,

      fixture: this.fixture,
    }));

    if (input.signal.aborted) {
      throw new Error('P1 execution was aborted.');
    }

    return {
      originalContext,

      translatedContext: cloneSecurityContext(inner.translatedContext),

      evidence: [...recorder.events, ...innerEvidence],

      output: {
        scenarioId: this.scenario.id,

        fixture: this.fixture,

        delegationId: this.scenario.delegation.id,

        logicalTime: this.scenario.logicalTime,

        decision,

        executed: p0Output.mcpResult.envelope.authorization.executed,

        sideEffectCounterBefore: before,

        sideEffectCounterAfter: after,

        p0Output,
      } satisfies P1AuthorizationTargetOutput,
    };
  }
}
