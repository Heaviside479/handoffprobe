# Naming Decision Record

Status: **decided**

Decision date: 2026-08-21

## Final name

- Product: **HandoffProbe**
- GitHub repository: `handoffprobe`
- Planned npm package: `handoffprobe`
- Planned CLI command: `handoffprobe`
- Attack-test prefix: `HP-`

Primary tagline:

> **Adversarial security testing for AI agent handoffs.**

## Why this name

`Handoff` describes the product's actual security boundary: authority, identity, consent, state and execution context move from one agent/protocol/component to another.

`Probe` describes the product behavior: actively test, mutate, observe and produce reproducible evidence rather than permanently enforce production traffic.

The name is intentionally broader than A2A/MCP so future modules can test other sensitive agent handoffs without forcing a rebrand.

## Retired working name

The project originally used **BridgeBreak** as a pre-alpha working name.

In April 2026, Forescout Research / Vedere Labs published a high-profile OT security research campaign named **BRIDGE:BREAK** covering vulnerabilities in serial-to-IP converters.

Source:

- https://forescout.vederelabs.com/

That collision created avoidable search/SEO, press and security-research ambiguity. Because the project had not yet published code/packages under the working name, it was retired before implementation.

## Naming requirements satisfied

HandoffProbe was selected because it is:

- short enough for a developer tool
- pronounceable internationally
- semantically connected to the problem
- suitable for a CLI/package name
- not tied only to A2A/MCP
- compatible with future modules such as approval, payment or execution handoff testing

## Operational rule

Do not reopen naming during normal development. A later legal/trademark review before material commercial branding spend is prudent, but routine implementation should treat HandoffProbe as the canonical product name.

If exact npm/domain availability changes before publication, prefer scoped packaging or a domain variation before changing the product brand unless a material legal/confusion issue is found.
