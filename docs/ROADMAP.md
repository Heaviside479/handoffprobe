# HandoffProbe Roadmap

Status: active
Current checkpoint: 2026-09-16

Strategy:

- open-source first
- local first
- near-zero infrastructure cost
- evidence before UI
- adoption before SaaS
- service-first commercial validation may run in parallel with open-source maturation
- no hosted SaaS before repeated organization-level demand

## Current execution model — authoritative from 2026-09-21

Current verified public release: **`handoffprobe@0.4.0`**.

Roadmap phase numbers describe product maturity and work sequencing. They do
not require matching npm version numbers.

From this checkpoint, HandoffProbe runs four coordinated but independently
progressing work lanes.

### Lane A — Core / GA technical spine

Primary sequence:

`P11 closeout -> P12 GA readiness -> v1 contract freeze -> GA candidate proof -> final GA decision`

Internal technical work continues whenever its own prerequisites are satisfied.

Waiting for an external reply must not create an idle development state.

### Lane B — external evidence and adoption

This lane includes:

- P11.6 external release feedback;
- external research/reviewer responses;
- public result-return loops;
- qualifying external product-use evidence;
- adoption evidence needed for final GA claims.

After an external request or result return has been sent, its state may remain
`PENDING` while other internal work continues.

External silence:

- is never approval;
- is never validation;
- does not raise an evidence level;
- does not block unrelated internal engineering;
- blocks only a gate that explicitly requires the missing external evidence.

A fresh reproducible Critical or High HandoffProbe defect is different: it
immediately becomes a release blocker until resolved or explicitly
dispositioned.

### Lane C — research and attack admission

Research continues independently of release numbering.

Use the existing evidence discipline:

`source -> freeze -> overlap -> deterministic fixture -> effect evidence -> admission decision -> result return -> external-response classification`

Research volume alone does not expand the stable corpus.

A new stable attack, adapter, protocol path or other public capability requires
its own admission and release decision.

### Lane D — commercial validation

Phase 13 continues in parallel with Core maturation.

Commercial progress does not require waiting for v1.0 and does not itself force
a Core package-version change.

Commercial evidence may contribute to external-use evidence only when it
demonstrates actual HandoffProbe product use. Interest, page visits, inquiries
or payment intent alone are not equivalent to technical product adoption.

### Release-number policy from v0.4.0

Use SemVer from actual shipped public scope rather than roadmap numbering.

- `0.4.x`: compatible bug, security or maintenance fixes to the current public
  contract when publication is justified;
- `0.5.0` through `0.9.0`: only for independently justified backward-compatible
  public capability additions before GA;
- no intermediate minor version is required merely to consume the number;
- `1.0.0-rc.N`: permitted once the internal GA candidate is technically ready
  and a prerelease is useful for final installation, integration or external-use
  validation;
- a prerelease is not GA and does not satisfy missing external evidence merely
  by existing;
- `1.0.0`: only after the final Phase 12 GA gate is satisfied;
- after GA, compatible new capabilities normally use `1.x` minor releases,
  compatible fixes use `1.x.y` patch releases, and breaking accepted v1 public
  contracts require a later major-version decision.

Every release still requires a separate scope/SemVer audit and controlled
publication track.

---

## Current release sequence — authoritative from 2026-09-09

The maintenance and minor-release sequence is complete:

1. **v0.1.1 — security maintenance release (COMPLETED 2026-09-09)**
   - published from the immutable `v0.1.0` release line;
   - patched the affected dependency graph;
   - npm, GitHub Release and external Action verification completed;
   - the existing `v0.1.0` tag remained untouched.
2. **v0.2.0 — next minor release (COMPLETED 2026-09-09)**
   - audited and froze a coherent public scope from the `main` development line;
   - preserved exactly 22 stable attacks and the A2A 1.0 → MCP 2026-07-28 public contract;
   - published the npm package, annotated tag and GitHub Release;
   - verified the public package and both version-tag and immutable-SHA GitHub Action references externally.

**Release-order result:** v0.1.1 was completed before v0.2.0 publication. Neither immutable release tag was moved or rewritten.

Detailed execution gates for both releases are defined after Phase 9 below under **Release Track R1** and **Release Track R2**.

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

## Post-release maintenance note — 2026-09-08

A later dependency review established that the immutable `v0.1.0` lockfile contains `qs 6.15.3`, which is inside the affected version range of the currently known `qs` array-limit bypass advisory. This does **not** retroactively change the Phase 7 completion record and does not by itself assert exploitability of HandoffProbe; it creates a maintenance obligation for the published release line.

Policy:

- `v0.1.0` remains immutable;
- no tag movement or silent republishing;
- a minimal `v0.1.1` maintenance release must supersede it;
- current `main` already carries a patched `qs` resolution, but `main` is not an acceptable substitute for repairing the public `v0.1.x` release line because it contains substantial later Phase 8/9 work.

Execution is defined under **Release Track R1** below.

---

# Phase 8 — Adoption and research loop

Status: completed 2026-08-31

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

- [x] 8.2A — audit GitHub Action onboarding and CI adoption path

Phase 8.2A completion record:

- a separate private consumer repository executed the published v0.1.0 Action successfully;
- the consumer required no HandoffProbe source tree or `package.json`;
- `contents: read` was sufficient;
- immutable release commit `90fdd691b390c420e3288383ad7efa7e0fb69e6f` produced action result `pass` and exit code `0`;
- the external run produced 22 PASS / 0 FAIL / 0 ERROR;
- canonical JSON schema `"1"` and the Markdown summary were verified from the uploaded artifact;
- F8-CI-001 identified four public immutable-pin placeholders and zero direct release-SHA references;
- public Action examples now use the reviewed immutable v0.1.0 release commit directly;
- source-backed install/build overhead remains observational and does not trigger architecture work;
- the synthetic maintainer-created audit repository is not counted as independent adoption;
- no `action.yml`, scanner behavior, attack behavior, protocol baseline, report schema or published `handoffprobe@0.1.0` artifact was changed.

Detailed evidence: `docs/PHASE8_GITHUB_ACTION_AUDIT_20260830.md`.

- [x] 8.2B — improve telemetry-free public or opt-in adoption signals

Phase 8.2B completion record:

- no hidden CLI or GitHub Action usage telemetry was added;
- a voluntary public adoption-feedback issue form now distinguishes first evaluation from repeated local and CI use;
- adoption feedback can optionally reference a public repository while remaining explicitly self-reported evidence;
- a voluntary adapter-request form now captures both sides of the handoff path, versions, demand evidence, handoff-specific security value, reproducibility, paid-infrastructure requirements and maintenance risk;
- public issue forms warn against secrets, private data and undisclosed vulnerability disclosure;
- the issue chooser links security-sensitive reporters to the repository security policy while retaining blank issues;
- README and CONTRIBUTING expose the opt-in feedback paths;
- maintainer-created test reports and synthetic audit repositories remain excluded from independent-adoption claims;
- adapter requests remain evidence inputs and do not guarantee implementation;
- no scanner behavior, attack behavior, protocol baseline, report schema, `action.yml`, package metadata or published `handoffprobe@0.1.0` artifact was changed.

Detailed evidence: `docs/PHASE8_ADOPTION_SIGNALS_20260830.md`.

- [x] 8.3A — research and rank adapter demand using real evidence

Phase 8.3A completion record:

- direct HandoffProbe opt-in demand remains unclaimed because no external `[Adapter]` or `[Adoption]` issue existed at the research snapshot;
- public ecosystem evidence was ranked against the existing handoff-specific security, demand, reproducibility, maintenance, version-stability and no-paid-infrastructure criteria;
- Google ADK ranks first because `google/adk-python#5729` demonstrates a real `to_a2a()` → `McpToolset` multi-agent path with production measurements and a minimal reproduction;
- Google ADK exposes a public `BaseLlm` abstraction and its own tests demonstrate deterministic predefined model responses, so a no-paid model fixture is technically feasible;
- IBM ContextForge ranks second because `IBM/mcp-context-forge#3621` demonstrates client-identified caller-identity propagation demand across a multi-agent chain;
- tRPC-Agent-Go, LangGraph A2A→MCP paths and fast-agent remain ranked research candidates but do not currently beat ADK on the combined admission evidence;
- framework popularity, generic prompt injection, generic MCP-only failures and maintainer-created synthetic usage do not admit an adapter;
- 8.3B remains closed to implementation until an isolated ADK admission probe pins the exact framework/protocol versions, local MCP fixture, deterministic no-paid model substitute and stable PASS/FAIL observation surface;
- if the ADK probe fails the admission gate, ContextForge is re-evaluated instead of forcing adapter implementation;
- no scanner behavior, attack behavior, protocol baseline, report schema, `action.yml`, package metadata or published `handoffprobe@0.1.0` artifact was changed.

Detailed evidence: `docs/PHASE8_ADAPTER_DEMAND_RESEARCH_20260830.md`.

- [x] 8.3B — implement the first adapter only if the evidence gate is met

Phase 8.3B completion record:

- all five ranked adapter candidates were evaluated against the full evidence gate;
- Google ADK did not satisfy the exact current A2A 1.0 + MCP 2026-07-28 protocol tuple;
- IBM ContextForge has strong identity/delegation demand and an A2A v1-compatible path, but its reviewed MCP runtime line remains before the current HandoffProbe MCP baseline;
- tRPC-Agent-Go has a proven A2A 1.0 path, but the reviewed MCP implementation supports 2024-11-05 and 2025-03-26 rather than 2026-07-28;
- the public LangGraph A2A-to-MCP sample demonstrates meaningful composition but fails the exact-version and deterministic no-paid reproduction gates as published;
- fast-agent completed a real local A2A 1.0 to MCP 2026-07-28 deterministic zero-paid E2E probe, but lacks sufficient demand for this exact boundary;
- the fast-agent bearer non-forwarding observation is recorded as boundary behavior and is not claimed as a vulnerability;
- no framework adapter was admitted or implemented because no candidate satisfied every admission criterion at the same time;
- no paid AI API, paid cloud service, hidden telemetry or unauthorized third-party activity was required;
- no scanner runtime, attack behavior, protocol baseline, report schema, CLI behavior, GitHub Action runtime, package metadata or published handoffprobe@0.1.0 artifact was changed.

Detailed evidence: `docs/PHASE8_ADAPTER_ADMISSION_DECISION_20260830.md`.

- [x] 8.4A — publish a reproducible research case with responsible-disclosure gates

Phase 8.4A Abschlussprotokoll:

- erster öffentlicher Phase-8-Research-Fall: `HP-AUTH-001 — Delegated authority amplification`;
- Reproduktion gegen das unveränderliche öffentliche Paket `handoffprobe@0.1.0`;
- öffentlicher npm-Shasum bleibt `2aa56211d7559cac2cf2052275af45331fba6663`;
- Protokoll-Baseline bleibt A2A 1.0 → MCP 2026-07-28;
- sichere Variante: PASS / Exit `0`;
- absichtlich verwundbare Variante: FAIL / Exit `1`;
- Scanner-/Runtime-Fehler: `0`;
- A2A-lokale Beobachtung, Handoff-Grenze und MCP-lokale Beobachtung werden getrennt dokumentiert;
- ausschließlich synthetische HandoffProbe-Fixtures verwendet;
- keine Drittanbieter-Systeme, echten Zugangsdaten oder echten Benutzerdaten getestet;
- keine private Drittanbieter-Offenlegung für diesen synthetischen Fall erforderlich;
- keine Schwachstelle in A2A oder MCP behauptet;
- Dokumentations-Regressionstest bindet den öffentlichen Fall an die produktiven HP-AUTH-001-Metadaten;
- Research-Fall ist aus dem öffentlichen README erreichbar;
- keine kostenpflichtige KI-API, Cloud-Infrastruktur oder versteckte Telemetrie erforderlich;
- Scanner-Verhalten, Protokoll-Baseline, Report-Schema, Paketmetadaten und `handoffprobe@0.1.0` bleiben unverändert.

Detailnachweis: `docs/PHASE8_RESEARCH_CASE_HP_AUTH_001_20260831.md`.

- [x] 8.5A — reduce contributor friction with focused external tasks and fixtures

Phase 8.5A Abschlussprotokoll:

- öffentlicher Contributor-Quickstart mit Node.js 24 dokumentiert;
- vorhandene synthetische Fixture-Flächen und klare Test-Erwartungen dokumentiert;
- `CONTRIBUTING.md` und README verlinken den Contributor-Einstieg;
- Dokumentations-Regressionstest schützt den Contributor-Vertrag;
- drei kleine externe Aufgaben als GitHub-Issues veröffentlicht:
  - `#22` — Clean-Clone-Quickstart auf Node.js 24 verifizieren;
  - `#23` — Windows-PowerShell-Beitragspfad dokumentieren;
  - `#24` — eine bestehende synthetische Fixture erklären;
- Issues `#22`, `#23` und `#24` sind als `good first issue`, `help wanted` und `documentation` veröffentlicht;
- externes Research-Issue `#20` bleibt fortgeschrittene Research-Evidenz und ausdrücklich keine Einsteigeraufgabe;
- kein neuer Scanner-Scope, keine neue Attack-ID und keine neue Runtime-Abhängigkeit eingeführt;
- keine kostenpflichtige KI-API, Cloud-Infrastruktur oder versteckte Telemetrie hinzugefügt;
- Protokoll-Baseline bleibt A2A 1.0 → MCP 2026-07-28;
- `handoffprobe@0.1.0` bleibt unverändert.

Detailnachweis: `docs/PHASE8_CONTRIBUTOR_LOOP_20260831.md`.

- [x] 8.6A — re-measure adoption, review findings and choose Phase 9 from evidence

Phase 8.6A Abschlussprotokoll:

- Adoption-Baseline gegen einen neuen Read-only-Snapshot vom 2026-08-31 verglichen;
- Stars/Forks/Subscriber bleiben `0/0/0`;
- GitHub Traffic im rollierenden Fenster: Views `6` / `1` unique, Clones `244` / `103` unique;
- Release-Asset-Downloads bleiben bei `3`;
- npm Download-Punktzähler sind jetzt verfügbar und melden beim Snapshot `142` für last-day, last-week und last-month;
- npm-Zähler werden wegen der zuvor nicht verfügbaren Baseline nicht als numerischer Delta-Wert interpretiert;
- ein externes Research-/Integrationssignal liegt mit Issue `#20` vor;
- externe Pull Requests und externe Code-Contributors bleiben bei `0`;
- öffentliche GitHub-Action-Code-Suche lieferte keinen Treffer, wird wegen Indexierungsgrenzen nicht als Null-Nutzung interpretiert;
- Phase-9-Primärziel aus Evidenz gewählt: Issue `#20` — externe Crossing-Corpus-Conformance-Integration für A2A 1.0 → MCP 2026-07-28;
- der externe Corpus bleibt auf Commit `09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a` und SHA-256 `f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb` gepinnt;
- keine breite spekulative Framework-Expansion beschlossen;
- kein SaaS, keine Accounts, kein Billing, keine bezahlte KI-/Cloud-Pflicht und keine versteckte Telemetrie;
- `handoffprobe@0.1.0` bleibt unverändert.

Detailnachweis: `docs/PHASE8_REVIEW_20260831.md`.

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

Status: active — Phase 9.1 completed 2026-09-02; further expansion remains evidence-gated

Possible integration targets should be chosen from real demand.

## Evidence-selected first target

The Phase 8.6A review selects one narrow first target from current evidence:

- Issue `#20` — external A2A 1.0 → MCP 2026-07-28 crossing-corpus conformance integration;
- pinned corpus commit `09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a`;
- pinned corpus SHA-256 `f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb`;
- HandoffProbe-owned observation path plus an effect recorder outside the verifier;
- deterministic, local and no-paid execution;
- no broad framework expansion until additional demand evidence exists.

This target is an evidence-backed conformance/research integration, not a claim of vulnerability and not permission to broaden the scanner beyond the current handoff-security scope.

Detailed decision: `docs/PHASE8_REVIEW_20260831.md`.

## Phase 9 work packages

- [x] 9.1A — lock the crossing-corpus integration contract
- [x] 9.1B — implement the offline pinned-corpus loader and digest verification
- [x] 9.1C — map external crossing fields and provenance into HandoffProbe-owned observations
- [x] 9.1D — add an external effect recorder and execute the complete 28-case corpus
- [x] 9.1E — produce and validate reviewable external submission artifacts
- [x] 9.1F — publish the evidence outcome, update Issue #20 and review broader adapter demand

## Phase 9.1D / 9.1E completion record — 2026-09-01

Status: **completed**

