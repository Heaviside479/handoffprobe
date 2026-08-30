# Phase 8.2A — External GitHub Action Onboarding Audit

Status: completed 2026-08-30

Repository baseline: `00062491733d50004e1bca526ce1fd38d1849b4d`

Published action revision under test: `90fdd691b390c420e3288383ad7efa7e0fb69e6f`

Human-readable release: `v0.1.0`

## Purpose

Phase 8.2A tested the public HandoffProbe GitHub Action from the perspective of a separate consumer repository.

The goal was to verify that the documented CI path works without relying on the HandoffProbe source checkout, a consumer-side npm dependency, hidden telemetry, paid infrastructure or elevated GitHub permissions.

This was a maintainer-created synthetic onboarding audit. It is not evidence of independent external adoption.

## Consumer repository

Temporary private repository:

`Heaviside479/handoffprobe-action-audit-20260830-134434`

Audit pull request:

`#1`

Consumer PR head:

`f03e5129e7b1f7b5845f577798d61fd06511379e`

Workflow run:

`33309692665`

The consumer repository intentionally had no `package.json`.

Its pull-request workflow used:

- `permissions: contents: read`
- immutable HandoffProbe revision `90fdd691b390c420e3288383ad7efa7e0fb69e6f`
- bundled target `secure`
- severity gate `high`
- artifact name `handoffprobe-report`

The consumer repository did not contain the HandoffProbe source tree.

## Verified action result

The external consumer workflow completed successfully.

Verified outputs:

- action result: `pass`
- action exit code: `0`
- report schema version: `"1"` as the canonical string type
- HandoffProbe version: `0.1.0`
- target: `secure`
- protocol baseline: A2A `1.0` → MCP `2026-07-28`
- threshold: `high`
- PASS: 22
- FAIL: 0
- NOT_APPLICABLE: 0
- INCONCLUSIVE: 0
- ERROR: 0
- TOTAL: 22
- findings: 22

The workflow uploaded both:

- `handoffprobe-report.json`
- `handoffprobe-summary.md`

Observed GitHub artifact:

- artifact ID: `9731591362`
- size: 2944 bytes
- SHA-256 digest: `5dcf4defd6705062b2c3794c250ed5ba2f33a0f4d3f8ff074fa56e32ee074172`

The Markdown summary independently confirmed:

- HandoffProbe `0.1.0`
- A2A 1.0 → MCP 2026-07-28
- target `secure`
- 22 selected attacks
- gate `PASS`
- 22 PASS / 0 FAIL / 0 ERROR / 22 TOTAL

## Least-privilege verification

The real GitHub Actions job reported:

`Contents: read`

No broader repository permission was required by the consumer workflow.

The consumer repository required no local Node/npm project setup. The source-backed HandoffProbe action set up Node 24 and installed/built its own action source from `GITHUB_ACTION_PATH`.

## Measured runtime observation

Observed action-step durations from the successful consumer run:

- action dependency install: 4394 ms
- action source build: 7501 ms
- scan: 1113 ms
- install + build: 11895 ms
- measured install + build + scan: 13008 ms

### O8-CI-002 — source-backed install/build overhead

The v0.1.0 source-backed action performs its own dependency installation and TypeScript build in the consumer job.

This is an observation, not a demonstrated onboarding failure. The consumer workflow completed successfully, so Phase 8.2A does not justify a packaging or action-architecture redesign from this measurement alone.

Reassess only if external users report CI latency or repeated usage demonstrates meaningful cost.

## Finding ranking

### High

None.

No action execution, permission, report, artifact or consumer-setup blocker was reproduced.

### Medium — F8-CI-001: immutable SHA copy-paste friction

The public documentation correctly recommends immutable commit-SHA pinning for external GitHub Actions usage, but the tested documentation did not provide the already verified v0.1.0 release commit directly.

Measured public-document state before correction:

- README placeholder occurrences: 2
- installation-guide placeholder occurrences: 1
- usage-guide placeholder occurrences: 1
- total placeholder occurrences: 4
- release SHA occurrences across those three public documents: 0

A new consumer therefore had to resolve the immutable HandoffProbe revision separately before the documented workflow became directly runnable.

Phase 8.2A correction:

Replace the placeholders in README, installation and usage examples with:

`90fdd691b390c420e3288383ad7efa7e0fb69e6f`

The documentation should identify this revision as the immutable commit for HandoffProbe v0.1.0 and retain the principle that commit-SHA pinning is stronger than a mutable or human-readable reference.

## Audit-harness corrections

Two interruptions during the audit were caused by the audit harness rather than HandoffProbe:

1. a `gh pr view --repo` call omitted the required PR identifier even though the PR and workflow had already been created successfully;
2. the artifact assertion initially expected numeric schema version `1`, while the canonical report contract defines schema version `"1"` as a string.

Neither interruption represents HandoffProbe product friction.

## Phase 8.2A decision

Phase 8.2A demonstrated that:

1. a separate repository can consume the published HandoffProbe v0.1.0 action through an immutable commit SHA;
2. the consumer does not need HandoffProbe source or a package dependency;
3. least-privilege `contents: read` is sufficient;
4. the action returns deterministic pass outputs;
5. the canonical JSON report and Markdown summary are uploaded successfully;
6. the only demonstrated documentation correction is the immutable-SHA copy-paste friction;
7. source-backed install/build time remains an observation only.

No `action.yml`, scanner behavior, attack behavior, protocol baseline, report schema or already published `handoffprobe@0.1.0` artifact is changed by the Phase 8.2A correction.

## Temporary audit repository

The temporary private repository was intentionally retained after the raw audit so evidence could be reviewed before any destructive cleanup.

Its existence must not be counted as independent adoption.

Deletion requires an explicit cleanup decision outside this audit record.

## Next work package

Proceed to Phase 8.2B: improve telemetry-free public or opt-in adoption signals without adding hidden product telemetry.
