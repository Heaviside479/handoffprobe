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

- [x] bootstrap TypeScript/npm project
- [x] baseline lint/typecheck/test/build
- [x] baseline GitHub Actions workflow added
- [x] baseline GitHub Actions workflow verified on remote

## Exit gate

No unresolved naming, product-scope, protocol-baseline or P0-test ambiguity.

---

# Phase 1 — Protocol laboratory

Status: completed 2026-08-24

## Goal

Create the smallest real A2A → MCP system HandoffProbe can observe.

## Deliverables

- [x] A2A 1.0 HTTP+JSON caller
- [x] A2A 1.0 receiver
- [x] MCP 2026-07-28 client
- [x] local MCP server
- [x] harmless fake tools
- [x] explicit handoff translation layer
- [x] SecurityContext model
- [x] EvidenceEvent model
- [x] secure reference fixture
- [x] intentionally vulnerable fixture

## First vertical slice

user
→ A2A caller
→ A2A receiver
→ translation layer
→ MCP client
→ MCP server
→ fake tool

Implemented and verified locally using:

- real A2A 1.0 HTTP+JSON over loopback HTTP
- explicit A2A → MCP security-context translation
- MCP 2026-07-28 modern protocol negotiation
- local `read_invoice` fake tool with no external side effects
- structured nine-event evidence timeline
- secure fixture preserving `user:alice`
- vulnerable fixture reproducing principal continuity loss
- deterministic repeated-run equality checks
- evidence free of ephemeral loopback ports

## Exit gate

- [x] secure fixture executes deterministically
- [x] vulnerable fixture executes deterministically
- [x] both fixtures produce structured traces
- [x] repeated runs produce identical structured results
- [x] no destructive or external side effects

Phase 1 exit gate satisfied on 2026-08-24.

---

# Phase 2 — Core security engine

Status: completed 2026-08-24

## Deliverables

- [x] AttackDefinition
- [x] AttackRegistry
- [x] TargetAdapter
- [x] HandoffAdapter
- [x] SecurityContext
- [x] EvidenceEvent
- [x] Finding
- [x] finding statuses
- [x] severity model
- [x] property class
- [x] protocol applicability
- [x] source/provenance metadata
- [x] run/correlation IDs
- [x] deterministic orchestration
- [x] timeout model
- [x] structured internal errors
- [x] secret redaction

## Implemented core

The Phase 2 core now provides:

- reusable `AttackDefinition` and deterministic `AttackRegistry`
- first-class `TargetAdapter` and `HandoffAdapter` boundaries
- canonical `SecurityContext` and `EvidenceEvent` models
- structured `Finding` objects with PASS/FAIL/NOT_APPLICABLE/INCONCLUSIVE/ERROR semantics
- qualitative severity and property-class types
- A2A/MCP protocol applicability metadata
- attack source/provenance propagation into findings and evidence
- explicit run IDs and correlation IDs
- deterministic `CoreRunner` orchestration
- configurable execution timeout handling with `AbortSignal`
- structured core, adapter and evaluation errors
- guarantee that runner `ERROR` is not treated as a security `FAIL`
- recursive evidence secret redaction while retaining safe fingerprints
- package-root exports for the reusable core API

The existing A2A 1.0 → MCP 2026-07-28 protocol laboratory now runs through
the reusable target/handoff adapter boundary without changing its observable
Phase 1 behavior.

## Exit gate

- [x] independent attack definitions reuse the same A2A/MCP protocol plumbing
- [x] handoff translation can be replaced through a first-class `HandoffAdapter`
- [x] attack provenance reaches findings and evidence
- [x] attack evaluation logic can change without protocol implementation changes
- [x] adapter failures produce `ERROR`, never vulnerability `FAIL`
- [x] timeout failures produce `ERROR`, never vulnerability `FAIL`
- [x] Phase 1 protocol-lab regression remains green

A new security attack can be added without rewriting protocol plumbing.

