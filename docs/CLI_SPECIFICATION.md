# HandoffProbe Phase 5 — CLI Specification

Status: completed 2026-08-29

This document defines the developer-facing CLI contract for Phase 5.

The goal is to turn the existing HandoffProbe engine and 22-attack corpus into
a safe, deterministic command-line product that a developer unfamiliar with
the repository can install and use without direct assistance.

Phase 5 remains local-first, requires no paid account and performs no real
external side effects when using bundled fixtures.

## 1. Required command surface

Primary entry point:

`npx handoffprobe test`

Required commands:

- `handoffprobe test`
- `handoffprobe list`
- `handoffprobe explain <HP-ID>`
- `handoffprobe --version`
- `handoffprobe --help`

Unknown commands and options are usage errors.

## 2. Global behavior

The CLI must:

- write normal output to stdout;
- write usage/config/runtime errors to stderr;
- preserve deterministic ordering;
- preserve PASS / FAIL / NOT_APPLICABLE / INCONCLUSIVE / ERROR semantics;
- never convert execution ERROR into vulnerability FAIL;
- identify HandoffProbe and protocol versions;
- inherit evidence redaction;
- never print raw secrets;
- never require telemetry, signup or network access for bundled fixtures.

## 3. `handoffprobe test`

With no config and no target flag, `handoffprobe test` executes the bundled
secure reference target.

Supported bundled targets in Phase 5:

- `secure` — default
- `vulnerable`

Example:

`handoffprobe test --target vulnerable`

The default must never silently connect to an external system.

### Attack selection

Examples:

`handoffprobe test --test HP-AUTH-001`

Multiple `--test` flags are supported.

Without explicit selection, all applicable stable bundled attacks are selected.

Unknown attack IDs are usage/configuration errors.

### Severity gate

Example:

`handoffprobe test --fail-on high`

Allowed values:

- info
- low
- medium
- high
- critical

Ordering:

`info < low < medium < high < critical`

Default threshold: `high`.

All findings remain visible regardless of threshold. The threshold controls the
security-gate exit code.

## 4. `handoffprobe list`

`handoffprobe list` lists every stable bundled attack.

Each row includes at least:

- attack ID
- name
- priority
- default severity
- category

Ordering is deterministic: P0 before P1, then stable ID ordering.

At Phase 5 start the catalog contains:

- P0: 12
- P1: 10
- total: 22

## 5. `handoffprobe explain <HP-ID>`

The command displays:

- ID
- name
- category
- priority
- default severity
- expected invariant
- preconditions
- mutation steps
- evidence requirements
- property class
- protocol applicability
- side-effect classification
- source/provenance references

Unknown IDs are usage errors and should recommend `handoffprobe list`.

`explain` never executes an attack.

## 6. Configuration

Phase 5 introduces `handoffprobe.config.json` in the current working directory.

Absence of the file is valid.

Initial keys:

- `target`
- `tests`
- `failOn`
- `reporter`
- `output`

Supported reporters:

- terminal
- json
- markdown

CLI flags override config values.

Unknown keys, malformed JSON and invalid values must fail clearly and must not
be silently ignored.

## 7. Reporters

### Terminal

Must include:

- HandoffProbe version
- selected target
- protocol baseline
- selected attack count
- per-attack ID/title/status/severity
- concise observed behavior
- evidence reference/count
- summary
- final gate result

Color must not be required.

### JSON

JSON output contains no prose outside the JSON document.

Initial top-level fields:

- `schemaVersion`
- `handoffProbeVersion`
- `target`
- `protocols`
- `selection`
- `threshold`
- `summary`
- `findings`

Summary counts:

- pass
- fail
- notApplicable
- inconclusive
- error
- total

Secrets remain redacted.

### Markdown

Markdown output is intended for CI artifacts, PR summaries and review records.

It contains scan metadata, summary, findings, FAIL/ERROR details, protocol
versions, threshold and final gate result.

Identical inputs must produce deterministic Markdown content.

## 8. Output files

Example:

`handoffprobe test --reporter json --output handoffprobe-report.json`

When `--output` is omitted, report content goes to stdout.

When supplied, the report is written to the requested path.

Write failures are runtime/tool errors and must never become vulnerability
findings.

## 9. Exit codes

### Exit 0 — successful security run

Execution completed correctly and no FAIL meets/exceeds the configured
threshold, with no execution ERROR.

PASS, NOT_APPLICABLE and INCONCLUSIVE alone do not fail the security gate.

### Exit 1 — security gate failed

At least one vulnerability FAIL meets/exceeds `failOn`.

This means HandoffProbe executed correctly and found a security failure.

### Exit 2 — usage/configuration error

Examples:

- unknown command
- unknown option
- unknown attack ID
- malformed config
- invalid severity
- invalid reporter
- missing argument

This is not a vulnerability result.

### Exit 3 — scanner/runtime error

