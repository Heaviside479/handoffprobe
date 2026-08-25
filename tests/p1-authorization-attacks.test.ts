import { describe, expect, it } from 'vitest';

import { HP_AUTH_004, HP_AUTH_005 } from '../src/attacks/p1/index.js';

import type { P1AttackPlan } from '../src/attacks/p1/index.js';

import { CoreRunner } from '../src/core/index.js';

import { P1AuthorizationTargetAdapter } from '../src/p1-fixture/index.js';

import type { P1FixtureMode } from '../src/p1-fixture/index.js';

async function runAttack(plan: P1AttackPlan, fixture: P1FixtureMode, runId: string) {
  const runner = new CoreRunner();

  return runner.run({
    attack: plan.attack,

    target: new P1AuthorizationTargetAdapter(fixture, plan.scenario),

    context: plan.createContext(),

    runId,
  });
}

function eventNames(result: Awaited<ReturnType<typeof runAttack>>): string[] {
  return result.evidence.map((event) => event.event);
}

describe('P1 authorization attacks', () => {
  it('registers stable P1 definitions', () => {
    expect(HP_AUTH_004.attack.definition.id).toBe('HP-AUTH-004');

    expect(HP_AUTH_005.attack.definition.id).toBe('HP-AUTH-005');

    expect(HP_AUTH_004.attack.definition.priority).toBe('P1');

    expect(HP_AUTH_005.attack.definition.priority).toBe('P1');
  });

  it('HP-AUTH-004 passes against secure target', async () => {
    const result = await runAttack(HP_AUTH_004, 'secure', 'p1-auth-004-secure');

    expect(result.finding.status).toBe('pass');

    expect(result.finding.severity).toBe('high');

    expect(eventNames(result)).toContain('p1.authorization.blocked');

    expect(eventNames(result)).not.toContain('mcp.tool.call');
  });

  it('HP-AUTH-004 produces reproducible FAIL against vulnerable target', async () => {
    const result = await runAttack(HP_AUTH_004, 'vulnerable', 'p1-auth-004-vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(eventNames(result)).toContain('p1.authorization.bypassed');

    expect(eventNames(result)).toContain('mcp.tool.call');

    const authorization = result.evidence.find((event) => event.event === 'p1.authorization');

    expect(authorization?.details.expired).toBe(true);

    expect(authorization?.details.reasons).toContain('delegation_expired');
  });

  it('HP-AUTH-005 passes against secure target', async () => {
    const result = await runAttack(HP_AUTH_005, 'secure', 'p1-auth-005-secure');

    expect(result.finding.status).toBe('pass');

    expect(eventNames(result)).toContain('p1.authorization.blocked');

    expect(eventNames(result)).not.toContain('mcp.tool.call');
  });

  it('HP-AUTH-005 produces reproducible FAIL against vulnerable target', async () => {
    const result = await runAttack(HP_AUTH_005, 'vulnerable', 'p1-auth-005-vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(eventNames(result)).toContain('p1.authorization.bypassed');

    expect(eventNames(result)).toContain('mcp.tool.call');

    const authorization = result.evidence.find((event) => event.event === 'p1.authorization');

    expect(authorization?.details.chainMatches).toBe(false);

    expect(authorization?.details.reasons).toContain('delegation_chain_mismatch');
  });

  it('keeps secure expiry evidence deterministic', async () => {
    const first = await runAttack(HP_AUTH_004, 'secure', 'p1-auth-004-repeat-a');

    const second = await runAttack(HP_AUTH_004, 'secure', 'p1-auth-004-repeat-b');

    expect(eventNames(first)).toEqual(eventNames(second));

    expect(first.evidence.map((event) => event.sequence)).toEqual(
      second.evidence.map((event) => event.sequence),
    );
  });

  it('keeps vulnerable chain-truncation evidence deterministic', async () => {
    const first = await runAttack(HP_AUTH_005, 'vulnerable', 'p1-auth-005-repeat-a');

    const second = await runAttack(HP_AUTH_005, 'vulnerable', 'p1-auth-005-repeat-b');

    expect(first.finding.status).toBe('fail');

    expect(second.finding.status).toBe('fail');

    expect(eventNames(first)).toEqual(eventNames(second));

    expect(first.evidence.map((event) => event.sequence)).toEqual(
      second.evidence.map((event) => event.sequence),
    );
  });
});
