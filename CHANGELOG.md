# Changelog

All notable project changes will be documented here.

## Unreleased

### Added

- reusable core security engine with attack registry, runner and adapter contracts
- canonical `SecurityContext`, `EvidenceEvent` and `Finding` domain models
- deterministic `CoreRunner` with run/correlation IDs and protocol evidence normalization
- structured PASS/FAIL/NOT_APPLICABLE/INCONCLUSIVE/ERROR finding semantics
- timeout, adapter and evaluation error handling that cannot masquerade as security failures
- recursive secret redaction for structured evidence
- first-class protocol-lab `TargetAdapter` and replaceable `HandoffAdapter`
- attack source/provenance propagation into findings and evidence
- automated Phase 2 exit-gate coverage proving attacks can reuse unchanged A2A/MCP plumbing

- deterministic A2A 1.0 → MCP 2026-07-28 protocol laboratory
- real local A2A HTTP+JSON caller and receiver using the official A2A SDK
- modern MCP client/server fixture using the official MCP TypeScript SDK
- explicit handoff translation with `SecurityContext` and structured `EvidenceEvent` traces
- secure reference fixture preserving principal continuity
- intentionally vulnerable fixture reproducing principal continuity loss
- harmless deterministic `read_invoice` fake tool
- repeated-run determinism regression coverage for protocol-lab evidence

- TypeScript/npm project bootstrap with Node 24 LTS policy
- minimal HandoffProbe CLI entrypoint and deterministic CLI tests
- format, lint, typecheck, test, build and package-validation gates
- baseline GitHub Actions CI workflow

- research/protocol baseline for A2A 1.0 and MCP 2026-07-28
- competitive-landscape and explicit handoff/composition admission rule
- severity/property classification policy
- expanded current-spec handoff attack backlog for MCP stateless state handles, caching and MRTR
- safe local-first active-testing requirements
- final HandoffProbe product/package/CLI identity

### Changed

- renamed the pre-alpha project from the retired BridgeBreak working name to **HandoffProbe**
- standardized planned package/CLI naming on `handoffprobe`
- changed pre-implementation attack IDs from `BB-*` to `HP-*`
- removed the future naming gate from the roadmap because the product naming decision is now closed
- refined v0.1 from generic cross-protocol security toward dynamic A2A -> MCP handoff regression testing
- reclassified replay terminology to avoid obsolete MCP session assumptions
- made translation and evidence lineage first-class architecture concepts

## 0.4.0 — 2026-09-16 (release candidate; not published)

### Security capability

- adds stable advanced attack `HP-AUTH-006 — Stale task authorization reused for later effect`
- expands the canonical stable corpus from 22 to 23 attacks: 12 P0 + 10 P1 + 1 advanced
- verifies that a later distinct protected effect receives current final authorization after governing authority becomes non-current
- secure fixture executes only the first legitimate protected effect and blocks the later stale-authority effect before dispatch
- intentionally vulnerable fixture reuses the earlier task-level authorization and deterministically executes the later effect

### Compatibility

- preserves the existing `test`, `list`, `explain`, `--version` and `--help` command surface
- preserves report schema `1`, exit semantics `0 / 1 / 2 / 3`, package-root exports and GitHub Action inputs/outputs
- preserves Node `>=24 <25` and the A2A 1.0 → MCP 2026-07-28 protocol baseline
- the default full-corpus CLI and source-backed GitHub Action now consume the same 23-attack canonical catalog

### Admission and research boundary

- V3 remains `NO ADD`; its context-bound positive lane remains research/compatibility evidence rather than a new stable attack
- V13 was separately admitted after T-3 closeout and becomes `HP-AUTH-006`
- T-3 completion itself did not authorize this release
- the cA2A `#2079` stream remains a refinement of `HP-AUTH-001`, not a new stable ID
- T-2.7/Bayu review and T-4 witness-observation work are not shipped as v0.4.0 capabilities

### Publication status