Detailed evidence record:

`docs/PHASE9_CROSSING_CORPUS_EXECUTION_20260901.md`

### Frozen external input

- upstream repository: `Silentpartnercoding/minority-prophet-border`;
- frozen upstream commit: `09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a`;
- frozen corpus SHA-256: `f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb`;
- A2A Protocol 1.0;
- MCP Protocol 2026-07-28;
- exactly `28` corpus cases.

### Phase 9.1D execution result

The complete pinned corpus now executes through the HandoffProbe-owned
A2A-to-MCP runtime, observation path and effect recorder.

Verified:

- `28 / 28` frozen cases execute in exact corpus order;
- native and bound lanes are measured for every case;
- both lanes use the frozen-contract measurement `externally_observed`;
- `58` attempt-level runtime evidence records are captured;
- caller identity comes from the A2A transport-authentication seam;
- message identity comes from the actual A2A request;
- task and context identity come from the server-resolved crossing context;
- MCP audience comes from the actual transport URL;
- exact tool and arguments are observed immediately before dispatch;
- the authority basis is preserved before runtime mutation;
- the verifier evaluates the actual post-mutation runtime observation;
- replay state is shared across the attempts that require it;
- the effect recorder remains outside the verifier;
- the synthetic MCP receiver contains exactly one productive effect-recording point;
- reference-fixture observed rows never fill HandoffProbe observation gaps.

The bound outcome and reason match the frozen expectation for every case.

The negative cases are expected to discriminate. Successful conformance does
not mean that every bound attempt succeeds. It means that each observed
native/bound result matches the frozen expected behavior.

### Phase 9.1E submission result

The measured implementation and submission generator are bound to:

`a91110245c3932fd98b3156b2595836927566ede`

The exact generated evidence is archived at:

`artifacts/phase9/a2a-mcp-crossing-v2/handoffprobe-a91110245c3932fd98b3156b2595836927566ede/`

The archived execution contains:

- exactly `12` SHA-256-bound required submission artifacts;
- exactly `28` result rows;
- exactly `58` raw attempt-evidence rows;
- submitted grade `implementation_independent`;
- explicit `identified_transformation` adapter evidence;
- caller, audience, authority, status and replay evidence;
- `outside_verifier: true`;
- `production_world_effect: false`.

The recorded effect scope is:

`local_synthetic_mcp_receiver_execution`

It represents HandoffProbe-owned observation of execution in the local
synthetic MCP receiver. It does not claim a production-world or third-party
side effect.

### Frozen intake result

The exact frozen upstream `runner/verify_submission.py` accepted the archived
submission with exit code `0` without `--confirmed-grade`.

Derived summary:

- `submitted_grade = implementation_independent`;
- `confirmed_grade = null`;
- `valid_both = true`;
- `observed_discrimination = true`;
- discriminating cases = `26`;
- `complete_bound_external = true`;
- `complete_external_execution = true`;
- `bound_expectations_match = true`;
- `unmeasured_bound_cases = []`;
- `expectation_mismatches = []`;
- `green_eligible = false`.

`green_eligible = false` is the correct local state. The frozen intake contract
reserves grade confirmation for an external reviewer.

HandoffProbe does not self-assert `confirmed_grade` and does not claim
`operator_independent`.

### Reproducibility checkpoints

- complete 28-case execution:
  `931a0868e4effcb0768169880656b870173f2ffb`;
- attempt-level execution-evidence capture:
  `0ccf24e6387812b324148d03f4bef15a66ad5d1a`;
- submission generator and measured implementation:
  `a91110245c3932fd98b3156b2595836927566ede`;
- archived intake-valid evidence:
  `f5e73c7b194ba0d53a94c85ae79d6338939f63e6`.

Phase 9.1D and Phase 9.1E are complete.

## Phase 9.1F completion record — 2026-09-02

Status: **completed**

The evidence outcome was published back to Issue `#20` after the narrow
issuer-authentication follow-up merged through PR `#32`.

Final implementation/evidence checkpoints:

- measured implementation commit:
  `eba15db3510ef9e5769bf7e81479422c2dc44103`;
- evidence archive commit:
  `284a8af66b6dc5923e8e3e48b45558832fe794ec`;
- PR `#32` merge commit:
  `9fb05a6d07ca5b8efaa6371c30cb8efc759a2ce6`;
- external reviewer confirmation:
  `https://github.com/Heaviside479/handoffprobe/issues/20#issuecomment-5516189138`.

The follow-up adds issuer authentication for both authority stages using
Ed25519 over a domain-separated authority digest and a pinned synthetic issuer
identity, key ID and public key before replay consumption and effect.

The reviewer-requested non-issuer negative control rewrites the authority
chain, recomputes the unkeyed action/authority digests and references, and signs
with a different key while claiming the trusted issuer. The digest-only chain
is internally consistent, but the authenticated path rejects it with
`initial_issuer_authentication_failed` before replay consumption and with
effect delta `0`.

The external reviewer independently reran the measured implementation,
generator and frozen intake, confirmed `67` test files / `352` tests plus
formatting, lint, typecheck, secret scan and build, reproduced `result.json`
and `authority-authentication.json` byte-for-byte, and accepted all `12`
hash-bound artifacts with no unmeasured bound cases or expectation mismatches.

The reviewer explicitly confirmed:

`implementation_independent`

With that narrow external confirmation supplied to the frozen intake, the
profile derives:

`green_eligible = true`

This does not rewrite the earlier self-unconfirmed submission record above.
The archived submission intentionally retained `confirmed_grade = null` and
`green_eligible = false` until an external reviewer supplied the grade
confirmation.

Scope boundaries remain unchanged:

- `operator_independent` is not claimed;
- production-world effect is not claimed;
- restart-durable or multi-process replay protection is not claimed;
- production key management is not claimed;
- the fixed RFC 8032 keys remain non-production test-fixture material.

Broader adapter demand was reviewed again at completion. No additional concrete
open adapter/framework integration request currently justifies expanding the
scanner beyond this evidence-selected A2A 1.0 → MCP 2026-07-28 target.
Additional adapters therefore remain evidence-gated.

Phase 9.1F is complete.

Phase 9.1A contract: `docs/PHASE9_CROSSING_CORPUS_INTEGRATION_SPEC_20260831.md`.

## Principle

Adapters must reuse the same engine.

Do not create independent scanners for every framework.

---

# Release Track R1 — v0.1.1 security maintenance release

Status: **COMPLETED 2026-09-09**

## Goal

Publish the smallest trustworthy maintenance release that supersedes `v0.1.0` without importing unrelated Phase 8/9 work from `main`.

## Source line

Start from the immutable `v0.1.0` release commit:

`90fdd691b390c420e3288383ad7efa7e0fb69e6f`

Create a dedicated maintenance branch from that release line. Do **not** create `v0.1.1` from current `main`.

## Required scope

- [x] update the `v0.1.0` dependency graph so `qs` resolves to a patched version (`>= 6.16.0` for the currently known advisory)
- [x] bump package version from `0.1.0` to `0.1.1`
- [x] update lockfile consistently through npm tooling; no hand-edited fake integrity values
- [x] add a concise `CHANGELOG.md` entry for `0.1.1`
- [x] update release metadata/docs only where required for the new patch version
- [x] preserve the 22-attack corpus and existing CLI/report behavior unless a release-blocking defect requires a separately documented fix
- [x] preserve A2A 1.0 → MCP 2026-07-28 baseline
- [x] preserve report schema `1`
- [x] preserve deterministic exit-code contract
- [x] preserve source-backed GitHub Action behavior

## Verification gate

Before publication, all of the following must pass on the maintenance branch:

- [x] dependency tree verifies that the affected `qs` version is absent
- [x] `npm ci`
- [x] full repository `npm run check`
- [x] `npm run package:check`
- [x] exact tarball inspection
- [x] fresh local install/run from the packed `0.1.1` tarball
- [x] secure target: expected 22 PASS / 0 FAIL / 0 ERROR
- [x] vulnerable representative case: expected security exit `1`
- [x] `--version` reports `0.1.1`
- [x] no secret-safety regression
- [x] no unintended package payload expansion
- [x] PR required checks are green

## Publication gate

- [x] merge only after required PR checks succeed
- [x] create immutable annotated tag `v0.1.1`
- [x] publish npm `handoffprobe@0.1.1`
- [x] verify npm metadata and tarball after publication
- [x] create GitHub release `HandoffProbe v0.1.1`
- [x] verify release asset/provenance checks used by the project
- [x] verify the GitHub Marketplace listing resolves to / presents the patched release as intended
- [x] verify a clean external `npx --yes --package=handoffprobe@0.1.1 handoffprobe test` path
- [x] verify the reusable GitHub Action from the immutable `v0.1.1` release commit in a consumer workflow
- [x] mark `v0.1.1` as the supported `0.1.x` release in public docs where appropriate

## Explicit non-goals

Do not include in `v0.1.1` merely because it exists on current `main`:

- Phase 8 adoption forms/research-loop additions
- Phase 9 crossing-corpus implementation
- new framework adapters
- new attack IDs
- new report/config schema
- new CLI features
- broad documentation rewrites unrelated to the patch
- release-marketing features

## Exit gate

`v0.1.1` is publicly installable, reproducibly verified, uses a patched dependency graph, and the existing `v0.1.0` tag remains untouched.

Only after this exit gate is satisfied does Release Track R2 become active.

## Completion record — 2026-09-09

- the maintenance release was prepared from the immutable `v0.1.0` release line rather than current `main`;
- `handoffprobe@0.1.1` is publicly available from npm with the patched `qs 6.16.0` dependency resolution;
- the canonical publication tarball, npm registry tarball and GitHub release asset were verified against the recorded package integrity and SHA-256 evidence;
- the GitHub release is published as `HandoffProbe v0.1.1`;
- clean external exact-version `npx` version, secure-control and vulnerable-control checks passed;
- the reusable GitHub Action passed in a separate consumer repository using immutable release commit `8e58c2f6553c735bec3857945ca5afde8c8a3177`, with result `pass`, exit code `0` and uploaded report artifact;
- the GitHub Marketplace listing presents `v0.1.1` as Latest, shows the public `handoffprobe@0.1.1` commands and uses the immutable v0.1.1 Action pin;
- public documentation on `main` was reconciled through PR `#40`, merged as `6a3e99aad3f8af0993b8a5291d9070ca9e9d225c`;
- the immutable `v0.1.0` tag and artifact remain untouched;
- release-asset digest and byte-identity checks are recorded; no npm provenance-attestation claim is made;
- `package.json` and `src/index.ts` on the development `main` line intentionally remain at `0.1.0` until controlled v0.2.0 release preparation.

---

# Release Track R2 — v0.2.0 next minor release

Status: **COMPLETED 2026-09-09**

## Goal

Turn the substantial post-`v0.1.0` development already present on `main` into a coherent, supportable public minor release rather than publishing `main` merely because it is newer.

At the 2026-09-08 checkpoint, `main` is 44 commits ahead of `v0.1.0`. That work contains meaningful Phase 8/9 changes and therefore deserves an explicit minor-release audit and scope freeze.

## Source line

After `v0.1.1` is released and verified:

1. return to current `main` as the `v0.2.0` development line;
2. verify `main` still resolves `qs` to a patched version or newer safe replacement;
3. reconcile `v0.1.1` release/changelog history into `main` where needed without introducing a package-version regression;
4. set the package version to `0.2.0` only during the controlled release-preparation work.

Do not mechanically merge a maintenance-branch version bump if it would overwrite newer `main` state. Release history and security fix equivalence must be reconciled deliberately.

## Candidate v0.2.0 value

The strongest current candidate is the evidence-backed post-v0.1 work already developed on `main`, including:

- Phase 8 first-run and GitHub Action adoption improvements;
- opt-in adoption/adapter feedback paths without hidden telemetry;
- reproducible research/contributor improvements;
- the Phase 9 pinned external A2A 1.0 → MCP 2026-07-28 crossing-corpus integration;
- complete 28-case deterministic crossing execution and reviewable evidence;
- issuer authentication and the reviewer-requested non-issuer negative control;
- externally confirmed `implementation_independent` evidence for the narrow Phase 9 integration.

These are **release candidates**, not automatic public claims. The release must distinguish:

- stable HandoffProbe attack corpus (currently 22 stable attacks),
- research/conformance tooling,
- packaged fixtures/artifacts,
- public CLI/API surface.

Phase 9 conformance cases must not be marketed as additional stable attack IDs unless they are explicitly admitted into the attack catalog under the normal attack-definition process.

## R2 work packages

### R2.1 — scope and diff audit

- [x] audit every public/package-relevant change from `v0.1.0`/`v0.1.1` to current `main`
- [x] classify each change as `PUBLIC FEATURE / INTERNAL / RESEARCH / DOCS / FIX / PACKAGE PAYLOAD`
- [x] identify accidental or unnecessary package payload
- [x] confirm all vendored/external fixture licenses and notices remain correct
- [x] freeze the exact `v0.2.0` feature list
- [x] explicitly defer anything that lacks a stable user story

R2.1 completed 2026-09-09. Evidence and frozen scope: `docs/R2_V0_2_0_SCOPE_DIFF_AUDIT_20260909.md`.

### R2.2 — public contract audit

- [x] CLI commands/options compatibility review
- [x] package-root export compatibility review
- [x] config-schema compatibility review
- [x] report-schema compatibility review
- [x] GitHub Action input/output compatibility review
- [x] exit-code compatibility review
- [x] Node/runtime requirement review
- [x] protocol-version baseline review
- [x] redaction/secret-safety review

Any intentional breaking change requires explicit documentation and must be justified for a `0.x` minor release; accidental breaking changes are blockers.

R2.2 completed 2026-09-09. All nine reviewed contracts are compatible; evidence: `docs/R2_V0_2_0_PUBLIC_CONTRACT_AUDIT_20260909.md`.

### R2.3 — productize Phase 9 only where justified

- [x] decide whether crossing-corpus functionality is public CLI/API, packaged research tooling, or maintained internal validation
- [x] expose only a user-facing surface with a clear reason to exist
- [x] document exact scope and limitations
- [x] retain deterministic offline/no-paid execution
- [x] preserve the distinction between conformance evidence and vulnerability claims
- [x] do not claim `operator_independent`, production-world effect, production key management or restart-durable replay protection without new evidence

R2.3 completed 2026-09-09. Phase 9 is frozen as repository research and conformance validation tooling with no new public CLI/API/Action surface; the npm payload is narrowed to the stable release build closure. Evidence: `docs/R2_V0_2_0_PHASE9_PRODUCTIZATION_DECISION_20260909.md`.

### R2.4 — release quality

- [x] all normal CI and dependency review green
- [x] dependency audit contains no known unaddressed Critical/High release blocker
- [x] full deterministic test suite green
- [x] package dry-run and exact tarball inspection green
- [x] clean-clone install/build/run verification
- [x] clean `npx` verification from a local release candidate tarball
- [x] reusable Action consumer verification
- [x] README/INSTALLATION/USAGE/SECURITY/CONTRIBUTING consistent with `0.2.0`
- [x] `CHANGELOG.md` includes `0.1.1` and `0.2.0` accurately
- [x] release notes distinguish fixes, user-facing features, research assets and limitations

R2.4 completed 2026-09-09. All ten release-quality gates are evidenced. The reusable GitHub Action was successfully verified from a separate consumer repository against immutable candidate commit `f38f340f4dcf96464cc8053d67cf5f15563b409a`; consumer PR #3 was closed unmerged after the successful audit. R2.5 — release candidate and publication — is now active. Evidence: `docs/R2_V0_2_0_RELEASE_QUALITY_20260909.md`.

### R2.5 — release candidate and publication

- [x] freeze release candidate commit
- [x] run full release checklist against that exact commit
- [x] create/publish `v0.2.0` only after all gates pass
- [x] verify npm package and GitHub release after publication
- [x] verify GitHub Marketplace listing and public GitHub Action references after publication
- [x] verify exact external install/run path
- [x] collect immediate post-release adoption/error signals without hidden telemetry

R2.5 completed 2026-09-09. The frozen release candidate and exact release checklist passed before publication. Final release commit `b0fc2a8abe1df36e526536d714418a9842be2f77` is the immutable `v0.2.0` release target.

`handoffprobe@0.2.0` is publicly available and verified from the npm registry. The GitHub Release is published and verified. Clean external package installation/run verification passed with exactly 22 stable attacks.

A separate post-publication consumer audit verified both `Heaviside479/handoffprobe@v0.2.0` and immutable release SHA `b0fc2a8abe1df36e526536d714418a9842be2f77`; workflow run `34401248620` succeeded and evidence-only consumer PR #5 was closed unmerged.

