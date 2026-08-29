# HandoffProbe v0.1 Release Specification

Status: locked 2026-08-29

This document is the binding release contract for the first public HandoffProbe release.
It implements Phase 7 without broadening the v0.1 product scope.

## 1. Release identity

- Product: HandoffProbe
- npm package: `handoffprobe`
- CLI: `handoffprobe`
- release version: `0.1.0`
- Git tag: `v0.1.0`
- GitHub release: `v0.1.0`
- license: Apache-2.0
- Node.js: `>=24 <25`
- protocol baseline: A2A 1.0 -> MCP 2026-07-28
- stable corpus: exactly 12 P0 + 10 P1 = 22 attacks
- report schema: preserve version `1`
- process exits: preserve `0`, `1`, `2`, `3`

v0.1.0 is pre-1.0 software and must not be described as a mature or production-complete security platform.

## 2. Objective

Publish a reproducible, installable and documented open-source release whose CLI and GitHub Action preserve the deterministic security behavior validated through Phase 6.

A developer must be able to:

1. install or run HandoffProbe;
2. execute the secure bundled control;
3. reproduce an intentionally vulnerable handoff;
4. understand the finding and safe evidence;
5. run the same security gate in GitHub Actions;
6. verify the covered protocol versions and stable attack IDs.

## 3. Non-goals

Phase 7 must not add:

- protocols beyond A2A 1.0 -> MCP 2026-07-28;
- hosted scanning, dashboards, accounts, billing or databases;
- paid AI APIs or paid infrastructure;
- telemetry;
- generic prompt-injection, generic MCP scanning or generic A2A scanning;
- new stable attack IDs merely to make the release appear larger;
- changed report or exit semantics without a release blocker;
- speculative adapters;
- release automation as a prerequisite for v0.1.0.

## 4. Package publication contract

Before public npm publication, `package.json` must:

- use version `0.1.0`;
- no longer contain `private: true`;
- retain package name `handoffprobe`;
- retain the `handoffprobe` binary;
- retain Apache-2.0 licensing;
- retain Node `>=24 <25`;
- retain ESM behavior;
- retain `dist` as the runtime publication surface;
- identify `Heaviside479/handoffprobe` as the repository;
- identify GitHub Issues as the bug tracker;
- expose the repository homepage;
- include concise A2A, MCP, agent-security and security-testing keywords;
- publish as a public unscoped package.

The npm package must not contain credentials, environment files, temporary reports or unintended repository-only material.

## 5. npm publication security

The first public publish is manual and deliberate.

Requirements:

1. all release-candidate gates pass before npm authentication;
2. publish only from the exact clean protected `main` release commit;
3. re-check npm name availability immediately before publication;
4. authenticate interactively with the intended npm account;
5. satisfy npm 2FA interactively;
6. never place npm tokens, OTP values or credentials in Git, shell commands, pasted logs or GitHub workflow files;
7. do not create a long-lived publishing token merely for v0.1.0;
8. publish `handoffprobe@0.1.0` exactly once;
9. verify the public registry before publishing the Git tag or GitHub release.

Future release engineering should prefer npm Trusted Publishing from GitHub Actions so long-lived publication tokens are unnecessary.

Official npm references:

- https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages/
- https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/
- https://docs.npmjs.com/trusted-publishers/

## 6. Required release documentation

Phase 7 must add:

- `docs/INSTALLATION.md`
- `docs/USAGE.md`
- `docs/RESEARCH_ARTICLE.md`
- `docs/LAUNCH_EXAMPLES.md`
- `docs/RELEASE_CHECKLIST.md`

Existing release-critical documents must remain accurate:

- `README.md`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `docs/ATTACK_CATALOG.md`
- `docs/RESEARCH_BASELINE.md`
- `docs/GITHUB_INTEGRATION_SPECIFICATION.md`

README must not claim npm publication until registry verification has actually succeeded.

## 7. Installation and usage contract

Installation documentation must cover Node support, `npx`, version verification, contributor source installation and troubleshooting.

After publication the canonical one-shot version check is:

`npx --yes --package=handoffprobe@0.1.0 handoffprobe --version`

Usage documentation must cover:

- `test`
- `list`
- `explain`
- `--target`
- repeatable `--test`
- `--fail-on`
- `--reporter`
- `--output`
- `handoffprobe.config.json`
- exit codes `0`, `1`, `2`, `3`
- secure and vulnerable bundled targets
- JSON and Markdown automation
- safe evidence and redaction behavior.

## 8. Public demonstration

The primary v0.1.0 public demonstration uses `HP-AUTH-001` unless a release blocker requires another already-stable attack.

The explanation must show:

1. upstream A2A authority is valid and bounded;
2. downstream MCP tool behavior is valid with correct authority;
3. the vulnerable handoff translates or broadens authority incorrectly;
4. the combined end-to-end invariant fails;
5. HandoffProbe reproduces the failure deterministically;
6. the secure control preserves the invariant.

The demo must not imply that A2A or MCP is inherently insecure. The tested failure is in cross-protocol integration/composition.

Vulnerable demo:

`handoffprobe test --target vulnerable --test HP-AUTH-001`

Expected exit: `1`.

Secure control:

`handoffprobe test`

Expected exit: `0` with 22 PASS, 0 FAIL and 0 ERROR.

## 9. Research article contract

`docs/RESEARCH_ARTICLE.md` must:

