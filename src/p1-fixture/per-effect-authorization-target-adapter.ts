import { cloneSecurityContext } from '../core/index.js';

import type {
  EvidenceEvent,
  TargetAdapter,
  TargetExecutionInput,
  TargetExecutionResult,
} from '../core/index.js';

import { P0TargetAdapter } from '../p0-fixture/index.js';

import type { P0Scenario, P0TargetOutput } from '../p0-fixture/index.js';

import { EvidenceRecorder } from '../protocol-lab/evidence.js';

import {
  createP1FixtureState,
  evaluateP1Delegation,
  invalidateP1Delegation,
  registerP1Delegation,
} from './state.js';

import type { P1DelegationDecision, P1DelegationRecord, P1DelegationRequest } from './state.js';

import type { P1FixtureMode } from './target-adapter.js';

export interface P1PerEffectAuthorizationScenario {
  id: string;

  delegation: P1DelegationRecord;

  request: P1DelegationRequest;

  contextId: string;

  firstLogicalTime: number;

  invalidationTime: number;

  secondLogicalTime: number;

  firstActionId: string;

  secondActionId: string;

  firstP0Scenario: P0Scenario;

  secondP0Scenario: P0Scenario;
}

export interface P1PerEffectAuthorizationTargetOutput {
  scenarioId: string;

  fixture: P1FixtureMode;

  delegationId: string;

  taskId: string;

  runId: string;

  contextId: string;

  firstActionId: string;

  secondActionId: string;

  firstDecision: P1DelegationDecision;

  secondDecision?: P1DelegationDecision;

  firstEffectExecuted: boolean;

  secondEffectExecuted: boolean;

  firstEffectDelta: number;

  secondEffectDelta: number;

  protectedEffectDelta: number;

  firstP0Output?: P0TargetOutput;

  secondP0Output?: P0TargetOutput;
}

function effectDelta(output: P0TargetOutput): number {
  return (
    output.mcpResult.envelope.after.sideEffectCounter -
    output.mcpResult.envelope.before.sideEffectCounter
  );
}

function resequence(events: readonly EvidenceEvent[], fixture: P1FixtureMode): EvidenceEvent[] {
  return events.map((event, index) => ({
    ...event,
    sequence: index + 1,
    fixture,
  }));
}

export class P1PerEffectAuthorizationTargetAdapter implements TargetAdapter {
  readonly id: string;

  constructor(
    readonly fixture: P1FixtureMode,
    readonly scenario: P1PerEffectAuthorizationScenario,
  ) {
    this.id = ['p1', fixture, scenario.id].join(':');
  }