Phase 2 exit gate satisfied on 2026-08-24.

---

# Phase 3 — Mandatory P0 attack corpus

Status: completed 2026-08-25

## Implemented

- [x] HP-AUTH-001
- [x] HP-AUTH-002
- [x] HP-AUTH-003
- [x] HP-ID-001
- [x] HP-ID-002
- [x] HP-TENANT-001
- [x] HP-TARGET-001
- [x] HP-TARGET-002
- [x] HP-APPROVAL-001
- [x] HP-CRED-001
- [x] HP-CRED-002
- [x] HP-LIFECYCLE-001

## Verified behavior

- all 12 mandatory P0 IDs are stable and productive
- secure fixtures reject the designed invalid handoffs
- vulnerable fixtures reproduce the intended failures
- A2A 1.0 and MCP 2026-07-28 remain the pinned protocol baseline
- evidence carries protocol applicability and source/provenance metadata
- raw credentials are not recorded; credential evidence uses safe metadata/fingerprints
- tenant substitution demonstrates CRITICAL only on actual cross-tenant protected access
- approval mutations remain bound to deterministic payload hashes
- lifecycle cancellation is ordered deterministically between MCP request and protected tool execution
- bundled fixtures remain local/synthetic and create no real external side effects

## Exit gate

- [x] requirements in `docs/P0_TEST_SPECIFICATION.md` are satisfied
- [x] secure fixture passes every applicable mandatory P0 test
- [x] vulnerable fixture fails exactly where designed
- [x] runner `ERROR` cannot masquerade as vulnerability `FAIL`
- [x] every P0 definition records A2A/MCP applicability
- [x] findings/evidence retain source and provenance metadata
- [x] raw secrets do not appear in productive evidence
- [x] bundled P0 fixtures create no external side effects
- [x] mandatory P0 corpus runs without a paid AI service

Phase 3 exit gate satisfied on 2026-08-25.

---

# Phase 4 — Advanced handoff corpus

Status: completed 2026-08-25

## P1 implementation contract

Specification:

`docs/P1_TEST_SPECIFICATION.md`

The first advanced corpus is locked to ten P1 attacks:

- [x] HP-AUTH-004 — expired delegation reuse
- [x] HP-AUTH-005 — delegation-chain truncation
- [x] HP-REPLAY-001 — exact action replay
- [x] HP-REPLAY-002 — cross-context / cross-run replay
- [x] HP-REPLAY-003 — retry double execution
- [x] HP-APPROVAL-002 — tool substitution after approval
- [x] HP-APPROVAL-003 — approval reuse for another resource
- [x] HP-RACE-001 — parallel one-time authority consumption
- [x] HP-RACE-002 — partial-failure stale execution
- [x] HP-AUDIT-001 — cross-protocol audit lineage break

## Deferred advanced candidates

These remain candidates after the P1 corpus proves credible:

- state-handle confusion
- cache-scope leakage
- MRTR task misbinding
- delayed MRTR after cancellation
- routing metadata mismatch
- version downgrade/translation
- Agent Card security translation
- structured untrusted-content → unauthorized tool selection

## Admission gate

- every attack demonstrates a handoff/composition-specific invariant
- generic protocol checks do not enter Core
- replay/retry tests distinguish logical action identity from attempts
- expiry uses deterministic logical time
- race tests use deterministic synchronization barriers
- bundled tests remain local/synthetic
- every FAIL has reproducible evidence
- ERROR cannot masquerade as FAIL
- P0 regression remains green

## Exit gate

Requirements in `docs/P1_TEST_SPECIFICATION.md` are fully satisfied.

All ten P1 IDs are implemented and stable.

Secure fixtures pass every applicable P1 mutation.

Vulnerable fixtures fail exactly where designed.

The complete P0 corpus remains green.

Implementation milestone reached on 2026-08-25:

