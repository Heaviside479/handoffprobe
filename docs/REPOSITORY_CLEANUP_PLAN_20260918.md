# HandoffProbe repository cleanup and current-state reconciliation plan

Status: **COMPLETE — Cleanup A through Cleanup E completed by 2026-09-19.**

Date started: 2026-09-18

Purpose:

Keep the HandoffProbe repository easy to understand, maintain and hand over between
contributors, coding agents and separate ChatGPT/work sessions without losing
research provenance or historical release evidence.

This cleanup is a repository-hygiene and documentation-reconciliation track.

It does **not** authorize:

- a new stable attack;
- a package-version change;
- a release;
- a protocol-baseline change;
- a scanner/runtime behavior change;
- deletion of historical research evidence merely because it is old.

Current public product truth at the start of this cleanup:

- current verified public release: `handoffprobe@0.4.0`;
- stable public corpus: **23 attacks**;
- stable composition: 12 P0 + 10 P1 + 1 advanced (`HP-AUTH-006`);
- protocol baseline: A2A 1.0 → MCP 2026-07-28;
- public CLI, npm package and reusable GitHub Action already exist;
- T-3 is complete;
- T-4 is complete;
- Reddit R-1, R-2 and R-3 have completed deterministic execution, admission and
  public result return;
- Phase 10 reliability hardening remains active;
- Phase 13 commercial validation runs in parallel.

---

# Cleanup A — Git hygiene

Status: **COMPLETE — 2026-09-18**

Initial audit found 43 non-main remote branches.

They were separated into:

- 27 branches whose commits were already fully reachable from `main`;
- 16 divergent branches containing branch-only history requiring separate review.

Safety rule:

A remote branch could be removed during Cleanup A only when:

1. the remote branch existed;
2. its commit was an ancestor of `origin/main`;
3. it had no open pull request.

Result:

- 27 verified merged remote branches deleted;
- 16 divergent branches preserved;
- obsolete PR #72 closed without merge;
- PR #72 branch intentionally preserved for later divergent-branch audit;
- no open pull requests remained after Cleanup A;
- final remote inventory: `main` + 16 preserved divergent branches.

PR #72:

`Add v0.3.0 post-release GitHub discovery roadmap`

Disposition:

**CLOSED / NOT MERGED / superseded by later release and roadmap work.**

Its branch remains preserved until the divergent-branch audit decides whether its
unique historical commit should be retained elsewhere or the branch can be removed.

## Preserved divergent branches

Do not delete these merely because they are old:

- `chore/marketing-repo-pointer-20260910`
- `docs/commercial-product-track-20260916`
- `docs/commercial-validation-20260912`
- `docs/handoff-contract-research-20260908`
- `docs/handoffprobe-name-migration-20260821`
- `docs/model-mediated-mutation-roadmap-20260917`
- `docs/point-growth-to-central-marketing-20260901`
- `docs/project-foundation-20260821`
- `docs/release-roadmap-v0.1.1-v0.2.0-20260908`
- `docs/research-gap-audit-20260821`
- `docs/semantic-authority-followup-20260912`
- `docs/t4-witness-observation-queue-20260916`
- `fix/qs-6.16.0-20260908`
- `release/v0.1.x`
- `release/v0.1.1-security-maintenance`
- `roadmap/v0.3.0-postrelease-github-discovery`

Each branch must later be classified individually as one of:

- `SAFE_TO_DELETE_SUPERSEDED`;
- `HISTORICAL_BRANCH_KEEP`;
- `UNIQUE_CONTENT_MUST_RECONCILE`;
- `NEEDS_FURTHER_REVIEW`.

No force deletion is allowed merely to make the branch list shorter.

---

# Cleanup B — current documentation reconciliation

Status: **COMPLETE — 2026-09-18**

Goal:

Make the current repository-facing documentation describe the actual HandoffProbe
product rather than leaving old v0.1/v0.3 development language in active documents.