- package, lockfile and exported source version are synchronized at release-candidate `0.4.0`
- public npm remains `handoffprobe@0.3.0` until coordinated publication is completed and verified
- no `v0.4.0` tag, GitHub Release, Marketplace claim or website availability claim is created by release preparation alone
- final publication must synchronize npm, immutable tag, GitHub Release, Marketplace presentation, the dedicated HandoffProbe site and the HandoffProbe project page on Heaviside Solutions

## 0.3.0 — 2026-09-14

### Security capability

- refines stable `HP-AUTH-001` to evaluate upstream delegated, translated and effective downstream authority over deterministic protected-operation semantics
- reports concrete widening witness operations when effective downstream authority exceeds upstream delegation
- treats representation loss as non-failing when trusted downstream enforcement keeps effective authority within the upstream delegation
- preserves the existing `invoice.read` → `invoice.update` direct regression anchor and stable `HP-AUTH-001` identity

### Compatibility

- preserves exactly 22 stable attacks: 12 P0 and 10 P1
- preserves the existing `test`, `list`, `explain`, `--version` and `--help` CLI surface
- preserves report schema `1`, exit semantics `0 / 1 / 2 / 3`, package-root exports and GitHub Action inputs/outputs
- preserves Node `>=24 <25` and the A2A 1.0 → MCP 2026-07-28 protocol baseline

### Packaging and distribution

- removes the repository-only commercial assessment delivery command from published npm package metadata while keeping the assessment tooling available to repository maintainers
- keeps the npm payload restricted to the stable `dist` build closure
- carries the Security Assessment CTA in release-visible README content without creating a paid CLI tier or changing the Apache-2.0 Core license
- keeps commercial assessment templates, report generation, synthetic assessment fixtures and T2 review work outside the public Core runtime surface

### Release status

- package, lockfile and exported CLI version are synchronized at `0.3.0`
- published as `handoffprobe@0.3.0` on npm; the immutable annotated `v0.3.0` tag and GitHub Release resolve to release commit `ef54b950b3ee333c406fa81087685d7f952a028d`
- clean external npm execution and external GitHub Action consumer verification passed after publication

## 0.2.0 — 2026-09-09

### User-facing product contract

- preserves the existing `test`, `list`, `explain`, `--version` and `--help` CLI surface
- preserves exactly 22 stable attacks, the A2A 1.0 → MCP 2026-07-28 protocol baseline, report schema `1` and deterministic exit semantics `0 / 1 / 2 / 3`
- preserves the reusable source-backed GitHub Action without adding a Phase 9 Action input, output or command
- narrows the npm payload to the stable release build closure while keeping package-root exports unchanged

### Security and maintenance

- carries forward the v0.1.1 transitive `qs` security maintenance fix with the patched dependency resolution
- removes stale `dist` before release compilation so old build output cannot leak into the npm package
- preserves the GitHub Action runtime entrypoint in the narrowed release build

### Research and developer experience

- carries forward Phase 8 adoption, contributor, review and research documentation
- retains the pinned Phase 9 A2A → MCP crossing corpus and reproducible conformance workflow in the repository
- records externally reviewed Phase 9 `implementation_independent` conformance evidence without promoting those cases into stable HandoffProbe attacks
- excludes pinned Phase 9 fixture files and research-only Phase 9 modules from the npm payload

### Limitations

- Phase 9 evidence remains conformance evidence rather than additional vulnerability findings or a general security certification
- no `operator_independent`, production-world effect, production key management, restart-durable replay protection or multi-process replay protection claim is made without new evidence
- v0.2.0 does not add a generic internet scanner, runtime firewall, authorization provider or new public Phase 9 runtime API

## 0.1.1 — 2026-09-08

### Security

- updated the transitive `qs` dependency to a patched release (`>= 6.16.0`) without changing the HandoffProbe CLI, attack corpus, report schema, protocol baseline or GitHub Action behavior.

## 0.0.0 — Project foundation

- established product definition and v0.1 scope
- added architecture, threat model, attack catalog and roadmap
- added open-source contribution/security policies
- documented growth and monetization hypothesis
