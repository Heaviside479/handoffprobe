import { describe, expect, it } from 'vitest';

import { verifyObservedCrossing } from '../src/phase9/crossing-corpus/binding.js';
import {
  createCrossingObservationState,
  type CrossingObservationState,
} from '../src/phase9/crossing-corpus/observation.js';
import { createCrossingProvenanceState } from '../src/phase9/crossing-corpus/provenance.js';
import {
  rebindCrossingCorpusBase,
  type CrossingAuthorityBundle,
  type CrossingStatusRecord,
} from '../src/phase9/crossing-corpus/rebinding.js';
import {
  CROSSING_PROFILE,
  SharedCrossingReplayStore,
  digestCrossingJson,
} from '../src/phase9/crossing-corpus/verifier.js';
import { runProtocolFixture } from '../src/protocol-lab/fixture.js';

function pinnedBundle(): CrossingAuthorityBundle {
  return {
    initial_reference: {
      profile: CROSSING_PROFILE,
      authority_id: 'authority-002',
      authority_digest: '31327760a68742cd956303a189de6ad39cfe91b0a4617619930c60db47d2c8fc',
    },
    initial_authority: {
      issuer_id: 'https://issuer.example',
      authority_id: 'authority-002',
      requester_id: 'agent-a',
      a2a_binding: {
        stage: 'initial',
        message_id: 'message-001',
      },
      mcp_audience: {
        value: 'https://mcp.example/interop',
        source: 'oauth_resource',
      },
      action_digest: 'f5d429925e015a7718881bf2ab3983c1b372c7f45088176a38d34441d1eea716',
      not_before: '2026-08-23T00:00:00Z',
      expires_at: '2026-08-24T00:00:00Z',
      status_ref: 'https://issuer.example/status/authority-002',
      nonce: 'nonce-002-abcdef0123456789',
    },
    reference: {
      profile: CROSSING_PROFILE,
      authority_id: 'authority-002',
      authority_digest: '1b500d9af7bbee064066aceef4c5891674d0a945059e499cefc22d19e86d65db',
    },
    authority: {
      issuer_id: 'https://issuer.example',
      authority_id: 'authority-002',
      requester_id: 'agent-a',
      a2a_binding: {
        stage: 'resolved',
        mode: 'first_turn_reissued',
        message_id: 'message-001',
        task_id: 'task-001',
        context_id: 'context-001',
        previous_stage_digest: '31327760a68742cd956303a189de6ad39cfe91b0a4617619930c60db47d2c8fc',
      },
      mcp_audience: {
        value: 'https://mcp.example/interop',
        source: 'oauth_resource',
      },
      action_digest: 'f5d429925e015a7718881bf2ab3983c1b372c7f45088176a38d34441d1eea716',
      not_before: '2026-08-23T00:00:00Z',
      expires_at: '2026-08-24T00:00:00Z',
      status_ref: 'https://issuer.example/status/authority-002',
      nonce: 'nonce-002-abcdef0123456789',
    },
  };
}

function pinnedStatus(): CrossingStatusRecord {
  return {
    status_ref: 'https://issuer.example/status/authority-002',
    authority_id: 'authority-002',
    status: 'current',
    observed_at: '2026-08-23T11:59:00Z',
  };
}

function requireObservation(
  observation: CrossingObservationState | undefined,
): CrossingObservationState {
  if (observation === undefined) {
    throw new Error('Expected a Phase 9 crossing observation.');
  }

  return observation;
}

describe('Phase 9 crossing runtime authority rebinding', () => {
  it('rebinds the pinned corpus authority to HandoffProbe-owned runtime observations', async () => {
    const result = await runProtocolFixture('secure', {
      runId: 'hp-crossing-rebinding-001',
      crossingObservation: true,
    });
    const observation = requireObservation(result.crossingObservation);
    const sourceBundle = pinnedBundle();
    const sourceStatus = pinnedStatus();

    const rebound = rebindCrossingCorpusBase(sourceBundle, sourceStatus, observation);

    expect(rebound.observed.caller_id).toBe(observation.caller.value);
    expect(rebound.observed.message_id).toBe(observation.messageId.value);
    expect(rebound.observed.task_id).toBe(observation.taskId.value);
    expect(rebound.observed.context_id).toBe(observation.contextId.value);
    expect(rebound.observed.task_id).not.toBe('task-001');
    expect(rebound.observed.context_id).not.toBe('context-001');
    expect(rebound.observed.mcp_audience).toEqual({
      value: 'http://handoffprobe.local/mcp',
      source: 'pinned_configuration',
    });

    expect(rebound.bundle.authority.issuer_id).toBe('https://issuer.example');
    expect(rebound.bundle.authority.authority_id).toBe('authority-002');
    expect(rebound.bundle.authority.nonce).toBe('nonce-002-abcdef0123456789');
    expect(rebound.status).toEqual(sourceStatus);

    expect(rebound.bundle.initial_authority.requester_id).toBe(rebound.observed.caller_id);
    expect(rebound.bundle.initial_authority.a2a_binding.message_id).toBe(
      rebound.observed.message_id,
    );
    expect(rebound.bundle.authority.requester_id).toBe(rebound.observed.caller_id);
    expect(rebound.bundle.authority.a2a_binding.message_id).toBe(rebound.observed.message_id);
    expect(rebound.bundle.authority.a2a_binding.task_id).toBe(rebound.observed.task_id);
    expect(rebound.bundle.authority.a2a_binding.context_id).toBe(rebound.observed.context_id);

    const expectedActionDigest = digestCrossingJson({
      arguments: rebound.observed.arguments,
      mcp_audience: rebound.observed.mcp_audience,
      tool: rebound.observed.tool,
    });
    const expectedInitialDigest = digestCrossingJson(rebound.bundle.initial_authority);

    expect(rebound.bundle.initial_authority.action_digest).toBe(expectedActionDigest);
    expect(rebound.bundle.authority.action_digest).toBe(expectedActionDigest);
    expect(rebound.bundle.initial_reference.authority_digest).toBe(expectedInitialDigest);
    expect(rebound.bundle.authority.a2a_binding.previous_stage_digest).toBe(expectedInitialDigest);
    expect(rebound.bundle.reference.authority_digest).toBe(
      digestCrossingJson(rebound.bundle.authority),
    );

    const verification = verifyObservedCrossing(
      observation,
      {
        reference: rebound.bundle.reference,
        authority: rebound.bundle.authority,
        status: rebound.status,
        initialReference: rebound.bundle.initial_reference,
        initialAuthority: rebound.bundle.initial_authority,
        now: '2026-08-23T12:00:00Z',
        attempt: 1,
      },
      new SharedCrossingReplayStore(),
      createCrossingProvenanceState(),
    );

    expect(verification.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });
    expect(verification.observed).toEqual(rebound.observed);

    expect(sourceBundle.authority.a2a_binding.task_id).toBe('task-001');
    expect(sourceBundle.authority.a2a_binding.context_id).toBe('context-001');
    expect(sourceBundle.authority.mcp_audience).toEqual({
      value: 'https://mcp.example/interop',
      source: 'oauth_resource',
    });
  });

  it('rejects an incomplete runtime observation instead of filling gaps from the corpus', () => {
    expect(() =>
      rebindCrossingCorpusBase(pinnedBundle(), pinnedStatus(), createCrossingObservationState()),
    ).toThrow('Crossing runtime observation is incomplete');
  });
});
