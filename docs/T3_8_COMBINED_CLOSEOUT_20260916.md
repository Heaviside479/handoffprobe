# T-3.8 combined A2A follow-up closeout and admission decision

Status: **COMPLETE — 2026-09-16**

## Purpose

Close the T-3 external A2A follow-up track by reconciling the completed `#1937` context-binding comparison and the completed HandoffProbe side of the `#2079` cA2A real-shape translation-boundary comparison.

This closeout separates:

- what HandoffProbe reproduced and measured;
- what received substantive external author review;
- what remains an open technical follow-up;
- research classification from stable attack admission;
- T-3 from the still-independent T-2.7/Bayu review.

T-3 completion does not by itself authorize a new stable attack ID, package version, public release, compatibility claim, certification, protocol endorsement, partnership, adoption claim or commercial-validation claim.

## Frozen T-3 streams

### Stream A — A2A #1937 context-binding vectors

External draft / comparison request:

- `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5689749343`

HandoffProbe public comparison:

- `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5695896491`

External author review:

- `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5697862002`

HandoffProbe acknowledgment:

- `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5698439348`

Execution artifact:

- `docs/T3_3_A2A_CONTEXT_BINDING_EXECUTION_20260916.md`
- immutable comparison commit used publicly: `398daa88c17821b901dbeecc3c2ce79065f87d61`

Observed / admitted outcomes:

- V1, V2, V4, V5, V6, V7, V8, V9 and V11: **NO ADD**;
- V10 and V12: **REFINEMENT**;
- V3 and V13: **DISTINCT RESEARCH CANDIDATE**;
- stable attack admission for the stream: **NO ADD**.

Arjun's later public review states that the results appear consistent with the draft's intended runtime semantics while preserving the limitations around general product support, distributed concurrency and accepted A2A conformance semantics.

That author review is why this stream may remain a completed entry in `EVIDENCE.md`. It is still not A2A acceptance of the draft or conformance certification.

### Stream B — A2A #2079 cA2A real-shape translation boundary

External request:

- `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5688209314`

Pinned upstream:

- `giskard09/argentum-core@4951899c6bb016928e299e9bf9993086885a45ae`
- vector: `cross-org-001-independent-signers`
- upstream expected result: `PASS`

HandoffProbe execution:

- `docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md`
- merged execution commit: `c616804d3b3daedd7f68b300b8416029b5020942`

HandoffProbe public reply:

- `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862`

T-3.7 closeout:

- `docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md`
- merged T-3.7 commit: `c5ba76cab8234cae3b1f3863b4dc06a662e899ec`

Observed result:

- in-scope `payment.route` + `mycelium:payment` control: accepted with exactly one protected local fake effect;
- translation-only widening to downstream `delegated_scope = mycelium:*`: rejected before MCP dispatch;
- widened negative `mcp.tool.call`: `0`;
- widened negative protected fake-tool executions: `0`;
- widened negative protected fake-effect delta: `0`.

Admission outcome:

- stable attack admission for the stream: **NO ADD**;
- research outcome: **REFINEMENT** of the existing `HP-AUTH-001` semantic-authority evidence path;
- distinct research candidate created by this stream: **NO**.

No substantive external technical response or author review of this specific HandoffProbe result had been recorded at T-3 closeout time. Therefore `#2079` remains under **Open technical follow-ups** in `EVIDENCE.md`; T-3 completion must not relabel it as completed external confirmation.

## Combined admission decision

T-3 does **not** change the stable public corpus.

Combined result:

| Stream | Stable admission | Research outcome |
| --- | --- | --- |
| `#1937` | **NO ADD** | V10/V12 **REFINEMENT**; V3/V13 **DISTINCT RESEARCH CANDIDATE** |
| `#2079` | **NO ADD** | **REFINEMENT** of existing `HP-AUTH-001`; no distinct research candidate |

The stable public corpus remains exactly **22 attacks**: 12 P0 + 10 P1.

V3 and V13 remain research candidates only. They do not receive stable `HP-*` IDs through T-3.8.

The `#2079` execution strengthens existing semantic-authority evidence; it does not justify a second stable attack for the same demonstrated boundary.

## Result-semantics and claim boundary

T-3 preserves the existing HandoffProbe result distinction:

- protected runtime execution fails closed when required authorization evidence cannot be established;
- `INCONCLUSIVE` or `ERROR` is not converted into a vulnerability `FAIL`;
- successful upstream cryptographic or structural verification does not by itself prove downstream translated authority containment;
- deterministic local/synthetic evidence does not become a production-world security guarantee.

T-3 does not establish:

- accepted A2A specification text;
- A2A or cA2A endorsement of HandoffProbe;
- A2A/MCP/cA2A compatibility certification;
- general protocol conformance certification;
- a cA2A or A2A vulnerability;
- production security of `argentum-core` or arbitrary deployments;
- partnership, adoption or commercial validation.

## Release decision

T-3.8 is **not** a release trigger.

Release invariants remain:

- package version: `0.3.0`;
- immutable `v0.3.0` tag: `ef54b950b3ee333c406fa81087685d7f952a028d`;
- stable corpus: **22 attacks**;
- no `v0.3.1`, `v0.4.0` or other release is authorized solely by T-3 completion.

Any later release decision belongs to the normal coordinated release track and must evaluate the repository as a whole.

## T-2.7 / Bayu independence

T-2.7 remains independent and waiting for Bayu's response.

The already-shared Bayu packet remains frozen:

- `docs/T2_5_REVIEW_PACKET_20260915.md`

T-3.8 does not rewrite that packet or convert the pending T-2.7 review into validation. Any Bayu response is reconciled separately under the existing T-2 rules.

## Evidence-index decision

`EVIDENCE.md` keeps two different states:

- `#1937`: completed external vector comparison + author review;
- `#2079`: HandoffProbe execution and public reply complete, but external response/review still pending.

That distinction must remain visible after T-3 is closed.

## Next track

T-3 is complete.

The separately queued A2A `#1769` witness / conduct-observation follow-up may now move to **T-4.1 — freeze exact upstream material**.

T-4 remains a separate research track and must preserve the same evidence/admission discipline: freeze first, overlap-map before code, deterministic local execution only if justified, then an explicit `NO ADD / REFINEMENT / DISTINCT RESEARCH CANDIDATE` decision.

## T-3.8 decision

- `#1937` reconciled: yes;
- `#2079` reconciled: yes;
- both HandoffProbe public follow-ups recorded: yes;
- `#1937` author review recorded: yes;
- `#2079` external review falsely claimed: no;
- new stable attack admitted: no;
- stable public corpus: **22 attacks**;
- package version: `0.3.0`;
- release triggered: no;
- Bayu packet changed: no;
- T-3 exit gate: **SATISFIED**;
- next research step: **T-4.1**.
