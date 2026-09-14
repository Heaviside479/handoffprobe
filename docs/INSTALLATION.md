# Installation

HandoffProbe is a local-first defensive security CLI for testing security properties across A2A 1.0 → MCP 2026-07-28 handoffs.

## Release status

HandoffProbe `0.3.0` is the current release candidate in source.

The current public npm package remains `handoffprobe@0.2.0` until the v0.3.0 publication gates complete.

Source, lockfile and exported CLI metadata are synchronized at `0.3.0`. Public-registry commands below deliberately remain pinned to the actually published `handoffprobe@0.2.0` until publication.

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

Until v0.3.0 is published, the current public npm package remains `handoffprobe@0.2.0`. The recommended public version check is:

```bash
npm exec --yes --package=handoffprobe@0.2.0 -- handoffprobe --version
```

Run the secure bundled corpus:

```bash
npm exec --yes --package=handoffprobe@0.2.0 -- handoffprobe test
```

Expected current public version:

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

The current v0.3.0 release-candidate source checkout reports:

```text
HandoffProbe 0.3.0
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

The pin above remains the reviewed immutable commit for the currently published HandoffProbe v0.2.0 Action. The v0.3.0 candidate will receive its own external consumer verification against the exact frozen candidate commit before publication.

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

Both the currently published v0.2.0 release and the v0.3.0 release candidate require Node `>=24 <25`.

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
