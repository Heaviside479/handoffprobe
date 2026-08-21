# Product Definition

## One-line description

HandoffProbe is a developer-first open-source adversarial test engine that finds security properties lost during AI-agent handoffs across protocol and execution boundaries.

Tagline:

> **Adversarial security testing for AI agent handoffs.**

## v0.1 problem

An A2A implementation can be individually conformant and an MCP implementation can be individually valid while the handoff between them still violates the caller's original security intent.

HandoffProbe tests that handoff.

The initial compatibility baseline is **A2A 1.0 -> MCP 2026-07-28**.

## Primary user

Early users are technical:

- AI/agent platform engineers
- application security engineers
- security researchers
- developers integrating A2A and MCP
- maintainers of agent frameworks and SDKs

## User job

A developer should be able to answer:

> If this agent delegates work and the downstream agent calls MCP tools, can authority, identity, consent, tenant, target, lifecycle or execution constraints change dangerously during the handoff?

## v0.1 user experience

1. Install/run HandoffProbe locally.
2. Point it at a supported fixture/adapter or run the bundled vulnerable demo.
3. Execute a predefined handoff attack suite.
4. Receive terminal and JSON/Markdown findings with evidence.
5. Reproduce failures with stable `HP-*` test IDs.
6. Later, run the same suite in CI to prevent regressions.

## Handoff admission rule

A core HandoffProbe check must be handoff/composition-specific. At least one must be true:

- the failure requires A2A and MCP together;
- translation/propagation at the boundary creates the failure;
- each individual protocol layer can pass its own checks while the end-to-end invariant fails.

A pure A2A MUST/SHOULD check is primarily the A2A TCK's job. A pure MCP server interaction/debug check is primarily the MCP Inspector's job. Narrow preflight checks are allowed only when necessary to prove the handoff preconditions.

## v0.1 must-have capabilities

- A2A 1.0 test harness (HTTP+JSON first)
- MCP 2026-07-28 test harness
- explicit translation/adapter boundary
- attack runner
- deterministic assertions
- version/provenance metadata per attack
- structured trace/evidence timeline
- severity and finding model
- human-readable terminal report
- JSON report for automation
- minimum 12 high-quality P0 handoff-security tests
- intentionally vulnerable demo fixture
- secure control fixture
- documentation showing a complete reproducible failure

## Explicit non-goals for v0.1

- generic LLM red teaming
- generic prompt-injection detection
- prompt quality/evaluation
- model benchmarking
- generic MCP scanner
- A2A conformance replacement
- runtime firewall / gateway
- production authorization provider
- enterprise dashboard
- user accounts
- billing
- hosted scan execution
- broad multi-protocol support
- formal verification/TLA+ framework

## Research-aware differentiation

Composition safety is not an unclaimed concept. 2026 work including AgentRFC/AgentConform and AgentThread explicitly studies security properties that fail under protocol composition.

HandoffProbe's product differentiation should therefore be execution workflow, not novelty theater:

- runnable local CLI
- tests against real developer systems and SDKs
- handoff-specific dynamic mutations
- reproducible evidence and regression fixtures
- CI-friendly results
- curated attack corpus built from real handoff failures
- low setup cost and no paid LLM dependency

## Strongest demo criterion

The ideal public demo is:

> A2A-side checks pass. MCP-side checks pass. The combined A2A -> MCP workflow still violates an end-to-end invariant, and HandoffProbe catches it reproducibly.

## Core product moat hypothesis

Long-term defensibility should come from:

1. a deep, reproducible handoff-specific attack corpus
2. protocol-version and SDK compatibility knowledge
3. real-world regression cases
4. security research and responsible disclosures
5. CI adoption and developer workflow integration
6. source-linked evidence that explains why a finding matters

A dashboard alone is not a moat.
