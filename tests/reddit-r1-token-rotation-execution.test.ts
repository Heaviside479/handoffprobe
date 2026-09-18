import { describe, expect, it } from 'vitest';

import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
import { EvidenceRecorder } from '../src/protocol-lab/evidence.js';
import { callReadInvoiceThroughMcp } from '../src/protocol-lab/mcp/harness.js';
import type { SecurityContext } from '../src/protocol-lab/models.js';

const CONTEXT: SecurityContext = {
  principal: 'user:alice',
  caller: 'agent:sales',
  downstream: 'agent:billing',
  tenant: 'tenant:acme',
  resource: 'invoice:INV-1001',
  capabilities: ['invoice.read'],
};

const ACTION_ID = 'action:REDDIT-R1-TOKEN-ROTATION';
const FIRST_ATTEMPT_ID = 'attempt:R1-ATT-1';
const SECOND_ATTEMPT_ID = 'attempt:R1-ATT-2';
const TASK_ID = 'task:REDDIT-R1';
const CONTEXT_ID = 'context:REDDIT-R1';

type FixtureMode = 'secure' | 'vulnerable';
type TokenGeneration = 'A' | 'B';

interface SessionState {
  currentGeneration: TokenGeneration;
}

interface SessionDecision {
  allowed: boolean;
  presentedGeneration: TokenGeneration;
  currentGeneration: TokenGeneration;
  reason: 'current_session' | 'stale_session';
}

function evaluateSession(
  state: SessionState,
  presentedGeneration: TokenGeneration,
): SessionDecision {
  const allowed = state.currentGeneration === presentedGeneration;

  return {
    allowed,
    presentedGeneration,
    currentGeneration: state.currentGeneration,
    reason: allowed ? 'current_session' : 'stale_session',
  };
}

async function runScenario(mode: FixtureMode) {
  const effects = new CrossingEffectRecorder();
  const recorder = new EvidenceRecorder(`reddit-r1-${mode}`, mode);

  const state: SessionState = {
    currentGeneration: 'A',
  };

  const before = effects.snapshot();

  const initialDecision = evaluateSession(state, 'A');

  if (!initialDecision.allowed) {
    throw new Error('R-1 baseline token generation A must initially be current.');
  }

  recorder.record({
    protocol: 'HANDOFF',
    protocolVersion: 'handoffprobe-research-r1-v1',
    boundary: 'handoff-start -> authorization-snapshot',
    event: 'r1.token.initial_authorization',
    context: CONTEXT,
    details: {
      actionId: ACTION_ID,
      attemptId: FIRST_ATTEMPT_ID,
      taskId: TASK_ID,
      contextId: CONTEXT_ID,
      presentedGeneration: initialDecision.presentedGeneration,
      currentGeneration: initialDecision.currentGeneration,
      allowed: initialDecision.allowed,
    },
  });

  const effectCountBeforeInterruption = effects.count;

  recorder.record({
    protocol: 'HANDOFF',
    protocolVersion: 'handoffprobe-research-r1-v1',
    boundary: 'authorization-snapshot -> connection-interruption',
    event: 'r1.token.interruption',
    context: CONTEXT,
    details: {
      actionId: ACTION_ID,
      attemptId: FIRST_ATTEMPT_ID,
      effectCountBeforeInterruption,
    },
  });

  state.currentGeneration = 'B';

  recorder.record({
    protocol: 'CORE',
    protocolVersion: 'handoffprobe-research-r1-v1',
    boundary: 'session-state -> interrupted-handoff',
    event: 'r1.token.rotation',
    context: CONTEXT,
    details: {
      actionId: ACTION_ID,
      previousGeneration: 'A',
      currentGeneration: state.currentGeneration,
    },
  });

  const currentDecision = evaluateSession(state, 'A');

  const resumeDecision = mode === 'secure' ? currentDecision : initialDecision;

  recorder.record({
    protocol: 'HANDOFF',
    protocolVersion: 'handoffprobe-research-r1-v1',
    boundary: 'reconnect -> protected-dispatch',
    event: 'r1.token.resume',
    context: CONTEXT,
    details: {
      actionId: ACTION_ID,
      originalAttemptId: FIRST_ATTEMPT_ID,
      resumeAttemptId: SECOND_ATTEMPT_ID,
      taskId: TASK_ID,
      contextId: CONTEXT_ID,
      presentedGeneration: 'A',
      currentGeneration: state.currentGeneration,
      currentAllowed: currentDecision.allowed,
      currentReason: currentDecision.reason,
      cachedInitialAllowed: initialDecision.allowed,
      policy: mode === 'secure' ? 'revalidate-current-session' : 'reuse-cached-authorization',
      resumeAllowed: resumeDecision.allowed,
    },
  });

  if (resumeDecision.allowed) {
    await callReadInvoiceThroughMcp(CONTEXT, recorder, undefined, effects);
  } else {
    recorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-research-r1-v1',
      boundary: 'reconnect -> mcp',
      event: 'r1.token.blocked',
      context: CONTEXT,
      details: {
        actionId: ACTION_ID,
        attemptId: SECOND_ATTEMPT_ID,
        reason: currentDecision.reason,
      },
    });
  }

  const delta = effects.deltaSince(before);

  return {
    mode,
    actionId: ACTION_ID,
    firstAttemptId: FIRST_ATTEMPT_ID,
    secondAttemptId: SECOND_ATTEMPT_ID,
    taskId: TASK_ID,
    contextId: CONTEXT_ID,
    initialDecision,
    currentDecision,
    resumeAllowed: resumeDecision.allowed,
    effectCountBeforeInterruption,
    effectDelta: delta.delta,
    mcpToolCallCount: recorder.events.filter((event) => event.event === 'mcp.tool.call').length,
    fakeToolExecuteCount: recorder.events.filter((event) => event.event === 'fake_tool.execute')
      .length,
    events: recorder.events.map((event) => event.event),
  };
}

