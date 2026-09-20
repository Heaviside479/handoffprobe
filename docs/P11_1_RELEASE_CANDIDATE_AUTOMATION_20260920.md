# P11.1 release-candidate automation

Date: 2026-09-20

Status: **IMPLEMENTATION CANDIDATE — protected PR validation pending**

## Purpose

Introduce the first Phase 11 release-engineering automation without publishing
anything.

The workflow answers one question:

**Can the current repository state produce a valid HandoffProbe npm release
candidate?**

It does not decide that a release should exist.

## Trigger model

The release-candidate workflow can run:

- on relevant pull requests;
- manually through GitHub Actions with `workflow_dispatch`.

The initial implementation intentionally has no tag trigger.

## Security boundary

The workflow has repository permission:

`contents: read`

It does not have:

- `contents: write`;
- `id-token: write`;
- package-write permission;
- an npm token;
- a GitHub release creation step;
- a tag creation step;
- an npm publication step.

Therefore this P11.1 slice cannot publish a package, create a release or create
a tag.

## Candidate validation

The workflow:

1. checks out the exact workflow commit without persisted credentials;
2. configures Node 24;
3. installs the locked dependency graph with `npm ci`;
4. runs the complete repository quality gates;
5. builds an actual npm tarball in runner temporary storage;
6. verifies required package files and rejects repository-only material;
7. records the candidate SHA-256 in the workflow log;
8. installs the exact candidate tarball into a clean temporary project;
9. verifies that the installed CLI reports the package version;
10. runs the bundled secure HandoffProbe target from that installed package;
11. verifies that the repository worktree remains clean.

## Publication rule

A successful Release Candidate workflow is evidence that a commit is technically
packageable.

It is **not publication authorization**.

The current public version remains `handoffprobe@0.4.0`.

A later Phase 11 publication workflow must remain separately gated by an
evidence-backed version decision and explicit release authorization.

## Completion gate

P11.1 is complete only after:

- local repository validation passes;
- the workflow passes on its protected pull request;
- the candidate is merged normally;
- the workflow is verified from `main`.

Until then this record remains an implementation candidate.
