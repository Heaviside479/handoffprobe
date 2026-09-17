# HandoffProbe v0.4.0 Release Notes

Status: **RELEASED AND VERIFIED — coordinated publication and post-publication verification completed 2026-09-17.**

Date prepared: 2026-09-16

## Summary

HandoffProbe v0.4.0 is a backward-compatible minor release that adds one evidence-backed stable advanced security check:

`HP-AUTH-006 — Stale task authorization reused for later effect`

The canonical stable corpus therefore grows from **22 to 23 attacks**:

- 12 P0;
- 10 P1;
- 1 advanced (`HP-AUTH-006`).

This release is based on a separate post-T-3 admission decision. T-3 research volume alone did not trigger a release.

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

The v0.4.0 release preserves:

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
- T-4 witness/conduct-observation work is not included in this release;
- Phase 9 crossing-corpus evidence remains scoped research/conformance evidence unless separately admitted;
- no A2A or MCP endorsement, standards acceptance, certification, partnership, production-world validation or generic security guarantee is claimed.

HandoffProbe remains a local-first defensive testing tool for synthetic, owned or explicitly authorized targets.

## Final release-candidate verification

Before the release-finalization documentation pass, the merged candidate demonstrated:

- 91 / 91 test files passed;
- 461 / 461 tests passed;
- build succeeded;
- dependency audit reported 0 vulnerabilities;
- npm package dry-run succeeded;
- exact local `handoffprobe-0.4.0.tgz` built and installed successfully;
- clean external package execution reported `HandoffProbe 0.4.0`;
- bundled secure full-corpus execution produced 23 / 23 PASS findings;
- vulnerable `HP-AUTH-006` reproduced the expected deterministic FAIL;
- the historical 22 stable IDs remained an unchanged prefix and `HP-AUTH-006` was entry 23;
- diff hygiene passed.

These results verify the release candidate and package boundary. They do not by themselves establish live npm, tag, GitHub Release, Marketplace or website availability.

## Publication verification

Coordinated post-publication verification completed on 2026-09-17. The following surfaces were independently checked against the released v0.4.0 truth:

- npm exact package `handoffprobe@0.4.0`;
- immutable annotated tag `v0.4.0`;
- GitHub Release `HandoffProbe v0.4.0`;
- GitHub Marketplace / reusable Action presentation;
- `https://handoffprobe.heaviside-solutions.com`;
- the HandoffProbe project page on `https://heaviside-solutions.com`.

At the pre-publication checkpoint on 2026-09-16, npm still exposed `handoffprobe@0.3.0` and no v0.4.0 tag or GitHub Release had yet been created. Those are historical checkpoint facts, not current-state claims.

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

This requirement was satisfied on 2026-09-17. Full closeout evidence is recorded in `docs/R4_V0_4_0_POSTPUBLICATION_CLOSEOUT_20260917.md`.
