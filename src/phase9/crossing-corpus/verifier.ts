import { createHash } from 'node:crypto';

import type { ExternalCrossingObservedShape } from './observation.js';
import {
  recordAuthorityCrossingProvenance,
  recordReplayCrossingProvenance,
  recordStatusCrossingProvenance,
  type CrossingProvenanceState,
} from './provenance.js';

export const CROSSING_PROFILE = 'https://minorityprophet.org/conformance/a2a-mcp-crossing/v2';

export const MAX_STATUS_AGE_SECONDS = 300;

const AUDIENCE_SOURCES = new Set([
  'oauth_resource',
  'authenticated_endpoint',
  'certificate_identity',
  'pinned_configuration',
]);

export type CrossingDecisionReason =
  | 'accepted'
  | 'input_contract_invalid'
  | 'profile_mismatch'
  | 'authority_digest_mismatch'
  | 'authority_id_mismatch'
  | 'task_binding_unresolved'
  | 'stage_evidence_missing'
  | 'stage_evidence_unexpected'
  | 'stage_mode_invalid'
  | 'initial_authority_digest_mismatch'
  | 'initial_authority_id_mismatch'
  | 'initial_stage_invalid'
  | 'stage_link_mismatch'
  | 'stage_message_mismatch'
  | 'stage_reissue_mismatch'
  | 'caller_mismatch'
  | 'message_mismatch'
  | 'task_mismatch'
  | 'context_mismatch'
  | 'audience_mismatch'
  | 'action_digest_mismatch'
  | 'not_yet_valid'
  | 'expired'
  | 'status_reference_mismatch'
  | 'status_stale'
  | 'authority_not_current'
  | 'initial_issuer_authentication_failed'
  | 'resolved_issuer_authentication_failed'
  | 'nonce_replay';

export interface CrossingDecision {
  outcome: 'succeed' | 'reject';
  reason: CrossingDecisionReason;
}

export interface CrossingAudience {
  value: string;
  source: string;
}

export interface CrossingA2aBinding {
  stage: string;
  message_id: string;
  mode?: string;
  task_id?: string;
  context_id?: string;
  previous_stage_digest?: string;
}

export interface CrossingAuthority {
  issuer_id: string;
  authority_id: string;
  requester_id: string;
  a2a_binding: CrossingA2aBinding;
  mcp_audience: CrossingAudience;
  action_digest: string;
  not_before: string;
  expires_at: string;
  status_ref: string;
  nonce: string;
}

export interface CrossingReference {
  profile: string;
  authority_id: string;
  authority_digest: string;
}

export interface CrossingStatus {
  status_ref: string;
  authority_id: string;
  status: string;
  observed_at: string;
}

export interface CrossingVerificationInput {
  reference: CrossingReference;
  authority: CrossingAuthority;
  status: CrossingStatus;
  observed: ExternalCrossingObservedShape;
  initialReference?: CrossingReference;
  initialAuthority?: CrossingAuthority;
  issuerAuthentication: {
    initial?: boolean;
    resolved: boolean;
  };
  now: string;
  attempt: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertJsonValue(value: unknown): void {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') {
    if (typeof value === 'string' && /[\uD800-\uDFFF]/u.test(value)) {
      throw new Error('Unicode surrogate code points are invalid.');
    }

    return;
  }

  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) {
      throw new Error('Only interoperable safe integers are allowed.');
    }

    return;
  }

  if (Array.isArray(value)) {
    for (const child of value) {
      assertJsonValue(child);
    }

    return;
  }

  if (isRecord(value)) {
    for (const [key, child] of Object.entries(value)) {
      assertJsonValue(key);
      assertJsonValue(child);
    }

    return;
  }

  throw new Error('Unsupported JSON value.');
}

