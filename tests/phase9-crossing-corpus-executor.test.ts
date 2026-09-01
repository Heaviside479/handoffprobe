import { describe, expect, it } from 'vitest';

import {
  CROSSING_EXECUTION_WITHOUT_NEW_RUNTIME_SEAMS,
  executeCrossingCorpusWithoutNewRuntimeSeams,
} from '../src/phase9/crossing-corpus/executor.js';
import { loadPinnedCrossingCorpus } from '../src/phase9/crossing-corpus/loader.js';

const REMAINING_RUNTIME_SEAM_CASES = [
  'requester_omitted_both',
  'message_omitted_both',
  'task_omitted_both',
  'context_omitted_both',
  'audience_swap',
  'tool_swap',
  'arguments_swap',
] as const;

describe('Phase 9 crossing corpus data-driven executor', () => {
  it('executes every case that needs no additional runtime seam', async () => {
    const corpus = loadPinnedCrossingCorpus();

    const results = await executeCrossingCorpusWithoutNewRuntimeSeams();

    expect(results.map((row) => row.case)).toEqual([
      ...CROSSING_EXECUTION_WITHOUT_NEW_RUNTIME_SEAMS,
    ]);

    expect(results).toHaveLength(21);

    const executed = new Set(results.map((row) => row.case));

    expect(corpus.caseIds.filter((caseId) => !executed.has(caseId))).toEqual([
      ...REMAINING_RUNTIME_SEAM_CASES,
    ]);

    const casesById = new Map(corpus.cases.cases.map((corpusCase) => [corpusCase.id, corpusCase]));

    for (const row of results) {
      const corpusCase = casesById.get(row.case);

      if (corpusCase === undefined) {
        throw new Error('Executor returned an unknown pinned corpus case: ' + row.case);
      }

      expect(row.native.measurement).toBe('externally_observed');

      expect(row.bound.measurement).toBe('externally_observed');

      expect(row.native.attempts).toHaveLength(corpusCase.attempts);

      expect(row.bound.attempts).toHaveLength(corpusCase.attempts);

      for (let index = 0; index < row.native.attempts.length; index += 1) {
        const native = row.native.attempts[index];

        if (native === undefined) {
          throw new Error('Native attempt is missing.');
        }

        expect(native).toEqual({
          attempt: index + 1,
          outcome: 'succeed',
          reason: 'accepted',
          effect_before: index,
          effect_after: index + 1,
          effect_delta: 1,
        });
      }

      let previousBoundAfter = 0;

      for (let index = 0; index < row.bound.attempts.length; index += 1) {
        const bound = row.bound.attempts[index];

        if (bound === undefined) {
          throw new Error('Bound attempt is missing.');
        }

        expect(bound.attempt).toBe(index + 1);
        expect(bound.effect_before).toBe(previousBoundAfter);

        expect(bound.effect_after - bound.effect_before).toBe(bound.effect_delta);

        if (bound.outcome === 'succeed') {
          expect(bound.reason).toBe('accepted');
          expect(bound.effect_delta).toBe(1);
        } else {
          expect(bound.outcome).toBe('reject');
          expect(bound.effect_delta).toBe(0);
        }

        previousBoundAfter = bound.effect_after;
      }

      const finalBound = row.bound.attempts[row.bound.attempts.length - 1];

      if (finalBound === undefined) {
        throw new Error('Final bound attempt is missing.');
      }

      expect(finalBound.outcome).toBe(corpusCase.expected_bound);

      expect(finalBound.reason).toBe(corpusCase.expected_reason);
    }

    const replay = results.find((row) => row.case === 'replay');

    expect(replay).toBeDefined();

    expect(replay?.native.attempts).toEqual([
      {
        attempt: 1,
        outcome: 'succeed',
        reason: 'accepted',
        effect_before: 0,
        effect_after: 1,
        effect_delta: 1,
      },
      {
        attempt: 2,
        outcome: 'succeed',
        reason: 'accepted',
        effect_before: 1,
        effect_after: 2,
        effect_delta: 1,
      },
    ]);

    expect(replay?.bound.attempts).toEqual([
      {
        attempt: 1,
        outcome: 'succeed',
        reason: 'accepted',
        effect_before: 0,
        effect_after: 1,
        effect_delta: 1,
      },
      {
        attempt: 2,
        outcome: 'reject',
        reason: 'nonce_replay',
        effect_before: 1,
        effect_after: 1,
        effect_delta: 0,
      },
    ]);
  });
});
