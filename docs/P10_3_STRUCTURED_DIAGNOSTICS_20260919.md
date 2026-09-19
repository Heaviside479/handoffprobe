# P10.3 structured diagnostic hardening

Date: 2026-09-19

Status: **COMPLETE — 2026-09-19**

## Purpose

This P10.3 step hardens CLI runtime diagnostics by introducing one deterministic structured diagnostic record as the source of truth for scanner and output failures.

The change is reliability hardening. It does not alter attack admission, stable attack IDs, report schema, configuration schema or exit-code meaning.

## Structured diagnostic contract

Internal runtime diagnostics contain:

- diagnostic schema version;
- failure kind;
- stable diagnostic code;
- severity;
- optional HandoffProbe Core error code;
- optional sanitized stage;
- safe human-readable message;
- deterministic troubleshooting guidance.

Raw exception messages, raw OS paths, secret-bearing Core details and arbitrary thrown values are not serialized into the structured record.

## Compatibility classification

Classification: **COMPATIBLE**.

The existing human-readable stderr messages remain unchanged.

CLI commands, CLI options, exit codes, report schema `1`, config schema `1`, package-root API, protocol baseline and stable attack corpus remain unchanged.

The structured diagnostic representation is internal reliability infrastructure and does not add a new public CLI flag or reporter.

## Validation result

Validation completed successfully on 2026-09-19.

The structured diagnostic model now:

- produces deterministic scanner and output diagnostics;
- keeps raw exception text and OS paths out of structured diagnostics;
- sanitizes Core stage information;
- preserves the existing human-readable CLI error messages;
- preserves CLI exit-code behavior;
- preserves report schema `1` and config schema `1`.

Full repository validation passed with 113 test files and 562 tests.

## Validation requirement

Before this roadmap item can close:

- structured scanner diagnostics must be deterministic;
- structured output diagnostics must not expose raw OS errors or paths;
- arbitrary scanner errors must not expose raw exception text;
- Core stage data must be sanitized;
- existing human-readable runtime diagnostics must remain unchanged;
- focused and full repository quality gates must pass.
