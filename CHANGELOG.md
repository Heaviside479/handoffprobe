# Changelog

All notable project changes will be documented here.

## Unreleased

No new public package release is currently authorized.

Post-v0.4.0 repository work includes reliability hardening, research/evidence
follow-ups, commercial validation and documentation reconciliation. Those activities
do not by themselves constitute a new stable capability or justify a version bump.

The pre-v0.1 foundation/bootstrap entries that previously remained under
`Unreleased` were historical shipped work and were removed from this section during
the 2026-09-18 repository cleanup.

## 0.4.0 — 2026-09-16

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

- public `handoffprobe@0.4.0` is published and independently verified from npm
- the annotated `v0.4.0` tag is anchored to the exact release commit and the GitHub Release is published
- external exact-version npm execution and external GitHub Action execution passed
- reusable Action / Marketplace presentation is synchronized with v0.4.0
- the dedicated HandoffProbe site and the Heaviside Solutions project page are verified live on the v0.4.0 / 23-attack / `HP-AUTH-006` release truth
- R4 post-publication closeout completed on 2026-09-17

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
