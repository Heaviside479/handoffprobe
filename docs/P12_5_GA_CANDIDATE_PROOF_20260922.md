# P12.5 GA candidate and live release-engineering proof

Date: 2026-09-22

Status: **IN PROGRESS — candidate, reproducibility, SBOM, external consumer, user-guidance and prerelease-decision proof complete**

Frozen candidate commit: `63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`

Current verified public release remains `handoffprobe@0.4.0`.

## Purpose

Record the first live P12.5 release-engineering evidence against one exact GA-candidate commit without authorizing a new version, npm staging, publication, tag or GitHub Release.

P12.5 remains incomplete until its separately gated publication, provenance, external-use and final prerelease-decision work is complete.

## Candidate identity

The exact candidate was frozen from protected `main`:

- candidate commit: `63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`;
- source branch at execution: `main`;
- package version: `0.4.0`;
- stable public corpus: 23 attacks;
- protocol baseline: A2A `1.0` -> MCP `2026-07-28`.

The documentation branch created after the candidate freeze does not redefine the candidate identity.

## Release Candidate workflow execution

The existing protected Release Candidate workflow was manually dispatched from exact candidate commit `63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`.

Observed execution:

- workflow: `Release Candidate`;
- run ID: `35769245125`;
- job ID: `106886473053`;
- event: `workflow_dispatch`;
- branch: `main`;
- head SHA: `63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`;
- result: `success`;
- pinned release npm: `11.19.1`.

The workflow completed repository quality gates, candidate construction, reproducibility checks, SBOM checks, payload inspection, isolated candidate installation, secure-corpus execution and repository-cleanliness verification.

## Byte-identical candidate artifact proof

The Release Candidate workflow independently produced the normal candidate artifact plus two isolated rebuilds from the exact candidate commit.

All three SHA-256 values were identical:

- Release Candidate: `00c2bfd715cd3b7634c299ef1656ba39a477597023533c4be1d0b13fb79b27ad`;
- rebuild A: `00c2bfd715cd3b7634c299ef1656ba39a477597023533c4be1d0b13fb79b27ad`;
- rebuild B: `00c2bfd715cd3b7634c299ef1656ba39a477597023533c4be1d0b13fb79b27ad`.

Workflow result:

`Release artifact reproducibility: PASS`

The candidate payload contained 296 files.

## SBOM proof

The workflow generated two independent runtime-focused SPDX documents and required their deterministic dependency projections to match.

Observed result:

- SPDX version: `SPDX-2.3`;
- document package: `handoffprobe@0.4.0`;
- runtime package count: 74;
- retained SBOM SHA-256: `e9c4bca76dab4c7a437f5a1726a81d12aa196d9565f4a2cc8d62063c28c9ada0`;
- dependency fingerprint SHA-256: `d23f8358252fd51097bbbb582803fa050aa8476c84d645a1a4c90af992db5d10`;
- dependency-fingerprint reproducibility: `PASS`.

## Retained SBOM artifact verification

The merged-main-only artifact upload produced:

- artifact ID: `10713541739`;
- artifact name: `handoffprobe-release-sbom-63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`;
- artifact archive size: 10833 bytes;
- artifact archive SHA-256: `afd785ff2dc92596f8fa745e9c4d4bfa40adf6fd1fd6e9ae6da62f16eeaed253`;
- workflow run: `35769245125`;
- workflow head SHA: `63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`;
- artifact expiration: 2026-09-29;
- artifact was not expired when independently verified.

The exact retained artifact was downloaded separately after the workflow.

Independent verification observed:

- downloaded archive SHA-256 exactly matched `afd785ff2dc92596f8fa745e9c4d4bfa40adf6fd1fd6e9ae6da62f16eeaed253`;
- extracted `release-a.spdx.json` SHA-256 exactly matched `e9c4bca76dab4c7a437f5a1726a81d12aa196d9565f4a2cc8d62063c28c9ada0`;
- SPDX version remained `SPDX-2.3`;
- package identity remained `handoffprobe@0.4.0`;
- package count remained 74;
- remote artifact metadata still pointed to the exact workflow run and candidate SHA.

