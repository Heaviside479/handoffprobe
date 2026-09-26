# AACP-017 predicate-level authority signal

Date: 2026-09-26

Status: **EXTERNAL HANDOFFPROBE EXECUTION REPORTED AND MAINTAINER REPRODUCED — OVERLAP / ADMISSION REVIEW PENDING**

## External source

HandoffProbe issue:

https://github.com/Heaviside479/handoffprobe/issues/185

External reproducer:

https://github.com/arjun2075/aacp017-handoffprobe-repro

Pinned external reproducer commit:

`31c3afc0e4253e77e3242fe46c3099ae9d6e1549`

The external report states:

- public package: `handoffprobe@0.4.0`;
- Node.js: `24.21.0`;
- HandoffProbe source modified: no;
- bundled secure corpus: `23 / 23 PASS`;
- bundled vulnerable corpus: `23 / 23 FAIL`;
- existing 23 attacks behaved as documented.

The report is explicitly framed as a model-scope / expressiveness question, not
as a defect report against an existing stable attack.

## Predicate observation

The external reproducer compares integer-cent authority predicates:

- upstream: `amount < 5000`;
- semantics-preserving downstream representation: `amount <= 4999`;
- genuinely wider downstream representation: `amount <= 5000`.

Under the reproducer encoding, predicate forms are represented as distinct
opaque capability identifiers.

The shipped `evaluateP0SemanticAuthority` path reports both changed identifiers
as outside the upstream identifier set. The semantics-preserving transform and
the genuine widening therefore enter the same failure class under this
representation.

## Maintainer reproduction

On 2026-09-26, the exact external repository commit above was independently
checked from a clean temporary clone before this record was written.

Observed maintainer environment:

- Node.js: `v24.17.0`;
- external repository manifest verification: `PASS`;
- dependency install used `npm ci --ignore-scripts --no-audit --no-fund`;
- HandoffProbe dependency resolved as `0.4.0`;
- `node reproduce.mjs`: exit `0`;
- documented same-class observation reproduced.

This maintainer rerun verifies the submitted reproducer behavior. It does not
independently rerun every external full-corpus command reported in issue #185.

## Classification

Current classification:

**INDEPENDENT EXTERNAL HANDOFFPROBE PACKAGE EXECUTION + RESEARCH INPUT**

For P12.6, issue #185 establishes an independently attributable external
developer running the public package and reporting concrete results. That is one
of the roadmap examples of potentially qualifying external-use evidence.

It does not establish:

- repeated external use;
- GitHub Action or CLI integration into another repository;
- adoption by an organization;
- a customer or paid assessment;
- a new stable attack;
- a defect in the existing 23 stable attacks;
- that arbitrary predicate equivalence is already part of the stable public
  contract.

P12.6 remains open because the minimum GA evidence threshold is still undefined.

## Research decision

AACP-017 is recorded as a **research input / candidate pending overlap review**.

The closest stable neighbor is `HP-AUTH-001`, but no final refinement,
model-extension or distinct-candidate classification is made by this record.

Before any implementation or stable admission, the project must determine:

1. whether predicate normalization is handoff-specific rather than generic
   policy-language equivalence;
2. what predicate domains and canonical semantics can be modeled soundly;
3. whether a secure and intentionally vulnerable composition can demonstrate a
   distinct end-to-end security invariant;
4. whether the result is already governed by `HP-AUTH-001`;
5. whether deterministic evidence can distinguish equivalent normalization from
   actual authority widening without unsafe inference.

## Public result return

The maintainer reproduction and current classification were returned publicly
to the external contributor in issue #185:

https://github.com/Heaviside479/handoffprobe/issues/185#issuecomment-5846617504

The reply confirms:

- the exact pinned AACP-017 reproducer was reproduced locally;
- the current stable semantic-authority path does not claim general arbitrary
  predicate equivalence;
- AACP-017 remains research input pending normal overlap/admission review
  against `HP-AUTH-001`;
- the existing stable corpus remains **23 attacks**.

No adoption, integration or stable-attack claim is made by this reply.

## Stable and release boundary

- stable corpus remains **23 attacks**;
- no `HP-*` ID is reserved;
- no runtime implementation change is authorized;
- no package-version change is authorized;
- this record does not close P11.6;
- this record does not close P12.6;
- this record does not authorize npm stage or publication;
- this record does not authorize a Git tag or GitHub Release.
