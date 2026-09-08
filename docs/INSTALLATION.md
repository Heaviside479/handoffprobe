# Installation

HandoffProbe is a local-first defensive security CLI for testing security properties across A2A 1.0 → MCP 2026-07-28 handoffs.

## Release status

The supported 0.1.x release is `handoffprobe@0.1.1`.

Use the exact version for reproducible local and CI execution.

## Requirements

- Node.js `>=24 <25`
- npm
- macOS or Linux for the currently validated local developer workflow
- an owned, synthetic or explicitly authorized target

The bundled `secure` and `vulnerable` targets are synthetic and require no external service, paid AI API, telemetry or account.

Verify Node:

```bash
node --version
npm --version
```

## Public npm execution

The recommended one-shot version check is:

```bash
npx --yes --package=handoffprobe@0.1.1 handoffprobe --version
```

Run the secure bundled corpus:

```bash
npx --yes --package=handoffprobe@0.1.1 handoffprobe test
```

Expected release version:

```text
HandoffProbe 0.1.1
```

Using the exact version keeps first-run and CI reproduction deterministic.

## Install into a project

Install the exact supported maintenance version:

```bash
npm install --save-dev handoffprobe@0.1.1
```

Then run:

```bash
npx handoffprobe --version
npx handoffprobe test
```

For security-sensitive CI, prefer an exact package version rather than an unbounded version range.

## Run from source

Clone the repository:

```bash
git clone https://github.com/Heaviside479/handoffprobe.git
cd handoffprobe
```

Install exact locked dependencies and build:

```bash
npm ci
npm run build
```

Verify the CLI:

```bash
node dist/cli.js --version
node dist/cli.js test
```

A checkout of the `v0.1.1` release should report:

```text
HandoffProbe 0.1.1
```

## Run the locally packed release artifact

Build the exact package artifact:

```bash
PACKAGE_TARBALL="$(npm pack --silent)"
```

Verify the tarball through `npx` without requiring a public registry release:

```bash
npx --yes --package="./$PACKAGE_TARBALL" handoffprobe --version
npx --yes --package="./$PACKAGE_TARBALL" handoffprobe test
```

This installation smoke test exercises the package boundary instead of relying on the source checkout.

## GitHub Action

HandoffProbe also ships a source-backed composite GitHub Action.

For external repositories, immutable commit-SHA pinning is the strongest default:

```yaml
- uses: Heaviside479/handoffprobe@<reviewed-commit-sha>
  with:
    target: secure
    fail-on: high
    artifact-name: handoffprobe-report
```

Replace the placeholder with a reviewed 40-character HandoffProbe commit SHA.

The `v0.1.1` version tag is useful for discoverability, but a reviewed immutable commit SHA remains stronger for supply-chain pinning.

## Updating

Before v1.0, HandoffProbe follows pre-1.0 compatibility expectations. Read release notes before changing versions.

For an exact npm version after publication:

```bash
npm install --save-dev handoffprobe@0.1.1
```

Do not assume report, configuration or protocol compatibility across future pre-1.0 versions unless the release notes state it.

## Troubleshooting

### npm reports that `handoffprobe` does not exist

If registry lookup fails, confirm npm registry access using the exact supported version:

```bash
npm view handoffprobe@0.1.1
```

### Unsupported Node version

HandoffProbe v0.1.1 requires Node `>=24 <25`.

Check:

```bash
node --version
```

### `npx` runs an unexpected version

Use the exact package selector:

```bash
npx --yes --package=handoffprobe@0.1.1 handoffprobe --version
```

### Build or install failure from source

Start from a clean checkout and use the lockfile:

```bash
npm ci
npm run check
npm run build
```

### Permission and target safety

Installation does not grant authorization to test third-party systems. Active testing must use bundled fixtures, owned systems or targets for which you have explicit permission.

## Next steps

See:

- [`USAGE.md`](USAGE.md) for CLI commands, reporters, configuration and exit codes;
- [`../README.md`](../README.md) for the project overview and GitHub Action;
- [`../SECURITY.md`](../SECURITY.md) for authorized-use and disclosure guidance.
