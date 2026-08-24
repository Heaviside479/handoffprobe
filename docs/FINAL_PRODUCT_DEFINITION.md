# HandoffProbe — Final Product Definition

This document defines what “professionally finished” means.

A working scanner is not automatically a finished product.

HandoffProbe is professionally mature only when the core engine, developer
experience, security model, integrations, release engineering, documentation
and optional commercial layer are credible.

## Product category

HandoffProbe is:

> Adversarial security testing for AI agent handoffs.

The original wedge is:

A2A 1.0 → MCP 2026-07-28

Future expansion may cover other handoff types while preserving the same core
security thesis.

## Mature open-source Core

HandoffProbe Core should ultimately provide:

- deterministic local CLI
- stable configuration schema
- stable machine-readable report schema
- terminal reporting
- JSON reporting
- Markdown reporting
- CI-safe exit codes
- GitHub Action integration
- secure reference fixtures
- vulnerable reference fixtures
- maintained attack corpus
- protocol-version applicability
- attack provenance/source metadata
- deterministic evidence traces
- strong secret redaction
- safe active-testing defaults
- adapter architecture
- regression fixtures from real fixed issues
- compatibility matrix
- protocol upgrade policy
- test deprecation policy
- automated CI
- reproducible releases
- dependency/security checks
- documented limitations
- contributor documentation
- responsible disclosure workflow

## v1.0 quality threshold

v1.0 requires:

- production-quality Core engine
- all P0 tests mature
- meaningful additional P1/advanced coverage
- stable CLI contract
- stable config schema
- stable report schema
- reliable Node 24 support
- documented protocol compatibility
- secure fixture
- vulnerable fixture
- GitHub Action
- release automation
- complete installation/getting-started path
- architecture documentation
- threat model
- security policy
- contribution workflow
- changelog/release notes
- runtime/performance benchmark
- strong automated test coverage
- no known Critical/High HandoffProbe defect
- evidence from external users before GA

Do not inflate attack count merely for marketing.

## Commercial layer

A hosted product is conditional.

It should only be built after organizations repeatedly demonstrate a need for
centralized operation.

Potential capabilities:

- organization accounts
- projects
- private scan history
- scheduled scans
- centralized security policies
- severity gates
- GitHub organization integration
- SSO
- RBAC
- audit logs
- evidence retention
- compliance exports
- notifications
- private attack packs
- enterprise adapters
- support SLA

The open-source Core must remain useful without Cloud.

## Early revenue

Revenue should initially come from:

- handoff security assessments
- agent architecture reviews
- custom adapters
- custom/private test packs
- enterprise onboarding
- enterprise support

## Desired moat

Long-term defensibility should come from:

- attack corpus quality
- protocol-version expertise
- real vulnerability regression cases
- framework integrations
- research credibility
- responsible disclosures
- community adoption
- CI adoption
- evidence quality
- enterprise trust

A dashboard alone is not a moat.

## Finished-user experience

A mature HandoffProbe user should be able to:

1. discover the project
2. understand the purpose quickly
3. install without signup
4. run the demo
5. understand PASS/FAIL evidence
6. connect a supported system
7. run handoff attacks
8. reproduce findings
9. add HandoffProbe to CI
10. understand remediation
11. upgrade safely
12. request support or contribute

without requiring direct assistance from the original author.
