# P12.4 internal GA hardening and backlog disposition

Date: 2026-09-22

Status: **COMPLETE**

Base commit: `e56927fa1ef342b8ca978465dc17efe01758bd45`

Current verified public release remains `handoffprobe@0.4.0`.

## Purpose

Perform the final internal hardening review before GA candidate engineering without changing the already frozen v1 public contract unnecessarily.

P12.4 does not authorize a release, a version change, a new stable attack, a protocol expansion or a runtime expansion.

## Baseline audit result

The read-only P12.4 baseline audit completed successfully on 2026-09-22.

Observed baseline:

- package version: `0.4.0`;
- stable corpus: 23 attacks;
- Node.js contract: `>=24 <25`;
- protocol contract: A2A `1.0` -> MCP `2026-07-28`;
- npm package dry-run passed;
- package dry-run contained 296 files;
- targeted hardening gate passed 16 / 16 test files and 99 / 99 tests;
- package-root, CLI/Action, compatibility, backlog and defect searches completed;
- working tree remained clean after the read-only audit.

Expected rejection stderr from deterministic negative security fixtures is test evidence and is not a scanner failure.

## Package-root API stability audit

The npm manifest exposes one package import surface:

- package root `.` -> `dist/index.js`;
- package root types -> `dist/index.d.ts`;
- CLI binary -> `dist/cli.js`.

`src/index.ts` re-exports:

- Core;
- stable attack modules;
- `PRODUCT_NAME`;
- `PACKAGE_NAME`;
- `VERSION`.

Existing package-root runtime names and exported type names covered by the frozen v1 contract must remain available and retain compatible meaning.

Backward-compatible additive exports remain allowed under the P12.3 freeze.

P12.4 adds focused regression coverage that requires the current runtime public symbols and representative public type exports to remain importable without forbidding compatible additions.

## CLI and GitHub Action parity

The CLI and reusable GitHub Action share the same canonical execution catalog and scanner execution path.

Frozen parity:

- default target: `secure`;
- optional intentionally vulnerable target: `vulnerable`;
- omitted test selection means the complete stable corpus;
- default failure threshold: `high`;
- stable attack selection resolves through the same execution catalog;
- vulnerability result uses exit `1`;
- usage or configuration failure uses exit `2`;
- scanner or runtime failure uses exit `3`;
- successful security execution uses exit `0`.

The Action-specific `artifact-name` input is wrapper functionality and is not a CLI semantic mismatch.

The CLI reporter and output-file options are CLI presentation controls. The Action instead produces its JSON report, Markdown summary and artifact outputs around the same scanner result.

No contract change is required.

## Package payload and public exports

The audited package dry-run contains 296 files.

The manifest package allowlist remains:

- `dist`;
- `DISCLOSURE`.

npm also includes its standard package metadata such as README, LICENSE and package manifest.

Compiled fixture, protocol-lab and scanner implementation modules inside `dist` are package runtime internals. They are not separate public npm subpath exports because the package export map exposes only `.`.

No accidental new public subpath was found.

No package payload change is required before GA.

## Compatibility reconciliation

Historical documents that describe the earlier `0.3.0` or 22-attack state remain historical records and must not be rewritten as if those facts had never existed.

The current frozen v1 candidate baseline is:

- source/package version: `0.4.0`;
- stable corpus: 23 attacks;
- Node.js: `>=24 <25`;
- A2A wire baseline: `1.0`;
- MCP wire baseline: `2026-07-28`;
- repository CI: Ubuntu, macOS and Windows with Node 24;
- reusable Action: Node 24 with `bash`;
- native Windows Action compatibility is not implied solely by repository/package CI.

P12.4 adds an explicit current-baseline reconciliation note to the compatibility record rather than rewriting the historical P10.1 evidence.

## Deferred attack backlog disposition

No deferred attack candidate currently has evidence that makes it mandatory before v1 GA.

