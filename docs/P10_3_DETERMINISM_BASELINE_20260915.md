# P10.3 determinism and seed baseline

Status: **COMPLETE — 2026-09-15**

## Scope

This record closes only the deterministic-seed-handling item of P10.3. It does not close the remaining benchmark, concurrency, diagnostics, redaction, or benchmark-variance work.

## Current state

The packaged HandoffProbe source currently uses no ambient random source for security execution or case generation.

The existing `seedInvoices` fixture field is deterministic fixture input. It is not a pseudo-random-number-generator seed and does not introduce randomized coverage.

HandoffProbe therefore does not add a speculative seed option to the CLI, config schema, report schema, package-root API, or GitHub Action while no randomized coverage exists.

## Determinism contract

If randomized coverage is introduced later, it must follow all of these rules:

1. randomized generation must require an explicit deterministic seed rather than ambient process entropy;
2. identical seed plus identical normalized inputs must produce the same generated cases, ordering, and security outcomes;
3. the effective seed must be reproducibly recordable in safe test evidence or diagnostics when randomized coverage is actually used;
4. generated security cases must remain local/synthetic unless separately authorized;
5. seed values must never contain or derive from secrets;
6. productive security behavior must not derive randomness from `Math.random`, `crypto.randomUUID`, `crypto.randomBytes`, `crypto.getRandomValues`, or equivalent ambient entropy;
7. wall-clock values such as `Date.now()` must not be used as implicit seeds or to change deterministic security semantics;
8. introducing randomized coverage requires focused deterministic replay tests before it can be admitted.

This policy does not prohibit deterministic synchronization, timeout enforcement, logical clocks, or benchmark timing. Those mechanisms must remain isolated from security-case meaning.

## Regression guard

`tests/p10-determinism-policy.test.ts` scans packaged TypeScript source under `src/` and rejects ambient randomness or wall-clock seeding primitives.

The guard intentionally does not scan benchmark scripts. P10.3 performance work needs measurement clocks, but benchmark timing must not feed back into packaged security semantics.

Any future exception requires an evidence-backed design change and a corresponding update to this policy and its tests. Silent exceptions are not allowed.

## Public-contract effect

This step changes no productive runtime behavior and introduces no new public seed parameter.

It does not change:

- the 22 stable attack IDs;
- the A2A 1.0 to MCP 2026-07-28 baseline;
- CLI/config/report schema contracts;
- GitHub Action inputs or outputs;
- package-root exports;
- npm package version.

The package remains `0.3.0`. The immutable `v0.3.0` release remains historical release state and is not moved or rewritten.

## Exit decision

P10.3 deterministic seed handling is complete for the current product shape:

- no randomized coverage exists today;
- ambient runtime entropy is guarded against;
- the admission contract for any future randomized coverage is explicit;
- no speculative public seed surface was added.

The remaining P10.3 work continues separately.
