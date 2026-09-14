# R3.2 Package Metadata Cleanup Closeout — 2026-09-14

Status: **COMPLETE 2026-09-14**

## Decision

The repository-only commercial assessment delivery command must not be advertised as an installed npm-package script.

R3.2 therefore removes `assessment:report` from publishable root `package.json` metadata while preserving the assessment delivery implementation and tests inside the repository.

No package version bump is part of R3.2. The development package remains `0.2.0`.

## Implemented cleanup

The R3.2 change:

- removes `"assessment:report": "tsx scripts/commercial-assessment-delivery.ts"` from root `package.json`;
- keeps npm package files restricted to `dist`;
- keeps `scripts/commercial-assessment-delivery.ts` and `scripts/commercial-assessment-report.ts` repository-only;
- updates the maintainer-facing invocation to `npx tsx scripts/commercial-assessment-delivery.ts <assessment.json> [output-directory]`;
- updates the roadmap verification command to the repository-local invocation;
- adds a release-metadata regression assertion that `assessment:report` is absent from publishable package scripts.

The commercial assessment report implementation, PDF generation, synthetic fixtures and tests remain available to repository maintainers. They are not promoted into the HandoffProbe Core CLI/API/npm runtime surface.

## Validation

R3.2 validation completed successfully:

- targeted release-metadata and commercial-assessment tests passed;
- full repository `npm run check` passed;
- 72 test files and 379 tests passed;
- `npm run package:check` passed;
- exact tarball inspection confirmed package version `0.2.0`;
- exact tarball inspection confirmed `assessment:report` is absent from published package metadata;
- exact tarball inspection confirmed the package allowlist remains `["dist"]`;
- exact tarball inspection confirmed no `scripts/` or `fixtures/commercial-assessment/` content enters the npm payload;
- stable attack count remains 22;
- `git diff --check` passed;
- implementation scope remained limited to the intended metadata, maintainer-invocation, roadmap and regression-test files.

Expected Phase 9 rejected-boundary stderr remains normal test evidence and is not a release failure.

## Public-contract effect

R3.2 does not change:

- stable attack count or IDs;
- CLI commands or exit semantics;
- package-root export map;
- report schema;
- GitHub Action inputs, outputs or execution contract;
- Node policy;
- A2A/MCP protocol baseline;
- commercial assessment implementation behavior inside the repository.

The change only prevents npm metadata from advertising a repository-only command whose source is not shipped in the npm artifact.

## R3 progression

R3.1 froze the release scope and confirmed `v0.3.0` as the backward-compatible minor release candidate.

R3.2 has now removed the package-metadata blocker identified by R3.1.

The next R3 step may prepare the coordinated `0.3.0` release candidate: synchronize version-bearing metadata and release-facing documentation, then run the full pre-publication gates before any npm publication, immutable tag or GitHub Release is created.
