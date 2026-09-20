# Usage

HandoffProbe v0.4.0 is a deterministic defensive security CLI for A2A 1.0 → MCP 2026-07-28 handoffs. Release metadata is synchronized at `0.4.0`; registry-backed availability must be verified independently as documented in [`INSTALLATION.md`](INSTALLATION.md).

The examples below use the installed `handoffprobe` command. Install the exact public release as documented in [`INSTALLATION.md`](INSTALLATION.md), or use the exact-version public `npx` commands shown there for one-shot execution.

## Command surface

```text
handoffprobe test [options]
handoffprobe list
handoffprobe explain <HP-ID>
handoffprobe --version
handoffprobe --help
```

## Run the secure control

```bash
handoffprobe test
```

The default target is `secure`.

Expected high-level result:

```text
Target: secure
Protocols: A2A 1.0 | MCP 2026-07-28
Selected attacks: 23

Summary:
  PASS: 23
  FAIL: 0
  ERROR: 0
  TOTAL: 23

Security gate: PASS
```

A successful secure control exits `0`.

## Run the intentionally vulnerable target

```bash
handoffprobe test --target vulnerable --test HP-AUTH-001
```

Expected finding:

```text
FAIL           HP-AUTH-001 Delegated authority amplification [HIGH]
```

The vulnerable demonstration exits `1` at the default `high` threshold.

The bundled target is intentionally vulnerable synthetic test code. A failure here does not mean A2A or MCP is inherently insecure; it demonstrates a composition/integration invariant that the vulnerable handoff breaks.

HandoffProbe v0.4.0 retains the v0.3.0 `HP-AUTH-001` semantic-authority behavior across upstream delegated authority, translated authority and effective downstream authority, and adds `HP-AUTH-006`. `HP-AUTH-006` verifies that successful authorization of an earlier protected effect does not authorize a later distinct protected effect after the governing authority becomes non-current; the later effect must receive current final authorization before dispatch.

## List stable attacks

```bash
handoffprobe list
```

HandoffProbe v0.4.0 contains exactly 23 stable attacks: 12 P0, 10 P1 and 1 additional advanced attack (`HP-AUTH-006`). Phase 9 crossing-corpus cases remain research/conformance cases and do not become additional stable `HP-*` attacks.

## Explain an attack

```bash
handoffprobe explain HP-AUTH-001
```

`explain` reads the canonical stable attack metadata without executing the attack.

## Select attacks

Run one attack:

```bash
handoffprobe test --test HP-AUTH-001
```

Run several attacks by repeating `--test`:

```bash
handoffprobe test --test HP-AUTH-001 --test HP-CRED-001
```

Repeated IDs are deduplicated. Stable execution order remains deterministic.

## Targets

Supported bundled targets:

- `secure`
- `vulnerable`

Example:

```bash
handoffprobe test --target secure
```

Unknown targets are usage errors and exit `2`.

## Severity threshold

Supported thresholds:

```text
info < low < medium < high < critical
```

The default is `high`.

Example:

```bash
handoffprobe test --target vulnerable --test HP-CRED-001 --fail-on medium
```

The threshold affects the process exit gate. It does not hide lower-severity findings from the report.

## Reporters

Supported reporters:

- `terminal`
- `json`
- `markdown`

Terminal:

```bash
handoffprobe test --test HP-AUTH-001 --reporter terminal
```

JSON:

```bash
handoffprobe test --test HP-AUTH-001 --reporter json
```

Markdown:

```bash
handoffprobe test --test HP-AUTH-001 --reporter markdown
```

Without `--output`, JSON mode writes only the JSON document to stdout. This makes it suitable for machine consumption.

## Output files

Write JSON:

```bash
handoffprobe test --reporter json --output handoffprobe-report.json
```

Write Markdown:

```bash
handoffprobe test --reporter markdown --output handoffprobe-report.md
```

When `--output` is present, the selected report is written to that path instead of stdout.

An output-write failure exits `3`.

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

CLI flags override configuration values.

Unknown keys, malformed JSON and invalid values are rejected with exit `2`.

## Exit codes

