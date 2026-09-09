# R2 v0.2.0 post-publication closeout — 2026-09-09

Status: **completed**

## Final release identity

- release version: `0.2.0`
- final release commit: `b0fc2a8abe1df36e526536d714418a9842be2f77`
- annotated tag: `v0.2.0`
- annotated tag object: `8c33fbfdd1c67df3e4db9a49ee8ad1082fda7915`
- tag dereference: `b0fc2a8abe1df36e526536d714418a9842be2f77`
- GitHub Release: `https://github.com/Heaviside479/handoffprobe/releases/tag/v0.2.0`

The release tag was not moved, recreated or rewritten during post-publication verification.

## npm publication evidence

Public package: `handoffprobe@0.2.0`

Verified registry state:

- version: `0.2.0`
- `latest`: `0.2.0`
- files: `287`
- package size: `127167` bytes
- unpacked size: `624318` bytes
- npm shasum: `dcc638b0b8542306f112fe1c4375df632eb12db5`
- npm integrity: `sha512-7Yt9XEfsR+hPY4nCfvc3WH7tHkLE/7p6+HSMmo9cg7mxY6Q2JZWSPUXVJ2hOQ9peADFORmBBvSiOqAYlNzqA7w==`
- SHA-256: `1d6e438182a4ecbf3c0dae00df7ad92ead40ad8fca8c6a99e7374048c04391d4`

A clean external installation created the expected CLI binary. Version, attack listing and secure execution passed with exactly 22 stable attacks and 22 PASS / 0 FAIL / 0 ERROR.

The externally verified exact-version one-shot execution form is:

```bash
npm exec --yes --package=handoffprobe@0.2.0 -- handoffprobe --version
npm exec --yes --package=handoffprobe@0.2.0 -- handoffprobe test
```

No npm provenance or attestation claim is made.

## Frozen-RC to public-package delta

Frozen R2.5 candidate:

`f2483bacd4fac78d09e6322c0823e08a2078260f`

The candidate reproduced its exact recorded package fingerprint after publication.

The public final package retained identical membership at 287 files. Exactly one packaged file changed:

`package/README.md`

No runtime/package-membership expansion occurred.

## GitHub Release verification

`HandoffProbe v0.2.0` is published as a non-draft, non-prerelease GitHub Release and is the latest release.

## External GitHub Action verification

Consumer repository:

`Heaviside479/handoffprobe-action-audit-20260830-134434`

Evidence PR:

`#5 — Verify HandoffProbe v0.2.0 Action references`

Workflow run:

`34401248620`

Result:

`success`

Verified references:

- `Heaviside479/handoffprobe@v0.2.0`
- `Heaviside479/handoffprobe@b0fc2a8abe1df36e526536d714418a9842be2f77`

Both jobs successfully verified `exit-code=0`, `result=pass`, report path and summary path.

Artifacts:

- tag report ID `10123533580`
  - digest `sha256:e86b7fb64d143424c50a19097ae598c938b23bb7ce0904c3a85e4241f0cc999f`
- immutable-SHA report ID `10123535598`
  - digest `sha256:d94ef473375490bf695c8ae3a7d366c4e56cb5b02dfe4c072e14e4f688e587ea`

PR #5 was closed unmerged after verification.

The GitHub Marketplace listing was manually verified after publication to present v0.2.0 as the published release. The separate consumer-repository audit independently verifies direct reusable GitHub Action resolution for both the v0.2.0 tag and immutable release SHA.

## Immediate adoption and error signals

HandoffProbe continues to use no hidden usage telemetry.

At the immediate post-release closeout check, no new GitHub issue or error report had appeared after the GitHub Release publication. This is the initial zero-signal baseline, not a claim of external adoption.

The existing public opt-in adoption-feedback and adapter-request paths remain the supported signal channels.

A Peerlist launch is scheduled for 2026-09-14 to widen voluntary external exposure.

## R2.5 result

All R2.5 gates are satisfied:

- release candidate frozen;
- exact release checklist passed;
- `v0.2.0` published;
- npm package verified;
- GitHub Release verified;
- Action references externally verified;
- exact external install/run path verified;
- immediate telemetry-free signal baseline recorded.

R2.5 and the v0.2.0 exit gate are complete.
