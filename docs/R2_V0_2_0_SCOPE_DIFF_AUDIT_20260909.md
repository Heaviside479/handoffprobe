# v0.2.0 scope and diff audit — 2026-09-09

Status: **R2.1 complete; R2.2 next**

## Purpose

This record freezes the R2.1 scope classification for the controlled HandoffProbe v0.2.0 release track. It distinguishes the stable public product surface from research tooling, internal validation, documentation, fixes and package payload.

## Audited baselines

- immutable public v0.1.0 release commit: `90fdd691b390c420e3288383ad7efa7e0fb69e6f`
- public v0.1.1 maintenance release commit: `8e58c2f6553c735bec3857945ca5afde8c8a3177`
- audited current main commit: `5db505285fa3f110ce0889570b6f98c4a4070fdf`
- v0.1.1 and main diverge from the immutable v0.1.0 release commit, so release analysis uses effective tree comparison rather than treating v0.1.1 as a linear ancestor of main.

## Effective tree audit

The effective `v0.1.1` to audited-main comparison contains 129 changed files.

Stable public runtime closure:

- `action.yml`: no effective tree change
- `src/core`: no effective tree change
- `src/attacks`: no effective tree change
- `src/cli`: no effective tree change
- `src/p0-fixture` and `src/p1-fixture`: no effective tree change
- stable fixture references to `src/protocol-lab/evidence.ts` remain, but that module has no effective tree change
- none of the six modified Phase 9 related Protocol Lab files is referenced from the stable CLI/core/attack/P0/P1 runtime path
- stable CLI execution catalog remains exactly 22 unique attacks
- secure control remains 22 PASS / 0 FAIL / 0 ERROR with exit 0
- vulnerable `HP-AUTH-001` control remains 1 FAIL with exit 1
- protocol baseline remains A2A 1.0 to MCP 2026-07-28

## Classification

### PUBLIC FEATURE

- R2.1 admits no new public runtime feature beyond the existing stable HandoffProbe CLI/API/Action contract and 22-attack corpus
- Phase 8 developer-experience and adoption improvements are documentation/workflow surfaces rather than new runtime commands or APIs
- Phase 9 is not admitted as a public CLI command, package-root API export, GitHub Action behavior or additional stable attack corpus in R2.1

### FIX

- the patched `qs` dependency resolution remains present on main at 6.16.0
- v0.1.1 release/changelog/public-documentation history has been reconciled into the development line without mechanically applying the maintenance-line package version bump

### DOCS

- Phase 8 adoption, contributor, first-run, Action, adapter-demand and research records
- Phase 9 integration and execution evidence documentation
- release, installation, usage, README and roadmap reconciliation
- public issue templates for adoption feedback and adapter requests

### INTERNAL

- test-suite growth and regression coverage
- Protocol Lab implementation changes that are not reachable through the stable public CLI/API contract
- Phase 9 implementation internals that are not exported from the package root

### RESEARCH

- Phase 9 A2A 1.0 to MCP 2026-07-28 crossing-corpus integration
- deterministic 28-case crossing execution and evidence
- issuer-authentication and non-issuer-negative-control work
- externally reviewed `implementation_independent` evidence within its documented narrow scope
- archived Phase 9 evidence under `artifacts/phase9`; these files are tracked in Git but are not npm package payload

### PACKAGE PAYLOAD

Current main adds `fixtures/phase9/a2a-mcp-crossing-v2` to the npm `files` allowlist.

The audited `npm pack --dry-run` produced:

- 362 total files
- 340 files under `dist`
- 48 Phase 9 files under `dist/phase9`
- 19 vendored Phase 9 fixture files
- 0 archived `artifacts/phase9` files
- package size 175760 bytes
- unpacked size 876792 bytes

The Phase 9 code and fixture paths are not exposed through the package export map. Deep imports are blocked with `ERR_PACKAGE_PATH_NOT_EXPORTED`. The stable CLI, GitHub Action, core and attack surface do not depend on the Phase 9 package payload.

Therefore the current Phase 9 npm payload is **not treated as an approved public feature by R2.1**. It is identified as research-support package payload whose retention or removal must be decided explicitly in R2.3.

## Vendored fixture provenance and redistribution

The vendored crossing corpus records:

- upstream repository: `Silentpartnercoding/minority-prophet-border`
- pinned upstream commit: `09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a`
- pinned corpus SHA-256: `f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb`
- external cases: 28
- upstream license: Apache-2.0

`LICENSE`, `NOTICE` and `ORIGIN.md` are present in the vendored fixture directory and are included by the current npm package payload. No archived Phase 9 evidence directory is included in the npm payload.

## Frozen v0.2.0 public feature list

R2.1 freezes the following release intent:

1. Preserve the existing stable HandoffProbe public CLI/API/Action contract and the 22-attack stable corpus.
2. Carry forward the v0.1.1 security fix and patched dependency state.
3. Carry forward the Phase 8 developer-experience, adoption-feedback, contributor and research-documentation improvements.
4. Carry forward Phase 9 as reproducible research/conformance work and documented evidence, not as additional stable attack IDs.
5. Add no Phase 9 public CLI command, package-root API export or GitHub Action behavior unless R2.3 produces a separately justified user-facing decision before release-candidate freeze.

## Explicitly deferred

The following are outside the frozen R2.1 public feature list unless a later release-track gate explicitly admits them:

- new stable attack IDs derived from Phase 9 conformance cases
- new production adapters without demonstrated demand and normal admission review
- a public Phase 9 CLI/API merely because implementation code exists
- claims of `operator_independent`, production-world effect, production key management or restart-durable replay protection without new evidence
- treating vendored Phase 9 package payload as automatically justified; R2.3 must choose packaged research tooling or internal-only validation explicitly

## R2.1 conclusion

All six R2.1 requirements are satisfied at the audited main commit. R2.2 may now begin. Package/source version remains intentionally `0.1.0` until controlled v0.2.0 release preparation; this audit does not perform a version bump.
