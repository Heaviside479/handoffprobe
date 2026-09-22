# P12.5 GA candidate and live release-engineering proof

Date: 2026-09-22

Status: **IN PROGRESS — candidate freeze, Release Candidate execution, artifact reproducibility and SBOM proof complete**

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

## P12.5 completion state

Completed:

- [x] freeze the exact candidate commit;
- [x] run the Release Candidate workflow from the exact candidate;
- [x] reproduce byte-identical candidate npm artifacts;
- [x] generate and verify the release SBOM.

Still open:

- [ ] exercise the real npm stage / Trusted Publishing path with a release version that has been separately authorized;
- [ ] verify npm provenance from the real publishing path;
- [ ] install and execute the exact candidate externally;
- [ ] verify the reusable GitHub Action externally from the candidate identity;
- [ ] verify upgrade/migration/troubleshooting guidance against the candidate;
- [ ] decide whether prerelease publication materially improves final validation.

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
