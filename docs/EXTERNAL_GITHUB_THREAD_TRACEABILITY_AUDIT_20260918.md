# External GitHub thread traceability audit — 2026-09-18

Status: **COMPLETE — documentation/linkage audit only; no new research or attack admission.**

## Purpose

Audit the external GitHub threads in which HandoffProbe was explicitly discussed by the HandoffProbe maintainer and verify the full trace:

`external source → HandoffProbe comment → HandoffProbe work/result → public result return → external reaction → Evidence/Roadmap state`.

The audit also checks whether a canonical internal HandoffProbe closeout PR creates a visible GitHub cross-reference back to the external thread.

No new fixture, stable attack ID, package version or release is authorized by this audit.

## Discovery scope

A public GitHub issue search for `commenter:Heaviside479 HandoffProbe`, followed by repository-specific comment verification, identified these external HandoffProbe threads:

1. A2A #1937;
2. A2A #2079;
3. A2A #1769;
4. MCP specification repository #3354;
5. VATE #2;
6. MCP TypeScript SDK #2777.

`Heaviside479/handoffprobe#20` is internal HandoffProbe intake and is not an external thread.

Two number collisions were checked separately:

- `modelcontextprotocol/modelcontextprotocol#2777` is an unrelated ATSA pull request; the HandoffProbe-related #2777 is `modelcontextprotocol/typescript-sdk#2777`.
- `modelcontextprotocol/registry#1579` contains a maintainer comment about **MCPShip**, not HandoffProbe, so it is intentionally excluded from HandoffProbe evidence/research tracking.

## Audit matrix

| External thread | HandoffProbe participation | Result return | External reaction | Current HandoffProbe status | Canonical internal cross-reference |
| --- | --- | --- | --- | --- | --- |
| A2A #1937 | boundary comment + V1–V13 comparison | complete | Arjun author review received | External vector comparison + author review | PR #93 |
| A2A #2079 | translation-boundary comment + pinned cA2A comparison | complete | giskard09 author confirmation received | External vector comparison + author review | PR #103 |
| A2A #1769 | Phase 9 evidence comment + T-4 WitnessObservation/VATE work | complete | Oga and Poke-nushi reviews received | External vector comparison + author review | PR #121 |
| VATE #2 | VATE-specific T-4 result return | complete | VATE technical acknowledgement/record received | Same completed T-4 scoped author-review evidence | PR #121 |
| MCP #3354 | execution-integrity/authorization boundary comment + deterministic refinement | complete | no post-result author response recorded | Open research follow-up | PR #115 |
| MCP TypeScript SDK #2777 | comment only on schema-valid vs safe-to-present peer declarations | none | no substantive response recorded | comment-only signal; no HandoffProbe research/admission work | none by design |

## A2A #1937

External thread:

https://github.com/a2aproject/A2A/issues/1937

HandoffProbe boundary comment:

https://github.com/a2aproject/A2A/issues/1937#issuecomment-5684030629

Concrete vector request:

https://github.com/a2aproject/A2A/issues/1937#issuecomment-5689749343

Resulting HandoffProbe work:

- `docs/T3_2_A2A_CONTEXT_BINDING_OVERLAP_MATRIX_20260916.md`
- `docs/T3_3_A2A_CONTEXT_BINDING_EXECUTION_20260916.md`

Public result return:

https://github.com/a2aproject/A2A/issues/1937#issuecomment-5695896491

External author review:

https://github.com/a2aproject/A2A/issues/1937#issuecomment-5697862002

HandoffProbe acknowledgement:

https://github.com/a2aproject/A2A/issues/1937#issuecomment-5698439348

Current evidence state: **External vector comparison + author review**.

Canonical internal closeout:

https://github.com/Heaviside479/handoffprobe/pull/93

GitHub timeline verification performed on 2026-09-18 confirms that PR #93 is visible as a cross-reference on A2A #1937.

## A2A #2079

External thread:

https://github.com/a2aproject/A2A/issues/2079

HandoffProbe initial boundary comment:

https://github.com/a2aproject/A2A/issues/2079#issuecomment-5682091042

Resulting HandoffProbe work:

- `docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md`
- `docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md`
- `docs/T3_CA2A_EXTERNAL_AUTHOR_CONFIRMATION_20260917.md`

Public result return:

https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862

External author confirmation:

https://github.com/a2aproject/A2A/issues/2079#issuecomment-5706400400

HandoffProbe acknowledgement:

https://github.com/a2aproject/A2A/issues/2079#issuecomment-5710063080

Current evidence state: **External vector comparison + author review**.

Canonical internal closeout:

https://github.com/Heaviside479/handoffprobe/pull/103

GitHub timeline verification performed on 2026-09-18 confirms that PR #103 is visible as a cross-reference on A2A #2079.

