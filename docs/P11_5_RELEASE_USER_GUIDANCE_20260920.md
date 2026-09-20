# P11.5 release user guidance

Date: 2026-09-20

Status: **IMPLEMENTATION CANDIDATE — protected validation pending**

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

## Completion gate

P11.5 is complete only after:

- all four guides are present and internally consistent;
- root and docs navigation expose them;
- installation and usage cross-link them;
- automated documentation tests pass;
- the full repository quality gate passes;
- protected pull-request validation succeeds;
- the change is merged normally through branch protection.
