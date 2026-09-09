# v0.2.0 public contract audit — 2026-09-09

Status: **R2.2 complete; all nine reviewed contracts compatible; R2.3 next**

## Purpose

This record captures the R2.2 compatibility review for the controlled HandoffProbe v0.2.0 release track. The audit compares the supported v0.1.1 public contract with the audited development line and identifies accidental or intentional breaking changes before Phase 9 productization decisions.

## Audited baselines

- supported v0.1.1 release commit: `8e58c2f6553c735bec3857945ca5afde8c8a3177`
- audited main commit: `05e18ca3cb3796e00f5c53edd43b1cf5c3fdf9f7`
- audit result: all nine R2.2 public-contract checks compatible
- breaking-change blockers found: none

## 1. CLI commands and options

Result: **COMPATIBLE**

- CLI implementation relevant to command discovery and execution has no effective change from v0.1.1
- public commands remain `test`, `list` and `explain <HP-ID>`
- test options remain `--target`, repeatable `--test`, `--fail-on`, `--reporter` and `--output`
- global options remain `--help` and `--version`
- the stable CLI continues to operate on the existing stable attack catalog

## 2. Package-root exports

Result: **COMPATIBLE**

- `main` remains `./dist/index.js`
- `types` remains `./dist/index.d.ts`
- binary remains `handoffprobe -> ./dist/cli.js`
- package export map still exposes only the package root
- source package root continues to export core and attacks
- no Phase 9 package-root API export has been introduced
- the only `src/index.ts` delta from v0.1.1 is the intentionally unreleased development version value `0.1.0`; the controlled v0.2.0 version bump remains deferred to release preparation

## 3. Config schema

Result: **COMPATIBLE**

- `src/cli/config.ts` has no effective change from v0.1.1
- configuration filename remains `handoffprobe.config.json`
- allowed keys remain `target`, `tests`, `failOn`, `reporter` and `output`
- fail-on values remain `info`, `low`, `medium`, `high` and `critical`
- reporters remain `terminal`, `json` and `markdown`

## 4. Report schema

Result: **COMPATIBLE**

- reporter implementation has no effective change from v0.1.1
- machine-readable report schema remains version `1`
- validated top-level JSON keys remain `findings`, `handoffProbeVersion`, `protocols`, `schemaVersion`, `selection`, `summary`, `target` and `threshold`
- runtime report protocol values remain A2A `1.0` and MCP `2026-07-28`

## 5. GitHub Action inputs and outputs

Result: **COMPATIBLE**

- `action.yml` has no effective change from v0.1.1
- inputs remain `target`, `tests`, `fail-on` and `artifact-name`
- outputs remain `exit-code`, `result`, `report-path` and `summary-path`
- the Action continues to use Node 24
- no Phase 9 Action behavior or input/output surface has been introduced

## 6. Exit-code semantics

Result: **COMPATIBLE**

The contract remains deterministic and was runtime-verified:

- exit `0`: successful security gate
- exit `1`: vulnerability failure at or above the configured threshold
- exit `2`: CLI usage/configuration error
- exit `3`: runtime/internal execution error

Runtime controls produced exactly `0 / 1 / 2 / 3` for the four corresponding cases.

## 7. Node/runtime requirement

Result: **COMPATIBLE**

- v0.1.1 requirement: `>=24 <25`
- audited main requirement: `>=24 <25`
- local audit runtime: Node `v24.17.0`
- no runtime-support widening or narrowing is introduced by R2.2

## 8. Protocol-version baseline

Result: **COMPATIBLE**

- A2A baseline remains `1.0`
- MCP baseline remains `2026-07-28`
- `src/cli/protocols.ts` has no effective change from v0.1.1
- Phase 9 research work does not alter the stable CLI protocol baseline

## 9. Redaction and secret safety

Result: **COMPATIBLE**

- stable core/redaction and CLI-diagnostic safety surfaces have no effective change from v0.1.1
- `npm run secret:check` completed successfully with no credential patterns detected
- CLI diagnostics and reporters continue to sanitize/redact potentially sensitive text
- protocol evidence continues to use the established record-redaction path
- existing redaction regression coverage remains present

## Compatibility verdict

| Contract                     | Result     |
| ---------------------------- | ---------- |
| CLI commands/options         | COMPATIBLE |
| Package-root exports         | COMPATIBLE |
| Config schema                | COMPATIBLE |
| Report schema                | COMPATIBLE |
| GitHub Action inputs/outputs | COMPATIBLE |
| Exit-code semantics          | COMPATIBLE |
| Node/runtime requirement     | COMPATIBLE |
| Protocol-version baseline    | COMPATIBLE |
| Redaction/secret safety      | COMPATIBLE |

**Overall R2.2 verdict: COMPATIBLE.**

No accidental breaking change was identified and no intentional breaking change is admitted by this audit.

## Release constraints carried forward

- preserve exactly 22 stable attack IDs unless a later explicit attack-admission process changes the catalog
- preserve report schema version `1` for v0.2.0 unless a separately justified release decision changes it
- preserve deterministic exit-code semantics `0 / 1 / 2 / 3`
- preserve the current GitHub Action input/output contract
- preserve Node `>=24 <25` for the current release plan
- preserve the stable A2A 1.0 to MCP 2026-07-28 baseline
- preserve existing redaction and secret-safety guarantees
- do not expose Phase 9 through public CLI/API/Action surfaces merely because implementation or package payload exists

## R2.2 conclusion

All nine R2.2 public-contract requirements are satisfied at the audited main commit. No compatibility blocker was found. R2.3 may now decide the justified productization level for Phase 9 without weakening or silently changing the frozen stable public contract.

Package/source version remains intentionally `0.1.0` until controlled v0.2.0 release preparation.