## A2A #1769

External thread:

https://github.com/a2aproject/A2A/issues/1769

Initial HandoffProbe evidence/context comment:

https://github.com/a2aproject/A2A/issues/1769#issuecomment-5682264021

Resulting HandoffProbe T-4 work includes:

- `docs/T4_1_UPSTREAM_FREEZE_20260917.md`
- `docs/T4_2_WITNESS_VATE_OVERLAP_MATRIX_20260918.md`
- `docs/T4_3_PROVIDER_RECONCILIATION_EXECUTION_20260918.md`
- `docs/T4_5_PUBLIC_RESULT_RETURN_20260918.md`

Public A2A result return:

https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729838541

WitnessObservation author review:

https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729937680

VATE author review in the A2A thread:

https://github.com/a2aproject/A2A/issues/1769#issuecomment-5732275655

HandoffProbe acknowledgement:

https://github.com/a2aproject/A2A/issues/1769#issuecomment-5732372039

Current evidence state: **External vector comparison + author review**.

Canonical internal closeout:

https://github.com/Heaviside479/handoffprobe/pull/121

GitHub timeline verification performed on 2026-09-18 confirms that PR #121 is visible as a cross-reference on A2A #1769.

## VATE #2

External implementation-review thread:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2

HandoffProbe VATE-specific result return:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5729853773

External VATE issue acknowledgement:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5733113059

Immutable external technical record:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/blob/60c8c7c9cf89fc6011eb95f9d67b5d25233338b7/docs/interop/handoffprobe-reconciliation-review.md

HandoffProbe acknowledgement:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5733216447

The external technical record explicitly states that source/package correspondence was checked and that the HandoffProbe tests were **not rerun** by the VATE maintainer. It therefore strengthens reciprocal provenance/traceability without becoming independent reproduction.

Current evidence state remains: **External vector comparison + author review**.

Canonical internal closeout:

https://github.com/Heaviside479/handoffprobe/pull/121

GitHub timeline verification performed on 2026-09-18 confirms that PR #121 is visible as a cross-reference on VATE #2.

## MCP #3354

External thread:

https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354

HandoffProbe boundary comment:

https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5682996881

AkiraTamai boundary response:

https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5715753995

Resulting HandoffProbe work:

- `docs/MCP_3354_FREEZE_OVERLAP_20260918.md`
- `docs/MCP_3354_PROOF_AUTHORITY_EXECUTION_20260918.md`
- `docs/MCP_3354_PUBLIC_RESULT_RETURN_20260918.md`

Public result return:

https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5731012791

No substantive post-result AkiraTamai response is recorded as of this audit.

Current evidence state: **Open research follow-up**.

Canonical internal closeout:

https://github.com/Heaviside479/handoffprobe/pull/115

GitHub timeline verification performed on 2026-09-18 confirms that PR #115 is visible as a cross-reference on MCP #3354.

## MCP TypeScript SDK #2777

External thread:

https://github.com/modelcontextprotocol/typescript-sdk/issues/2777

HandoffProbe maintainer comment:

https://github.com/modelcontextprotocol/typescript-sdk/issues/2777#issuecomment-5661691733

The comment distinguishes schema-valid input from input that is safe to present or act on and notes HandoffProbe's trust-boundary/invariant perspective.

No deterministic HandoffProbe fixture, comparison, public result return, admission decision or external technical follow-up resulted from this thread.

Therefore:

- no stable attack is added;
- no research candidate is activated;
- no `EVIDENCE.md` entry is warranted;
- no retroactive technical closeout PR is manufactured merely to make the thread look more complete.

The thread remains a **comment-only external signal**.

## Excluded: MCP Registry #1579

https://github.com/modelcontextprotocol/registry/issues/1579

The Heaviside479 comment in this thread explicitly discusses **MCPShip** and passive MCP distribution metadata, not HandoffProbe.

It is intentionally excluded from HandoffProbe research/evidence lineage.

## Cross-reference repair performed

Before this audit, the external issue timelines did not expose HandoffProbe closeout PR cross-references for the four technical work streams.

The canonical merged HandoffProbe closeouts were updated with explicit full external issue URLs:

- PR #93 → A2A #1937;
- PR #103 → A2A #2079;
- PR #121 → A2A #1769 and VATE #2;
- PR #115 → MCP #3354.

GitHub timeline checks then confirmed visible HandoffProbe PR cross-reference events on all five external technical threads.

This is metadata/traceability repair only. It does not alter the historical research result, evidence level, stable corpus, package version or release state.

## Final audit state

- stable public corpus: **23 attacks**;
- package version: **0.4.0**;
- no new attack ID;
- no new research execution;
- no release;
- no evidence-level promotion caused solely by this audit.
