# R4 v0.4.0 Scope and SemVer Audit — 2026-09-16

Status: **R4.1 COMPLETE — scope frozen; v0.4.0 classification confirmed; no version bump yet.**

## Purpose

Freeze the evidence-backed public release scope after T-3 closeout and the explicit V3/V13 attack-admission review, then decide whether the next coordinated public release is a patch, minor release, or no release.

This audit does not publish anything, create a tag, change the package version, or claim that `handoffprobe@0.4.0` already exists on npm.

## Audited baseline

- previous immutable public release: `v0.3.0`
- immutable `v0.3.0` release commit: `ef54b950b3ee333c406fa81087685d7f952a028d`
- T-3 closeout main commit used as the release-admission base: `525b5643859b7f07009f5ecb25d34facd272b3d4`
- development package version before release metadata preparation: `0.3.0`
- previous stable public attack corpus: **22 attacks**
- admitted candidate corpus after local promotion: **23 attacks**
- protocol baseline remains **A2A 1.0 → MCP 2026-07-28**
- report schema remains **1**
- Node policy remains **>=24 <25**

The 23-attack promotion has already passed the full repository gate locally before any version bump: 88 of 88 test files and 447 of 447 tests passed, package dry-run passed, and the source CLI listed exactly 23 stable attacks including `HP-AUTH-006`.

That pre-bump dry run is validation evidence only. It is not the final v0.4.0 release artifact.

## SemVer decision

**R4 classification: backward-compatible MINOR release candidate → `v0.4.0`.**

The reason is a real public security-capability addition rather than research volume alone:

- one new stable attack ID is admitted: `HP-AUTH-006`;
- the canonical stable execution catalog grows from 22 to 23 attacks;
- `handoffprobe list` exposes the new stable ID;
- default full-corpus `handoffprobe test` executes the new attack;
- the reusable GitHub Action inherits the same 23-attack canonical catalog;
- secure and intentionally vulnerable fixtures deterministically reproduce the intended PASS/FAIL distinction.

This changes the public security capability and default corpus while remaining compatible with the existing command surface, package-root export map, report schema, exit-code semantics, protocol baseline and Node policy.

A patch release is not appropriate because the stable public corpus and default test capability change. No breaking public contract requiring a pre-1.0 breaking-minor justification was found.

## Admitted public runtime capability

### `HP-AUTH-006 — Stale task authorization reused for later effect`

Priority: `advanced`

Default severity: `high`

Category: `authorization`

Stable invariant:

> Successful authorization of an earlier protected effect in a task/context must not authorize a later distinct protected effect after the governing authority becomes non-current; each protected effect must receive a current final authorization before dispatch.

Deterministic scenario:

1. one task/run/context starts with current authority;
2. distinct protected effect A is authorized and executes exactly once;
3. the governing delegation becomes non-current;
4. distinct protected effect B is attempted in the same task/run/context;
5. the secure fixture re-evaluates current authority and blocks B before protected dispatch;
6. the intentionally vulnerable fixture reuses the earlier task-level authorization and executes B;
7. secure total protected-effect delta is `1`;
8. vulnerable total protected-effect delta is `2`.

The evidence must distinguish effect A from effect B and must not reinterpret the case as a retry.

## Explicit admission decisions retained

### V3

**NO ADD**

V3 remains research/compatibility evidence. Its negative task/run-bound case overlaps the existing stable `HP-REPLAY-002` invariant, while the explicit context-bound positive lane is valuable for avoiding false positives rather than creating a separate attack ID.

### V13

**ADMITTED as `HP-AUTH-006`**

V13 is distinct from the closest existing stable cases because it tests stale authorization reuse across two different protected effects inside the same continuing task/run/context after governing authority becomes non-current.

## Public contracts intentionally preserved

R4 must preserve:

- CLI commands: `test`, `list`, `explain`, `--version`, `--help`;
- exit semantics: `0 / 1 / 2 / 3`;
- report schema version `1`;
- package-root export map shape;
- configuration schema baseline;
- GitHub Action input/output names and one-scan execution model;
- Node policy `>=24 <25`;
- protocol baseline A2A `1.0` → MCP `2026-07-28`;
- Apache-2.0 Core license;
- local-first bundled execution with no paid service requirement;
- no real external side effects from bundled fixtures.

The expected public corpus becomes:

