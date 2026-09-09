# v0.2.0 Phase 9 productization decision — 2026-09-09

Status: R2.3 complete

## Decision

Phase 9 crossing-corpus functionality remains repository research and conformance validation tooling for v0.2.0.

It does not become a new public CLI command, package-root API, package subpath export, GitHub Action input or output, or additional stable HandoffProbe attack catalog.

The stable public product remains the existing HandoffProbe CLI, root API, GitHub Action and exactly 22 stable attack IDs.

## npm package boundary

The v0.2.0 release package ships only `dist`.

The pinned external crossing corpus under `fixtures/phase9/a2a-mcp-crossing-v2` remains in the repository for reproducible research and conformance validation but is not part of the npm payload.

The release build is rooted at `src/index.ts` and `src/cli.ts` and removes the previous `dist` directory before compilation so stale build output cannot leak into a package.

Seven Phase 9 modules remain in the TypeScript compilation closure:

- `binding`
- `effects`
- `gate`
- `issuer-authentication`
- `observation`
- `provenance`
- `verifier`

They remain internal implementation and build-closure files. They are not exported from the package root and no Phase 9 package subpath is exported.

The research-only modules `case-builder`, `executor`, `loader`, `rebinding` and `submission` are not emitted into the release package.

## User-facing surface

No new Phase 9 user-facing runtime surface is justified for v0.2.0.

The useful public output of Phase 9 is the documented, externally reviewed conformance evidence already linked from the repository documentation. The reproducibility implementation remains repository tooling for maintainers and reviewers.

## Execution constraints

Phase 9 research and conformance execution remains deterministic, local and offline for normal validation. It requires no paid API, model provider, SaaS account, production target, billing integration, analytics or hidden telemetry.

URL-shaped constants used by the implementation are identifiers, profile values, repository references or synthetic local/example identities. They do not establish an implicit network dependency.

## Evidence and claim boundary

Phase 9 results are conformance evidence, not additional HandoffProbe vulnerability findings and not additional stable attack IDs.

The externally reviewed evidence supports the narrow `implementation_independent` grade for the documented local synthetic crossing-corpus execution.

HandoffProbe does not claim `operator_independent`, production-world effect, production key management, restart-durable replay protection or multi-process replay protection without new evidence.

## Validation

The exact package-boundary candidate was validated before repository implementation with:

- 67 of 67 test files passing;
- 353 of 353 tests passing;
- clean release compilation;
- exactly seven Phase 9 JavaScript modules remaining in release `dist`;
- zero research-only Phase 9 modules in release `dist`;
- zero pinned Phase 9 fixture files in the npm payload;
- zero research-only Phase 9 files in the npm payload;
- successful exact tarball creation and clean consumer installation;
- successful package-root runtime import and TypeScript resolution;
- zero Phase 9 package-root exports;
- exactly 22 stable attacks;
- deterministic CLI exit behavior `0 / 1 / 2 / 3`.

## Version boundary

`package.json` and `src/index.ts` remain at development version `0.1.0` during R2.3. The controlled `0.2.0` version change belongs to later release preparation.

## R2.3 conclusion

The Phase 9 productization boundary is frozen for v0.2.0: repository-only research and conformance tooling, documented public evidence, no new public Phase 9 runtime surface, and a narrowed npm payload containing only the stable release build closure.