function canonicalText(value: unknown): string {
  assertJsonValue(value);

  if (value === null) {
    return 'null';
  }

  if (value === true) {
    return 'true';
  }

  if (value === false) {
    return 'false';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    const encoded = JSON.stringify(value);

    if (encoded === undefined) {
      throw new Error('Unable to encode JSON string.');
    }

    return encoded;
  }

  if (Array.isArray(value)) {
    return `[${value.map((child) => canonicalText(child)).join(',')}]`;
  }

  if (isRecord(value)) {
    const fields = Object.keys(value)
      .sort()
      .map((key) => `${canonicalText(key)}:${canonicalText(value[key])}`);

    return `{${fields.join(',')}}`;
  }

  throw new Error('Unsupported JSON value.');
}

export function digestCrossingJson(value: unknown): string {
  return createHash('sha256').update(canonicalText(value), 'utf8').digest('hex');
}

function requireString(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('Expected a non-empty string.');
  }

  return value;
}

function requireDigest(value: unknown): string {
  const digest = requireString(value);

  if (!/^[a-f0-9]{64}$/u.test(digest)) {
    throw new Error('Expected a lowercase SHA-256 digest.');
  }

  return digest;
}

function parseTime(value: unknown): number {
  const text = requireString(value);

  if (!/(?:Z|[+-]\d{2}:\d{2})$/u.test(text)) {
    throw new Error('Timestamp requires an offset.');
  }

  const parsed = Date.parse(text);

  if (Number.isNaN(parsed)) {
    throw new Error('Invalid timestamp.');
  }

  return parsed;
}

function validateAudience(value: unknown): asserts value is CrossingAudience {
  if (!isRecord(value)) {
    throw new Error('Audience must be an object.');
  }

  requireString(value.value);
  const source = requireString(value.source);

  if (!AUDIENCE_SOURCES.has(source)) {
    throw new Error('Audience source is not transport-bound.');
  }
}

function validateReference(value: unknown): asserts value is CrossingReference {
  if (!isRecord(value)) {
    throw new Error('Reference must be an object.');
  }

  requireString(value.profile);
  requireString(value.authority_id);
  requireDigest(value.authority_digest);
}

function validateAuthority(value: unknown, initial: boolean): asserts value is CrossingAuthority {
  if (!isRecord(value)) {
    throw new Error('Authority must be an object.');
  }

  for (const field of [
    'issuer_id',
    'authority_id',
    'requester_id',
    'not_before',
    'expires_at',
    'status_ref',
    'nonce',
  ]) {
    requireString(value[field]);
  }

  requireDigest(value.action_digest);
  validateAudience(value.mcp_audience);
  parseTime(value.not_before);
  parseTime(value.expires_at);

  const binding = value.a2a_binding;

  if (!isRecord(binding)) {
    throw new Error('A2A binding must be an object.');
  }

  requireString(binding.stage);
  requireString(binding.message_id);

  if (initial) {
    return;
  }

  const mode = requireString(binding.mode);
  requireString(binding.task_id);
  requireString(binding.context_id);

  if (mode === 'first_turn_reissued') {
    requireDigest(binding.previous_stage_digest);
  } else if (mode === 'existing_task' && 'previous_stage_digest' in binding) {
    throw new Error('existing_task cannot carry previous_stage_digest.');
  }
}

function validateStatus(value: unknown): asserts value is CrossingStatus {
  if (!isRecord(value)) {
    throw new Error('Status must be an object.');
  }

  requireString(value.status_ref);
  requireString(value.authority_id);
  requireString(value.status);
  parseTime(value.observed_at);
}

function validateObserved(value: unknown): asserts value is ExternalCrossingObservedShape {
  if (!isRecord(value)) {
    throw new Error('Observed crossing must be an object.');
  }

  requireString(value.caller_id);
  requireString(value.message_id);
  requireString(value.task_id);
  requireString(value.context_id);
  requireString(value.tool);
  validateAudience(value.mcp_audience);

  if (!isRecord(value.arguments)) {
    throw new Error('Observed arguments must be an object.');
  }

  assertJsonValue(value.arguments);
}

