# HandoffProbe Phase 6 — Automated Quality and GitHub Integration Specification

Status: completed 2026-08-29

This document defines the implementation and acceptance contract for Phase 6.

Phase 6 turns the completed local HandoffProbe CLI into a deterministic
repository-quality gate and a reusable GitHub Action without changing the
security semantics established by Phases 0–5.

The implementation remains open-source, local-first, deterministic and usable
without a paid AI service or hosted HandoffProbe account.

## 1. Phase 6 objective

Phase 6 has three deliverables:

1. harden repository CI;
2. provide a reusable HandoffProbe GitHub Action;
3. prove that a deliberate vulnerable regression produces a deterministic
   failing pull-request security gate.

Phase 6 does not add new attack families.

The stable bundled corpus remains:

- P0: 12 attacks;
- P1: 10 attacks;
- total: 22 attacks.

The protocol baseline remains:

- A2A 1.0;
- MCP 2026-07-28.

## 2. Non-goals

Phase 6 must not:

- broaden v0.1 beyond A2A → MCP;
- add a hosted dashboard;
- add authentication, billing or a database;
- require a paid AI API;
- require a public npm release;
- add telemetry;
- silently connect to third-party production systems;
- weaken existing redaction;
- change the meaning of CLI exit codes;
- change published machine-readable semantics without an explicit compatibility
  decision;
- introduce `pull_request_target` for execution of untrusted pull-request code.

## 3. Security model for GitHub automation

GitHub automation is part of HandoffProbe's security boundary.

Required principles:

- use least-privilege GitHub permissions;
- prefer `contents: read`;
- do not expose repository or organization secrets to untrusted pull-request
  code;
- do not use `pull_request_target` to execute pull-request code;
- do not print environment dumps;
- do not print GitHub tokens;
- do not upload `.env` files;
- do not upload raw secret-bearing evidence;
- preserve the Phase 5 redaction policy in logs, summaries and artifacts;
- do not use `eval` or shell-string construction for untrusted action inputs;
- validate action inputs before executing the scanner;
- third-party production workflow actions should be pinned to immutable commit
  SHAs, with the human-readable release version documented next to the pin.

A finding exit code must never be confused with scanner/runtime failure.

## 4. Repository CI contract

The existing CI baseline already performs:

- dependency installation with `npm ci`;
- format verification;
- lint;
- TypeScript typecheck;
- the complete Vitest suite;
- build;
- npm package validation.

Phase 6 must preserve that baseline and add the missing roadmap gates.

Required logical gates:

### 4.1 Quality

Quality must cover:

- format;
- lint;
- typecheck;
- unit tests;
- integration tests;
- regression tests;
- build;
- package validation.

These checks may run in one or multiple jobs, but failures must remain visible
and deterministic.

Node.js 24 remains the supported CI runtime for v0.1.

### 4.2 Dependency review

Pull requests must receive dependency-change review.

The gate must:

- inspect dependency changes introduced by the pull request;
- fail on newly introduced dependencies with unacceptable vulnerability
  severity;
- use a threshold no weaker than `high`;
- require no paid service;
- run only where the GitHub event provides a valid dependency diff.

The final implementation must document any GitHub platform limitation that
prevents dependency review from running in a specific event type.

### 4.3 Secret-safety validation

Repository CI must include deterministic secret-safety validation.

The gate must:

- scan repository-controlled content relevant to accidental credential
  inclusion;
- detect at minimum private-key material and common credential/token patterns;
- include synthetic regression coverage proving that a canary secret is
  detected;
- never print the discovered secret value;
- avoid sending repository contents to an external paid scanner;
- keep known synthetic fixture values distinguishable from real credentials.

The implementation may use a local script, a vetted GitHub Action or both, but
the safety properties above are mandatory.

## 5. HandoffProbe GitHub Action architecture

Phase 6 must add a repository-root GitHub Action metadata file:

`action.yml`

The initial action should be implemented as a source-backed composite action so
that Phase 6 does not depend on the npm package already being public.

The action may install and build HandoffProbe from its own checked-out action
source through `GITHUB_ACTION_PATH`.