- 12 stable P0 attacks;
- 10 stable P1 attacks;
- 1 stable advanced attack (`HP-AUTH-006`);
- **23 stable attacks total**.

## Research and evidence that do not become additional v0.4.0 attacks

The release must not inflate the stable corpus merely because the repository contains substantial research.

The following remain outside additional stable-ID admission unless separately admitted later:

- V3 context-binding positive-lane research;
- the #2079 cA2A real-shape result as a refinement of the existing `HP-AUTH-001` semantic-authority evidence path;
- T-2 protocol-neutral contract research and its independent Bayu review track;
- Phase 9 crossing-corpus research/conformance cases;
- the eight current-spec backlog candidates;
- queued T-4 witness-observation research.

T-4 does not need to be absorbed into v0.4.0 merely because it is next on the research roadmap.

## Release-facing documentation rule

Historical release and research records must remain historically accurate.

Do **not** mechanically replace every earlier `22 attacks` or `0.3.0` statement.

For example, v0.1/v0.2/v0.3 release notes, T-1/T-2/T-3 evidence records and prior post-publication verification documents must continue to describe the state that existed when they were written.

Only current release-facing surfaces and new R4 records should move to the v0.4.0 / 23-attack truth.

## Coordinated publication surfaces

R4 is not complete until the same verified release truth is synchronized across all public release surfaces:

1. merged release commit on GitHub;
2. immutable annotated `v0.4.0` tag;
3. GitHub Release `HandoffProbe v0.4.0`;
4. public npm package `handoffprobe@0.4.0`;
5. reusable GitHub Action / GitHub Marketplace presentation;
6. dedicated product site `https://handoffprobe.heaviside-solutions.com`;
7. HandoffProbe project page on `https://heaviside-solutions.com`;
8. clean external exact-version npm execution;
9. clean external GitHub Action verification.

No website should claim v0.4.0 is publicly available before publication is verified, and no half-published state is accepted as R4 complete.

## Required R4 sequence

### R4.2 — release metadata and current documentation preparation

- synchronize `package.json`, `package-lock.json` and exported `VERSION` to `0.4.0`;
- add v0.4.0 release notes in pre-publication/candidate form;
- update current README, installation, usage, attack catalog and CLI-facing documentation to the 23-attack release candidate without rewriting historical records;
- update release-metadata and current-release documentation tests;
- preserve the existing public contract surfaces listed above.

### R4.3 — exact pre-publication candidate verification

- run the complete repository quality gate;
- run dependency/security gates;
- inspect the exact npm tarball;
- verify `handoffprobe --version` reports `0.4.0`;
- verify `handoffprobe list` exposes exactly 23 stable IDs including `HP-AUTH-006`;
- verify secure full-corpus execution produces 23 PASS / 0 FAIL / 0 ERROR;
- verify the intentionally vulnerable catalog reproduces FAIL for all stable attacks;
- verify a clean local tarball install/execution path;
- freeze the exact release commit.

### R4.4 — merge and immutable release identity

- open the release PR;
- require all repository CI/checks to pass;
- merge only the reviewed candidate;
- create the immutable annotated `v0.4.0` tag only after the merged release commit is confirmed.

### R4.5 — public package and GitHub publication

- publish `handoffprobe@0.4.0` to npm;
- verify registry metadata and exact-version execution;
- create and verify the GitHub Release against the immutable tag;
- verify the reusable Action from an external consumer repository.

### R4.6 — public website and Marketplace reconciliation

Only after npm/GitHub publication is verified:

- update `https://handoffprobe.heaviside-solutions.com` to v0.4.0 / 23 stable attacks;
- update the HandoffProbe project page on `https://heaviside-solutions.com` to the same release truth;
- verify production responses and release links;
- verify GitHub Marketplace presents the intended latest release state;
- record post-publication verification in the repository.

## R4.1 exit decision

R4.1 is complete:

- `HP-AUTH-006` is the sole new stable-ID admission from the T-3 V3/V13 review;
- the technical corpus is proven locally at 23 attacks;
- the next version is classified as backward-compatible minor candidate `v0.4.0`;
- the package version remains `0.3.0` until R4.2;
- historical 22-attack records remain immutable historical truth;
- npm, GitHub, Marketplace and both Heaviside Solutions website surfaces are explicitly part of the coordinated publication closeout.

Next step: **R4.2 — release metadata and current documentation preparation.**
