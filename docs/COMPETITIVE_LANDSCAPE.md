# Competitive Landscape and Positioning

As of: 2026-08-21

The purpose of this document is to prevent BridgeBreak from drifting into already crowded categories.

## Closest conceptual research

### AgentRFC / AgentConform

Research framework that extracts protocol requirements, formalizes security principles and replays counterexamples against SDKs. It explicitly introduces Composition Safety.

### AgentThread

Very close to BridgeBreak's thesis: source-linked formal analysis and executable replay across agent protocol compositions. It reports additional failures that appear only under composition.

**BridgeBreak response:** do not compete on formal novelty. Compete on developer usability, dynamic seam testing, adapters, regression fixtures, CI integration and a maintained attack corpus.

## Existing single-protocol tools

### A2A TCK

Official conformance kit across A2A transports. It is authoritative for A2A protocol compatibility.

BridgeBreak must not become an alternative TCK.

### A2A Inspector

Interactive A2A server inspection/debugging and basic validation.

### MCP Inspector

Official MCP developer tool for interactive and CLI testing/debugging of MCP servers.

BridgeBreak must not become another generic MCP Inspector.

## Broad AI/agent security tools

The market already contains many products and open-source tools for:

- prompt injection/red teaming
- MCP scanning
- tool poisoning
- runtime policy enforcement
- agent identity
- observability
- generic agent vulnerability scanning

Promptfoo and other broad red-team frameworks demonstrate demand, but BridgeBreak should not try to out-feature broad platforms.

## Runtime enforcement is a different category

Gateways/proxies and policy systems can enforce least privilege or runtime action rules. That is not v0.1 BridgeBreak.

BridgeBreak should answer:

> Can I reproduce a security invariant failure in this composition before or during CI?

not:

> Can I sit permanently in production and block every request?

## BridgeBreak wedge

BridgeBreak is strongest when all of the following are true:

1. two protocols or protocol layers are composed;
2. the individual components look valid in isolation;
3. translation/propagation creates a security gap;
4. BridgeBreak can reproduce the gap deterministically;
5. the result is understandable enough to become a regression test.

## Public demo benchmark

A compelling demo should intentionally pass relevant individual A2A/MCP checks while failing a BridgeBreak end-to-end invariant.

Example:

```text
A2A TCK relevant checks: PASS
MCP endpoint/tool behavior: PASS
BridgeBreak composition invariant: FAIL

Reason: delegated read authority became write authority at the bridge.
```

Do not imply official tools certify total security; state only what specific checks were run.

## Defensibility

Potential moat:

- large seam-specific attack corpus
- adapters for common A2A/MCP stacks
- protocol-version compatibility matrix
- regression tests from responsibly disclosed real failures
- evidence schema and trace correlation
- community/CI adoption
- research reputation

Low-value/moat-poor work:

- dashboard polish before adoption
- generic chat UI
- duplicate conformance checks
- generic prompt-injection payload lists
- proprietary cloud dependency for core tests

## Kill / pivot criteria

Reassess the current wedge if one or more become true before BridgeBreak gains adoption:

- an official A2A/MCP project ships a mature composition-security TCK covering the same seam dynamically;
- AgentThread/AgentConform or another project ships a widely adopted open-source CLI with equivalent local dynamic composition tests, adapters and CI UX;
- real A2A -> MCP implementers consistently report no need for seam testing and no meaningful failures can be reproduced;
- maintaining protocol compatibility costs materially more than the user value produced.

A pivot should preserve reusable assets such as the runner, evidence model and attack corpus where possible.
