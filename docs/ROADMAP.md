# HandoffProbe Roadmap

Status: active

Strategy:

- open-source first
- local first
- near-zero infrastructure cost
- evidence before UI
- adoption before SaaS

---

# Phase 0 — Foundation lock

## Goal

Eliminate ambiguity before implementation.

## Completed

- [x] public GitHub repository
- [x] Apache-2.0 license
- [x] HandoffProbe final product name
- [x] repository renamed to `handoffprobe`
- [x] canonical project context
- [x] product definition
- [x] architecture baseline
- [x] threat model
- [x] attack catalog
- [x] severity policy
- [x] research baseline
- [x] competitive landscape
- [x] growth/monetization hypothesis
- [x] twelve P0 tests fully specified
- [x] technical implementation baseline
- [x] final-product definition

## Remaining

- [ ] bootstrap TypeScript/npm project
- [ ] baseline lint/typecheck/test/build
- [ ] baseline GitHub CI

## Exit gate

No unresolved naming, product-scope, protocol-baseline or P0-test ambiguity.

---

# Phase 1 — Protocol laboratory

## Goal

Create the smallest real A2A → MCP system HandoffProbe can observe.

## Deliverables

- A2A 1.0 HTTP+JSON caller
- A2A 1.0 receiver
- MCP 2026-07-28 client
- local MCP server
- harmless fake tools
- explicit handoff translation layer
- SecurityContext model
- EvidenceEvent model
- secure reference fixture
- intentionally vulnerable fixture

## First vertical slice

user
→ A2A caller
→ A2A receiver
→ translation layer
→ MCP client
→ MCP server
→ fake tool

## Exit gate

Both fixtures execute deterministically and produce structured traces.

---

# Phase 2 — Core security engine

## Deliverables

- AttackDefinition
- AttackRegistry
- TargetAdapter
- HandoffAdapter
- SecurityContext
- EvidenceEvent
- Finding
- finding statuses
- severity model
- property class
- protocol applicability
- source/provenance metadata
- run/correlation IDs
- deterministic orchestration
- timeout model
- structured internal errors
- secret redaction

## Exit gate

A new security attack can be added without rewriting protocol plumbing.

---

# Phase 3 — Mandatory P0 attack corpus

Implement:

- [ ] HP-AUTH-001
- [ ] HP-AUTH-002
- [ ] HP-AUTH-003
- [ ] HP-ID-001
- [ ] HP-ID-002
- [ ] HP-TENANT-001
- [ ] HP-TARGET-001
- [ ] HP-TARGET-002
- [ ] HP-APPROVAL-001
- [ ] HP-CRED-001
- [ ] HP-CRED-002
- [ ] HP-LIFECYCLE-001

## Exit gate

Requirements in `docs/P0_TEST_SPECIFICATION.md` are fully satisfied.

Secure fixture passes.

Vulnerable fixture fails exactly where intended.

ERROR cannot masquerade as FAIL.

---

# Phase 4 — Advanced handoff corpus

Candidates include:

- delegation expiry
- delegation-chain truncation
- exact replay
- cross-run replay
- retry duplicate execution
- approval/tool substitution
- approval/resource substitution
- one-time authorization races
- stale execution after partial failure
- audit lineage loss
- state-handle confusion
- cache-scope leakage
- MRTR task misbinding
- delayed MRTR after cancellation
- routing metadata mismatch
- version downgrade/translation
- Agent Card security translation
- structured untrusted-content → unauthorized tool selection

## Admission gate

Every attack must demonstrate a handoff/composition-specific invariant.

Generic protocol checks do not enter Core.

---

# Phase 5 — Developer-quality CLI

Target:

`npx handoffprobe test`

## Commands

- `handoffprobe test`
- `handoffprobe list`
- `handoffprobe explain <HP-ID>`
- `handoffprobe --version`
- `handoffprobe --help`

## Deliverables

- configuration file
- target selection
- test selection
- severity threshold
- safe defaults
- readable terminal output
- JSON reporter
- Markdown reporter
- deterministic CI exit codes
- troubleshooting output
- explicit protocol versions

## Exit gate

A developer unfamiliar with the project can reproduce the full demo using only
the README.

---

# Phase 6 — Automated quality and GitHub integration

## Repository CI

- format
- lint
- typecheck
- unit tests
- integration tests
- regression tests
- build/package validation
- dependency review
- secret-safety validation

## HandoffProbe GitHub Action

- run scanner in PR workflow
- configurable severity threshold
- PR summary
- machine-readable artifact
- evidence artifact handling
- deterministic merge gate

## Exit gate

A deliberate vulnerable regression blocks a demo pull request.

---

# Phase 7 — Open-source v0.1 launch

## Required

- minimum 12 P0 tests
- secure fixture
- vulnerable fixture
- one-command demo
- polished README
- npm package
- GitHub release
- install docs
- usage docs
- security policy
- contribution guide
- attack catalog
- research article
- launch examples