The GitHub Marketplace listing was manually verified after publication to present v0.2.0 as the published release.

The immediate telemetry-free signal check found no new GitHub issue or error report after publication. Existing opt-in adoption and adapter-feedback paths remain the signal mechanism. A Peerlist launch is scheduled for 2026-09-14.

Full post-publication evidence: `docs/R2_V0_2_0_POSTPUBLICATION_CLOSEOUT_20260909.md`.

## v0.2.0 exit gate

A developer can understand in a few minutes what changed from `v0.1.x`, install the exact release, reproduce its primary value, and rely on the documented CLI/report/Action contracts without reading Phase 8/9 implementation history.

`v0.2.0` must represent a coherent public product increment, not merely a snapshot of `main`.

Exit gate satisfied 2026-09-09.

## Versioning after v0.2.0

Do not pre-commit to publishing `v0.3.0` or `v0.4.0` simply to fill version numbers. Use SemVer according to the next evidence-backed scope. The Phase 10 `v0.5` label remains a reliability milestone, not an instruction to skip or force intermediate releases.

### Release Track R3 — v0.3.0 semantic-authority release

Status: **COMPLETE — v0.3.0 was published on 2026-09-14 and R3 closed on 2026-09-15 after GitHub Marketplace presentation was re-verified. npm, the immutable annotated tag, GitHub Release, external exact-version execution, external Action verification, both public website surfaces and Marketplace presentation are synchronized.**

The released public version is **v0.3.0**. It ships the T-1 / T1.6 `HP-AUTH-001` semantic-authority refinement as a backward-compatible security-capability improvement.

This does not override the general SemVer rule above:

- do not publish a version merely to advance the version number;
- keep the stable corpus at **22 attacks** unless a separate normal attack-admission decision changes it;
- preserve `HP-AUTH-001` as the stable ID for the semantic-authority refinement;
- `v0.3.1` is reserved for a later patch only if a real patch-level change is required.

R3 proceeded only after the HP-AUTH-001 refinement was merged, the public scope was frozen and the release classification was confirmed.

R3.1 evidence: `docs/R3_V0_3_0_SCOPE_SEMVER_AUDIT_20260914.md`.

R3.2 completed 2026-09-14: the broken published-package `assessment:report` metadata reference was removed while commercial assessment delivery remained repository-only. Package, tarball, test and public-surface verification passed before the release version was synchronized.

R3.2 evidence: `docs/R3_V0_3_0_PACKAGE_METADATA_CLEANUP_CLOSEOUT_20260914.md`.

R3.3A completed 2026-09-14: `package.json`, `package-lock.json`, exported `VERSION` and release-metadata tests were synchronized to `0.3.0`; build and CLI version verification passed.

R3.3B completed the release preparation and publication sequence on 2026-09-14. The final immutable release commit is `ef54b950b3ee333c406fa81087685d7f952a028d`.

Post-publication documentation reconciliation and verification evidence are recorded in `docs/R3_V0_3_0_POSTPUBLICATION_VERIFICATION_20260914.md`.

#### Required release coordination

A version bump must be treated as one controlled public release, not as an isolated `package.json` edit.

Pre-publication gates completed:

- [x] freeze the exact R3 public scope and release commit;
- [x] update `package.json`, `package-lock.json` and any other deliberate version-bearing release metadata consistently;
- [x] update `CHANGELOG.md` and release-facing README / installation / usage documentation where the shipped behavior requires it;
- [x] audit CLI, package-root API, config/report schema, GitHub Action, Node/runtime and protocol-baseline compatibility;
- [x] confirm the stable public attack count and IDs;
- [x] run the full repository checks and dependency/security gates;
- [x] run `npm run package:check` and inspect the exact npm tarball payload;
- [x] verify a fresh local install and exact-version `npx` execution from the release candidate;
- [x] verify the reusable GitHub Action from an external consumer against the exact candidate commit.

Publication and post-publication synchronization:

- [x] create the immutable annotated `v0.3.0` tag only after release gates pass;
- [x] publish `handoffprobe@0.3.0` to npm;
- [x] verify npm metadata, integrity and the published tarball;
- [x] create and verify the GitHub Release `HandoffProbe v0.3.0`;
- [x] verify GitHub Marketplace / reusable Action presentation and release references;
- [x] update the HandoffProbe product/commercial landing page at `https://handoffprobe.heaviside-solutions.com` to the verified v0.3.0 release truth;
- [x] update the HandoffProbe project page on `https://heaviside-solutions.com` so version, capability claims, stable attack count and release links match the verified v0.3.0 release;
- [x] verify both production website surfaces after deployment and record that neither still presents stale v0.2.0 release claims;
- [x] verify a clean external exact-version `handoffprobe@0.3.0` execution path;
- [x] verify the reusable GitHub Action from both the immutable release tag and release commit/SHA in a consumer workflow;
- [x] reconcile all public release documentation and supported-version references;
- [x] record post-publication verification evidence before R3 is considered complete.

R3 exit gate satisfied 2026-09-15. GitHub Marketplace presents HandoffProbe v0.3.0 as Latest and reflects the reconciled published-release README with immutable release SHA `ef54b950b3ee333c406fa81087685d7f952a028d`. npm, GitHub Release, immutable tag, external Action execution, both public website surfaces, Marketplace presentation, documentation and external exact-version verification describe and execute the same released HandoffProbe v0.3.0 version. No half-published release state is accepted.

### Release Track R4 — v0.4.0 HP-AUTH-006 stable-capability release

Status: **COMPLETE — v0.4.0 coordinated publication and post-publication verification closed on 2026-09-17.**

R4 exists because a separate post-T-3 admission review converted the V13 research candidate into a real backward-compatible public capability:

- new stable ID: `HP-AUTH-006 — Stale task authorization reused for later effect`;
- v0.4.0 stable corpus: **23 attacks** = 12 P0 + 10 P1 + 1 advanced;
- default CLI full-corpus execution includes `HP-AUTH-006`;
- the reusable GitHub Action consumes the same canonical 23-attack catalog;
- secure/vulnerable fixtures reproduce the intended PASS/FAIL distinction deterministically.

R4 does not mechanically promote all T-3 work. V3 remains `NO ADD`; the `#2079` stream remains an `HP-AUTH-001` refinement; T-2.7/Bayu remains independent; T-4 work is not part of the v0.4.0 shipped capability.

Evidence:

- R4.1 scope/SemVer audit: `docs/R4_V0_4_0_SCOPE_SEMVER_AUDIT_20260916.md`;
- R4.2 version synchronization: `docs/R4_V0_4_0_VERSION_SYNC_20260916.md`;
- attack admission: `docs/V0_4_0_ATTACK_ADMISSION_20260916.md`;
- v0.4.0 release record: `docs/V0_4_0_RELEASE_NOTES.md`;
- post-publication closeout: `docs/R4_V0_4_0_POSTPUBLICATION_CLOSEOUT_20260917.md`.

Required sequence:

- [x] R4.1 freeze evidence-backed scope and classify as backward-compatible minor `v0.4.0`;
- [x] R4.2 synchronize package, lockfile, exported source version and version tests to `0.4.0`;
- [x] R4.3 reconcile candidate README, installation, usage, changelog, attack catalog, CLI specification, roadmap and release notes;
- [x] run full repository, package, tarball and exact local candidate gates after documentation reconciliation;
- [x] freeze and merge the exact release candidate through protected PR checks;
- [x] create annotated `v0.4.0` tag only from the verified merged release commit;
- [x] publish `handoffprobe@0.4.0` to npm and verify metadata/integrity/tarball;
- [x] create and verify GitHub Release `HandoffProbe v0.4.0`;
- [x] verify/update GitHub Marketplace / reusable Action presentation;
- [x] update `https://handoffprobe.heaviside-solutions.com` only after public v0.4.0 availability is verified;
- [x] update the HandoffProbe project page on `https://heaviside-solutions.com` to the same verified release truth;
- [x] verify clean external exact-version npm execution;
- [x] verify external GitHub Action execution from both tag and immutable release SHA;
- [x] reconcile public release documentation from candidate wording to published wording;
- [x] close R4 only when every public surface describes the same verified release.

R4 closeout is complete. T-4.1 is now unblocked as the next queued research step. This does not change the completed T-3 closeout record, does not retroactively place T-4 inside v0.4.0, and does not change the independent T-2.7/Bayu wait.

---

# Phase 10 — v0.5 reliability hardening

Status: **COMPLETE — reliability hardening closed 2026-09-20.**

## Goal

Turn the released v0.3.0 Core into dependable, version-aware developer infrastructure.

Phase 10 hardens compatibility, public contracts, determinism, diagnostics, performance and CI reliability. Phase 10 itself does not expand the stable corpus; a separate R4 evidence-backed admission expanded the v0.4.0 stable corpus from 22 to 23 attacks by admitting `HP-AUTH-006`.

## Release sequencing

The `v0.5` label is a reliability milestone, not an instruction that the next npm release must be `0.5.0`.

Do not create `v0.4.0`, `v0.5.0` or any other release merely to match roadmap numbering. An intermediate patch or minor release must have an evidence-backed scope, correct SemVer classification and its own controlled release track.

Already-published tags and artifacts remain immutable.

## Work packages

### P10.1 — compatibility baseline

Status: **COMPLETE — 2026-09-15**

- [x] define the supported Node/runtime compatibility matrix;
- [x] define the A2A 1.0 → MCP 2026-07-28 fixture/version matrix;
- [x] document the current macOS and Linux support baseline;
- [x] determine the practical Windows support baseline;
- [x] review upstream A2A/MCP specification drift since the pinned baseline;
- [x] record exact compatibility promises, tested combinations and explicit non-promises.

Evidence: `docs/P10_1_COMPATIBILITY_BASELINE_20260915.md`.

Exit gate satisfied 2026-09-15: the supported compatibility baseline is explicit, reproducible and reviewable without relying on undocumented assumptions.

### P10.2 — versioned contracts and compatibility policy

Status: **COMPLETE — 2026-09-15**

- [x] formalize the versioned report schema;
- [x] formalize the versioned config schema;
- [x] define backward-compatibility policy;
- [x] define test deprecation policy;
- [x] define migration expectations for future schema or CLI changes.

Evidence: `docs/P10_2_VERSIONED_CONTRACTS_POLICY_20260915.md`.

Exit gate satisfied 2026-09-15: future changes can be classified as compatible, deprecated or breaking before publication.

### P10.3 — determinism, diagnostics and performance

- [x] define deterministic seed handling where randomized coverage is introduced;
  - Evidence: `docs/P10_3_DETERMINISM_BASELINE_20260915.md`.
- [x] add reproducible performance benchmarks;
  - Evidence: `docs/P10_3_PERFORMANCE_BENCHMARK_20260919.md` and `scripts/p10-performance-benchmark.ts`; first full-corpus baseline recorded on 2026-09-19.
- [x] add concurrency tests;
  - Evidence: `docs/P10_3_CONCURRENCY_20260919.md` and `tests/p10-concurrency.test.ts`; concurrent race and full-corpus isolation validated on 2026-09-19.
- [x] harden structured diagnostic logs;
  - Evidence: `docs/P10_3_STRUCTURED_DIAGNOSTICS_20260919.md` and `tests/p10-structured-diagnostics.test.ts`; deterministic secret-safe structured runtime diagnostics validated on 2026-09-19.
- [x] expand redaction regression tests;
  - Evidence: `docs/P10_3_REDACTION_REGRESSION_20260919.md` and `tests/p10-redaction-regression.test.ts`; nested, normalized, inline, false-positive and idempotence redaction cases validated on 2026-09-19.
- [x] document benchmark environment and acceptable variance.
  - Evidence: `docs/P10_3_PERFORMANCE_BENCHMARK_20260919.md`; three independent same-machine sessions established an advisory 15% local variance envelope on 2026-09-19.

Exit gate satisfied 2026-09-19: repeated runs remain trustworthy under load, concurrency and diagnostic failure conditions, with benchmark environment and same-machine variance explicitly documented.

### P10.4 — CI and platform reliability

- [x] enforce Linux CI coverage;
  - Evidence: `.github/workflows/ci.yml` runs `ubuntu-latest` with Node 24 and executes `npm run check` plus `npm run package:check`; `docs/INSTALLATION.md` and the P10.1 compatibility baseline record Linux as CI-verified.
- [x] add macOS CI coverage;
  - Evidence: `docs/P10_4_MACOS_CI_20260919.md`; PR #141 validated both `Quality (macos-latest)` and `Quality (ubuntu-latest)` successfully with Node 24 on 2026-09-19.
- [x] add Windows CI where practical and explicitly document exclusions where not;
  - Evidence: `docs/P10_4_WINDOWS_CI_20260919.md`; PR #142 validated
    `Quality (windows-latest)`, `Quality (macos-latest)` and
    `Quality (ubuntu-latest)` successfully after explicit LF checkout
    normalization on 2026-09-19. Native Windows compatibility for the reusable
    composite GitHub Action remains explicitly unclaimed because it uses
    `shell: bash`.
- [x] define the dependency upgrade process;
  - Evidence: `docs/P10_4_DEPENDENCY_UPGRADE_PROCESS_20260919.md` defines
    discovery, classification, exact-pin/lockfile handling, protocol-sensitive
    review, local validation, required CI admission and rollback.
    `.github/dependabot.yml` adds weekly npm and GitHub Actions update discovery
    without auto-merge authorization.
- [x] ensure compatibility-matrix checks fail visibly on unsupported drift.
  - Evidence: `compatibility-matrix.json`,
    `scripts/compatibility-matrix-check.ts` and
    `tests/p10-compatibility-drift-gate.test.ts` pin the supported Node, CI
    platform, A2A/MCP and protocol-SDK baseline and emit explicit diagnostics
    for unsupported drift. `npm run compatibility:check` is part of
    `npm run check`; PR #151 passed HandoffProbe, Dependency Review and
    Linux/macOS/Windows Quality admission checks on 2026-09-20.

Exit gate: every claimed supported platform and runtime combination has an explicit verification path.

Exit gate satisfied 2026-09-20: Linux, macOS and Windows quality jobs verify the pinned Node 24 compatibility baseline, and unsupported runtime, platform, protocol, protocol-SDK or documented compatibility drift now fails visibly through the normal repository check.

### Repository cleanup and current-state reconciliation — 2026-09-18

Status: **COMPLETE — Cleanup A through Cleanup E completed 2026-09-19.**

Persistent execution plan:

`docs/REPOSITORY_CLEANUP_PLAN_20260918.md`

This track is part of Phase 10 repository reliability/hygiene and is intentionally
non-product-expanding.

Completed:

- [x] read-only whole-repository audit;
- [x] classify remote branch inventory;
- [x] delete 27 remote branches already fully merged into `main`;
- [x] preserve 16 divergent branches for individual review;
- [x] close obsolete PR #72 without merge;
- [x] verify no open pull requests remain after Cleanup A.

Cleanup record and deferred follow-through:

- [x] reconcile active documentation with the current v0.4.0 / 23-attack truth;
- [x] compact the root README by removing duplicated long-form material while
      preserving quick start, current release truth, safety, Action, evidence and
      commercial CTA;
- [x] reconcile `PROJECT_CONTEXT.md`, `AGENTS.md`, `CONTRIBUTING.md` and
      `SECURITY.md` with the current v0.4.0 / 23-attack product state and real
      repository quality gates;
- [x] reconcile `docs/ARCHITECTURE.md`, `docs/PRODUCT.md`,
      `docs/ROADMAP_COMMERCIAL_PRODUCT_TRACK_20260916.md` and `CHANGELOG.md`
      with current product, commercial and release truth;
- [ ] rely on that same root README for npm presentation at the next otherwise
      justified normal release; do not publish a release solely for README cleanup;
- [x] add a documentation navigation/index layer rather than mass-moving historical
      research files;
- [x] audit all 16 divergent branches individually before any further deletion;
- [x] reconcile stale issue #38 against completed T-2.1–T-2.6 and pending T-2.7;
- [x] reconcile already-satisfied Phase 10 documentation/CI checkboxes where current
      repository evidence supports completion;
- [x] run full repository and package gates before cleanup closeout.

Cleanup must preserve historical research provenance, stable attack identity,
release immutability and evidence-level discipline.

The cleanup itself does not authorize a new stable attack, version bump, release,
protocol-baseline change or runtime behavior change.

### P10.5 — reliability closeout

Status: **COMPLETE — 2026-09-20**

