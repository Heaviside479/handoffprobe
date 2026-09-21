# HandoffProbe limitations

This document defines the current user-facing support boundary and non-claims for HandoffProbe.

Current verified public release: `handoffprobe@0.4.0`.

## Supported baseline

The current verified public product is limited to:

- 23 stable handoff-security attacks;
- 12 P0, 10 P1 and one advanced stable attack, `HP-AUTH-006`;
- A2A 1.0 -> MCP 2026-07-28;
- Node.js `>=24 <25`;
- config schema `1`;
- report schema `1`;
- the documented CLI and source-backed GitHub Action;
- bundled secure and intentionally vulnerable synthetic fixtures.

Support for another Node major version, another A2A protocol line or another MCP revision must not be inferred from partial compatibility.

## Stable corpus boundary

Research cases, backlog entries, external discussions and deterministic experiments are not automatically part of the stable corpus.

A candidate becomes stable only through the normal evidence and attack-admission process.

The presence of a threat class in `docs/THREAT_MODEL.md` does not mean that a stable attack currently covers that class.

## Synthetic fixtures vs production systems

The default HandoffProbe path uses deterministic synthetic fixtures.

A successful secure-fixture run proves that the HandoffProbe test path behaved as expected against that fixture. It does not prove that an unrelated production agent system is secure.

Reproducing a vulnerable fixture demonstrates the attack invariant and scanner behavior. It is not evidence that an external project has the same defect.

Testing a real system requires an appropriate integration path and explicit authorization.

## Composition testing vs protocol conformance

HandoffProbe focuses on security properties lost during a handoff or translation boundary.

It is not a replacement for generic A2A conformance tooling, the A2A TCK or inspection ecosystem, MCP Inspector, generic MCP server debugging or generic protocol schema validation.

A2A and MCP implementations may each behave correctly within their own boundaries while the composition still violates an end-to-end invariant.

## Security findings are not certification

A HandoffProbe PASS is not:

- a security certification;
- a guarantee that the system has no vulnerabilities;
- a guarantee that every handoff property has been tested;
- formal verification of the complete system;
- a replacement for architecture review, code review or a broader security assessment.

A HandoffProbe FAIL means the configured test observed its defined failure condition with the evidence available to that test. Findings still require interpretation within documented preconditions, protocol applicability and integration context.

## Model and prompt-security boundary

HandoffProbe is not a generic LLM red-team or prompt-injection scoring product.

Untrusted model or content behavior is relevant only when it can be reduced to a structured handoff-security invariant, such as unauthorized downstream tool or resource selection.

Research in this area remains non-stable unless separately admitted.

## Runtime and platform limitations

The current package runtime contract is `Node.js >=24 <25`.

Repository quality CI covers GitHub-hosted Ubuntu, macOS and Windows on Node 24.

The reusable composite GitHub Action uses `shell: bash`. Repository or package CI coverage on Windows does not by itself claim native Windows compatibility for every Action execution environment.

Other runtimes and platforms are unsupported unless explicitly documented.

## Protocol limitations

The current public wire baseline is **A2A 1.0 -> MCP 2026-07-28**.

HandoffProbe does not currently claim stable product support for A2A -> A2A, arbitrary MCP-to-MCP handoffs, arbitrary browser or tool-execution protocols, payment or commerce protocols, AP2, x402, UCP or every future A2A or MCP revision.

Those areas may appear in research or roadmap material without being current stable support.

## Adapter and integration limitations

The product includes an adapter architecture, but it does not claim universal drop-in compatibility with every agent framework, SDK or production topology.

A framework name appearing in research, an issue or external discussion is not equivalent to maintained product support.

## Authorized-use limitation

The current public Core does not provide blanket authorization or a general internet-scanning mandate.

Use HandoffProbe only against bundled fixtures, systems you own, controlled environments or systems for which you have explicit authorization.

Any future remote active-testing capability must remain explicitly opt-in and preserve safe defaults.

`SECURITY.md` is authoritative for authorized-use and disclosure expectations.

## Evidence and external claims

HandoffProbe distinguishes internal deterministic reproduction, external technical discussion, external confirmation, actual external product use and adoption.

These are not interchangeable.

Silence from an upstream author or user is not validation.

Downloads, clones, page views and stars are signals but are not by themselves proof of successful real-world use.

## Reports and secrets

HandoffProbe applies redaction rules to supported report and evidence paths. This reduces disclosure risk but does not make every generated artifact safe to publish automatically.

Operators remain responsible for reviewing outputs before sharing them and for keeping credentials, private customer data and undisclosed vulnerabilities out of public issues or artifacts.

## Hosted and enterprise limitations

The current Core does not imply the existence of user accounts, hosted scan execution, a production Cloud control plane, organization policy management, SSO, RBAC, enterprise evidence retention or a runtime enforcement gateway.

Cloud and Enterprise remain demand-gated roadmap tracks.

## Telemetry and paid-service boundary

The bundled Core path does not require hidden usage telemetry, signup or a paid AI service.

Optional public adoption and integration feedback is separate from product execution.

## Canonical related documents

Use these documents together:

- `docs/THREAT_MODEL.md` for the security model;
- `docs/ATTACK_CATALOG.md` for the stable and backlog attack inventory;
- `docs/P10_1_COMPATIBILITY_BASELINE_20260915.md` for compatibility evidence;
- `SECURITY.md` for authorized use and disclosure;
- `docs/USAGE.md` for CLI usage;
- `docs/GITHUB_INTEGRATION_SPECIFICATION.md` for the Action contract.

Historical research and release documents remain provenance records. They must not silently override current verified product support claims.
