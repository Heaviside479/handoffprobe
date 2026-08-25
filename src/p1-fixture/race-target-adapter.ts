import { cloneSecurityContext } from '../core/index.js';

import type {
  SecurityContext,
  TargetAdapter,
  TargetExecutionInput,
  TargetExecutionResult,
} from '../core/index.js';

import type { P0A2aRunState } from '../p0-fixture/a2a/executor.js';
import { executeP0A2aFixture } from '../p0-fixture/a2a/harness.js';
import { P0IdentityHandoffAdapter } from '../p0-fixture/handoff/adapter.js';

import type { P0Scenario } from '../p0-fixture/index.js';

import { EvidenceRecorder } from '../protocol-lab/evidence.js';

import { P1DeterministicBarrier } from './barrier.js';

import {
  consumeP1Delegation,
  createP1FixtureState,
  evaluateP1Delegation,
  invalidateP1Delegation,
  recordP1ActionSideEffect,
  recordP1Attempt,
  registerP1Action,
  registerP1Delegation,
} from './state.js';

import type {
  P1DelegationDecision,
  P1DelegationRecord,
  P1DelegationRequest,
  P1FixtureState,
} from './state.js';

import type { P1FixtureMode } from './target-adapter.js';

export type P1RaceKind = 'parallel-one-time-authority' | 'partial-failure-stale-execution';

export interface P1RaceScenario {
  id: string;
  kind: P1RaceKind;
  actionId: string;
  firstAttemptId: string;
  secondAttemptId: string;
  delegation: P1DelegationRecord;
  request: P1DelegationRequest;
  logicalTime: number;
  invalidationTime?: number;
  p0Scenario: P0Scenario;
}

export interface P1RaceAttemptResult {
  attemptId: string;
  releaseIndex: number | null;
  decision: P1DelegationDecision;
  executed: boolean;
}

export interface P1RaceTargetOutput {
  scenarioId: string;
  fixture: P1FixtureMode;
  kind: P1RaceKind;
  delegationId: string;
  actionId: string;
  initialDecision: P1DelegationDecision;
  currentDecision: P1DelegationDecision;
  attempts: P1RaceAttemptResult[];
  executedAttempts: string[];
  barrierArrivals: number;
  capturedStateUsed: boolean;
  invalidationTime: number | null;
  sideEffectCounterBefore: number;
  sideEffectCounterAfter: number;
}

interface ProtectedAttemptResult {
  executed: boolean;
}

function createCompletionGate() {
  let release: (() => void) | undefined;

  const promise = new Promise<void>((resolve) => {
    release = resolve;
  });

  return {
    promise,

    release() {
      if (release === undefined) {
        throw new Error('P1 completion gate was not initialized.');
      }

      release();
    },
  };
}

async function executeProtectedAttempt(input: {
  recorder: EvidenceRecorder;
  state: P1FixtureState;
  context: SecurityContext;
  scenario: P0Scenario;
}): Promise<ProtectedAttemptResult> {
  const runState: P0A2aRunState = {};

  await executeP0A2aFixture({
    recorder: input.recorder,
    state: runState,
    fixtureState: input.state,
    context: cloneSecurityContext(input.context),
    handoffAdapter: new P0IdentityHandoffAdapter(),
    scenario: input.scenario,
    enforcementMode: 'enforce',
  });

  const result = runState.mcpResult;

  if (result === undefined) {
    throw new Error('P1 race protected attempt produced no MCP result.');
  }

  return {
    executed: result.envelope.authorization.executed,
  };
}

export class P1RaceTargetAdapter implements TargetAdapter {
  readonly id: string;

  constructor(
    readonly fixture: P1FixtureMode,
    readonly scenario: P1RaceScenario,
  ) {
    this.id = ['p1', fixture, scenario.id].join(':');
  }

  async execute(input: TargetExecutionInput): Promise<TargetExecutionResult> {
    if (input.signal.aborted) {
      throw new Error('P1 race execution was aborted before start.');
    }

    if (this.scenario.kind === 'parallel-one-time-authority') {
      return this.runParallelRace(input);
    }

    return this.runPartialFailure(input);
  }