- [x] run the complete repository quality and security gates;
  - Evidence: 117 test files / 582 tests, compatibility check and build passed
    on the merged Phase 10 base with no worktree drift.
- [x] run package validation and exact payload inspection;
  - Evidence: `handoffprobe@0.4.0` dry-run payload contains exactly 295 allowed
    files with no forbidden repository material and no generated tarball left behind.
- [x] verify compatibility and fixture matrices against recorded evidence;
  - Evidence: compatibility matrix passed; the frozen Phase 9 corpus retained
    its recorded SHA-256, all 14 manifest file digests and all 28 case identities.
- [x] reconcile README, installation, usage, security and contributor documentation;
  - Evidence: current release, 23-attack corpus, protocol/runtime baseline,
    Action pin, CLI and safety/contributor contracts are mutually consistent.
- [x] decide from completed scope whether a public patch/minor release is justified;
  - Decision: **NO PUBLIC RELEASE JUSTIFIED**. The only runtime source change
    since v0.4.0 is compatible internal structured diagnostic hardening and does
    not change documented CLI behavior, schemas, attack corpus or protocol contract.
- [x] create a separate controlled release track if publication is justified.
  - Not triggered: publication is not justified by this closeout scope, so no
    release track is created.

Evidence: `docs/P10_5_RELIABILITY_CLOSEOUT_20260920.md`.

## Phase 10 exit gate

HandoffProbe behaves like dependable developer infrastructure rather than a research prototype.

Compatibility promises are explicit, public contracts are version-aware, supported environments are reproducibly tested, diagnostics remain safe, and reliability claims are backed by recorded evidence.

Phase 10 exit gate satisfied 2026-09-20: the complete reliability scope is
evidence-backed and validated, while release discipline correctly leaves the
verified public version at `handoffprobe@0.4.0` until a separately justified
release scope exists.

---

# Phase 11 — v0.9 release engineering

Status: **ACTIVE — release engineering started 2026-09-20.**

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

### P11.1 — non-publishing release-candidate automation

Status: **COMPLETE — 2026-09-20**

- [x] define a dedicated Release Candidate workflow;
- [x] keep repository permissions read-only;
- [x] prohibit npm publication, tag creation and GitHub Release creation;
- [x] run the complete repository quality gates before packaging;
- [x] build an actual npm tarball only in runner temporary storage;
- [x] inspect the release payload for required and forbidden material;
- [x] install and execute the exact candidate tarball in a clean temporary project;
- [x] pass the workflow on its protected implementation pull request;
  - Evidence: PR #153 passed all six checks, including `Release Candidate`.
- [x] merge the workflow through normal branch protection;
  - Evidence: PR #153 merged as
    `5b48eb953a3005b338208896a607fa7e7afb37a3`.
- [x] verify the workflow from `main`.
  - Evidence: workflow run `35501202431` completed successfully on that exact
    `main` commit.

Evidence: `docs/P11_1_RELEASE_CANDIDATE_AUTOMATION_20260920.md`.

This first Phase 11 slice automates candidate validation only. It does not
authorize or perform publication and does not change `handoffprobe@0.4.0`.

### P11.2 — npm stage-only publication workflow

Status: **COMPLETE — 2026-09-20**

- [x] declare HandoffProbe as npm dual-use content;
- [x] include a root `DISCLOSURE` file in the npm package;
- [x] require `DISCLOSURE` in Release Candidate payload validation;
- [x] define a manual, `main`-only npm staging workflow;
- [x] pin an npm CLI version with staged-publishing support;
- [x] use GitHub OIDC instead of a long-lived npm publication token;
- [x] allow CI to run only `npm stage publish`;
- [x] prohibit direct `npm publish` and stage approval from CI;
- [x] keep the current public package at `handoffprobe@0.4.0`;
- [x] pass the implementation through protected pull-request validation;
  - Evidence: PR #155 passed all required protected checks.
- [x] merge the implementation through normal branch protection;
  - Evidence: PR #155 merged as
    `d60bf3d79a83fb1f5fdcd7ec7b397c5ad613ef89`.
- [x] configure npm trusted publishing for `npm-stage.yml` with stage-only permission;
  - Read-back: GitHub repository `Heaviside479/handoffprobe`, workflow
    `npm-stage.yml`, permission `createStagedPackage`.
- [x] read back and verify the exact npm trusted-publisher relationship;
  - Verified with npm `11.19.1`; trust command exit code `0`.
- [x] require 2FA and disallow traditional publication tokens for the package.
  - npm Publishing access is set to `Require two-factor authentication and disallow tokens`.

Evidence: `docs/P11_2_NPM_STAGE_PUBLICATION_20260920.md`.

No package was staged as part of P11.2 validation. Final npm verification
returned an empty staged-package list, while public `latest` remained
`handoffprobe@0.4.0`.

The first live stage requires a separately admitted future release version.

### P11.3 — reproducible release artifact validation

Status: **COMPLETE — 2026-09-20**

- [x] define the reproducibility boundary as isolated repeated builds of the
      exact candidate commit inside one Release Candidate environment;
- [x] create two independent source trees from the exact `GITHUB_SHA`;
- [x] run independent `npm ci` and `npm pack` operations;
- [x] compare SHA-256 digests of both rebuilt npm tarballs;
- [x] require both rebuilt tarballs to be byte-identical;
- [x] require the normal Release Candidate tarball to match the isolated rebuild;
- [x] compare sorted npm package manifests;
- [x] keep publication, staging, version changes and release creation outside
      this gate;
- [x] pass the implementation through protected pull-request validation;
  - Evidence: PR #161 passed all six checks, including the Release Candidate gate.
- [x] merge the implementation through normal branch protection;
  - Evidence: PR #161 merged as
    `a50938eec77108fa4d2640109cc069c19001bc28`.
- [x] verify the reproducibility gate from merged `main`.
  - Evidence: workflow run `35520070640` succeeded on the exact merged
    `main` commit and produced identical candidate/rebuild SHA-256 values.

Evidence: `docs/P11_3_REPRODUCIBLE_RELEASE_ARTIFACT_20260920.md`.

The local feasibility probe produced two byte-identical `handoffprobe@0.4.0`
tarballs from separate clean source trees. P11.3 promotes that property into a
mandatory Release Candidate gate.

### P11.4 — release SBOM and provenance boundary

Status: **COMPLETE**

- [x] define the release SBOM as SPDX 2.3 for the package-lock runtime graph;
- [x] omit development-only dependencies from the release SBOM;
- [x] verify required direct runtime packages are represented;
- [x] identify raw npm SBOM nondeterminism as `creationInfo` and
      `documentNamespace`;
- [x] preserve npm-generated SPDX document identity and creation metadata;
- [x] derive a deterministic dependency comparison projection that excludes only
      `creationInfo.created` and `documentNamespace`;
- [x] pin Release Candidate npm to `11.19.1`, matching the stage workflow;
- [x] generate two release SBOMs and require their dependency comparison
      projections to be byte-identical;
- [x] retain the merged-main SBOM as a short-lived workflow artifact;
- [x] keep npm publication provenance tied to the actual Trusted Publishing
      path rather than temporary candidate artifacts;
- [x] keep staging, publication, tag creation and GitHub Release creation
      outside this gate;
- [x] pass the implementation through protected pull-request validation;
- [x] merge the implementation through normal branch protection;
- [x] verify release-SBOM generation and the deterministic dependency fingerprint from merged `main`.

Evidence: `docs/P11_4_RELEASE_SBOM_PROVENANCE_20260920.md`.

The first future public package after `0.4.0` must separately verify the npm
provenance produced by its real Trusted Publishing path.

### P11.5 — release user guidance

Status: **COMPLETE — 2026-09-20**

- [x] provide a dedicated user-facing upgrade guide;
- [x] provide a dedicated migration guide grounded in the versioned-contract policy;
- [x] provide a dedicated troubleshooting guide;
- [x] provide a product and usage FAQ;
- [x] keep current `handoffprobe@0.4.0` compatibility and release facts explicit;
- [x] link the guides from the root README and documentation index;
- [x] cross-link the guides from installation and usage documentation;
- [x] add automated documentation coverage for guide presence, navigation and release boundaries;
- [x] pass protected pull-request validation;
  - Evidence: PR #166 head `ee9a16b14b92c90de378539f9ffd66c8216bec81`
    passed HandoffProbe, Dependency Review, Release Candidate and all three
    platform Quality jobs.
- [x] merge through normal branch protection.
  - Evidence: PR #166 merged to `main` as
    `bcdd4b0129b470f9c3a37620298c269f7f680235` on 2026-09-20.

Evidence: `docs/P11_5_RELEASE_USER_GUIDANCE_20260920.md`.

P11.5 changes documentation and documentation regression coverage only. It does
not change the package version, runtime behavior, stable attack corpus,
protocol baseline or publication state.

### P11.6 — external feedback round

Status: **ACTIVE — fresh external feedback pending**

- [x] open a dedicated public Phase 11 feedback thread for `handoffprobe@0.4.0`;
  - Evidence: GitHub issue #168.
- [x] request fresh feedback on installation, quick start, CLI/exit semantics,
      GitHub Action guidance and the new release user guides;
- [x] keep historical Phase 8/9 external review separate from this fresh round;
- [x] define explicit feedback classification and release boundaries;
- [x] record silence as `PENDING`, not validation;
- [ ] receive and triage fresh external feedback, or close a clearly bounded
      no-response outcome without treating silence as approval;
- [ ] resolve or explicitly block on any fresh Critical or High HandoffProbe
      defect discovered by the round;
- [ ] close the round with evidence through protected pull-request validation.

Evidence: `docs/P11_6_EXTERNAL_FEEDBACK_ROUND_20260920.md`.

P11.6 does not change `handoffprobe@0.4.0`, runtime behavior, the stable attack
corpus, protocol baseline or publication state.

External-wait execution rule:

- P11.6 may remain `PENDING` while Phase 12 internal engineering continues;
- P11.6 does not block P12.1 through the internal GA-candidate work;
- a later external response is triaged when it arrives rather than requiring the
  repository to remain idle;
- silence must still be closed only as an explicitly bounded `NO RESPONSE`
  outcome, never as successful validation;
- any reproducible fresh Critical or High HandoffProbe defect immediately
  blocks release progression until resolved or explicitly dispositioned;
- P11.6 must be closed before final v1.0 GA authorization.

## Exit gate

No known Critical or High HandoffProbe defect.

Public interfaces intended for v1 are frozen.

---

# Phase 12 — HandoffProbe v1.0 GA

Status: **ACTIVE — GA preparation in progress; v1.0 is not authorized**

Current public release remains `handoffprobe@0.4.0`.

Phase 12 is the technical path from the proven v0.4.0 product to a dependable
v1 contract. It does not require artificial intermediate npm releases.

Implementation baseline:

`docs/P12_1_GA_READINESS_AUDIT_20260921.md`

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

## P12.1 — GA readiness audit

Status: **COMPLETE — merged through protected PR #171 on 2026-09-21**

Completed locally on 2026-09-21:

- [x] audit all 15 GA requirements against current repository evidence;
- [x] preserve public `handoffprobe@0.4.0`;
- [x] run the complete current repository gate;
- [x] pass 126 test files / 633 tests;
- [x] pass package dry-run;
- [x] verify built CLI `0.4.0`;
- [x] verify secure stable corpus at 23 PASS / 0 FAIL / 0 ERROR;
- [x] verify config schema `1`;
- [x] verify report schema `1`;
- [x] keep the worktree clean after the execution baseline;
- [x] identify real GA gaps without converting them into assumed completion;
- [x] complete roadmap reconciliation;
- [x] pass complete repository validation after reconciliation;
- [x] merge through protected pull-request admission; PR #171 merged as `975591f96a8115b3b8f055915e3c8efb1f2ef66a`.

Evidence:

`docs/P12_1_GA_READINESS_AUDIT_20260921.md`

## P12.2 — current threat model and limitations contract

Status: **COMPLETE — merged through protected PR #172 on 2026-09-21**

This work does not depend on external replies.

- [x] reconcile historical v0.1-only wording in `docs/THREAT_MODEL.md`;
- [x] review every current threat class against the actual 23-attack product;
- [x] retain the A2A 1.0 -> MCP 2026-07-28 supported boundary accurately;
- [x] reconcile later research-derived threat-model additions;
- [x] distinguish stable product guarantees from research observations;
- [x] create one current user-facing limitations contract;
- [x] distinguish bundled synthetic validation from production-world validation;
- [x] distinguish composition testing from generic A2A/MCP conformance;
- [x] state runtime, platform and protocol limitations explicitly;
- [x] state what HandoffProbe does not certify or guarantee;
- [x] preserve authorized-use and safe-default requirements;
- [x] add regression tests for current threat-model and limitations claims.

Validation / admission:

- [x] pass focused P12.2 and documentation-index regression;
- [x] pass complete repository validation;
- [x] pass package validation;
- [x] merge through protected pull-request admission; PR #172 merged as `e426d761dd245dc9c8ce2a6f96c3023170c387f7`.

Evidence: `docs/P12_2_THREAT_MODEL_LIMITATIONS_20260921.md`.

Exit gate:

A new user can determine exactly what HandoffProbe tests, what it does not test,
what environments are supported, and which security claims the product does not
make.

## P12.3 — v1 public-contract freeze

Status: **COMPLETE — merged through protected PR #173 on 2026-09-22**

This work does not depend on external replies.

Explicitly inspect every intended v1 public surface:

- [x] Core/package-root exports;
- [x] CLI commands;
- [x] CLI options and defaults;
- [x] exit semantics `0 / 1 / 2 / 3`;
- [x] config schema version `1`;
- [x] JSON report schema version `1`;
- [x] stable finding/status/severity semantics;
- [x] GitHub Action inputs;
- [x] GitHub Action outputs;
- [x] stable `HP-*` identifiers and their security meaning;
- [x] Node.js compatibility contract;
- [x] A2A/MCP protocol compatibility contract;
- [x] release/tag immutability expectations.

For every surface, record one result:

- `FREEZE FOR V1`;
- `CHANGE BEFORE V1`;
- `NOT PUBLIC V1 CONTRACT`.

Any `CHANGE BEFORE V1` item requires compatibility classification, migration
guidance and regression coverage before the freeze completes.

Decision result:

- 13 / 13 listed public surfaces: `FREEZE FOR V1`;
- 0: `CHANGE BEFORE V1`;
- 0: `NOT PUBLIC V1 CONTRACT`.

Evidence: `docs/P12_3_V1_PUBLIC_CONTRACT_FREEZE_20260921.md`.

Validation / admission:

- [x] pass focused P12.3 contract regression;
- [x] pass complete repository validation;
- [x] pass package validation;
- [x] merge through protected pull-request admission; PR #173 merged as `cc15661e9cdf5b77c3ff62599f2fbf5282f67d6c`.

Exit gate:

All intended v1 public interfaces have an explicit evidence-backed stability
decision.

## P12.4 — internal GA hardening and backlog disposition

Status: **COMPLETE**

This work continues even if P11.6 or other external threads remain `PENDING`.

- [x] run a package-root API stability audit;
- [x] add regression coverage for the frozen v1 public surface where gaps exist;
- [x] audit CLI/Action contract parity;
- [x] audit current package payload and public exports;
- [x] reconcile compatibility documentation with the v1 freeze;
- [x] review all deferred advanced attack candidates;
- [x] review current research queues for any issue that is genuinely required
      before GA;
- [x] classify each relevant candidate as `PRE-GA REQUIRED`, `POST-GA`,
      `RESEARCH ONLY` or `NO ADD`;
- [x] implement only evidence-backed pre-GA requirements;
- [x] do not inflate the stable corpus merely to make v1 appear larger;
- [x] rerun determinism, concurrency, redaction, performance and platform gates;
- [x] verify no known Critical or High HandoffProbe defect remains.

Disposition:

- 0 `PRE-GA REQUIRED`;
- 6 deferred backlog candidates classified `POST-GA`;
- 2 deferred backlog candidates classified `RESEARCH ONLY`;
- current reproduced research queues classified `NO ADD`;
- stable corpus remains 23 attacks;
- package remains `0.4.0`.

Evidence: `docs/P12_4_GA_HARDENING_BACKLOG_20260922.md`.

Protected admission record:

- PR `#175`;
- candidate head `d80be8e5036512009ff6e40d4089d07719c1f094`;
- protected merge commit `5ec9d06057b1a17ad3d299d79c9105a964018c0e`;
- Dependency Review passed;
- HandoffProbe passed;
- Release Candidate passed;
- CI passed.

Validation / admission:

