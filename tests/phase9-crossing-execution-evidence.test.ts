import { describe, expect, it } from 'vitest';

import { executeFullPinnedCrossingCorpusWithEvidence } from '../src/phase9/crossing-corpus/executor.js';

describe('Phase 9 crossing corpus execution evidence', () => {
  it('captures HandoffProbe-owned runtime evidence for every native and bound attempt', async () => {
    const capture = await executeFullPinnedCrossingCorpusWithEvidence();

    expect(capture.results).toHaveLength(28);

    const expectedAttempts = capture.results.reduce(
      (total, result) => total + result.native.attempts.length + result.bound.attempts.length,
      0,
    );

    expect(capture.attempts).toHaveLength(expectedAttempts);
    expect(expectedAttempts).toBe(58);

    const results = new Map(capture.results.map((result) => [result.case, result]));

    for (const record of capture.attempts) {
      const result = results.get(record.case);

      expect(result).toBeDefined();

      const lane = result?.[record.lane];
      const attempt = lane?.attempts[record.attempt - 1];

      expect(attempt).toBeDefined();

      expect(record.decision).toEqual({
        outcome: attempt?.outcome,
        reason: attempt?.reason,
      });

      expect(record.effect).toEqual({
        before: attempt?.effect_before,
        after: attempt?.effect_after,
        delta: attempt?.effect_delta,
      });

      expect(record.observation.caller.source).not.toBe('not_observed');
      expect(record.observation.mcpAudience.source).toBe('mcp.transport_url');
      expect(record.observation.action.source).toBe('mcp.pre_dispatch');

      if (record.lane === 'native') {
        expect(record.authority_observation).toBeNull();
        expect(record.provenance).toBeNull();
        expect(record.provenance_readiness).toBeNull();
      } else {
        expect(record.authority_observation).not.toBeNull();
        expect(record.provenance).not.toBeNull();
        expect(record.provenance_readiness).not.toBeNull();
        expect(record.authority_observation?.caller.transportAuthenticated).toBe(true);
        expect(record.authority_observation?.mcpAudience.source).toBe('mcp.transport_url');
        expect(record.authority_observation?.action.source).toBe('mcp.pre_dispatch');
      }
    }

    const validBound = capture.attempts.find(
      (record) =>
        record.case === 'valid_crossing' && record.lane === 'bound' && record.attempt === 1,
    );

    expect(validBound).toBeDefined();
    expect(validBound?.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });
    expect(validBound?.effect).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });
    expect(validBound?.observation_ready).toBe(true);
    expect(validBound?.provenance_readiness?.complete).toBe(true);
    expect(validBound?.provenance?.authority.initialDigestVerified).toBe(true);
    expect(validBound?.provenance?.authority.authorityDigestVerified).toBe(true);
    expect(validBound?.provenance?.authority.stageEvidenceVerified).toBe(true);
    expect(validBound?.provenance?.authority.stageLinkVerified).toBe(true);
    expect(validBound?.provenance?.status.current).toBe(true);
    expect(validBound?.provenance?.status.fresh).toBe(true);
    expect(validBound?.provenance?.replay.sharedAcrossAttempts).toBe(true);

    const audienceNative = capture.attempts.find(
      (record) => record.case === 'audience_swap' && record.lane === 'native',
    );

    const audienceBound = capture.attempts.find(
      (record) => record.case === 'audience_swap' && record.lane === 'bound',
    );

    expect(audienceNative?.effect.delta).toBe(1);
    expect(audienceBound?.effect.delta).toBe(0);
    expect(audienceBound?.decision.reason).toBe('audience_mismatch');
    expect(audienceBound?.observation.mcpAudience.value).not.toBe(
      audienceBound?.authority_observation?.mcpAudience.value,
    );

    const toolBound = capture.attempts.find(
      (record) => record.case === 'tool_swap' && record.lane === 'bound',
    );

    expect(toolBound?.observation.action.tool).toBe('interop.other');
    expect(toolBound?.authority_observation?.action.tool).toBe('read_invoice');
    expect(toolBound?.decision.reason).toBe('action_digest_mismatch');
    expect(toolBound?.effect.delta).toBe(0);

    const argumentsBound = capture.attempts.find(
      (record) => record.case === 'arguments_swap' && record.lane === 'bound',
    );

    expect(argumentsBound?.observation.action.arguments).not.toEqual(
      argumentsBound?.authority_observation?.action.arguments,
    );
    expect(argumentsBound?.decision.reason).toBe('action_digest_mismatch');
    expect(argumentsBound?.effect.delta).toBe(0);

    const replayBound = capture.attempts.filter(
      (record) => record.case === 'replay' && record.lane === 'bound',
    );

    expect(replayBound).toHaveLength(2);
    expect(replayBound[0]?.provenance?.replay.storeId).toBe(
      replayBound[1]?.provenance?.replay.storeId,
    );
    expect(replayBound[0]?.provenance?.replay.seenBefore).toBe(false);
    expect(replayBound[1]?.provenance?.replay.seenBefore).toBe(true);
    expect(replayBound[0]?.provenance?.replay.sharedAcrossAttempts).toBe(true);
    expect(replayBound[1]?.provenance?.replay.sharedAcrossAttempts).toBe(true);
    expect(replayBound[0]?.effect.delta).toBe(1);
    expect(replayBound[1]?.effect.delta).toBe(0);
    expect(replayBound[1]?.decision.reason).toBe('nonce_replay');
  }, 20_000);
});
