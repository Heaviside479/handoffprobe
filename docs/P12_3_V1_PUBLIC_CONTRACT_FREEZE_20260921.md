# P12.3 v1 public-contract freeze

Date: 2026-09-21

Status: **COMPLETE — merged through protected PR #173 on 2026-09-22**

Base commit: `e426d761dd245dc9c8ce2a6f96c3023170c387f7`

Current verified public release remains `handoffprobe@0.4.0`.

## Purpose

Freeze the intended HandoffProbe v1 public compatibility boundary before GA hardening.

This work does not publish `1.0.0`, change the package version, change the stable attack corpus or broaden the supported protocol baseline.

A frozen surface may receive backward-compatible additive evolution under the normal SemVer and contract-review rules. Existing names, accepted inputs, documented outputs and security meanings must not be removed, renamed or incompatibly redefined during the v1 line.

## Decision summary

All 13 public surfaces explicitly required by P12.3 are frozen for v1.

0 surfaces classified as `CHANGE BEFORE V1`.

0 surfaces classified as `NOT PUBLIC V1 CONTRACT`.

| Public surface                             | Decision        | Frozen v1 contract                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Core/package-root exports                  | `FREEZE FOR V1` | The package continues to expose the package root through `.` using `dist/index.js` and `dist/index.d.ts`. Existing package-root names, types and documented meanings exported through `src/index.ts`, Core and stable attacks become v1 compatibility obligations. Compatible additive exports remain possible.                                              |
| CLI commands                               | `FREEZE FOR V1` | `handoffprobe test`, `handoffprobe list`, `handoffprobe explain <HP-ID>`, `handoffprobe --version` and `handoffprobe --help` remain the stable command surface.                                                                                                                                                                                              |
| CLI options and defaults                   | `FREEZE FOR V1` | `--target` accepts `secure` or `vulnerable` with `secure` as default; `--test` is repeatable and omission selects the stable corpus; `--fail-on` accepts info, low, medium, high or critical with `high` as default; `--reporter` accepts terminal, json or markdown with terminal as default; `--output` is optional; CLI arguments override configuration. |
| Exit semantics                             | `FREEZE FOR V1` | `0` means successful trustworthy completion without a qualifying security failure; `1` means a qualifying vulnerability FAIL; `2` means usage or configuration failure; `3` means scanner, runtime or output failure. ERROR must never collapse into exit `1`.                                                                                               |
| Config schema version 1                    | `FREEZE FOR V1` | `handoffprobe.config.json` remains config schema version `1` with exactly `target`, `tests`, `failOn`, `reporter` and `output`; all keys are optional; absence of the file is valid; unknown keys are rejected; there is no in-band `schemaVersion` field.                                                                                                   |
| JSON report schema version 1               | `FREEZE FOR V1` | Canonical `schemaVersion` remains string `"1"` with top-level `schemaVersion`, `handoffProbeVersion`, `target`, `protocols`, `selection`, `threshold`, `summary` and `findings`. Existing nested field names, types and security meanings remain compatible.                                                                                                 |
| Finding, status and severity semantics     | `FREEZE FOR V1` | Finding statuses remain `pass`, `fail`, `not_applicable`, `inconclusive`, `error`. Severities remain `critical`, `high`, `medium`, `low`, `info`; threshold ordering remains info < low < medium < high < critical. Only `fail` represents a vulnerability failure; `error` remains operationally distinct.                                                  |
| GitHub Action inputs                       | `FREEZE FOR V1` | Inputs remain `target`, `tests`, `fail-on` and `artifact-name`, with defaults `secure`, empty selection, `high` and `handoffprobe-report`.                                                                                                                                                                                                                   |
| GitHub Action outputs                      | `FREEZE FOR V1` | Outputs remain `exit-code`, `result`, `report-path` and `summary-path`. Action exit propagation preserves CLI exit semantics.                                                                                                                                                                                                                                |
| Stable HP identifiers and security meaning | `FREEZE FOR V1` | The current 23 stable IDs retain their identity and security meaning. Existing stable IDs must not be repurposed. Future evidence-backed attacks require new stable IDs through the normal admission process.                                                                                                                                                |
| Node.js compatibility contract             | `FREEZE FOR V1` | Supported package runtime remains Node.js `>=24 <25`. Repository CI may validate additional environments without silently broadening the package runtime promise.                                                                                                                                                                                            |
| A2A/MCP compatibility contract             | `FREEZE FOR V1` | Public protocol baseline remains A2A `1.0` -> MCP `2026-07-28`. Other protocol revisions or directions require an explicit compatibility decision before becoming supported contract.                                                                                                                                                                        |
| Release and tag immutability expectations  | `FREEZE FOR V1` | Published release tags and artifacts remain immutable. Published tags are never moved or rewritten. Security-sensitive GitHub Action consumers should prefer reviewed immutable commit-SHA pins.                                                                                                                                                             |

