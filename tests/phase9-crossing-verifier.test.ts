import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { createCrossingProvenanceState } from '../src/phase9/crossing-corpus/provenance.js';
import {
  SharedCrossingReplayStore,
  digestCrossingJson,
  verifyCrossingAuthority,
  type CrossingAuthority,
  type CrossingReference,
  type CrossingStatus,
} from '../src/phase9/crossing-corpus/verifier.js';
import type { ExternalCrossingObservedShape } from '../src/phase9/crossing-corpus/observation.js';

interface BaseVector {
  initial_authority: CrossingAuthority;
  initial_reference: CrossingReference;
  authority: CrossingAuthority;
  reference: CrossingReference;
  observed: ExternalCrossingObservedShape;
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(
    readFileSync(
      new URL(`../fixtures/phase9/a2a-mcp-crossing-v2/${relativePath}`, import.meta.url),
      'utf8',
    ),
  ) as T;
}

function createValidInput() {
  const base = readJson<BaseVector>('vectors/base.json');
  const status = readJson<CrossingStatus>('vectors/status-current.json');

  return {
    base,
    status,
    input: {
      reference: structuredClone(base.reference),
      authority: structuredClone(base.authority),
      status: structuredClone(status),
      observed: structuredClone(base.observed),
      initialReference: structuredClone(base.initial_reference),
      initialAuthority: structuredClone(base.initial_authority),
      now: '2026-08-23T12:00:00Z',
      attempt: 1,
    },
  };
}

describe('Phase 9.1C local crossing verifier', () => {
  it('matches the frozen base authority digests and accepts the valid crossing', () => {
    const { base, input } = createValidInput();

    expect(digestCrossingJson(base.initial_authority)).toBe(
      base.initial_reference.authority_digest,
    );
    expect(digestCrossingJson(base.authority)).toBe(base.reference.authority_digest);

    const provenance = createCrossingProvenanceState();
    const store = new SharedCrossingReplayStore();

    expect(verifyCrossingAuthority(input, store, provenance)).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });

    expect(provenance.authority).toMatchObject({
      authorityId: 'authority-002',
      stage: 'resolved',
      mode: 'first_turn_reissued',
      initialDigestVerified: true,
      authorityDigestVerified: true,
      stageEvidenceVerified: true,
      stageLinkVerified: true,
      source: 'authority.verifier',
    });

    expect(provenance.status).toMatchObject({
      status: 'current',
      current: true,
      fresh: true,
      source: 'status.verifier',
    });

    expect(provenance.replay).toMatchObject({
      attempt: 1,
      seenBefore: false,
      sharedAcrossAttempts: true,
      source: 'replay.store',
    });
  });

  it('rejects a broken stage link without consuming the replay nonce', () => {
    const { input } = createValidInput();

    input.authority.a2a_binding.previous_stage_digest = '0'.repeat(64);

    input.reference.authority_digest = digestCrossingJson(input.authority);

    const provenance = createCrossingProvenanceState();
    const store = new SharedCrossingReplayStore();

    expect(verifyCrossingAuthority(input, store, provenance)).toEqual({
      outcome: 'reject',
      reason: 'stage_link_mismatch',
    });

    expect(provenance.authority.stageLinkVerified).toBe(false);
    expect(provenance.replay.source).toBe('not_observed');
  });

  it('rejects stale status and records that freshness check as false', () => {
    const { input } = createValidInput();

    input.status = readJson<CrossingStatus>('vectors/status-stale.json');

    const provenance = createCrossingProvenanceState();
    const store = new SharedCrossingReplayStore();

    expect(verifyCrossingAuthority(input, store, provenance)).toEqual({
      outcome: 'reject',
      reason: 'status_stale',
    });

    expect(provenance.status.fresh).toBe(false);
    expect(provenance.status.current).toBe(true);
    expect(provenance.replay.source).toBe('not_observed');
  });

  it('uses one shared replay store across both replay attempts', () => {
    const { input } = createValidInput();
    const store = new SharedCrossingReplayStore();

    const firstProvenance = createCrossingProvenanceState();

    expect(verifyCrossingAuthority(input, store, firstProvenance)).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });

    const secondProvenance = createCrossingProvenanceState();

    expect(
      verifyCrossingAuthority(
        {
          ...structuredClone(input),
          attempt: 2,
        },
        store,
        secondProvenance,
      ),
    ).toEqual({
      outcome: 'reject',
      reason: 'nonce_replay',
    });

    expect(secondProvenance.replay).toMatchObject({
      attempt: 2,
      seenBefore: true,
      sharedAcrossAttempts: true,
      source: 'replay.store',
    });
  });

  it('rejects an exact-action substitution after recomputing no authority digest', () => {
    const { input } = createValidInput();

    input.observed = {
      ...input.observed,
      tool: 'interop.other',
    };

    const provenance = createCrossingProvenanceState();
    const store = new SharedCrossingReplayStore();

    expect(verifyCrossingAuthority(input, store, provenance)).toEqual({
      outcome: 'reject',
      reason: 'action_digest_mismatch',
    });

    expect(provenance.replay.source).toBe('not_observed');
  });
});
