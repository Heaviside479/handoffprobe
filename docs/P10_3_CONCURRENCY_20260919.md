# P10.3 concurrency reliability

Date: 2026-09-19

Status: **COMPLETE — 2026-09-19**

## Purpose

This P10.3 step tests whether independent HandoffProbe executions remain isolated and deterministic when multiple runs are active concurrently.

The scope is reliability, not attack admission, protocol conformance or production throughput.

## Covered concurrency surfaces

The regression suite exercises:

- six simultaneous secure `HP-RACE-001` executions;
- six simultaneous vulnerable `HP-RACE-001` executions;
- four simultaneous complete 23-attack CLI corpus executions: two secure and two vulnerable.

## Isolation requirements

Each independent race execution must preserve:

- its own run ID;
- its own correlation ID;
- its own evidence sequence;
- its own deterministic barrier state;
- its own protected side-effect count.

Secure `HP-RACE-001` runs must each produce exactly one protected side effect and one blocked competing attempt.

Vulnerable `HP-RACE-001` runs must each independently reproduce exactly two protected side effects.

Concurrent full-corpus runs must retain canonical attack order and exact expected summaries: 23 PASS for secure and 23 FAIL for intentionally vulnerable fixtures.

## Validation result

The concurrency regression suite passed on 2026-09-19.

Validated workload:

- six simultaneous secure `HP-RACE-001` executions;
- six simultaneous vulnerable `HP-RACE-001` executions;
- four simultaneous complete 23-attack corpus executions;
- exact secure outcome remained 23 PASS;
- exact vulnerable outcome remained 23 FAIL;
- run IDs, correlation IDs, evidence and side-effect state remained isolated.

Repository validation after adding this coverage passed with 112 test files and 558 tests.

## Product effect

This step adds regression coverage only. It does not change productive runtime behavior, stable attack IDs, protocol baseline, report schema or package version.

No release is authorized by concurrency-test coverage alone.
