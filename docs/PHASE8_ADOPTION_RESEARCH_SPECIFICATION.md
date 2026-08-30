# Phase 8 Adoption and Research Operating Contract

Status: active

Baseline date: 2026-08-29

## Purpose

Phase 8 turns the public v0.1.0 release into an evidence-driven adoption and research loop.

The operating rule is simple: measure real friction and real demand before adding product surface area.

HandoffProbe remains a local-first, developer-first, open-source security tool. Phase 8 does not introduce a hosted control plane, accounts, billing, paid analytics, hidden telemetry, paid AI APIs, or speculative framework support.

## Phase 8 principles

1. First-run friction comes before feature expansion.
2. Public and opt-in signals are preferred over product telemetry.
3. GitHub stars are a secondary signal, not the primary success metric.
4. Adapter work requires evidence of real demand or a clear research need.
5. Security research must be reproducible.
6. Confirmed third-party vulnerabilities require responsible disclosure before public detail.
7. A fixed real-world security issue should become a regression test when technically and legally appropriate.
8. The released `handoffprobe@0.1.0` artifact remains immutable and must never be republished with changed contents.

## Raw adoption baseline

The Phase 8.0A read-only baseline was collected immediately after the public v0.1.0 launch.

GitHub repository baseline:

- stars: 0
- forks: 0
- watchers/subscribers reported by the baseline: 0
- open issues and pull requests: 0
- contributors: 1
- repository visibility: public
- license: Apache-2.0

GitHub traffic rolling-window baseline:

- views: 4 total
- unique viewers: 1
- clones: 87 total
- unique cloners: 55
- top referrer observed: `github.com`
- release asset downloads: 3

npm baseline:

- public version: `0.1.0`
- dist-tag `latest`: `0.1.0`
- published package shasum: `2aa56211d7559cac2cf2052275af45331fba6663`
- npm point-download API returned HTTP 404 for last-day, last-week and last-month at collection time
- the unavailable npm download counters are recorded as unavailable, not as zero

## Baseline interpretation rules

The raw counters are not user counts.

GitHub clone counts can include the maintainer, CI, automation, caches and repeated cloning. GitHub traffic is a rolling fourteen-day owner-visible window and will age out. Release asset downloads are not equivalent to npm installs. npm download counters may lag a new package publication or be temporarily unavailable.

No claim about external adoption may be made from a raw counter without supporting context.

## Measurement sources

Preferred low-cost measurement sources are:

- npm public download counters when available
- GitHub repository traffic
- GitHub release asset downloads
- GitHub issues and pull requests
- external contributors
- public repositories that visibly use HandoffProbe
- GitHub Action usage that can be observed publicly
- direct opt-in feedback
- adapter requests
- responsible vulnerability disclosures
- audit, support and custom-integration inquiries

HandoffProbe must not add hidden usage telemetry merely to improve these metrics.

## Phase 8 work packages

### 8.0A — Raw adoption baseline

Status: completed.

Collect a read-only post-launch baseline without changing the repository.

### 8.0B — Adoption and research operating contract

Status: completed by this specification when merged to `main`.

Freeze the metrics, interpretation rules, privacy constraints and evidence gates for Phase 8.

### 8.1A — First-run friction audit

Run the public package as a new user would.

Audit at minimum:

- Node and npm prerequisites
- clean temporary-directory install
- `npx` first run
- `--help`
- `--version`
- `list`
- secure bundled scan
- vulnerable single-attack demo
- JSON output
- configuration discovery
- common usage/configuration mistakes
- error messages and recovery guidance
- README path from discovery to first successful scan

Record time-to-first-success and every avoidable manual decision or failure.

### 8.1B — Fix the highest measurable first-run friction

Change only friction demonstrated by 8.1A.

Every code behavior change requires regression coverage. Documentation-only friction may be corrected directly with documentation tests where appropriate.

### 8.2A — CI adoption audit

Test the GitHub Action onboarding path from an external-consumer perspective.

Verify:

- minimal workflow example
- permissions
- target selection
- severity threshold behavior
- artifacts
- pull-request summary
- failure semantics
- troubleshooting path

### 8.2B — Telemetry-free adoption signals

Improve only public or opt-in ways to understand repeat usage and integration demand.

Do not add hidden product telemetry.

### 8.3A — Adapter demand research

Collect evidence from issues, public ecosystems, research cases and direct requests.

Rank candidate adapters by:

- handoff-specific security value
- demonstrated demand
- reproducibility
- maintenance cost
- protocol/version stability
- ability to test without paid infrastructure

### 8.3B — First evidence-backed adapter

Implement an adapter only if 8.3A establishes a clear winner.

If no candidate meets the evidence gate, do not build an adapter merely to satisfy the roadmap.

### 8.4A — Reproducible research case

Publish a reproducible handoff-security case using owned, synthetic, explicitly authorized or responsibly disclosed systems.

Separate protocol-local correctness from the cross-protocol invariant.

### 8.5A — Contributor loop

Reduce contribution friction with focused issues, reproducible fixtures, clear test expectations and small externally approachable tasks.

### 8.6A — Phase 8 review

Re-run the adoption baseline, compare deltas with appropriate caveats, summarize research findings and choose the Phase 9 target from evidence.

## Adapter admission gate

An adapter enters implementation only when all of the following are true:

- the target participates in a meaningful handoff/composition path
- there is real user, integration or research evidence for it
- the security value is not merely generic single-protocol scanning
- a deterministic local or authorized fixture can be built
- maintenance and versioning risk are understood
- the adapter does not require paid infrastructure for the open-source core

## Research and disclosure gate

For a suspected real vulnerability:

1. reproduce the issue with minimal evidence
2. verify authorization to test
3. separate handoff failure from protocol-local failure
4. preserve only necessary, redacted evidence
5. contact the affected maintainer or vendor privately when disclosure is required
6. allow an appropriate remediation window
7. publish only after responsible-disclosure conditions are satisfied
8. add a regression test after remediation when appropriate

## Phase 8 success criteria

Phase 8 succeeds when HandoffProbe has reduced demonstrated first-run friction and produced evidence about real usage or demand.

Strong signals include:

- successful public installs and scans
- repeat usage
- real CI adoption
- public repositories using HandoffProbe
- external contributors
- high-quality issues
- evidence-backed adapter demand
- reproducible research cases
- responsible vulnerability disclosures
- audit or custom-integration inquiries

Stars remain useful but secondary.

## Explicitly out of scope for Phase 8 baseline work

- SaaS dashboard
- user accounts
- billing
- hosted scan history
- paid analytics
- hidden telemetry
- paid LLM APIs
- speculative multi-framework expansion
- generic prompt-injection scanner scope
- generic MCP-only scanner scope
