import { createPrivateKey, type KeyObject } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { applyCrossingCaseMutations } from '../src/phase9/crossing-corpus/case-builder.js';
import { verifyObservedCrossing } from '../src/phase9/crossing-corpus/binding.js';
import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
import {
  CrossingPreDispatchRejectedError,
  type CrossingPreDispatchGate,
} from '../src/phase9/crossing-corpus/gate.js';
import {
  createSyntheticCrossingIssuerFixture,
  createSyntheticCrossingIssuerVerificationContext,
  signCrossingAuthority,
  verifyCrossingAuthorityIssuerAuthentication,
} from '../src/phase9/crossing-corpus/issuer-authentication.js';
import {
  loadPinnedCrossingCorpus,
  type CrossingCorpusCase,
} from '../src/phase9/crossing-corpus/loader.js';
import { toExternalCrossingObservedShape } from '../src/phase9/crossing-corpus/observation.js';
import { createCrossingProvenanceState } from '../src/phase9/crossing-corpus/provenance.js';
import {
  rebindCrossingCorpusBase,
  type CrossingAuthorityBundle,
  type CrossingStatusRecord,
} from '../src/phase9/crossing-corpus/rebinding.js';
import {
  SharedCrossingReplayStore,
  digestCrossingJson,
  verifyCrossingAuthority,
  type CrossingAuthority,
  type CrossingReference,
} from '../src/phase9/crossing-corpus/verifier.js';
import { runProtocolFixture } from '../src/protocol-lab/fixture.js';

const NOW = '2026-08-23T12:00:00Z';
const FORGED_NONCE = 'nonce-non-issuer-forgery-001';

const ED25519_PKCS8_SEED_PREFIX = '302e020100300506032b657004220420';
const ATTACKER_SEED_HEX = '4ccd089b28ff96da9db6c346ec114e0f5b8a319f35aba624da8cf6ed4fb8a6fb';

