# BridgeBreak Roadmap

This roadmap is intentionally staged to protect the project's zero-budget, open-source-first strategy.

## Phase 0 — Foundation

Status: in progress

- [x] Public GitHub repository
- [x] Apache-2.0 license
- [x] Canonical product context
- [x] Initial product scope
- [x] Architecture plan
- [x] Threat-model baseline
- [x] Initial attack catalog
- [x] Growth and monetization hypothesis
- [ ] Choose package/runtime/tooling versions
- [ ] Create initial TypeScript project
- [ ] Add CI baseline

Exit condition: contributors and coding agents can explain exactly what v0.1 is and is not.

## Phase 1 — Protocol laboratory

Goal: prove that BridgeBreak can model the A2A -> MCP seam.

- build a minimal A2A caller/receiver fixture
- build a minimal MCP server with harmless fake tools
- model identity, authorization, resource and approval context
- create one secure composition fixture
- create one intentionally vulnerable composition fixture
- establish trace/evidence format

Exit condition: one deterministic composition failure can be reproduced end-to-end.

## Phase 2 — Core engine

Goal: turn the lab into a reusable scanner engine.

- attack/test interface
- target adapter interface
- assertion model
- finding/severity schema
- deterministic evidence capture
- run orchestration
- timeout/retry handling
- stable test IDs
- JSON result schema

Exit condition: attack rules can be added without rewriting the runner.

## Phase 3 — First attack corpus

Goal: 15-20 meaningful A2A -> MCP security checks.

Priorities:

- delegated scope escalation
- identity continuity loss
- cross-agent authorization reuse
- replay
- expired authorization reuse
- tool substitution
- resource substitution
- payload mutation after approval
- approval/consent drift
- credential propagation/leakage
- namespace/tool confusion
- concurrency/double execution

Exit condition: vulnerable fixture produces known failures; secure fixture passes the expected suite.

## Phase 4 — Developer-quality CLI

Goal: one-command local use.

Target UX:

```bash
npx bridgebreak test
```

Deliverables:

- CLI help and configuration
- readable terminal report
- JSON output
- Markdown output
- non-zero exit code on configured severities
- examples
- troubleshooting docs
- versioned configuration schema

Exit condition: a developer unfamiliar with the repository can run the demo from the README.

## Phase 5 — CI / GitHub integration

- GitHub Action wrapper
- PR-friendly summary output
- SARIF only if it maps cleanly to findings
- severity threshold / fail policy
- artifact retention guidance
- public example repository

Exit condition: BridgeBreak can gate a demo pull request on a composition-security regression.

## Phase 6 — Public v0.1 launch

Launch only when the product demonstrates a real, understandable failure.

- polished README and demo GIF/screenshot if useful
- npm publication
- GitHub release
- Show HN launch candidate
- security-community launch posts
- technical research article, not generic marketing
- clear contribution path
- public roadmap

Primary metrics:

- successful first-run rate
- repeat usage/downloads
- stars from real users
- issues and contributions
- integrations requested

## Phase 7 — Research and adoption loop

- expand attack corpus based on real implementations
- publish reproducible research
- responsibly disclose confirmed vulnerabilities
- add framework adapters where demand exists
- maintain regression cases for fixed issues
- cultivate external contributors

Do not chase star count at the expense of technical credibility.

## Phase 8 — First revenue

Prefer services before expensive SaaS infrastructure:

1. protocol security assessments
2. custom BridgeBreak adapters/test packs
3. enterprise support

Target outcome: validate willingness to pay before building a hosted platform.

## Phase 9 — Hosted / enterprise layer (conditional)

Only build if recurring organizational pain is demonstrated.

Potential paid features:

- private organization dashboard
- scan history
- scheduled scans
- centralized policies
- SSO/RBAC
- audit/compliance evidence
- organization-wide GitHub integration
- support SLAs

## Phase 10 — Expansion (conditional)

Expansion candidates, based on demand and research:

- additional A2A/MCP implementations
- other protocol pairings
- approval-integrity testing
- agentic transaction testing
- CI trust-flow analysis

No expansion should weaken the core composition-testing identity without evidence.
