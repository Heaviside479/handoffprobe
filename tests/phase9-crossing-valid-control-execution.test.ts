import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { applyCrossingCaseMutations } from '../src/phase9/crossing-corpus/case-builder.js';
import { verifyObservedCrossing } from '../src/phase9/crossing-corpus/binding.js';
import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
import type { CrossingPreDispatchGate } from '../src/phase9/crossing-corpus/gate.js';
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

function requireNormalValidControl(cases: readonly CrossingCorpusCase[]): CrossingCorpusCase {
  const controls = cases.filter(
    (corpusCase) =>
      corpusCase.kind === 'valid_control' &&
      corpusCase.attempts === 1 &&
      corpusCase.mutations.length === 0,
  );

  if (controls.length !== 1 || controls[0] === undefined) {
    throw new Error('Expected exactly one unmutated one-attempt valid control.');
  }

  return controls[0];
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

describe('Phase 9 crossing corpus valid-control execution', () => {
  it('measures one native effect and one accepted bound effect from the pinned corpus control', async () => {
    const corpus = loadPinnedCrossingCorpus();
    const control = requireNormalValidControl(corpus.cases.cases);
    const pinnedBundle = loadPinnedAuthorityBundle(resolve(corpus.root, corpus.cases.base_vector));
    const pinnedStatus = loadPinnedStatus(resolve(corpus.root, control.status_vector));

    expect(corpus.cases.cases).toHaveLength(28);
    expect(control.expected_bound).toBe('succeed');
    expect(control.expected_reason).toBe('accepted');
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
      runId: 'hp-phase9-valid-control-native-001',
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
    const replayStore = new SharedCrossingReplayStore('phase9-valid-control-bound');
    const provenance = createCrossingProvenanceState();
    let gateCalls = 0;

    const gate: CrossingPreDispatchGate = (observation) => {
      gateCalls += 1;

      const rebound = rebindCrossingCorpusBase(pinnedBundle, pinnedStatus, observation);
      const mutated = applyCrossingCaseMutations(rebound, control);
      const bundle = requireAdaptedBundle(mutated.bundle);
      const status = requireAdaptedStatus(mutated.status);

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

    const boundResult = await runProtocolFixture('secure', {
      runId: 'hp-phase9-valid-control-bound-001',
      crossingObservation: true,
      crossingEffectRecorder: boundEffects,
      crossingPreDispatchGate: gate,
    });

    expect(gateCalls).toBe(1);
    expect(boundResult.crossingVerification?.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });
    expect(boundResult.crossingVerification?.observationReady).toBe(true);
    expect(boundResult.crossingVerification?.provenanceReadiness).toEqual({
      complete: true,
      missing: [],
    });
    expect(boundEffects.deltaSince(boundBefore)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });
    expect(boundResult.evidence.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(1);
    expect(
      boundResult.evidence.filter((event) => event.event === 'fake_tool.execute'),
    ).toHaveLength(1);
    expect(provenance.replay).toMatchObject({
      attempt: 1,
      seenBefore: false,
      sharedAcrossAttempts: true,
      source: 'replay.store',
    });
  });
});
