# HandoffProbe v0.1 Launch Examples

## Status

The npm package is **not publicly released yet**.

These commands describe the v0.1.0 release candidate. Public npm commands become canonical only after registry verification.

## v0.1.0 snapshot

- A2A 1.0 -> MCP 2026-07-28;
- 22 stable attacks total: 12 P0 and 10 P1;
- terminal, JSON and Markdown reporters;
- report schema is version `1`;
- deterministic exits `0`, `1`, `2`, `3`;
- reusable GitHub Action with redacted safe evidence.

## Public version check after publication

```bash
npx --yes --package=handoffprobe@0.1.0 handoffprobe --version
```

Expected:

```text
HandoffProbe 0.1.0
```

## Secure control after publication

```bash
npx --yes --package=handoffprobe@0.1.0 handoffprobe test
```

Expected: 22 PASS / 0 FAIL / 0 ERROR and exit `0`.

## Primary vulnerable demo

```bash
handoffprobe test --target vulnerable --test HP-AUTH-001
```

Expected key result:

```text
FAIL           HP-AUTH-001 Delegated authority amplification [HIGH]
Security gate: FAIL
```

Expected exit `1`.

The demo shows an integration invariant failure: upstream authority can be valid, downstream behavior can be valid with correct authority, yet the translation can broaden effective authority. It does not claim A2A or MCP is inherently insecure.

## Secure comparison

```bash
handoffprobe test --target secure --test HP-AUTH-001
```

Expected exit `0`.

## Machine-readable report

```bash
handoffprobe test --target secure --reporter json --output handoffprobe-report.json
```

## Human-readable artifact

```bash
handoffprobe test --target vulnerable --test HP-AUTH-001 --reporter markdown --output handoffprobe-report.md
```

## GitHub Action

For security-sensitive CI, immutable commit-SHA pinning is strongest:

```yaml
- uses: Heaviside479/handoffprobe@<reviewed-commit-sha>
  with:
    target: secure
    fail-on: high
    artifact-name: handoffprobe-report
```

Do not use `pull_request_target` to execute untrusted pull-request code.

## Local package smoke before publication

```bash
PACKAGE_TARBALL="$(npm pack --silent)"
npx --yes --package="./$PACKAGE_TARBALL" handoffprobe --version
npx --yes --package="./$PACKAGE_TARBALL" handoffprobe test
```

## Suggested announcement

HandoffProbe v0.1.0 is an open-source defensive security tool for testing whether security properties survive AI-agent handoffs across protocol boundaries. The first release focuses on A2A 1.0 -> MCP 2026-07-28 and ships 22 deterministic stable attacks, local terminal/JSON/Markdown reporting and a reusable GitHub Action.

## Safety boundary

Use HandoffProbe only with bundled synthetic fixtures, systems you own, controlled test environments or targets for which you have explicit authorization.
