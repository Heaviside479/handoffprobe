import { describe, expect, it } from 'vitest';

import { CoreRunner, isSecurityFailure } from '../src/core/index.js';

import {
  HP_TENANT_001,
  HP_TENANT_001_LOSS,
  P0_TENANT_001_VARIANTS,
  P0_TENANT_BASELINE,
} from '../src/attacks/index.js';

import type { P0AttackPlan } from '../src/attacks/index.js';

import { P0TargetAdapter } from '../src/p0-fixture/index.js';

async function runVariant(plan: P0AttackPlan, fixture: 'secure' | 'vulnerable', variant: string) {
  return new CoreRunner().run({
    attack: plan.attack,

    target: new P0TargetAdapter(fixture, plan.scenario, plan.handoffAdapter),

    context: plan.createContext(),

    runId: `p0-hp-tenant-001-${variant}-${fixture}`,
  });
}

describe('productive HP-TENANT-001 attack', () => {
  it('publishes one stable mandatory P0 ID with both required mutation variants', () => {
    expect(HP_TENANT_001.attack.definition.id).toBe('HP-TENANT-001');

    expect(HP_TENANT_001.attack.definition.defaultSeverity).toBe('high');

    expect(P0_TENANT_001_VARIANTS).toHaveLength(2);

    expect(
      P0_TENANT_001_VARIANTS.every((plan) => plan.attack.definition.id === 'HP-TENANT-001'),
    ).toBe(true);
  });

  it.each([
    ['loss', HP_TENANT_001_LOSS],
    ['substitution', HP_TENANT_001],
  ] as const)('tenant %s variant passes against secure target', async (variant, plan) => {
    const result = await runVariant(plan, 'secure', variant);

    expect(result.finding.status).toBe('pass');

    expect(isSecurityFailure(result.finding)).toBe(false);

    const authorization = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(authorization?.details).toMatchObject({
      authorizationResult: false,

      executed: false,

      policyMode: 'enforce',
    });
  });

  it('tenant-loss variant fails HIGH when vulnerable execution proceeds without tenant context', async () => {
    const result = await runVariant(HP_TENANT_001_LOSS, 'vulnerable', 'loss');

    expect(result.finding.status).toBe('fail');

    expect(result.finding.severity).toBe('high');

    const handoff = result.evidence.find((event) => event.event === 'handoff.translate');

    expect(handoff?.details).toMatchObject({
      originalTenant: P0_TENANT_BASELINE.authorized,

      translatedTenant: '',
    });
  });

  it('Acme-to-Globex substitution produces CRITICAL on actual cross-tenant protected access', async () => {
    const result = await runVariant(HP_TENANT_001, 'vulnerable', 'substitution');

    expect(result.finding.status).toBe('fail');

    expect(result.finding.severity).toBe('critical');

    expect(isSecurityFailure(result.finding)).toBe(true);

    const handoff = result.evidence.find((event) => event.event === 'handoff.translate');

    expect(handoff?.details).toMatchObject({
      originalTenant: P0_TENANT_BASELINE.authorized,

      translatedTenant: P0_TENANT_BASELINE.unauthorized,

      translatedResource: P0_TENANT_BASELINE.unauthorizedResource,
    });

    const resultEvent = result.evidence.find((event) => event.event === 'p0.tool.result');

    expect(resultEvent?.details.executed).toBe(true);

    const serialized = JSON.stringify(resultEvent?.details.sideEffectStateAfter);

    expect(serialized).toContain('"tenant":"tenant:globex"');
  });

  it('both variants retain evidence and provenance', async () => {
    for (const [index, plan] of P0_TENANT_001_VARIANTS.entries()) {
      const result = await runVariant(plan, 'vulnerable', `variant-${index}`);

      expect(result.finding.evidenceSequences.length).toBeGreaterThanOrEqual(3);

      expect(
        result.evidence.every(
          (event) => event.testId === 'HP-TENANT-001' && event.provenance.length >= 1,
        ),
      ).toBe(true);
    }
  });
});
