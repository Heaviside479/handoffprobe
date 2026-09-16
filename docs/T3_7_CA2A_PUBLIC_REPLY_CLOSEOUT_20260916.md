# T-3.7 cA2A public reply closeout

Status: **COMPLETE — 2026-09-16**

## Purpose

Record the public HandoffProbe follow-up to giskard09 in A2A `#2079` after the pinned T-3.6 real-shape execution became reproducible and was merged.

This closeout records what HandoffProbe published, the exact evidence it referenced, and the remaining external-review state. It does not convert the result into a new stable attack, release requirement, compatibility claim, certification, endorsement, partnership, or vulnerability claim against cA2A/A2A.

## Public reply

Thread:

- A2A `#2079` — `[Extension Proposal]: cA2A, confidential delegation (attenuated authority, peer attestation, sealed payloads, provenance)`

HandoffProbe public reply:

- https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862

The reply reports the real-shape translation-boundary result requested by giskard09 and links the immutable HandoffProbe evidence used for the response.

## Reproducible basis

Pinned upstream input:

- repository: `giskard09/argentum-core`
- commit: `4951899c6bb016928e299e9bf9993086885a45ae`
- source: `examples/conformance/delegation-chain-ref/cross-org-vectors.json`
- vector: `cross-org-001-independent-signers`
- upstream expected result: `PASS`

HandoffProbe evidence:

- T-3.6 merge commit: `c616804d3b3daedd7f68b300b8416029b5020942`
- execution record: `docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md`
- adapted fixture: `tests/fixtures/t3/ca2a-cross-org-001.json`
- fixture SHA-256: `668e3950c54fef486a0bf433c4542b968ee645e33bed2d2b952ce94f4d8bba81`

## Published result

The public reply preserves the distinction requested in the thread between upstream delegation-chain verification and downstream translation-time containment.

Positive control:

- upstream action: `payment.route`
- upstream scope: `mycelium:payment`
- downstream tool: `payment.route`
- downstream `delegated_scope`: `mycelium:payment`
- result: accepted at the local pre-dispatch boundary;
- protected local fake-effect delta: `1`.

Widening negative:

- pinned upstream fixture: unchanged;
- upstream scope: `mycelium:payment`;
- downstream tool: `payment.route`;
- downstream `delegated_scope`: `mycelium:*`;
- result: rejected before MCP dispatch;
- `mcp.tool.call`: `0`;
- protected fake-tool executions: `0`;
- protected fake-effect delta: `0`.

The public interpretation is deliberately narrow: for this HandoffProbe-owned mapping, a delegation chain that verifies cleanly does not by itself authorize a broader effective request introduced during downstream translation.

## Claim boundary

The reply explicitly does **not** claim:

- a cA2A or A2A vulnerability;
- A2A conformance certification;
- compatibility certification;
- protocol endorsement or standards acceptance;
- independent re-certification of the upstream delegation-chain verifier;
- production-world security of `argentum-core` or cA2A;
- partnership, adoption or commercial validation.

The result remains application/translation-layer containment evidence and refinement evidence for HandoffProbe's existing semantic-authority research.

## Evidence-index state

T-3.7 completes HandoffProbe's public-reply gate for A2A `#2079`.

`EVIDENCE.md` must **not** promote this stream to a completed external-evidence entry yet. The HandoffProbe execution and public reply are complete, but no substantive external technical response or author review of this specific HandoffProbe result has been recorded at T-3.7 closeout time.

Until such a response exists, `#2079` remains under **Open technical follow-ups** with the public-reply permalink and exact execution artifact recorded.

If giskard09 later provides a substantive technical correction, confirmation, or counter-example, record and classify it before any further implementation that depends on that response.

## T-3.7 decision

T-3.7 is complete.

- public evidence-based reply posted: yes;
- exact permalink recorded: yes;
- reproducible T-3.6 artifact linked: yes;
- cA2A/A2A vulnerability claim introduced: no;
- compatibility/certification/endorsement claim introduced: no;
- new stable attack admitted: no;
- stable public corpus: **22 attacks**;
- package version: `0.3.0`;
- release triggered: no.

T-3.8 is next: reconcile the `#1937` and `#2079` streams into the combined closeout and attack-admission decision.
