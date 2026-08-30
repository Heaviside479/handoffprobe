# Phase 8.1A — First-Run Friction Audit

Status: completed 2026-08-30

Public package under test: `handoffprobe@0.1.0`

Repository baseline: `8299ebcce2f391e508f8203c037833757b34c6a0`

## Method

The audit exercised the public package from fresh temporary directories with isolated npm caches and an empty npm configuration file.

The test host used:

- Node.js `v24.17.0`
- npm `11.13.0`
- the public npm registry
- no repository mutation
- no source checkout for the public-package path
- no paid service, account or telemetry

The audit intentionally used the documented exact-version public commands before testing a normal project installation.

## Measured first-run results

Public registry metadata:

- `npm view handoffprobe@0.1.0` exited `0`
- published version: `0.1.0`
- engine contract: `>=24 <25`
- public shasum matched the immutable release: `2aa56211d7559cac2cf2052275af45331fba6663`

Fresh exact-version `npx` path:

- `handoffprobe --version` exited `0`
- cold version check completed in 13 seconds on the audit host
- `handoffprobe --help` exited `0`
- `handoffprobe list` exited `0` and exposed 22 unique stable attack IDs
- the first secure scan exited `0`
- automated time from the cold version-check start through first successful secure scan was 23 seconds
- the secure bundled target produced 22 PASS / 0 FAIL / 0 ERROR
- the vulnerable `HP-AUTH-001` demonstration exited `1` as designed

Machine-readable path:

- JSON reporter exited `0`
- stderr remained empty
- JSON parsed successfully
- report schema version was `1`
- report contained 22 findings for the full secure corpus

Fresh project-install path:

- `npm init -y` exited `0`
- `npm install --save-dev handoffprobe@0.1.0` exited `0`
- installation completed in 8 seconds on the audit host
- npm reported 0 vulnerabilities
- installed package resolved to `handoffprobe@0.1.0`
- project-local version and secure scan both exited `0`
- npm saved the dependency as `"handoffprobe": "^0.1.0"`

Configuration and recovery behavior:

- configuration discovery produced the requested JSON report
- CLI options overrode configuration values
- the intentional vulnerable override exited `1`
- invalid target exited `2` with actionable guidance
- malformed configuration exited `2` with actionable guidance
- `explain` without an ID exited `2` with actionable guidance

The repository remained on the exact baseline commit with a clean worktree throughout the audit.

## Finding ranking

### High

None.

No install, execution, reporting, configuration or recovery blocker was reproduced on the supported Node.js baseline.

### Medium — F8-001: documented exact project install does not save an exact dependency

The installation guide labels the project-install command as an exact public release installation, but:

`npm install --save-dev handoffprobe@0.1.0`

saved:

`"handoffprobe": "^0.1.0"`

This can allow a future compatible-range update even though the surrounding documentation explicitly recommends deterministic exact-version use.

Phase 8.1B correction:

`npm install --save-dev --save-exact handoffprobe@0.1.0`

The same correction applies to the documented update command that claims to install an exact npm version.

### Medium — F8-002: public documentation still contains pre-release wording

The public documentation still contained wording that assumed `0.1.0` had not yet been published, including:

- a README instruction conditioned on a future versioned public release
- an installation sentence beginning with `After v0.1.0 is released`
- a usage sentence beginning with `Before the npm package is publicly released`

The package is already public. These statements are stale and can make a new user question which execution path is current.

Phase 8.1B corrects the wording without changing product behavior.

### Observe — O8-001: cold `npx` latency

The cold exact-version version check took 13 seconds and the automated path through the first successful secure scan took 23 seconds on the audit host.

This did not produce a failure and does not justify code or packaging changes by itself. Re-measure only if external users report first-run latency.

### Observe — O8-002: Node.js 24 requirement

The audit host satisfied the documented `>=24 <25` engine contract, so this audit did not demonstrate Node-version friction.

Do not broaden the engine range without compatibility evidence and regression testing.

### Observe — O8-003: dependency installation size

The fresh project install added 84 packages and npm reported 0 vulnerabilities.

No dependency reduction is justified by this audit alone.

## Phase 8.1B decision

The measured highest-value corrections are documentation-only:

1. make the documented exact project installation actually save an exact dependency;
2. remove stale pre-release wording from the public README, installation guide and usage guide;
3. add regression coverage so these first-run documentation contracts do not drift back.

No CLI behavior, attack behavior, protocol baseline, report schema or published `handoffprobe@0.1.0` artifact is changed by Phase 8.1B. Documentation changes may affect a future locally packed tarball, but the already published `handoffprobe@0.1.0` artifact is not republished or modified.

## Next work package

Proceed to Phase 8.2A: audit GitHub Action onboarding and CI adoption from an external-consumer perspective.
