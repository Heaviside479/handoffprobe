import { describe, expect, it } from 'vitest';

import { HP_APPROVAL_002, HP_APPROVAL_003 } from '../src/attacks/p1/index.js';

import type { P1ApprovalAttackPlan } from '../src/attacks/p1/index.js';

import { CoreRunner } from '../src/core/index.js';

import { P1ApprovalTargetAdapter } from '../src/p1-fixture/index.js';

import type { P1FixtureMode } from '../src/p1-fixture/index.js';

async function runAttack(plan: P1ApprovalAttackPlan, fixture: P1FixtureMode, runId: string) {
  return new CoreRunner().run({
    attack: plan.attack,

    target: new P1ApprovalTargetAdapter(fixture, plan.scenario),

    context: plan.createContext(),

    runId,
  });
}

function events(result: Awaited<ReturnType<typeof runAttack>>): string[] {
  return result.evidence.map((event) => event.event);
}

function bindingEvent(result: Awaited<ReturnType<typeof runAttack>>) {
  return result.evidence.find((event) => event.event === 'p1.approval.binding');
}

describe('P1 approval attacks', () => {
  it('registers both stable approval IDs', () => {
    expect(HP_APPROVAL_002.attack.definition.id).toBe('HP-APPROVAL-002');

    expect(HP_APPROVAL_003.attack.definition.id).toBe('HP-APPROVAL-003');

    expect(HP_APPROVAL_002.attack.definition.priority).toBe('P1');

    expect(HP_APPROVAL_003.attack.definition.priority).toBe('P1');
  });

  it('HP-APPROVAL-002 passes against secure target', async () => {
    const result = await runAttack(HP_APPROVAL_002, 'secure', 'p1-approval-002-secure');

    expect(result.finding.status).toBe('pass');

    expect(events(result)).toContain('p1.approval.blocked');

    expect(events(result)).not.toContain('mcp.tool.call');

    const binding = bindingEvent(result);

    expect(binding?.details.contextApprovalMatches).toBe(true);

    expect(binding?.details.toolMatches).toBe(false);

    expect(binding?.details.resourceMatches).toBe(true);
  });

  it('HP-APPROVAL-002 fails against vulnerable target', async () => {
    const result = await runAttack(HP_APPROVAL_002, 'vulnerable', 'p1-approval-002-vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(events(result)).toContain('p1.approval.bypassed');

    expect(events(result)).toContain('mcp.tool.call');
  });

  it('HP-APPROVAL-003 passes against secure target', async () => {
    const result = await runAttack(HP_APPROVAL_003, 'secure', 'p1-approval-003-secure');

    expect(result.finding.status).toBe('pass');

    const binding = bindingEvent(result);

    expect(binding?.details.contextApprovalMatches).toBe(true);

    expect(binding?.details.toolMatches).toBe(true);

    expect(binding?.details.resourceMatches).toBe(false);

    expect(binding?.details.approvedResource).toBe('invoice:INV-1001');

    expect(binding?.details.executedResource).toBe('invoice:INV-1003');
  });

  it('HP-APPROVAL-003 fails against vulnerable target', async () => {
    const result = await runAttack(HP_APPROVAL_003, 'vulnerable', 'p1-approval-003-vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(events(result)).toContain('p1.approval.bypassed');

    expect(events(result)).toContain('mcp.tool.call');
  });

  it('tool-substitution evidence is deterministic', async () => {
    const first = await runAttack(HP_APPROVAL_002, 'secure', 'p1-approval-002-repeat-a');

    const second = await runAttack(HP_APPROVAL_002, 'secure', 'p1-approval-002-repeat-b');

    expect(events(first)).toEqual(events(second));

    expect(first.evidence.map((event) => event.sequence)).toEqual(
      second.evidence.map((event) => event.sequence),
    );
  });

  it('resource-reuse evidence is deterministic', async () => {
    const first = await runAttack(HP_APPROVAL_003, 'vulnerable', 'p1-approval-003-repeat-a');

    const second = await runAttack(HP_APPROVAL_003, 'vulnerable', 'p1-approval-003-repeat-b');

    expect(first.finding.status).toBe('fail');

    expect(second.finding.status).toBe('fail');

    expect(events(first)).toEqual(events(second));
  });
});
