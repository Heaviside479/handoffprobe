# HandoffProbe v0.2.0 release notes

Status: draft release notes for R2.4. v0.2.0 is not published yet.

## Summary

HandoffProbe v0.2.0 is a release-quality and product-coherence increment built on the existing stable defensive A2A 1.0 → MCP 2026-07-28 handoff-security product.

The release candidate deliberately preserves the stable runtime contract rather than expanding the public attack surface without evidence.

The current public npm package remains `handoffprobe@0.1.1` until the R2.5 publication gate completes.

## User-facing features and product contract

- exactly 22 stable attacks remain available: 12 P0 and 10 P1
- the public CLI remains `test`, `list`, `explain`, `--version` and `--help`
- secure and intentionally vulnerable bundled targets remain available
- terminal, JSON and Markdown reporters remain supported
- report schema remains version `1`
- deterministic CLI exit semantics remain `0 / 1 / 2 / 3`
- the reusable source-backed GitHub Action remains supported
- package-root API and package exports remain unchanged
- no new Phase 9 CLI command, root API, package subpath export or Action input/output is added

The primary user-visible distribution change is a narrower, cleaner npm package boundary that contains the stable release build closure rather than repository research fixtures.

## Fixes and maintenance

- carries forward the v0.1.1 transitive `qs` security maintenance fix with the patched dependency resolution
- release builds remove the previous `dist` directory before TypeScript compilation, preventing stale build output from entering a package
- the narrowed build explicitly preserves `src/github-action/run-action.ts`, so the existing composite GitHub Action runtime remains available
- package metadata allows only `dist` through the explicit npm `files` allowlist

## Research assets

Phase 8 adoption, contributor, review and research documentation is carried forward.

Phase 9 adds a reproducible repository research/conformance workflow around the pinned A2A 1.0 → MCP 2026-07-28 crossing corpus.

The externally reviewed result supports the narrow documented `implementation_independent` grade for that local synthetic execution profile.

Phase 9 crossing-corpus functionality remains repository research and conformance tooling. Its cases are not additional stable HandoffProbe attack IDs and are not exposed through the public CLI, package-root API or GitHub Action.

The npm package excludes:

- pinned Phase 9 fixture files under `fixtures/phase9/a2a-mcp-crossing-v2`
- research-only Phase 9 modules `case-builder`, `executor`, `loader`, `rebinding` and `submission`

Seven Phase 9 compiler/declaration-closure modules may remain in `dist`, but they are unreachable through package exports and do not constitute a public Phase 9 API.

## Compatibility

- Node.js requirement remains `>=24 <25`
- protocol baseline remains A2A 1.0 → MCP 2026-07-28
- stable attack count remains 22
- report schema remains `1`
- CLI exit semantics remain `0 / 1 / 2 / 3`
- the v0.1.1 immutable Action pin remains the public recommendation until the v0.2.0 candidate/release commit is frozen and verified

## Explicit limitations

The Phase 9 result is profile-scoped conformance evidence, not a general security certification and not an additional vulnerability finding.

HandoffProbe v0.2.0 does not claim:

- `operator_independent` validation
- production-world effect measurement
- production key management
- restart-durable replay protection
- multi-process replay protection
- generic internet scanning
- runtime firewall or authorization-provider behavior

The measured Phase 9 effect scope remains a local synthetic MCP receiver.

## Release-candidate validation boundary

R2.4 validates the repository and locally packed candidate without publishing v0.2.0.

The technical baseline has already demonstrated full deterministic tests, High/Critical dependency-audit clearance, package inspection, clean-clone execution, local-tarball `npx` execution and local Action runtime execution.

The final reusable Action consumer verification must still be completed from a separate consumer repository against an immutable candidate commit.

## Publication status

During R2.4, `package.json` and `src/index.ts` intentionally remain at development version `0.1.0`.

R2.5 owns the controlled transition to `0.2.0`, release-candidate freeze, exact release checklist, tag, npm publication, GitHub Release and post-publication verification.

Until those gates complete, do not treat `handoffprobe@0.2.0`, tag `v0.2.0` or any v0.2.0 GitHub Release as published.
