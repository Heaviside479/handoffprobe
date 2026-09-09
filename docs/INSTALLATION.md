# Installation

HandoffProbe is a local-first defensive security CLI for testing security properties across A2A 1.0 → MCP 2026-07-28 handoffs.

## Release status

HandoffProbe `0.2.0` is the release version.

The exact npm package for this release is `handoffprobe@0.2.0`. Public-registry integrity and clean-install verification are part of the release verification process.

Source and package metadata are finalized at `0.2.0`. Registry commands below use the exact package version `handoffprobe@0.2.0`.

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

The recommended one-shot public version check is:

```bash
npm exec --yes --package=handoffprobe@0.2.0 -- handoffprobe --version
```

Run the secure bundled corpus:

```bash
npm exec --yes --package=handoffprobe@0.2.0 -- handoffprobe test
```

Expected release version:

```text
HandoffProbe 0.2.0
```

Using the exact version keeps first-run and CI reproduction deterministic.

## Install into a project

Install the exact public release:

```bash
npm install --save-dev --save-exact handoffprobe@0.2.0
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

The finalized v0.2.0 source checkout reports:

```text
HandoffProbe 0.2.0
```

## Run the locally packed package

Build the exact package artifact:

```bash
PACKAGE_TARBALL="$(npm pack --silent)"
```

Verify a locally packed tarball through `npx`:

```bash
npx --yes --package="./$PACKAGE_TARBALL" handoffprobe --version
npx --yes --package="./$PACKAGE_TARBALL" handoffprobe test
```

This exercises the package boundary independently of the public registry.

## GitHub Action

HandoffProbe also ships a source-backed composite GitHub Action.

For external repositories, immutable commit-SHA pinning is the strongest default:

```yaml
- uses: Heaviside479/handoffprobe@b0fc2a8abe1df36e526536d714418a9842be2f77
  with:
    target: secure
    fail-on: high
    artifact-name: handoffprobe-report
```

The pin above is the reviewed immutable release commit for HandoffProbe v0.2.0.

The `v0.2.0` tag is available for discoverability, while the reviewed immutable commit SHA remains stronger for supply-chain pinning.

Both the `v0.2.0` Action reference and the immutable v0.2.0 release SHA were verified after publication from a separate consumer repository.

## Updating

Before v1.0, HandoffProbe follows pre-1.0 compatibility expectations. Read release notes before changing versions.

For the exact npm version:

```bash
npm install --save-dev --save-exact handoffprobe@0.2.0
```

Do not assume report, configuration or protocol compatibility across future pre-1.0 versions unless the release notes state it.

## Troubleshooting

### npm reports that `handoffprobe` does not exist

Verify the exact public version:

```bash
npm view handoffprobe@0.2.0
```

### Unsupported Node version

HandoffProbe v0.2.0 requires Node `>=24 <25`.

Check:

```bash
node --version
```

### `npx` runs an unexpected version

Use the exact package selector:

```bash
npm exec --yes --package=handoffprobe@0.2.0 -- handoffprobe --version
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
