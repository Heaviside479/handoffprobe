import { describe, expect, it } from 'vitest';

import { CoreRunner, isSecurityFailure } from '../src/core/index.js';

import {
  HP_AUTH_001,
  HP_AUTH_002,
  HP_AUTH_003,
  P0_AUTHORIZATION_ATTACKS,
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

describe('productive P0 authorization attacks', () => {
  it('publishes the exact stable authorization P0 IDs', () => {
    expect(P0_AUTHORIZATION_ATTACKS.map((plan) => plan.attack.definition.id)).toEqual([
      'HP-AUTH-001',
      'HP-AUTH-002',
      'HP-AUTH-003',
    ]);

    for (const plan of P0_AUTHORIZATION_ATTACKS) {
      const definition = plan.attack.definition;

      expect(definition.priority).toBe('P0');

      expect(definition.defaultSeverity).toBe('high');

      expect(definition.propertyClass).toBe('composition_responsibility');

      expect(definition.applicability).toEqual({
        a2a: ['1.0'],
        mcp: ['2026-07-28'],
      });

      expect(definition.sourceReferences.length).toBeGreaterThanOrEqual(1);

      expect(definition.sideEffectClass).toBe('synthetic');

      expect(definition.destructive).toBe(false);
    }
  });

  it.each([
    ['HP-AUTH-001', HP_AUTH_001],
    ['HP-AUTH-002', HP_AUTH_002],
    ['HP-AUTH-003', HP_AUTH_003],
  ] as const)('%s passes against secure target', async (_id, plan) => {
    const result = await runPlan(plan, 'secure');

    expect(result.finding.status).toBe('pass');

    expect(isSecurityFailure(result.finding)).toBe(false);

    expect(result.finding.evidenceSequences.length).toBeGreaterThan(0);

    const authorization = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(authorization?.details).toMatchObject({
      authorizationResult: false,

      executed: false,

      policyMode: 'enforce',
    });

    expect(result.evidence.every((event) => event.testId === plan.attack.definition.id)).toBe(true);
  });

  it.each([
    ['HP-AUTH-001', HP_AUTH_001],
    ['HP-AUTH-002', HP_AUTH_002],
    ['HP-AUTH-003', HP_AUTH_003],
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

  it('HP-AUTH-001 proves read-to-update authority amplification', async () => {
    const result = await runPlan(HP_AUTH_001, 'secure');

    const handoff = result.evidence.find((event) => event.event === 'handoff.translate');

    expect(handoff?.details).toMatchObject({
      selectedTool: 'update_invoice',

      upstreamAuthority: {
        capabilities: ['invoice.read'],
      },

      translatedAuthority: {
        capabilities: ['invoice.update'],
      },
    });
  });

  it('HP-AUTH-002 proves missing authority plus broader fallback', async () => {
    const result = await runPlan(HP_AUTH_002, 'secure');

    const authorization = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(authorization?.details.upstreamAuthority).toBeUndefined();

    expect(authorization?.details.translatedAuthority).toMatchObject({
      capabilities: ['invoice.update'],
    });

    expect(authorization?.details.authorizationReasons).toContain('missing_upstream_authority');
  });

  it('HP-AUTH-003 proves billing authority reused by support', async () => {
    const result = await runPlan(HP_AUTH_003, 'secure');

    const handoff = result.evidence.find((event) => event.event === 'handoff.translate');

    expect(handoff?.details).toMatchObject({
      originalDownstream: 'agent:billing',

      translatedDownstream: 'agent:support',

      translatedAuthority: {
        delegate: 'agent:billing',
      },
    });

    const authorization = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(authorization?.details.authorizationReasons).toContain('delegate_mismatch');
  });

  it('all FAIL findings retain evidence and provenance', async () => {
    for (const plan of P0_AUTHORIZATION_ATTACKS) {
      const result = await runPlan(plan, 'vulnerable');

      expect(result.finding.evidenceSequences.length).toBeGreaterThanOrEqual(3);

      expect(result.finding.sources).toEqual(plan.attack.definition.sourceReferences);

      expect(result.evidence.every((event) => event.provenance.length >= 1)).toBe(true);
    }
  });
});