  private async runParallelRace(input: TargetExecutionInput): Promise<TargetExecutionResult> {
    const originalContext = cloneSecurityContext(input.context);
    const translatedContext = cloneSecurityContext(input.context);

    const recorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

    const state = createP1FixtureState();

    registerP1Delegation(state, this.scenario.delegation);
    registerP1Action(state, this.scenario.actionId);

    const before = state.sideEffectCounter;

    const barrier = new P1DeterministicBarrier([
      this.scenario.firstAttemptId,
      this.scenario.secondAttemptId,
    ]);

    const firstFinished = createCompletionGate();

    const executeAttempt = async (attemptId: string): Promise<P1RaceAttemptResult> => {
      recordP1Attempt(state, this.scenario.actionId, attemptId);

      /*
       * Both attempts inspect authority before either reaches
       * the one-time consumption boundary.
       */
      const capturedDecision = evaluateP1Delegation(
        state,
        this.scenario.delegation.id,
        this.scenario.logicalTime,
        this.scenario.request,
      );

      recorder.record({
        protocol: 'HANDOFF',
        protocolVersion: 'handoffprobe-p1-v1',
        boundary: 'parallel-attempt -> one-time-consumption-barrier',
        event: 'p1.race.arrive',
        context: translatedContext,
        details: {
          scenarioId: this.scenario.id,
          delegationId: this.scenario.delegation.id,
          actionId: this.scenario.actionId,
          attemptId,
          capturedAllowed: capturedDecision.allowed,
          singleUse: this.scenario.delegation.singleUse,
        },
      });

      const releaseIndex = await barrier.arrive(attemptId);

      recorder.record({
        protocol: 'HANDOFF',
        protocolVersion: 'handoffprobe-p1-v1',
        boundary: 'one-time-consumption-barrier -> authorization',
        event: 'p1.race.release',
        context: translatedContext,
        details: {
          attemptId,
          releaseIndex,
          barrierArrivals: barrier.arrivedCount(),
        },
      });

      /*
       * Fixed execution order after both participants have
       * reached the barrier. No wall-clock timing is involved.
       */
      if (releaseIndex > 0) {
        await firstFinished.promise;
      }

      let decision: P1DelegationDecision;

      if (this.fixture === 'secure') {
        /*
         * Secure behavior:
         * revalidate and consume at the protected boundary.
         */
        decision = consumeP1Delegation(
          state,
          this.scenario.delegation.id,
          this.scenario.logicalTime,
          this.scenario.request,
        );
      } else {
        /*
         * Vulnerable behavior:
         * trust the authorization snapshot captured before
         * synchronization.
         */
        decision = capturedDecision;

        if (releaseIndex === 0) {
          consumeP1Delegation(
            state,
            this.scenario.delegation.id,
            this.scenario.logicalTime,
            this.scenario.request,
          );
        }
      }

      recorder.record({
        protocol: 'HANDOFF',
        protocolVersion: 'handoffprobe-p1-v1',
        boundary: 'one-time-authority -> protected-execution',
        event: 'p1.race.authorization',
        context: translatedContext,
        details: {
          attemptId,
          releaseIndex,
          policy: this.fixture === 'secure' ? 'revalidate-and-consume' : 'stale-precheck',
          allowed: decision.allowed,
          reasons: decision.reasons,
          consumedAt: state.delegations[this.scenario.delegation.id]?.consumedAt ?? null,
        },
      });

      let executed = false;

      try {
        if (decision.allowed) {
          const protectedResult = await executeProtectedAttempt({
            recorder,
            state,
            context: translatedContext,
            scenario: this.scenario.p0Scenario,
          });

          executed = protectedResult.executed;

          if (executed) {
            recordP1ActionSideEffect(state, this.scenario.actionId);

            recorder.record({
              protocol: 'CORE',
              protocolVersion: 'handoffprobe-p1-v1',
              boundary: 'protected-execution -> race-state',
              event: 'p1.race.side_effect',
              context: translatedContext,
              details: {
                actionId: this.scenario.actionId,
                attemptId,
                sideEffectCounter: state.sideEffectCounter,
              },
            });
          }
        } else {
          recorder.record({
            protocol: 'HANDOFF',
            protocolVersion: 'handoffprobe-p1-v1',
            boundary: 'one-time-authority -> mcp',
            event: 'p1.race.blocked',
            context: translatedContext,
            details: {
              attemptId,
              reasons: decision.reasons,
              sideEffectCounter: state.sideEffectCounter,
            },
          });
        }
      } finally {
        if (releaseIndex === 0) {
          firstFinished.release();
        }
      }

      return {
        attemptId,
        releaseIndex,
        decision,
        executed,
      };
    };

    const attempts = await Promise.all([
      executeAttempt(this.scenario.firstAttemptId),
      executeAttempt(this.scenario.secondAttemptId),
    ]);

    const currentDecision = evaluateP1Delegation(
      state,
      this.scenario.delegation.id,
      this.scenario.logicalTime,
      this.scenario.request,
    );

    const initialDecision = attempts[0]?.decision;

    if (initialDecision === undefined) {
      throw new Error('P1 race produced no first attempt.');
    }

    const output: P1RaceTargetOutput = {
      scenarioId: this.scenario.id,
      fixture: this.fixture,
      kind: this.scenario.kind,
      delegationId: this.scenario.delegation.id,
      actionId: this.scenario.actionId,
      initialDecision,
      currentDecision,
      attempts,
      executedAttempts: attempts
        .filter((attempt) => attempt.executed)
        .map((attempt) => attempt.attemptId),
      barrierArrivals: barrier.arrivedCount(),
      capturedStateUsed: this.fixture === 'vulnerable',
      invalidationTime: null,
      sideEffectCounterBefore: before,
      sideEffectCounterAfter: state.sideEffectCounter,
    };

    return {
      originalContext,
      translatedContext,
      evidence: recorder.events,
      output,
    };
  }