## Candidate execution result

The candidate tarball was installed in the isolated Release Candidate environment.

Observed identity:

`HandoffProbe 0.4.0`

Secure full-corpus result:

- PASS: 23;
- FAIL: 0;
- ERROR: 0;
- TOTAL: 23;
- security gate: PASS.

This isolated CI installation supports the candidate workflow proof but is not counted as completion of the separate P12.5 external-installation gate.

## External exact-candidate installation and execution

The frozen candidate was then exercised from an isolated consumer environment outside the HandoffProbe working repository.

The source archive was fetched directly from GitHub for exact commit:

`63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`

Observed external build and installation evidence:

- source package version: `0.4.0`;
- release npm used for reconstruction: `11.19.1`;
- clean dependency installation: passed;
- candidate package construction: passed;
- package file count: 296;
- external tarball SHA-256: `00c2bfd715cd3b7634c299ef1656ba39a477597023533c4be1d0b13fb79b27ad`;
- Release Candidate workflow tarball SHA-256: `00c2bfd715cd3b7634c299ef1656ba39a477597023533c4be1d0b13fb79b27ad`;
- observed cross-environment digest equality: yes.

The exact reconstructed tarball was then installed into a second clean consumer directory.

Observed installed identity:

`HandoffProbe 0.4.0`

External secure full-corpus execution produced:

- selected attacks: 23;
- PASS: 23;
- FAIL: 0;
- ERROR: 0;
- TOTAL: 23;
- security gate: PASS.

The original HandoffProbe working repository remained on protected `main`, clean and unchanged throughout the external-consumer exercise.

This is controlled maintainer-created consumer evidence. It is not independent third-party adoption and does not satisfy P12.6 by itself.

## External reusable GitHub Action consumer verification

The exact frozen candidate Action was also exercised from the existing separate consumer-audit repository:

`Heaviside479/handoffprobe-action-audit-20260830-134434`

External consumer identity:

- candidate Action reference: `Heaviside479/handoffprobe@63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`;
- audit PR: `#10`;
- audit commit: `4fe1410f55c21ab48c91b57d987b742a764598a0`;
- workflow: `HandoffProbe P12.5 Candidate External Consumer Audit`;
- workflow run: `35772627004`;
- workflow job: `106897794363`;
- workflow conclusion: `success`.

Verified Action outputs:

- exit code: `0`;
- result: `pass`;
- report path: present;
- summary path: present;
- report schema: `1`;
- HandoffProbe version: `0.4.0`;
- selected attacks: 23;
- PASS: 23;
- FAIL: 0;
- ERROR: 0;
- TOTAL: 23.

Retained consumer artifact:

- artifact ID: `10714971132`;
- artifact name: `handoffprobe-p12-5-candidate-report`;
- artifact size: 3196 bytes;
- artifact digest: `sha256:4148969be14058898bc7add363518e5e7e8eeb1024a333ba56a572d0c29477ca`;
- expiration: 2026-09-29.

After successful verification, audit PR `#10` was closed unmerged and its temporary branch was deleted.

This is maintainer-created external consumer verification. It proves resolution and execution from a separate repository but is not independent adoption or external-user evidence.

## Upgrade, migration and troubleshooting guidance verification

The exact frozen candidate was reconstructed again from:

`63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`

using pinned npm `11.19.1`.

The rebuilt candidate tarball SHA-256 remained:

`00c2bfd715cd3b7634c299ef1656ba39a477597023533c4be1d0b13fb79b27ad`

which exactly matched the previously retained Release Candidate artifact.

The candidate was installed into a fresh isolated consumer environment and the user-facing guidance paths from:

