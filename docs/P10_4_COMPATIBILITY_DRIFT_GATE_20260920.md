# P10.4 compatibility matrix drift gate

Date: 2026-09-20

Status: **COMPLETE CANDIDATE — protected PR admission passed 2026-09-20**

## Purpose

Make unsupported compatibility drift fail visibly instead of allowing runtime,
platform, protocol, dependency and documentation claims to diverge silently.

This gate does not broaden HandoffProbe support. It machine-checks the already
recorded compatibility baseline.

## Machine-readable matrix

`compatibility-matrix.json` is the repository compatibility source of truth for
the currently supported and CI-verified dimensions:

- Node package runtime: `>=24 <25`;
- CI Node line: `24`;
- CI platforms: `ubuntu-latest`, `macos-latest`, `windows-latest`;
- A2A wire protocol: `1.0`;
- MCP wire protocol: `2026-07-28`;
- `@a2a-js/sdk`: `1.1.0`;
- `@modelcontextprotocol/client`: `2.0.0`;
- `@modelcontextprotocol/server`: `2.0.0`;
- compatibility documentation:
  `docs/P10_1_COMPATIBILITY_BASELINE_20260915.md`.

SDK versions and wire-protocol versions remain separate compatibility
dimensions.

## Drift checker

`scripts/compatibility-matrix-check.ts` compares the matrix with repository
reality:

- `package.json` Node engine;
- `.github/workflows/ci.yml` Node version and OS matrix;
- `src/cli/protocols.ts` A2A and MCP wire claims;
- exact protocol SDK dependency versions in `package.json`;
- the documented P10.1 compatibility baseline.

A mismatch produces a non-zero exit and an explicit message containing the
dimension plus expected and observed values.

Example diagnostic:

`ci.node: expected "24", found "25"`

## CI admission

`npm run compatibility:check` executes the checker directly.

The normal `npm run check` chain now includes `npm run compatibility:check`.
Because the existing Linux, macOS and Windows quality jobs all execute
`npm run check`, unsupported drift becomes a normal required CI failure rather
than a documentation-only warning.

## Regression coverage

`tests/p10-compatibility-drift-gate.test.ts` verifies:

- the current repository has zero compatibility drift;
- the complete current runtime/platform/protocol/SDK baseline is pinned;
- simulated Node/runtime/platform drift produces explicit diagnostics;
- simulated MCP and A2A SDK drift produces explicit diagnostics;
- documentation drift is detected;
- the gate remains wired into the normal repository check.

The candidate was locally validated with the full repository check and package
dry-run before PR admission. PR #151 then passed all five required admission
checks: HandoffProbe, Dependency Review and Linux/macOS/Windows Quality.

## Scope

This work does not:

- change `handoffprobe@0.4.0`;
- change the 23 stable attacks;
- change the A2A 1.0 -> MCP 2026-07-28 public wire baseline;
- change supported platforms;
- update dependencies;
- modify `package-lock.json`;
- claim native Windows support for the reusable composite GitHub Action.

## P10.4 exit gate

Every currently claimed supported runtime/platform combination has an explicit
verification path, and unsupported compatibility drift is now a visible
repository/CI failure.

The P10.4 closeout candidate has passed protected PR admission and is ready to
become repository truth through the normal merge of PR #151.