  async execute(input: TargetExecutionInput): Promise<TargetExecutionResult> {
    if (input.signal.aborted) {
      throw new Error('P1 per-effect authorization execution was aborted before start.');
    }

    if (this.scenario.firstActionId === this.scenario.secondActionId) {
      throw new Error('P1 per-effect authorization requires two distinct logical action IDs.');
    }

    if (!(
      this.scenario.firstLogicalTime < this.scenario.invalidationTime &&
      this.scenario.invalidationTime <= this.scenario.secondLogicalTime
    )) {
      throw new Error(
        'P1 per-effect authorization requires first < invalidation <= second logical time.',
      );
    }

    const originalContext = cloneSecurityContext(input.context);
    const translatedContext = cloneSecurityContext(input.context);

    const state = createP1FixtureState();
    registerP1Delegation(state, this.scenario.delegation);

    const firstRecorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

    const firstDecision = evaluateP1Delegation(
      state,
      this.scenario.delegation.id,
      this.scenario.firstLogicalTime,
      this.scenario.request,
    );

    firstRecorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'a2a-delegation -> per-effect-authorization',
      event: 'p1.per_effect.authorization',
      context: translatedContext,
      details: {
        phase: 'effect_a',
        actionId: this.scenario.firstActionId,
        contextId: this.scenario.contextId,
        taskId: this.scenario.request.taskId,
        runId: this.scenario.request.runId,
        logicalTime: this.scenario.firstLogicalTime,
        allowed: firstDecision.allowed,
        reasons: firstDecision.reasons,
      },
    });

    if (!firstDecision.allowed) {
      const summaryRecorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

      summaryRecorder.record({
        protocol: 'HANDOFF',
        protocolVersion: 'handoffprobe-p1-v1',
        boundary: 'per-effect-authorization',
        event: 'p1.per_effect.summary',
        context: translatedContext,
        details: {
          firstActionId: this.scenario.firstActionId,
          secondActionId: this.scenario.secondActionId,
          firstScenarioId: this.scenario.firstP0Scenario.id,
          secondScenarioId: this.scenario.secondP0Scenario.id,
          firstEffectDelta: 0,
          secondEffectDelta: 0,
          protectedEffectDelta: 0,
        },
      });

      return {
        originalContext,
        translatedContext,
        evidence: resequence([...firstRecorder.events, ...summaryRecorder.events], this.fixture),
        output: {
          scenarioId: this.scenario.id,
          fixture: this.fixture,
          delegationId: this.scenario.delegation.id,
          taskId: this.scenario.request.taskId,
          runId: this.scenario.request.runId,
          contextId: this.scenario.contextId,
          firstActionId: this.scenario.firstActionId,
          secondActionId: this.scenario.secondActionId,
          firstDecision,
          firstEffectExecuted: false,
          secondEffectExecuted: false,
          firstEffectDelta: 0,
          secondEffectDelta: 0,
          protectedEffectDelta: 0,
        } satisfies P1PerEffectAuthorizationTargetOutput,
      };
    }

    const firstDownstream = new P0TargetAdapter('secure', this.scenario.firstP0Scenario);
    const firstResult = await firstDownstream.execute(input);
    const firstP0Output = firstResult.output as P0TargetOutput;
    const firstEffectDelta = effectDelta(firstP0Output);
    const firstEffectExecuted = firstP0Output.mcpResult.envelope.authorization.executed;

    invalidateP1Delegation(state, this.scenario.delegation.id, this.scenario.invalidationTime);

    const secondRecorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

    secondRecorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'per-effect-authorization',
      event: 'p1.per_effect.invalidate',
      context: translatedContext,
      details: {
        delegationId: this.scenario.delegation.id,
        invalidationTime: this.scenario.invalidationTime,
        afterActionId: this.scenario.firstActionId,
        beforeActionId: this.scenario.secondActionId,
      },
    });

    const secondDecision = evaluateP1Delegation(
      state,
      this.scenario.delegation.id,
      this.scenario.secondLogicalTime,
      this.scenario.request,
    );

    secondRecorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'a2a-delegation -> per-effect-authorization',
      event: 'p1.per_effect.authorization',
      context: translatedContext,
      details: {
        phase: 'effect_b',
        actionId: this.scenario.secondActionId,
        contextId: this.scenario.contextId,
        taskId: this.scenario.request.taskId,
        runId: this.scenario.request.runId,
        logicalTime: this.scenario.secondLogicalTime,
        allowed: secondDecision.allowed,
        reasons: secondDecision.reasons,
        invalidated: secondDecision.invalidated,
      },
    });

    let secondResult: TargetExecutionResult | undefined;
    let secondP0Output: P0TargetOutput | undefined;

    if (!secondDecision.allowed && this.fixture === 'secure') {
      secondRecorder.record({
        protocol: 'HANDOFF',
        protocolVersion: 'handoffprobe-p1-v1',
        boundary: 'per-effect-authorization -> mcp',
        event: 'p1.per_effect.blocked',
        context: translatedContext,
        details: {
          actionId: this.scenario.secondActionId,
          reasons: secondDecision.reasons,
        },
      });
    } else {
      if (!secondDecision.allowed) {
        secondRecorder.record({
          protocol: 'HANDOFF',
          protocolVersion: 'handoffprobe-p1-v1',
          boundary: 'per-effect-authorization -> mcp',
          event: 'p1.per_effect.authorization_reused',
          context: translatedContext,
          details: {
            firstActionId: this.scenario.firstActionId,
            secondActionId: this.scenario.secondActionId,
            reasons: secondDecision.reasons,
          },
        });
      }

      const secondDownstream = new P0TargetAdapter('secure', this.scenario.secondP0Scenario);

      secondResult = await secondDownstream.execute(input);
      secondP0Output = secondResult.output as P0TargetOutput;
    }

    const secondEffectDelta = secondP0Output === undefined ? 0 : effectDelta(secondP0Output);

    const secondEffectExecuted = secondP0Output?.mcpResult.envelope.authorization.executed ?? false;

    const protectedEffectDelta = firstEffectDelta + secondEffectDelta;

    const summaryRecorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

    summaryRecorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'per-effect-authorization',
      event: 'p1.per_effect.summary',
      context: translatedContext,
      details: {
        firstActionId: this.scenario.firstActionId,
        secondActionId: this.scenario.secondActionId,
        firstScenarioId: this.scenario.firstP0Scenario.id,
        secondScenarioId: this.scenario.secondP0Scenario.id,
        firstEffectDelta,
        secondEffectDelta,
        protectedEffectDelta,
        firstEffectExecuted,
        secondEffectExecuted,
      },
    });

    if (input.signal.aborted) {
      throw new Error('P1 per-effect authorization execution was aborted.');
    }

    const combinedEvidence: EvidenceEvent[] = [
      ...firstRecorder.events,
      ...firstResult.evidence,
      ...secondRecorder.events,
      ...(secondResult?.evidence ?? []),
      ...summaryRecorder.events,
    ];

    return {
      originalContext,
      translatedContext:
        secondResult === undefined
          ? cloneSecurityContext(firstResult.translatedContext)
          : cloneSecurityContext(secondResult.translatedContext),
      evidence: resequence(combinedEvidence, this.fixture),
      output: {
        scenarioId: this.scenario.id,
        fixture: this.fixture,
        delegationId: this.scenario.delegation.id,
        taskId: this.scenario.request.taskId,
        runId: this.scenario.request.runId,
        contextId: this.scenario.contextId,
        firstActionId: this.scenario.firstActionId,
        secondActionId: this.scenario.secondActionId,
        firstDecision,
        secondDecision,
        firstEffectExecuted,
        secondEffectExecuted,
        firstEffectDelta,
        secondEffectDelta,
        protectedEffectDelta,
        firstP0Output,
        ...(secondP0Output === undefined ? {} : { secondP0Output }),
      } satisfies P1PerEffectAuthorizationTargetOutput,
    };
  }
}