- all 10 locked P1 attacks are implemented on the Phase 4 feature branch
- P0 remains 12 / 12
- P1 is 10 / 10
- total locked corpus is 22 / 22
- secure/vulnerable fixture behavior is covered by deterministic automated tests
- PR #8 completed successfully
- PR CI run #10 completed successfully
- Phase 4 was fast-forwarded to `main`
- post-merge `main` CI run #11 completed successfully
- final Phase 4 main commit: `8f2759c143ad71aa395b145364d6a075329a82b1`

Phase 4 exit gate satisfied on 2026-08-25.

---

# Phase 5 — Developer-quality CLI

Status: completed 2026-08-29

Implementation contract:

`docs/CLI_SPECIFICATION.md`

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

## Phase 5 completion record

Phase 5 shipped the complete developer-quality CLI baseline:

- all 22 stable attacks are bound to the execution catalog;
- `list` exposes all 22 stable attacks;
- `explain <HP-ID>` works for all 22 stable attacks;
- the bundled secure target completes with 22 PASS findings;
- the bundled vulnerable target reproduces 22 FAIL findings;
- attack selection and repeated-ID deduplication are deterministic;
- config loading and CLI-over-config precedence are implemented;
- severity thresholds control the security-gate exit code without hiding findings;
- terminal, JSON and Markdown reporters are implemented and deterministic;
- report file output is implemented;
- exit codes 0, 1, 2 and 3 are deterministic;
- scanner/runtime ERROR remains distinct from vulnerability FAIL;
- A2A 1.0 and MCP 2026-07-28 are explicit in CLI output;
- CLI diagnostics and finding text are redacted;
- troubleshooting diagnostics avoid raw runtime errors and internal paths;
- the README contains the complete developer demo and command reference;
- the npm tarball contains the required CLI artifacts;
- the real local npm tarball executes successfully through `npx`;
- the bundled workflow remains synthetic, local-first and requires no paid AI service.

# Phase 6 — Automated quality and GitHub integration

Status: completed 2026-08-29

Implementation contract:

`docs/GITHUB_INTEGRATION_SPECIFICATION.md`

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

## Phase 6 completion record

Phase 6 completed the automated quality and GitHub integration baseline on
2026-08-29.

Verified implementation:

- repository CI covers format, lint, typecheck, tests, build and package validation;
- deterministic secret-safety validation is active;
- pull requests receive Dependency Review;
- the repository provides a reusable source-backed composite GitHub Action;
- one action invocation executes the scanner exactly once;
- canonical JSON and derived Markdown artifacts are produced safely;
- `GITHUB_STEP_SUMMARY` is supported;
- exit codes 0, 1, 2 and 3 preserve the CLI contract;
- the normal secure PR path produces 22 / 22 PASS findings;
- `main` requires `HandoffProbe`, `Quality` and `Dependency Review`;
- required checks use strict/up-to-date enforcement and apply to administrators;
- force pushes and deletion of `main` are disabled.

Deterministic exit-gate evidence:

- deliberate vulnerable demo PR: #11;
- demo head: `6a5a4f1c02efdaecf208ced3d258d01a9f08fce9`;
- HandoffProbe run: `33251273506`;
- Quality run: `33251273501`;
- Dependency Review run: `33251273503`;
- vulnerable target produced 22 / 22 FAIL findings;
- 20 findings were HIGH or CRITICAL;
- HandoffProbe returned security exit code `1`;
- runtime ERROR count remained zero;
- the failed HandoffProbe run still uploaded JSON and Markdown artifacts;
- Quality remained successful;
- Dependency Review remained successful;
- GitHub reported the non-draft demo PR as `MERGE_STATE=BLOCKED`;
- demo PR #11 was closed without merge;
- the temporary demo branch was deleted locally and remotely;
- `main` remained unchanged throughout the demonstration.

The stable corpus remains 12 P0 + 10 P1 = 22 attacks on
A2A 1.0 → MCP 2026-07-28.

The Phase 6 exit gate is satisfied.