- [x] pass focused P12.4 regression;
- [x] pass complete repository validation;
- [x] pass package validation;
- [x] merge through protected pull-request admission.

A separately admitted backward-compatible public capability discovered here may
justify a pre-GA minor release such as `0.5.0`. Documentation, CI or release
hardening alone does not.

## P12.5 — GA candidate and live release-engineering proof

Status: **IN PROGRESS — candidate / reproducibility / SBOM / external consumer / user-guidance / prerelease decision complete**

Prerequisite: internal technical GA gates P12.2 through P12.4 are green.

This work may proceed while the asynchronous external-use gate is still
collecting evidence.

- [x] freeze the exact candidate commit;
- [x] run the Release Candidate workflow from the exact candidate;
- [x] reproduce byte-identical candidate npm artifacts;
- [x] generate and verify the release SBOM;
- [ ] exercise the real npm stage / Trusted Publishing path with a release
      version that has been separately authorized;
- [ ] verify npm provenance from the real publishing path;
- [x] install and execute the exact candidate externally;
- [x] verify the reusable GitHub Action externally from the candidate identity;
- [x] verify upgrade/migration/troubleshooting guidance against the candidate;
- [x] decide whether prerelease publication materially improves final validation.

Current candidate proof:

- frozen candidate: `63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`;
- Release Candidate workflow run: `35769245125` — success;
- byte-identical candidate / rebuild SHA-256: `00c2bfd715cd3b7634c299ef1656ba39a477597023533c4be1d0b13fb79b27ad`;
- release SBOM SHA-256: `e9c4bca76dab4c7a437f5a1726a81d12aa196d9565f4a2cc8d62063c28c9ada0`;
- deterministic dependency fingerprint: `d23f8358252fd51097bbbb582803fa050aa8476c84d645a1a4c90af992db5d10`;
- retained SBOM artifact ID: `10713541739`;
- independent retained-artifact verification: passed;
- exact-candidate external consumer install: passed with 23 PASS / 0 FAIL / 0 ERROR;
- external reconstructed tarball matched the Release Candidate SHA-256 exactly;
- separate consumer Action audit: PR `#10`, run `35772627004`, job `106897794363` — success;
- external Action report artifact ID: `10714971132`;
- package remains `0.4.0`;
- stable corpus remains 23 attacks;
- no npm stage, publication, version change, tag or GitHub Release has been authorized or performed.

Evidence: `docs/P12_5_GA_CANDIDATE_PROOF_20260922.md`.

Prerelease decision completed 2026-09-23:

- an evidence-backed `1.0.0-rc.1` materially improves final validation;
- its purpose is real registry installation, CI, integration, Trusted Publishing and provenance validation before v1 GA;
- it remains a prerelease and does not waive P11.6 or P12.6;
- the decision does not itself authorize a version change, npm stage, npm publication, tag or GitHub Release;
- the concrete prerelease version transition remains a separately controlled step.

Further candidate fixes may use `1.0.0-rc.2`, `1.0.0-rc.3`, and so on when
SemVer prerelease progression is appropriate.

## P12.6 — asynchronous external-use and adoption evidence

Status: **ACTIVE IN PARALLEL**

This lane must be worked, but it must not leave internal development idle.

Qualifying evidence must be defined and recorded without turning platform
counters into fictional users.

Potential qualifying evidence includes independently attributable use such as:

- an external developer running the package and reporting concrete results;
- an external repository integrating the Action or CLI;
- a real authorized assessment where HandoffProbe Core is actually used;
- repeat use by an external developer or organization;
- an external integration request backed by real implementation/use context.

The following are signals but are not sufficient by themselves:

- npm downloads;
- GitHub clones;
- page views;
- stars;
- an unanswered outreach message;
- general praise;
- technical discussion with no demonstrated product use.

Tasks:

- [ ] define the minimum GA evidence threshold;
- [ ] continue targeted, non-spammy external onboarding;
- [ ] make the current exact-version or RC path easy to reproduce;
- [ ] capture qualifying evidence with source and scope;
- [ ] distinguish reviewers, researchers, users and paying customers;
- [ ] feed reproducible defects back into the technical spine immediately;
- [ ] keep `PENDING` external threads asynchronous.

If this evidence is not yet sufficient when the internal candidate is ready,
continue product development, research and commercial validation rather than
fabricating GA readiness.

## P12.7 — final GA decision and coordinated publication

Status: **PENDING**

This is the only Phase 12 gate that authorizes final `1.0.0`.

Before GA:

- [ ] P11.6 is closed with honest external-response disposition;
- [ ] every Phase 12 GA requirement has explicit evidence;
- [ ] the v1 public-contract freeze is complete;
- [ ] the current threat model and limitations contract are complete;
- [ ] the required external-user evidence threshold is satisfied;
- [ ] release automation and real publication provenance are proven;
- [ ] no known Critical or High HandoffProbe defect remains;
- [ ] full repository, package, security and compatibility gates pass;
- [ ] exact GA package payload is inspected;
- [ ] final release notes and migration guidance are complete;
- [ ] exact release commit is frozen.

Then make a fresh scope/SemVer decision.

Possible results include:

- continue prerelease validation;
- publish a justified pre-v1 minor if new public capability requires it;
- authorize `1.0.0`.

If `1.0.0` is authorized, coordinate:

- npm;
- immutable annotated tag;
- GitHub Release;
- reusable GitHub Action / Marketplace presentation;
- dedicated HandoffProbe site;
- Heaviside Solutions project page;
- exact-version external npm verification;
- external Action verification;
- post-publication evidence.

No half-published GA state is accepted.

## Phase 12 execution rule

Do not stop internal development merely because an external response is
pending.

Do not ship v1.0 because of time, roadmap numbering or marketing pressure.

Continue internal engineering, research and commercial validation whenever
their own gates are satisfied.

Ship v1.0 only when external users can reasonably depend on the accepted v1
contract and every final GA gate has evidence.

---

# Phase 13 — Commercial validation

Status: **ACTIVE from 2026-09-12** — runs in parallel with continued open-source adoption and technical maturation; it does not require waiting for v1.0 GA.

Phase 13 does not block Phase 12 internal engineering, and Phase 12 does not
require Phase 13 revenue completion.

A real customer assessment may contribute to Phase 12 external-use evidence
only when HandoffProbe Core is actually used and the evidence can be recorded
without exposing customer secrets. Commercial interest by itself is not a GA
adoption claim.

Implementation contract:

`docs/COMMERCIAL_VALIDATION_SPEC_20260912.md`

## Goal

Validate willingness to pay around the free open-source Core without creating a paid CLI tier or speculative SaaS product.

The first revenue path is a tightly scoped, authorized professional service applying HandoffProbe to a real agent-handoff boundary.

## Commercial surface

- product/commercial subdomain: `https://handoffprobe.heaviside-solutions.com`;
- primary conversion page: `https://handoffprobe.heaviside-solutions.com/security-assessment`;
- GitHub remains the canonical source repository;
- npm remains the canonical package/install surface;
- the open-source Core remains free under Apache-2.0.

## Primary launch offer

### HandoffProbe Founding Security Assessment

Launch price hypothesis:

**EUR 1,490 for each of the first 3 accepted assessments.**

Standard scope:

- one clearly defined authorized agent/tool handoff boundary;
- architecture/handoff review;
- relevant deterministic HandoffProbe testing;
- manual handoff/composition analysis;
- evidence-backed findings and severity;
- technical remediation guidance;
- detailed written report;
- one remediation retest;
- asynchronous communication by email.

Default result delivery is written rather than meeting-based:

- PDF report;
- Markdown report;
- optional safe machine-readable HandoffProbe JSON where appropriate.

There is no mandatory sales call and no mandatory results call.

Initial working delivery target: within 5 business days after payment and after all agreed test prerequisites are available. Treat this as a validation target until measured delivery data exists.

## Conversion flow

```text
GitHub / npm / Peerlist / AlternativeTo / technical discussions
                         |
                         v
        handoffprobe.heaviside-solutions.com
                         |
                         v
             Security Assessment page
                         |
                         v
                  Request form
                         |
                         v
              Qualified written scope
                         |
                         v
               Stripe payment link
                         |
                         v
                  Paid assessment
                         |
                         v
              Written report + retest
                         |
                         v
     Adapter / private pack / extended work if needed
```

Payment is requested only after the scope has been reviewed and accepted. Standard Founding Assessments are paid 100% before assessment work begins.

## Authorization and safety gate

- testing is limited to systems the customer owns or is explicitly authorized to test;
- intake must include explicit authorization confirmation;
- the public request form must not solicit passwords, API keys, tokens, private keys or undisclosed vulnerabilities;
- sensitive disclosures continue through the repository security policy;
- the service is not a certification, a universal AI-security audit or a guarantee that the full system is secure;
- scanner/runtime `ERROR` must never be represented as a vulnerability finding.

## Follow-on offers

Evidence-backed follow-on work may include:

- Custom Adapter — working anchor from EUR 1,500;
- Private Test Pack — working anchor from EUR 1,500;
- Extended Assessment — custom quote for multiple boundaries or materially larger scope;
- later pricing hypotheses after standard-scope validation: approximately + EUR 750 per additional agreed boundary and + EUR 390 per additional retest.

These are validation hypotheses, not permanent commitments.

## Work packages

### CV-0 — commercial contract freeze

- [x] service-first monetization selected;
- [x] open-source Core remains free;
- [x] subdomain selected;
- [x] asynchronous written-results model selected;
- [x] EUR 1,490 / first 3 accepted assessments selected as founding price hypothesis;
- [x] one included retest selected;
- [x] no mandatory calls;
- [x] no SaaS required for launch.

### CV-1 — commercial web launch

Status: **COMPLETED 2026-09-12**

- [x] decide safe deployment/repository placement for the commercial site without contaminating the npm/Core release surface;
- [x] configure Vercel and `handoffprobe.heaviside-solutions.com` DNS;
- [x] build `/`;
- [x] build `/security-assessment`;
- [x] build `/security-assessment/received`;
- [x] add legal/privacy links and verify responsive/accessibility baseline;
- [x] verify production SSL and canonical URLs.

Completion record:

- commercial web code is isolated in private repository `Heaviside479/handoffprobe-site`;
- production domain is `https://handoffprobe.heaviside-solutions.com`;
- English and German product, assessment and confirmation routes are live;
- canonical / hreflang metadata, sitemap, robots and received-page `noindex` behavior were verified in production;
- SSL/HSTS and production routing were verified;
- final verified commercial-site production commit: `a1d7fa0fa4109f9099721a271314f40c7969bce4`;
- CV-2 was completed separately on 2026-09-12 after the privacy notice was updated and verified live before intake activation.

### CV-2 — intake and email path

Status: **COMPLETED 2026-09-12**

- [x] implement the short assessment request form;
- [x] require explicit authorization confirmation;
- [x] add no-secrets warning;
- [x] route requests to a controlled Heaviside Solutions inbox/backend;
- [x] send customer confirmation email;
- [x] verify failure handling and spam/abuse controls.

Completion record:

- English and German assessment forms are live on the commercial subdomain;
- required authorization and no-secrets guidance are enforced in the public flow;
- assessment requests and confirmations use `support@heaviside-solutions.com`;
- security-sensitive disclosures remain routed to the existing Core `SECURITY.md`;
- the server endpoint implements same-origin validation, request-size and field validation, likely-secret rejection, honeypot handling and best-effort in-memory rate limiting;
- local failure-path tests passed for invalid origin, invalid payload, likely-secret detection, missing Resend configuration and honeypot handling;
- the production Vercel project has `RESEND_API_KEY` configured as a secret;
- production commit `1084980e85d10e2ada0a6b5ce5fe0e4913db196c` is live;
- all English/German assessment and received routes returned HTTP 200 in production;
- a real synthetic production submission returned HTTP 200 with the expected confirmation redirect;
- both resulting transactional emails were independently verified as delivered through Resend;
- the Heaviside Solutions privacy notice was updated and verified live before form activation.

CV-3 remains separate from CV-2 and is now prepared for just-in-time activation with the first accepted customer.

### CV-3 — payment path

Status: **PREPARED — live Stripe link deferred until first accepted customer**

- [ ] create the Founding Assessment payment mechanism when the first accepted scope is ready for payment;
- [ ] create and send a secure Stripe payment link only after written scope acceptance;
- [ ] collect 100% before standard assessment work begins;
- [x] document payment/refund/cancellation handling before first payment;
- [x] no subscription billing in this phase.

Operational decision:

- no standing public HandoffProbe payment link is created in advance;
- Stripe setup is intentionally just-in-time after human scope review and written acceptance;
- the first accepted assessment triggers creation and verification of the one-time EUR 1,490 payment path;
- CV-3 remains open until that live payment mechanism has been created and verified.

### CV-4 — report delivery system

Status: **COMPLETE — synthetic end-to-end delivery verified 2026-09-13.**

- [x] create reusable written report template;
- [x] support PDF + Markdown delivery;
- [x] define optional safe JSON attachment rules;
- [x] include scope/out-of-scope, findings, severity, evidence, remediation, limitations and retest state;
- [x] validate the workflow with a synthetic end-to-end assessment before customer delivery.

Verification:

- `npm run check` passes the full repository gate;
- repository-local `npx tsx scripts/commercial-assessment-delivery.ts <assessment.json>` generates Markdown, PDF and allowlisted safe JSON;
- `.handoffprobe-assessments/` keeps real customer working data outside the public repository;
- the synthetic PDF delivery was manually reviewed for readable layout and page flow.

### CV-5 — distribution conversion

Start CV-5 once CV-1 and CV-2 are live and verified, the CV-3 just-in-time payment path is documented and prepared, and CV-4 is complete.

The live CV-3 Stripe mechanism remains intentionally deferred until the first suitable customer accepts the exact assessment scope in writing. That just-in-time trigger does not block pre-revenue distribution work:

- [x] update GitHub README commercial CTA to the assessment page;
- [x] update HandoffProbe portfolio/product links where appropriate;
- [x] update future npm/release-visible commercial links through normal release discipline;

Npm/release verification:

- published `handoffprobe@0.2.0` remains unchanged;
- the current repository README contains the assessment CTA and URL;
- `npm pack --dry-run` includes `README.md`, so the CTA will become npm-visible with the next normal release;
- commercial assessment scripts, fixtures, tests and customer working data are excluded from the package;
- no npm version is republished solely for this commercial-link update.
- [ ] use the subdomain as the product website in future directories where allowed;
- [x] keep technical-community promotion value-first and non-spammy.

Community-promotion guardrail:

- the HandoffProbe marketing plan now requires technical value before promotion;
- GitHub/npm/CLI remain the default destination when someone only wants to try the scanner;
- the commercial assessment page is used only when a real authorized assessment need is relevant;
- no copy-paste assessment pitching, fear marketing, fake customer stories or unrelated commercial links;
- CV-5 remains open until the directory/product-website item above is actually completed and verified.

### T-1 — semantic authority widening follow-up

Status: **COMPLETE 2026-09-14.** Outcome B was implemented as a semantic-authority refinement of `HP-AUTH-001`; no new stable attack ID was created and the public corpus remains 22 attacks. CV-5 directory/product-website item 4 remains separate and open in the marketing workflow.

Implementation contract:

`docs/SEMANTIC_AUTHORITY_WIDENING_FOLLOWUP_20260912.md`

External evidence:

- A2A Discussion `#2181`: `Runnable A2A→MCP fixture for testing delegated-authority attenuation`;
- external repository: `arjun2075/a2a-mcp-authority-conformance`;
- merged external PR `#1`: `Add semantic authority-widening fixture for lossy A2A→MCP translation`;
- external merge commit: `c365a7fef4b96f2b5ceae65cfec9deeae5db5bae`;
- external failure class: `SEMANTIC_AUTHORITY_WIDENING`;
- external fixture-scoped invariant: `effective_authority(downstream) ⊆ delegated_authority(upstream)`.

This external result is a qualified technical signal, not an automatic new HandoffProbe attack and not proof of adoption, partnership or endorsement.

Required sequence:

- [x] freeze exact external references, provenance and license context;
- [x] compare the case against all relevant existing HandoffProbe authority / identity / binding attacks and Phase 9 evidence;
- [x] produce a written overlap matrix showing what is already covered and what is genuinely distinct;
- [x] determine that separate candidate-invariant formalization is not required because the case did not remain distinct after overlap review;
- [x] independently reproduce the smallest deterministic local/synthetic PASS/FAIL/control set inside HandoffProbe;
- [x] keep representation loss alone non-failing when equivalent trusted downstream enforcement preserves effective authority;
- [x] distinguish semantic widening from identity/binding failure and explicit attenuation/escalation failure;
- [x] make an explicit admission decision: **refine HP-AUTH-001; no distinct new attack is justified by current evidence**;
- [x] do **not** assign a new stable attack ID before that evidence-backed admission decision;
- [x] complete T1.6 product follow-through under stable ID `HP-AUTH-001` with deterministic semantic authority evaluation and concrete widening-witness evidence;
- [x] preserve the no-new-ID decision, keep the stable public corpus at **22 attacks**, and defer any version bump to the coordinated R3 release track.

