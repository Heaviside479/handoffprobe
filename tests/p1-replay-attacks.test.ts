import { describe, expect, it } from 'vitest';

import { HP_REPLAY_001, HP_REPLAY_002, HP_REPLAY_003 } from '../src/attacks/p1/index.js';

import type { P1ReplayAttackPlan } from '../src/attacks/p1/index.js';

import { CoreRunner } from '../src/core/index.js';

import { P1ReplayTargetAdapter } from '../src/p1-fixture/index.js';

import type { P1FixtureMode } from '../src/p1-fixture/index.js';

async function runAttack(plan: P1ReplayAttackPlan, fixture: P1FixtureMode, runId: string) {
  return new CoreRunner().run({
    attack: plan.attack,

    target: new P1ReplayTargetAdapter(fixture, plan.scenario),

    context: plan.createContext(),

    runId,
  });
}

function events(result: Awaited<ReturnType<typeof runAttack>>): string[] {
  return result.evidence.map((event) => event.event);
}

function replayClassification(result: Awaited<ReturnType<typeof runAttack>>) {
  return result.evidence.find((event) => event.event === 'p1.replay.classify');
}

describe('P1 replay attacks', () => {
  it('registers all three stable replay IDs', () => {
    expect(HP_REPLAY_001.attack.definition.id).toBe('HP-REPLAY-001');

    expect(HP_REPLAY_002.attack.definition.id).toBe('HP-REPLAY-002');

    expect(HP_REPLAY_003.attack.definition.id).toBe('HP-REPLAY-003');

    expect(HP_REPLAY_001.attack.definition.priority).toBe('P1');
  });

  it('HP-REPLAY-001 passes against secure target', async () => {
    const result = await runAttack(HP_REPLAY_001, 'secure', 'p1-replay-001-secure');

    expect(result.finding.status).toBe('pass');

    expect(events(result)).toContain('p1.replay.blocked');

    expect(events(result)).not.toContain('p1.replay.second_execution');

    expect(replayClassification(result)?.details.delegationReasons).toContain(
      'single_use_delegation_consumed',
    );
  });

  it('HP-REPLAY-001 fails against vulnerable target', async () => {
    const result = await runAttack(HP_REPLAY_001, 'vulnerable', 'p1-replay-001-vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(events(result)).toContain('p1.replay.bypassed');

    expect(events(result)).toContain('p1.replay.second_execution');
  });

  it('HP-REPLAY-002 passes against secure target', async () => {
    const result = await runAttack(HP_REPLAY_002, 'secure', 'p1-replay-002-secure');

    expect(result.finding.status).toBe('pass');

    const classified = replayClassification(result);

    expect(classified?.details.delegationReasons).toContain('task_mismatch');

    expect(classified?.details.delegationReasons).toContain('run_mismatch');
  });

  it('HP-REPLAY-002 fails against vulnerable target', async () => {
    const result = await runAttack(HP_REPLAY_002, 'vulnerable', 'p1-replay-002-vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(events(result)).toContain('p1.replay.bypassed');

    expect(events(result)).toContain('p1.replay.second_execution');
  });

  it('HP-REPLAY-003 passes against secure target', async () => {
    const result = await runAttack(HP_REPLAY_003, 'secure', 'p1-replay-003-secure');

    expect(result.finding.status).toBe('pass');

    expect(events(result)).toContain('p1.retry.acknowledgement_lost');

    expect(replayClassification(result)?.details.logicalActionCompleted).toBe(true);

    expect(events(result)).toContain('p1.replay.blocked');
  });

  it('HP-REPLAY-003 fails against vulnerable target', async () => {
    const result = await runAttack(HP_REPLAY_003, 'vulnerable', 'p1-replay-003-vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(events(result)).toContain('p1.retry.acknowledgement_lost');

    expect(events(result)).toContain('p1.replay.second_execution');
  });

  it('exact replay evidence is deterministic', async () => {
    const first = await runAttack(HP_REPLAY_001, 'secure', 'p1-replay-repeat-a');

    const second = await runAttack(HP_REPLAY_001, 'secure', 'p1-replay-repeat-b');

    expect(events(first)).toEqual(events(second));

    expect(first.evidence.map((event) => event.sequence)).toEqual(
      second.evidence.map((event) => event.sequence),
    );
  });

  it('retry evidence is deterministic', async () => {
    const first = await runAttack(HP_REPLAY_003, 'vulnerable', 'p1-retry-repeat-a');

    const second = await runAttack(HP_REPLAY_003, 'vulnerable', 'p1-retry-repeat-b');

    expect(first.finding.status).toBe('fail');

    expect(second.finding.status).toBe('fail');

    expect(events(first)).toEqual(events(second));
  });
});