Files requiring explicit reconciliation include at least:

- `README.md`;
- `PROJECT_CONTEXT.md`;
- `AGENTS.md`;
- `CONTRIBUTING.md`;
- `SECURITY.md`;
- `docs/ARCHITECTURE.md`;
- `docs/PRODUCT.md`;
- `docs/ROADMAP.md`;
- `docs/ROADMAP_COMMERCIAL_PRODUCT_TRACK_20260916.md`;
- `CHANGELOG.md`.

Known stale/current-state mismatches found during the read-only audit include:

- active docs still referring to v0.3.0 / 22 stable attacks;
- `PROJECT_CONTEXT.md` still describing npm/CLI and GitHub Action as planned/future;
- `ARCHITECTURE.md` still titled and written primarily as planned architecture;
- active v0.1-era wording that now describes historical scope rather than current state;
- commercial-track text still preserving old T-3/T-4 scheduling state;
- README text still implying T-4 remains open although T-4 has closed;
- `CHANGELOG.md` `Unreleased` section still containing foundation work that has
  long since shipped.

Rules:

- reconcile active/current docs;
- preserve historical release/research records as historical truth;
- do not rewrite old evidence documents merely to make their historical statements
  look current;
- distinguish historical snapshot facts from current product truth;
- preserve exact external-source provenance.

## Cleanup B.2 — current core instruction documents

Status: **COMPLETE — 2026-09-18**

Reconciled:

- `PROJECT_CONTEXT.md`;
- `AGENTS.md`;
- `CONTRIBUTING.md`;
- `SECURITY.md`.

B.2 updates current-facing release/corpus/product truth to v0.4.0 / 23 stable
attacks, removes obsolete pre-alpha/core-CLI-phase instructions, records the
actual repository quality gates and preserves the distinction between current
documentation and immutable historical evidence.

No runtime behavior, attack identity, protocol baseline, package version or release
state changed through B.2.

## Cleanup B.3 — architecture, product, commercial track and changelog

Status: **COMPLETE — 2026-09-18**

Reconciled:

- `docs/ARCHITECTURE.md`;
- `docs/PRODUCT.md`;
- `docs/ROADMAP_COMMERCIAL_PRODUCT_TRACK_20260916.md`;
- `CHANGELOG.md`.

B.3 replaces the remaining active v0.1/planned-architecture framing with the
current v0.4.0 / 23-attack product state, updates the commercial track from the
obsolete T-3/T-4/22-attack checkpoint, and removes already-shipped foundation work
from the `Unreleased` changelog section.

Historical release and research documents remain unchanged as historical evidence.

No runtime behavior, stable attack identity, protocol baseline, package version,
report schema or release state changed through B.3.

Cleanup B is now complete.

---

# Cleanup B.1 — compact README / npm presentation

Status: **COMPLETE — 2026-09-18**

The root `README.md` serves both:

- the GitHub repository landing page;
- the README rendered for the npm package on npmjs.com when a new package version
  is normally published.

There is no separate npm README planned.

The README should become materially more compact by removing duplication while
keeping the primary product story and fast-start path intact.

Target:

- reduce current README length roughly **40–50%** where this can be achieved
  through deduplication;
- do not delete important safety, release or product facts merely to hit a byte count;
- prefer links to canonical long-form documentation over repeating whole sections.

The compact README should retain:

1. product name and one-line value proposition;
2. why handoff-specific security matters;
3. current verified release: `0.4.0`;
4. current stable corpus: **23 attacks**;
5. A2A 1.0 → MCP 2026-07-28 baseline;
6. exact quick-start command;
7. concise secure/vulnerable demonstration;
8. concise GitHub Action example;
9. safety / authorization boundary;
10. evidence/research link;
11. commercial Security Assessment CTA;
12. contributor/security/documentation links.

Detailed material should primarily live in:

- `docs/INSTALLATION.md`;
- `docs/USAGE.md`;
- `docs/ATTACK_CATALOG.md`;
- `docs/CLI_SPECIFICATION.md`;
- `docs/GITHUB_INTEGRATION_SPECIFICATION.md`;
- `EVIDENCE.md`;
- `SECURITY.md`;
- `CONTRIBUTING.md`.

The README cleanup itself does **not** justify a package release.

The compact README becomes visible on npmjs.com with the next otherwise justified
normal HandoffProbe release because the root README is part of the package surface.

Completion record:

- the root README was rewritten as a compact current-product landing page;
- v0.4.0, 23 stable attacks, A2A 1.0 → MCP 2026-07-28, quick start,
  vulnerable demo, immutable Action pin, safety boundary, evidence policy,
  commercial assessment CTA and opt-in feedback paths remain visible;
- detailed configuration, reporter, output, exit-code and troubleshooting material
  remains canonical in `docs/USAGE.md`, `docs/CLI_SPECIFICATION.md`,
  `docs/INSTALLATION.md` and `docs/GITHUB_INTEGRATION_SPECIFICATION.md`;
- README regression tests now protect the compact landing-page contract instead of
  requiring a duplicated full CLI/Action manual;
- historical Phase 8/T-3/T-4 regression coverage remains, but current README tests
  no longer require superseded historical status statements to remain on the current
  product landing page;
- no runtime behavior, attack identity, package version or release state changed;
- npm presentation will change only with the next otherwise justified normal release.

---

# Cleanup C — documentation navigation

Status: **COMPLETE — 2026-09-19**

Goal:

Make the existing documentation corpus understandable without deleting valuable
research provenance.

Current repository evidence includes many Phase, T-series, release and external
research records. Their volume is not itself a defect.

Preferred approach:

Create a navigation/index document such as:

`docs/README.md`

It should clearly separate:

## Current product documentation

Examples:

- installation;
- usage;
- architecture;
- threat model;
- attack catalog;
- CLI contract;
- GitHub integration;
- compatibility policy.

## Current roadmap / active planning

Examples:

- main roadmap;
- research-candidate index;
- commercial product track;
- repository cleanup plan.

## Research / evidence records

Examples:

- Phase 9;
- T-1 through T-4;
- MCP external research;
- Reddit R-1/R-2/R-3;
- external review and traceability records.

## Historical release records

Examples:

- v0.1.x;
- v0.2.0;
- v0.3.0;
- v0.4.0 release evidence.

Guardrail:

Do not perform a mass file move solely for cosmetic organization.

Moving historical documents would create large link churn and unnecessary regression
risk. Index first; relocate only when a concrete maintenance benefit exists.

Completion record:

- created `docs/README.md` as the documentation navigation layer;
- separated current product docs, active planning, research/evidence, historical
  release records and supporting references;
- linked every existing top-level file under `docs/` from the index;
- added a discoverability link from the root `README.md`;
- added regression coverage so newly added top-level docs cannot silently remain
  outside the index;
- did not mass-move or rename historical evidence;
- did not change runtime behavior, stable attack identity, package version,
  protocol baseline, report schema or release state.

Cleanup C is complete.

---

# Cleanup D — issue and branch reconciliation

Status: **COMPLETE — 2026-09-19**

## Divergent branch audit

All 16 preserved divergent branches were individually audited against current
`origin/main`, including patch-equivalence checks, branch-tip freezes, file-level
comparison and special review of unique historical content.

Final disposition:

### Deleted as superseded

15 remote branches were deleted after their audited tips were reverified unchanged:

- `chore/marketing-repo-pointer-20260910`
- `docs/commercial-product-track-20260916`
- `docs/commercial-validation-20260912`
- `docs/handoff-contract-research-20260908`
- `docs/handoffprobe-name-migration-20260821`
- `docs/model-mediated-mutation-roadmap-20260917`
- `docs/point-growth-to-central-marketing-20260901`
- `docs/project-foundation-20260821`
- `docs/release-roadmap-v0.1.1-v0.2.0-20260908`
- `docs/research-gap-audit-20260821`
- `docs/semantic-authority-followup-20260912`
- `docs/t4-witness-observation-queue-20260916`
- `fix/qs-6.16.0-20260908`
- `release/v0.1.x`
- `release/v0.1.1-security-maintenance`

