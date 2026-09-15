# HandoffProbe v0.3.0 post-publication verification

Date: 2026-09-14

## Release identity

- npm package: `handoffprobe@0.3.0`
- immutable annotated tag: `v0.3.0`
- release commit: `ef54b950b3ee333c406fa81087685d7f952a028d`
- GitHub Release: `HandoffProbe v0.3.0`
- product website: `https://handoffprobe.heaviside-solutions.com`
- Security Assessment: `https://handoffprobe.heaviside-solutions.com/security-assessment`

The `v0.3.0` tag must not be moved or rewritten.

## Published npm artifact

Post-publication registry verification recorded:

- version: `0.3.0`
- package files: `291`
- shasum: `54e2349f754d62bb5a4001048c2cfcaf8bc8ce96`
- integrity: `sha512-f3F8tcVPKmGQ3rmFUQmN4SGFM5KumCIPIRqpLlsg4Q1EEObtszxOC29EswwzZsAlV1FNrIiTpdLux5ZyJy1WXA==`
- homepage: `https://handoffprobe.heaviside-solutions.com`
- repository: `https://github.com/Heaviside479/handoffprobe`

A clean external exact-version execution reported `HandoffProbe 0.3.0`. The secure bundled corpus completed with exactly 22 PASS, 0 FAIL and 0 ERROR.

The npm `bin` warning observed during publication was investigated after publication. Registry metadata, the published tarball, the installed `.bin/handoffprobe` link and installed `--version` execution all verified the CLI binary correctly. No patch release was required.

## GitHub Release and Action verification

The GitHub Release is published at the immutable `v0.3.0` tag and resolves to release commit `ef54b950b3ee333c406fa81087685d7f952a028d`.

External consumer verification completed for both:

- immutable release commit `Heaviside479/handoffprobe@ef54b950b3ee333c406fa81087685d7f952a028d`;
- public tag `Heaviside479/handoffprobe@v0.3.0`.

The post-publication public-tag consumer workflow completed successfully with run `34885553897` and job `104115212300`. Evidence-only consumer pull requests were closed unmerged after verification.

## Public website synchronization

The dedicated HandoffProbe product site was updated to v0.3.0 and deployed successfully.

The HandoffProbe project page on `https://heaviside-solutions.com` was updated to v0.3.0 and deployed successfully.

The product-site production response was additionally verified to contain the v0.3.0 release truth and the correct GitHub Release link.

## Documentation reconciliation

Current release-facing Core documentation is reconciled from the pre-publication candidate state to the published v0.3.0 state in the R3 post-publication documentation change.

Historical v0.2.0 release documentation remains historical and is not rewritten.

## R3 closeout

Marketplace-specific presentation verification completed on 2026-09-15.

The public GitHub Marketplace page returned HTTP 200 at `https://github.com/marketplace/actions/handoffprobe` and presented the HandoffProbe listing with `v0.3.0` marked as `Latest`. The rendered Marketplace content contained the immutable release SHA `ef54b950b3ee333c406fa81087685d7f952a028d` and the reconciled published-v0.3.0 README wording. The historical v0.2.0 release SHA `b0fc2a8abe1df36e526536d714418a9842be2f77` and stale coordinated-publication wording were absent.

Together with the already completed external consumer verification of both the immutable release SHA and public `v0.3.0` Action tag, this closes the final R3 post-publication item. R3 is complete. This verification does not alter or republish the npm artifact, immutable tag, GitHub Release or release commit identity.
