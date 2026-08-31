import { describe, expect, it } from 'vitest';

import {
  createCrossingObservationState,
  recordA2aCrossingObservation,
  recordMcpCrossingObservation,
} from '../src/phase9/crossing-corpus/observation.js';
import {
  createCrossingProvenanceState,
  evaluateFullCrossingProvenanceReadiness,
  recordAuthorityCrossingProvenance,
  recordReplayCrossingProvenance,
  recordStatusCrossingProvenance,
  snapshotCrossingProvenance,
} from '../src/phase9/crossing-corpus/provenance.js';

function createCompleteCoreObservation() {
  const observation = createCrossingObservationState();

  recordA2aCrossingObservation(observation, {
    caller: 'agent-a',
    messageId: 'message-001',
    taskId: 'task-001',
    contextId: 'context-001',
    transportAuthenticated: true,
    taskServerResolved: true,
    contextServerResolved: true,
  });

  recordMcpCrossingObservation(observation, {
    audience: 'https://mcp.example/interop',
    audienceDerivationSource: 'transport_url',
    tool: 'interop.echo',
    arguments: {
      message: 'hello',
    },
  });

  return observation;
}

describe('Phase 9.1C crossing provenance model', () => {
  it('keeps full provenance non-green when only the core crossing is observed', () => {
    const observation = createCompleteCoreObservation();
    const provenance = createCrossingProvenanceState();

    const readiness = evaluateFullCrossingProvenanceReadiness(observation, provenance);

    expect(readiness.complete).toBe(false);
    expect(readiness.missing).toContain('authority.authority_id');
    expect(readiness.missing).toContain('status.status_ref');
    expect(readiness.missing).toContain('replay.store_id');
  });

  it('treats explicit false verifier outcomes as observed evidence rather than missing values', () => {
    const observation = createCompleteCoreObservation();
    const provenance = createCrossingProvenanceState();

    recordAuthorityCrossingProvenance(provenance, {
      authorityId: 'authority-002',
      initialAuthorityDigest: 'initial-digest',
      authorityDigest: 'resolved-digest',
      stage: 'resolved',
      mode: 'first_turn_reissued',
      previousStageDigest: 'initial-digest',
      initialDigestVerified: true,
      authorityDigestVerified: false,
      stageEvidenceVerified: false,
      stageLinkVerified: false,
    });

    recordStatusCrossingProvenance(provenance, {
      statusRef: 'https://issuer.example/status/authority-002',
      authorityId: 'authority-002',
      status: 'current',
      observedAt: '2026-08-23T11:59:00Z',
      current: false,
      fresh: false,
    });

    recordReplayCrossingProvenance(provenance, {
      nonce: 'nonce-002-abcdef0123456789',
      storeId: 'phase9-shared-replay-store',
      attempt: 2,
      seenBefore: true,
      sharedAcrossAttempts: true,
    });

    expect(evaluateFullCrossingProvenanceReadiness(observation, provenance)).toEqual({
      complete: true,
      missing: [],
    });

    expect(provenance.authority.source).toBe('authority.verifier');
    expect(provenance.status.source).toBe('status.verifier');
    expect(provenance.replay.source).toBe('replay.store');
  });

  it('requires first-turn stage-link evidence when the authority was reissued', () => {
    const observation = createCompleteCoreObservation();
    const provenance = createCrossingProvenanceState();

    recordAuthorityCrossingProvenance(provenance, {
      authorityId: 'authority-002',
      initialAuthorityDigest: undefined,
      authorityDigest: 'resolved-digest',
      stage: 'resolved',
      mode: 'first_turn_reissued',
      previousStageDigest: undefined,
      initialDigestVerified: undefined,
      authorityDigestVerified: true,
      stageEvidenceVerified: true,
      stageLinkVerified: undefined,
    });

    recordStatusCrossingProvenance(provenance, {
      statusRef: 'https://issuer.example/status/authority-002',
      authorityId: 'authority-002',
      status: 'current',
      observedAt: '2026-08-23T11:59:00Z',
      current: true,
      fresh: true,
    });

    recordReplayCrossingProvenance(provenance, {
      nonce: 'nonce-002-abcdef0123456789',
      storeId: 'phase9-shared-replay-store',
      attempt: 1,
      seenBefore: false,
      sharedAcrossAttempts: true,
    });

    const readiness = evaluateFullCrossingProvenanceReadiness(observation, provenance);

    expect(readiness.complete).toBe(false);
    expect(readiness.missing).toEqual(
      expect.arrayContaining([
        'authority.initial_authority_digest',
        'authority.previous_stage_digest',
        'authority.initial_digest_verified',
        'authority.stage_link_verified',
      ]),
    );
  });

  it('does not require first-turn stage-link material for an existing-task authority', () => {
    const observation = createCompleteCoreObservation();
    const provenance = createCrossingProvenanceState();

    recordAuthorityCrossingProvenance(provenance, {
      authorityId: 'authority-002',
      initialAuthorityDigest: undefined,
      authorityDigest: 'resolved-digest',
      stage: 'resolved',
      mode: 'existing_task',
      previousStageDigest: undefined,
      initialDigestVerified: undefined,
      authorityDigestVerified: true,
      stageEvidenceVerified: true,
      stageLinkVerified: undefined,
    });

    recordStatusCrossingProvenance(provenance, {
      statusRef: 'https://issuer.example/status/authority-002',
      authorityId: 'authority-002',
      status: 'current',
      observedAt: '2026-08-23T11:59:00Z',
      current: true,
      fresh: true,
    });

    recordReplayCrossingProvenance(provenance, {
      nonce: 'nonce-002-abcdef0123456789',
      storeId: 'phase9-shared-replay-store',
      attempt: 1,
      seenBefore: false,
      sharedAcrossAttempts: true,
    });

    expect(evaluateFullCrossingProvenanceReadiness(observation, provenance)).toEqual({
      complete: true,
      missing: [],
    });
  });

  it('snapshots authority, status, and replay provenance by value', () => {
    const provenance = createCrossingProvenanceState();

    recordAuthorityCrossingProvenance(provenance, {
      authorityId: 'authority-002',
      initialAuthorityDigest: 'initial-digest',
      authorityDigest: 'resolved-digest',
      stage: 'resolved',
      mode: 'first_turn_reissued',
      previousStageDigest: 'initial-digest',
      initialDigestVerified: true,
      authorityDigestVerified: true,
      stageEvidenceVerified: true,
      stageLinkVerified: true,
    });

    recordStatusCrossingProvenance(provenance, {
      statusRef: 'https://issuer.example/status/authority-002',
      authorityId: 'authority-002',
      status: 'current',
      observedAt: '2026-08-23T11:59:00Z',
      current: true,
      fresh: true,
    });

    recordReplayCrossingProvenance(provenance, {
      nonce: 'nonce-002-abcdef0123456789',
      storeId: 'phase9-shared-replay-store',
      attempt: 1,
      seenBefore: false,
      sharedAcrossAttempts: true,
    });

    const snapshot = snapshotCrossingProvenance(provenance);

    provenance.authority.authorityId = 'changed';
    provenance.status.status = 'revoked';
    provenance.replay.attempt = 2;

    expect(snapshot.authority.authorityId).toBe('authority-002');
    expect(snapshot.status.status).toBe('current');
    expect(snapshot.replay.attempt).toBe(1);
  });
});
