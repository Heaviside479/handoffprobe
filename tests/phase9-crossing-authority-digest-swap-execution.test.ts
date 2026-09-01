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
  loadPinnedCrossingCorpus,
  type CrossingCorpusCase,
} from '../src/phase9/crossing-corpus/loader.js';
import { createCrossingProvenanceState } from '../src/phase9/crossing-corpus/provenance.js';
import {
  rebindCrossingCorpusBase,
  type CrossingAuthorityBundle,
  type CrossingStatusRecord,
} from '../src/phase9/crossing-corpus/rebinding.js';
import {
  SharedCrossingReplayStore,
  type CrossingAuthority,
  type CrossingReference,
} from '../src/phase9/crossing-corpus/verifier.js';
import { runProtocolFixture } from '../src/protocol-lab/fixture.js';

const NOW = '2026-08-23T12:00:00Z';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8')) as unknown;
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object.`);
  }

  return value;
}

function loadPinnedAuthorityBundle(path: string): CrossingAuthorityBundle {
  const base = requireRecord(readJson(path), 'Pinned crossing base vector');

  const initialReference = requireRecord(base.initial_reference, 'initial_reference');
  const initialAuthority = requireRecord(base.initial_authority, 'initial_authority');
  const reference = requireRecord(base.reference, 'reference');
  const authority = requireRecord(base.authority, 'authority');

  return {
    initial_reference: structuredClone(initialReference) as unknown as CrossingReference,
    initial_authority: structuredClone(initialAuthority) as unknown as CrossingAuthority,
    reference: structuredClone(reference) as unknown as CrossingReference,
    authority: structuredClone(authority) as unknown as CrossingAuthority,
  };
}

function loadPinnedStatus(path: string): CrossingStatusRecord {
  const status = requireRecord(readJson(path), 'Pinned crossing status');

  return structuredClone(status) as unknown as CrossingStatusRecord;
}

function requireAuthorityDigestSwap(cases: readonly CrossingCorpusCase[]): CrossingCorpusCase {
  const matches = cases.filter(
    (corpusCase) =>
      corpusCase.id === 'authority_digest_swap' &&
      corpusCase.kind === 'mutation' &&
      corpusCase.attempts === 1,
  );

  if (matches.length !== 1 || matches[0] === undefined) {
    throw new Error('Expected exactly one authority_digest_swap case.');
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

describe('Phase 9 crossing corpus authority-digest-swap execution', () => {
  it('measures one native effect and blocks the bound effect for authority_digest_swap', async () => {
    const corpus = loadPinnedCrossingCorpus();
    const mutationCase = requireAuthorityDigestSwap(corpus.cases.cases);
    const pinnedBundle = loadPinnedAuthorityBundle(resolve(corpus.root, corpus.cases.base_vector));
    const pinnedStatus = loadPinnedStatus(resolve(corpus.root, mutationCase.status_vector));

    expect(corpus.cases.cases).toHaveLength(28);
    expect(mutationCase.expected_bound).toBe('reject');
    expect(mutationCase.expected_reason).toBe('authority_digest_mismatch');
    expect(Object.keys(pinnedBundle).sort()).toEqual([
      'authority',
      'initial_authority',
      'initial_reference',
      'reference',
    ]);
    expect('observed' in pinnedBundle).toBe(false);

    const nativeEffects = new CrossingEffectRecorder();
    const nativeBefore = nativeEffects.snapshot();

    const nativeResult = await runProtocolFixture('secure', {
      runId: 'hp-phase9-authority-digest-swap-native-001',
      crossingObservation: true,
      crossingEffectRecorder: nativeEffects,
    });

    expect(nativeResult.crossingVerification).toBeUndefined();
    expect(nativeEffects.deltaSince(nativeBefore)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });
    expect(
      nativeResult.evidence.filter((event) => event.event === 'fake_tool.execute'),
    ).toHaveLength(1);

    const boundEffects = new CrossingEffectRecorder();
    const boundBefore = boundEffects.snapshot();
    const replayStore = new SharedCrossingReplayStore('phase9-authority-digest-swap-bound');
    const provenance = createCrossingProvenanceState();
    let gateCalls = 0;

    const gate: CrossingPreDispatchGate = (observation) => {
      gateCalls += 1;

      const rebound = rebindCrossingCorpusBase(pinnedBundle, pinnedStatus, observation);
      const mutated = applyCrossingCaseMutations(rebound, mutationCase);
      const bundle = requireAdaptedBundle(mutated.bundle);
      const status = requireAdaptedStatus(mutated.status);

      expect(bundle.reference.authority_digest).toBe(
        '0000000000000000000000000000000000000000000000000000000000000000',
      );
      expect(mutated.observed).toEqual(rebound.observed);

      if ('observed' in mutated.bundle) {
        throw new Error('External observed row leaked into the adapted authority bundle.');
      }

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
        replayStore,
        provenance,
      );
    };

    let rejection: unknown;

    try {
      await runProtocolFixture('secure', {
        runId: 'hp-phase9-authority-digest-swap-bound-001',
        crossingObservation: true,
        crossingEffectRecorder: boundEffects,
        crossingPreDispatchGate: gate,
      });
    } catch (error) {
      rejection = error;
    }

    expect(gateCalls).toBe(1);
    expect(rejection).toBeInstanceOf(CrossingPreDispatchRejectedError);

    if (!(rejection instanceof CrossingPreDispatchRejectedError)) {
      throw new Error('Expected CrossingPreDispatchRejectedError.');
    }

    expect(rejection.verification.decision).toEqual({
      outcome: 'reject',
      reason: 'authority_digest_mismatch',
    });
    expect(rejection.verification.observationReady).toBe(true);
    expect(boundEffects.deltaSince(boundBefore)).toEqual({
      before: 0,
      after: 0,
      delta: 0,
    });
  });
});
