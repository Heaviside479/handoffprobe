# HandoffProbe

Open-source adversarial security testing for AI agent handoffs.

HandoffProbe is a defensive developer tool for finding security properties that are lost when AI-agent tasks cross protocol and execution boundaries. The initial scope is deliberately narrow: **A2A 1.0 -> MCP 2026-07-28**.

## The problem

An A2A agent can delegate work to another agent, which then calls tools through MCP. Each individual layer can look valid in isolation while identity, authority, consent, tenant, resource, lifecycle or execution constraints change during the handoff.

HandoffProbe tests that handoff.

```text
Human / calling service
        |
        v
     Agent A
        | A2A 1.0
        v
     Agent B / translation layer
        | MCP 2026-07-28
        v
       Tool
```

## What HandoffProbe is not

HandoffProbe is not intended to replace:

- the official A2A Technology Compatibility Kit or A2A Inspector;
- the official MCP Inspector;
- generic LLM red-team platforms;
- a production runtime firewall, gateway or identity provider.

The core admission rule is simple: **a core test must exercise a security property that can be lost because an agent handoff composes or translates protocol/security context.**

## v0.1 goal

Provide a local TypeScript CLI that runs a reproducible A2A -> MCP handoff-security suite and reports whether security properties survive the boundary.

Planned developer experience:

```bash
npx handoffprobe test
```

Example output:

```text
HandoffProbe Security Audit
A2A 1.0 -> MCP 2026-07-28

PASS  principal continuity
PASS  resource binding
FAIL  delegated authority amplification    HIGH
FAIL  cancellation not propagated          HIGH

12 tests | 10 passed | 2 failed
```

## Initial test families

- authority monotonicity and delegation translation
- identity / tenant continuity
- replay and cross-context reuse
- approval / consent integrity
- tool, capability and resource binding
- credential audience and propagation
- state-handle and cache isolation
- cancellation, retry and partial-failure behavior
- audit lineage continuity

See [`docs/ATTACK_CATALOG.md`](docs/ATTACK_CATALOG.md) for the current backlog.

## Principles

- Open-source core under Apache-2.0.
- Local-first and useful without a hosted service.
- No paid AI API required for core testing.
- Deterministic tests before AI-assisted heuristics.
- Safe, authorized testing only.
- Build a high-quality attack corpus before building a dashboard.
- Keep v0.1 focused on A2A -> MCP.
- Source-link important checks to protocol versions, specifications or published research.
- Do not duplicate existing single-protocol conformance tools.

## Project documents

- [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) — canonical context and constraints
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product definition and positioning
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — phased build and launch roadmap
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — planned technical architecture
- [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md) — security model and trust boundaries
- [`docs/ATTACK_CATALOG.md`](docs/ATTACK_CATALOG.md) — security-test backlog
- [`docs/P0_TEST_SPECIFICATION.md`](docs/P0_TEST_SPECIFICATION.md) — executable v0.1 P0 acceptance contract
- [`docs/TECHNICAL_BASELINE.md`](docs/TECHNICAL_BASELINE.md) — implementation/runtime baseline
- [`docs/FINAL_PRODUCT_DEFINITION.md`](docs/FINAL_PRODUCT_DEFINITION.md) — mature-product completion definition
- [`docs/RESEARCH_BASELINE.md`](docs/RESEARCH_BASELINE.md) — current protocol/research baseline
- [`docs/COMPETITIVE_LANDSCAPE.md`](docs/COMPETITIVE_LANDSCAPE.md) — differentiation and kill criteria
- [`docs/SEVERITY.md`](docs/SEVERITY.md) — finding classification policy
- [`docs/NAMING.md`](docs/NAMING.md) — naming decision record
- [`docs/GROWTH_AND_MONETIZATION.md`](docs/GROWTH_AND_MONETIZATION.md) — adoption and revenue strategy
- [`SECURITY.md`](SECURITY.md) — authorized-use and disclosure policy
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution guidelines

## Status

**Pre-alpha / research-locked foundation.** No production-ready scanner exists yet.

## License

Apache License 2.0. See [`LICENSE`](LICENSE).
