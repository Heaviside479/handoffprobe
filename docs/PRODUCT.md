# Product Definition

## One-line description

BridgeBreak is an open-source adversarial test engine that finds security properties lost when AI-agent protocols are composed.

## v0.1 problem

A workflow can be individually valid at the A2A layer and individually valid at the MCP layer while the combined workflow violates the caller's original security intent.

BridgeBreak tests the seam.

## Primary user

Early users are technical:

- AI/agent platform engineers
- application security engineers
- security researchers
- developers integrating A2A and MCP
- maintainers of agent frameworks and SDKs

## User job

A developer should be able to answer:

> If this agent delegates work and the downstream agent calls MCP tools, can authority, identity, consent or target constraints change in a dangerous way?

## v0.1 user experience

1. Install/run BridgeBreak locally.
2. Point it at a supported test fixture or adapter.
3. Execute a predefined attack suite.
4. Receive terminal and JSON/Markdown findings.
5. Reproduce failures with stable test IDs.

## v0.1 must-have capabilities

- A2A test harness
- MCP tool/test harness
- adapter boundary between harnesses and targets
- attack runner
- deterministic assertions
- severity and finding model
- human-readable terminal report
- JSON report for automation
- 15-20 high-quality composition-security tests
- intentionally vulnerable demo fixture
- documentation showing a complete reproducible failure

## Explicit non-goals for v0.1

- generic LLM red teaming
- prompt quality/evaluation
- model benchmarking
- generic MCP scanner
- runtime firewall / gateway
- production authorization provider
- enterprise dashboard
- user accounts
- billing
- hosted scan execution
- broad multi-protocol support

## Differentiation

BridgeBreak should not compete by having more generic AI-security checks. Its wedge is **cross-protocol composition failure**: cases where an invariant is valid before a boundary and invalid after it.

## Core product moat hypothesis

Long-term defensibility should come from:

1. a deep, reproducible composition attack corpus
2. protocol adapters and compatibility knowledge
3. real-world regression cases
4. research credibility and responsible disclosures
5. CI adoption and developer workflow integration

A dashboard alone is not a moat.
