import {
  evaluateCrossingObservationReadiness,
  type CrossingObservationState,
} from './observation.js';

export type CrossingProvenanceSource =
  'authority.verifier' | 'status.verifier' | 'replay.store' | 'not_observed';

export interface CrossingAuthorityProvenance {
  authorityId: string | null;
  initialAuthorityDigest: string | null;
  authorityDigest: string | null;
  stage: string | null;
  mode: string | null;
  previousStageDigest: string | null;
  initialDigestVerified: boolean | null;
  authorityDigestVerified: boolean | null;
  stageEvidenceVerified: boolean | null;
  stageLinkVerified: boolean | null;
  source: CrossingProvenanceSource;
}

export interface CrossingStatusProvenance {
  statusRef: string | null;
  authorityId: string | null;
  status: string | null;
  observedAt: string | null;
  current: boolean | null;
  fresh: boolean | null;
  source: CrossingProvenanceSource;
}

export interface CrossingReplayProvenance {
  nonce: string | null;
  storeId: string | null;
  attempt: number | null;
  seenBefore: boolean | null;
  sharedAcrossAttempts: boolean | null;
  source: CrossingProvenanceSource;
}

export interface CrossingProvenanceState {
  authority: CrossingAuthorityProvenance;
  status: CrossingStatusProvenance;
  replay: CrossingReplayProvenance;
}

export interface CrossingFullProvenanceReadiness {
  complete: boolean;
  missing: string[];
}

function nonEmpty(value: string | undefined): string | null {
  if (value === undefined || value.trim().length === 0) {
    return null;
  }

  return value;
}

export function createCrossingProvenanceState(): CrossingProvenanceState {
  return {
    authority: {
      authorityId: null,
      initialAuthorityDigest: null,
      authorityDigest: null,
      stage: null,
      mode: null,
      previousStageDigest: null,
      initialDigestVerified: null,
      authorityDigestVerified: null,
      stageEvidenceVerified: null,
      stageLinkVerified: null,
      source: 'not_observed',
    },
    status: {
      statusRef: null,
      authorityId: null,
      status: null,
      observedAt: null,
      current: null,
      fresh: null,
      source: 'not_observed',
    },
    replay: {
      nonce: null,
      storeId: null,
      attempt: null,
      seenBefore: null,
      sharedAcrossAttempts: null,
      source: 'not_observed',
    },
  };
}

export function recordAuthorityCrossingProvenance(
  state: CrossingProvenanceState,
  input: {
    authorityId: string | undefined;
    initialAuthorityDigest: string | undefined;
    authorityDigest: string | undefined;
    stage: string | undefined;
    mode: string | undefined;
    previousStageDigest: string | undefined;
    initialDigestVerified: boolean | undefined;
    authorityDigestVerified: boolean | undefined;
    stageEvidenceVerified: boolean | undefined;
    stageLinkVerified: boolean | undefined;
  },
): void {
  state.authority = {
    authorityId: nonEmpty(input.authorityId),
    initialAuthorityDigest: nonEmpty(input.initialAuthorityDigest),
    authorityDigest: nonEmpty(input.authorityDigest),
    stage: nonEmpty(input.stage),
    mode: nonEmpty(input.mode),
    previousStageDigest: nonEmpty(input.previousStageDigest),
    initialDigestVerified: input.initialDigestVerified ?? null,
    authorityDigestVerified: input.authorityDigestVerified ?? null,
    stageEvidenceVerified: input.stageEvidenceVerified ?? null,
    stageLinkVerified: input.stageLinkVerified ?? null,
    source: 'authority.verifier',
  };
}

export function recordStatusCrossingProvenance(
  state: CrossingProvenanceState,
  input: {
    statusRef: string | undefined;
    authorityId: string | undefined;
    status: string | undefined;
    observedAt: string | undefined;
    current: boolean | undefined;
    fresh: boolean | undefined;
  },
): void {
  state.status = {
    statusRef: nonEmpty(input.statusRef),
    authorityId: nonEmpty(input.authorityId),
    status: nonEmpty(input.status),
    observedAt: nonEmpty(input.observedAt),
    current: input.current ?? null,
    fresh: input.fresh ?? null,
    source: 'status.verifier',
  };
}

export function recordReplayCrossingProvenance(
  state: CrossingProvenanceState,
  input: {
    nonce: string | undefined;
    storeId: string | undefined;
    attempt: number | undefined;
    seenBefore: boolean | undefined;
    sharedAcrossAttempts: boolean | undefined;
  },
): void {
  state.replay = {
    nonce: nonEmpty(input.nonce),
    storeId: nonEmpty(input.storeId),
    attempt: input.attempt ?? null,
    seenBefore: input.seenBefore ?? null,
    sharedAcrossAttempts: input.sharedAcrossAttempts ?? null,
    source: 'replay.store',
  };
}

export function snapshotCrossingProvenance(
  state: CrossingProvenanceState,
): CrossingProvenanceState {
  return {
    authority: { ...state.authority },
    status: { ...state.status },
    replay: { ...state.replay },
  };
}

export function evaluateFullCrossingProvenanceReadiness(
  observation: CrossingObservationState,
  provenance: CrossingProvenanceState,
): CrossingFullProvenanceReadiness {
  const core = evaluateCrossingObservationReadiness(observation);
  const missing: string[] = [...core.missing];

  if (provenance.authority.authorityId === null) {
    missing.push('authority.authority_id');
  }

  if (provenance.authority.authorityDigest === null) {
    missing.push('authority.authority_digest');
  }

  if (provenance.authority.stage === null) {
    missing.push('authority.stage');
  }

  if (provenance.authority.mode === null) {
    missing.push('authority.mode');
  }

  if (provenance.authority.authorityDigestVerified === null) {
    missing.push('authority.authority_digest_verified');
  }

  if (provenance.authority.stageEvidenceVerified === null) {
    missing.push('authority.stage_evidence_verified');
  }

  if (provenance.authority.mode === 'first_turn_reissued') {
    if (provenance.authority.initialAuthorityDigest === null) {
      missing.push('authority.initial_authority_digest');
    }

    if (provenance.authority.previousStageDigest === null) {
      missing.push('authority.previous_stage_digest');
    }

    if (provenance.authority.initialDigestVerified === null) {
      missing.push('authority.initial_digest_verified');
    }

    if (provenance.authority.stageLinkVerified === null) {
      missing.push('authority.stage_link_verified');
    }
  }

  if (provenance.status.statusRef === null) {
    missing.push('status.status_ref');
  }

  if (provenance.status.authorityId === null) {
    missing.push('status.authority_id');
  }

  if (provenance.status.status === null) {
    missing.push('status.status');
  }

  if (provenance.status.observedAt === null) {
    missing.push('status.observed_at');
  }

  if (provenance.status.current === null) {
    missing.push('status.current');
  }

  if (provenance.status.fresh === null) {
    missing.push('status.fresh');
  }

  if (provenance.replay.nonce === null) {
    missing.push('replay.nonce');
  }

  if (provenance.replay.storeId === null) {
    missing.push('replay.store_id');
  }

  if (provenance.replay.attempt === null) {
    missing.push('replay.attempt');
  }

  if (provenance.replay.seenBefore === null) {
    missing.push('replay.seen_before');
  }

  if (provenance.replay.sharedAcrossAttempts === null) {
    missing.push('replay.shared_across_attempts');
  }

  return {
    complete: missing.length === 0,
    missing,
  };
}