| Exit | Meaning                                                                                     |
| ---: | ------------------------------------------------------------------------------------------- |
|  `0` | scan completed correctly and no qualifying vulnerability FAIL meets the threshold           |
|  `1` | scan completed correctly and at least one vulnerability FAIL meets or exceeds the threshold |
|  `2` | usage or configuration error                                                                |
|  `3` | scanner, runtime or output failure                                                          |

Exit `1` is a security finding, not a scanner crash.

`ERROR` is never converted into vulnerability exit `1`. A runtime or trustworthy-completion failure uses exit `3`.

## JSON automation example

```bash
handoffprobe test   --target secure   --reporter json   --output handoffprobe-report.json
```

HandoffProbe v0.4.0 preserves report schema version `1`.

The report contains:

- HandoffProbe version;
- protocol versions;
- selected stable attack IDs;
- threshold;
- deterministic summary counts;
- findings;
- redacted safe evidence references.

## Markdown automation example

```bash
handoffprobe test   --target vulnerable   --test HP-AUTH-001   --reporter markdown   --output handoffprobe-report.md
```

Markdown is intended for human review, CI artifacts and pull-request summaries.

## Safe evidence and redaction

HandoffProbe reports safe evidence counts and deterministic sequence references rather than serializing raw evidence context/details.

The CLI also applies:

- structured secret redaction;
- bearer/basic credential redaction;
- sensitive key/value redaction;
- redacted terminal finding text;
- redacted JSON finding text;
- redacted Markdown finding text;
- deterministic runtime diagnostics.

Do not treat a report as permission to expose unrelated application secrets.

## GitHub Action usage

The repository includes a reusable source-backed composite action.

Example:

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

      - uses: Heaviside479/handoffprobe@8ffdbec95e8ebe6fe1db1f3c2151d571461d596d
        with:
          target: secure
          fail-on: high
          artifact-name: handoffprobe-report
```

The revision above is the reviewed exact v0.4.0 release commit and preserves the strongest verified supply-chain pinning model. Both `v0.4.0` and `8ffdbec95e8ebe6fe1db1f3c2151d571461d596d` were verified after publication from a separate consumer repository.

## Reproducible public demo

The long-standing `HP-AUTH-001` scenario remains a compatible demonstration across v0.3.0 and v0.4.0:

```bash
handoffprobe test --target vulnerable --test HP-AUTH-001
```

The demo is designed to communicate four facts:

1. upstream A2A authority can be individually valid;
2. downstream MCP tool behavior can be individually valid under correct authority;
3. the translation/handoff can still broaden the effective authority incorrectly;
4. HandoffProbe detects that end-to-end composition failure deterministically.

Compare it with the secure control:

```bash
handoffprobe test --target secure --test HP-AUTH-001
```

HandoffProbe v0.4.0 additionally exposes the newly admitted stable advanced check:

```bash
handoffprobe test --target vulnerable --test HP-AUTH-006
```

Its secure fixture authorizes effect A, makes the governing authority non-current, and blocks distinct effect B before dispatch. The intentionally vulnerable fixture reuses the earlier task-level authorization and executes effect B, producing a deterministic FAIL.

## Safety boundary

Use HandoffProbe only against:

- bundled synthetic fixtures;
- systems you own;
- staging/test environments you control;
- targets for which you have explicit authorization.

Neither HandoffProbe v0.4.0 nor the historical v0.3.0 release is a generic internet scanner, runtime firewall or authorization provider.

## More documentation

- [`INSTALLATION.md`](INSTALLATION.md) — installation and public package execution
- [`UPGRADING.md`](UPGRADING.md) — safe version updates and verification
- [`MIGRATION.md`](MIGRATION.md) — public-contract migration guidance
- [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) — CLI, configuration and CI troubleshooting
- [`FAQ.md`](FAQ.md) — common product and usage questions
- [`ATTACK_CATALOG.md`](ATTACK_CATALOG.md) — stable attack catalog
- [`CLI_SPECIFICATION.md`](CLI_SPECIFICATION.md) — CLI contract
- [`GITHUB_INTEGRATION_SPECIFICATION.md`](GITHUB_INTEGRATION_SPECIFICATION.md) — action and CI contract
- [`../SECURITY.md`](../SECURITY.md) — security policy