- `docs/UPGRADING.md`;
- `docs/MIGRATION.md`;
- `docs/TROUBLESHOOTING.md`;

were exercised directly.

Observed user-guidance verification:

- installed identity: `HandoffProbe 0.4.0`;
- stable attack listing: 23 attacks;
- secure full corpus: 23 PASS / 0 FAIL / 0 ERROR;
- JSON report schema: `1`;
- JSON selected attack count: 23;
- vulnerable `HP-AUTH-001` demonstration: exit `1`;
- invalid configuration: exit `2`;
- output-write failure: exit `3`;
- Markdown report path: success;
- package version remained `0.4.0`;
- stable corpus remained 23 attacks.

The three guidance files were also compared by Git blob identity between the frozen candidate and current protected `main`.

Observed blob identities:

- `docs/UPGRADING.md`: `1ea17074fdcf6c34ef522adfba5809cf367d44c3`;
- `docs/MIGRATION.md`: `2f72e59c9239a9d0b74a26072dfb650e9af155da`;
- `docs/TROUBLESHOOTING.md`: `6d4d6ab11d748ea0a61df54f122dd14fde2ec027`.

For all three files, candidate and current-main blob identities matched exactly.

This verification distinguishes source identity from package-version identity: the frozen P12.5 candidate and the already published npm release both report package version `0.4.0`, but the P12.5 candidate remains identified by exact commit `63d4a7d4712c5bf068b186c236b0c3a1cbb1cfcc`.

The verification did not publish or stage a package, change a version, create a tag, create a GitHub Release or claim npm provenance.

## Prerelease publication decision

Decision date: 2026-09-23.

Decision: **an evidence-backed `1.0.0-rc.1` materially improves final validation before v1 GA.**

The prerelease has a concrete validation purpose:

- exercise the real registry-backed installation path under an intended v1 prerelease identity;
- exercise the prepared npm Trusted Publishing stage path with a separately authorized release version;
- obtain publication provenance from the real trusted-publishing path;
- allow real npm installation, CI and integration testing without declaring v1 GA;
- provide a stable prerelease identity for additional external feedback while P11.6 and P12.6 remain independently open.

The decision is based on the P12.5 evidence already completed: exact candidate freeze, reproducible artifact proof, SBOM proof, isolated consumer installation, external reusable Action verification and user-guidance verification.

This decision does **not** itself:

- authorize changing the package version to `1.0.0-rc.1`;
- authorize npm stage publication;
- authorize npm publication;
- authorize `1.0.0`;
- create or move a Git tag;
- create a GitHub Release;
- waive P11.6;
- waive P12.6;
- convert absence of external feedback into validation.

A concrete prerelease version transition and any real npm stage action remain separately controlled steps.

## P12.5 completion state

Completed:

- [x] freeze the exact candidate commit;
- [x] run the Release Candidate workflow from the exact candidate;
- [x] reproduce byte-identical candidate npm artifacts;
- [x] generate and verify the release SBOM;
- [x] install and execute the exact candidate externally;
- [x] verify the reusable GitHub Action externally from the candidate identity;
- [x] verify upgrade/migration/troubleshooting guidance against the candidate;
- [x] decide whether prerelease publication materially improves final validation.

Still open:

- [ ] exercise the real npm stage / Trusted Publishing path with a release version that has been separately authorized;
- [ ] verify npm provenance from the real publishing path;

## Release boundary

This evidence does not:

- authorize `1.0.0-rc.1`;
- authorize `1.0.0`;
- authorize any package-version change;
- stage an npm package;
- publish an npm package;
- claim npm publication provenance;
- create or move a Git tag;
- create a GitHub Release;
- waive P11.6;
- waive P12.6 external-use evidence;
- add a stable attack.

The public package remains `handoffprobe@0.4.0`.

The stable public corpus remains 23 attacks.

The next P12.5 action must respect the separate release-authorization boundary.