---

# Phase 7 — Open-source v0.1 launch

Status: completed 2026-08-29

Implementation contract: `docs/V0_1_RELEASE_SPECIFICATION.md`

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

## Phase 7 completion record

HandoffProbe v0.1.0 was publicly released on 2026-08-29.

Verified release:

- public npm package `handoffprobe@0.1.0`;
- npm `latest` points to `0.1.0`;
- immutable release commit `90fdd691b390c420e3288383ad7efa7e0fb69e6f`;
- annotated Git tag `v0.1.0`;
- public GitHub release `HandoffProbe v0.1.0`;
- byte-identical npm/GitHub release artifact;
- SHA-256 `3ea4936980893f893e072bf6a378234da8777b1becf494493ff3ffaf4755163a`;
- exactly 22 stable attacks: 12 P0 + 10 P1;
- public secure run: 22 PASS / 0 FAIL / 0 ERROR;
- public `HP-AUTH-001` vulnerable demo: deterministic exit `1`;
- public JSON reporter: schema `1`;
- terminal, JSON and Markdown reporting;
- source-backed GitHub Action;
- protected `main` workflow and required checks;
- release completed with interactive security-key 2FA and without a long-lived publication token.

Phase 7 exit gate is satisfied.

---

# Phase 8 — Adoption and research loop

Status: active

Implementation contract: `docs/PHASE8_ADOPTION_RESEARCH_SPECIFICATION.md`

## Goals

- reduce first-run friction
- observe real user workflows
- add only evidence-backed high-value adapters
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

## Phase 8 baseline

Phase 8.0A completed a read-only post-launch adoption baseline on 2026-08-29.

Recorded raw signals included:

- 0 stars, 0 forks and 0 open items
- 1 contributor
- 4 GitHub views / 1 unique viewer in the available rolling window
- 87 GitHub clones / 55 unique cloners in the available rolling window
- 3 GitHub release-asset downloads
- npm download counters unavailable from the point-download endpoint at collection time

These counters are raw platform signals, not verified user counts. Clone traffic may include maintainer, CI and automated activity.

## Work packages

- [x] 8.0A — collect raw adoption baseline without repository mutation
- [x] 8.0B — freeze adoption and research operating contract
- [x] 8.1A — audit first-run friction from a clean external-user perspective
- [x] 8.1B — fix the highest measurable first-run friction with regression coverage

Phase 8.1 completion record:

- fresh exact-version public `npx` execution succeeded;
- first secure scan produced 22 PASS / 0 FAIL / 0 ERROR;
- vulnerable `HP-AUTH-001` produced the expected security exit code `1`;
- JSON reporting, project installation, config discovery and recovery paths succeeded;
- no HIGH first-run blocker was reproduced;
- exact-install documentation was corrected to use `--save-exact`;
- stale pre-release wording was removed from public documentation;
- first-run documentation regression coverage was added;
- no CLI behavior, attack behavior, protocol baseline, report schema or published `handoffprobe@0.1.0` artifact was changed.

Detailed evidence: `docs/PHASE8_FIRST_RUN_AUDIT_20260830.md`.

- [ ] 8.2A — audit GitHub Action onboarding and CI adoption path
- [ ] 8.2B — improve telemetry-free public or opt-in adoption signals
- [ ] 8.3A — research and rank adapter demand using real evidence
- [ ] 8.3B — implement the first adapter only if the evidence gate is met
- [ ] 8.4A — publish a reproducible research case with responsible-disclosure gates
- [ ] 8.5A — reduce contributor friction with focused external tasks and fixtures
- [ ] 8.6A — re-measure adoption, review findings and choose Phase 9 from evidence

## Phase 8 constraints

- no hidden usage telemetry
- no paid analytics requirement
- no SaaS/dashboard work
- no accounts or billing
- no paid AI API requirement
- no speculative adapter expansion
- no republishing changed contents as `handoffprobe@0.1.0`

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
