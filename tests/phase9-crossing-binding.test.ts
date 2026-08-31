import { describe, expect, it } from 'vitest';

import { runProtocolFixture } from '../src/protocol-lab/fixture.js';
import {
  toExternalCrossingObservedShape,
  type CrossingObservationState,
  type ExternalCrossingObservedShape,
} from '../src/phase9/crossing-corpus/observation.js';
import { createCrossingProvenanceState } from '../src/phase9/crossing-corpus/provenance.js';
import { verifyObservedCrossing } from '../src/phase9/crossing-corpus/binding.js';
import {
  CROSSING_PROFILE,
  SharedCrossingReplayStore,
  digestCrossingJson,
  type CrossingAuthority,
  type CrossingReference,
  type CrossingStatus,
  type CrossingVerificationInput,
} from '../src/phase9/crossing-corpus/verifier.js';

function requireCompleteObserved(
  observation: CrossingObservationState,
): ExternalCrossingObservedShape & {
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
} {
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
    throw new Error('Expected a complete HandoffProbe crossing observation.');
  }

  return observed as ExternalCrossingObservedShape & {
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
  };
}

function createVerificationTemplate(
  observed: ReturnType<typeof requireCompleteObserved>,
  attempt: number,
): Omit<CrossingVerificationInput, 'observed'> {
  const actionDigest = digestCrossingJson({
    arguments: observed.arguments,
    mcp_audience: observed.mcp_audience,
    tool: observed.tool,
  });

  const initialAuthority: CrossingAuthority = {
    issuer_id: 'https://issuer.handoffprobe.local',
    authority_id: 'authority-handoffprobe-001',
    requester_id: observed.caller_id,
    a2a_binding: {
      stage: 'initial',
      message_id: observed.message_id,
    },
    mcp_audience: observed.mcp_audience,
    action_digest: actionDigest,
    not_before: '2026-08-23T00:00:00Z',
    expires_at: '2026-08-24T00:00:00Z',
    status_ref: 'https://issuer.handoffprobe.local/status/authority-handoffprobe-001',
    nonce: 'nonce-handoffprobe-001',
  };

  const initialReference: CrossingReference = {
    profile: CROSSING_PROFILE,
    authority_id: initialAuthority.authority_id,
    authority_digest: digestCrossingJson(initialAuthority),
  };

  const authority: CrossingAuthority = {
    ...initialAuthority,
    a2a_binding: {
      stage: 'resolved',
      mode: 'first_turn_reissued',
      message_id: observed.message_id,
      task_id: observed.task_id,
      context_id: observed.context_id,
      previous_stage_digest: initialReference.authority_digest,
    },
  };

  const reference: CrossingReference = {
    profile: CROSSING_PROFILE,
    authority_id: authority.authority_id,
    authority_digest: digestCrossingJson(authority),
  };

  const status: CrossingStatus = {
    status_ref: authority.status_ref,
    authority_id: authority.authority_id,
    status: 'current',
    observed_at: '2026-08-23T11:59:00Z',
  };

  return {
    reference,
    authority,
    status,
    initialReference,
    initialAuthority,
    now: '2026-08-23T12:00:00Z',
    attempt,
  };
}

describe('Phase 9.1C observed-crossing verifier binding', () => {
  it('verifies the HandoffProbe-owned observation instead of accepting an external observed row', async () => {
    const result = await runProtocolFixture('secure', {
      runId: 'hp-crossing-binding-001',
      crossingObservation: true,
    });

    const observation = result.crossingObservation;

    expect(observation).toBeDefined();

    if (observation === undefined) {
      throw new Error('Expected a Phase 9 crossing observation.');
    }

    const observed = requireCompleteObserved(observation);

    expect(observed.mcp_audience).toEqual({
      value: 'http://handoffprobe.local/mcp',
      source: 'pinned_configuration',
    });

    const provenance = createCrossingProvenanceState();
    const replayStore = new SharedCrossingReplayStore();

    const verification = verifyObservedCrossing(
      observation,
      createVerificationTemplate(observed, 1),
      replayStore,
      provenance,
    );

    expect(verification.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });
    expect(verification.observed).toEqual(observed);
    expect(verification.observationReady).toBe(true);
    expect(verification.provenanceReadiness).toEqual({
      complete: true,
      missing: [],
    });
    expect(provenance.replay).toMatchObject({
      attempt: 1,
      seenBefore: false,
      sharedAcrossAttempts: true,
      source: 'replay.store',
    });
  });

  it('reuses one HandoffProbe replay store across attempts and rejects the second nonce use', async () => {
    const result = await runProtocolFixture('secure', {
      runId: 'hp-crossing-binding-replay-001',
      crossingObservation: true,
    });

    const observation = result.crossingObservation;

    expect(observation).toBeDefined();

    if (observation === undefined) {
      throw new Error('Expected a Phase 9 crossing observation.');
    }

    const observed = requireCompleteObserved(observation);
    const replayStore = new SharedCrossingReplayStore();

    const firstProvenance = createCrossingProvenanceState();

    const first = verifyObservedCrossing(
      observation,
      createVerificationTemplate(observed, 1),
      replayStore,
      firstProvenance,
    );

    expect(first.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });

    const secondProvenance = createCrossingProvenanceState();

    const second = verifyObservedCrossing(
      observation,
      createVerificationTemplate(observed, 2),
      replayStore,
      secondProvenance,
    );

    expect(second.decision).toEqual({
      outcome: 'reject',
      reason: 'nonce_replay',
    });
    expect(second.provenanceReadiness).toEqual({
      complete: true,
      missing: [],
    });
    expect(secondProvenance.replay).toMatchObject({
      attempt: 2,
      seenBefore: true,
      sharedAcrossAttempts: true,
      source: 'replay.store',
    });
  });
});