| Candidate        | P12.4 classification | Reason                                                                                                                                                     |
| ---------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HP-STATE-001`   | `POST-GA`            | Application state handles remain a valid future handoff seam, but no pre-GA product defect or separately admitted invariant requires stable inclusion now. |
| `HP-CACHE-001`   | `POST-GA`            | Private capability-cache crossing remains useful future coverage, but no reproduced pre-GA defect requires a new stable attack.                            |
| `HP-MRTR-001`    | `POST-GA`            | MRTR response binding is a defensible future composition candidate but is not required by current GA evidence.                                             |
| `HP-MRTR-002`    | `POST-GA`            | Delayed MRTR after cancellation remains a future specialization; existing lifecycle and stale-state coverage prevents speculative admission.               |
| `HP-ROUTING-001` | `POST-GA`            | Routing-metadata mismatch remains a future handoff-specific candidate without evidence requiring v1 admission.                                             |
| `HP-VERSION-001` | `POST-GA`            | Version downgrade semantics remain future coverage; the current compatibility contract and drift gates show no reproduced downgrade blocker.               |
| `HP-CONTENT-001` | `RESEARCH ONLY`      | It must demonstrate a structured handoff-authority consequence before it can be distinguished from generic prompt-injection testing.                       |
| `HP-CARD-001`    | `RESEARCH ONLY`      | Pure Agent Card validation is outside the product wedge; a distinct handoff consequence must be demonstrated before admission.                             |

Classification count:

- `PRE-GA REQUIRED`: 0;
- `POST-GA`: 6;
- `RESEARCH ONLY`: 2;
- backlog `NO ADD`: 0.

No stable attack is added by P12.4.

The stable corpus remains 23 attacks.

## Current research-queue disposition

Existing reproduced research results do not justify another pre-GA stable attack:

| Research item                                        | P12.4 disposition                                             |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| MCP #3354 execution-integrity / authority separation | `NO ADD` — refinement of existing semantic-authority coverage |
| Reddit R-1 token rotation / reconnect                | `NO ADD` — `HP-RACE-002` refinement                           |
| Reddit R-2 same-name hot deploy                      | `NO ADD` — `HP-APPROVAL-002` refinement                       |
| Reddit R-3 authorized tenant switch                  | `NO ADD` — `HP-TARGET-001` refinement                         |
| Reddit R-4 x402 payment binding                      | `NO ADD` — protocol semantics, no distinct stable invariant   |

External responses that remain pending may still produce future evidence. Silence is not validation and does not create a new attack requirement.

## Critical and High defect review

The baseline repository search found policy statements, historical blockers and release rules referring to Critical or High defects.

It did not identify a currently reproduced unresolved Critical or High HandoffProbe product defect.

A fresh reproducible Critical or High defect discovered later remains an immediate release blocker.

## P12.4 implementation decision

Current disposition:

- no `PRE-GA REQUIRED` attack candidate;
- no production scanner change required;
- no stable-corpus expansion;
- no `0.5.0` justification;
- no runtime expansion;
- no protocol expansion;
- no config or report schema change;
- no CLI or Action contract change.

The package remains `handoffprobe@0.4.0` with 23 stable attacks.

## Local validation result

The final P12.4 working state passed:

- focused P12.4 regression;
- typecheck and lint;
- complete repository validation;
- package validation;
- determinism, concurrency, redaction, performance and platform regression coverage;
- diff and exact-scope hygiene;
- package/version/runtime/protocol truth guards.

No known reproduced unresolved Critical or High HandoffProbe product defect was identified by this review.

Protected pull-request admission completed through PR `#175`.

P12.5 remains the next technical phase after protected P12.4 admission.

## Protected admission record

P12.4 entered repository truth through protected PR `#175`.

- candidate head: `d80be8e5036512009ff6e40d4089d07719c1f094`;
- protected merge commit: `5ec9d06057b1a17ad3d299d79c9105a964018c0e`;
- Dependency Review: passed;
- HandoffProbe: passed;
- Release Candidate: passed;
- CI: passed.

P12.4 is complete.

P12.5 is the next technical phase.
