import { describe, expect, it } from 'vitest';

import { CoreRunner, isSecurityFailure } from '../src/core/index.js';

import {
  HP_ID_001,
  HP_ID_002,
  P0_IDENTITY_ATTACKS,
  P0_IDENTITY_BASELINE,
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

describe('productive P0 identity attacks', () => {
  it('publishes the exact stable identity P0 IDs and severities', () => {
    expect(P0_IDENTITY_ATTACKS.map((plan) => plan.attack.definition.id)).toEqual([
      'HP-ID-001',
      'HP-ID-002',
    ]);

    expect(HP_ID_001.attack.definition.defaultSeverity).toBe('medium');

    expect(HP_ID_002.attack.definition.defaultSeverity).toBe('high');

    for (const plan of P0_IDENTITY_ATTACKS) {
      const definition = plan.attack.definition;

      expect(definition.priority).toBe('P0');

      expect(definition.category).toBe('identity');

      expect(definition.propertyClass).toBe('composition_responsibility');

      expect(definition.applicability).toEqual({
        a2a: ['1.0'],

        mcp: ['2026-07-28'],
      });

      expect(definition.sideEffectClass).toBe('synthetic');

      expect(definition.destructive).toBe(false);
    }
  });

  it.each([
    ['HP-ID-001', HP_ID_001],
    ['HP-ID-002', HP_ID_002],
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

    expect(result.evidence.every((event) => event.testId === plan.attack.definition.id)).toBe(true);
  });

  it.each([
    ['HP-ID-001', HP_ID_001],
    ['HP-ID-002', HP_ID_002],
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

  it('HP-ID-001 proves loss of user:alice across the handoff boundary', async () => {
    const result = await runPlan(HP_ID_001, 'secure');

    const handoff = result.evidence.find((event) => event.event === 'handoff.translate');

    expect(handoff?.details).toMatchObject({
      originalPrincipal: P0_IDENTITY_BASELINE.originalPrincipal,

      translatedPrincipal: P0_IDENTITY_BASELINE.authorizedAgent,

      upstreamAuthority: {
        principal: P0_IDENTITY_BASELINE.originalPrincipal,
      },

      translatedAuthority: {
        principal: P0_IDENTITY_BASELINE.authorizedAgent,
      },

      selectedTool: 'update_invoice',
    });

    const authorization = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(authorization?.details.authorizationReasons).toContain(
      'authority_amplification_or_binding_change',
    );
  });

  it('HP-ID-001 raises a proven meaningful bypass from MEDIUM to HIGH', async () => {
    const secure = await runPlan(HP_ID_001, 'secure');

    const vulnerable = await runPlan(HP_ID_001, 'vulnerable');

    expect(secure.finding.severity).toBe('medium');

    expect(vulnerable.finding.severity).toBe('high');

    expect(vulnerable.finding.status).toBe('fail');
  });

  it('HP-ID-002 proves agent:billing was replaced by agent:support while old authority remained bound', async () => {
    const result = await runPlan(HP_ID_002, 'secure');

    const handoff = result.evidence.find((event) => event.event === 'handoff.translate');

    expect(handoff?.details).toMatchObject({
      originalDownstream: P0_IDENTITY_BASELINE.authorizedAgent,

      translatedDownstream: P0_IDENTITY_BASELINE.unauthorizedAgent,

      translatedAuthority: {
        delegate: P0_IDENTITY_BASELINE.authorizedAgent,
      },

      selectedTool: 'update_invoice',
    });

    const authorization = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(authorization?.details.authorizationReasons).toContain('delegate_mismatch');
  });

  it('all identity findings retain evidence and provenance', async () => {
    for (const plan of P0_IDENTITY_ATTACKS) {
      const result = await runPlan(plan, 'vulnerable');

      expect(result.finding.evidenceSequences.length).toBeGreaterThanOrEqual(3);

      expect(result.finding.sources).toEqual(plan.attack.definition.sourceReferences);

      expect(result.evidence.every((event) => event.provenance.length >= 1)).toBe(true);
    }
  });
});
