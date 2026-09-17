# T-3 post-closeout cA2A external author confirmation

Status: **COMPLETE — 2026-09-17**

## Purpose

Record the substantive external confirmation that arrived after the 2026-09-16 T-3 closeout for the HandoffProbe real-shape cA2A translation-boundary comparison in A2A `#2079`.

This document is a post-closeout evidence record. It does not reopen T-3, rewrite the historical T-3.7/T-3.8 state, add a stable attack, change package version, or authorize a new release.

## HandoffProbe result being reviewed

Public HandoffProbe reply:

- https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862

Immutable execution evidence used by that reply:

- HandoffProbe commit: `c616804d3b3daedd7f68b300b8416029b5020942`
- artifact: `docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md`
- immutable artifact URL: https://github.com/Heaviside479/handoffprobe/blob/c616804d3b3daedd7f68b300b8416029b5020942/docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md

Pinned upstream input:

- `giskard09/argentum-core@4951899c6bb016928e299e9bf9993086885a45ae`
- vector: `cross-org-001-independent-signers`
- upstream leaf action: `payment.route`
- upstream leaf scope: `mycelium:payment`
- upstream expected result: `PASS`

Observed HandoffProbe boundary result:

- positive projection retained `delegated_scope: mycelium:payment` and produced exactly one protected local fake-tool effect;
- widening negative changed only the HandoffProbe-owned downstream projection to `delegated_scope: mycelium:*`;
- the widened request was blocked before `mcp.tool.call`;
- protected fake-tool executions remained `0` for the widening negative;
- protected effect delta remained `0` for the widening negative.

## External author confirmation

On 2026-09-17, giskard09 publicly confirmed that he independently checked the pinned vector against the HandoffProbe evidence document:

- https://github.com/a2aproject/A2A/issues/2079#issuecomment-5706400400

The confirmation states that the HandoffProbe boundary interpretation is correct:

- the upstream delegation-chain guarantee covers signed chain integrity and monotonic scope narrowing across hops;
- that guarantee does not determine what a downstream translator does with the authority afterward;
- widening `mycelium:payment` to `mycelium:*` during the HandoffProbe-owned projection step is therefore a translation-layer property, not something the upstream verifier could or should catch;
- the HandoffProbe writeup is correctly scoped as a containment refinement rather than a cA2A/A2A finding.

HandoffProbe acknowledged the confirmation and preserved the same claim boundary:

- https://github.com/a2aproject/A2A/issues/2079#issuecomment-5710063080

## Classification

Evidence level: **External vector comparison + author review**.

The HandoffProbe `#2079` comparison/review loop is now complete for the pinned input and the recorded owned projection.

This changes the evidence-index classification from open external-review follow-up to completed scoped external evidence.

It does **not** change the state of the upstream `#2079` extension proposal, which remains open independently of this HandoffProbe evidence loop.

## Historical reconciliation

The T-3.7 and T-3.8 closeout documents remain historically correct.

At closeout on 2026-09-16, no substantive external technical response to the published HandoffProbe `#2079` result had yet been recorded. The external author confirmation arrived on 2026-09-17, after T-3 was already closed.

Therefore:

- do not rewrite the T-3.7 closeout as if the review already existed on 2026-09-16;
- do not rewrite the T-3.8 combined closeout as if `#2079` had already reached completed external-evidence status;
- record the new state additively in this post-closeout document and `EVIDENCE.md`.

## Non-claims

This external confirmation does **not** establish:

- a cA2A vulnerability;
- an A2A vulnerability;
- A2A endorsement of HandoffProbe;
- cA2A/A2A compatibility certification;
- cA2A/A2A conformance certification;
- independent re-certification of the full upstream delegation-chain verifier;
- production-world behavior;
- security of arbitrary translators or deployments.

## Release and stable-corpus impact

None.

- no new stable attack is admitted by this confirmation;
- no package-version change is authorized;
- no new npm publication is authorized;
- no tag move or release rewrite is authorized;
- the already published `v0.4.0` release identity is not changed by this documentation follow-up.

## Result

The external-review condition that kept the `#2079` HandoffProbe stream in the open-follow-up section of `EVIDENCE.md` is now satisfied for the pinned real-shape comparison.

The comparison may be indexed as completed scoped external evidence while retaining all stated non-claims and while leaving later upstream revisions or broader production claims out of scope.