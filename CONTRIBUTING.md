# Contributing to HandoffProbe

HandoffProbe welcomes contributions that improve defensive testing of security-sensitive AI-agent handoffs.

## Before contributing

Read `PROJECT_CONTEXT.md` and the documents under `docs/`. The v0.1 scope is deliberately narrow: A2A 1.0 -> MCP 2026-07-28.

## Good early contributions

- reproducible handoff attack/test definitions
- secure and vulnerable fixtures
- protocol/translation adapter improvements
- deterministic assertions
- tests and regressions
- documentation and examples
- portability and developer-experience fixes

## Proposing an attack test

A strong proposal should include:

- proposed `HP-*` test ID/category
- security invariant being tested
- why the failure is handoff/composition-specific
- preconditions
- minimal mutation/attack scenario
- expected safe behavior
- observable failure condition
- evidence required to prove the result
- protocol-version applicability
- property class and source/provenance
- whether it is a protocol, implementation, configuration or composition-responsibility issue

Avoid vague checks such as "AI behaves unsafely" when a deterministic property can be tested instead.

## Code expectations

Once the codebase is bootstrapped:

- add or update tests for behavior changes
- keep changes focused
- avoid adding paid/cloud dependencies without discussion
- do not commit secrets or real credentials
- use local/synthetic fixtures for security tests
- update docs when public behavior changes

## Responsible security work

Follow `SECURITY.md`. Contributions must not include stolen data, live third-party credentials or unnecessary weaponization of vulnerabilities.
