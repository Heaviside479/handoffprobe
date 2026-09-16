# HandoffProbe v0.4.0 Release Notes

Status: **release candidate — not published.**

Date prepared: 2026-09-16

## Summary

HandoffProbe v0.4.0 is a backward-compatible minor release candidate that adds one evidence-backed stable advanced security check:

`HP-AUTH-006 — Stale task authorization reused for later effect`

The canonical stable corpus therefore grows from **22 to 23 attacks**:

- 12 P0;
- 10 P1;
- 1 advanced (`HP-AUTH-006`).

This release candidate is based on a separate post-T-3 admission decision. T-3 research volume alone did not trigger a release.

## New stable capability — HP-AUTH-006

`HP-AUTH-006` measures a multi-effect authorization freshness invariant inside one task/run/context.

Deterministic scenario:

1. establish one task/context with valid governing authority;
2. execute distinct protected effect A successfully;
3. keep the same task/run/context but make the governing authority non-current;
4. attempt distinct protected effect B;
5. the secure fixture re-evaluates current final authority and blocks effect B before `mcp.tool.call`;
6. the intentionally vulnerable fixture reuses the earlier task-level authorization and executes effect B.

Expected effect evidence:

- secure: exactly one protected effect total;
- vulnerable: exactly two protected effects total.

Effect A and effect B are distinct logical protected effects, not retries of one logical action.

## Admission provenance

The T-3 `#1937` comparison originally classified V3 and V13 as `DISTINCT RESEARCH CANDIDATE`, not as stable attacks.

The later R4 admission review concluded:

- V3: `NO ADD`; the negative security case overlaps existing `HP-REPLAY-002`, while the context-bound positive lane remains useful compatibility/false-positive evidence;
- V13: admitted for stable implementation as `HP-AUTH-006`.

The cA2A `#2079` work remains a refinement of the existing `HP-AUTH-001` semantic-authority evidence path and does not create another stable ID.

## Public contract

The v0.4.0 candidate preserves:

- CLI commands: `test`, `list`, `explain`, `--version`, `--help`;
- deterministic exit semantics `0 / 1 / 2 / 3`;
- report schema version `1`;
- package-root export map;
- GitHub Action inputs/outputs and source-backed execution model;
- Node `>=24 <25`;
- A2A 1.0 → MCP 2026-07-28 protocol baseline.

The default full-corpus CLI and GitHub Action now consume the same 23-attack canonical execution catalog.

## Research and non-claims

v0.4.0 does not ship every research artifact created after v0.3.0 as a public product capability.

Specifically:

- V3 remains research/compatibility evidence;
- T-2.7/Bayu independent review remains pending and is not a shipped capability;
- T-4 witness/conduct-observation work is not included in this release candidate;
- Phase 9 crossing-corpus evidence remains scoped research/conformance evidence unless separately admitted;
- no A2A or MCP endorsement, standards acceptance, certification, partnership, production-world validation or generic security guarantee is claimed.

HandoffProbe remains a local-first defensive testing tool for synthetic, owned or explicitly authorized targets.

## Release-candidate verification completed before documentation reconciliation

Before R4.3 documentation reconciliation, the candidate implementation demonstrated:

- 88 / 88 test files passed;
- 447 / 447 tests passed;
- build succeeded;
- npm package dry-run succeeded;
- CLI exposed exactly 23 stable attacks;
- bundled secure full-corpus execution produced 23 PASS findings;
- `HP-AUTH-006` had deterministic secure/vulnerable coverage;
- diff hygiene passed.

These are pre-publication candidate results, not evidence that `handoffprobe@0.4.0` is already available from npm.

## Publication state

Source/package metadata is synchronized to `0.4.0`.

Until coordinated publication completes:

- the current public npm release remains `handoffprobe@0.3.0`;
- no `v0.4.0` immutable tag is claimed;
- no GitHub Release `HandoffProbe v0.4.0` is claimed;
- GitHub Marketplace must not be described as presenting v0.4.0;
- `https://handoffprobe.heaviside-solutions.com` must not claim v0.4.0 is publicly available;
- the HandoffProbe project page on `https://heaviside-solutions.com` must not claim v0.4.0 is publicly available.

## Coordinated publication requirement

R4 is complete only after the same verified release truth is synchronized across:

1. merged release commit;
2. immutable annotated `v0.4.0` tag;
3. GitHub Release;
4. public npm `handoffprobe@0.4.0`;
5. reusable GitHub Action / Marketplace presentation;
6. dedicated HandoffProbe product site;
7. HandoffProbe project page on Heaviside Solutions;
8. clean external exact-version npm execution;
9. clean external GitHub Action execution.

No half-published release state is accepted.
