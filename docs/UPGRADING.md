# Upgrading HandoffProbe

Status: current user guidance for `handoffprobe@0.4.0`.

## Goal

Upgrade HandoffProbe deliberately while preserving the release, compatibility
and supply-chain assumptions your project depends on.

Before v1.0, do not assume that every future minor release preserves every
public contract. Read the release notes and migration guidance first.

## 1. Identify the version you are using

For an installed CLI:

```bash
handoffprobe --version
```

For the exact current public release in the registry:

```bash
npm view handoffprobe@0.4.0 version
```

## 2. Review release information

Before changing versions, review:

- the target release notes;
- [`MIGRATION.md`](MIGRATION.md);
- the supported Node.js range;
- changes to stable attacks;
- changes to CLI, config, report or Action contracts.

The current release notes are
[`V0_4_0_RELEASE_NOTES.md`](V0_4_0_RELEASE_NOTES.md).

## 3. Verify Node.js

HandoffProbe v0.4.0 requires Node.js `>=24 <25`.

```bash
node --version
```

Resolve an unsupported runtime before changing the HandoffProbe package.

## 4. Update an npm dependency deliberately

For the current exact release:

```bash
npm install --save-dev --save-exact handoffprobe@0.4.0
```

For one-off exact-version execution:

```bash
npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe --version
```

Avoid relying on an unreviewed floating version in security-sensitive CI.

## 5. Update the GitHub Action separately

The HandoffProbe Action is source-backed. Updating the npm dependency does not
update an Action reference.

For security-sensitive Action use, prefer an immutable reviewed commit SHA.

The reviewed v0.4.0 release commit is:

```text
8ffdbec95e8ebe6fe1db1f3c2151d571461d596d
```

Review a future release before replacing that pin.

## 6. Verify the upgraded installation

Run:

```bash
handoffprobe --version
handoffprobe list
handoffprobe test --target secure
```

The current v0.4.0 secure bundled corpus should complete with 23 PASS findings,
0 FAIL and 0 ERROR.

If automation consumes JSON or Markdown, also execute the reporter path used by
that CI and validate its expected schema and exit handling.

## 7. Interpret failures correctly

Exit code `1` means a qualifying security finding was detected. It is not a
scanner crash.

Exit code `2` is a usage or configuration error.

Exit code `3` represents a scanner, runtime or output failure.

See [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md).

## Rollback

If validation fails after an upgrade, restore the previously reviewed exact npm
version and, when applicable, the previous immutable Action commit.

Do not move or rewrite a published tag to perform rollback.

## Maintainer dependency upgrades

The process maintainers use to admit HandoffProbe's own dependency changes is
documented separately in
[`P10_4_DEPENDENCY_UPGRADE_PROCESS_20260919.md`](P10_4_DEPENDENCY_UPGRADE_PROCESS_20260919.md).

That maintainer process is not a substitute for a user's own application
upgrade review.
