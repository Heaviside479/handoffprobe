# T-3.1 external A2A input freeze

Status: **COMPLETE — 2026-09-16**

## Purpose

Freeze the two external A2A technical inputs that opened T-3 before HandoffProbe performs overlap analysis or consumes external test material.

This record is provenance/evidence only. It does not claim A2A specification acceptance, HandoffProbe adoption, a cA2A vulnerability, compatibility, certification, partnership, endorsement, commercial demand, a new stable attack, or a release requirement.

## Input A — A2A #1937 / arjun2075

Exact comment:

- URL: `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5689749343`
- author: `arjun2075`
- created: `2026-09-15T23:48:30Z`
- artifact type: public GitHub issue comment containing a draft optional context-binding conformance profile;
- status stated by the author: draft for discussion only, not accepted A2A specification text.

Requested HandoffProbe work:

- compare HandoffProbe against the draft's V1–V13 conformance vectors;
- distinguish trusted task/context association from final effective-request authorization;
- test that the effective request is equivalent to or no broader than delegated authority at the final authorization point;
- preserve the rule that the request dispatched is the request evaluated;
- fail closed when the authorization-relevant projection or containment result is indeterminate;
- preserve equivalent normalization and narrower authority as non-fail controls where all other binding constraints hold.

Frozen vector identities and expected classes:

- V1 — task-bound in-scope request: allow;
- V2 — different task under task-bound grant: deny;
- V3 — another task in same context: allow only for an explicitly context-bound grant with remaining constraints satisfied;
- V4 — caller/named-delegate mismatch without authorization: deny;
- V5 — audience/resource outside bound constraints: deny;
- V6 — authorization-relevant translation widening: deny;
- V7 — equivalent normalization: allow when other constraints remain satisfied;
- V8 — strictly narrower effective authority: allow when other constraints remain satisfied;
- V9 — bound value changes after authorization decision: block or re-authorize;
- V10 — indeterminate comparison: deny/fail closed;
- V11 — expired/revoked/status-invalid authority: deny;
- V12 — required optional revalidation stale or unavailable: deny;
- V13 — multiple effects under one task: each dispatched effect gets its own final authorization and current temporal/status check.

Linked public context recorded from the comment:

- A2A latest specification, section 7.6.4, cited by the author as the normative context for `TASK_STATE_AUTH_REQUIRED`;
- A2A issue `#2028`, referenced for possible audit-attribution composition.

T-3 treats the draft as external reviewer input, not as normative A2A text.

## Input B — A2A #2079 / giskard09

Exact comment:

- URL: `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5688209314`
- author: `giskard09`
- created: `2026-09-15T21:16:36Z`
- requested scope: test HandoffProbe's A2A→MCP negative fixture against the real public delegation-chain shape/bytes instead of describing the property only in prose.

Frozen semantic distinction:

1. the upstream chain can prove declared hop-to-hop narrowing/continuity;
2. that does not by itself prove that the downstream request produced by A2A→MCP translation remains inside the declared scope.

The requested HandoffProbe observation is the second property. A result against that boundary must not be restated as a vulnerability in cA2A or in A2A itself.

## Upstream material pin for consumption

Repository:

- `giskard09/argentum-core`
- pinned commit: `4951899c6bb016928e299e9bf9993086885a45ae`
- license at the pinned revision: Apache License 2.0.

Pinned delegation-chain material under `examples/conformance/delegation-chain-ref/`:

- `vectors.json`
  - Git blob: `a616b20c12169268c065c92571fd078bd852dbfe`
  - SHA-256 from upstream `SHA256SUMS`: `98b040763ee0a1274abf9a6d2ddfa908f43ddbeac5949c8db6f6656025ef1af3`
- `cross-org-vectors.json`
  - Git blob: `39066b73db43c247be9a2b2e34578a111897a656`
  - SHA-256: `fab4982ccc557287c187244bb0106a2f82ac903a1da74e82e49a7808f7522f54`
- `replay-vectors.json`
  - Git blob: `5f19972f730abf3ec7731d0dbb61eb7c4b38f59a`
  - SHA-256: `2c2daecbdc99db317e68f350dd32f0d7f17dbce10fe9a33b99343f29510f1905`
- `verify.py`
  - Git blob: `54097a6e32878f6c23aa4a160c7fc1da3c821957`
  - SHA-256: `377670af12a56a2184309464fb2d4c75b3d66f2fdb1e3d6f854786f6dca006fd`
- upstream `SHA256SUMS`
  - Git blob: `10bbe478e6552658a311ac6053e3145cbfa3bbd0`.

The pinned commit records the corrected hop-signature preimage and replay-recording order. T-3 does not infer additional guarantees beyond what the pinned material and external comments demonstrate.

Any copied or adapted bytes/code must retain provenance and comply with Apache-2.0. Prefer HandoffProbe-owned minimal adapters/fixtures and exact input digests over wholesale copying.

## HandoffProbe baseline frozen for T-3

T-3 begins from:

- public package/release baseline: `v0.3.0`;
- immutable `v0.3.0` tag target: `ef54b950b3ee333c406fa81087685d7f952a028d`;
- stable corpus: exactly **22 attacks**;
- protocol baseline: **A2A 1.0 → MCP 2026-07-28**;
- T-1 result: semantic authority widening is owned by the `HP-AUTH-001` refinement, with no new stable attack ID;
- Phase 9 remains the existing deterministic crossing-evidence baseline;
- T-2.7 remains independently `WAITING FOR RESPONSE` from `bayu`.

## Bayu packet isolation

The exact artifact already handed to Bayu remains the immutable permalink:

- `https://github.com/Heaviside479/handoffprobe/blob/dd77f6d28e9f5dd8863670b2b12e6a7bbc32bb09/docs/T2_5_REVIEW_PACKET_20260915.md`
  T-3 must not rewrite or replace that handed-off artifact. New T-3 evidence is recorded separately and can be reconciled with T-2 only after Bayu responds or T-2 is closed under its documented no-response rule.

## T-3.1 decision

T-3.1 is complete when this freeze and its regression checks are merged.

No implementation decision is made here. T-3.2 must first map V1–V13 against the 22 stable attacks, Phase 9, T-1, and the T-2 contract before any new research case is added.
