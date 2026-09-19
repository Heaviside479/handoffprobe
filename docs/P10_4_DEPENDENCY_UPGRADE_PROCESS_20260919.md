# P10.4 dependency upgrade process

Date: 2026-09-19

Status: **COMPLETE — dependency upgrade process defined 2026-09-19**

## Purpose

Define how HandoffProbe discovers, reviews, validates and admits dependency
changes without silently widening runtime, protocol or supply-chain claims.

This process covers npm runtime dependencies, npm development dependencies,
transitive lockfile changes, GitHub Actions dependencies and compatibility-
sensitive runtime/toolchain changes.

This record defines the process only. It does not upgrade any dependency,
change the public package version, add a stable attack or change the A2A/MCP
wire baseline.

## Current dependency contract

HandoffProbe currently uses:

- exact direct dependency versions in `package.json`;
- `package-lock.json` lockfile version 3;
- `.npmrc` with `save-exact=true` and `engine-strict=true`;
- Node.js `>=24 <25`;
- `npm ci` for reproducible CI installation;
- immutable commit-SHA pins for external GitHub Actions;
- required Dependency Review on pull requests;
- required HandoffProbe plus Ubuntu, macOS and Windows quality checks.

Exact manifest pins and the lockfile remain the default. A dependency update
must not replace exact versions with broad ranges unless a separate,
evidence-backed policy change explicitly authorizes that behavior.

## Discovery

`.github/dependabot.yml` provides weekly version-update discovery for:

- npm dependencies from the repository root;
- GitHub Actions dependencies.

The schedule is discovery automation, not merge authorization. Dependabot pull
requests receive the same review and required checks as human-authored pull
requests. No dependency update is auto-merged by this policy.

Security advisories, upstream protocol releases, ecosystem incidents and
maintainer review may trigger an out-of-cycle upgrade. If GitHub emits a
security-update pull request or alert, it is handled under the same admission
rules with expedited priority according to severity.

## Upgrade classes

### Routine

Examples:

- patch/minor development-tool updates;
- patch/minor non-protocol runtime dependency updates;
- reviewed GitHub Action SHA refreshes that do not change workflow privileges
  or repository policy.

Routine does not mean automatic. The full validation path still applies.

### Compatibility-sensitive

The following always require explicit compatibility review:

- `@a2a-js/sdk`;
- `@modelcontextprotocol/client`;
- `@modelcontextprotocol/server`;
- any Node.js supported-range change;
- any major runtime dependency update;
- any change that can alter CLI, report, config, protocol or package behavior;
- any GitHub Action update that changes permissions, credentials, artifact
  handling or execution behavior.

For A2A/MCP SDK changes, SDK package version and wire-protocol version must be
reviewed as separate dimensions. An SDK upgrade must not silently change the
public A2A 1.0 -> MCP 2026-07-28 wire claim.

### Security-emergency

A known exploitable or High/Critical advisory may bypass the normal weekly
cadence, but it does not bypass validation.

The remediation should be isolated to the smallest safe dependency graph
change. If an already published HandoffProbe version is materially affected,
release impact and patch-release requirements must be evaluated explicitly.

## Change preparation

For each upgrade:

1. identify the current and target dependency versions;
2. review the upstream changelog/release notes and relevant security advisory;
3. classify the change as routine, compatibility-sensitive or
   security-emergency;
4. keep unrelated product changes out of the dependency pull request;
5. preserve exact direct manifest versions;
6. update `package-lock.json` with npm rather than hand-editing lockfile
   resolution or integrity data;
7. keep external GitHub Actions pinned to full commit SHAs rather than mutable
   tags;
8. review any newly introduced install scripts, native binaries, permissions or
   network behavior before admission.

Protocol-sensitive sibling packages may be upgraded together when compatibility
requires the pair to move in one coherent change. Otherwise prefer a narrow,
independently reviewable dependency diff.

## Required local validation

A prepared dependency change must run from a clean dependency install:

```bash
npm ci
npm run check
npm run package:check
```

When registry access is available, also run:

```bash
npm audit --audit-level=high
```

A real unresolved High/Critical audit result is a blocker unless there is a
documented, evidence-backed exception. Registry/network availability failure is
not itself evidence that the source change is defective and must be
distinguished from an actual advisory finding.

## Required pull-request admission

Every dependency pull request must pass:

- `HandoffProbe`;
- `Dependency Review`;
- `Quality (ubuntu-latest)`;
- `Quality (macos-latest)`;
- `Quality (windows-latest)`.

The Dependency Review workflow rejects newly introduced High-severity
vulnerabilities across runtime, development and unknown scopes.

A compatibility-sensitive update additionally requires the relevant baseline or
contract documentation to be reviewed and updated when the evidence changes.

## Release and compatibility decision

A dependency-only maintenance change does not automatically authorize a package
version bump or public compatibility claim.

Before release, determine separately whether the update changes:

- package runtime requirements;
- public CLI/config/report contracts;
- stable attack behavior;
- the A2A/MCP wire baseline;
- reusable GitHub Action behavior;
- security or authorization assumptions.

If none of those public surfaces change, the dependency update may remain an
internal reliability/maintenance change until a release is otherwise
authorized. Published tags and artifacts remain immutable.

## Rollback

If an admitted dependency update causes regression:

1. revert the dependency change through a normal reviewed commit/PR;
2. restore the previous exact manifest and lockfile state;
3. rerun the complete local and CI validation path;
4. do not rewrite published tags or force-update release provenance.

## P10.4 result

The dependency upgrade process is explicit, reviewable and backed by automated
weekly discovery plus existing required CI/security gates.

The remaining P10.4 item is compatibility-matrix drift detection.
