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

## Scope rules

- v0.1 supports A2A -> MCP only.
- Do not add ACP, UCP, AP2, x402 or unrelated protocols to v0.1 unless the roadmap is explicitly changed.
- Do not add dashboards, authentication, billing, databases or hosted infrastructure during the core CLI phase.
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

## Quality gates once code exists

Before proposing a merge, the intended baseline is:

- format / lint
- typecheck
- unit tests
- integration tests for affected harnesses
- build
- no accidental secrets

## Security-research boundary

HandoffProbe is a defensive testing project. Build reproducible tests against local fixtures, authorized staging targets and intentionally vulnerable demos. Follow `SECURITY.md` for disclosure handling.
