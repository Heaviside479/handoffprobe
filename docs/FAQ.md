# Frequently asked questions

Status: current user guidance for `handoffprobe@0.4.0`.

## What is HandoffProbe?

HandoffProbe is an open-source defensive security testing tool for AI-agent
handoffs.

It tests whether security properties survive when actions cross protocol and
execution boundaries.

## Which protocol boundary does the current release model?

The current deterministic baseline is:

```text
A2A 1.0 -> MCP 2026-07-28
```

## How many stable attacks are in v0.4.0?

There are 23 stable attacks:

- 12 P0;
- 10 P1;
- 1 advanced attack, `HP-AUTH-006`.

Research and conformance cases are not automatically stable `HP-*` attacks.

## Does HandoffProbe require a paid AI API?

No.

The bundled Core path is local-first and does not require a paid AI service.

## Does HandoffProbe collect hidden telemetry?

No.

Adoption and integration feedback is opt-in.

## Is HandoffProbe a generic internet scanner?

No.

The bundled product is designed for synthetic fixtures, systems you own,
controlled environments and explicitly authorized targets.

## Does exit code 1 mean HandoffProbe crashed?

No.

Exit `1` means the scan completed and found at least one qualifying security
failure at or above the configured threshold.

See [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md).

## Which Node.js version is supported?

HandoffProbe v0.4.0 requires Node.js `>=24 <25`.

## How should I install or run a specific version?

For exact one-off execution:

```bash
npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe test
```

For a project dependency:

```bash
npm install --save-dev --save-exact handoffprobe@0.4.0
```

See [`INSTALLATION.md`](INSTALLATION.md).

## How should I upgrade?

Read the target release notes first, check migration guidance, verify Node.js,
update the npm dependency or Action pin deliberately, and rerun the secure
validation path.

See [`UPGRADING.md`](UPGRADING.md).

## Will every pre-v1.0 upgrade be backward compatible?

Do not assume that.

HandoffProbe documents compatibility and migration requirements per release.
Intentional breaking CLI or schema changes require migration guidance before
publication.

See [`MIGRATION.md`](MIGRATION.md).

## Is the GitHub Action the same thing as the npm package?

No.

The reusable Action is source-backed and is referenced independently from the
npm dependency. Security-sensitive workflows should prefer an immutable
reviewed Action commit.

## Does HandoffProbe replace A2A or MCP conformance tools?

No.

HandoffProbe focuses on security properties that can be lost across composed
handoffs. It does not replace official protocol inspection/conformance tools.

## Can I run HandoffProbe against third-party infrastructure?

Only when you have explicit authorization.

Installation of the tool does not provide authorization to test someone else's
systems.

## What should I do if I find a HandoffProbe bug?

Reproduce it safely, remove secrets and private data, and provide the exact
version, runtime, command, exit code and redacted diagnostic information.

For security-sensitive reports, follow [`../SECURITY.md`](../SECURITY.md).

## Where are the canonical docs?

Start with:

- [`INSTALLATION.md`](INSTALLATION.md);
- [`USAGE.md`](USAGE.md);
- [`UPGRADING.md`](UPGRADING.md);
- [`MIGRATION.md`](MIGRATION.md);
- [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md);
- [`ATTACK_CATALOG.md`](ATTACK_CATALOG.md);
- [`../README.md`](../README.md).
