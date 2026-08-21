# BridgeBreak — Canonical Project Context

Last updated: 2026-08-21

This file is the central context for future contributors, coding agents and project discussions.

## Mission

Build the best developer-first open-source defensive test engine for security failures created by composing AI-agent protocols.

## Initial wedge

BridgeBreak v0.1 tests **A2A 1.0 -> MCP 2026-07-28** compositions. It does not attempt to be a generic AI security platform or a replacement for single-protocol conformance tools.

Core question:

> When a task crosses from A2A into MCP, do identity, authorization, consent, resource, lifecycle and execution constraints remain intact after the bridge translates the request?

## Product shape

Start as a local TypeScript CLI and reusable test engine. Add a GitHub Action after the local engine is credible. Hosted dashboards, accounts and billing are deliberately deferred.

## Composition-only rule

A BridgeBreak core test must satisfy at least one of these conditions:

1. the failure requires both A2A and MCP to be present;
2. the failure is caused by translation or propagation at the A2A -> MCP bridge;
3. the security property passes at each individual protocol layer but fails end-to-end.

Pure A2A conformance belongs primarily to the A2A TCK/Inspector. Pure MCP debugging belongs primarily to the MCP Inspector and protocol-specific security tooling. BridgeBreak may run narrow preflight checks when needed to establish a composition test, but single-protocol validation is not the product wedge.

## Current protocol baseline

- A2A specification: released version 1.0.0 (wire compatibility version 1.0)
- MCP specification: 2026-07-28
- Initial A2A transport focus: HTTP+JSON first; JSON-RPC may follow within v0.x; gRPC is deferred until the engine is stable.
- MCP implementation work must explicitly opt into the 2026-07-28 protocol behavior when using SDKs that retain older defaults.

See `docs/RESEARCH_BASELINE.md` for authoritative sources and update policy.

## Non-negotiable constraints

1. Start with effectively zero infrastructure spend.
2. Core scanning must not require paid LLM APIs.
3. No GPU dependency.
4. Prefer deterministic security assertions over model-based judgement.
5. Open-source core under Apache-2.0.
6. v0.1 scope is A2A -> MCP only.
7. Build attack corpus, reproducibility and technical credibility before UI polish.
8. Use only systems the tester owns or is explicitly authorized to test.
9. Default active testing to local fixtures/loopback; remote active testing must require explicit opt-in if introduced.
10. Do not add cloud services, paid dependencies or recurring infrastructure without an explicit product need.
11. Every security finding should be reproducible by a minimal fixture whenever possible.
12. Every implemented attack must record protocol-version applicability and evidence/source provenance.
13. Do not claim BridgeBreak invented composition-safety research; differentiate on executable developer workflow, regression testing, evidence and real integration coverage.
14. Do not silently broaden into generic prompt-injection, MCP scanning, identity infrastructure or runtime firewall products.

## Research position

Current 2026 research such as AgentRFC/AgentConform and AgentThread independently validates the core thesis that security properties can fail under protocol composition. BridgeBreak should use that work as research context, not compete by rebuilding formal TLA+ analysis.

BridgeBreak's intended differentiation is:

- developer-first local CLI
- dynamic testing against running A2A -> MCP systems
- seam-specific mutations and assertions
- reproducible evidence traces
- CI regression use
- a curated real-world attack corpus

## Long-term product direction

If the wedge works, expand from protocol-composition security into a broader adversarial testing platform with modules for:

- human approval integrity
- agentic commerce transaction correctness
- additional protocol combinations
- CI policy gates
- enterprise reporting and governance

These are future options, not v0.1 requirements.

## Business model hypothesis

The scanner remains free and open source. Monetization should initially come from high-value services around it:

- agent protocol security assessments
- custom adapters and test packs
- enterprise support

Only after real adoption should BridgeBreak consider a hosted product for team dashboards, history, scheduled scans, policy management, SSO/RBAC, compliance evidence and organization-wide integrations.

## Success signals

Early success is not defined by revenue alone. Watch for:

- repeat npm/CLI usage
- GitHub stars from real developers
- external contributors
- issues requesting framework/protocol support
- companies using BridgeBreak in CI
- a demonstrable case where individual protocol checks pass but BridgeBreak catches an end-to-end seam failure
- responsible vulnerability disclosures or cited research
- inbound requests for audits or custom integrations

## Naming status

`BridgeBreak` is the repository and working product name. A public naming checkpoint is mandatory before npm/domain/public launch because Forescout/Vedere Labs used **BRIDGE:BREAK** in 2026 for a high-profile OT vulnerability research campaign. See `docs/NAMING.md`.

## Build philosophy

Small vertical slices. Test first. No speculative platform work. Do not build features merely because they might be useful later.