  private async runPartialFailure(input: TargetExecutionInput): Promise<TargetExecutionResult> {
    const originalContext = cloneSecurityContext(input.context);

    const recorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

    const state = createP1FixtureState();

    registerP1Delegation(state, this.scenario.delegation);
    registerP1Action(state, this.scenario.actionId);

    recordP1Attempt(state, this.scenario.actionId, this.scenario.firstAttemptId);

    const initialDecision = evaluateP1Delegation(
      state,
      this.scenario.delegation.id,
      this.scenario.logicalTime,
      this.scenario.request,
    );

    if (!initialDecision.allowed) {
      throw new Error('P1 partial-failure baseline authority must be valid.');
    }

    /*
     * Capture translated security state at a deterministic
     * handoff boundary before the protected side effect.
     */
    const handoff = new P0IdentityHandoffAdapter();
    const capturedContext = handoff.translate(originalContext);

    recorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'a2a-translation -> interrupted-operation',
      event: 'p1.partial.capture',
      context: capturedContext,
      details: {
        actionId: this.scenario.actionId,
        attemptId: this.scenario.firstAttemptId,
        delegationId: this.scenario.delegation.id,
        interruptionPoint: 'after-translation-before-protected-execution',
        capturedAuthorization: initialDecision.allowed,
        sideEffectCounter: state.sideEffectCounter,
      },
    });

    const invalidationTime = this.scenario.invalidationTime;

    if (invalidationTime === undefined) {
      throw new Error('P1 partial-failure scenario requires invalidationTime.');
    }

    invalidateP1Delegation(state, this.scenario.delegation.id, invalidationTime);

    recorder.record({
      protocol: 'CORE',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'security-state -> interrupted-operation',
      event: 'p1.partial.invalidate',
      context: capturedContext,
      details: {
        actionId: this.scenario.actionId,
        delegationId: this.scenario.delegation.id,
        invalidationTime,
        reason: 'governing_delegation_invalidated',
      },
    });

    recordP1Attempt(state, this.scenario.actionId, this.scenario.secondAttemptId);

    const currentDecision = evaluateP1Delegation(
      state,
      this.scenario.delegation.id,
      invalidationTime,
      this.scenario.request,
    );

    const resumeDecision = this.fixture === 'secure' ? currentDecision : initialDecision;

    recorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'interrupted-operation -> resumed-execution',
      event: 'p1.partial.resume',
      context: capturedContext,
      details: {
        actionId: this.scenario.actionId,
        originalAttemptId: this.scenario.firstAttemptId,
        resumeAttemptId: this.scenario.secondAttemptId,
        capturedAllowed: initialDecision.allowed,
        currentAllowed: currentDecision.allowed,
        currentReasons: currentDecision.reasons,
        capturedStateUsed: this.fixture === 'vulnerable',
        resumeAllowed: resumeDecision.allowed,
      },
    });

    const before = state.sideEffectCounter;

    let executed = false;

    if (resumeDecision.allowed) {
      const protectedResult = await executeProtectedAttempt({
        recorder,
        state,
        context: capturedContext,
        scenario: this.scenario.p0Scenario,
      });

      executed = protectedResult.executed;

      if (executed) {
        recordP1ActionSideEffect(state, this.scenario.actionId);

        recorder.record({
          protocol: 'CORE',
          protocolVersion: 'handoffprobe-p1-v1',
          boundary: 'resumed-execution -> partial-failure-state',
          event: 'p1.partial.side_effect',
          context: capturedContext,
          details: {
            actionId: this.scenario.actionId,
            attemptId: this.scenario.secondAttemptId,
            usedStaleState: this.fixture === 'vulnerable',
            sideEffectCounter: state.sideEffectCounter,
          },
        });
      }
    } else {
      recorder.record({
        protocol: 'HANDOFF',
        protocolVersion: 'handoffprobe-p1-v1',
        boundary: 'resumed-execution -> mcp',
        event: 'p1.partial.blocked',
        context: capturedContext,
        details: {
          actionId: this.scenario.actionId,
          attemptId: this.scenario.secondAttemptId,
          reasons: currentDecision.reasons,
          sideEffectCounter: state.sideEffectCounter,
        },
      });
    }

    const output: P1RaceTargetOutput = {
      scenarioId: this.scenario.id,
      fixture: this.fixture,
      kind: this.scenario.kind,
      delegationId: this.scenario.delegation.id,
      actionId: this.scenario.actionId,
      initialDecision,
      currentDecision,
      attempts: [
        {
          attemptId: this.scenario.firstAttemptId,
          releaseIndex: null,
          decision: initialDecision,
          executed: false,
        },
        {
          attemptId: this.scenario.secondAttemptId,
          releaseIndex: null,
          decision: resumeDecision,
          executed,
        },
      ],
      executedAttempts: executed ? [this.scenario.secondAttemptId] : [],
      barrierArrivals: 0,
      capturedStateUsed: this.fixture === 'vulnerable',
      invalidationTime,
      sideEffectCounterBefore: before,
      sideEffectCounterAfter: state.sideEffectCounter,
    };

    return {
      originalContext,
      translatedContext: cloneSecurityContext(capturedContext),
      evidence: recorder.events,
      output,
    };
  }
}
