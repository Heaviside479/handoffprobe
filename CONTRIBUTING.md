# Contributing to HandoffProbe

HandoffProbe welcomes contributions that improve defensive testing of security-sensitive AI-agent handoffs.

## Before contributing

Read `PROJECT_CONTEXT.md`, `AGENTS.md` and the relevant documents under `docs/`. The current verified public release is `handoffprobe@0.4.0` with 23 stable attacks: 12 P0 + 10 P1 + 1 advanced (`HP-AUTH-006`). The public protocol baseline remains A2A 1.0 -> MCP 2026-07-28. Repository research/conformance tooling is not automatically part of the stable public runtime surface.

## Good early contributions

- reproducible handoff attack/test definitions
- secure and vulnerable fixtures
- protocol/translation adapter improvements
- deterministic assertions
- tests and regressions
- documentation and examples
- portability and developer-experience fixes

## Schneller Contributor-Einstieg

Für kleine, reproduzierbare Beiträge gibt es einen konkreten Phase-8.5A-Einstieg:

- [Phase-8.5A-Contributor-Quickstart](docs/PHASE8_CONTRIBUTOR_LOOP_20260831.md)

Der Quickstart definiert lokale Voraussetzungen, Fixture-Regeln, Test-Erwartungen und den Vertrag für kleine extern bearbeitbare Aufgaben.

Vor einem Pull Request sollen mindestens die gezielten Tests der Änderung und anschließend die vollständigen lokalen Qualitäts-Gates ausgeführt werden.

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

## Adapter and integration demand

HandoffProbe does not collect hidden usage telemetry. Public users and contributors can voluntarily provide evidence through:

- [adoption / integration feedback](https://github.com/Heaviside479/handoffprobe/issues/new?template=adoption-feedback.yml);
- [adapter / integration requests](https://github.com/Heaviside479/handoffprobe/issues/new?template=adapter-request.yml).

Adapter requests should describe a real handoff/composition path, protocol versions, handoff-specific security value and a reproducible local, public-research or explicitly authorized test path.

These public reports must not contain secrets, private data or undisclosed vulnerabilities. Security-sensitive reporting continues to follow `SECURITY.md`.

## Code expectations

For the current codebase:

- add or update tests for behavior changes
- keep changes focused
- avoid adding paid/cloud dependencies without discussion
- do not commit secrets or real credentials
- use local/synthetic fixtures for security tests
- update docs when public behavior changes
- preserve historical research/release records as historical snapshots
- run focused tests plus `npm run check` before merge
- run `npm run package:check` when package/release-facing surfaces change
- do not create a new stable `HP-*` ID without the normal evidence/admission process

## Responsible security work

Follow `SECURITY.md`. Contributions must not include stolen data, live third-party credentials or unnecessary weaponization of vulnerabilities.
