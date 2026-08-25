import { describe, expect, it } from 'vitest';

import { CoreRunner, isSecurityFailure } from '../src/core/index.js';

import {
  HP_CRED_001,
  HP_CRED_002,
  P0_CREDENTIAL_ATTACKS,
  P0_CREDENTIAL_BASELINE,
} from '../src/attacks/index.js';

import type { P0AttackPlan } from '../src/attacks/index.js';

import { P0TargetAdapter } from '../src/p0-fixture/index.js';

async function run(plan: P0AttackPlan, fixture: 'secure' | 'vulnerable') {
  return new CoreRunner().run({
    attack: plan.attack,

    target: new P0TargetAdapter(fixture, plan.scenario, plan.handoffAdapter),

    context: plan.createContext(),

    runId: `p0-${plan.attack.definition.id.toLowerCase()}-${fixture}`,
  });
}

describe('productive P0 credential attacks', () => {
  it('publishes stable credential IDs', () => {
    expect(P0_CREDENTIAL_ATTACKS.map((plan) => plan.attack.definition.id)).toEqual([
      'HP-CRED-001',
      'HP-CRED-002',
    ]);

    expect(HP_CRED_001.attack.definition.defaultSeverity).toBe('medium');

    expect(HP_CRED_002.attack.definition.defaultSeverity).toBe('high');
  });

  it('HP-CRED-001 blocks broad bearer before MCP in secure fixture', async () => {
    const result = await run(HP_CRED_001, 'secure');

    expect(result.finding.status).toBe('pass');

    const forwarding = result.evidence.find((event) => event.event === 'p0.credential.forwarding');

    expect(forwarding?.details).toMatchObject({
      credentialFingerprint: P0_CREDENTIAL_BASELINE.fingerprint,

      credentialClass: 'bearer',

      originalAudience: P0_CREDENTIAL_BASELINE.expectedAudience,

      downstreamAudience: P0_CREDENTIAL_BASELINE.expectedAudience,

      audienceMatches: true,

      forwardingDecision: 'blocked',
    });

    const downstream = result.evidence.filter(
      (event) => event.protocol === 'MCP' || event.protocol === 'TOOL',
    );

    expect(JSON.stringify(downstream)).not.toContain(P0_CREDENTIAL_BASELINE.fingerprint);
  });

  it('HP-CRED-001 fails when vulnerable handoff forwards bearer', async () => {
    const result = await run(HP_CRED_001, 'vulnerable');

    expect(result.finding.status).toBe('fail');

    const auth = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(auth?.details).toMatchObject({
      credentialForwarded: true,

      credentialAudienceMatches: true,

      credentialAccepted: true,
    });
  });

  it('HP-CRED-002 blocks billing credential at support audience in secure fixture', async () => {
    const result = await run(HP_CRED_002, 'secure');

    expect(result.finding.status).toBe('pass');

    const forwarding = result.evidence.find((event) => event.event === 'p0.credential.forwarding');

    expect(forwarding?.details).toMatchObject({
      originalAudience: P0_CREDENTIAL_BASELINE.expectedAudience,

      downstreamAudience: P0_CREDENTIAL_BASELINE.alternateAudience,

      audienceMatches: false,

      forwardingDecision: 'blocked',
    });
  });

  it('HP-CRED-002 proves cross-audience acceptance in vulnerable fixture', async () => {
    const result = await run(HP_CRED_002, 'vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(isSecurityFailure(result.finding)).toBe(true);

    const auth = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(auth?.details).toMatchObject({
      downstreamAudience: P0_CREDENTIAL_BASELINE.alternateAudience,

      credentialAudience: P0_CREDENTIAL_BASELINE.expectedAudience,

      credentialAudienceMatches: false,

      credentialAccepted: true,

      authorizationResult: false,

      executed: true,

      policyMode: 'bypass',
    });

    expect(auth?.details.authorizationReasons).toContain('credential_audience_mismatch');
  });

  it('never records a raw bearer token', async () => {
    for (const plan of P0_CREDENTIAL_ATTACKS) {
      const result = await run(plan, 'vulnerable');

      const serialized = JSON.stringify(result.evidence);

      expect(serialized).not.toContain('Bearer ');

      expect(serialized).toContain(P0_CREDENTIAL_BASELINE.fingerprint);
    }
  });
});