The action must not assume that the calling repository contains HandoffProbe's
source tree.

The calling repository workspace and the action's own source directory must be
treated as separate trust/context locations.

## 6. Scanner execution rule

A single action invocation must execute the HandoffProbe scan exactly once.

The action must not run the security scan once for JSON and a second time for
Markdown merely to create two report formats.

Required flow:

1. validate action inputs;
2. execute the scanner once;
3. capture the deterministic scanner exit code;
4. write the machine-readable JSON report;
5. derive the GitHub Markdown summary from the completed report;
6. upload allowed artifacts;
7. propagate the original security/runtime result as the final action result.

This rule prevents duplicate active testing and keeps future non-synthetic
targets safe.

## 7. Action inputs

Initial supported action inputs:

### `target`

Allowed values:

- `secure`
- `vulnerable`

Default:

`secure`

The default must never connect to an external system.

### `tests`

Optional stable attack selection.

When supplied, values must resolve only to known stable `HP-` IDs.

Unknown IDs are usage failures.

### `fail-on`

Allowed values:

- `info`
- `low`
- `medium`
- `high`
- `critical`

Default:

`high`

This must preserve the CLI severity ordering and exit semantics.

### `artifact-name`

Optional artifact name.

Default:

`handoffprobe-report`

The value must be validated/sanitized and must not permit path traversal.

## 8. Action outputs

The action must expose sufficient deterministic outputs for downstream workflow
steps.

Required outputs:

- `exit-code`;
- `result`;
- `report-path`;
- `summary-path`.

`result` must distinguish at least:

- `pass`;
- `fail`;
- `error`.

The output must not collapse operational ERROR into vulnerability FAIL.

## 9. Report and artifact contract

Every pull-request action run must produce a machine-readable JSON report when
scanner execution reaches report generation.

The report must preserve the Phase 5 machine-readable semantics.

The GitHub workflow must also produce a human-readable summary.

Required artifact behavior:

- JSON is the canonical machine-readable artifact;
- Markdown is derived from the completed scan result;
- artifacts contain redacted report data only;
- raw `EvidenceEvent` context/details must not be uploaded when the existing
  reporter intentionally exposes only safe evidence references/counts;
- `.env`, process environments and credentials must never be included;
- security finding exit code `1` must not prevent safe artifacts from being
  uploaded;
- runtime/usage failure should preserve diagnostic artifacts when safely
  available.

Artifact handling must not require a paid HandoffProbe service.

## 10. Pull-request summary

The action must write a concise security result to:

`GITHUB_STEP_SUMMARY`

The first Phase 6 implementation must not require permission to post or edit a
pull-request comment.

The summary must contain at least:

- HandoffProbe identity;
- protocol baseline;
- target;
- selected attack count;
- PASS count;
- FAIL count;
- ERROR count;
- severity threshold;
- final security-gate result;
- artifact/report reference where available.

The summary must inherit report redaction.

## 11. Reference workflow

Phase 6 must add a repository workflow that exercises the local action on pull
requests.

Expected workflow path:

`.github/workflows/handoffprobe.yml`

The stable check/job identity should be:

`HandoffProbe`

The workflow must:

- run on `pull_request`;
- use the pull-request version of HandoffProbe for repository self-testing;
- use least-privilege permissions;
- avoid `pull_request_target`;
- use the default secure target for the normal control path;
- surface the GitHub step summary;
- preserve artifacts even when a security finding causes exit code `1`.

Running the HandoffProbe gate on `main` push may also be used for post-merge
verification.

## 12. Exit-code contract

GitHub Action behavior must preserve the CLI exit-code model:

- `0` — scan completed and no qualifying vulnerability FAIL exists;
- `1` — scan completed correctly and at least one vulnerability FAIL meets or
  exceeds the configured threshold;
- `2` — usage/configuration failure;
- `3` — scanner/runtime/output failure.

GitHub Actions should represent non-zero scanner outcomes as failed checks.

The report/summary must still distinguish:

- vulnerability finding (`1`);
- invalid use/configuration (`2`);
- scanner/runtime failure (`3`).

## 13. Deterministic merge gate

