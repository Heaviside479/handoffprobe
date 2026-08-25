import { describe, expect, it } from 'vitest';

import { CoreRunner, isSecurityFailure } from '../src/core/index.js';

import {
  HP_APPROVAL_001,
  HP_APPROVAL_001_AMOUNT,
  P0_APPROVAL_001_VARIANTS,
} from '../src/attacks/index.js';

import type { P0AttackPlan } from '../src/attacks/index.js';

import { P0TargetAdapter } from '../src/p0-fixture/index.js';

async function run(plan: P0AttackPlan, fixture: 'secure' | 'vulnerable', variant: string) {
  return new CoreRunner().run({
    attack: plan.attack,

    target: new P0TargetAdapter(fixture, plan.scenario, plan.handoffAdapter),

    context: plan.createContext(),

    runId: `p0-hp-approval-001-${variant}-${fixture}`,
  });
}

describe('productive HP-APPROVAL-001', () => {
  it('publishes one stable ID with both mandatory mutations', () => {
    expect(P0_APPROVAL_001_VARIANTS).toHaveLength(2);

    expect(
      P0_APPROVAL_001_VARIANTS.every((plan) => plan.attack.definition.id === 'HP-APPROVAL-001'),
    ).toBe(true);
  });

  it.each([
    ['amount', HP_APPROVAL_001_AMOUNT],
    ['recipient', HP_APPROVAL_001],
  ] as const)('%s mutation: secure PASS', async (variant, plan) => {
    const result = await run(plan, 'secure', variant);

    expect(result.finding.status).toBe('pass');

    expect(isSecurityFailure(result.finding)).toBe(false);

    const auth = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(auth?.details).toMatchObject({
      approvalMatches: false,

      authorizationResult: false,

      executed: false,

      policyMode: 'enforce',
    });
  });

  it.each([
    ['amount', HP_APPROVAL_001_AMOUNT],
    ['recipient', HP_APPROVAL_001],
  ] as const)('%s mutation: vulnerable FAIL', async (variant, plan) => {
    const result = await run(plan, 'vulnerable', variant);

    expect(result.finding.status).toBe('fail');

    expect(isSecurityFailure(result.finding)).toBe(true);

    const tool = result.evidence.find((event) => event.event === 'p0.tool.result');

    expect(tool?.details.executed).toBe(true);
  });

  it('approved and executed payload hashes differ', async () => {
    const result = await run(HP_APPROVAL_001_AMOUNT, 'vulnerable', 'hash');

    const tool = result.evidence.find((event) => event.event === 'p0.tool.result');

    const output = tool?.details.output as
      | {
          approvedPayloadHash?: unknown;

          executedPayloadHash?: unknown;
        }
      | undefined;

    expect(typeof output?.approvedPayloadHash).toBe('string');

    expect(typeof output?.executedPayloadHash).toBe('string');

    expect(output?.approvedPayloadHash).not.toBe(output?.executedPayloadHash);
  });
});
