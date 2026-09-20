# P11.1 release-candidate automation

Date: 2026-09-20

Status: **COMPLETE — 2026-09-20**

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

## Completion evidence

P11.1 completed on 2026-09-20.

- Local validation passed with 119 test files / 592 tests, the full repository
  quality gate and package validation.
- Protected implementation PR #153 passed all six checks, including the new
  `Release Candidate` job.
- PR #153 merged normally as
  `5b48eb953a3005b338208896a607fa7e7afb37a3`.
- The feature branch was removed locally and remotely after the merge.
- Release Candidate workflow run `35501202431` was dispatched manually from
  `main` at that exact merge commit and completed successfully.
- The `main` verification passed repository quality gates, built and inspected
  the npm tarball, installed and executed the exact candidate and confirmed a
  clean repository worktree.
- The public package remains `handoffprobe@0.4.0`; this closeout does not
  authorize or perform publication.

## Completion gate

All P11.1 completion requirements are satisfied.