The deletion was performed as one atomic remote update after exact audited branch
tips were reverified.

### Historical branch retained

`roadmap/v0.3.0-postrelease-github-discovery`

was intentionally retained at:

`7446452d1e5f1d4e3a0e0d900ec8ae9abd0c8543`

Its branch-only document records a historical v0.3.0 post-publication/GitHub-native
discovery execution plan that is not present on current `main`. It remains historical
evidence and is not current product truth.

Final remote branch inventory after Cleanup D:

- `main`
- `roadmap/v0.3.0-postrelease-github-discovery`

## GitHub issue reconciliation

Issue #38:

`Evaluate protocol-neutral Handoff Contract integrity model after v0.1.1`

was closed as completed on 2026-09-19 because its original evaluation purpose was
superseded by the completed T-2.1 through T-2.6 work.

The closeout explicitly preserves the independent T-2.7 state:

**WAITING FOR RESPONSE from Bayu.**

Closing issue #38 does not complete T-2.7, does not imply external confirmation and
does not treat silence as validation. If no substantive review arrives within the
documented review window, the permitted closeout remains:

`NO EXTERNAL REVIEW RECEIVED`

Cleanup D did not modify contributor issues #22, #23 or #24.

Cleanup D is complete.

---

# Cleanup E — reliability and final repository verification

Status: **COMPLETE — 2026-09-19**

Completion record:

- focused cleanup/documentation regression coverage passed;
- `git diff --check` passed;
- the complete `npm run check` gate passed;
- `npm run package:check` passed;
- the exact dry-run npm payload remained `handoffprobe@0.4.0`;
- the compact root `README.md` remained included in the package payload;
- the stable public corpus remained **23 attacks**;
- report schema remained `1`;
- Cleanup E changed documentation/tests only and did not change production
  `src/`, package metadata, Action metadata or runtime behavior;
- current repository evidence confirms Linux CI through `ubuntu-latest` + Node 24;
- macOS CI, Windows CI, dependency-upgrade process and stronger
  compatibility-matrix enforcement remain open P10.4 work;
- the repository secret-safety gate remained part of the full quality run;
- cleanup produced no evidence-backed reason for a new stable attack, version bump
  or public release.

Cleanup E is complete.

The repository cleanup and current-state reconciliation track is complete.

---

# Product direction preserved during cleanup

Repository cleanup must not distract from the main product direction.

The current high-level sequence remains:

`reliability → real integrations → external usage → paid assessments → recurring demand`

Only after repeated organization-level demand should HandoffProbe consider:

`Teams/Cloud → subscription proof → enterprise expansion`

The largest product gap remains real-system usability.

HandoffProbe already has:

- a deterministic engine;
- a stable CLI;
- 23 stable attacks;
- synthetic secure/vulnerable fixtures;
- a protocol laboratory;
- GitHub Action integration;
- reproducible research/evidence workflows.

The next major product proof is not simply increasing the attack count.

It is demonstrating that external users can reliably apply HandoffProbe to real,
owned or explicitly authorized agent-handoff systems.

The existing adapter admission and Cloud/SaaS demand gates remain binding.

---

# Continuity / handoff rule

This document is the persistent repository handoff for this cleanup track.

When work continues in another chat, coding-agent session or contributor context:

1. read this document;
2. read `docs/ROADMAP.md`;
3. verify current `main`;
4. continue from the first incomplete cleanup section;
5. never infer completion merely from an older chat transcript.

Current next step:

**Cleanup is complete. Return to Phase 10 reliability work with P10.3 reproducible
performance benchmarks as the first incomplete roadmap item.**
