# P12.2 current threat model and limitations contract

Date: 2026-09-21

Status: **ACTIVE CANDIDATE — local validation complete; repository admission pending**

Base commit: `975591f96a8115b3b8f055915e3c8efb1f2ef66a`

Current public release remains `handoffprobe@0.4.0`.

## Purpose

Close the Phase 12 threat-model and limitations gaps identified by P12.1 without changing runtime behavior, package version, protocol baseline or the stable attack corpus.

## Reconciliation

P12.2 updates the current threat model from historical v0.1 release-facing wording to the verified 0.4.0 product state, records the exact 23-attack stable corpus boundary and separates stable coverage from research and backlog threat classes.

The stable corpus remains exactly 12 P0, 10 P1 and one advanced stable attack, `HP-AUTH-006`.

No research-only candidate is promoted by this work.

## Limitations contract

`docs/LIMITATIONS.md` now distinguishes synthetic fixtures from production validation, handoff testing from protocol conformance, stable attacks from research, findings from certification, supported runtime and protocol claims from unsupported environments, authorized testing from arbitrary remote scanning and local-first Core from demand-gated Cloud or Enterprise capabilities.

## Release boundary

P12.2 does not authorize a package-version change, npm publication, Git tag, GitHub Release, protocol-baseline change, stable-attack admission or v1.0 GA.

The package remains `handoffprobe@0.4.0`.

## Local validation result

Local validation completed successfully on 2026-09-21:

- 128 / 128 test files passed;
- 654 / 654 tests passed;
- complete repository check passed;
- package dry-run passed for `handoffprobe@0.4.0`;
- focused P12.2 regression passed;
- stale v0.1 release-facing markers are absent;
- exact intended seven-file scope preserved;
- `git diff --check` passed.

## Completion gate

Protected pull-request validation and merge remain required before P12.2 becomes repository truth.