## Public demonstration

The strongest demo should show:

A2A-side behavior: expected

MCP-side behavior: expected

Combined handoff invariant: FAIL

HandoffProbe: reproducibly detects the failure

---

# Phase 8 — Adoption and research loop

## Goals

- reduce first-run friction
- observe real user workflows
- add high-value adapters
- publish reproducible research
- responsibly disclose confirmed vulnerabilities
- convert fixed issues into regression tests
- attract external contributors

## Metrics

Prefer:

- successful installs
- successful scans
- repeat usage
- CI usage
- real repositories using HandoffProbe
- npm downloads
- contributors
- high-quality issues
- adapter requests
- vulnerability disclosures
- commercial inquiries

GitHub stars are useful but secondary.

---

# Phase 9 — Framework and adapter expansion

Possible integration targets should be chosen from real demand.

## Principle

Adapters must reuse the same engine.

Do not create independent scanners for every framework.

---

# Phase 10 — v0.5 reliability hardening

## Deliverables

- compatibility matrix
- fixture-version matrix
- versioned report schema
- versioned config schema
- backward compatibility policy
- test deprecation policy
- deterministic seeds
- performance benchmarks
- concurrency tests
- structured diagnostic logs
- redaction regression tests
- macOS CI
- Linux CI
- Windows CI where practical
- dependency upgrade process
- upstream spec-drift review

## Exit gate

HandoffProbe behaves like dependable developer infrastructure rather than a
research prototype.

---

# Phase 11 — v0.9 release engineering

## Deliverables

- release automation
- npm publication workflow
- tagged releases
- release notes
- reproducible build validation
- provenance/SBOM where practical
- migration policy
- upgrade guide
- troubleshooting guide
- FAQ
- release candidate testing
- external feedback round

## Exit gate

No known Critical or High HandoffProbe defect.

Public interfaces intended for v1 are frozen.

---

# Phase 12 — HandoffProbe v1.0 GA

## GA requirements

- stable Core engine
- stable CLI
- stable config schema
- stable report schema
- all P0 attacks mature
- meaningful additional handoff coverage
- GitHub Action mature
- compatibility documented
- CI comprehensive
- safe defaults
- threat model current
- limitations documented
- external users demonstrated
- release automation proven
- upgrade process documented

## Rule

Do not ship v1.0 because of time or marketing pressure.

Ship when external users can reasonably depend on the tool.

---

# Phase 13 — Commercial validation

Before building SaaS, sell high-value work around Core.

## Offers

### Handoff Security Assessment

Authorized architecture/security assessment using HandoffProbe plus manual
analysis.

### Custom Adapter

Integration with proprietary agent infrastructure.

### Private Test Pack

Organization-specific handoff invariants.

### Enterprise Support

Onboarding, integration support and maintenance.

## Exit gate

Real organizations demonstrate willingness to pay.

---

# Phase 14 — HandoffProbe Cloud beta

Conditional.

Build only if centralized usage is repeatedly requested.

Possible features:

- accounts
- organizations
- projects
- private scan history
- scheduled scans
- centralized policies
- GitHub organization integration
- alerts
- evidence retention
- basic team roles

Core must remain independently useful.

---

# Phase 15 — Enterprise product

Conditional capabilities:

- SSO
- SCIM if demanded
- granular RBAC
- audit logs
- data-retention controls
- compliance evidence
- organization policy packs
- private adapters
- private attack packs
- support SLA
- enterprise deployment options
- security/compliance documentation

---

# Phase 16 — Broader handoff coverage

Only after the original wedge is proven.

Candidates:

- A2A → A2A
- additional MCP handoffs
- approval handoffs
- browser/tool execution
- agentic transactions
- payment handoffs
- AP2
- x402
- UCP/commerce
- additional agent protocols

Every module must still satisfy the HandoffProbe thesis:

> security properties lost during a handoff

---

# Phase 17 — Mature product

Desired long-term state:

- respected open-source Core
- meaningful external adoption
- substantial attack corpus
- recurring original research
- responsible disclosures
- external contributors
- CI adoption
- framework/protocol integrations
- commercial customers
- optional profitable enterprise layer

Strategic value should come from:

- adoption
- corpus
- integrations
- regression knowledge
- research credibility
- developer trust
- enterprise trust

not raw source-code volume.

---

# Permanent reassessment gates

Reassess the product if:

- official protocol tooling comprehensively solves the same problem
- another mature project dominates dynamic handoff testing
- real implementations do not reveal meaningful handoff-specific failures
- users consistently request a materially different problem
- compatibility maintenance exceeds demonstrated user value

Reusable assets to preserve during any pivot:

- test runner
- evidence model
- attack corpus
- protocol adapters
- regression fixtures
- research
