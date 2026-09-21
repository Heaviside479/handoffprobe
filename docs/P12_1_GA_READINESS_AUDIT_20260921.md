# P12.1 GA readiness audit and v1 contract-freeze candidate

Date: 2026-09-21

Status: **ACTIVE — GA blockers identified; no v1 release authorized**

## Purpose

Evaluate the current HandoffProbe development state against the Phase 12
`HandoffProbe v1.0 GA` requirements without changing the package version,
publishing a release, or treating roadmap numbering as release authorization.

P12.1 determines:

1. which GA requirements already have sufficient repository evidence;
2. which requirements still block v1.0;
3. which public contracts are candidates for the v1 stability promise;
4. which later Phase 12 work packages are required before a final release
   decision.

This audit does not require artificial `0.5.0` through `0.9.0` releases.

The final release path remains undecided until the Phase 12 gates are complete.

## Audited baseline

Repository baseline:

`354c5a3a6d61c13211e2a7f5c9297dcdea8ace22`

Current verified public release:

`handoffprobe@0.4.0`

Current public product contract:

- 23 stable attacks;
- 12 P0 attacks;
- 10 P1 attacks;
- 1 advanced stable attack: `HP-AUTH-006`;
- A2A 1.0 -> MCP 2026-07-28;
- Node.js `>=24 <25`;
- config schema `1`;
- report schema `1`;
- CLI exit semantics `0 / 1 / 2 / 3`.

## P12.1 execution baseline

The clean Phase 12 baseline run completed successfully on 2026-09-21.

Observed results:

- full repository check: PASS;
- 126 test files passed;
- 633 tests passed;
- build: PASS;
- package dry-run: PASS;
- built CLI version: `HandoffProbe 0.4.0`;
- secure stable corpus: 23 PASS / 0 FAIL / 0 ERROR;
- JSON report schema: `1`;
- report finding count: 23;
- final worktree remained clean.

No package-version change was made by the audit.

## GA requirement assessment

### 1. Stable Core engine

State: **READY CANDIDATE**

Evidence already exists for:

- deterministic runner behavior;
- reusable attack definitions;
- explicit adapter boundaries;
- structured findings and evidence;
- timeout/error separation;
- secret redaction;
- stable package-root Core exports;
- deterministic secure/vulnerable execution.

Before GA, the package-root Core API must receive an explicit v1 freeze decision.

### 2. Stable CLI

State: **READY CANDIDATE**

Current stable command surface:

- `handoffprobe test`
- `handoffprobe list`
- `handoffprobe explain <HP-ID>`
- `handoffprobe --version`
- `handoffprobe --help`

Current exit semantics remain:

- `0` — successful scan with no qualifying security failure;
- `1` — qualifying security failure;
- `2` — usage/configuration failure;
- `3` — scanner/runtime/output failure.

A final v1 freeze must explicitly preserve or deliberately revise this contract
before GA.

### 3. Stable config schema

State: **READY**

Config schema version `1` is explicitly defined and compatibility policy exists.

The current allowed keys are:

- `target`
- `tests`
- `failOn`
- `reporter`
- `output`

Unknown keys are rejected.

### 4. Stable report schema

State: **READY**

JSON report schema version `1` is explicitly defined, documented and covered by
regression tests.

The P12.1 execution baseline reproduced schema `1` successfully.

### 5. All P0 attacks mature

State: **READY**

All 12 mandatory P0 attacks are stable and remain covered by deterministic
secure/vulnerable regression paths.

### 6. Meaningful additional handoff coverage

State: **READY**

Beyond the 12 P0 attacks, the stable corpus contains:

- 10 P1 attacks;
- `HP-AUTH-006` as one additional advanced stable authorization-freshness
  invariant.

Substantial research coverage also exists outside the stable corpus without
being promoted merely to increase attack count.

### 7. GitHub Action mature

State: **READY CANDIDATE**

The reusable source-backed Action has:

- deterministic scanner execution;
- stable inputs and outputs;
- machine-readable artifacts;
- Markdown summary generation;
- explicit exit-code propagation;
- immutable-SHA guidance;
- external consumer verification from earlier release work.

The Action input/output contract still requires an explicit v1 freeze decision.

### 8. Compatibility documented

State: **READY**

The current compatibility source of truth records:

- Node `>=24 <25`;
- CI Node 24;
- Ubuntu, macOS and Windows repository CI;
- A2A 1.0;
- MCP 2026-07-28;
- exact protocol dependency versions.

Compatibility drift is machine-checked by the normal repository gate.

### 9. CI comprehensive

State: **READY**

Current repository validation includes:

- format;
- lint;
- typecheck;
- secret-safety checking;
- compatibility-drift checking;
- unit/integration/regression tests;
- build;
- package validation;
- Dependency Review;
- Linux/macOS/Windows CI coverage.

The P12.1 baseline passed the complete local repository gate.

### 10. Safe defaults

State: **READY**

Bundled execution remains local/synthetic and does not require a paid AI
service.

Testing third-party systems without authorization is outside the product safety
boundary.

### 11. Threat model current

State: **BLOCKED**

`docs/THREAT_MODEL.md` still contains historical v0.1-specific wording,
including:

- `The v0.1 threat model covers ...`
- `v0.1 should use harmless fake tools ...`

The underlying threat model has received later additions, but its release-facing
scope wording is not fully reconciled with the current product state.

A Phase 12 threat-model reconciliation is required before GA.

### 12. Limitations documented

State: **PARTIAL — CONSOLIDATION REQUIRED**

Limitations and non-claims are present across README, SECURITY.md, research
records, compatibility documentation and release guidance.

Before GA, HandoffProbe should provide one current, user-facing limitations
contract that distinguishes at minimum:

- bundled synthetic fixtures from production validation;
- composition testing from generic A2A/MCP conformance;
- supported protocol versions from unsupported versions;
- supported runtime/platform claims;
- stable attacks from research-only cases;
- evidence-backed findings from certification or security guarantees;
- authorized testing from arbitrary internet scanning.

### 13. External users demonstrated

State: **BLOCKED**

HandoffProbe has external technical inputs, reviews and public research
interaction.

That is not automatically equivalent to demonstrated external product
dependence or repeat real-world usage.

Historical Phase 8 evidence explicitly avoided interpreting raw clones/downloads
as verified users.

P11.6 is also still waiting for fresh external feedback on the current
`handoffprobe@0.4.0` user-facing experience.

Before GA, the exact evidence threshold for `external users demonstrated` must
be defined and satisfied without inventing adoption.

### 14. Release automation proven

State: **PARTIAL**

Implemented Phase 11 release engineering includes:

- release-candidate workflow;
- exact package installation/execution;
- reproducible release-artifact checking;
- SBOM generation;
- npm staging workflow;
- Trusted Publishing / OIDC-oriented publication boundary;
- explicit release guidance.

The new release-candidate path has repository evidence.

Before GA, the final Phase 12 release path must determine what real staged or
release-candidate publication proof is required before immutable `1.0.0`
publication.

### 15. Upgrade process documented

State: **READY**

Current user guidance includes:

- `docs/UPGRADING.md`;
- `docs/MIGRATION.md`;
- explicit compatibility classification;
- rollback/pinning guidance;
- immutable release expectations.

## Phase 11 dependency

Phase 12 preparation may proceed in parallel, but Phase 11 is not yet fully
closed.

P11.6 remains active until it records either:

- fresh external feedback and its disposition; or
- a clearly bounded `NO RESPONSE` outcome that is not misrepresented as
  validation.

Any fresh Critical or High HandoffProbe defect discovered through P11.6 must be
resolved or explicitly block the Phase 11 exit gate.

## Execution principle after P12.1

External evidence is asynchronous.

A pending reviewer, research-author or user response does not justify stopping
unrelated internal engineering.

While external evidence remains pending, HandoffProbe should continue with:

- threat-model and limitations reconciliation;
- v1 public-contract review;
- internal GA hardening;
- research and admission work;
- release-candidate engineering;
- commercial validation.

External evidence blocks only the gate that explicitly requires it.

A reproducible Critical or High HandoffProbe defect is an exception and becomes
an immediate release blocker.

The final `1.0.0` GA decision still requires every GA-specific external evidence
gate to be satisfied honestly.

## v1 public-contract freeze candidate

The following existing surfaces are candidates for the HandoffProbe v1
stability promise:

1. CLI commands and option semantics;
2. exit codes `0 / 1 / 2 / 3`;
3. config schema version `1`;
4. JSON report schema version `1`;
5. package-root public exports;
6. GitHub Action inputs and outputs;
7. stable `HP-*` identifiers and their security meaning;
8. Node.js compatibility contract;
9. A2A/MCP protocol compatibility contract;
10. published release/tag immutability.

P12.1 does **not** yet declare these contracts permanently frozen.

Before GA, each surface must either be:

- explicitly accepted into the v1 contract; or
- intentionally changed with evidence, compatibility classification and
  migration guidance.

Once v1.0 is published, incompatible changes to the accepted public contract
belong to a later major-version decision.

## Version decision

P12.1 does not change `0.4.0`.

There is no requirement to publish artificial intermediate versions merely to
reach `1.0.0`.

The later Phase 12 release decision must choose an evidence-backed path such as:

- remain on `0.4.0` while blockers are resolved;
- publish a justified pre-1.0 release if actual public product scope requires
  one;
- use a `1.0.0` release candidate when final external/release validation
  benefits from a prerelease;
- publish `1.0.0` only after all GA blockers are closed.

No option is selected by this audit.

## Blocking work after P12.1

Current identified GA blockers/follow-ups are:

1. reconcile the threat model to the current product;
2. consolidate the current product limitations;
3. define and satisfy the `external users demonstrated` evidence gate;
4. complete P11.6 independently;
5. explicitly freeze the v1 public contracts;
6. prove the final GA release path and publication controls;
7. run a final complete GA candidate verification before any immutable v1.0
   publication.

## P12.1 decision

HandoffProbe has a strong technical GA candidate baseline, but v1.0 is **not yet
authorized**.

The current product remains `handoffprobe@0.4.0`.

Phase 12 should now close the identified evidence and contract gaps one at a
time rather than publishing a major version because of roadmap numbering,
elapsed time or marketing pressure.
