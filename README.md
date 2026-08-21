# BridgeBreak

Open-source security testing for cross-protocol AI agent systems.

> **Working name:** the repository remains `bridgebreak`, but the public package/product name will be re-evaluated before launch because `BRIDGE:BREAK` is already used by a 2026 cybersecurity research campaign. See [`docs/NAMING.md`](docs/NAMING.md).

BridgeBreak is a defensive security tool for finding failures that appear when AI-agent protocols are composed. The initial scope is intentionally narrow: **A2A 1.0 -> MCP 2026-07-28**.

## The problem

An A2A agent can delegate work to another agent, which can then call tools through MCP. Even if each protocol implementation passes its own conformance/debug checks, identity, authorization, consent, scope, resource binding, lifecycle or execution constraints can break when the bridge translates between them.

BridgeBreak tests that seam.

```text
Human / calling service
        |
        v
     Agent A
        | A2A 1.0
        v
     Agent B / bridge
        | MCP 2026-07-28
        v
       Tool
```

## What BridgeBreak is not

BridgeBreak is not intended to replace:

- the official A2A Technology Compatibility Kit or A2A Inspector;
- the official MCP Inspector;
- generic LLM red-team platforms;
- an MCP runtime firewall or identity provider.

The core admission rule is simple: **a core test must exercise a security property that can be lost because A2A and MCP are composed or translated.**

## v0.1 goal

Provide a local TypeScript CLI that runs a reproducible A2A -> MCP composition-security suite and reports whether security properties survive the boundary.

Planned developer experience:

```bash
npx bridgebreak test
```

Example output:

```text
BridgeBreak Security Audit
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

- Open-source core.
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
- [`docs/ATTACK_CATALOG.md`](docs/ATTACK_CATALOG.md) — security test backlog
- [`docs/RESEARCH_BASELINE.md`](docs/RESEARCH_BASELINE.md) — current protocol/research baseline
- [`docs/COMPETITIVE_LANDSCAPE.md`](docs/COMPETITIVE_LANDSCAPE.md) — differentiation and kill criteria
- [`docs/SEVERITY.md`](docs/SEVERITY.md) — finding classification policy
- [`docs/NAMING.md`](docs/NAMING.md) — working-name risk and launch checkpoint
- [`docs/GROWTH_AND_MONETIZATION.md`](docs/GROWTH_AND_MONETIZATION.md) — adoption and revenue strategy
- [`SECURITY.md`](SECURITY.md) — authorized-use and disclosure policy
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution guidelines

## Status

**Pre-alpha / research-baseline stage.** No production-ready scanner exists yet.

## License

Apache License 2.0. See [`LICENSE`](LICENSE).
