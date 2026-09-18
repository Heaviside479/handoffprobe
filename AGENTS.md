# AGENTS.md

Repository-wide instructions for coding agents and automated contributors.

## Read first

Before making product or architecture changes, read:

1. `PROJECT_CONTEXT.md`
2. `docs/PRODUCT.md`
3. `docs/ROADMAP.md`
4. `docs/ARCHITECTURE.md`
5. `docs/THREAT_MODEL.md`
6. `docs/ATTACK_CATALOG.md`
7. `docs/RESEARCH_BASELINE.md`

## Product identity

- Product: HandoffProbe
- Repository/package/CLI stem: `handoffprobe`
- Stable attack-test prefix: `HP-`
- Do not reintroduce the retired working name into active product text.

## Current repository truth

- verified public release: `handoffprobe@0.4.0`
- stable public corpus: **23 attacks**
- stable composition: 12 P0 + 10 P1 + 1 advanced (`HP-AUTH-006`)
- protocol baseline: A2A 1.0 -> MCP 2026-07-28
- report schema: `1`
- Node.js baseline: `>=24 <25`
- public npm package and reusable GitHub Action already exist
- Phase 10 reliability hardening is active
- Phase 13 commercial validation may run in parallel
- Teams/Cloud remains demand-gated

## Scope rules

- The current public Core remains centered on A2A -> MCP.
- Do not add ACP, UCP, AP2, x402 or unrelated protocol surfaces unless an evidence-backed roadmap/admission decision explicitly authorizes them.
- Do not add dashboards, authentication, databases or hosted Teams/Cloud infrastructure merely because they are plausible future features; the existing demand gates remain binding.
- Do not introduce paid AI APIs or paid infrastructure as a core dependency.
- Prefer TypeScript and deterministic rules for the first implementation.
- Do not duplicate pure A2A/MCP conformance checks unless required as preconditions for a handoff-specific assertion.

## Engineering rules

- Keep modules small and testable.
- Add tests for new attack rules and regressions.
- Attack definitions should be data-driven where practical.
- Security findings must contain a stable ID, severity, evidence, expected behavior and observed behavior.
- Implemented attack definitions must record protocol applicability, property class and source/provenance.
- Keep fixtures local and harmless; do not target third-party production systems.
- Preserve backward-compatible machine-readable report formats once published.
- Avoid broad refactors unless required by the task.
- Update relevant docs when behavior, threat model or roadmap changes.

## Quality gates

Before proposing a merge, use the repository's real gates:

- focused tests for the changed surface;
- `git diff --check`;
- `npm run check`;
- `npm run package:check` when package/release-facing files are affected;
- verify no accidental secrets;
- verify exact changed-file scope.

Do not weaken, skip or delete a security/regression test merely to make a change pass.

## Historical and evidence records

Do not rewrite historical research/release documents merely because their dated
snapshot differs from current product truth.

Current-facing documents should describe the current state. Historical evidence
documents should preserve what was true at their recorded checkpoint.

External result return is not automatically external confirmation, silence is not
agreement, and no new stable attack ID should be created without the normal
evidence/admission process.

## Security-research boundary

HandoffProbe is a defensive testing project. Build reproducible tests against local fixtures, authorized staging targets and intentionally vulnerable demos. Follow `SECURITY.md` for disclosure handling.
