# Product Definition

## One-line description

BridgeBreak is a developer-first open-source adversarial test engine that finds security properties lost when AI-agent protocols are composed.

## v0.1 problem

An A2A implementation can be individually conformant and an MCP implementation can be individually valid while their bridge still violates the caller's original security intent.

BridgeBreak tests the seam.

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

> If this agent delegates work and the downstream agent calls MCP tools, can authority, identity, consent, target, lifecycle or execution constraints change in a dangerous way during translation?

## v0.1 user experience

1. Install/run BridgeBreak locally.
2. Point it at a supported fixture/adapter or run the bundled vulnerable demo.
3. Execute a predefined composition attack suite.
4. Receive terminal and JSON/Markdown findings with evidence.
5. Reproduce failures with stable test IDs.
6. Later, run the same suite in CI to prevent regressions.

## Composition admission rule

A core BridgeBreak check must be composition-specific. At least one must be true:

- the failure requires A2A and MCP together;
- the bridge's translation/propagation creates the failure;
- each individual protocol layer can pass its own checks while the end-to-end invariant fails.

A pure A2A MUST/SHOULD check is primarily the A2A TCK's job. A pure MCP server interaction/debug check is primarily the MCP Inspector's job. Narrow preflight checks are allowed only when necessary to prove the composition preconditions.

## v0.1 must-have capabilities

- A2A 1.0 test harness (HTTP+JSON first)
- MCP 2026-07-28 test harness
- explicit bridge/adapter boundary
- attack runner
- deterministic assertions
- version/provenance metadata per attack
- structured trace/evidence timeline
- severity and finding model
- human-readable terminal report
- JSON report for automation
- a small set of high-quality composition-security tests (minimum 12 P0; stretch toward 20 only when justified)
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

BridgeBreak's product differentiation should therefore be execution workflow, not novelty theater:

- runnable local CLI
- tests against real developer systems and SDKs
- seam-specific dynamic mutations
- reproducible evidence and regression fixtures
- CI-friendly results
- curated attack corpus built from real composition failures
- low setup cost and no paid LLM dependency

## Strongest demo criterion

The ideal public demo is:

> A2A-side checks pass. MCP-side checks pass. The combined A2A -> MCP workflow still violates an end-to-end invariant, and BridgeBreak catches it reproducibly.

## Core product moat hypothesis

Long-term defensibility should come from:

1. a deep, reproducible composition attack corpus
2. protocol-version and SDK compatibility knowledge
3. real-world regression cases
4. security research and responsible disclosures
5. CI adoption and developer workflow integration
6. source-linked evidence that explains why a finding matters

A dashboard alone is not a moat.
