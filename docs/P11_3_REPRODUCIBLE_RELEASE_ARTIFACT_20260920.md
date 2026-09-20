# P11.3 reproducible release artifact validation

Date: 2026-09-20

Status: **COMPLETE — 2026-09-20**

## Purpose

Add an automated release-engineering gate proving that the npm release
artifact is reproducible from the exact candidate commit.

P11.3 is intentionally narrower than general cross-platform reproducible
builds.

The required invariant is:

> Within one defined Release Candidate CI environment, the exact same Git
> commit and lockfile must independently produce byte-identical npm tarballs.

## Local feasibility evidence

A read-only local probe was executed from:

`6aa73c25b85945bccdd550e9b150425b59f085fa`

The probe:

1. created two independent temporary source trees with `git archive`;
2. ran `npm ci` independently in each tree;
3. ran `npm pack` independently in each tree;
4. compared SHA-256 digests;
5. compared the complete `.tgz` files byte-for-byte;
6. compared sorted package manifests;
7. verified that the repository remained unchanged.

Observed result:

- rebuild A SHA-256:
  `a92c3debd5696e0189326384da95bb40cd1827beb6a633c9168292eb4440c013`;
- rebuild B SHA-256:
  `a92c3debd5696e0189326384da95bb40cd1827beb6a633c9168292eb4440c013`;
- byte identity: `yes`;
- manifest identity: `yes`;
- repository safety: passed.

This proves the current package can satisfy a byte-reproducibility gate in the
tested environment.

## Automated gate

The Release Candidate workflow now creates:

- the normal candidate tarball;
- isolated rebuild A from the exact `GITHUB_SHA`;
- isolated rebuild B from the exact `GITHUB_SHA`.

Each isolated rebuild performs its own:

- source extraction;
- `npm ci`;
- build through the package `prepack` lifecycle;
- `npm pack`.

The workflow then requires:

- rebuild A SHA-256 equals rebuild B SHA-256;
- rebuild A and rebuild B are byte-identical;
- the normal Release Candidate tarball matches the isolated rebuild;
- the sorted npm package manifests are identical.

Any mismatch fails the Release Candidate job.

## Scope and limitations

This gate proves deterministic npm artifact generation for repeated isolated
builds inside the same Release Candidate job environment.

It does not claim:

- byte identity across different operating systems;
- byte identity across future Node.js or npm versions;
- reproducibility outside the declared package/toolchain boundary;
- npm registry publication;
- provenance attestation;
- SBOM generation.

Provenance and SBOM remain separate Phase 11 work.

## Release boundary

P11.3 does not:

- change `handoffprobe@0.4.0`;
- stage or publish an npm package;
- create or move a Git tag;
- create a GitHub Release;
- change the stable 23-attack corpus;
- change runtime source or public interfaces.


## Completion evidence — 2026-09-20

Protected implementation admission:

- pull request: `#161`;
- implementation head:
  `bf1baec01227a0ae8fe22692a6713e8580edd8d2`;
- all six pull-request checks completed successfully;
- the protected Release Candidate job executed the new reproducibility gate;
- protected merge commit:
  `a50938eec77108fa4d2640109cc069c19001bc28`.

Merged-main verification:

- workflow: `Release Candidate`;
- workflow run: `35520070640`;
- job: `106102510361`;
- event: `workflow_dispatch`;
- exact `main` commit:
  `a50938eec77108fa4d2640109cc069c19001bc28`;
- workflow result: `success`;
- reproducibility step result: `success`.

Observed merged-main artifact digests:

- Release Candidate SHA-256:
  `a92c3debd5696e0189326384da95bb40cd1827beb6a633c9168292eb4440c013`;
- rebuild A SHA-256:
  `a92c3debd5696e0189326384da95bb40cd1827beb6a633c9168292eb4440c013`;
- rebuild B SHA-256:
  `a92c3debd5696e0189326384da95bb40cd1827beb6a633c9168292eb4440c013`;
- workflow result:
  `Release artifact reproducibility: PASS`.

The merged-main run also completed payload inspection, clean installation,
secure full-corpus execution and repository-cleanliness verification.

No package version was changed, staged or published merely to validate P11.3.

P11.3 therefore establishes byte-identical npm release-artifact generation
for repeated isolated builds inside the defined Release Candidate environment.

The documented limitations remain unchanged: this is not a claim of
cross-platform byte identity, future-toolchain byte identity, provenance
attestation or SBOM generation.

## Completion gate

P11.3 is complete only after:

- the reproducibility workflow change passes protected pull-request validation;
- the Release Candidate job demonstrates the new gate on the protected PR;
- the implementation is merged normally;
- the Release Candidate workflow is run successfully from merged `main`;
- the merged-main run records matching candidate/rebuild SHA-256 values;
- no release or package-version change is triggered merely to test P11.3.
