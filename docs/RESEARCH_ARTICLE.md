# HandoffProbe v0.1 Research Article

## Security at the handoff boundary

HandoffProbe tests a narrow security problem: a property can hold inside each protocol and still fail when application code translates security context between protocols.

The v0.1 baseline is **A2A 1.0 -> MCP 2026-07-28** with exactly 22 stable deterministic attacks.

## Conformance is not the same as composition safety

Protocol conformance asks whether one endpoint follows its protocol. Composition safety asks whether an end-to-end invariant survives after independently valid protocol steps are combined.

A2A handles agent-to-agent interoperability. MCP handles access to tools and data. A translation layer can still lose, broaden, rewrite or detach identity, authority, tenant, approval or resource context.

HandoffProbe therefore does not claim A2A or MCP is inherently insecure. Stable attacks are admitted only when the failure depends on cross-protocol composition.

## HP-AUTH-001 — Delegated authority amplification

Primary v0.1 demo:

```bash
handoffprobe test --target vulnerable --test HP-AUTH-001
```

The intended reasoning is:

1. upstream A2A authority can be valid and bounded;
2. downstream MCP tool behavior can be valid under correct authority;
3. the handoff can broaden effective authority incorrectly;
4. the end-to-end invariant fails;
5. HandoffProbe reproduces that failure deterministically;
6. the secure control preserves the invariant.

This is a composition failure demonstration, not a claim that either protocol is inherently vulnerable.

Secure control:

```bash
handoffprobe test --target secure --test HP-AUTH-001
```

The complete secure target must remain 22 PASS / 0 FAIL / 0 ERROR.

## Deterministic dynamic testing

v0.1 uses local synthetic fixtures, stable attack IDs and deterministic execution. It requires no paid AI API, hosted scanner, account or telemetry.

Reports preserve schema version `1` and exit semantics:

- `0` — trustworthy scan with no qualifying vulnerability;
- `1` — trustworthy scan with a qualifying vulnerability;
- `2` — usage or configuration error;
- `3` — scanner, runtime or output failure.

Reports expose redacted finding data plus safe evidence counts and sequence references rather than raw evidence context.

## Requirements, hardening and responsibility

The research model distinguishes:

- **normative requirements** — directly required by a protocol specification;
- **hardening** — security guidance beyond strict protocol conformance;
- **`composition_responsibility`** — an end-to-end responsibility created by composition and not necessarily assigned to either protocol alone.

That distinction prevents a cross-boundary integration failure from being mislabeled as a protocol conformance violation.

## Relation to current research

HandoffProbe does not claim to invent composition-safety research.

AgentRFC, _Security Design Principles and Conformance Testing for Agent Protocols_, introduces a Composition Safety principle and formal analysis of agent-protocol composition.

AgentThread, _Formal Security Analysis of Agent Protocol Composition_, performs source-linked analysis across specifications and SDKs and identifies unassigned cross-protocol responsibility gaps.

HandoffProbe focuses on a practical developer workflow: deterministic local reproduction and CI gating for handoff failures, beginning with A2A -> MCP.

## Current source baseline

The release work references:

- A2A specification — https://a2a-protocol.org/latest/specification/
- A2A v1.0 — https://a2a-protocol.org/v1.0.0/
- MCP 2026-07-28 release — https://blog.modelcontextprotocol.io/posts/2026-07-28/
- AgentRFC — https://arxiv.org/abs/2603.23801
- AgentThread — https://arxiv.org/abs/2606.28690

As of the 2026-08-29 documentation check, the official A2A site lists 1.0.0 as the latest released version, while MCP 2026-07-28 is the released MCP specification tracked by v0.1. MCP also published a newer roadmap on 2026-08-22, so release-time drift still requires explicit review.

This documentation check does not replace the formal Phase 7.2A upstream drift review. That gate must re-check A2A, MCP and relevant SDK state immediately before the release candidate is frozen.

## Scope

v0.1 is pre-1.0 software. It is not an official A2A or MCP conformance suite, a generic protocol scanner, a production firewall, an identity provider or evidence that a third-party product is vulnerable. Bundled targets are synthetic; third-party testing requires explicit authorization.