Guardrails:

- no blocking or displacement of the remaining CV-5 distribution work; T-1 proceeds in parallel;
- no claim that A2A or MCP normatively defines the external fixture's authorization model without protocol evidence;
- no copying of external implementation without license/provenance review;
- no production-world or unauthorized third-party testing;
- no public claim of coordination, endorsement or compatibility certification;
- no public attack-count change until normal attack-admission and release gates are satisfied.

T-1 exit gate: **SATISFIED 2026-09-14.** The evidence-backed decision is an existing-attack refinement, and T1.6 implemented the productive `HP-AUTH-001` semantic-authority evidence path without changing the stable attack count.

Closeout: `docs/T1_HP_AUTH_001_SEMANTIC_REFINEMENT_CLOSEOUT_20260914.md`.

### T-2 — protocol-neutral Handoff Contract review

Status: **ACTIVE — T-2.1 through T-2.6 completed 2026-09-15; T-2.7 is WAITING FOR RESPONSE from the existing Indie Hackers reviewer `bayu`.** T-1 remains authoritative for semantic authority widening. The exact Bayu review packet is frozen while the review is outstanding and must not be silently rewritten by later external follow-up work.

Implementation contract:

`docs/HANDOFF_CONTRACT_REVIEW_SPEC_20260914.md`

Required sequence:

- [x] draft a minimal protocol-neutral Handoff Contract with explicit separation of **Contract Semantics**, **Attestation / Binding**, and **Runtime Enforcement**;
- [x] map every proposed invariant against the **22 stable attacks**, **Phase 9**, and **T-1** before creating new research cases;
- [x] treat semantic authority widening as T-1-owned and reuse its HP-AUTH-001 refinement/admission result rather than creating parallel authority work;
- [x] add only evidence-gated, deterministic local/synthetic research cases that remain justified after the overlap review;
- [x] complete the internal public draft, concrete cases, reproducible evidence and review gate before asking `bayu` for external technical review in the existing Indie Hackers thread;
- [ ] record Bayu's substantive external feedback when/if it arrives and classify every point as `ACCEPT / MODIFY / REJECT / NEEDS EVIDENCE` before changing the frozen T-2 review outcome.

Guardrails:

- no automatic new stable attack ID;
- the public stable attack count remains **22** unless a separate normal admission and release decision changes it;
- no partnership, endorsement, certification or compatibility claim from external reviewer participation;
- do not mutate the already-shared Bayu review packet while T-2.7 is pending; later evidence may be recorded separately and reconciled after the review response.

T-2 exit gate: the protocol-neutral contract and justified deterministic cases are publicly reviewable, overlap with the existing corpus / Phase 9 / T-1 is documented, the Bayu review request has been made, and any received review feedback is resolved or explicitly left open. If no reply arrives within the documented review window, close only as `NO EXTERNAL REVIEW RECEIVED`, never as validation.

### T-3 — external A2A conformance follow-ups

Status: **COMPLETE — 2026-09-16; T-4.1 NEXT.** This track ran in parallel with the T-2.7/Bayu waiting period. It did not change the exact artifact already handed to Bayu; it created separately attributable evidence from two public A2A technical follow-ups.

External inputs:

- A2A `#1937`, Arjun context-binding profile draft and explicit request for a HandoffProbe comparison: `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5689749343`;
- A2A `#2079`, giskard09 confirmation of the delegation-chain vs translated-effective-request gap and invitation to test against the real cA2A shape/bytes: `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5688209314`.

These are qualified external technical/reviewer signals. They are not proof of HandoffProbe adoption, A2A specification acceptance, cA2A vulnerability, partnership, endorsement, certification or commercial demand.

#### T-3.1 — freeze both external inputs before implementation

- [x] preserve the exact two comment URLs, authors, timestamps, requested comparison/test scope and any linked public artifacts;
- [x] pin exact upstream repository/commit/vector references before consuming external test material;
- [x] review provenance and license terms before copying or adapting any external vectors/code;
- [x] record the current HandoffProbe baseline: `v0.3.0`, 22 stable attacks, A2A 1.0 → MCP 2026-07-28, T-1 semantic-authority refinement and Phase-9 crossing evidence;
- [x] keep the Bayu T-2 review packet unchanged.
  - Evidence: `docs/T3_1_EXTERNAL_A2A_INPUT_FREEZE_20260916.md`.

#### T-3.2 — map Arjun's 13 context-binding conformance vectors

- [x] map V1–V13 from A2A `#1937` against all relevant stable attacks, Phase 9, T-1 and the T-2 contract;
- [x] classify each vector as `ALREADY COVERED / REFINEMENT / DISTINCT RESEARCH GAP / OUT OF SCOPE` with rationale;
- [x] explicitly separate task-bound vs context-bound behavior, caller/delegate identity, audience/resource containment, semantic widening, equivalent normalization, narrower effective authority, post-authorization mutation, indeterminate comparison, status/expiry and multi-effect final authorization;
- [x] do not implement a new case until this overlap map shows that existing evidence is insufficient.
  - Evidence: `docs/T3_2_A2A_CONTEXT_BINDING_OVERLAP_MATRIX_20260916.md`.
  - T-3.3 research is justified only for V3, V10, V12 and V13; no stable attack admission is made.

#### T-3.3 — execute the justified HandoffProbe comparison for #1937

Status: **COMPLETE — 2026-09-16**

- [x] reuse existing deterministic HandoffProbe machinery wherever the vector is already represented;
- [x] implement only evidence-backed missing research cases, using local/synthetic fixtures and harmless fake effects;
- [x] verify the final pre-dispatch authorization boundary, including the rule that the request dispatched is the request evaluated;
- [x] preserve the distinction between equivalent normalization and semantic widening/redirection;
- [x] fail closed where an authorization-relevant projection or containment result is genuinely indeterminate;
- [x] run focused tests plus the normal repository quality/security gates;
- [x] produce a compact comparison artifact that records each vector, HandoffProbe coverage, observed result, limitations and exact commit/evidence references;
- [x] make an explicit no-add/refinement/research-candidate decision; do not create a stable attack ID or release solely because the draft contains a new vector.
  - Evidence: `docs/T3_3_A2A_CONTEXT_BINDING_EXECUTION_20260916.md`.
  - New deterministic research execution is limited to V3, V10, V12 and V13.
  - Final decisions: V1/V2/V4/V5/V6/V7/V8/V9/V11 `NO ADD`; V10/V12 `REFINEMENT`; V3/V13 `DISTINCT RESEARCH CANDIDATE`.
  - Repository gate: 81 / 81 test files and 417 / 417 tests passed; build, package dry-run, secret safety, release invariants and diff hygiene passed.
  - Stable corpus remains 22 attacks; the eight current-spec backlog candidates remain non-stable; package version remains `0.3.0`.
  - No stable attack admission or release is authorized by T-3.3.

#### T-3.4 — reply publicly to Arjun after evidence exists

Status: **COMPLETE — 2026-09-16**

- [x] reply in A2A `#1937` only after T-3.2/T-3.3 evidence is reproducible;
- [x] state exactly which vectors HandoffProbe already covered, which required new research work and what the deterministic comparison observed;
- [x] link to stable HandoffProbe evidence/commit/artifact references where useful;
- [x] state limitations and avoid implying that the draft is accepted A2A specification text or that A2A endorses HandoffProbe;
- [x] verify the frozen draft had not materially changed before posting; re-freeze any future material revision before comparing it;
- [x] establish the follow-up rule that any substantive later Arjun reply is recorded and acted on only where it creates new evidence or a concrete correction.
  - Public reply: `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5695896491`.
  - Posted by `Heaviside479` after T-3.3 merged as `398daa88c17821b901dbeecc3c2ce79065f87d61`.
  - Reply links the merged T-3.3 evidence artifact and reports the exact `NO ADD / REFINEMENT / DISTINCT RESEARCH CANDIDATE` outcomes.
  - The V1–V13 draft was rechecked before posting and had not materially changed from the frozen T-3 input.
  - The reply explicitly preserves the synthetic/research limitations and makes no A2A acceptance, endorsement, certification or release claim.
  - No subsequent Arjun reply was observed at this closeout; any later substantive response remains an event-triggered follow-up.

#### T-3.5 — freeze the real cA2A shape for #2079

Status: **COMPLETE — 2026-09-16**

- [x] identify and pin the exact public cA2A delegation-chain fixture/vector set giskard09 is referring to;
- [x] preserve exact upstream commit/digest and license/provenance metadata;
- [x] document the distinction between what the cA2A chain proves (declared delegation-chain narrowing/continuity) and what it does not itself prove (the downstream translated request remains inside that authority);
- [x] define the smallest deterministic A2A→MCP effective-request projection needed to test the gap without turning HandoffProbe into a cA2A implementation or generic protocol scanner.
  - Evidence: `docs/T3_5_CA2A_REAL_SHAPE_FREEZE_20260916.md`.
  - Pinned upstream: `giskard09/argentum-core@4951899c6bb016928e299e9bf9993086885a45ae`, Apache-2.0.
  - Primary control: `cross-org-001-independent-signers` with leaf `test-cross-org-c`, action `payment.route`, scope `mycelium:payment`.
  - T-3.6 projection is limited to downstream tool + authorization-relevant `delegated_scope`; MCP audience remains an owned fixed fixture binding.
  - Positive scope remains `mycelium:payment`; the negative translation widens only the downstream scope to `mycelium:*` while the pinned upstream bytes remain unchanged.
  - No cA2A/A2A vulnerability, compatibility, certification, stable-attack or release claim is made.

#### T-3.6 — run the cA2A real-shape/real-bytes negative fixture

Status: **COMPLETE — 2026-09-16**

- [x] adapt the pinned real cA2A shape/bytes into a HandoffProbe-owned local fixture without unauthorized production testing;
- [x] include a valid/in-scope control and a negative translation case where the effective downstream request exceeds the cleanly verified declared scope;
- [x] observe the actual translated audience/tool/authorization-relevant arguments immediately before dispatch/effect where the fixture permits it;
- [x] verify whether HandoffProbe blocks/detects the widening at the intended boundary and record `PASS / FAIL / INCONCLUSIVE / ERROR` without converting runtime uncertainty into a vulnerability claim;
- [x] retain exact effect-recorder evidence proving whether any protected fake effect occurred;
- [x] run focused tests plus the normal repository quality/security gates;
- [x] keep the result as research/conformance evidence unless normal attack-admission discipline independently justifies a stable product change.
  - Evidence: `docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md`.
  - Adapted fixture: `tests/fixtures/t3/ca2a-cross-org-001.json`, SHA-256 `668e3950c54fef486a0bf433c4542b968ee645e33bed2d2b952ce94f4d8bba81`.
  - Positive control: `payment.route` + `mycelium:payment` accepted with exactly one protected local fake effect.
  - Widening negative: unchanged pinned upstream `mycelium:payment` authority translated downstream to `mycelium:*`; blocked before `mcp.tool.call` and `fake_tool.execute`, with effect delta `0`.
  - Focused execution: 2 / 2 test files and 7 / 7 tests passed; diff hygiene passed.
  - Result remains research/conformance evidence; stable corpus remains 22 attacks and package version remains `0.3.0`.

#### T-3.7 — reply publicly to giskard09 after real-shape evidence exists

Status: **COMPLETE — 2026-09-16**

- [x] reply in A2A `#2079` only after T-3.5/T-3.6 results are reproducible;
- [x] report the exact pinned upstream input, HandoffProbe commit/artifact and observed boundary result;
- [x] distinguish a demonstrated application/translation-layer property from a flaw in cA2A itself;
- [x] avoid compatibility, certification, partnership or endorsement language;
- [x] invite correction if the frozen cA2A interpretation is wrong and update the research record if concrete counter-evidence is provided;
- [x] establish that any later substantive giskard09 correction, confirmation or counter-example is recorded and classified before further implementation that depends on it.
  - Public reply: `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862`.
  - T-3.6 merge used by the reply: `c616804d3b3daedd7f68b300b8416029b5020942`.
  - Closeout: `docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md`.
  - The reply reports the in-scope control and translation-only widening negative, including zero MCP dispatch/effect for the widened downstream request.
  - No substantive external technical response to this specific HandoffProbe result had been recorded at T-3.7 closeout time; `#2079` therefore remains an open technical follow-up in `EVIDENCE.md`, not a completed external-evidence entry.
  - Stable corpus remains 22 attacks; package version remains `0.3.0`; no release is authorized by T-3.7.

#### T-3.8 — combined closeout and admission decision

Status: **COMPLETE — 2026-09-16**

- [x] reconcile the #1937 vector comparison and #2079 real-shape execution into one written closeout;
- [x] record whether each stream resulted in `NO ADD / REFINEMENT / DISTINCT RESEARCH CANDIDATE`;
- [x] preserve the stable public corpus at **22 attacks** unless a separate normal attack-admission decision explicitly changes it;
- [x] do not trigger `v0.3.1`, `v0.4.0` or another release merely because T-3 completes;
- [x] update affected research/roadmap documentation with exact evidence references;
- [x] keep T-2.7/Bayu status independent, then reconcile Bayu's review later if/when it arrives;
- [x] ensure both external GitHub threads have received an evidence-based follow-up from Heaviside479 before T-3 is considered complete.
  - Combined closeout: `docs/T3_8_COMBINED_CLOSEOUT_20260916.md`.
  - `#1937` stable admission: `NO ADD`; V10/V12 remain `REFINEMENT`; V3/V13 remain `DISTINCT RESEARCH CANDIDATE`.
  - `#2079` stable admission: `NO ADD`; research outcome remains `REFINEMENT` of the existing `HP-AUTH-001` semantic-authority evidence path; no distinct research candidate is created by this stream.
  - `#1937` has public author review at `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5697862002`.
  - `#2079` has the HandoffProbe public result at `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862`, but no substantive external technical response/review to that result was recorded at T-3 closeout; it remains open in `EVIDENCE.md`.
  - Stable corpus remains 22 attacks; package version remains `0.3.0`; T-3 completion does not authorize a release.
  - T-2.7/Bayu remains independently waiting; `docs/T2_5_REVIEW_PACKET_20260915.md` is unchanged.
  - T-4.1 is next and may now freeze the queued A2A `#1769` witness / conduct-observation input.

T-3 exit gate: **SATISFIED 2026-09-16.** Both external requests were frozen, overlap-checked and answered with reproducible evidence; new code remained deterministic, local/authorized and covered by tests; both public A2A threads received factual HandoffProbe follow-up; no unsupported attack-count, specification-acceptance, compatibility, adoption, partnership, endorsement or release claim was introduced; and the outstanding Bayu T-2 review remains independently traceable.

#### Post-T-3 external author confirmation — 2026-09-17

A substantive `#2079` response arrived after the dated T-3.7/T-3.8 closeout.

- giskard09 independently checked the pinned `4951899c` / `cross-org-001-independent-signers` vector, scope `mycelium:payment`, expected `PASS`, against the HandoffProbe evidence document;
- external confirmation: `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5706400400`;
- HandoffProbe acknowledgement: `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5710063080`;
- the response confirms the scoped distinction between upstream signed/monotonic delegation-chain guarantees and downstream translation containment;
- `EVIDENCE.md` may now promote `#2079` from an open external-review follow-up to completed scoped external evidence;
- the dated T-3.7/T-3.8 statements remain unchanged because they accurately record the state at 2026-09-16 closeout;
- attack admission remains **NO ADD** and the research outcome remains **REFINEMENT** of `HP-AUTH-001`; this response does not authorize a new stable attack or release;
- record: `docs/T3_CA2A_EXTERNAL_AUTHOR_CONFIRMATION_20260917.md`.

#### Post-T-3 A2A #1937 technical follow-up — 2026-09-17

A new technical comment arrived after T-3 had already been completed and must not reopen the closed T-3 implementation track.

