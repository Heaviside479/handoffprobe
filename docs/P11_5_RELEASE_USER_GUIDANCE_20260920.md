# P11.5 release user guidance

Date: 2026-09-20

Status: **COMPLETE — 2026-09-20**

## Purpose

Complete the user-facing release guidance required by Phase 11 without
duplicating or weakening existing release-engineering policy.

P11.5 turns existing contract, installation, release-note and compatibility
rules into discoverable user documentation.

## Canonical user guides

P11.5 adds:

- `docs/UPGRADING.md`;
- `docs/MIGRATION.md`;
- `docs/TROUBLESHOOTING.md`;
- `docs/FAQ.md`.

These documents are linked from the root README and documentation index.

Installation and usage documentation also cross-link to the guides where users
are most likely to need them.

## Source-of-truth reuse

P11.5 does not create a second compatibility policy.

Migration requirements remain governed by
`docs/P10_2_VERSIONED_CONTRACTS_POLICY_20260915.md`.

Maintainer dependency upgrades remain governed by
`docs/P10_4_DEPENDENCY_UPGRADE_PROCESS_20260919.md`.

Release-specific compatibility facts remain grounded in the corresponding
release notes, including `docs/V0_4_0_RELEASE_NOTES.md`.

The new documents translate those rules into user workflows.

## Current release boundary

P11.5 preserves:

- package version `0.4.0`;
- 23 stable attacks;
- report schema version `1`;
- Node.js `>=24 <25`;
- A2A 1.0 -> MCP 2026-07-28;
- current CLI commands and exit semantics;
- current GitHub Action behavior;
- current publication state.

## Navigation strategy

The four guides are exposed through:

- the root README documentation list;
- the root README CLI/troubleshooting references;
- `docs/README.md`;
- `docs/INSTALLATION.md`;
- `docs/USAGE.md`.

The goal is discoverability without copying full manuals into the repository
landing page.

## Non-goals

P11.5 does not:

- change runtime code;
- change package dependencies;
- change package version;
- change workflows;
- add or remove stable attacks;
- change schema versions;
- stage or publish an npm package;
- create or move a Git tag;
- create a GitHub Release.

## Protected completion evidence

Implementation PR: `#166 — Add P11.5 release user guidance`.

Exact implementation head:

`ee9a16b14b92c90de378539f9ffd66c8216bec81`

Exact protected base before merge:

`8d9954d300c6bc22be944f2d48c3c055170d192b`

Protected PR validation completed successfully:

- HandoffProbe run `35528805437`;
- Dependency Review run `35528805432`;
- Release Candidate run `35528805429`;
- CI run `35528805466`, including:
  - Quality (`ubuntu-latest`) job `106125605428`;
  - Quality (`windows-latest`) job `106125605635`;
  - Quality (`macos-latest`) job `106125605636`.

The pre-PR local quality gate also passed with 125 test files and 626 tests,
followed by a successful build.

PR #166 merged normally through branch protection on 2026-09-20 at
`2026-09-20T18:26:18Z`.

Merge commit and resulting `main` SHA:

`bcdd4b0129b470f9c3a37620298c269f7f680235`

The implementation changed 11 documentation/documentation-regression files
only. It did not change runtime code, package metadata, workflows, the package
version, the stable attack corpus or publication state.

No npm package was staged or published, no Git tag was created or moved, and no
GitHub Release was created by P11.5.

## Completion gate

P11.5 completion evidence now demonstrates that:

- [x] all four guides are present and internally consistent;
- [x] root and docs navigation expose them;
- [x] installation and usage cross-link them;
- [x] automated documentation tests pass;
- [x] the full repository quality gate passes;
- [x] protected pull-request validation succeeded;
- [x] the implementation merged normally through branch protection.
