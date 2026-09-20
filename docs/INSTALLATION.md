# Installation

HandoffProbe is a local-first defensive security CLI for testing security properties across A2A 1.0 → MCP 2026-07-28 handoffs.

## Release status

HandoffProbe v0.4.0 is the current verified public release.

Source/package metadata and public npm availability are synchronized at `0.4.0`.

For supply-chain-sensitive use, independently confirm the exact registry version with `npm view handoffprobe@0.4.0 version`. The v0.3.0 package, tag and release remain historical release evidence.

## Requirements

- Node.js `>=24 <25`
- npm
- Linux is CI-verified on the GitHub-hosted Ubuntu workflow with Node 24
- macOS is CI-verified on GitHub-hosted `macos-latest` with Node 24 and locally validated on macOS 14.8.9 x86_64 with Node 24.17.0
- Windows is CI-verified on GitHub-hosted `windows-latest` with Node 24 for the package/repository quality path; native Windows execution of the reusable composite GitHub Action is not claimed because it still uses `shell: bash`
- an owned, synthetic or explicitly authorized target

The bundled `secure` and `vulnerable` targets are synthetic and require no external service, paid AI API, telemetry or account.

Verify Node:

```bash
node --version
npm --version
```

## Public npm execution

The recommended exact public version check is:

```bash
npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe --version
```

Run the secure bundled corpus:

```bash
npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe test
```

Expected v0.4.0 version:

```text
HandoffProbe 0.4.0
```

Using the exact version keeps first-run and CI reproduction deterministic.

## Install into a project

Install the exact public release:

```bash
npm install --save-dev --save-exact handoffprobe@0.4.0
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

The v0.4.0 source checkout reports:

```text
HandoffProbe 0.4.0
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
- uses: Heaviside479/handoffprobe@8ffdbec95e8ebe6fe1db1f3c2151d571461d596d
  with:
    target: secure
    fail-on: high
    artifact-name: handoffprobe-report
```

The pin above is the reviewed exact release commit for HandoffProbe v0.4.0 and was verified after publication from a separate consumer repository.

The `v0.4.0` tag is available for discoverability, while the reviewed exact release commit SHA remains stronger for supply-chain pinning.

Both the `v0.4.0` Action reference and the exact v0.4.0 release SHA were verified after publication from a separate consumer repository.

## Updating

Before v1.0, HandoffProbe follows pre-1.0 compatibility expectations. Read release notes before changing versions.

For the complete update procedure, see [`UPGRADING.md`](UPGRADING.md). If a
release changes a public contract, follow [`MIGRATION.md`](MIGRATION.md) as
well.

For the exact npm version:

```bash
npm install --save-dev --save-exact handoffprobe@0.4.0
```

Do not assume report, configuration or protocol compatibility across future pre-1.0 versions unless the release notes state it.

## Troubleshooting

The complete troubleshooting guide lives in
[`TROUBLESHOOTING.md`](TROUBLESHOOTING.md). The common installation cases are
kept here for quick access.

### npm reports that `handoffprobe` does not exist

Verify the exact public version:

```bash
npm view handoffprobe@0.4.0
```

### Unsupported Node version

HandoffProbe v0.4.0 requires Node `>=24 <25`.

Check:

```bash
node --version
```

### `npx` runs an unexpected version

Use the exact package selector:

```bash
npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe --version
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
- [`UPGRADING.md`](UPGRADING.md) for safe version updates;
- [`MIGRATION.md`](MIGRATION.md) for public-contract migrations;
- [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) for installation, CLI and CI failures;
- [`FAQ.md`](FAQ.md) for common product and support questions;
- [`../README.md`](../README.md) for the project overview and GitHub Action;
- [`../SECURITY.md`](../SECURITY.md) for authorized-use and disclosure guidance.