- Public source: `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5722725065`.
- Author: `chgaowei`.
- The comment distinguishes a valid grant replayed into the wrong task from a missing-token failure.
- The proposed fail-closed binding set is: authenticated acting principal, A2A task/context, target, non-widening scope and validity window.
- The comment identifies the A2A -> MCP tool boundary as a place where a delegation chain can appear attenuated while the translated downstream effect is wider, and therefore calls for binding to be checked again against the actual caller at that boundary.
- The described resolvable-DID leaf identity is implementation-specific and is explicitly not proposed as A2A conformance.
- T-3 remains closed. This comment does not create a new T-3 fixture, stable attack, admission decision or release requirement.
- The signal may support T-4.2 overlap analysis where materially relevant because T-4.2 already compares completed `#1937` findings with cross-protocol authority and runtime-enforcement evidence.
- No additional public HandoffProbe reply is required merely to acknowledge this post-T-3 comment. If the signal materially informs a later reproducible HandoffProbe comparison or fixture, return that concrete result to A2A `#1937`, state the tested and untested scope, invite correction, and record the response before dependent follow-on work.

#### T-4 / A2A #1769 queued external signals — 2026-09-17

Two additional public technical responses arrived after the existing T-4 queue was prepared and must be included in the T-4 freeze/overlap review before implementation or admission decisions:

- Takao Sato (`Poke-nushi`) read the pinned HandoffProbe Phase-9 execution record and stated that the native-vs-bound comparison with effect recording outside the verifier is relevant to the trace requested in A2A `#1769`; he explicitly did **not** claim a local HandoffProbe rerun. Public response: `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5710413588`.
- Toshikatsu Oga (`ogasurfproject-jpg`) mapped his draft `WitnessObservation` shape directly onto the HandoffProbe caller/task/context/audience/tool/argument boundary, including verifier-side recomputation, witness independence, delegation-hop continuity and preservation of disagreement/outcome-unknown states. Public response: `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5711708984`.
- Oga's stated scope remains limited: the design is a draft, is not wired into a live service, and is not outsider-verifiable beyond the published specification and tests.
- HandoffProbe follow-up preserving those claim boundaries and requesting an exact canonical upstream revision/vector for the later T-4 freeze: `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5712635674`.
- Oga then supplied an immutable canonical WitnessObservation pin: commit `4d7c9c270c2846465fafdea9833869c5660c4ae2`, path `workers/hs-ledger/nenrin/task-delegation-bind-v0/`, with `EXTENSION.md`, `bind.mjs`, `sign.mjs` and `signed.json`; public response: `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5712951510`.
- Later correction: this preserves the original author-supplied description, but independent freeze verification and Oga comments `#5722127484` and `#5728468834` confirmed that `signed.json` and `obs.json` are regenerated gitignored non-source material. They are not part of canonical commit `4d7c9c27`; only tracked source and tests are treated as pinned input.
- The supplied vector map gives concrete T-4 inputs for structural witness binding (`A1`, `S1`), hop continuity (`A4`, `A4b`, `S2`, `prod-t2`), disagreement preservation (`A3`, `S4`) and cross-language canonicalization. Oga explicitly limits R1 to structural witness distinctness, not proof of non-affiliation.
- Outcome-unknown remains an explicit gap on the WitnessObservation side: there is no dedicated v0 vector for the response-loss / read-only-reconciliation case yet. The VATE revision must therefore be frozen independently rather than inferred from Oga's artifacts.
- HandoffProbe acknowledgement of the canonical pin and those boundaries: `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5713030346`.
- Takao Sato / `Poke-nushi` then supplied the canonical VATE side: repository revision `4a63adb4ade9d6e1affe622744a49056413a8c86`, fixed Vaara → VATE reproduction document and package identity; public response: `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5713423719`.
- The package identity pins archive SHA-256 `5f1fe2d4bf656cc02c25c04757180fc3d6111296e157abfc61f5b3e7715d3f7e`, VATE source `a15b9f5e64413f7a1312ec8e9e7731e8ebdb1f60`, Vaara source `cfb5495c0c8d08fb34a99501c670f4ed225e7870` and `rfc8785` `0.1.4`.
- The VATE comparison must keep action binding, caller outcome state after response loss, and provider-side reconciliation distinct. Saved reference cases are `J28`, `P93`, `L64` and `V17`.
- Scope remains limited to a single-operator local stdio experiment with unsigned VATE records and adapter-derived output hashes; A2A transport is outside that reproduction scope.
- Both WitnessObservation and VATE now have canonical author-supplied inputs. The R4 prerequisite is satisfied, but T-4.1 remains incomplete until HandoffProbe independently preserves and verifies those artifacts.
- These responses are **queued T-4 research inputs only**. They do not by themselves establish external HandoffProbe validation, a new stable attack, A2A acceptance/conformance, production behavior or a release requirement.
- The R4 closeout prerequisite is satisfied; the author-supplied pin does not by itself complete T-4.1.
- T-4 must freeze the exact upstream artifacts and then classify overlap/admission normally as `NO ADD / REFINEMENT / DISTINCT RESEARCH CANDIDATE` before any implementation decision.
- After reproducible T-4 results exist, HandoffProbe must return the relevant findings to the upstream contributors rather than only recording them internally: WitnessObservation-specific results to Oga in A2A `#1769` with reference to `#5712951510`; VATE-specific reproduction results to Poke-nushi in `Poke-nushi/Verifiable-Agent-Trust-Envelope#2` with reference to `#5713423719`; and any VATE result that affects A2A caller/task/context binding or artifact-carriage requirements must also be summarized in A2A `#1769`.
- Any cross-comparison result involving both inputs must mention both contributors, link reproducible HandoffProbe evidence/commit references, preserve each upstream scope boundary, and be recorded before T-4 closeout.

#### T-4.2 WitnessObservation / VATE overlap closeout — 2026-09-18

T-4.2 is complete.

- Completion artifact: `docs/T4_2_WITNESS_VATE_OVERLAP_MATRIX_20260918.md`.
- Eight candidate properties were classified: 3 `ALREADY COVERED`, 2 `REFINEMENT`, 1 `DISTINCT RESEARCH GAP`, 1 `OUT OF SCOPE`, and 1 `NEEDS EVIDENCE`.
- Witness structural distinctness alone remains profile policy rather than a new HandoffProbe invariant.
- Evidence-id recomputation and delegation/evidence continuity overlap existing integrity, lineage and audit evidence.
- Authorized-action equivalence is already covered by existing authority, target, approval, Phase 9, T-1 and T-3 evidence.
- Caller outcome uncertainty after response loss is a refinement of existing retry and partial-failure evidence.
- Provider-side reconciliation of the original attempt after response loss is the only current `DISTINCT RESEARCH GAP`.
- Witness disagreement preservation remains `NEEDS EVIDENCE` because no concrete protected-decision or protected-effect consequence has yet been demonstrated.
- No new stable attack is admitted. The stable corpus remains 23 attacks.
- T-4.3 may implement only the smallest local deterministic synthetic fixture for original-attempt provider reconciliation.
- Oga comment `#5728468834` confirms that no additional signed WitnessObservation fixture is needed unless a later concrete property requires one.

#### T-4.3 / T-4.4 provider reconciliation execution and admission — 2026-09-18

T-4.3 and T-4.4 are complete.

- Execution evidence: `docs/T4_3_PROVIDER_RECONCILIATION_EXECUTION_20260918.md`.
- Immutable fixture commit: `07d9c8bf38f1fa5bfa0d61f74d92ffe5232b53ba`.
- The fixture is local, deterministic and synthetic and changes no production `src/` implementation or package metadata.
- One protected synthetic effect occurs before the simulated caller-facing response loss.
- Caller outcome remains explicitly `unknown` after response loss.
- Blind fresh execution is blocked while that original outcome remains unresolved.
- A read-only provider lookup for the same original attempt resolves the caller only when logical action identity, attempt identity and execution evidence validate.
- Reconciliation itself records zero additional protected effects.
- Missing or mismatched provider evidence remains `INCONCLUSIVE`; provider lookup failure remains `ERROR`.
- Focused execution passed 8/8 tests; full repository validation passed 92/92 test files and 465/465 tests plus build.
- T-4.4 decision: **DISTINCT RESEARCH CANDIDATE**.
- The distinction is specifically provider-side original-attempt reconciliation and does not duplicate the stable `HP-REPLAY-003` duplicate-effect invariant.
- No new stable attack is admitted, the stable public corpus remains 23 attacks, and no release is triggered.
- T-4.5 is next: return the reproducible result to A2A `#1769` and the VATE implementation review thread with exact commit/evidence links, tested and untested scope, limitations and an invitation to correct the interpretation.
- The post-T-3 A2A `#1937` signal did not materially determine this reconciliation fixture, so this result alone does not require a separate `#1937` reply.

#### T-4.5 public result return — 2026-09-18

The reproducible T-4 result has now been returned to the external contributors.

- A2A #1769 cross-comparison reply: https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729838541
- VATE implementation-review reply: https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5729853773
- HandoffProbe fixture commit: `07d9c8bf38f1fa5bfa0d61f74d92ffe5232b53ba`
- merged evidence state: `360f3345cf72ca60e0a91a81b91164dad7dd3d2c`
- both replies preserve tested/untested scope and explicitly invite correction or counter-evidence;
- no external confirmation is claimed from the HandoffProbe result itself;
- WitnessObservation author review received: https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729937680
- response classification: **CONFIRMATION + CLARIFICATION**;
- the author confirmed the compose-rather-than-subsume boundary and that no additional signed WitnessObservation fixture was required;
- the author clarified that provider attestation establishes attestation/binding, not an independently confirmed world-side effect by itself;
- supplemental NENRIN revision `62b60205` was mentioned but is not frozen or executed by this T-4 result;
- VATE author review received: https://github.com/a2aproject/A2A/issues/1769#issuecomment-5732275655
- VATE response classification: **CONFIRMATION + CLARIFICATION**;
- Poke-nushi states that the separation of action binding, unknown caller outcome and original-attempt reconciliation matches the VATE points previously raised;
- the review recognizes that missing or mismatched evidence remains unresolved and reconciliation produces no additional protected effect;
- A2A task state remains distinguishable from evidence of an external operation's outcome;
- the VATE response is scoped author review, not an independent HandoffProbe rerun;
- T-4 evidence level is now **External vector comparison + author review**;
- T-4 is **CLOSED**;
- the T-4.4 decision remains **DISTINCT RESEARCH CANDIDATE / NO STABLE ATTACK ADD**;
- stable public corpus remains **23 attacks**;
- package remains `0.4.0`;
- no release is triggered.

Detailed record: `docs/T4_5_PUBLIC_RESULT_RETURN_20260918.md`.

#### Reddit R-1 token-rotation execution — 2026-09-18

R-1 has now completed deterministic local execution.

- originating Reddit comment: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakk8w2/
- merged execution commit: `05677e5a00c45bcc20abe06b3622a72d4b7aa43b`;
- execution record: `docs/REDDIT_R1_TOKEN_ROTATION_EXECUTION_20260918.md`;
- execution test: `tests/reddit-r1-token-rotation-execution.test.ts`;
- initial token A authorization: accepted;
- server-side current session generation rotates to B before any protected effect;
- reconnect attempt presents stale A in the same logical action/task/context;
- secure path revalidates current state and blocks before MCP dispatch;
- secure protected-effect delta: `0`;
- intentionally vulnerable path reuses the pre-interruption authorization snapshot;
- vulnerable protected-effect delta: `1`;
- effect count before interruption is exactly `0`, so the primary fixture does not exercise `HP-REPLAY-003` duplicate-effect semantics;
- final classification: **HP-RACE-002 REFINEMENT / NO ADD**;
- no new stable attack ID;
- stable public corpus remains **23 attacks**;
- package remains `0.4.0`;
- no release is triggered;
- public result return: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/
- external response state: **PENDING**;
- no substantive external response has been recorded yet;
- public result return is not external confirmation;
- `EVIDENCE.md` records R-1 as **Open research follow-up**;
- active R-1 execution/result-return work is complete; only external-response classification remains if a substantive reply arrives.

#### Reddit MCP community edge-case queue — 2026-09-18

Four public community-supplied MCP handoff cases are tracked: R-1, R-2, R-3 and R-4 have completed deterministic execution, admission and public result return; substantive external responses remain pending.

Detailed queue:

`docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md`

Research-candidate index:

`docs/ROADMAP_RESEARCH_CANDIDATES.md`

- R-1: token A is initially valid, the server rotates current state to token B during an interrupted handoff, and the client reconnects in the same handoff context with stale A.
  - final classification: **HP-RACE-002 REFINEMENT / NO ADD**;
  - merged execution commit: `05677e5a00c45bcc20abe06b3622a72d4b7aa43b`;
  - direct comment source frozen before public result return;
  - public result return: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/
  - external response state: **PENDING**;
  - evidence level: **Open research follow-up**.
- R-2: approval is issued against capability version A, then a deterministic hot deploy causes the same visible tool name to resolve to materially changed capability version B before execution.
  - source: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakp67i/
  - source frozen before fixture implementation;
  - pre-implementation classification: **HP-APPROVAL-002 REFINEMENT / NO ADD**;
  - `HP-APPROVAL-002` governs approval continuity even though the existing stable fixture changes the visible tool identity;
  - `HP-VERSION-001` is adjacent but not governing because the primary fixture contains no version negotiation or translation;
  - `HP-AUTH-001` is neutralized by granting upstream semantic authority for both A and B while approval binds only A;
  - `HP-RACE-002` is excluded because the primary fixture contains no interruption/resume/retry;
  - frozen capability change: `["same-name-tool", "schema-v1", "read_only"]` → `["same-name-tool", "schema-v1", "protected_write"]`;
  - deterministic local binding uses SHA-256 over the fixed three-field tuple and is not a normative MCP format;
  - secure expected protected-effect delta: `0`;
  - intentionally vulnerable expected protected-effect delta: `1`;
  - positive control approves B directly and must produce protected-effect delta `1`;
  - deterministic local execution is complete within the frozen shape;
  - positive control: authority `ACCEPT`, approval `MATCH`, protected-effect delta `1`;
  - secure negative: authority `ACCEPT`, approval `MISMATCH`, protected-effect delta `0`;
  - intentionally vulnerable label-only negative: authority `ACCEPT`, stale approval accepted, protected-effect delta `1`;
  - deterministic repeated summaries passed;
  - post-execution classification remains **HP-APPROVAL-002 REFINEMENT / NO ADD**;
  - merged execution commit: `7ffcd7254a85391e0937ec514a39f4507af26727`;
  - public result return: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paly9up/
  - external response state: **PENDING**;
  - evidence level: **Open research follow-up**;
  - no new stable ID is reserved.
- R-3: after a denied request, an agent enumerates visible tenants, switches to another independently authorized target and retries successfully.
  - source: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/
  - source frozen before fixture implementation;
  - final pre-implementation classification: **HP-TARGET-001 REFINEMENT / NO ADD**;
  - governing property: the effective target must remain within the upstream task-authorized target set;
  - negative task-authorized set: `[A]`;
  - alternate B is visible and receives fresh request-level authorization `ACCEPT`;
  - visibility and request-level authorization do not expand task-level target authority;
  - attempt 1 denial: protected-effect delta `0`;
  - discovery: protected-effect delta `0`;
  - secure B retry: request authorization `ACCEPT`, task-target `MISMATCH`, protected-effect delta `0`;
  - intentionally vulnerable B retry: request authorization `ACCEPT`, ignored task-target mismatch, protected-effect delta `1`;
  - positive control task-authorizes `[A, B]` and must permit B with protected-effect delta `1`;
  - `HP-TENANT-001` is neutralized because B is independently request-authorized;
  - `HP-APPROVAL-003` is excluded because the primary fixture contains no approval reuse;
  - `HP-AUTH-001` is neutralized because B authority is independently valid rather than widened from A;
  - `HP-AUTH-006` is excluded because attempt 1 has zero protected effects and B receives a fresh authorization decision;
  - RC-1 remains unactivated because the adaptation sequence is deterministic;
  - deterministic local execution completed within the frozen shape;
  - B request authorization: `ACCEPT`, with no rejection reasons;
  - positive control: task-target `MATCH`, protected-effect delta `1`;
  - secure negative: task-target `MISMATCH`, protected-effect delta `0`;
  - intentionally vulnerable request-only path: task-target `MISMATCH` ignored, protected-effect delta `1`;
  - post-execution classification remains **HP-TARGET-001 REFINEMENT / NO ADD**;
  - merged execution commit: `a78fd7a961f197ddaf82bbea7fe3b15546c8efbf`;
  - public result return: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pam978h/
  - external response state: **PENDING**;
  - evidence level: **Open research follow-up**;
  - no new stable ID is reserved.

