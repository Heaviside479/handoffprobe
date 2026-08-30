# HandoffProbe

Open-source adversarial security testing for AI agent handoffs.

HandoffProbe tests whether security properties survive when an AI-agent action crosses protocol and execution boundaries.

Current deterministic protocol baseline:

**A2A 1.0 → MCP 2026-07-28**

The bundled developer experience is local-first, deterministic and synthetic.
It requires no paid AI service, no telemetry and no signup.

## Why HandoffProbe exists

A system can look secure at each individual protocol layer while becoming insecure at the handoff between those layers.

```text
Human / calling service
        |
        v
     Agent A
        | A2A 1.0
        v
     Agent B / translation layer
        | MCP 2026-07-28
        v
       Tool
```

HandoffProbe checks security properties such as:

- delegated authority;
- principal identity;
- tenant continuity;
- resource binding;
- approval and consent;
- credential audience;
- replay protection;
- cancellation;
- retry identity;
- audit lineage.

## Current status

The developer CLI currently includes:

- 12 stable P0 attacks;
- 10 stable P1 attacks;
- 22 stable attacks total;
- secure and intentionally vulnerable bundled fixtures;
- terminal, JSON and Markdown reporters;
- deterministic CI exit codes;
- secret redaction and safe runtime diagnostics;
- reusable source-backed composite GitHub Action;
- pull-request summaries and machine-readable artifacts;
- repository gates for dependency review and secret safety.

The npm package is publicly available as **`handoffprobe@0.1.0`**.

The current public package version is `0.1.0`. Exact-version npm commands below are verified against the public registry.

## Requirements

- Node.js `>=24 <25`
- npm

## Installation

Detailed installation instructions are in [`docs/INSTALLATION.md`](docs/INSTALLATION.md).
The complete CLI and automation guide is in [`docs/USAGE.md`](docs/USAGE.md).

Use the public exact-version commands below for the released package, or use the source checkout or locally packed tarball for development.

The canonical public exact-version checks are:

```bash
npx --yes --package=handoffprobe@0.1.0 handoffprobe --version
npx --yes --package=handoffprobe@0.1.0 handoffprobe test
```

## Quick start from source

```bash
git clone https://github.com/Heaviside479/handoffprobe.git
cd handoffprobe
npm ci
npm run build
node dist/cli.js test
```

The default target is the bundled `secure` target.

Expected high-level result:

```text
Target: secure
Protocols: A2A 1.0 | MCP 2026-07-28
Selected attacks: 22

Summary:
  PASS: 22
  FAIL: 0
  ERROR: 0
  TOTAL: 22

Security gate: PASS
```

## Packaged-artifact demo

To create the package tarball locally:

```bash
PACKAGE_TARBALL="$(npm pack --silent)"
```

Run the packaged CLI through `npx`:

```bash
npx --yes --package="./$PACKAGE_TARBALL" handoffprobe test
```

For the public `handoffprobe@0.1.0` release, the canonical exact-version commands are:

```bash
npx --yes --package=handoffprobe@0.1.0 handoffprobe --version
npx --yes --package=handoffprobe@0.1.0 handoffprobe test
```

The shorter convenience command is:

```bash
npx handoffprobe test
```

## GitHub Action

HandoffProbe includes a reusable source-backed composite GitHub Action in
[`action.yml`](action.yml).

The action installs and builds HandoffProbe from its own `GITHUB_ACTION_PATH`.
It therefore does not require the calling repository to contain the HandoffProbe
source tree or depend on the npm package already being publicly released.

A single action invocation executes the scanner exactly once. The canonical
machine-readable JSON report and the Markdown/GitHub summary are derived from
that same completed scan.

The repository self-test uses:

```yaml
- uses: ./
  with:
    target: secure
    fail-on: high
    artifact-name: handoffprobe-report
```

For another repository, pin HandoffProbe to a reviewed immutable commit SHA:

```yaml
name: HandoffProbe

on:
  pull_request:

permissions:
  contents: read

jobs:
  handoffprobe:
    name: HandoffProbe
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd
        with:
          persist-credentials: false

      - uses: Heaviside479/handoffprobe@90fdd691b390c420e3288383ad7efa7e0fb69e6f
        with:
          target: secure
          fail-on: high
          artifact-name: handoffprobe-report
```

The pin above is the reviewed immutable commit for HandoffProbe v0.1.0.
Review the release notes before changing this revision; the human-readable `v0.1.0` tag remains useful for discovery while the commit SHA is the stronger supply-chain pin.

Supported inputs:

| Input           | Default               | Meaning                                               |
| --------------- | --------------------- | ----------------------------------------------------- |
| `target`        | `secure`              | bundled `secure` or intentionally `vulnerable` target |
| `tests`         | all stable attacks    | optional comma-separated stable `HP-` IDs             |
| `fail-on`       | `high`                | `info`, `low`, `medium`, `high` or `critical`         |
| `artifact-name` | `handoffprobe-report` | validated artifact name                               |

