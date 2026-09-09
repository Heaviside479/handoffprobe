# v0.2.0 R2.4 release-quality evidence — 2026-09-09

Status: R2.4 in progress — nine of ten release-quality gates verified

## Baseline

- repository baseline: `2986d222933859a06b34a6b93062d243133ea4bb`
- branch at audit time: `main`
- worktree remained clean before and after the audit
- `package.json` and `src/index.ts` remained at development version `0.1.0`
- no tag, GitHub Release or npm publication was created

## Verified release-quality gates

### CI and dependency review

The normal pull-request checks for the R2.3 merge line were green:

- HandoffProbe
- CI
- Dependency Review

### Dependency audit

Both the full dependency audit and production-dependency audit reported:

- High: `0`
- Critical: `0`

There is therefore no known unaddressed High or Critical dependency release blocker in this baseline.

### Full deterministic quality gate

`npm run check` completed successfully with:

- 67 of 67 test files passing
- 353 of 353 tests passing
- release build passing

Expected Phase 9 rejection diagnostics printed to stderr during negative-path tests are part of the tested behavior and did not represent test failures.

### Package dry-run and exact tarball inspection

The package dry-run and exact local tarball creation both completed successfully.

Baseline artifact characteristics:

- development package version: `0.1.0`
- package files: `287`
- exact baseline tarball SHA-256: `ee5e98dbf289e68c86c1041bf2b502d2f1e4f6208fdfebf89d396532fb28f18c`
- `dist/index.js`: present
- `dist/cli.js`: present
- `dist/github-action/run-action.js`: present
- pinned Phase 9 fixture files in npm payload: `0`
- research-only Phase 9 modules in npm payload: `0`

This tarball is R2.4 baseline evidence only. It is not the final v0.2.0 release candidate because the controlled version transition has not happened yet.

### Clean-clone verification

A fresh local clone from the exact baseline completed:

- `npm ci`: exit `0`
- release build: exit `0`
- CLI version invocation: exit `0`
- stable attack count: `22`
- secure full-corpus execution: exit `0`

The clean clone correctly reported the still-unreleased development version `HandoffProbe 0.1.0`.

### Clean local-tarball npx verification

A separate clean directory successfully executed the exact locally packed artifact through `npx`:

- version invocation: exit `0`
- stable attack count: `22`
- secure full-corpus execution: exit `0`

## Action status

The locally built reusable Action runtime was smoke-tested successfully:

- action runner present
- action core present
- action smoke execution: exit `0`
- action result: `pass`
- HandoffProbe action exit code: `0`

This local smoke test does not by itself close the R2.4 reusable Action consumer-verification gate. That gate requires execution from a separate consumer repository against an immutable HandoffProbe commit.

## Documentation audit note

The first shell-based documentation-version loop produced one false `MISSING` result because zsh did not split the scalar list into individual filenames.

Direct repository inspection confirms that `README.md`, `docs/INSTALLATION.md`, `docs/USAGE.md`, `SECURITY.md` and `CONTRIBUTING.md` exist.

At the initial technical-baseline audit, the documentation-consistency gate remained open because the public documentation still contained v0.1/v0.1.1 release framing. That baseline finding is retained here for chronology; the gate was subsequently reconciled as recorded below without prematurely claiming v0.2.0 publication.

## Documentation, changelog and release-note verification

The v0.2.0 release-candidate documentation boundary was reconciled without prematurely claiming publication.

Verified outcomes:

- `README.md` keeps `0.1.1` as the current public npm package while describing v0.2.0 as an unreleased release candidate;
- `docs/INSTALLATION.md` keeps public registry commands pinned to `handoffprobe@0.1.1` until publication;
- `docs/USAGE.md` records the preserved v0.2.0 public runtime contract;
- `SECURITY.md` records the v0.2.0 local-first safety boundary;
- `CONTRIBUTING.md` records the narrow v0.2.0 product scope and keeps Phase 9 research/conformance tooling outside the public runtime surface;
- `CHANGELOG.md` contains both the v0.1.1 security-maintenance record and an explicit unreleased v0.2.0 entry;
- `docs/V0_2_0_RELEASE_NOTES.md` distinguishes user-facing contract, maintenance fixes, research assets, compatibility and explicit limitations;
- dedicated v0.2.0 documentation regression tests pass.

After these documentation changes, the full repository quality gate passed with 68 of 68 test files and 358 of 358 tests passing.

## Remaining R2.4 gates

Only one R2.4 gate remains before release quality can be closed:

1. verify the reusable GitHub Action from a separate consumer repository against an immutable candidate commit.

## Deterministic-suite timeout hardening

A later full-quality rerun produced two timeout-only failures in full-corpus secure-path tests:

- `tests/cli-execution-catalog.test.ts`: approximately `5079 ms` against the default 5-second test timeout;
- `tests/cli.test.ts`: approximately `5195 ms` against the default 5-second test timeout.

No assertion, scanner result, attack result or runtime contract failed.

A read-only diagnostic then verified:

- both affected test files together: pass;
- CLI execution-catalog test file: 3 of 3 repeated runs passed;
- CLI test file: 3 of 3 repeated runs passed;
- the affected full secure-corpus paths completed far below five seconds when isolated.

This evidence supports classification as parallel-load/resource-contention timeout flakiness rather than a reproducible HandoffProbe product regression.

The release-quality hardening therefore assigns a 15-second timeout only to those two full-corpus integration tests. The global Vitest timeout, production source, attack behavior, CLI behavior and public contract are unchanged.

Post-hardening full quality gate: passed successfully.
## R2.4 boundary

R2.4 does not perform the final `0.2.0` version bump, create a release tag, publish npm, create a GitHub Release or change immutable v0.1.0/v0.1.1 release history.

The final version transition and publication remain R2.5 work after all R2.4 gates are closed.