Examples:

- adapter failure
- unexpected execution failure
- output write failure
- internal failure preventing trustworthy completion

This is not a vulnerability result.

ERROR must never be represented as exit 1.

## 10. Protocol visibility

Runs expose the current baseline:

- A2A 1.0
- MCP 2026-07-28

The CLI must not imply applicability to protocol versions outside each attack
definition.

## 11. Security requirements

The CLI must:

- inherit existing redaction behavior;
- never print raw bearer credentials;
- never dump environment variables;
- never record external secrets in reports;
- contact no analytics service by default;
- require no telemetry or signup;
- perform no real destructive actions through bundled fixtures.

## 12. CLI execution catalog

Phase 5 needs one deterministic CLI-facing execution catalog mapping every
stable attack ID to:

- AttackDefinition
- fixture/scenario factory
- secure target factory
- vulnerable target factory
- context factory

The CLI consumes this catalog instead of maintaining a second metadata list.

All 22 stable attacks must have execution bindings.

A missing binding is a product defect.

## 13. Implementation order

### Phase 5.1 — execution catalog

- bind all 22 attacks to one CLI-facing execution model;
- deterministic ordering;
- drift tests between metadata and bindings.

### Phase 5.2 — discovery commands

Implement `list` and `explain`.

### Phase 5.3 — test command

Implement secure default, vulnerable target, full corpus, selection and summary.

### Phase 5.4 — config and threshold

Implement config loading, CLI-over-config precedence, `--fail-on` and exit
codes.

### Phase 5.5 — reporters

Implement terminal, JSON, Markdown and optional output file.

### Phase 5.6 — troubleshooting and hardening

Add actionable errors, invalid-input coverage, redaction regression,
deterministic-output regression and protocol-version visibility.

### Phase 5.7 — developer experience exit gate

Update README installation, one-command demo, secure/vulnerable examples,
command reference, report examples and troubleshooting.

Then run the complete repository quality gate.

## 14. Phase 5 exit gate

Phase 5 is complete only when:

- `npx handoffprobe test` works from the packaged artifact;
- `handoffprobe list` exposes all 22 stable attacks;
- `handoffprobe explain <HP-ID>` works for all 22;
- secure and vulnerable bundled targets behave as designed;
- attack selection works;
- configuration and CLI precedence work;
- severity gating works;
- terminal, JSON and Markdown reporters work;
- output files work;
- exit codes 0 / 1 / 2 / 3 are deterministic;
- ERROR never becomes vulnerability FAIL;
- protocol applicability is visible;
- redaction remains effective;
- identical inputs produce deterministic outputs;
- README reproduces the complete demo;
- package validation contains required CLI artifacts;
- format, lint, typecheck, tests and build are green;
- dependency audit has no unresolved high-severity issue;
- bundled behavior needs no paid service;
- bundled behavior performs no real external side effects.

A developer unfamiliar with HandoffProbe must be able to reproduce the full
Phase 5 demo using only the README.

## 15. Completion record

Phase 5 was completed on 2026-08-29.

The implemented CLI baseline now satisfies this contract:

- `test`, `list`, `explain <HP-ID>`, `--version`, and `--help` are implemented;
- the execution catalog binds all 22 stable attacks;
- `list` exposes all 22 stable attacks deterministically;
- `explain` works for all 22 stable attack IDs without execution;
- the bundled secure target produces 22 PASS findings;
- the bundled vulnerable target reproduces 22 FAIL findings;
- repeatable `--test` selection and deduplication are deterministic;
- `handoffprobe.config.json` is supported;
- CLI arguments override config values;
- `--fail-on` supports info, low, medium, high, and critical;
- the default severity threshold is high;
- terminal, JSON, and Markdown reporters are implemented;
- JSON and Markdown reporter output is deterministic;
- `--output` writes the selected report to a file;
- output-write failures return exit code 3;
- usage and configuration errors return exit code 2;
- qualifying vulnerability findings return exit code 1;
- successful scans without qualifying vulnerability findings return exit code 0;
- scanner/runtime ERROR remains distinct from vulnerability FAIL and never becomes exit code 1;
- A2A 1.0 and MCP 2026-07-28 are explicit in CLI output;
- structured and free-text secret redaction is active;
- Bearer and Basic credentials are redacted from diagnostics;
- runtime troubleshooting avoids leaking raw OS paths and raw system error messages;
- the README documents the complete local developer workflow;
- the npm package contains the required CLI artifacts;
- a real locally packed npm tarball executes successfully through `npx`;
- the packaged secure demo produces 22 PASS findings with exit code 0;
- the packaged vulnerable demo reproduces a FAIL finding with exit code 1;
- the bundled developer workflow remains synthetic, local-first, non-destructive, and requires no paid AI service.

The package remains at version `0.0.0` and is not publicly released on npm yet.
Public npm publication is intentionally deferred to a later release phase.
