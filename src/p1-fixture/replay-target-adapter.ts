import { cloneSecurityContext } from '../core/index.js';

import type {
  SecurityContext,
  TargetAdapter,
  TargetExecutionInput,
  TargetExecutionResult,
} from '../core/index.js';

import { executeP0A2aFixture } from '../p0-fixture/a2a/harness.js';

import type { P0A2aRunState } from '../p0-fixture/a2a/executor.js';

import { P0IdentityHandoffAdapter } from '../p0-fixture/handoff/adapter.js';

import type { P0Scenario } from '../p0-fixture/scenario.js';

import { EvidenceRecorder } from '../protocol-lab/evidence.js';

import {
  consumeP1Delegation,
  createP1FixtureState,
  evaluateP1Delegation,
  recordP1ActionSideEffect,
  recordP1Attempt,
  registerP1Action,
  registerP1Delegation,
} from './state.js';

import type {
  P1ActionRecord,
  P1DelegationDecision,
  P1DelegationRecord,
  P1DelegationRequest,
  P1FixtureState,
} from './state.js';

import type { P1FixtureMode } from './target-adapter.js';

export type P1ReplayKind =
  'exact-action-replay' | 'cross-context-replay' | 'retry-double-execution';

export interface P1ReplayScenario {
  id: string;

  kind: P1ReplayKind;

  actionId: string;

  firstAttemptId: string;

  secondAttemptId: string;

  delegation: P1DelegationRecord;

  baselineRequest: P1DelegationRequest;

  replayRequest: P1DelegationRequest;

  logicalTime: number;

  acknowledgementAmbiguity?: boolean;

  p0Scenario: P0Scenario;
}

export interface P1ReplayTargetOutput {
  scenarioId: string;

  fixture: P1FixtureMode;

  kind: P1ReplayKind;

  actionId: string;

  firstAttemptId: string;

  secondAttemptId: string;

  baselineDecision: P1DelegationDecision;

  replayDecision: P1DelegationDecision;

  acknowledgementAmbiguity: boolean;

  baselineExecuted: boolean;

  replayExecuted: boolean;

  replayBlockedByPolicy: boolean;

  sideEffectCounterBefore: number;

  sideEffectCounterAfterFirst: number;

  sideEffectCounterAfterSecond: number;

  action: P1ActionRecord;
}

interface AttemptResult {
  executed: boolean;

  sideEffectCounterBefore: number;

  sideEffectCounterAfter: number;
}

async function executeProtectedAttempt(input: {
  recorder: EvidenceRecorder;

  state: P1FixtureState;

  context: SecurityContext;

  scenario: P0Scenario;
}): Promise<AttemptResult> {
  const runState: P0A2aRunState = {};

  const before = input.state.sideEffectCounter;

  await executeP0A2aFixture({
    recorder: input.recorder,

    state: runState,

    fixtureState: input.state,

    context: cloneSecurityContext(input.context),

    handoffAdapter: new P0IdentityHandoffAdapter(),

    scenario: input.scenario,

    enforcementMode: 'enforce',
  });

  const mcpResult = runState.mcpResult;

  if (mcpResult === undefined) {
    throw new Error('P1 replay attempt produced no MCP result.');
  }

  return {
    executed: mcpResult.envelope.authorization.executed,

    sideEffectCounterBefore: before,

    sideEffectCounterAfter: input.state.sideEffectCounter,
  };
}

function copyAction(action: P1ActionRecord): P1ActionRecord {
  return {
    ...action,

    attemptIds: [...action.attemptIds],
  };
}

function requireAction(state: P1FixtureState, actionId: string): P1ActionRecord {
  const action = state.actions[actionId];

  if (action === undefined) {
    throw new Error(`P1 replay action missing: ${actionId}`);
  }

  return action;
}

export class P1ReplayTargetAdapter implements TargetAdapter {
  readonly id: string;

  constructor(
    readonly fixture: P1FixtureMode,

    readonly scenario: P1ReplayScenario,
  ) {
    this.id = ['p1', fixture, scenario.id].join(':');
  }

