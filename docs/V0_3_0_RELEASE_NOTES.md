# HandoffProbe v0.3.0 release notes

Status: **release candidate — not yet published.**

## Summary

HandoffProbe v0.3.0 is a backward-compatible minor release candidate focused on one shipped security-capability improvement: the semantic-authority refinement of stable `HP-AUTH-001`.

The candidate keeps the public product deliberately narrow: deterministic defensive testing of A2A 1.0 → MCP 2026-07-28 handoffs with exactly 22 stable attacks.

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

No new stable attack ID is introduced by this release candidate.

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

## Release-candidate verification status

Already completed before this release-notes draft:

- R3.1 scope/SemVer audit confirmed `v0.3.0` as the backward-compatible minor candidate;
- R3.2 removed the published-package metadata blocker;
- package version, package-lock root version and exported CLI version were synchronized to `0.3.0`;
- the targeted release-metadata test passed;
- the release-candidate build succeeded;
- `node dist/cli.js --version` reported `HandoffProbe 0.3.0`;
- no `v0.3.0` tag existed at version-synchronization time.

The candidate is **not considered released** until all remaining pre-publication gates pass and publication is synchronized across npm, the immutable annotated tag, GitHub Release, Action/Marketplace presentation, documentation and external exact-version verification.

## Publication gates still required

Before publication:

1. complete release-facing documentation and compatibility review;
2. run the full repository, dependency and security gates;
3. inspect the exact npm candidate tarball;
4. verify clean local install and exact-version execution from the candidate artifact;
5. verify the reusable GitHub Action from an external consumer against the exact frozen candidate commit;
6. freeze the exact release commit and record its evidence.

Only then may the coordinated publication sequence create the immutable annotated `v0.3.0` tag, publish `handoffprobe@0.3.0`, create the GitHub Release and perform post-publication verification.

## Explicit limitations

v0.3.0 does not claim:

- a generic internet scanner;
- a runtime firewall or authorization provider;
- security certification of A2A, MCP or any third-party implementation;
- a new public Phase 9 runtime API;
- T2 Handoff Contract implementation as a shipped capability;
- production-world effect validation beyond the evidence already documented for the repository research fixtures.