function validateInput(input: CrossingVerificationInput): void {
  assertJsonValue(input.reference);
  assertJsonValue(input.authority);
  assertJsonValue(input.status);
  assertJsonValue(input.observed);

  validateReference(input.reference);
  validateAuthority(input.authority, false);
  validateStatus(input.status);
  validateObserved(input.observed);

  if (typeof input.issuerAuthentication.resolved !== 'boolean') {
    throw new Error('Resolved issuer authentication verdict must be boolean.');
  }

  if (
    input.issuerAuthentication.initial !== undefined &&
    typeof input.issuerAuthentication.initial !== 'boolean'
  ) {
    throw new Error('Initial issuer authentication verdict must be boolean.');
  }

  if (input.initialReference !== undefined) {
    assertJsonValue(input.initialReference);
    validateReference(input.initialReference);
  }

  if (input.initialAuthority !== undefined) {
    assertJsonValue(input.initialAuthority);
    validateAuthority(input.initialAuthority, true);
  }

  parseTime(input.now);

  if (!Number.isSafeInteger(input.attempt) || input.attempt < 1) {
    throw new Error('Attempt must be a positive safe integer.');
  }
}

function jsonEqual(left: unknown, right: unknown): boolean {
  return canonicalText(left) === canonicalText(right);
}

function actionDigest(observed: ExternalCrossingObservedShape): string {
  return digestCrossingJson({
    arguments: observed.arguments,
    mcp_audience: observed.mcp_audience,
    tool: observed.tool,
  });
}

function replayKey(authority: CrossingAuthority): string {
  return digestCrossingJson([authority.issuer_id, authority.authority_id, authority.nonce]);
}

function reject(reason: CrossingDecisionReason): CrossingDecision {
  return {
    outcome: 'reject',
    reason,
  };
}

export class SharedCrossingReplayStore {
  private readonly consumed = new Set<string>();

  constructor(readonly id = 'phase9-shared-replay-store') {}

  consume(key: string): {
    accepted: boolean;
    seenBefore: boolean;
  } {
    const seenBefore = this.consumed.has(key);

    if (!seenBefore) {
      this.consumed.add(key);
    }

    return {
      accepted: !seenBefore,
      seenBefore,
    };
  }
}