- R-4: an MCP `analyze_property` implementation returns an x402 payment
  requirement and the client retries with `_meta["x402/payment"]`.
  - source: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paxkn52/
  - supplied repository: https://github.com/Zak-bo/real-estate-x402
  - frozen external commit: `4e99e87da0ccdf3ddcf067958de6b59eb4134414`;
  - status: **PUBLIC RESULT RETURN COMPLETE / PROTOCOL SEMANTICS / NO ADD / EXTERNAL RESPONSE PENDING**;
  - verified semantic boundary: x402 payment verification binds payment terms
    but does not automatically bind every MCP application argument;
  - exact locked packages inspected: `agents@0.21.0`,
    `@x402/core@2.24.0`, `@x402/evm@2.24.0`;
  - supplied example contains no separate request-approval object;
  - final pre-implementation classification: **PROTOCOL SEMANTICS / NO ADD**;
  - deterministic fixture frozen with unchanged-retry, x402-only mutated-retry
    and explicit request-bound composition controls;
  - local execution: unchanged retry payment `ACCEPT` / effect `1`;
  - local execution: x402-only property mutation payment `ACCEPT` / effect `1`
    as `EXPECTED X402-ONLY SEMANTICS`;
  - local execution: explicit request binding `MISMATCH` / effect `0`;
  - focused R-4 execution: `5/5` tests passed;
  - merged execution commit: `d012c506a6e44680fb649ff8ab64fb32f41a9bae`;
  - public result return: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pay1b51/
  - evidence level: **Open research follow-up**;
  - external response state: **PENDING**;
  - no vulnerability conclusion has been made;
  - no live payment has been made;
  - live/testnet payment execution is explicitly outside the R-4 research boundary;
  - all execution must remain deterministic and local/synthetic;
  - no new stable ID is reserved;
  - `EVIDENCE.md` remains unchanged at intake.

Required sequence for each case:

`source → overlap → deterministic fixture → protected-effect evidence → admission → merge → Reddit result return → external-response classification → EVIDENCE.md decision`

`EVIDENCE.md` is intentionally not changed at queue creation.

The public stable corpus remains **23 attacks** and no package-version change or release is triggered by recording these signals.

#### External GitHub thread traceability audit — 2026-09-18

A retrospective GitHub-thread audit is recorded at:

`docs/EXTERNAL_GITHUB_THREAD_TRACEABILITY_AUDIT_20260918.md`

The audit covers every external thread returned by the HandoffProbe-specific maintainer search and then verified directly:

- A2A #1937 — completed external vector comparison + author review;
- A2A #2079 — completed external vector comparison + author review;
- A2A #1769 — completed T-4 scoped author review;
- VATE #2 — completed VATE-specific acknowledgement with an immutable external technical record; no independent rerun;
- MCP #3354 — reproducible result returned; direct AkiraTamai author review received; authorization-continuity fixture PR #37 merged and pre-SEP proposal changelog traceability recorded; evidence is **External vector comparison + author review** without independent HandoffProbe rerun;
- MCP TypeScript SDK #2777 — HandoffProbe-related comment only; no fixture, admission or Evidence promotion.

MCP Registry #1579 is explicitly excluded because the Heaviside479 comment there concerns MCPShip rather than HandoffProbe.

Traceability repair:

- HandoffProbe PR #93 now cross-references A2A #1937;
- HandoffProbe PR #103 now cross-references A2A #2079;
- HandoffProbe PR #121 now cross-references A2A #1769 and VATE #2;
- HandoffProbe PR #115 now cross-references MCP #3354.

GitHub issue timelines were checked after the repair and expose the expected HandoffProbe PR cross-reference events.

The audit creates no new research work, attack ID, package-version change, evidence-level promotion by itself or release.

#### Global external evidence return-loop policy — 2026-09-17

This policy applies to **all current and future external technical contributors/threads**, including but not limited to A2A `#1937`, A2A `#2079`, A2A `#1769`, MCP `#3354`, and later research inputs.

- Any qualified external input that materially informs a HandoffProbe comparison, fixture, admission decision or evidence claim must remain traceable to its exact public source and author.
- If HandoffProbe produces a reproducible result from that input, the result must be returned to the originating contributor/thread with the exact HandoffProbe commit/artifact, observed result, tested scope, untested scope and limitations.
- HandoffProbe must explicitly invite correction or counter-evidence and record any substantive response before dependent follow-on implementation or research closeout.
- A lack of external reply must be recorded as **no substantive response**, not interpreted as agreement.
- Confirmation, correction, disagreement and counter-examples are all evidence and must be preserved faithfully.
- `EVIDENCE.md` may promote an item only to the strongest evidence level actually demonstrated; a HandoffProbe result alone does not become external confirmation.
- Each research-specific queue/closeout should carry its own result-return checkbox or equivalent trace so the global policy cannot be forgotten during execution.
- For every external GitHub thread that materially produces HandoffProbe technical work, the canonical HandoffProbe PR/closeout must include the **full external GitHub issue/PR URL** so GitHub can create its native cross-reference.
- After that closeout, the external GitHub timeline must be checked for the visible HandoffProbe cross-reference / “mentioned this issue” entry.
- Missing historical GitHub linkage may be repaired retroactively as metadata/traceability work, but a comment-only signal must not receive an artificial technical PR merely to create a cross-reference.
- GitHub cross-reference presence is provenance metadata only and must never be treated as external confirmation, independent reproduction or an evidence-level promotion.
- For non-GitHub sources such as Reddit, preserve the exact source permalink, public result-return permalink and immutable HandoffProbe artifact instead.
- This policy is designed to keep `EVIDENCE.md` auditable: external input → frozen material → HandoffProbe comparison → reproducible artifact → public result return → external response state → scoped evidence classification.

#### Sanction Gate #2 stale-authority / effect-time signal — 2026-09-23

A new external technical traceability signal is frozen at:

`docs/SANCTION_GATE_2_STALE_AUTHORITY_SIGNAL_20260923.md`

- external record: https://github.com/math-r-association/sanction-gate/issues/2
- originating proposal: https://github.com/a2aproject/A2A/issues/2250
- external author: `01ehex`;
- the Sanction Gate issue explicitly records that the stale-authority / effect-time boundary was raised by `@Heaviside479`;
- the external decomposition separates authentic artifact validity, current authority for the exact action/context and final effective-action binding;
- candidate future vector: sanction admitted -> held before effect -> sanction withdrawn or superseded -> same action resumes -> zero protected effects;
- same-action stale-state resume is primarily an `HP-RACE-002` refinement;
- `HP-AUTH-006` is adjacent but not governing because it requires an earlier completed effect and a later distinct effect;
- no reference implementation or validated Sanction Gate conformance result exists at this freeze point;
- classification: **EXTERNAL TECHNICAL VALIDATION / TRACEABILITY SIGNAL — REFINEMENT / NO NEW STABLE ID**;
- no adoption, conformance or independent HandoffProbe reproduction is claimed;
- no new stable attack is admitted;
- stable public corpus remains **23 attacks**;
- public package remains `0.4.0`;
- no release is triggered;
- future direct comparison is gated on concrete withdrawal ordering, execution-boundary semantics and a reference implementation or executable conformance vector.

Any later reproducible HandoffProbe comparison must be returned to the Sanction Gate issue with exact immutable evidence and explicit limitations.

#### MCP #3354 freeze / overlap decision — 2026-09-18

The queued Verifiable MCP authority-boundary signal has now completed its first HandoffProbe freeze and overlap gate.

- Frozen upstream demo commit: `66a959f79802d3751ba7edc0aec4c1c0e0ee2b36`.
- Frozen spec blob: `1fd2d0c377388e4d8560fe5b38cf2e2a1d895541`.
- External interpretation source: AkiraTamai comment `#5715753995`.
- The proof layer's acceptance of execution over committed inputs is distinct from authorization of those inputs.
- Semantic downstream widening is already covered by stable `HP-AUTH-001`, Phase 9 and T-3 evidence.
- Overall classification: **REFINEMENT**.
- No new stable attack is admitted; the public corpus remains **23 attacks**.
- No release or package-version change is triggered.
- A later narrow execution may be justified only to demonstrate `proof accepts / authority rejects / protected effect = 0` without duplicating the existing stable authorization invariant.

Evidence: `docs/MCP_3354_FREEZE_OVERLAP_20260918.md`.

#### MCP #3354 deterministic refinement execution — 2026-09-18

The MCP #3354 layer-separation refinement has now been executed locally and deterministically.

- Execution record: `docs/MCP_3354_PROOF_AUTHORITY_EXECUTION_20260918.md`.
- Execution test: `tests/mcp-3354-proof-authority-execution.test.ts`.
- The HandoffProbe-owned execution-integrity binding accepts evidence generated for the exact widened effective request.
- The independent existing semantic-authority evaluator rejects the same widened request because it exceeds the upstream allowed authority.
- The final pre-dispatch gate blocks the widened request with `action_digest_mismatch`.
- The widened protected-effect delta is exactly `0`.
- The in-scope positive control has execution-integrity `ACCEPT`, authority `ACCEPT` and exactly one protected local effect.
- The execution is a synthetic binding analogue only; it does not reproduce AkiraTamai's ZK/TEE implementation or claim Verifiable MCP conformance.
- Classification remains **REFINEMENT**.
- No new stable attack is admitted; the stable public corpus remains **23 attacks**.
- No package-version change or release is triggered.
- Next required step after merge: return the concrete result to AkiraTamai in MCP `#3354`, then update `EVIDENCE.md`, queue and roadmap with the public response state.

#### MCP #3354 public result return and external author review — 2026-09-18 / 2026-09-22

The deterministic MCP #3354 refinement result was returned to AkiraTamai in the originating public thread and later received direct scoped author review.

- merged HandoffProbe execution commit: `13e4a525b658077e235a769f6aff6d6e2754a33e`;
- public result return: `https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5731012791`;
- execution-integrity binding for the widened effective request: `ACCEPT`;
- independent semantic-authority result for that request: `REJECT`;
- widened protected-effect delta: `0`;
- classification remains **REFINEMENT**;
- no new stable attack is admitted;
- stable public corpus remains **23 attacks**;
- no package-version change or release is triggered;
- HandoffProbe did not reproduce or claim conformance with the upstream ZK or TEE implementation;
- upstream specification follow-up: `https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5775696397`;
- associated upstream PR #36: `https://github.com/ripple-node-lab/mcp-verifiable-tools-demo/pull/36`;
- upstream PR #36 merge commit: `9b63cb023fa966e6da54d252d2827990d2d7fdbe`;
- direct AkiraTamai author review: `https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5777698218`;
- authorization-continuity negative fixture PR #37: `https://github.com/ripple-node-lab/mcp-verifiable-tools-demo/pull/37`;
- PR #37 merge commit: `803935c0fbcd34ead12976a52a6ad857c09e9fdc`;
- AkiraTamai confirmed that the HandoffProbe boundary reading is the intended one and identified nothing to correct;
- the upstream negative fixture mirrors the comparison shape: in-scope proof verification plus commitment match, versus widened schema-valid proof verification followed by approved-commitment mismatch rejection;
- the MCP #3354 issue description now explicitly frames the work as a pre-SEP proposal;
- the issue now explicitly documents authorization continuity and `inputCommitment` as the interface available to an external authority check;
- changelog `2026-09-22-002` thanks `@Heaviside479`, links the HandoffProbe discussion/result trail and links PR #37;
- the issue states an intent to continue proposal discussion through the MCP Security IG / Contributor Discord and an eventual Extensions Track SEP process;
- this proposal/changelog state is external impact and traceability evidence, not HandoffProbe adoption, endorsement, SEP acceptance or standardization;
- no independent external HandoffProbe rerun is established;
- evidence is now **External vector comparison + author review**;
- no new stable attack is admitted and the stable public corpus remains **23 attacks**.

#### MCP #3354 / Verifiable MCP authority-boundary signal — 2026-09-17

A separate MCP research signal arrived in `modelcontextprotocol/modelcontextprotocol#3354` and is intentionally **not** folded into A2A T-4.

- HandoffProbe raised the boundary between execution integrity and authorization continuity across an A2A → MCP handoff: `https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5682996881`.
- AkiraTamai explicitly agreed that this boundary belongs in the threat model: `https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5715753995`.
- The response separates four properties: integrity of the computation, truth of the inputs, validity of the program, and authorization of the inputs. The proposed Verifiable MCP extension claims only the first.
- `inputCommitment`, `circuitHash` and `nonce` can establish that a pinned program ran on committed inputs and produced an output; they do **not** establish that those inputs were within the upstream callers authority for that execution context.
- Akira described the HandoffProbe negative fixture as useful: a schema-valid but semantically widened call may still carry a fully valid execution proof, while the composed system must reject it because the approved authority does not cover those widened inputs.
- A possible layer boundary is an authority-supplied approved-argument commitment compared with the execution-side `inputCommitment`; the Verifiable MCP layer does not itself obtain or judge the approval.
- Akira stated that the current demo has no authority layer and is considering adding the negative case with a fixed approved-argument commitment. This is therefore a design/research signal, **not** evidence that the fixture has already been implemented or independently reproduced.
- This signal does not establish MCP specification acceptance, HandoffProbe adoption, compatibility, certification, partnership, endorsement, a new stable attack or a release requirement.
- Detailed queue record: `docs/MCP_3354_VERIFIABLE_RESULTS_QUEUE_20260917.md`.
- R4 is now closed. This work remains separately queued and must not interrupt the already queued T-4 path. Any implementation requires a separate later prioritization and normal research/admission decision.
- **External feedback obligation:** if HandoffProbe later produces a reproducible result for this seam, return the exact result to AkiraTamai in MCP `#3354`, including the pinned HandoffProbe commit/evidence, what the proof layer accepted, what the authority layer accepted/rejected, and the exact scope limitations. Invite correction and record any substantive response before closing this research item.

### CV-6 — first revenue validation

Target: first **3 paid accepted assessments**.

Measure acquisition source, qualification rate, scope quality, objections, price acceptance, testing/report/retest effort and follow-on demand.

After three paid assessments, explicitly decide whether:

- standard price should move toward EUR 2,490;
- standard scope should change;
- Custom Adapter / Private Test Pack demand is real;
- repeated delivery work should become productized.

## Success sequence

1. first qualified assessment request;
2. first accepted written scope;
3. first paid assessment;
4. first completed written report and retest;
5. three paid assessments;
6. repeat/follow-on paid work;
7. repeated organization-level demand for a productized commercial layer.

## Cloud / SaaS gate

Do not build HandoffProbe Cloud just because commercial validation is active.

Treat Cloud as a serious product-development candidate only when either:

- **3 independent organizations** request materially the same centralized capability; or
- **2 paying customers** request the same centralized capability with a credible ongoing use case.

Qualifying demand can include centralized scan history, scheduled scans, organization policies, GitHub organization integration, evidence retention, SSO/RBAC or audit/compliance exports.

## Exit gate

Phase 13 proves that real organizations will pay for value around HandoffProbe Core. The immediate milestone is the first completed paid assessment; the validation batch target is three paid accepted assessments. Pricing and scope are then updated from measured delivery evidence rather than assumptions.

---

# Phase 14 — HandoffProbe Cloud beta

Status: **CONDITIONAL — demand gate not yet satisfied**

Do not begin Cloud merely because Core development or commercial validation is
active.

Start productization only when the Phase 13 Cloud / SaaS gate is met:

- 3 independent organizations request materially the same centralized
  capability; or
- 2 paying customers request the same centralized capability with a credible
  ongoing use case.

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

Phase 14 is a conditional commercial/product lane. Waiting for Cloud demand must
not block Core research, post-GA maintenance or broader handoff work.

---

# Phase 15 — Enterprise product

Status: **CONDITIONAL — build only from demonstrated organization demand**

Potential capabilities:

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

Enterprise features require concrete customer or organization evidence.

Phase 15 does not need to complete before Phase 16 technical work can proceed.

---

# Phase 16 — Broader handoff coverage

Status: **PLANNED — research may continue before GA; stable expansion remains evidence-gated**

This is the long-term technical expansion lane after the original
A2A -> MCP wedge is proven.

It is independent of whether Cloud or Enterprise is built.

Research, source freezing, overlap analysis and deterministic fixture work may
continue before Phase 14 or Phase 15 and may also continue while external GA
feedback is pending.

Stable product admission remains evidence-gated.

Candidates:

- A2A -> A2A
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

Before v1 GA, any candidate promoted into the stable public product requires a
normal admission decision and a fresh pre-GA release/SemVer review.

After v1 GA, backward-compatible new handoff coverage should normally become a
`1.x` minor release rather than requiring a new major version.

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
