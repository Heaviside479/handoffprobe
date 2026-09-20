# Migration guide

Status: current user guidance for `handoffprobe@0.4.0`.

## Purpose

This guide explains when a HandoffProbe version change requires user or CI
migration work.

It is the user-facing companion to the versioned-contract policy in
[`P10_2_VERSIONED_CONTRACTS_POLICY_20260915.md`](P10_2_VERSIONED_CONTRACTS_POLICY_20260915.md).

## Current release

The current verified public release is `handoffprobe@0.4.0`.

The v0.4.0 release is documented as a backward-compatible minor release. It
preserves:

- the stable CLI commands;
- exit semantics `0 / 1 / 2 / 3`;
- report schema version `1`;
- the existing configuration contract;
- the GitHub Action input/output contract;
- Node.js `>=24 <25`;
- the A2A 1.0 -> MCP 2026-07-28 protocol baseline.

The stable attack corpus changed from 22 attacks in v0.3.0 to 23 attacks in
v0.4.0 because `HP-AUTH-006` was admitted.

Users or CI jobs that assert an exact stable-attack count therefore need to
update that expectation even though the public CLI and report contracts remain
compatible.

See [`V0_4_0_RELEASE_NOTES.md`](V0_4_0_RELEASE_NOTES.md).

## When migration guidance is required

Every intentional breaking CLI or schema change must have migration guidance
before publication.

The migration record must identify:

- the old contract and version;
- the replacement contract and version;
- the exact breaking difference;
- before and after examples where practical;
- required user or CI changes;
- affected CLI, config, reports, Action usage or package API;
- rollback or pinning guidance when practical;
- SemVer classification;
- the corresponding release notes.

If compatibility cannot be demonstrated, publication is blocked until the
change is made compatible or follows the correct breaking-change process.

## User migration checklist

When moving between versions:

1. identify the exact installed version and intended target version;
2. read the target release notes;
3. check whether release-specific migration guidance exists;
4. verify the required Node.js range;
5. update the npm version deliberately;
6. update an immutable GitHub Action SHA separately when the Action is used;
7. verify `handoffprobe --version`;
8. run `handoffprobe list` and review stable attack changes;
9. run the secure test path;
10. validate machine consumers that depend on report schema, configuration,
    findings, exit codes or exact attack counts.

For the step-by-step update procedure, see [`UPGRADING.md`](UPGRADING.md).

## Rollback

Published tags and artifacts are immutable.

If an upgrade is unsuitable, pin the previously reviewed package version or
immutable Action commit again rather than rewriting a published release.

No automated migration should silently guess when multiple interpretations are
possible.

## Current v0.3.0 -> v0.4.0 summary

No CLI-command migration is required.

No report-schema migration is required.

No protocol-baseline migration is required.

The principal visible corpus change is the addition of `HP-AUTH-006`, raising
the stable default corpus from 22 to 23 attacks.

Consumers that depend on exact corpus cardinality should update that
expectation and rerun their normal validation.
