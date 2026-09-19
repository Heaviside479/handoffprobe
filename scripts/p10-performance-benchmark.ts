import { arch, cpus, platform, release } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { VERSION } from '../src/index.js';
import { CLI_PROTOCOL_BASELINE } from '../src/cli/protocols.js';
import { resolveCliTestSelection, runCliTests } from '../src/cli/test-command.js';

import type { CliTestSummary } from '../src/cli/test-command.js';
import type { CliTargetFixture } from '../src/cli/execution-catalog.js';

export const BENCHMARK_WARMUPS = 1;
export const BENCHMARK_SAMPLES = 5;

export interface BenchmarkStats {
  readonly minMs: number;
  readonly meanMs: number;
  readonly medianMs: number;
  readonly p95Ms: number;
  readonly maxMs: number;
  readonly stdDevMs: number;
  readonly coefficientOfVariationPct: number;
}

export interface BenchmarkTargetResult {
  readonly target: CliTargetFixture;
  readonly warmups: number;
  readonly samples: number;
  readonly sampleMs: readonly number[];
  readonly stats: BenchmarkStats;
  readonly summary: CliTestSummary;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function percentile(sorted: readonly number[], percent: number): number {
  const index = Math.max(0, Math.ceil((percent / 100) * sorted.length) - 1);
  return sorted[index] ?? 0;
}

export function summarizeDurations(values: readonly number[]): BenchmarkStats {
  if (values.length === 0) {
    throw new Error('At least one benchmark sample is required.');
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mean = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
  const variance = sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / sorted.length;
  const stdDev = Math.sqrt(variance);

  const middle = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
      : (sorted[middle] ?? 0);

  return {
    minMs: round(sorted[0] ?? 0),
    meanMs: round(mean),
    medianMs: round(median),
    p95Ms: round(percentile(sorted, 95)),
    maxMs: round(sorted[sorted.length - 1] ?? 0),
    stdDevMs: round(stdDev),
    coefficientOfVariationPct: round(mean === 0 ? 0 : (stdDev / mean) * 100),
  };
}

function assertExpectedSummary(target: CliTargetFixture, summary: CliTestSummary): void {
  const expectedPass = target === 'secure' ? 23 : 0;
  const expectedFail = target === 'vulnerable' ? 23 : 0;

  if (
    summary.total !== 23 ||
    summary.pass !== expectedPass ||
    summary.fail !== expectedFail ||
    summary.notApplicable !== 0 ||
    summary.inconclusive !== 0 ||
    summary.error !== 0
  ) {
    throw new Error(
      'Benchmark correctness guard failed for target ' + target + ': ' + JSON.stringify(summary),
    );
  }
}

export async function benchmarkTarget(
  target: CliTargetFixture,
  warmups = BENCHMARK_WARMUPS,
  samples = BENCHMARK_SAMPLES,
): Promise<BenchmarkTargetResult> {
  if (warmups < 0 || samples < 1) {
    throw new Error('Benchmark requires warmups >= 0 and samples >= 1.');
  }

  const selection = resolveCliTestSelection(undefined);

  if (selection.unknownIds.length !== 0 || selection.bindings.length !== 23) {
    throw new Error('Benchmark requires the exact 23-attack stable catalog.');
  }

  for (let index = 0; index < warmups; index += 1) {
    const run = await runCliTests({
      target,
      bindings: selection.bindings,
    });

    assertExpectedSummary(target, run.summary);
  }

  const durations: number[] = [];
  let finalSummary: CliTestSummary | undefined;

  for (let index = 0; index < samples; index += 1) {
    const started = process.hrtime.bigint();

    const run = await runCliTests({
      target,
      bindings: selection.bindings,
    });

    const finished = process.hrtime.bigint();

    assertExpectedSummary(target, run.summary);

    durations.push(Number(finished - started) / 1_000_000);
    finalSummary = run.summary;
  }

  if (finalSummary === undefined) {
    throw new Error('Benchmark produced no measured result.');
  }

  return {
    target,
    warmups,
    samples,
    sampleMs: durations.map(round),
    stats: summarizeDurations(durations),
    summary: finalSummary,
  };
}

export async function createBenchmarkReport() {
  const cpu = cpus()[0];

  return {
    benchmark: 'p10-full-stable-corpus',
    version: VERSION,
    protocolBaseline: CLI_PROTOCOL_BASELINE,
    stableAttacks: 23,
    workload: {
      targets: ['secure', 'vulnerable'],
      warmupsPerTarget: BENCHMARK_WARMUPS,
      measuredSamplesPerTarget: BENCHMARK_SAMPLES,
      execution: 'sequential-full-corpus',
    },
    environment: {
      node: process.version,
      platform: platform(),
      arch: arch(),
      osRelease: release(),
      cpuModel: cpu?.model ?? 'unknown',
      logicalCpuCount: cpus().length,
    },
    results: [await benchmarkTarget('secure'), await benchmarkTarget('vulnerable')],
  };
}

async function main(): Promise<void> {
  const report = await createBenchmarkReport();
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
}

const invokedPath = process.argv[1];
const isDirectRun =
  invokedPath !== undefined && fileURLToPath(import.meta.url) === resolve(invokedPath);

if (isDirectRun) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write('Benchmark failed: ' + message + '\n');
    process.exitCode = 1;
  });
}