export function verifyCrossingAuthority(
  input: CrossingVerificationInput,
  replayStore: SharedCrossingReplayStore,
  provenance: CrossingProvenanceState,
): CrossingDecision {
  try {
    validateInput(input);
  } catch {
    return reject('input_contract_invalid');
  }

  const authorityDigest = digestCrossingJson(input.authority);
  const initialAuthorityDigest =
    input.initialAuthority === undefined ? undefined : digestCrossingJson(input.initialAuthority);

  const binding = input.authority.a2a_binding;
  const mode = binding.mode;

  const firstTurn = mode === 'first_turn_reissued';
  const existingTask = mode === 'existing_task';

  const stageEvidenceVerified = firstTurn
    ? input.initialReference !== undefined && input.initialAuthority !== undefined
    : existingTask
      ? input.initialReference === undefined && input.initialAuthority === undefined
      : false;

  const initialDigestVerified =
    firstTurn && input.initialReference !== undefined && initialAuthorityDigest !== undefined
      ? input.initialReference.authority_digest === initialAuthorityDigest
      : undefined;

  const stageLinkVerified =
    firstTurn && initialAuthorityDigest !== undefined
      ? binding.previous_stage_digest === initialAuthorityDigest
      : undefined;

  recordAuthorityCrossingProvenance(provenance, {
    authorityId: input.authority.authority_id,
    initialAuthorityDigest,
    authorityDigest,
    stage: binding.stage,
    mode,
    previousStageDigest: binding.previous_stage_digest,
    initialDigestVerified,
    authorityDigestVerified: input.reference.authority_digest === authorityDigest,
    stageEvidenceVerified,
    stageLinkVerified,
  });

  if (input.reference.profile !== CROSSING_PROFILE) {
    return reject('profile_mismatch');
  }

  if (input.reference.authority_digest !== authorityDigest) {
    return reject('authority_digest_mismatch');
  }

  if (input.reference.authority_id !== input.authority.authority_id) {
    return reject('authority_id_mismatch');
  }

  if (binding.stage !== 'resolved') {
    return reject('task_binding_unresolved');
  }

  if (firstTurn) {
    if (input.initialReference === undefined || input.initialAuthority === undefined) {
      return reject('stage_evidence_missing');
    }

    if (input.initialReference.profile !== CROSSING_PROFILE) {
      return reject('profile_mismatch');
    }

    if (initialDigestVerified !== true) {
      return reject('initial_authority_digest_mismatch');
    }

    if (input.initialReference.authority_id !== input.initialAuthority.authority_id) {
      return reject('initial_authority_id_mismatch');
    }

    if (input.initialAuthority.a2a_binding.stage !== 'initial') {
      return reject('initial_stage_invalid');
    }

    if (stageLinkVerified !== true) {
      return reject('stage_link_mismatch');
    }

    if (binding.message_id !== input.initialAuthority.a2a_binding.message_id) {
      return reject('stage_message_mismatch');
    }

    const immutableFields: (keyof CrossingAuthority)[] = [
      'issuer_id',
      'authority_id',
      'requester_id',
      'mcp_audience',
      'action_digest',
      'not_before',
      'expires_at',
      'status_ref',
      'nonce',
    ];

    if (
      immutableFields.some(
        (field) => !jsonEqual(input.authority[field], input.initialAuthority?.[field]),
      )
    ) {
      return reject('stage_reissue_mismatch');
    }
  } else if (existingTask) {
    if (input.initialReference !== undefined || input.initialAuthority !== undefined) {
      return reject('stage_evidence_unexpected');
    }
  } else {
    return reject('stage_mode_invalid');
  }

  if (input.observed.caller_id !== input.authority.requester_id) {
    return reject('caller_mismatch');
  }

  if (input.observed.message_id !== binding.message_id) {
    return reject('message_mismatch');
  }

  if (input.observed.task_id !== binding.task_id) {
    return reject('task_mismatch');
  }

  if (input.observed.context_id !== binding.context_id) {
    return reject('context_mismatch');
  }

  if (!jsonEqual(input.observed.mcp_audience, input.authority.mcp_audience)) {
    return reject('audience_mismatch');
  }

  if (actionDigest(input.observed) !== input.authority.action_digest) {
    return reject('action_digest_mismatch');
  }

  const now = parseTime(input.now);
  const notBefore = parseTime(input.authority.not_before);

  if (now < notBefore) {
    return reject('not_yet_valid');
  }

  const expiresAt = parseTime(input.authority.expires_at);

  if (now >= expiresAt) {
    return reject('expired');
  }

  const observedAt = parseTime(input.status.observed_at);
  const ageSeconds = (now - observedAt) / 1000;
  const statusFresh = ageSeconds >= 0 && ageSeconds <= MAX_STATUS_AGE_SECONDS;
  const statusCurrent = input.status.status === 'current';

  recordStatusCrossingProvenance(provenance, {
    statusRef: input.status.status_ref,
    authorityId: input.status.authority_id,
    status: input.status.status,
    observedAt: input.status.observed_at,
    current: statusCurrent,
    fresh: statusFresh,
  });

  if (
    input.status.status_ref !== input.authority.status_ref ||
    input.status.authority_id !== input.authority.authority_id
  ) {
    return reject('status_reference_mismatch');
  }

  if (!statusFresh) {
    return reject('status_stale');
  }

  if (!statusCurrent) {
    return reject('authority_not_current');
  }

  if (firstTurn && input.issuerAuthentication.initial !== true) {
    return reject('initial_issuer_authentication_failed');
  }

  if (input.issuerAuthentication.resolved !== true) {
    return reject('resolved_issuer_authentication_failed');
  }

  const replay = replayStore.consume(replayKey(input.authority));

  recordReplayCrossingProvenance(provenance, {
    nonce: input.authority.nonce,
    storeId: replayStore.id,
    attempt: input.attempt,
    seenBefore: replay.seenBefore,
    sharedAcrossAttempts: true,
  });

  if (!replay.accepted) {
    return reject('nonce_replay');
  }

  return {
    outcome: 'succeed',
    reason: 'accepted',
  };
}
