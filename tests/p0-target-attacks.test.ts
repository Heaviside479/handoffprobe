import { describe, expect, it } from 'vitest';

import { CoreRunner, isSecurityFailure } from '../src/core/index.js';

import {
  HP_TARGET_001,
  HP_TARGET_002,
  P0_TARGET_ATTACKS,
  P0_TARGET_BASELINE,
} from '../src/attacks/index.js';

import type { P0AttackPlan } from '../src/attacks/index.js';

import { P0TargetAdapter } from '../src/p0-fixture/index.js';

async function runPlan(plan: P0AttackPlan, fixture: 'secure' | 'vulnerable') {
  return new CoreRunner().run({
    attack: plan.attack,

    target: new P0TargetAdapter(fixture, plan.scenario, plan.handoffAdapter),

    context: plan.createContext(),

    runId: `p0-${plan.attack.definition.id.toLowerCase()}-${fixture}`,
  });
}

describe('productive P0 target attacks', () => {
  it('publishes the exact stable target P0 IDs', () => {
    expect(P0_TARGET_ATTACKS.map((plan) => plan.attack.definition.id)).toEqual([
      'HP-TARGET-001',
      'HP-TARGET-002',
    ]);

    for (const plan of P0_TARGET_ATTACKS) {
      expect(plan.attack.definition.defaultSeverity).toBe('high');

      expect(plan.attack.definition.priority).toBe('P0');
    }
  });

  it.each([
    ['HP-TARGET-001', HP_TARGET_001],
    ['HP-TARGET-002', HP_TARGET_002],
  ] as const)('%s passes against secure target', async (_id, plan) => {
    const result = await runPlan(plan, 'secure');

    expect(result.finding.status).toBe('pass');

    expect(isSecurityFailure(result.finding)).toBe(false);

    const authorization = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(authorization?.details).toMatchObject({
      authorizationResult: false,

      executed: false,

      policyMode: 'enforce',
    });
  });

  it.each([
    ['HP-TARGET-001', HP_TARGET_001],
    ['HP-TARGET-002', HP_TARGET_002],
  ] as const)('%s produces reproducible FAIL against vulnerable target', async (_id, plan) => {
    const first = await runPlan(plan, 'vulnerable');

    const second = await runPlan(plan, 'vulnerable');

    expect(first.finding.status).toBe('fail');

    expect(isSecurityFailure(first.finding)).toBe(true);

    const authorization = first.evidence.find((event) => event.event === 'p0.authorization');

    expect(authorization?.details).toMatchObject({
      authorizationResult: false,

      executed: true,

      policyMode: 'bypass',
    });

    expect(
      first.evidence.map((event) => ({
        sequence: event.sequence,
        protocol: event.protocol,
        event: event.event,
        boundary: event.boundary,
      })),
    ).toEqual(
      second.evidence.map((event) => ({
        sequence: event.sequence,
        protocol: event.protocol,
        event: event.event,
        boundary: event.boundary,
      })),
    );
  });

  it('HP-TARGET-001 proves INV-1001 authority was moved to INV-2002', async () => {
    const result = await runPlan(HP_TARGET_001, 'secure');

    const handoff = result.evidence.find((event) => event.event === 'handoff.translate');

    expect(handoff?.details).toMatchObject({
      originalResource: P0_TARGET_BASELINE.grantedResource,

      translatedResource: P0_TARGET_BASELINE.alternateResource,

      upstreamAuthority: {
        resources: [P0_TARGET_BASELINE.grantedResource],
      },

      translatedAuthority: {
        resources: [P0_TARGET_BASELINE.alternateResource],
      },
    });
  });

  it('HP-TARGET-002 keeps invoice.read authority while selecting update_invoice', async () => {
    const result = await runPlan(HP_TARGET_002, 'secure');

    const handoff = result.evidence.find((event) => event.event === 'handoff.translate');

    expect(handoff?.details).toMatchObject({
      selectedTool: 'update_invoice',

      upstreamAuthority: {
        capabilities: [P0_TARGET_BASELINE.narrowCapability],
      },

      translatedAuthority: {
        capabilities: [P0_TARGET_BASELINE.narrowCapability],
      },
    });

    const authorization = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(authorization?.details.authorizationReasons).toContain(
      'tool_capability_semantic_mismatch',
    );

    expect(authorization?.details.authorizationReasons).toContain('capability_not_granted');

    expect(authorization?.details.semanticBindingMatches).toBe(false);
  });

  it('all target findings retain evidence and provenance', async () => {
    for (const plan of P0_TARGET_ATTACKS) {
      const result = await runPlan(plan, 'vulnerable');

      expect(result.finding.evidenceSequences.length).toBeGreaterThanOrEqual(3);

      expect(result.finding.sources).toEqual(plan.attack.definition.sourceReferences);

      expect(result.evidence.every((event) => event.provenance.length >= 1)).toBe(true);
    }
  });
});