function attackerPrivateKey(): KeyObject {
  return createPrivateKey({
    key: Buffer.from(ED25519_PKCS8_SEED_PREFIX + ATTACKER_SEED_HEX, 'hex'),
    format: 'der',
    type: 'pkcs8',
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && Array.isArray(value) === false;
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8')) as unknown;
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (isRecord(value) === false) {
    throw new Error(label + ' must be an object.');
  }

  return value;
}

function loadPinnedAuthorityBundle(path: string): CrossingAuthorityBundle {
  const base = requireRecord(readJson(path), 'Pinned crossing base vector');

  return {
    initial_reference: structuredClone(
      requireRecord(base.initial_reference, 'initial_reference'),
    ) as unknown as CrossingReference,
    initial_authority: structuredClone(
      requireRecord(base.initial_authority, 'initial_authority'),
    ) as unknown as CrossingAuthority,
    reference: structuredClone(
      requireRecord(base.reference, 'reference'),
    ) as unknown as CrossingReference,
    authority: structuredClone(
      requireRecord(base.authority, 'authority'),
    ) as unknown as CrossingAuthority,
  };
}

function loadPinnedStatus(path: string): CrossingStatusRecord {
  return structuredClone(
    requireRecord(readJson(path), 'Pinned crossing status'),
  ) as unknown as CrossingStatusRecord;
}

function requireValidCrossing(cases: readonly CrossingCorpusCase[]): CrossingCorpusCase {
  const matches = cases.filter(
    (corpusCase) =>
      corpusCase.id === 'valid_crossing' &&
      corpusCase.kind === 'valid_control' &&
      corpusCase.attempts === 1 &&
      corpusCase.mutations.length === 0,
  );

  if (matches.length !== 1 || matches[0] === undefined) {
    throw new Error('Expected exactly one valid_crossing control.');
  }

  return matches[0];
}

function requireAdaptedBundle(value: Record<string, unknown>): CrossingAuthorityBundle {
  return {
    initial_reference: requireRecord(
      value.initial_reference,
      'adapted initial_reference',
    ) as unknown as CrossingReference,
    initial_authority: requireRecord(
      value.initial_authority,
      'adapted initial_authority',
    ) as unknown as CrossingAuthority,
    reference: requireRecord(value.reference, 'adapted reference') as unknown as CrossingReference,
    authority: requireRecord(value.authority, 'adapted authority') as unknown as CrossingAuthority,
  };
}

function requireAdaptedStatus(value: Record<string, unknown>): CrossingStatusRecord {
  return requireRecord(value, 'adapted status') as unknown as CrossingStatusRecord;
}

describe('Phase 9 issuer-authenticated non-issuer forgery control', () => {
  it('rejects a non-issuer after every unkeyed digest is recomputed correctly and before effect', async () => {
    const corpus = loadPinnedCrossingCorpus();
    const control = requireValidCrossing(corpus.cases.cases);
    const pinnedBundle = loadPinnedAuthorityBundle(resolve(corpus.root, corpus.cases.base_vector));
    const pinnedStatus = loadPinnedStatus(resolve(corpus.root, control.status_vector));

    expect(corpus.cases.cases).toHaveLength(28);
    expect(control.expected_bound).toBe('succeed');
    expect(control.expected_reason).toBe('accepted');

    const positiveEffects = new CrossingEffectRecorder();
    const positiveBefore = positiveEffects.snapshot();
    const positiveReplay = new SharedCrossingReplayStore('phase9-issuer-auth-positive-control');
    const positiveProvenance = createCrossingProvenanceState();

    const positiveGate: CrossingPreDispatchGate = (observation, authorityObservation) => {
      if (authorityObservation === undefined) {
        throw new Error('Positive issuer control requires authority observation.');
      }

      const rebound = rebindCrossingCorpusBase(pinnedBundle, pinnedStatus, authorityObservation);
      const adapted = applyCrossingCaseMutations(rebound, control);
      const bundle = requireAdaptedBundle(adapted.bundle);
      const status = requireAdaptedStatus(adapted.status);

      return verifyObservedCrossing(
        observation,
        {
          reference: bundle.reference,
          authority: bundle.authority,
          status,
          initialReference: bundle.initial_reference,
          initialAuthority: bundle.initial_authority,
          now: NOW,
          attempt: 1,
        },
        positiveReplay,
        positiveProvenance,
        createSyntheticCrossingIssuerVerificationContext(
          bundle.authority,
          bundle.initial_authority,
        ),
      );
    };

    const positiveResult = await runProtocolFixture('secure', {
      runId: 'hp-phase9-issuer-auth-positive-control-001',
      crossingObservation: true,
      crossingEffectRecorder: positiveEffects,
      crossingPreDispatchGate: positiveGate,
    });

    expect(positiveResult.crossingVerification?.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });
    expect(positiveEffects.deltaSince(positiveBefore)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });

    const attackEffects = new CrossingEffectRecorder();
    const attackBefore = attackEffects.snapshot();
    const attackReplay = new SharedCrossingReplayStore('phase9-non-issuer-forgery-bound');
    const attackProvenance = createCrossingProvenanceState();

    let attackGateCalls = 0;
    let unkeyedAccepted = false;
    let cryptographicAuthenticationRejected = false;

    const attackGate: CrossingPreDispatchGate = (observation, authorityObservation) => {
      attackGateCalls += 1;

      if (authorityObservation === undefined) {
        throw new Error('Forgery control requires authority observation.');
      }

      const rebound = rebindCrossingCorpusBase(pinnedBundle, pinnedStatus, authorityObservation);
      const adapted = applyCrossingCaseMutations(rebound, control);
      const bundle = requireAdaptedBundle(adapted.bundle);
      const status = requireAdaptedStatus(adapted.status);
      const observed = toExternalCrossingObservedShape(observation);

      const recomputedActionDigest = digestCrossingJson({
        arguments: observed.arguments,
        mcp_audience: observed.mcp_audience,
        tool: observed.tool,
      });

      const forgedInitialAuthority: CrossingAuthority = {
        ...bundle.initial_authority,
        action_digest: recomputedActionDigest,
        nonce: FORGED_NONCE,
      };

      const forgedInitialDigest = digestCrossingJson(forgedInitialAuthority);

      const forgedInitialReference: CrossingReference = {
        ...bundle.initial_reference,
        authority_digest: forgedInitialDigest,
      };

      const forgedAuthority: CrossingAuthority = {
        ...bundle.authority,
        a2a_binding: {
          ...bundle.authority.a2a_binding,
          previous_stage_digest: forgedInitialDigest,
        },
        action_digest: recomputedActionDigest,
        nonce: FORGED_NONCE,
      };

      const forgedAuthorityDigest = digestCrossingJson(forgedAuthority);

      const forgedReference: CrossingReference = {
        ...bundle.reference,
        authority_digest: forgedAuthorityDigest,
      };

      expect(recomputedActionDigest).toBe(bundle.authority.action_digest);
      expect(forgedInitialReference.authority_digest).toBe(
        digestCrossingJson(forgedInitialAuthority),
      );
      expect(forgedAuthority.a2a_binding.previous_stage_digest).toBe(
        forgedInitialReference.authority_digest,
      );
      expect(forgedReference.authority_digest).toBe(digestCrossingJson(forgedAuthority));
      expect(forgedInitialReference.authority_digest).not.toBe(
        bundle.initial_reference.authority_digest,
      );
      expect(forgedReference.authority_digest).not.toBe(bundle.reference.authority_digest);

      const unkeyedDecision = verifyCrossingAuthority(
        {
          reference: forgedReference,
          authority: forgedAuthority,
          status,
          observed,
          initialReference: forgedInitialReference,
          initialAuthority: forgedInitialAuthority,
          issuerAuthentication: {
            initial: true,
            resolved: true,
          },
          now: NOW,
          attempt: 1,
        },
        new SharedCrossingReplayStore('phase9-forgery-unkeyed-proof'),
        createCrossingProvenanceState(),
      );

      expect(unkeyedDecision).toEqual({
        outcome: 'succeed',
        reason: 'accepted',
      });
      unkeyedAccepted = true;

      const trustedIssuer = createSyntheticCrossingIssuerFixture();
      const attackerKey = attackerPrivateKey();

      const forgedInitialAuthentication = signCrossingAuthority(
        forgedInitialAuthority,
        trustedIssuer.identity,
        attackerKey,
      );

      const forgedResolvedAuthentication = signCrossingAuthority(
        forgedAuthority,
        trustedIssuer.identity,
        attackerKey,
      );

      expect(
        verifyCrossingAuthorityIssuerAuthentication(
          forgedInitialAuthority,
          forgedInitialAuthentication,
          trustedIssuer.trustedIssuer,
        ),
      ).toBe(false);

      expect(
        verifyCrossingAuthorityIssuerAuthentication(
          forgedAuthority,
          forgedResolvedAuthentication,
          trustedIssuer.trustedIssuer,
        ),
      ).toBe(false);

      cryptographicAuthenticationRejected = true;

      return verifyObservedCrossing(
        observation,
        {
          reference: forgedReference,
          authority: forgedAuthority,
          status,
          initialReference: forgedInitialReference,
          initialAuthority: forgedInitialAuthority,
          now: NOW,
          attempt: 1,
        },
        attackReplay,
        attackProvenance,
        {
          initial: forgedInitialAuthentication,
          resolved: forgedResolvedAuthentication,
          trustedIssuer: trustedIssuer.trustedIssuer,
        },
      );
    };

    let rejection: unknown;

    try {
      await runProtocolFixture('secure', {
        runId: 'hp-phase9-non-issuer-forgery-bound-001',
        crossingObservation: true,
        crossingEffectRecorder: attackEffects,
        crossingPreDispatchGate: attackGate,
      });
    } catch (error) {
      rejection = error;
    }

    expect(attackGateCalls).toBe(1);
    expect(unkeyedAccepted).toBe(true);
    expect(cryptographicAuthenticationRejected).toBe(true);
    expect(rejection).toBeInstanceOf(CrossingPreDispatchRejectedError);

    if (rejection instanceof CrossingPreDispatchRejectedError) {
      expect(rejection.verification.decision).toEqual({
        outcome: 'reject',
        reason: 'initial_issuer_authentication_failed',
      });
    } else {
      throw new Error('Expected CrossingPreDispatchRejectedError.');
    }

    expect(attackEffects.deltaSince(attackBefore)).toEqual({
      before: 0,
      after: 0,
      delta: 0,
    });

    expect(attackProvenance.replay.source).toBe('not_observed');
  }, 15_000);
});
