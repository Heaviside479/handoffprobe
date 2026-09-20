# P10.5 reliability closeout

Date: 2026-09-20

Status: **COMPLETE CANDIDATE — local closeout evidence recorded 2026-09-20**

Decision: **NO PUBLIC RELEASE JUSTIFIED**

## Purpose

Close Phase 10 reliability hardening against the actual repository and published
v0.4.0 product state.

This closeout does not create a release merely because the roadmap milestone is
named v0.5 reliability hardening.

## P10.5-01 complete repository gates

The complete repository quality and security path passed on the merged Phase 10
base:

- 117 test files passed;
- 582 tests passed;
- format, lint, typecheck and secret checks passed;
- compatibility drift checking passed;
- build passed;
- the worktree remained clean.

## P10.5-02 package validation

Package validation and exact dry-run payload inspection passed:

- package remains `handoffprobe@0.4.0`;
- exact payload contains 295 files;
- allowed payload roots are `LICENSE`, `README.md`, `package.json` and `dist/**`;
- required CLI and package-root files are present;
- repository source, tests, docs, scripts, workflow files, compatibility matrix
  and lockfile are excluded from the npm payload;
- no local tarball artifact or repository drift remained after inspection.

## P10.5-03 compatibility and fixture evidence

Compatibility and fixture evidence was reverified against repository-owned
records:

- Node contract remains `>=24 <25`;
- protocol baseline remains A2A 1.0 → MCP 2026-07-28;
- compatibility matrix check passes;
- Phase 9 crossing-corpus SHA-256 remains
  `f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb`;
- all 14 manifest-bound corpus files match their recorded SHA-256 values;
- the frozen corpus still contains exactly 28 cases;
- focused compatibility and fixture verification passed with 48 tests.

## P10.5-04 documentation reconciliation

The current README, installation guide, usage guide, security policy and
contributor guide were reconciled without requiring content changes.

They consistently describe:

- current public release `handoffprobe@0.4.0`;
- stable public corpus of **23 attacks**;
- A2A 1.0 → MCP 2026-07-28;
- Node `>=24 <25`;
- report schema `1`;
- the same immutable v0.4.0 Action release SHA;
- the same authorized-use and contributor quality boundaries.

## Release-scope review

The comparison from the verified v0.4.0 release commit
`8ffdbec95e8ebe6fe1db1f3c2151d571461d596d` to the Phase 10 closeout base
`9fb63164505170d586b2163edf6d3fa80e7091fa` shows only one changed runtime
source file under `src/**`:

`src/cli/diagnostics.ts`

That change adds an internal structured runtime-diagnostic representation.

Its recorded compatibility classification is **COMPATIBLE**:

- existing human-readable stderr messages remain unchanged;
- CLI commands and flags remain unchanged;
- exit-code meaning remains unchanged;
- report schema `1` remains unchanged;
- config schema `1` remains unchanged;
- package-root API remains unchanged;
- protocol baseline remains unchanged;
- stable attack corpus remains unchanged.

The remaining Phase 10 work is reliability, CI, testing, evidence,
documentation and maintainer infrastructure.

## Release decision

A public patch or minor release is not justified by the completed Phase 10 scope
alone.

Publishing only to expose documentation cleanup, CI coverage, regression tests,
benchmarking or internal compatible diagnostic infrastructure would create a
new public artifact without a proportional public product change.

Current public release remains `handoffprobe@0.4.0`.

Stable public corpus remains **23 attacks**.

The public protocol baseline remains A2A 1.0 → MCP 2026-07-28.

No separate release track is created.

A future evidence-backed product, compatibility, security-fix or otherwise
release-worthy scope may include the accumulated compatible reliability work in
its own controlled release track.

## Phase 10 closeout

Phase 10 has explicit compatibility promises, version-aware public contracts,
deterministic and concurrency evidence, safe diagnostics, reproducible
performance evidence, Linux/macOS/Windows repository CI verification,
dependency-upgrade policy and visible compatibility-drift failure.

The Phase 10 reliability objective is therefore satisfied without changing the
current public version.