describe('Reddit R-1 token rotation during interrupted handoff', () => {
  it('securely rejects stale generation A after the server rotates to B', async () => {
    const result = await runScenario('secure');

    expect(result.initialDecision).toEqual({
      allowed: true,
      presentedGeneration: 'A',
      currentGeneration: 'A',
      reason: 'current_session',
    });

    expect(result.currentDecision).toEqual({
      allowed: false,
      presentedGeneration: 'A',
      currentGeneration: 'B',
      reason: 'stale_session',
    });

    expect(result.resumeAllowed).toBe(false);
    expect(result.effectCountBeforeInterruption).toBe(0);
    expect(result.effectDelta).toBe(0);
    expect(result.mcpToolCallCount).toBe(0);
    expect(result.fakeToolExecuteCount).toBe(0);
    expect(result.events).toContain('r1.token.blocked');
  });

  it('reproduces the vulnerable stale cached-authorization path', async () => {
    const result = await runScenario('vulnerable');

    expect(result.initialDecision.allowed).toBe(true);
    expect(result.currentDecision.allowed).toBe(false);
    expect(result.currentDecision.reason).toBe('stale_session');

    expect(result.resumeAllowed).toBe(true);
    expect(result.effectCountBeforeInterruption).toBe(0);
    expect(result.effectDelta).toBe(1);
    expect(result.mcpToolCallCount).toBe(1);
    expect(result.fakeToolExecuteCount).toBe(1);
  });

  it('keeps one logical action and context while changing only the attempt identity', async () => {
    const secure = await runScenario('secure');
    const vulnerable = await runScenario('vulnerable');

    expect(secure.actionId).toBe(vulnerable.actionId);
    expect(secure.taskId).toBe(vulnerable.taskId);
    expect(secure.contextId).toBe(vulnerable.contextId);

    expect(secure.firstAttemptId).toBe(FIRST_ATTEMPT_ID);
    expect(secure.secondAttemptId).toBe(SECOND_ATTEMPT_ID);
    expect(secure.firstAttemptId).not.toBe(secure.secondAttemptId);

    expect(secure.effectCountBeforeInterruption).toBe(0);
    expect(vulnerable.effectCountBeforeInterruption).toBe(0);
  });

  it('reproduces both secure and vulnerable summaries deterministically', async () => {
    const firstSecure = await runScenario('secure');
    const secondSecure = await runScenario('secure');

    const firstVulnerable = await runScenario('vulnerable');
    const secondVulnerable = await runScenario('vulnerable');

    expect(firstSecure).toEqual(secondSecure);
    expect(firstVulnerable).toEqual(secondVulnerable);
  });
});
