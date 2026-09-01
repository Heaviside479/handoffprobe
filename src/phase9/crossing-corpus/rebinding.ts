import type { CrossingMutableCaseState } from './case-builder.js';
import {
  evaluateCrossingObservationReadiness,
  toExternalCrossingObservedShape,
  type CrossingObservationState,
  type ExternalCrossingObservedShape,
} from './observation.js';
import {
  digestCrossingJson,
  type CrossingAuthority,
  type CrossingReference,
  type CrossingStatus,
} from './verifier.js';

export interface CrossingAuthorityBundle extends Record<string, unknown> {
  initial_reference: CrossingReference;
  initial_authority: CrossingAuthority;
  reference: CrossingReference;
  authority: CrossingAuthority;
}

export type CrossingStatusRecord = CrossingStatus & Record<string, unknown>;

export interface CompleteExternalCrossingObservedShape extends ExternalCrossingObservedShape {
  caller_id: string;
  message_id: string;
  task_id: string;
  context_id: string;
  mcp_audience: {
    value: string;
    source: string;
  };
  tool: string;
  arguments: Record<string, unknown>;
}

export interface ReboundCrossingCorpusBase extends CrossingMutableCaseState {
  readonly bundle: CrossingAuthorityBundle;
  readonly status: CrossingStatusRecord;
  readonly observed: CompleteExternalCrossingObservedShape;
}

function requireCompleteObservation(
  observation: CrossingObservationState,
): CompleteExternalCrossingObservedShape {
  const readiness = evaluateCrossingObservationReadiness(observation);

  if (!readiness.complete) {
    throw new Error(`Crossing runtime observation is incomplete: ${readiness.missing.join(', ')}`);
  }

  const observed = toExternalCrossingObservedShape(observation);

  if (
    observed.caller_id === null ||
    observed.message_id === null ||
    observed.task_id === null ||
    observed.context_id === null ||
    observed.mcp_audience.value === null ||
    observed.mcp_audience.source === null ||
    observed.tool === null ||
    observed.arguments === null
  ) {
    throw new Error('Crossing runtime observation failed complete-shape narrowing.');
  }

  return observed as CompleteExternalCrossingObservedShape;
}

export function rebindCrossingCorpusBase(
  pinnedBundle: CrossingAuthorityBundle,
  pinnedStatus: CrossingStatusRecord,
  observation: CrossingObservationState,
): ReboundCrossingCorpusBase {
  const observed = requireCompleteObservation(observation);

  const actionDigest = digestCrossingJson({
    arguments: observed.arguments,
    mcp_audience: observed.mcp_audience,
    tool: observed.tool,
  });

  const initialAuthority: CrossingAuthority = {
    ...structuredClone(pinnedBundle.initial_authority),
    requester_id: observed.caller_id,
    a2a_binding: {
      ...structuredClone(pinnedBundle.initial_authority.a2a_binding),
      message_id: observed.message_id,
    },
    mcp_audience: structuredClone(observed.mcp_audience),
    action_digest: actionDigest,
  };

  const initialReference: CrossingReference = {
    ...structuredClone(pinnedBundle.initial_reference),
    authority_id: initialAuthority.authority_id,
    authority_digest: digestCrossingJson(initialAuthority),
  };

  const authority: CrossingAuthority = {
    ...structuredClone(pinnedBundle.authority),
    requester_id: observed.caller_id,
    a2a_binding: {
      ...structuredClone(pinnedBundle.authority.a2a_binding),
      message_id: observed.message_id,
      task_id: observed.task_id,
      context_id: observed.context_id,
      previous_stage_digest: initialReference.authority_digest,
    },
    mcp_audience: structuredClone(observed.mcp_audience),
    action_digest: actionDigest,
  };

  const reference: CrossingReference = {
    ...structuredClone(pinnedBundle.reference),
    authority_id: authority.authority_id,
    authority_digest: digestCrossingJson(authority),
  };

  const bundle: CrossingAuthorityBundle = {
    ...structuredClone(pinnedBundle),
    initial_reference: initialReference,
    initial_authority: initialAuthority,
    reference,
    authority,
  };

  return {
    bundle,
    status: structuredClone(pinnedStatus),
    observed,
  };
}
