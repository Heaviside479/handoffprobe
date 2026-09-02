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

Status: active

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
