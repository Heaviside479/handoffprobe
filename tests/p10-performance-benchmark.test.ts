import { describe, expect, it } from 'vitest';

import {
  benchmarkTarget,
  BENCHMARK_SAMPLES,
  BENCHMARK_WARMUPS,
  summarizeDurations,
} from '../scripts/p10-performance-benchmark.js';

describe('P10.3 performance benchmark', () => {
  it('summarizes timing samples deterministically', () => {
    expect(summarizeDurations([10, 20, 30, 40, 50])).toEqual({
      minMs: 10,
      meanMs: 30,
      medianMs: 30,
      p95Ms: 50,
      maxMs: 50,
      stdDevMs: 14.142,
      coefficientOfVariationPct: 47.14,
    });
  });

  it('uses the frozen benchmark workload', () => {
    expect(BENCHMARK_WARMUPS).toBe(1);
    expect(BENCHMARK_SAMPLES).toBe(5);
  });

  it('executes one secure full-corpus sample with the correctness guard', async () => {
    const result = await benchmarkTarget('secure', 0, 1);

    expect(result.target).toBe('secure');
    expect(result.samples).toBe(1);
    expect(result.sampleMs).toHaveLength(1);
    expect(result.summary).toEqual({
      pass: 23,
      fail: 0,
      notApplicable: 0,
      inconclusive: 0,
      error: 0,
      total: 23,
    });
  });
});
