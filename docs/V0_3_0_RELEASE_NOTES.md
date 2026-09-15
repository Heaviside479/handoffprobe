# HandoffProbe v0.3.0 release notes

Status: **published on 2026-09-14.**

## Summary

HandoffProbe v0.3.0 is a backward-compatible minor release focused on one shipped security-capability improvement: the semantic-authority refinement of stable `HP-AUTH-001`.

The release keeps the public product deliberately narrow: deterministic defensive testing of A2A 1.0 → MCP 2026-07-28 handoffs with exactly 22 stable attacks.

## User-facing security improvement

`HP-AUTH-001` now evaluates semantic authority across three explicit sets:

- upstream delegated authority;
- translated authority;
- effective downstream authority after any trusted downstream restriction.

The invariant is:

`effective_authority(downstream) ⊆ delegated_authority(upstream)`

When effective downstream authority widens beyond the upstream delegation, the finding reports concrete protected-operation witness operations. Representation loss by itself is not treated as a vulnerability when trusted downstream enforcement prevents effective authority from widening.

The existing `invoice.read` → `invoice.update` mutation remains the direct stable regression anchor.

## Compatibility boundary

v0.3.0 preserves:

- exactly **22 stable attacks**: 12 P0 and 10 P1;
- stable ID `HP-AUTH-001`;
- CLI commands `test`, `list`, `explain`, `--version` and `--help`;
- CLI exit semantics `0 / 1 / 2 / 3`;
- report schema version `1`;
- package-root export map;
- GitHub Action inputs, outputs and execution contract;
- Node `>=24 <25`;
- A2A `1.0` → MCP `2026-07-28`.

No new stable attack ID is introduced by this release.

## Package boundary

The npm package remains restricted to the stable `dist` build closure.

Repository-only commercial assessment delivery tooling is not part of the HandoffProbe Core npm runtime surface. The broken `assessment:report` package-metadata reference was removed before the v0.3.0 version synchronization, while the maintainer-facing repository tooling and tests remain available in source.

The README may include the HandoffProbe Security Assessment CTA. That does not create a paid CLI tier, alter the Apache-2.0 Core license or change the Core runtime contract.

## Research and internal scope that remains excluded

The following do not become new public Core runtime features in v0.3.0:

- T1 research and validation records supporting the semantic-authority admission decision;
- the protocol-neutral T2 Handoff Contract review specification or future T2 implementation;
- commercial assessment templates, delivery scripts, synthetic assessment fixtures and PDF/report tooling;
- Phase 9 crossing-corpus research/conformance cases as additional stable `HP-*` attacks.

## Post-publication verification

The v0.3.0 release completed the R3 publication sequence successfully:

- R3.1 scope/SemVer audit confirmed `v0.3.0` as the backward-compatible minor release;
- R3.2 removed the published-package metadata blocker before publication;
- package version, package-lock root version and exported CLI version are synchronized at `0.3.0`;
- the full release repository checks and package-boundary checks passed before publication;
- the immutable annotated `v0.3.0` tag and GitHub Release resolve to release commit `ef54b950b3ee333c406fa81087685d7f952a028d`;
- npm published `handoffprobe@0.3.0` with 291 package files, shasum `54e2349f754d62bb5a4001048c2cfcaf8bc8ce96` and integrity `sha512-f3F8tcVPKmGQ3rmFUQmN4SGFM5KumCIPIRqpLlsg4Q1EEObtszxOC29EswwzZsAlV1FNrIiTpdLux5ZyJy1WXA==`;
- clean external npm execution reported `HandoffProbe 0.3.0` and the secure bundled corpus completed with 22 PASS, 0 FAIL and 0 ERROR;
- the reusable GitHub Action was verified from a separate consumer repository against both the immutable release SHA and the public `v0.3.0` tag;
- the dedicated HandoffProbe product site and the HandoffProbe project page on Heaviside Solutions were updated to v0.3.0 and deployed successfully.

GitHub Marketplace presentation was re-verified on 2026-09-15: HandoffProbe v0.3.0 is presented as Latest, the reconciled published-release README and immutable release SHA are visible, and stale v0.2.0 release references are absent. This completed the final R3 post-publication closeout item.

## Explicit limitations

v0.3.0 does not claim:

- a generic internet scanner;
- a runtime firewall or authorization provider;
- security certification of A2A, MCP or any third-party implementation;
- a new public Phase 9 runtime API;
- T2 Handoff Contract implementation as a shipped capability;
- production-world effect validation beyond the evidence already documented for the repository research fixtures.