- explain the handoff/composition problem;
- distinguish protocol conformance from composition safety;
- explain the A2A 1.0 -> MCP 2026-07-28 wedge;
- describe deterministic dynamic testing;
- include a reproducible attack example;
- cite authoritative A2A and MCP sources;
- cite the composition-security research tracked by the project;
- distinguish normative requirements, hardening and `composition_responsibility`;
- avoid claiming invention of composition-safety research;
- avoid unverified vulnerability claims about third-party products.

Upstream protocol and SDK drift must be re-checked before the release candidate is frozen.

## 10. GitHub Action release contract

Phase 7 must preserve:

- source-backed composite action behavior;
- exactly one scanner execution per action invocation;
- safe JSON and Markdown artifacts;
- redacted evidence;
- security exit `1` semantics;
- least-privilege reference workflow;
- no `pull_request_target` execution of untrusted PR code.

Immutable commit-SHA pinning remains the strongest recommendation for third-party repositories.
A version tag may be documented for discoverability but is not equivalent to an immutable commit SHA.

## 11. Release-candidate gates

Before the release PR may merge:

- `npm run check` passes;
- all unit, integration and regression tests pass;
- exactly 22 stable attack IDs remain;
- secure target is 22 PASS / 0 FAIL / 0 ERROR;
- vulnerable attacks remain reproducible;
- `npm run package:check` passes;
- `npm audit --audit-level=high` passes;
- deterministic secret safety passes;
- package metadata regression tests pass;
- documentation regression tests pass;
- GitHub Action regression tests pass;
- `git diff --check` passes;
- package contents contain no accidental secret or environment material.

Remote required checks remain:

- `HandoffProbe`
- `Quality`
- `Dependency Review`

## 12. Tarball acceptance gate

Before registry publication, the exact `0.1.0` tarball must be tested outside the repository.

The gate must verify:

- package name `handoffprobe`;
- version `0.1.0`;
- expected files only;
- CLI executable behavior;
- `handoffprobe --version` reports `0.1.0`;
- help succeeds;
- `list` exposes exactly 22 stable IDs;
- secure default exits `0` with 22 PASS;
- vulnerable `HP-AUTH-001` exits `1`;
- JSON reporter remains machine-readable;
- runtime does not depend on the source checkout.

Record tarball filename, size, npm integrity and local SHA-256 in `docs/RELEASE_CHECKLIST.md`.

## 13. Protected release merge

All implementation stays on the Phase 7 feature branch until a protected pull request passes all required checks.

Do not weaken Phase 6 branch protection to ship v0.1.0.

## 14. Public npm publication gate

After the release PR is merged and post-merge `main` checks are green:

1. verify local `main` equals `origin/main`;
2. verify a clean worktree;
3. rebuild and retest the exact release tarball;
4. re-check npm package-name availability;
5. authenticate interactively;
6. publish from that exact release commit;
7. verify `handoffprobe@0.1.0` with `npm view`;
8. verify registry metadata and integrity;
9. install the registry package in a clean temporary directory;
10. repeat secure and vulnerable smoke tests.

If registry verification fails, stop before creating a public Git tag or GitHub release.

## 15. Git tag and GitHub release gate

Only after npm registry verification succeeds:

- create annotated tag `v0.1.0` on the exact release commit;
- verify the tag target;
- push only that tag;
- create GitHub release `v0.1.0` from the tag;
- release must not be draft;
- release is not marked prerelease unless the contract is explicitly changed;
- release notes state protocol baseline, 22 stable attacks, install command, demos, GitHub Action availability, safety scope and known v0.1 limitations;
- attach the verified npm tarball when practical and record its digest.

## 16. Post-publication verification

After npm and GitHub publication:

- `npm view handoffprobe@0.1.0` resolves;
- public `npx` version check succeeds;
- public secure run succeeds;
- public vulnerable demo reproduces exit `1`;
- Git tag resolves to the exact release commit;
- GitHub release resolves to `v0.1.0`;
- README installation instructions match the real public commands;
- `main` remains clean and protected;
- no release credential exists in Git history or artifacts.

Only then may Phase 7 be marked completed.

## 17. Failure handling

If any gate fails before npm publication, stop and fix it through the protected feature-branch workflow.

If npm publication succeeds but a later GitHub release step fails, do not republish `0.1.0`. Repair the tag or release around the same verified package and release commit.

Never reuse `0.1.0` for different package contents.

## 18. Phase 7 implementation sequence

1. `7.0A` — read-only launch baseline.
2. `7.0B` — lock release contract and roadmap status.
3. `7.1A` — package metadata and release regression gates.
4. `7.1B` — installation and usage documentation plus README alignment.
5. `7.1C` — research article, launch examples and release checklist.
6. `7.2A` — upstream A2A/MCP/SDK drift review.
7. `7.2B` — full local release-candidate and external tarball gate.
8. `7.2C` — protected remote PR gate and merge.
9. `7.3A` — post-merge release rebuild from protected `main`.
10. `7.3B` — interactive npm publication and registry smoke tests.
11. `7.4A` — verified `v0.1.0` tag and GitHub release.
12. `7.5A` — public install/demo verification, completion record and branch cleanup.

## 19. Phase 7 exit gate

Phase 7 is complete only when:

- `handoffprobe@0.1.0` is publicly installable from npm;
- `v0.1.0` exists as the verified Git tag and GitHub release;
- the exact release commit passed protected repository checks;
- the public package reproduces secure and vulnerable demos;
- installation, usage, research, launch and release documentation is published;
- stable corpus remains exactly 22 attacks;
- protocol baseline remains explicit and reviewed for upstream drift;
- no secret or unsafe release artifact was published;
- `main` remains clean and protected.

The v0.1.0 release is then a real public developer release rather than a local pre-release package.
