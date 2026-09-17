# T-3 post-closeout cA2A external author confirmation

Status: **RECORDED — 2026-09-17**

## Purpose

Record the substantive external response that arrived after the dated T-3.7/T-3.8 closeout for the A2A `#2079` real-shape translation-boundary comparison.

This is a post-closeout evidence update. It does not rewrite the historical state recorded on 2026-09-16, change the T-3 attack-admission result, mutate the published `v0.4.0` release identity, or create a new release requirement.

## Prior HandoffProbe evidence

Pinned upstream input:

- repository: `giskard09/argentum-core`
- commit: `4951899c6bb016928e299e9bf9993086885a45ae`
- vector: `cross-org-001-independent-signers`
- leaf action: `payment.route`
- scope: `mycelium:payment`
- upstream expected result: `PASS`

HandoffProbe execution:

- `docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md`
- merged execution commit: `c616804d3b3daedd7f68b300b8416029b5020942`
- public reply: `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862`
- T-3.7 closeout: `docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md`
- T-3.8 combined closeout: `docs/T3_8_COMBINED_CLOSEOUT_20260916.md`

The positive control preserved downstream `delegated_scope = mycelium:payment` and produced exactly one protected local fake effect. The translation-only negative widened only the downstream scope to `mycelium:*` and was blocked before MCP dispatch, with zero protected fake-tool execution.

## External author confirmation

On 2026-09-17, giskard09 publicly confirmed the scoped HandoffProbe interpretation after independently checking the pinned vector against the HandoffProbe evidence document:

- `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5706400400`

The response explicitly confirmed that:

- the pinned vector is `4951899c` / `cross-org-001-independent-signers`, scope `mycelium:payment`, expected `PASS`;
- the upstream delegation-chain guarantee covers signed chain integrity and monotonic scope narrowing across hops;
- that guarantee does not determine what a downstream translator later does with the authority;
- widening `mycelium:payment` to `mycelium:*` inside HandoffProbe's projection is therefore a translation-layer property;
- HandoffProbe's framing as containment refinement, not a cA2A/A2A finding, is correctly scoped.

HandoffProbe acknowledged the confirmation here:

- `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5710063080`

## Evidence-index consequence

The external-review condition that was still pending at the 2026-09-16 T-3 closeout is now satisfied for this narrowly scoped comparison.

`EVIDENCE.md` may therefore list `#2079` as completed scoped external evidence while preserving the dated T-3.7/T-3.8 records unchanged as historical statements of what was known at their closeout time.

## Admission result remains unchanged

This external confirmation does not create a new attack class.

The T-3 classification remains:

- stable attack admission: **NO ADD**;
- research outcome: **REFINEMENT** of existing `HP-AUTH-001`;
- distinct research candidate from `#2079`: **NO**.

No package version, stable attack count, CLI contract, report schema, protocol support, tag or published release is changed by this record.

## Non-claims

This record does not establish:

- a cA2A or A2A vulnerability;
- A2A acceptance or endorsement;
- A2A/cA2A conformance or compatibility certification;
- independent re-certification of `argentum-core`;
- production-world behavior;
- partnership, adoption or commercial validation;
- a new stable attack;
- a new release requirement.

The confirmed claim remains narrow: the upstream chain guarantee and the downstream translation-containment guarantee are distinct properties, and the tested HandoffProbe-owned widening is correctly attributed to the translation boundary.