Action outputs:

| Output         | Meaning                                   |
| -------------- | ----------------------------------------- |
| `exit-code`    | deterministic HandoffProbe exit code      |
| `result`       | `pass`, `fail` or `error`                 |
| `report-path`  | canonical JSON report path when available |
| `summary-path` | generated Markdown summary path           |

Security behavior:

- exit code `0` means the security gate passed;
- exit code `1` means the scan completed correctly and found a qualifying vulnerability;
- exit code `2` means usage or configuration failure;
- exit code `3` means scanner, runtime or output failure;
- a security exit code `1` still uploads its safe report artifact before the GitHub check fails;
- reports contain redacted finding data plus safe evidence counts and sequence references;
- the reference pull-request workflow uses `contents: read`;
- the reference workflow does not use `pull_request_target`.

The protected `main` branch of this repository currently requires:

- `HandoffProbe`;
- `Quality`;
- `Dependency Review`.

The Phase 6 merge-gate demonstration proved that a qualifying HandoffProbe
security failure blocks a non-draft pull request while Quality and Dependency
Review remain successful.

## Opt-in adoption and integration feedback

HandoffProbe does not collect hidden usage telemetry. If you choose to share how you use the project, the repository provides two voluntary public feedback paths:

- [Share adoption / integration feedback](https://github.com/Heaviside479/handoffprobe/issues/new?template=adoption-feedback.yml) — report one-time evaluation, repeated local use, repeated CI use, friction and an optional public integration.
- [Request an adapter / integration](https://github.com/Heaviside479/handoffprobe/issues/new?template=adapter-request.yml) — provide evidence about a real handoff path, protocol versions, reproducibility and integration demand.

These reports are public and optional. An adapter request is evidence for evaluation; it does not guarantee implementation.

Do not include secrets, private data or undisclosed vulnerabilities in these public forms. Follow [`SECURITY.md`](SECURITY.md) for security-sensitive reporting.

## Vulnerable demo

HandoffProbe includes intentionally vulnerable synthetic fixtures for defensive testing.

```bash
node dist/cli.js test --target vulnerable --test HP-AUTH-001
```

Expected result:

```text
FAIL           HP-AUTH-001 Delegated authority amplification [HIGH]

Security gate: FAIL
```

This exits with code `1`.

## Run the complete corpus

Secure reference target:

```bash
node dist/cli.js test
```

Intentionally vulnerable target:

```bash
node dist/cli.js test --target vulnerable
```

## Select attacks

Run one attack:

```bash
node dist/cli.js test --test HP-AUTH-001
```

Run multiple attacks:

```bash
node dist/cli.js test --test HP-AUTH-001 --test HP-CRED-001
```

Repeated IDs are deduplicated and execution order remains deterministic.

## Discover attacks

List all 22 stable attacks:

```bash
node dist/cli.js list
```

Explain one attack without executing it:

```bash
node dist/cli.js explain HP-AUTH-001
```

## Severity gate

Supported thresholds:

```text
info < low < medium < high < critical
```

The default threshold is `high`.

Example:

```bash
node dist/cli.js test --target vulnerable --test HP-CRED-001 --fail-on medium
```

All findings remain visible.
The threshold controls the process exit code, not finding visibility.

## Reporters

HandoffProbe supports three deterministic reporters:

- `terminal`
- `json`
- `markdown`

Terminal:

```bash
node dist/cli.js test --test HP-AUTH-001 --reporter terminal
```

JSON:

```bash
node dist/cli.js test --test HP-AUTH-001 --reporter json
```

Markdown:

```bash
node dist/cli.js test --test HP-AUTH-001 --reporter markdown
```

JSON writes only the JSON document to stdout.
Markdown is suitable for CI artifacts and pull-request summaries.

Reports expose safe evidence counts and sequence references instead of raw EvidenceEvent context/details.

## Configuration

HandoffProbe reads an optional `handoffprobe.config.json` from the current working directory.

Example:

```json
{
  "target": "vulnerable",
  "tests": ["HP-AUTH-001", "HP-CRED-001"],
  "failOn": "high",
  "reporter": "json",
  "output": "handoffprobe-report.json"
}
```

Supported keys:

- `target`
- `tests`
- `failOn`
- `reporter`
- `output`

The config file is optional.
Unknown keys, malformed JSON and invalid values are rejected.
CLI flags override config values.

## Output files

Write a JSON report to a file:

```bash
node dist/cli.js test --test HP-AUTH-001 --reporter json --output handoffprobe-report.json
```

When `--output` is supplied, the selected report is written to that path instead of stdout.
An output write failure is a runtime error and returns exit code `3`.

## Exit codes

| Exit | Meaning                                                                   |
| ---: | ------------------------------------------------------------------------- |
|  `0` | scan completed correctly and no qualifying vulnerability FAIL exists      |
|  `1` | at least one vulnerability FAIL meets or exceeds the configured threshold |
|  `2` | usage or configuration error                                              |
|  `3` | scanner, runtime or output error                                          |

**ERROR is never converted into vulnerability exit code `1`.**

Exit code `1` means HandoffProbe executed correctly and detected a qualifying security failure.
Exit code `3` means the operation could not complete trustworthily.

## Security and redaction

The CLI includes:

- recursive structured secret redaction;
- free-text bearer/basic credential redaction;
- sensitive key/value redaction;
- redacted terminal finding text;
- redacted JSON finding text;
- redacted Markdown finding text;
- deterministic runtime diagnostics;
- no raw OS path in output-write diagnostics;
- no raw runtime `error.message`;
- no environment dump;
- no telemetry or signup requirement.

Reports use safe evidence counts and sequence references instead of raw EvidenceEvent context/details.
Bundled fixtures are synthetic and perform no real external destructive actions.

## Troubleshooting

### Invalid configuration

Check that `handoffprobe.config.json` contains valid JSON and only supported keys.

```bash
node dist/cli.js --help
```

### Unknown attack ID

List the stable attack IDs:

```bash
node dist/cli.js list
```

Then inspect one attack:

```bash
node dist/cli.js explain HP-AUTH-001
```

### Report file cannot be written

Ensure the parent directory exists and is writable.

```bash
mkdir -p reports
node dist/cli.js test --reporter json --output reports/handoffprobe.json
```

Output-write failures return exit code `3`.

### Exit code 1

This is a detected vulnerability, not a scanner crash.

### Exit code 3

This indicates a scanner, runtime or output problem rather than a vulnerability finding.
Use the deterministic troubleshooting message written to stderr and rerun the same command.

## Command reference

```text
handoffprobe test [options]
handoffprobe list
handoffprobe explain <HP-ID>
handoffprobe --version
handoffprobe --help
```

Test options:

```text
--target secure|vulnerable
--test <HP-ID>                 repeatable
--fail-on info|low|medium|high|critical
--reporter terminal|json|markdown
--output <path>
```

## What HandoffProbe is not

HandoffProbe is not intended to replace:

- official A2A conformance or inspection tooling;
- the official MCP Inspector;
- generic LLM red-team platforms;
- a production runtime firewall or gateway;
- an identity provider.

The core admission rule remains:

> A core test must exercise a security property that can be lost because an agent handoff composes or translates protocol/security context.

## Principles

- Open-source core under Apache-2.0.
- Local-first.
- Safe and authorized testing only.
- Synthetic bundled targets.
- No paid AI API required for bundled tests.
- Deterministic attacks before AI-assisted heuristics.
- Evidence before UI.
- No hidden external side effects.
- No telemetry or signup requirement.
- Initial protocol wedge remains A2A → MCP.

## Project documents

- [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) — canonical project context
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — product definition
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — implementation and launch roadmap
- [`docs/INSTALLATION.md`](docs/INSTALLATION.md) — installation and release-candidate execution
- [`docs/USAGE.md`](docs/USAGE.md) — CLI commands, reporters, configuration and exit codes
- [`docs/RESEARCH_ARTICLE.md`](docs/RESEARCH_ARTICLE.md) — v0.1 composition-security research article
- [`docs/LAUNCH_EXAMPLES.md`](docs/LAUNCH_EXAMPLES.md) — reproducible v0.1 launch examples
- [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md) — evidence-backed v0.1 release checklist
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — architecture
- [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md) — threat model
- [`docs/ATTACK_CATALOG.md`](docs/ATTACK_CATALOG.md) — attack catalog
- [`docs/P0_TEST_SPECIFICATION.md`](docs/P0_TEST_SPECIFICATION.md) — P0 acceptance contract
- [`docs/P1_TEST_SPECIFICATION.md`](docs/P1_TEST_SPECIFICATION.md) — P1 acceptance contract
- [`docs/CLI_SPECIFICATION.md`](docs/CLI_SPECIFICATION.md) — CLI contract
- [`docs/GITHUB_INTEGRATION_SPECIFICATION.md`](docs/GITHUB_INTEGRATION_SPECIFICATION.md) — GitHub Action and CI contract
- [`docs/TECHNICAL_BASELINE.md`](docs/TECHNICAL_BASELINE.md) — technical baseline
- [`docs/FINAL_PRODUCT_DEFINITION.md`](docs/FINAL_PRODUCT_DEFINITION.md) — mature-product definition
- [`docs/RESEARCH_BASELINE.md`](docs/RESEARCH_BASELINE.md) — protocol and research baseline
- [`docs/COMPETITIVE_LANDSCAPE.md`](docs/COMPETITIVE_LANDSCAPE.md) — competitive landscape
- [`docs/SEVERITY.md`](docs/SEVERITY.md) — severity policy
- [`SECURITY.md`](SECURITY.md) — authorized-use and disclosure policy
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution guidelines

## License

Apache License 2.0. See [`LICENSE`](LICENSE).
