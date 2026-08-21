# BridgeBreak — Canonical Project Context

Last updated: 2026-08-21

This file is the central context for future contributors, coding agents and project discussions.

## Mission

Build the best open-source defensive test engine for security failures created by composing AI-agent protocols.

## Initial wedge

BridgeBreak v0.1 tests **A2A -> MCP** compositions. It does not attempt to be a generic AI security platform.

Core question:

> When a task crosses from one agent/protocol boundary into another, do identity, authorization, consent and execution constraints remain intact?

## Product shape

Start as a local TypeScript CLI and reusable test engine. Add a GitHub Action after the local engine is credible. Hosted dashboards, accounts and billing are deliberately deferred.

## Non-negotiable constraints

1. Start with effectively zero infrastructure spend.
2. Core scanning must not require paid LLM APIs.
3. No GPU dependency.
4. Prefer deterministic security assertions over model-based judgement.
5. Open-source core under Apache-2.0.
6. v0.1 scope is A2A -> MCP only.
7. Build attack corpus, reproducibility and technical credibility before UI polish.
8. Use only systems the tester owns or is explicitly authorized to test.
9. Do not add cloud services, paid dependencies or recurring infrastructure without an explicit product need.
10. Every security finding should be reproducible by a minimal fixture whenever possible.

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
- responsible vulnerability disclosures or cited research
- inbound requests for audits or custom integrations

## Build philosophy

Small vertical slices. Test first. No speculative platform work. Do not build features merely because they might be useful later.
