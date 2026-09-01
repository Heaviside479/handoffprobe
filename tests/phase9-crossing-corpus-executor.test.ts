import { describe, expect, it } from 'vitest';

import {
  executeFirstCrossingCorpusSlice,
  FIRST_CROSSING_EXECUTION_SLICE,
} from '../src/phase9/crossing-corpus/executor.js';

const EXPECTED_BOUND = {
  valid_crossing: {
    outcome: 'succeed',
    reason: 'accepted',
    effectDelta: 1,
  },
  caller_swap: {
    outcome: 'reject',
    reason: 'caller_mismatch',
    effectDelta: 0,
  },
  message_swap: {
    outcome: 'reject',
    reason: 'message_mismatch',
    effectDelta: 0,
  },
  task_swap: {
    outcome: 'reject',
    reason: 'task_mismatch',
    effectDelta: 0,
  },
  context_swap: {
    outcome: 'reject',
    reason: 'context_mismatch',
    effectDelta: 0,
  },
} as const;

describe('Phase 9 crossing corpus data-driven executor', () => {
  it('executes the first identity slice through native and bound lanes', async () => {
    const results = await executeFirstCrossingCorpusSlice();

    expect(results.map((row) => row.case)).toEqual([...FIRST_CROSSING_EXECUTION_SLICE]);

    expect(results).toHaveLength(5);

    for (const row of results) {
      expect(Object.keys(row).sort()).toEqual(['bound', 'case', 'native']);

      expect(row.native.measurement).toBe('externally_observed');

      expect(row.bound.measurement).toBe('externally_observed');

      expect(row.native.attempts).toHaveLength(1);
      expect(row.bound.attempts).toHaveLength(1);

      const native = row.native.attempts[0];
      const bound = row.bound.attempts[0];

      if (native === undefined || bound === undefined) {
        throw new Error('Expected measured native and bound attempts.');
      }

      expect(native).toEqual({
        attempt: 1,
        outcome: 'succeed',
        reason: 'accepted',
        effect_before: 0,
        effect_after: 1,
        effect_delta: 1,
      });

      const expected = EXPECTED_BOUND[row.case as keyof typeof EXPECTED_BOUND];

      if (expected === undefined) {
        throw new Error('Unexpected case in first execution slice: ' + row.case);
      }

      expect(bound.attempt).toBe(1);
      expect(bound.outcome).toBe(expected.outcome);
      expect(bound.reason).toBe(expected.reason);
      expect(bound.effect_before).toBe(0);
      expect(bound.effect_delta).toBe(expected.effectDelta);
      expect(bound.effect_after).toBe(expected.effectDelta);
    }
  });
});
