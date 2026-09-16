import { describe, expect, it } from 'vitest';

import { HP_AUTH_006 } from '../src/attacks/p1/index.js';

import { CoreRunner } from '../src/core/index.js';

import {
  P1PerEffectAuthorizationTargetAdapter,
  type P1FixtureMode,
} from '../src/p1-fixture/index.js';

async function runAttack(fixture: P1FixtureMode, runId: string) {
  const runner = new CoreRunner();

  return runner.run({
    attack: HP_AUTH_006.attack,
    target: new P1PerEffectAuthorizationTargetAdapter(fixture, HP_AUTH_006.scenario),
    context: HP_AUTH_006.createContext(),
    runId,
  });
}

function eventNames(result: Awaited<ReturnType<typeof runAttack>>): string[] {
  return result.evidence.map((event) => event.event);
}

function summary(result: Awaited<ReturnType<typeof runAttack>>) {
  return result.evidence.find((event) => event.event === 'p1.per_effect.summary');
}

describe('v0.4.0 HP-AUTH-006 stable implementation candidate', () => {
  it('defines the admitted distinct per-effect authorization invariant', () => {
    expect(HP_AUTH_006.attack.definition.id).toBe('HP-AUTH-006');
    expect(HP_AUTH_006.attack.definition.name).toBe(
      'Stale task authorization reused for later effect',
    );
    expect(HP_AUTH_006.attack.definition.priority).toBe('advanced');
    expect(HP_AUTH_006.attack.definition.propertyClass).toBe('composition_responsibility');
  });

  it('passes securely after exactly one protected effect', async () => {
    const result = await runAttack('secure', 'v0.4-auth-006-secure');

    expect(result.error).toBeUndefined();
    expect(result.finding.status).toBe('pass');
    expect(eventNames(result)).toContain('p1.per_effect.invalidate');
    expect(eventNames(result)).toContain('p1.per_effect.blocked');
    expect(eventNames(result)).not.toContain('p1.per_effect.authorization_reused');
    expect(eventNames(result).filter((name) => name === 'mcp.tool.call')).toHaveLength(1);

    expect(summary(result)?.details).toMatchObject({
      firstActionId: 'action:AUTH-006-A',
      secondActionId: 'action:AUTH-006-B',
      firstEffectDelta: 1,
      secondEffectDelta: 0,
      protectedEffectDelta: 1,
      firstEffectExecuted: true,
      secondEffectExecuted: false,
    });
  });

  it('reproduces FAIL when stale task authorization is reused for effect B', async () => {
    const result = await runAttack('vulnerable', 'v0.4-auth-006-vulnerable');

    expect(result.error).toBeUndefined();
    expect(result.finding.status).toBe('fail');
    expect(eventNames(result)).toContain('p1.per_effect.authorization_reused');
    expect(eventNames(result)).not.toContain('p1.per_effect.blocked');
    expect(eventNames(result).filter((name) => name === 'mcp.tool.call')).toHaveLength(2);

    expect(summary(result)?.details).toMatchObject({
      firstActionId: 'action:AUTH-006-A',
      secondActionId: 'action:AUTH-006-B',
      firstEffectDelta: 1,
      secondEffectDelta: 1,
      protectedEffectDelta: 2,
      firstEffectExecuted: true,
      secondEffectExecuted: true,
    });
  });

  it('proves effect A and effect B are distinct while task/run/context stay fixed', async () => {
    const result = await runAttack('vulnerable', 'v0.4-auth-006-distinct-effects');

    const authorizations = result.evidence.filter(
      (event) => event.event === 'p1.per_effect.authorization',
    );

    expect(authorizations).toHaveLength(2);

    expect(authorizations[0]?.details).toMatchObject({
      phase: 'effect_a',
      actionId: 'action:AUTH-006-A',
      contextId: 'context:AUTH-006',
      taskId: 'task:AUTH-006',
      runId: 'run:AUTH-006',
      allowed: true,
    });

    expect(authorizations[1]?.details).toMatchObject({
      phase: 'effect_b',
      actionId: 'action:AUTH-006-B',
      contextId: 'context:AUTH-006',
      taskId: 'task:AUTH-006',
      runId: 'run:AUTH-006',
      allowed: false,
      invalidated: true,
    });

    expect(authorizations[1]?.details.reasons).toContain('delegation_invalidated');

    expect(summary(result)?.details.firstScenarioId).not.toBe(
      summary(result)?.details.secondScenarioId,
    );
  });

  it('keeps secure and vulnerable evidence ordering deterministic', async () => {
    for (const fixture of ['secure', 'vulnerable'] as const) {
      const first = await runAttack(fixture, `v0.4-auth-006-${fixture}-a`);
      const second = await runAttack(fixture, `v0.4-auth-006-${fixture}-b`);

      expect(first.finding.status).toBe(fixture === 'secure' ? 'pass' : 'fail');
      expect(second.finding.status).toBe(fixture === 'secure' ? 'pass' : 'fail');
      expect(eventNames(first)).toEqual(eventNames(second));
      expect(first.evidence.map((event) => event.sequence)).toEqual(
        second.evidence.map((event) => event.sequence),
      );
    }
  });
});
