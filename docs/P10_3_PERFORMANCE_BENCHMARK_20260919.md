# P10.3 reproducible performance benchmark

Date: 2026-09-19

Status: **COMPLETE — baseline and variance policy recorded 2026-09-19**

## Purpose

This benchmark measures the current HandoffProbe full stable corpus under a fixed local synthetic workload.

It is a reliability measurement, not a vulnerability result, protocol conformance claim, production throughput claim or release trigger.

## Frozen workload

- package/product baseline: `handoffprobe@0.4.0`;
- protocol baseline: A2A 1.0 → MCP 2026-07-28;
- stable corpus: exactly **23 attacks**;
- targets: bundled synthetic `secure` and `vulnerable` fixtures;
- execution order: canonical CLI catalog order;
- execution mode: sequential full-corpus execution;
- warm-up runs: **1 per target**;
- measured runs: **5 per target**.

Every benchmark iteration retains the normal correctness guard:

- secure must finish as exactly 23 PASS, zero FAIL/ERROR/INCONCLUSIVE/NOT_APPLICABLE;
- vulnerable must finish as exactly 23 FAIL, zero PASS/ERROR/INCONCLUSIVE/NOT_APPLICABLE.

Timing is observed only after the security workload is frozen. Timing values never feed back into attack meaning, authorization decisions, findings or security semantics.

## Timing model

The harness uses `process.hrtime.bigint()` and records elapsed milliseconds.

For each target it reports:

- raw measured samples;
- minimum;
- arithmetic mean;
- median;
- p95;
- maximum;
- population standard deviation;
- coefficient of variation.

## Environment record

Each run records:

- HandoffProbe version;
- protocol baseline;
- Node version;
- operating-system platform and release;
- CPU architecture;
- CPU model;
- logical CPU count.

This makes benchmark results comparable only when the recorded environment and workload are considered together.

## Execution

Run from a clean repository checkout with the supported Node 24 runtime:

`npx tsx scripts/p10-performance-benchmark.ts`

The output is JSON and is intended to be preserved as benchmark evidence when a baseline is accepted.

## First recorded baseline

Environment:

- HandoffProbe: `0.4.0`
- Node: `v24.17.0`
- platform: `darwin`
- architecture: `x64`
- OS release: `23.6.0`
- CPU: `Intel(R) Core(TM) i5-8210Y CPU @ 1.60GHz`
- logical CPUs: `4`

Secure full-corpus result:

- samples: `167.992`, `166.760`, `166.629`, `149.479`, `172.210` ms
- mean: `164.614 ms`
- median: `166.760 ms`
- p95: `172.210 ms`
- standard deviation: `7.834 ms`
- coefficient of variation: `4.759%`
- correctness: `23 PASS / 0 FAIL / 0 ERROR`

Vulnerable full-corpus result:

- samples: `232.177`, `221.156`, `219.805`, `200.786`, `222.390` ms
- mean: `219.263 ms`
- median: `221.156 ms`
- p95: `232.177 ms`
- standard deviation: `10.216 ms`
- coefficient of variation: `4.659%`
- correctness: `0 PASS / 23 FAIL / 0 ERROR`

This first run demonstrates that the fixed benchmark harness can execute the complete stable corpus successfully while producing low single-digit within-run coefficient of variation on the recorded machine.

It does not yet establish a cross-machine, CI-wide or release-blocking timing threshold.

## Repeated same-machine variance evidence

Three additional independent benchmark sessions were recorded on the same machine and environment.

Secure target:

- session medians: `180.680`, `163.824`, `169.589` ms;
- median of medians: `169.589 ms`;
- maximum cross-session median drift: `6.540%`;
- maximum within-session coefficient of variation: `9.589%`.

Vulnerable target:

- session medians: `227.467`, `249.989`, `214.882` ms;
- median of medians: `227.467 ms`;
- maximum cross-session median drift: `9.901%`;
- maximum within-session coefficient of variation: `13.823%`.

All three sessions preserved the benchmark correctness guards:

- secure: exactly `23 PASS / 0 FAIL / 0 ERROR`;
- vulnerable: exactly `0 PASS / 23 FAIL / 0 ERROR`.

## Acceptable variance policy

For repeated local measurements on the same machine with the same frozen workload, HandoffProbe uses an advisory variance envelope of **15%**.

A benchmark session is considered sufficiently stable for local comparison when:

- within-session coefficient of variation is `<= 15%`; and
- cross-session median drift is `<= 15%` relative to the median of the compared session medians.

The 15% envelope is evidence-backed by the repeated 2026-09-19 measurements. The observed maxima were `13.823%` within-session variation and `9.901%` cross-session median drift.

Exceeding the envelope does not mean a HandoffProbe security failure occurred. It means the timing evidence is not stable enough for comparison and should be repeated after reducing unrelated machine load. Repeated exceedance should trigger performance investigation.

These thresholds are not absolute production-throughput guarantees and are not automatic release blockers.

GitHub-hosted CI, different hardware, different operating systems or materially different runtime environments must not be judged against this local macOS timing baseline merely because they execute the same workload.

Comparable benchmark evidence must always retain the recorded HandoffProbe version, protocol baseline, stable attack count, Node version, platform, architecture, OS release, CPU model and logical CPU count.

## Release effect

This benchmark harness changes no stable attack ID, protocol baseline, report schema or productive security behavior.

It does not by itself justify a package-version change or public release.
