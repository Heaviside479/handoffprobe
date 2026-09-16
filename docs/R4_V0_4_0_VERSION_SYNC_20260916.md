# R4 v0.4.0 Version Synchronization — 2026-09-16

Status: **R4.2 COMPLETE — candidate version metadata synchronized to `0.4.0`; nothing published or tagged.**

## Purpose

Synchronize the version-bearing source and package metadata after the R4.1 scope/SemVer audit admitted one backward-compatible public capability addition for the next minor release.

This step prepares a release candidate. It does not publish npm, create or move a Git tag, create a GitHub Release, update GitHub Marketplace, or claim either public website already serves v0.4.0.

## R4.1 prerequisite

R4.1 classified the evidence-backed scope as a backward-compatible MINOR release candidate:

- new stable attack: `HP-AUTH-006 — Stale task authorization reused for later effect`;
- canonical stable corpus: **23 attacks**;
- existing CLI command surface unchanged;
- report schema unchanged;
- exit semantics unchanged;
- package-root export map unchanged;
- Node policy unchanged;
- protocol baseline remains A2A 1.0 → MCP 2026-07-28.

## Version synchronization

The release-candidate source metadata is synchronized to `0.4.0` in:

- `package.json`;
- root `package-lock.json` version;
- root package entry in `package-lock.json`;
- exported `VERSION` in `src/index.ts`;
- current package-release metadata tests;
- CLI `--version` expectation;
- terminal, JSON and Markdown reporter version expectations.

The immutable published `v0.3.0` tag and artifact remain historical and must not be moved or rewritten.

## Publication state

After R4.2:

- source candidate version: `0.4.0`;
- public npm version remains `handoffprobe@0.3.0` until publication;
- no `v0.4.0` tag exists as part of this step;
- no GitHub Release `HandoffProbe v0.4.0` is created as part of this step;
- no Marketplace update is claimed;
- no website is allowed to claim that v0.4.0 is publicly available yet.

The repository may describe `0.4.0` as a release candidate before publication, but release-facing installation commands that claim a public registry version must remain truthful until the npm publication is verified.

## Next step

R4.3 must reconcile the release-facing candidate documentation for the 23-attack v0.4.0 scope, including release notes, current README/usage/install candidate wording, attack catalog/current specification, and the coordinated publication checklist.

Only after the complete release candidate passes the full repository and package gates may the immutable tag, GitHub Release and npm publication sequence begin.
