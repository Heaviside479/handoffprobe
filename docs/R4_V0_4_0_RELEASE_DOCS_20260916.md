# R4 v0.4.0 Release Documentation Reconciliation — 2026-09-16

Status: **R4.3 CANDIDATE — release-facing source documentation reconciled; publication still forbidden until final gates and merged release commit.**

## Purpose

Prepare release-facing repository documentation for the already-admitted v0.4.0 candidate without rewriting historical release facts or claiming that npm, GitHub Release, Marketplace or the public websites already serve v0.4.0.

## Candidate truth

- source/package candidate: `0.4.0`;
- stable corpus: **23 attacks** = 12 P0 + 10 P1 + 1 advanced;
- new stable ID: `HP-AUTH-006`;
- current public npm release during preparation: `handoffprobe@0.3.0`;
- A2A 1.0 → MCP 2026-07-28 unchanged;
- report schema `1` unchanged;
- CLI commands and exit semantics unchanged;
- package-root export map unchanged;
- GitHub Action inputs/outputs unchanged.

## Historical-record rule

Historical v0.1/v0.2/v0.3, Phase 5/6 and T-3 records that truthfully describe a 22-attack state are not mechanically rewritten to 23.

Current documentation instead adds explicit v0.4.0 candidate sections/addenda where needed.

## Reconciled current surfaces

R4.3 reconciles:

- `README.md`;
- `docs/INSTALLATION.md`;
- `docs/USAGE.md`;
- `CHANGELOG.md`;
- `docs/ATTACK_CATALOG.md`;
- `docs/CLI_SPECIFICATION.md`;
- `docs/ROADMAP.md`;
- `docs/V0_4_0_RELEASE_NOTES.md`.

Documentation tests are updated so current candidate truth and historical v0.3.0 publication truth can coexist.

## Publication boundary

R4.3 does not:

- create or move `v0.4.0`;
- create a GitHub Release;
- publish npm;
- change Marketplace presentation;
- update either production website;
- claim external exact-version or Action verification for v0.4.0.

Those actions remain gated on the final candidate checks, protected PR merge and controlled publication sequence.