  async execute(input: TargetExecutionInput): Promise<TargetExecutionResult> {
    if (input.signal.aborted) {
      throw new Error('P1 replay execution was aborted before start.');
    }

    const originalContext = cloneSecurityContext(input.context);

    const translatedContext = cloneSecurityContext(input.context);

    const recorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

    const state = createP1FixtureState();

    registerP1Delegation(state, this.scenario.delegation);

    registerP1Action(state, this.scenario.actionId);

    const before = state.sideEffectCounter;

    const baselineDecision = evaluateP1Delegation(
      state,
      this.scenario.delegation.id,
      this.scenario.logicalTime,
      this.scenario.baselineRequest,
    );

    recorder.record({
      protocol: 'HANDOFF',

      protocolVersion: 'handoffprobe-p1-v1',

      boundary: 'a2a-action -> replay-policy',

      event: 'p1.replay.baseline',

      context: translatedContext,

      details: {
        scenarioId: this.scenario.id,

        classification: this.scenario.kind,

        actionId: this.scenario.actionId,

        attemptId: this.scenario.firstAttemptId,

        delegationId: this.scenario.delegation.id,

        taskId: this.scenario.baselineRequest.taskId,

        runId: this.scenario.baselineRequest.runId,

        allowed: baselineDecision.allowed,

        sideEffectCounterBefore: before,
      },
    });

    if (!baselineDecision.allowed) {
      throw new Error('P1 replay baseline authority must be valid.');
    }

    recordP1Attempt(state, this.scenario.actionId, this.scenario.firstAttemptId);

    const first = await executeProtectedAttempt({
      recorder,

      state,

      context: translatedContext,

      scenario: this.scenario.p0Scenario,
    });

    if (!first.executed) {
      throw new Error('P1 replay baseline protected action did not execute.');
    }

    recordP1ActionSideEffect(state, this.scenario.actionId);

    consumeP1Delegation(
      state,
      this.scenario.delegation.id,
      this.scenario.logicalTime,
      this.scenario.baselineRequest,
    );

    recorder.record({
      protocol: 'HANDOFF',

      protocolVersion: 'handoffprobe-p1-v1',

      boundary: 'mcp-side-effect -> replay-state',

      event: 'p1.replay.first_execution',

      context: translatedContext,

      details: {
        actionId: this.scenario.actionId,

        attemptId: this.scenario.firstAttemptId,

        executed: first.executed,

        sideEffectCounterBefore: first.sideEffectCounterBefore,

        sideEffectCounterAfter: first.sideEffectCounterAfter,

        consumptionState: this.scenario.delegation.singleUse ? 'consumed' : 'not_single_use',
      },
    });

    const acknowledgementAmbiguity = this.scenario.acknowledgementAmbiguity === true;

    if (acknowledgementAmbiguity) {
      recorder.record({
        protocol: 'HANDOFF',

        protocolVersion: 'handoffprobe-p1-v1',

        boundary: 'mcp-result -> a2a-acknowledgement',

        event: 'p1.retry.acknowledgement_lost',

        context: translatedContext,

        details: {
          actionId: this.scenario.actionId,

          attemptId: this.scenario.firstAttemptId,

          sideEffectExecuted: true,

          acknowledgementDelivered: false,
        },
      });
    }

    const replayDecision = evaluateP1Delegation(
      state,
      this.scenario.delegation.id,
      this.scenario.logicalTime,
      this.scenario.replayRequest,
    );

    const actionBeforeReplay = requireAction(state, this.scenario.actionId);

    const alreadyCompleted = actionBeforeReplay.completed;

    let replayAllowedByPolicy = replayDecision.allowed;

    if (this.scenario.kind === 'retry-double-execution') {
      replayAllowedByPolicy = replayDecision.allowed && !alreadyCompleted;
    }

    const replayBlockedByPolicy = !replayAllowedByPolicy;

    recorder.record({
      protocol: 'HANDOFF',

      protocolVersion: 'handoffprobe-p1-v1',

      boundary: 'replayed-a2a-action -> replay-policy',

      event: 'p1.replay.classify',

      context: translatedContext,

      details: {
        classification: this.scenario.kind,

        actionId: this.scenario.actionId,

        originalAttemptId: this.scenario.firstAttemptId,

        replayAttemptId: this.scenario.secondAttemptId,

        originalTaskId: this.scenario.baselineRequest.taskId,

        replayTaskId: this.scenario.replayRequest.taskId,

        originalRunId: this.scenario.baselineRequest.runId,

        replayRunId: this.scenario.replayRequest.runId,

        delegationId: this.scenario.delegation.id,

        delegationAllowed: replayDecision.allowed,

        delegationReasons: replayDecision.reasons,

        logicalActionCompleted: alreadyCompleted,

        replayAllowedByPolicy,

        acknowledgementAmbiguity,
      },
    });

    recordP1Attempt(state, this.scenario.actionId, this.scenario.secondAttemptId);

    let replayExecuted = false;

    if (replayBlockedByPolicy && this.fixture === 'secure') {
      recorder.record({
        protocol: 'HANDOFF',

        protocolVersion: 'handoffprobe-p1-v1',

        boundary: 'replay-policy -> mcp',

        event: 'p1.replay.blocked',

        context: translatedContext,

        details: {
          actionId: this.scenario.actionId,

          attemptId: this.scenario.secondAttemptId,

          classification: this.scenario.kind,

          reasons: replayDecision.reasons,

          logicalActionCompleted: alreadyCompleted,

          sideEffectCounter: state.sideEffectCounter,
        },
      });
    } else {
      if (replayBlockedByPolicy) {
        recorder.record({
          protocol: 'HANDOFF',

          protocolVersion: 'handoffprobe-p1-v1',

          boundary: 'replay-policy -> mcp',

          event: 'p1.replay.bypassed',

          context: translatedContext,

          details: {
            actionId: this.scenario.actionId,

            attemptId: this.scenario.secondAttemptId,

            classification: this.scenario.kind,

            reasons: replayDecision.reasons,

            logicalActionCompleted: alreadyCompleted,
          },
        });
      }

      const second = await executeProtectedAttempt({
        recorder,

        state,

        context: translatedContext,

        scenario: this.scenario.p0Scenario,
      });

      replayExecuted = second.executed;

      if (replayExecuted) {
        recordP1ActionSideEffect(state, this.scenario.actionId);
      }

      recorder.record({
        protocol: 'HANDOFF',

        protocolVersion: 'handoffprobe-p1-v1',

        boundary: 'mcp-side-effect -> replay-state',

        event: 'p1.replay.second_execution',

        context: translatedContext,

        details: {
          actionId: this.scenario.actionId,

          attemptId: this.scenario.secondAttemptId,

          executed: second.executed,

          sideEffectCounterBefore: second.sideEffectCounterBefore,

          sideEffectCounterAfter: second.sideEffectCounterAfter,
        },
      });
    }

    if (input.signal.aborted) {
      throw new Error('P1 replay execution was aborted.');
    }

    const action = requireAction(state, this.scenario.actionId);

    const output: P1ReplayTargetOutput = {
      scenarioId: this.scenario.id,

      fixture: this.fixture,

      kind: this.scenario.kind,

      actionId: this.scenario.actionId,

      firstAttemptId: this.scenario.firstAttemptId,

      secondAttemptId: this.scenario.secondAttemptId,

      baselineDecision,

      replayDecision,

      acknowledgementAmbiguity,

      baselineExecuted: first.executed,

      replayExecuted,

      replayBlockedByPolicy,

      sideEffectCounterBefore: before,

      sideEffectCounterAfterFirst: first.sideEffectCounterAfter,

      sideEffectCounterAfterSecond: state.sideEffectCounter,

      action: copyAction(action),
    };

    return {
      originalContext,

      translatedContext,

      evidence: recorder.events,

      output,
    };
  }
}
