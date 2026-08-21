# BridgeBreak

Open-source security testing for cross-protocol AI agent systems.

BridgeBreak is a defensive security tool for finding failures that appear when AI-agent protocols are composed. The initial scope is intentionally narrow: **A2A -> MCP**.

## The problem

An A2A agent can delegate work to another agent, which can then call tools through MCP. Even if each layer is secure on its own, identity, authorization, consent, scope, resource binding or replay protection can break at the boundary between them.

BridgeBreak tests those boundaries.

```text
Human / calling service
        |
        v
     Agent A
        | A2A
        v
     Agent B
        | MCP
        v
       Tool
```

## v0.1 goal

Provide a local TypeScript CLI that runs a reproducible A2A -> MCP security test suite and reports whether security properties survive the protocol boundary.

Planned developer experience:

```bash
npx bridgebreak test
```

Example output:

```text
BridgeBreak Security Audit
A2A -> MCP

PASS  identity propagation
PASS  expired authorization rejected
FAIL  delegated scope escalation       HIGH
FAIL  approval payload mutation         CRITICAL

18 tests | 16 passed | 2 failed
```

## Initial test families

- authorization and scope propagation
- identity continuity
- delegation boundaries
- replay and reuse
- approval / consent integrity
- tool and resource substitution
- credential propagation
- state and concurrency failures

See [`docs/ATTACK_CATALOG.md`](docs/ATTACK_CATALOG.md) for the initial test backlog.

## Principles

- Open-source core.
- Local-first and useful without a hosted service.
- No paid AI API required for core testing.
- Deterministic tests before AI-assisted heuristics.
- Safe, authorized testing only.
- Build a high-quality attack corpus before building a dashboard.
- Keep v0.1 focused on A2A -> MCP.

## Project documents

- [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) — canonical project context and constraints
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product definition and target users
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — phased build and launch roadmap
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — planned technical architecture
- [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md) — security model and trust boundaries
- [`docs/ATTACK_CATALOG.md`](docs/ATTACK_CATALOG.md) — first security tests
- [`docs/GROWTH_AND_MONETIZATION.md`](docs/GROWTH_AND_MONETIZATION.md) — adoption and revenue strategy
- [`SECURITY.md`](SECURITY.md) — responsible security research policy
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution guidelines

## Status

**Pre-alpha / project foundation.** No production-ready scanner exists yet.

## License

Apache License 2.0. See [`LICENSE`](LICENSE).