The merge-gate check name must remain stable enough to be configured as a
required GitHub status check/ruleset condition.

Phase 6 is not complete merely because a workflow becomes red.

The exit gate is satisfied only when all of the following have been proven:

1. a normal control pull request receives a successful HandoffProbe check;
2. a deliberate vulnerable regression receives a failing HandoffProbe check;
3. the failing run returns the expected security result rather than a scanner
   crash;
4. the machine-readable artifact is still available;
5. the GitHub summary correctly identifies the failed security gate;
6. repository merge policy/rules confirm that the failing required check blocks
   the demo pull request from merge;
7. the demo regression is never merged;
8. the temporary demo branch/PR is cleaned up after evidence is recorded.

If repository settings prevent required-check enforcement, Phase 6 must report
that limitation explicitly rather than claiming the merge gate is complete.

## 14. Demo vulnerable regression

The exit-gate demonstration must use an intentionally controlled repository
regression.

Requirements:

- use only HandoffProbe-owned synthetic fixtures or demo configuration;
- never target a third-party system;
- do not introduce real credentials;
- make the failure deterministic;
- produce a vulnerability exit code rather than an artificial shell failure;
- leave `main` unchanged;
- close the demo PR without merging it;
- delete the temporary demo branch after verification.

The exact regression mechanism may be chosen during implementation as long as it
tests the real GitHub Action path.

## 15. Testing requirements

Phase 6 implementation must add automated regression coverage for the GitHub
integration.

Coverage must include:

- action metadata validation;
- action input validation;
- severity input validation;
- stable attack-ID selection;
- safe argument construction;
- scanner exit-code propagation;
- JSON report creation;
- Markdown summary generation;
- secret redaction in summary/report handling;
- artifact-path validation;
- secret-safety canary detection;
- workflow static-safety assertions;
- rejection of unsafe `pull_request_target`;
- least-privilege workflow permissions;
- preservation of the existing 22-attack corpus.

Tests should remain deterministic and local wherever practical.

## 16. Supply-chain rules

Phase 6 must avoid weakening the repository while adding automation.

Required controls:

- use `npm ci`, not mutable dependency installation;
- preserve the committed lockfile;
- review new runtime dependencies carefully;
- prefer development-only tooling where runtime packaging is unnecessary;
- pin third-party GitHub Actions to immutable commits in finalized workflows;
- do not download and execute arbitrary scripts through `curl | sh`;
- do not require opaque hosted build infrastructure.

## 17. Compatibility rules

Phase 6 must not break:

- `node dist/cli.js test`;
- `handoffprobe test`;
- `handoffprobe list`;
- `handoffprobe explain <HP-ID>`;
- existing config precedence;
- reporter semantics;
- exit codes;
- 22 stable attack IDs;
- existing redaction behavior.

The GitHub Action is an integration layer over the scanner, not a replacement
execution engine.

## 18. Expected implementation surfaces

Likely Phase 6 implementation surfaces include:

- `action.yml`;
- `.github/workflows/ci.yml`;
- `.github/workflows/handoffprobe.yml`;
- action/helper source under `scripts/` or `src/`;
- automated tests under `tests/`;
- package scripts/development dependencies where required;
- README GitHub Action usage documentation;
- this specification;
- roadmap completion status.

The exact helper filenames may evolve without changing this contract.

## 19. Phase 6 completion gate

Phase 6 may be marked completed only when:

- existing repository quality gates remain green;
- dependency review is present and validated;
- secret-safety validation is present and validated;
- the GitHub Action runs the scanner in a PR workflow;
- severity threshold configuration works;
- machine-readable JSON artifact creation works;
- safe evidence/artifact handling works;
- `GITHUB_STEP_SUMMARY` works;
- exit codes remain deterministic;
- normal secure action execution passes;
- deliberate vulnerable execution fails as a security finding;
- the demo failing check is proven to block merge under repository policy;
- the complete existing test corpus remains green;
- package validation remains green;
- no real secret is exposed;
- no paid service is required.

Only after this gate may the roadmap status become:

`Status: completed <date>`

---

## 20. Phase 6 completion record