## Stable attack identity frozen for v1

The current stable corpus is:

1. `HP-AUTH-001`
2. `HP-AUTH-002`
3. `HP-AUTH-003`
4. `HP-ID-001`
5. `HP-ID-002`
6. `HP-TENANT-001`
7. `HP-TARGET-001`
8. `HP-TARGET-002`
9. `HP-APPROVAL-001`
10. `HP-CRED-001`
11. `HP-CRED-002`
12. `HP-LIFECYCLE-001`
13. `HP-AUTH-004`
14. `HP-AUTH-005`
15. `HP-REPLAY-001`
16. `HP-REPLAY-002`
17. `HP-REPLAY-003`
18. `HP-APPROVAL-002`
19. `HP-APPROVAL-003`
20. `HP-RACE-001`
21. `HP-RACE-002`
22. `HP-AUDIT-001`
23. `HP-AUTH-006`

The freeze protects identity and security meaning, not corpus cardinality forever. A later compatible v1 minor release may add a separately admitted new ID without redefining an existing ID.

## Internal details outside this freeze

The v1 public contract does not freeze incidental implementation details such as:

- repository file layout;
- private helper names;
- internal fixture classes;
- test organization;
- exact terminal column spacing;
- exact Markdown whitespace where documented semantics remain unchanged;
- internal diagnostic implementation structure;
- dependency package versions that do not alter the supported public compatibility contract.

Changing an internal detail is still subject to existing tests, security requirements and release gates.

## Compatibility rule after freeze

Any proposal that removes, renames or incompatibly changes one of the frozen surfaces requires an explicit breaking-change decision.

After v1 GA, an incompatible change to these frozen surfaces requires the appropriate future major-version process.

Compatible additions still require normal review, regression coverage and release classification.

## P12.3 release boundary

This record does not authorize:

- `1.0.0`;
- `1.0.0-rc.N`;
- an npm publication;
- a Git tag;
- a GitHub Release;
- a new stable attack;
- a Node compatibility expansion;
- a protocol compatibility expansion.

Final GA authorization remains exclusively in P12.7.

## Local validation result

Local validation completed successfully on 2026-09-22:

- 129 / 129 test files passed;
- 665 / 665 tests passed;
- complete repository check passed;
- package dry-run passed for `handoffprobe@0.4.0`;
- package dry-run contained 296 files;
- focused P12.3 contract regression passed;
- all 13 required public surfaces remain classified `FREEZE FOR V1`;
- 0 surfaces require `CHANGE BEFORE V1`;
- 0 surfaces are classified `NOT PUBLIC V1 CONTRACT`;
- release boundary remains `handoffprobe@0.4.0`, Node.js `>=24 <25`, A2A `1.0` -> MCP `2026-07-28`;
- exact intended five-file scope preserved;
- `git diff --check` passed.

Protected pull-request admission completed on 2026-09-22 through PR #173.

Implementation commit: `0754af6d0ed75b78ca7463af663519fac00fe3c1`.

Protected merge commit: `cc15661e9cdf5b77c3ff62599f2fbf5282f67d6c`.

All required PR workflows passed before merge:

- Dependency Review;
- HandoffProbe;
- Release Candidate;
- CI.

The P12.3 repository-admission gate is fulfilled.

## Next gate

P12.4 must audit the frozen package-root API, add or strengthen regression coverage where gaps remain, verify CLI and Action parity, inspect package payload and exports and disposition remaining pre-GA backlog without silently changing this freeze.
