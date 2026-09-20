# P11.2 npm stage-only publication workflow

Date: 2026-09-20

Status: **COMPLETE — 2026-09-20**

## Purpose

Introduce npm publication automation without granting CI the authority to make
a HandoffProbe version publicly available.

The workflow may create a staged npm package only.

A staged package remains unavailable to public consumers until a maintainer
reviews and approves it with npm two-factor authentication.

## npm policy baseline

HandoffProbe is treated as dual-use security software.

The npm dual-use publication requirements used for this implementation are:

- `package.json` declares `contentPolicy.class = "dual-use"`;
- the published package contains a root `DISCLOSURE` file;
- trusted publishing may use OIDC for `npm stage publish`;
- trusted publishing must not directly publish this dual-use package;
- promotion of a staged version requires maintainer proof-of-presence with 2FA.

The implementation pins npm `11.19.1`. Staged publishing requires npm 11.15.0
or newer.

## Workflow security boundary

`.github/workflows/npm-stage.yml` is intentionally manual-only.

It:

- accepts an exact requested package version;
- requires explicit `STAGE` confirmation;
- refuses execution unless the workflow runs from `refs/heads/main`;
- verifies the package identity and dual-use declaration;
- refuses an already-public package version;
- runs the full repository quality gate;
- verifies the npm payload before staging;
- authenticates through GitHub OIDC;
- runs only `npm stage publish`.

It does not:

- contain an npm access token;
- contain `NPM_TOKEN` or `NODE_AUTH_TOKEN`;
- run `npm publish`;
- approve a staged package;
- reject a staged package;
- create a Git tag;
- create a GitHub Release;
- change the package version.

`contents` remains read-only. `id-token: write` exists solely for npm trusted
publishing through OIDC.

## Provenance

For a public package published from this public GitHub repository through npm
trusted publishing, npm automatically generates provenance attestations.

No long-lived npm publication token is required by this workflow.

## Current release state

The public package remains `handoffprobe@0.4.0`.

P11.2 must not stage `0.4.0`, because that version already exists publicly.

The first real staged package is deferred until an intentional new release
version has separately passed release admission.

## Trusted publisher configuration

After this workflow is merged to `main`, npm must be configured for the exact
GitHub repository and workflow filename:

- repository: `Heaviside479/handoffprobe`;
- workflow: `npm-stage.yml`;
- permission: `npm stage publish` only;
- direct `npm publish`: not allowed.

The relationship must be read back and verified before P11.2 is closed.

Package publishing access should then require two-factor authentication and
disallow traditional publication tokens.


## Completion evidence — 2026-09-20

Implementation admission:

- protected implementation PR: `#155`;
- PR head:
  `d45a0765d53865a3d0a6fc5e3dabdf7015f80d2a`;
- all required protected checks completed successfully;
- normal merge commit:
  `d60bf3d79a83fb1f5fdcd7ec7b397c5ad613ef89`.

Exact npm Trusted Publisher read-back was performed with npm `11.19.1`.

Observed relationship:

- type: `github`;
- repository: `Heaviside479/handoffprobe`;
- workflow file: `npm-stage.yml`;
- permission: `createStagedPackage`;
- direct trusted `npm publish` permission: absent;
- trust read-back exit code: `0`.

The npm package Publishing access setting is hardened to:

`Require two-factor authentication and disallow tokens`

This preserves interactive maintainer proof-of-presence for publication while
traditional package publication tokens are disallowed.

Final registry-state verification:

- `npm stage list handoffprobe --json` returned `[]`;
- staged-package list exit code: `0`;
- public package version: `0.4.0`;
- `latest` dist-tag: `0.4.0`;
- no package was staged merely to validate P11.2.

Therefore the first live `npm stage publish` remains deferred to a separately
admitted future release version.

P11.2 introduces publication infrastructure only.

It does not:

- change the current package version;
- publish a new package version;
- create a Git tag;
- create a GitHub Release;
- approve any staged package;
- change the stable 23-attack corpus.

## Completion gate

P11.2 is complete only after:

- the implementation passes its protected pull request;
- the implementation is merged normally;
- the exact stage-only trusted publisher is configured on npm;
- the trusted publisher configuration is read back and verified;
- package publishing access is hardened to require 2FA and disallow tokens;
- `handoffprobe@0.4.0` remains the public latest version;
- no package has been staged merely to test the workflow.

The first live stage belongs to a separately authorized future release.
