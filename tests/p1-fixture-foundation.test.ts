import { describe, expect, it } from 'vitest';

import {
  P1DeterministicBarrier,
  consumeP1Delegation,
  createP1FixtureState,
  createP1LogicalClock,
  evaluateP1Delegation,
  invalidateP1Delegation,
  recordP1ActionSideEffect,
  recordP1Attempt,
  registerP1Action,
  registerP1Delegation,
  snapshotP1FixtureState,
} from '../src/p1-fixture/index.js';

import type { P1DelegationRequest } from '../src/p1-fixture/index.js';

function createRequest(): P1DelegationRequest {
  return {
    principal: 'user:alice',

    delegate: 'agent:billing',

    tenant: 'tenant:acme',

    resource: 'invoice:INV-1001',

    capability: 'invoice.update',

    taskId: 'task:P1-TASK-A',

    runId: 'run:P1-RUN-A',

    requiredChain: ['user:alice', 'agent:sales', 'agent:billing'],
  };
}

function addDelegation(state: ReturnType<typeof createP1FixtureState>, singleUse = false): void {
  registerP1Delegation(state, {
    id: 'delegation:DEL-1001',

    principal: 'user:alice',

    delegate: 'agent:billing',

    tenant: 'tenant:acme',

    resources: ['invoice:INV-1001'],

    capabilities: ['invoice.update'],

    chain: ['user:alice', 'agent:sales', 'agent:billing'],

    taskId: 'task:P1-TASK-A',

    runId: 'run:P1-RUN-A',

    issuedAt: 10,

    expiresAt: 20,

    singleUse,
  });
}

describe('P1 fixture foundation', () => {
  it('uses controlled logical time', () => {
    const clock = createP1LogicalClock(10);

    expect(clock.now()).toBe(10);

    expect(clock.advanceBy(5)).toBe(15);

    expect(clock.advanceTo(20)).toBe(20);

    expect(() => clock.advanceTo(19)).toThrow('Logical clock cannot move backwards.');
  });

  it('expires delegation deterministically', () => {
    const state = createP1FixtureState();

    addDelegation(state);

    const request = createRequest();

    expect(evaluateP1Delegation(state, 'delegation:DEL-1001', 19, request).allowed).toBe(true);

    const expired = evaluateP1Delegation(state, 'delegation:DEL-1001', 20, request);

    expect(expired.allowed).toBe(false);

    expect(expired.expired).toBe(true);

    expect(expired.reasons).toContain('delegation_expired');
  });

  it('blocks reuse of single-use authority', () => {
    const state = createP1FixtureState();

    addDelegation(state, true);

    const request = createRequest();

    expect(consumeP1Delegation(state, 'delegation:DEL-1001', 15, request).allowed).toBe(true);

    const replay = evaluateP1Delegation(state, 'delegation:DEL-1001', 15, request);

    expect(replay.allowed).toBe(false);

    expect(replay.reasons).toContain('single_use_delegation_consumed');
  });

  it('detects delegation-chain truncation', () => {
    const state = createP1FixtureState();

    addDelegation(state);

    state.delegations['delegation:DEL-1001']!.chain = ['user:alice', 'agent:billing'];

    const decision = evaluateP1Delegation(state, 'delegation:DEL-1001', 15, createRequest());

    expect(decision.allowed).toBe(false);

    expect(decision.chainMatches).toBe(false);

    expect(decision.reasons).toContain('delegation_chain_mismatch');
  });

  it('detects cross-run reuse', () => {
    const state = createP1FixtureState();

    addDelegation(state);

    const request = {
      ...createRequest(),

      taskId: 'task:P1-TASK-B',

      runId: 'run:P1-RUN-B',
    };

    const decision = evaluateP1Delegation(state, 'delegation:DEL-1001', 15, request);

    expect(decision.allowed).toBe(false);

    expect(decision.taskMatches).toBe(false);

    expect(decision.runMatches).toBe(false);
  });

  it('supports deterministic invalidation', () => {
    const state = createP1FixtureState();

    addDelegation(state);

    invalidateP1Delegation(state, 'delegation:DEL-1001', 16);

    const decision = evaluateP1Delegation(state, 'delegation:DEL-1001', 16, createRequest());

    expect(decision.allowed).toBe(false);

    expect(decision.invalidated).toBe(true);

    expect(decision.reasons).toContain('delegation_invalidated');
  });

  it('separates one logical action from attempts', () => {
    const state = createP1FixtureState();

    registerP1Action(state, 'action:ACT-1001');

    recordP1Attempt(state, 'action:ACT-1001', 'attempt:ATT-1');

    recordP1Attempt(state, 'action:ACT-1001', 'attempt:ATT-2');

    recordP1ActionSideEffect(state, 'action:ACT-1001');

    expect(state.actions['action:ACT-1001']).toEqual({
      actionId: 'action:ACT-1001',

      attemptIds: ['attempt:ATT-1', 'attempt:ATT-2'],

      sideEffectCount: 1,

      completed: true,
    });
  });

  it('releases controlled race participants in fixed order', async () => {
    const barrier = new P1DeterministicBarrier(['attempt:ATT-1', 'attempt:ATT-2']);

    let firstReleased = false;

    const first = barrier.arrive('attempt:ATT-1').then((index) => {
      firstReleased = true;

      return index;
    });

    await Promise.resolve();

    expect(firstReleased).toBe(false);

    expect(barrier.arrivedCount()).toBe(1);

    const second = barrier.arrive('attempt:ATT-2');

    await expect(first).resolves.toBe(0);

    await expect(second).resolves.toBe(1);

    expect(barrier.arrivedCount()).toBe(2);
  });

  it('produces isolated snapshots', () => {
    const state = createP1FixtureState();

    addDelegation(state);

    registerP1Action(state, 'action:ACT-1001');

    const snapshot = snapshotP1FixtureState(state);

    snapshot.delegations['delegation:DEL-1001']!.chain.push('agent:tampered');

    snapshot.actions['action:ACT-1001']!.attemptIds.push('attempt:tampered');

    expect(state.delegations['delegation:DEL-1001']!.chain).toEqual([
      'user:alice',
      'agent:sales',
      'agent:billing',
    ]);

    expect(state.actions['action:ACT-1001']!.attemptIds).toEqual([]);
  });
});
