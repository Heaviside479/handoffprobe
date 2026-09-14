# R3 v0.3.0 Scope and SemVer Audit — 2026-09-14

Status: **R3.1 COMPLETE — scope frozen; v0.3.0 classification confirmed; no version bump yet.**

## Purpose

Freeze the evidence-backed public release scope after T1.6 and decide whether the next release should be a patch, minor release, or no release.

This audit does not publish anything and does not change the package version.

## Audited baseline

- previous immutable public release: `v0.2.0`
- `v0.2.0` release commit: `b0fc2a8abe1df36e526536d714418a9842be2f77`
- audited post-T1.6 main commit: `9fc256faee1c407e2df601dc6aa1cd9f70575245`
- development package version before release preparation: `0.2.0`
- stable public attack corpus: **22 attacks**

The audited main line is a direct descendant of `v0.2.0`.

## SemVer decision

**R3 classification: backward-compatible MINOR release candidate → `v0.3.0`.**

T1.6 changes shipped `HP-AUTH-001` behavior rather than only documentation or research evidence. The stable attack now evaluates upstream, translated, and effective downstream authority over deterministic protected-operation semantics and reports concrete widening witnesses.

The change remains backward-compatible:

- stable ID remains `HP-AUTH-001`;
- public stable attack count remains **22**;
- default severity and property class remain unchanged;
- A2A `1.0` → MCP `2026-07-28` applicability remains unchanged;
- CLI command set and exit semantics remain unchanged;
- package-root export map remains unchanged;
- report schema remains unchanged;
- GitHub Action inputs, outputs, and execution contract remain unchanged;
- Node policy remains `>=24 <25`.

Because this is a meaningful shipped security-capability improvement without a breaking public contract, `v0.3.0` is preferred over `v0.2.1`.

`v0.3.1` remains reserved for a later patch after `v0.3.0`.

## Frozen R3 public release scope

### PUBLIC RUNTIME FEATURE

- refined stable `HP-AUTH-001` semantic-authority evaluation;
- existing `invoice.read` → `invoice.update` mutation remains the direct stable regression anchor;
- deterministic evidence now includes upstream, translated, and effective downstream operation sets, trusted downstream enforcement state, authority relation, and concrete widening witness operations;
- no new stable attack ID.

### PUBLIC DOCUMENTATION / DISTRIBUTION

- release-facing documentation must accurately describe the refined `HP-AUTH-001` behavior;
- the current README Security Assessment CTA may become npm-visible through the normal release because npm presents the repository README;
- the CTA does not create a paid CLI tier and does not change Core licensing or runtime behavior.

### REPOSITORY-ONLY COMMERCIAL / INTERNAL TOOLING

The commercial assessment report system added after `v0.2.0` remains repository tooling, not a public npm runtime feature:

- commercial assessment specifications and templates;
- synthetic assessment fixture;
- assessment report/delivery scripts;
- PDF/report tests;
- customer working data remains excluded.

These items must not be marketed as part of the HandoffProbe Core CLI/API feature surface.

### RESEARCH / VALIDATION

The following remain research/validation evidence rather than additional stable attacks or compatibility claims:

- T1 evidence freeze, overlap matrix, independent reproduction, admission decision, and closeout records;
- T2 protocol-neutral Handoff Contract review specification;
- semantic-authority research model/tests supporting the admission decision.

T2 implementation is outside frozen R3 scope unless separately admitted through its own evidence gates. R3 must not absorb future T2 work.

## Explicitly unchanged public contracts

R3 must preserve unless a later gate explicitly finds otherwise:

- stable attack count: **22**
- stable ID: `HP-AUTH-001`
- CLI commands and exit semantics
- package-root export map
- report schema
- GitHub Action inputs/outputs and execution contract
- Node policy: `>=24 <25`
- protocol baseline: A2A `1.0` → MCP `2026-07-28`

## Release blocker discovered during R3.1

Current repository `package.json` contains:

`"assessment:report": "tsx scripts/commercial-assessment-delivery.ts"`

The npm package allowlist contains only `dist`, while the release build compiles from `src`; repository `scripts/` source is not included in the npm tarball.

Publishing unchanged package metadata would therefore advertise an installed-package npm script whose referenced source file is absent from the published artifact.

This is a **release-preparation blocker**, not a T1.6 defect.

### R3.2 required resolution

Before any version bump:

1. keep commercial assessment delivery repository-only;
2. remove the broken installed-package `assessment:report` script from publishable root package metadata rather than expanding the npm payload merely to support that internal command;
3. preserve a documented repository-local invocation path for maintainers if still needed;
4. rerun repository tests, package checks, exact tarball inspection, and release-metadata tests;
5. verify no commercial assessment source or customer data enters the npm payload.

Do not publish `v0.3.0` until this blocker is resolved.

## R3.1 exit decision

R3.1 is complete:

- release scope is frozen;
- SemVer classification is confirmed as candidate `v0.3.0`;
- no version bump has occurred;
- stable attack count remains 22;
- future T2 implementation is excluded from this release freeze;
- one package-metadata blocker is recorded for R3.2.

Next step: **R3.2 — package metadata cleanup and release-surface verification.**
