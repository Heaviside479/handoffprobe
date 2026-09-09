# HandoffProbe v0.2.0 release notes

Status: final release notes for v0.2.0.

## Summary

HandoffProbe v0.2.0 is a release-quality and product-coherence increment built on the existing stable defensive A2A 1.0 → MCP 2026-07-28 handoff-security product.

The finalized v0.2.0 scope deliberately preserves the stable runtime contract rather than expanding the public attack surface without evidence.

The exact npm package for this release is `handoffprobe@0.2.0`.

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
- the reviewed immutable v0.2.0 Action pin is `b0fc2a8abe1df36e526536d714418a9842be2f77`; both that SHA and the human-readable `v0.2.0` Action reference were verified after publication from a separate consumer repository

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

## Release validation boundary

R2.4 validates the repository and locally packed candidate without publishing v0.2.0.

The technical baseline has already demonstrated full deterministic tests, High/Critical dependency-audit clearance, package inspection, clean-clone execution, local-tarball `npx` execution and local Action runtime execution.

Reusable Action consumer verification completed successfully from a separate consumer repository against immutable R2.4 candidate commit `f38f340f4dcf96464cc8053d67cf5f15563b409a`, with `exit-code=0`, `result=pass` and report/summary files verified.

The final R2.5 release candidate is immutable commit `f2483bacd4fac78d09e6322c0823e08a2078260f`. Its exact release checklist passed with 68 of 68 test files and 358 of 358 tests, zero dependency-audit vulnerabilities, clean-clone execution, clean local-tarball `npx` execution and exactly 22 stable attacks. The exact candidate tarball is `handoffprobe-0.2.0.tgz`, 287 files, package size 127236 bytes, unpacked size 624501 bytes, npm shasum `e2ddad64f113f3aaca83c0592cca274872d72df2`, integrity `sha512-2Hbg9n91ZDiil0l78EnYe3Gl/9yn3Sm+ytilKCMAmtPUGaUMoBnDYbiMxo0ZC1hkWggSaGnJXH5KvISK/0gpOg==` and SHA-256 `8f5b4438269292a9fe5f1be3ed9451df4db976f38759517dc8a55c5f513fa57d`.

A second external consumer audit verified the reusable Action against that exact R2.5 candidate. Workflow run `34376135286` completed successfully; the Action invocation and output-verification steps passed, and artifact `handoffprobe-report` was produced. Consumer PR #4 was closed unmerged after verification.

## Publication status

Publication status: completed 2026-09-09.

Final release commit:

`b0fc2a8abe1df36e526536d714418a9842be2f77`

The annotated `v0.2.0` tag resolves to that exact commit. Its annotated tag object is:

`8c33fbfdd1c67df3e4db9a49ee8ad1082fda7915`

The public npm package is `handoffprobe@0.2.0`, and npm `latest` resolves to `0.2.0`.

Verified public package fingerprint:

- files: `287`
- package size: `127167` bytes
- unpacked size: `624318` bytes
- npm shasum: `dcc638b0b8542306f112fe1c4375df632eb12db5`
- npm integrity: `sha512-7Yt9XEfsR+hPY4nCfvc3WH7tHkLE/7p6+HSMmo9cg7mxY6Q2JZWSPUXVJ2hOQ9peADFORmBBvSiOqAYlNzqA7w==`
- SHA-256: `1d6e438182a4ecbf3c0dae00df7ad92ead40ad8fca8c6a99e7374048c04391d4`

The GitHub Release is published as `HandoffProbe v0.2.0`:

`https://github.com/Heaviside479/handoffprobe/releases/tag/v0.2.0`

A clean external installation verified the installed CLI binary, version `0.2.0`, exactly 22 stable attacks and a secure run with 22 PASS / 0 FAIL / 0 ERROR.

The final public package was compared with frozen R2.5 candidate `f2483bacd4fac78d09e6322c0823e08a2078260f`. Package membership remained identical at 287 files; the only packaged-file content change was `package/README.md`.

Post-publication consumer workflow run `34401248620` verified both:

- `Heaviside479/handoffprobe@v0.2.0`
- `Heaviside479/handoffprobe@b0fc2a8abe1df36e526536d714418a9842be2f77`

Both Action jobs and output-verification steps passed. Consumer PR #5 was closed unmerged after the evidence run.

The GitHub Marketplace listing was manually verified after publication to present v0.2.0 as the published release.

No npm provenance or attestation claim is made for this release.
