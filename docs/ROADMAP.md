# HandoffProbe Roadmap

This roadmap is intentionally staged to protect the project's zero-budget, open-source-first strategy.

## Phase 0 — Research-locked foundation

Status: in progress

- [x] Public GitHub repository
- [x] Apache-2.0 license
- [x] Canonical product context
- [x] Final product name: HandoffProbe
- [x] Repository renamed to `handoffprobe`
- [x] Planned package/CLI naming standardized to `handoffprobe`
- [x] Test-ID prefix standardized to `HP-`
- [x] Initial product scope
- [x] Architecture plan
- [x] Threat-model baseline
- [x] Initial attack catalog
- [x] Growth and monetization hypothesis
- [x] Current A2A/MCP research baseline
- [x] Competitive-landscape boundary
- [x] Finding/severity policy
- [ ] Re-verify exact current SDK/package versions immediately before scaffold
- [ ] Pin A2A 1.0 / MCP 2026-07-28 fixture behavior
- [ ] Choose Node/tooling versions (target Node 24 LTS unless SDK constraints justify otherwise)
- [ ] Create initial TypeScript project
- [ ] Add CI baseline

Exit condition: contributors and coding agents can explain exactly what v0.1 is, what it is not, which protocol versions it targets and why official single-protocol tools do not make it redundant.

## Phase 1 — Protocol laboratory

Goal: prove that HandoffProbe can model the A2A 1.0 -> MCP 2026-07-28 handoff.

- build a minimal A2A 1.0 HTTP+JSON caller/receiver fixture
- build a minimal MCP 2026-07-28 server with harmless fake tools
- explicitly opt SDK fixtures into the intended protocol revision
- implement a first-class handoff/translation layer
- model identity, authority, tenant, resource, approval and lifecycle context
- create one secure composition fixture
- create one intentionally vulnerable composition fixture
- use harmless side-effect counters/temp state
- establish structured trace/evidence timeline
- run relevant individual protocol checks/preflight where useful

Exit condition: one deterministic failure exists where the handoff violates an end-to-end invariant and the failure is attributable to the boundary rather than a basic malformed protocol implementation.

## Phase 2 — Core engine

Goal: turn the lab into a reusable scanner engine.

- attack/test interface
- target and handoff adapter interfaces
- assertion model
- finding/severity schema
- property classification
- protocol-version applicability
- source/provenance references
- deterministic evidence capture
- run/correlation IDs
- secret redaction
- run orchestration
- timeout/retry handling
- safety policy / local-default target restrictions
- stable `HP-*` test IDs
- versioned JSON result schema

Exit condition: handoff attack rules can be added without rewriting the runner and every failure carries reproducible, source-linked evidence.

## Phase 3 — First attack corpus

Goal: implement the 12 P0 handoff tests in `docs/ATTACK_CATALOG.md`.

P0 priorities:

- delegated authority amplification
- missing-scope fail-open translation
- cross-agent authorization reuse
- principal continuity
- agent identity substitution
- tenant continuity
- resource binding
- capability/tool semantic binding
- post-consent payload mutation
- broad credential propagation
- credential audience binding
- cancellation propagation

Then add P1 replay, concurrency, partial-failure and audit-lineage cases.

Exit condition: all 12 P0 tests implemented; vulnerable fixture produces known failures and secure fixture passes expected tests. Do not inflate the number with generic A2A/MCP checks.

## Phase 4 — Current-spec advanced handoff cases

Only after P0 is stable, evaluate handoff-specific tests for:

- explicit MCP state-handle binding
- MCP cache-scope context
- MRTR input/approval binding
- routing-header/body translation
- protocol-version downgrade/translation
- Agent Card-derived capability/security translation
- structured untrusted-content-to-tool semantic integrity

Exit condition: each accepted test demonstrates a handoff-specific property rather than duplicating official tooling.

## Phase 5 — Developer-quality CLI

Goal: one-command local use.

Target UX:

```bash
npx handoffprobe test
```

Deliverables:

- CLI help and configuration
- explicit protocol baseline in output
- readable terminal report
- JSON output
- Markdown output
- non-zero exit code on configured severities
- examples
- troubleshooting docs
- versioned configuration schema
- safe defaults (local targets; destructive tests disabled)

Exit condition: a developer unfamiliar with the repository can run the demo from the README and understand exactly why a failure is handoff-specific.

## Phase 6 — CI / GitHub integration

- GitHub Action wrapper
- PR-friendly summary output
- severity threshold / fail policy
- artifact/evidence retention guidance
- SARIF only if it maps cleanly to findings
- public example repository

Exit condition: HandoffProbe can gate a demo pull request on a handoff-security regression.

## Phase 7 — Public v0.1 launch

Launch only when the product demonstrates a real, understandable failure.

- re-check exact npm package availability for `handoffprobe`; use scoped package if necessary without changing the product brand
- polished README and demo artifact if useful
- npm publication
- GitHub release
- Show HN launch candidate
- security/developer community posts
- technical research article, not generic marketing
- demo showing relevant individual checks pass but a handoff invariant fails (without overstating certification)
- clear contribution path
- public roadmap

Primary metrics:

- successful first-run rate
- repeat usage/downloads
- stars from real users
- issues and contributions
- integrations requested

## Phase 8 — Research and adoption loop

- expand attack corpus based on real implementations
- monitor A2A/MCP release notes and SDK changes
- version/deprecate tests explicitly when specs change
- publish reproducible research
- responsibly disclose confirmed vulnerabilities
- add framework adapters where demand exists
- maintain regression cases for fixed issues
- cultivate external contributors

Do not chase star count at the expense of technical credibility.

## Phase 9 — First revenue

Prefer services before expensive SaaS infrastructure:

1. agent handoff / protocol-composition security assessments
2. custom HandoffProbe adapters/test packs
3. enterprise support

Target outcome: validate willingness to pay before building a hosted platform.

## Phase 10 — Hosted / enterprise layer (conditional)

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

## Phase 11 — Expansion (conditional)

Expansion candidates, based on demand and research:

- additional A2A/MCP transports/SDKs
- other protocol pairings
- approval-integrity testing
- agentic transaction testing
- CI trust-flow analysis

No expansion should weaken the core handoff-testing identity without evidence.

## Kill / reassessment gates

Reassess before expensive expansion if:

- an official handoff/composition-security TCK covers the wedge comprehensively;
- a mature open-source competitor provides equivalent dynamic handoff testing and wins adoption;
- strong fixtures fail to reveal meaningful handoff-specific issues;
- users consistently value another problem more than the current wedge.

Preserve reusable runner/evidence/corpus assets if a pivot is necessary.