Phase 6 satisfied this implementation and acceptance contract on 2026-08-29.

The stable security corpus remains unchanged:

- P0: 12 attacks;
- P1: 10 attacks;
- total: 22 attacks;
- protocol baseline: A2A 1.0 → MCP 2026-07-28.

### 20.1 Repository quality gates

The completed repository automation provides:

- immutable-pinned GitHub checkout and Node setup;
- `npm ci`;
- format verification;
- ESLint;
- TypeScript typecheck;
- deterministic secret-safety validation;
- complete unit, integration and regression tests;
- build validation;
- npm package validation;
- pull-request Dependency Review.

Secret-safety regression coverage uses synthetic canaries and does not print
secret values.

Dependency Review executes without a paid external service.

### 20.2 HandoffProbe GitHub Action

The repository-root `action.yml` provides a source-backed composite GitHub
Action.

Verified behavior:

- default target: `secure`;
- default security threshold: `high`;
- stable attack-ID selection is validated;
- unsafe artifact names are rejected;
- the scanner executes exactly once per action invocation;
- JSON is the canonical machine-readable report;
- Markdown is derived from the completed scan;
- the same result is written to `GITHUB_STEP_SUMMARY`;
- exit code `0` represents a successful security gate;
- exit code `1` represents a completed scan with a qualifying vulnerability;
- exit code `2` remains a usage/configuration failure;
- exit code `3` remains a scanner/runtime/output failure;
- vulnerability FAIL is never collapsed into operational ERROR;
- safe artifacts are uploaded before security exit code `1` is propagated.

The normal repository pull-request control path runs the bundled secure target
and produces 22 / 22 PASS findings.

### 20.3 Supply-chain completion

Final external GitHub Action pins used by the Phase 6 implementation:

- `actions/checkout` v6.0.2:
  `de0fac2e4500dabe0009e67214ff5f5447ce83dd`;
- `actions/setup-node` v6.5.0:
  `249970729cb0ef3589644e2896645e5dc5ba9c38`;
- `actions/dependency-review-action` v5.0.0:
  `a1d282b36b6f3519aa1f3fc636f609c47dddb294`;
- `actions/upload-artifact` v7.0.1:
  `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a`.

The final `actions/upload-artifact` pin uses its native Node.js 24 runtime.

### 20.4 Required merge policy

The protected `main` branch requires these GitHub Actions checks:

- `HandoffProbe`;
- `Quality`;
- `Dependency Review`.

All three required checks are bound to GitHub Actions app ID `15368`.

Repository merge policy additionally verifies:

- strict/up-to-date required status checks;
- required-check enforcement for administrators;
- no mandatory pull-request review requirement;
- force pushes disabled;
- branch deletion disabled.

### 20.5 Deterministic vulnerable merge-gate proof

The Phase 6 exit-gate demonstration used only the bundled synthetic vulnerable
target.

Evidence:

- demo pull request: #11;
- demo head:
  `6a5a4f1c02efdaecf208ced3d258d01a9f08fce9`;
- HandoffProbe workflow run: `33251273506`;
- Quality workflow run: `33251273501`;
- Dependency Review workflow run: `33251273503`;
- HandoffProbe findings: 22 FAIL / 22 total;
- HIGH or CRITICAL failing findings: 20;
- runtime ERROR count: 0;
- HandoffProbe result: security FAIL;
- HandoffProbe exit code: `1`;
- Quality result: success;
- Dependency Review result: success;
- failed HandoffProbe run still uploaded the safe JSON and Markdown artifact;
- GitHub merge state: `BLOCKED`;
- the failing HandoffProbe check was a required status check;
- administrator enforcement remained active;
- demo pull request #11 was closed without merge;
- the temporary demo branch was deleted locally and remotely;
- `main` remained unchanged throughout the demonstration.

No real credential, third-party production target, paid AI service or hosted
HandoffProbe account was used.

### 20.6 Completion conclusion

Every acceptance requirement in section 19 has been demonstrated.

Phase 6 exit gate:

`A deliberate vulnerable regression blocks a demo pull request.`

Result:

`SATISFIED`
