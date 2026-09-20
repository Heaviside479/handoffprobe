# Troubleshooting

Status: current user guidance for `handoffprobe@0.4.0`.

## Start with the exit code

HandoffProbe uses deterministic exit semantics:

| Exit | Meaning                                                                       |
| ---: | ----------------------------------------------------------------------------- |
|  `0` | scan completed and no qualifying security failure met the threshold           |
|  `1` | scan completed and at least one qualifying security failure met the threshold |
|  `2` | usage or configuration error                                                  |
|  `3` | scanner, runtime or output failure                                            |

Exit `1` is a security result, not a scanner crash.

## npm cannot find HandoffProbe

Verify the exact public version:

```bash
npm view handoffprobe@0.4.0 version
```

Then run the exact package explicitly:

```bash
npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe --version
```

## Unsupported Node.js version

HandoffProbe v0.4.0 requires Node.js `>=24 <25`.

Check:

```bash
node --version
```

If the version is outside that range, use a supported Node.js 24 runtime before
diagnosing the HandoffProbe CLI further.

## `npx` or `npm exec` runs an unexpected version

Use an exact package selector:

```bash
npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe --version
```

For project dependencies, prefer an exact package pin.

## Configuration exits with code 2

The optional `handoffprobe.config.json` accepts the documented configuration
keys:

- `target`;
- `tests`;
- `failOn`;
- `reporter`;
- `output`.

Malformed JSON, unknown keys or invalid values are rejected rather than guessed.

See [`USAGE.md`](USAGE.md) and
[`CLI_SPECIFICATION.md`](CLI_SPECIFICATION.md).

## A test exits with code 1

Review the finding before treating the run as broken.

A vulnerable bundled target is expected to reproduce deterministic FAIL
findings.

Example:

```bash
handoffprobe test --target vulnerable --test HP-AUTH-001
```

A secure bundled target should instead pass the stable corpus:

```bash
handoffprobe test --target secure
```

## Output creation fails

Output failures use exit code `3`.

Check:

- that the parent directory exists;
- that the process can write to the selected location;
- that the path is not an unintended directory;
- that CI artifact handling uses the file actually produced by HandoffProbe.

Do not expose private evidence or credentials while debugging output paths.

## GitHub Action does not behave as expected

Confirm:

- the Action reference is the intended immutable commit;
- the workflow checks out the repository first;
- required workflow permissions remain minimal;
- Action inputs match
  [`GITHUB_INTEGRATION_SPECIFICATION.md`](GITHUB_INTEGRATION_SPECIFICATION.md);
- a security exit is not being confused with an infrastructure failure.

The HandoffProbe Action is source-backed. Its Action reference is separate from
the npm package version installed elsewhere in a project.

## Source checkout fails to build

From a clean repository checkout:

```bash
npm ci
npm run check
npm run build
```

Do not hand-edit lockfile integrity or resolution data to work around an install
failure.

## Reports contain redacted information

Redaction is intentional.

HandoffProbe avoids serializing unnecessary raw evidence and applies secret
redaction to terminal, JSON and Markdown output.

A redacted report is not evidence that the underlying test did not execute.

## Before reporting a bug

Record:

- exact HandoffProbe version;
- Node.js version;
- operating system;
- exact command with secrets removed;
- exit code;
- safe, redacted diagnostic text;
- whether the issue reproduces against a bundled fixture.

Do not post credentials, private customer data or undisclosed vulnerabilities
in a public issue.

## Authorization boundary

A technical problem does not widen authorization to test a third-party system.

Use HandoffProbe only against bundled synthetic fixtures, systems you own,
controlled environments or targets for which you have explicit authorization.

See [`../SECURITY.md`](../SECURITY.md).

## Related guidance

- [`INSTALLATION.md`](INSTALLATION.md)
- [`USAGE.md`](USAGE.md)
- [`UPGRADING.md`](UPGRADING.md)
- [`MIGRATION.md`](MIGRATION.md)
- [`FAQ.md`](FAQ.md)
