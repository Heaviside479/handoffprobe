import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  applyCrossingCaseMutations,
  normalizeCrossingCaseMutations,
} from '../src/phase9/crossing-corpus/case-builder.js';
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
import { toExternalCrossingObservedShape } from '../src/phase9/crossing-corpus/observation.js';
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
const NORMAL_BOUND_MESSAGE_ID = 'hp-phase9-message-swap-bound-001-request';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8')) as unknown;
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(label + ' must be an object.');
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

function requireMessageSwap(cases: readonly CrossingCorpusCase[]): CrossingCorpusCase {
  const matches = cases.filter(
    (corpusCase) =>
      corpusCase.id === 'message_swap' &&
      corpusCase.kind === 'mutation' &&
      corpusCase.attempts === 1,
  );

  if (matches.length !== 1 || matches[0] === undefined) {
    throw new Error('Expected exactly one message_swap case.');
  }

  return matches[0];
}

function requireMessageSwapValue(corpusCase: CrossingCorpusCase): string {
  const mutations = normalizeCrossingCaseMutations(corpusCase);

  if (mutations.length !== 1 || mutations[0] === undefined) {
    throw new Error('message_swap must contain exactly one normalized mutation.');
  }

  const mutation = mutations[0];

  if (
    mutation.op !== 'set' ||
    mutation.target !== 'observed' ||
    mutation.path.length !== 1 ||
    mutation.path[0] !== 'message_id' ||
    typeof mutation.value !== 'string'
  ) {
    throw new Error('message_swap does not set observed.message_id to a string.');
  }

  return mutation.value;
}

describe('Phase 9 crossing corpus message-swap execution', () => {
  it('executes the pinned message_swap at the real A2A runtime boundary', async () => {
    const corpus = loadPinnedCrossingCorpus();
    const mutationCase = requireMessageSwap(corpus.cases.cases);
    const messageSwapValue = requireMessageSwapValue(mutationCase);

    const pinnedBundle = loadPinnedAuthorityBundle(resolve(corpus.root, corpus.cases.base_vector));

    const pinnedStatus = loadPinnedStatus(resolve(corpus.root, mutationCase.status_vector));

    expect(corpus.cases.cases).toHaveLength(28);
    expect(mutationCase.expected_bound).toBe('reject');
    expect(mutationCase.expected_reason).toBe('message_mismatch');
    expect(messageSwapValue).toBe('message-999');
    expect('observed' in pinnedBundle).toBe(false);

    const nativeEffects = new CrossingEffectRecorder();
    const nativeBefore = nativeEffects.snapshot();

    const nativeResult = await runProtocolFixture('secure', {
      runId: 'hp-phase9-message-swap-native-001',
      crossingObservation: true,
      crossingEffectRecorder: nativeEffects,
      crossingMessageIdOverride: messageSwapValue,
    });

    expect(nativeResult.crossingVerification).toBeUndefined();
    expect(nativeResult.crossingObservation?.messageId.value).toBe(messageSwapValue);
    expect(nativeResult.crossingObservation?.messageId.source).toBe('a2a.user_message');

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

    const replayStore = new SharedCrossingReplayStore('phase9-message-swap-bound');

    const provenance = createCrossingProvenanceState();

    let gateCalls = 0;

    const gate: CrossingPreDispatchGate = (observation, authorityObservation) => {
      gateCalls += 1;

      if (authorityObservation === undefined) {
        throw new Error('message_swap requires a pre-mutation authority observation.');
      }

      const rebound = rebindCrossingCorpusBase(pinnedBundle, pinnedStatus, authorityObservation);

      const expectedMutated = applyCrossingCaseMutations(rebound, mutationCase);

      const liveObserved = toExternalCrossingObservedShape(observation);

      expect(rebound.observed.message_id).toBe(NORMAL_BOUND_MESSAGE_ID);
      expect(rebound.bundle.authority.a2a_binding.message_id).toBe(NORMAL_BOUND_MESSAGE_ID);

      expect(expectedMutated.observed.message_id).toBe(messageSwapValue);

      expect(liveObserved.message_id).toBe(messageSwapValue);

      expect(liveObserved).toEqual(expectedMutated.observed);

      expect(rebound.observed.message_id).not.toBe(liveObserved.message_id);

      expect(rebound.bundle.authority.a2a_binding.message_id).not.toBe(liveObserved.message_id);

      return verifyObservedCrossing(
        observation,
        {
          reference: rebound.bundle.reference,
          authority: rebound.bundle.authority,
          status: rebound.status,
          initialReference: rebound.bundle.initial_reference,
          initialAuthority: rebound.bundle.initial_authority,
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
        runId: 'hp-phase9-message-swap-bound-001',
        crossingObservation: true,
        crossingEffectRecorder: boundEffects,
        crossingMessageIdOverride: messageSwapValue,
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
      reason: 'message_mismatch',
    });

    expect(rejection.verification.observationReady).toBe(true);

    expect(rejection.verification.observed.message_id).toBe(messageSwapValue);

    expect(boundEffects.deltaSince(boundBefore)).toEqual({
      before: 0,
      after: 0,
      delta: 0,
    });
  });
});
