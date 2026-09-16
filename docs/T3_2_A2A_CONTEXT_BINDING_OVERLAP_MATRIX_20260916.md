# T-3.2 A2A context-binding overlap matrix

Status: **COMPLETE — 2026-09-16**

## Purpose

Map the frozen V1–V13 context-binding vectors from A2A issue `#1937` against the existing HandoffProbe evidence before any T-3.3 implementation decision.

This is an overlap and research-admission artifact only.

It does not:

- create or modify a stable `HP-*` attack ID;
- change the public corpus of 22 stable attacks;
- change runtime, CLI, report, config or GitHub Action behavior;
- change package version `0.3.0`;
- claim that the external draft is accepted A2A specification text;
- convert an evaluator `ERROR` or research `INCONCLUSIVE` into a vulnerability `FAIL`.

## Frozen input

The authoritative T-3 input is:

`docs/T3_1_EXTERNAL_A2A_INPUT_FREEZE_20260916.md`

The vector set remains exactly V1–V13 as frozen there.

## Classification vocabulary

### `ALREADY COVERED`

Existing stable, Phase 9, T-1 or completed T-2 research evidence directly represents the required protected behavior or its required positive/negative control strongly enough that T-3 does not need a new research property.

### `REFINEMENT`

The governing security property already exists, but the frozen vector adds a missing evidence or runtime-enforcement condition that should be exercised explicitly during T-3.3.

### `DISTINCT RESEARCH GAP`

Current HandoffProbe evidence does not directly model the frozen behavior. A narrow local/synthetic T-3.3 research case is justified.

This classification does **not** admit a new stable attack.

### `OUT OF SCOPE`

The vector does not represent a HandoffProbe handoff/composition security property.

## Evidence baseline

T-3.2 is constrained by:

- the 22 stable HandoffProbe attacks in `docs/ATTACK_CATALOG.md`;
- completed T-1 semantic-authority refinement under stable `HP-AUTH-001`;
- Phase 9 deterministic crossing evidence at the real pre-dispatch boundary;
- the T-2 protocol-neutral Handoff Contract and overlap matrix;
- completed T-2.4 canonicalization/version and ambiguous-field research;
- the immutable T-3.1 external-input freeze.

T-1 owns the governing semantic-authority relation:

`effective_authority(downstream) ⊆ delegated_authority(upstream)`

Phase 9 already observes caller, message, task, context, MCP audience, tool and arguments immediately before dispatch and records whether a local synthetic protected effect occurred.

T-2.4 already provides deterministic PASS/FAIL/INCONCLUSIVE research evidence for interpretation equivalence and divergence.

## V1–V13 decision matrix

| Vector | Frozen behavior                                                                                      | Most relevant existing evidence                                                                                                                                                                                                                            | Classification            | T-3.3 consequence                                                                                              |
| ------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| V1     | task-bound in-scope request is allowed                                                               | Phase 9 unmutated valid control reaches the pre-dispatch gate, is accepted and records one synthetic effect                                                                                                                                                | **ALREADY COVERED**       | Reuse the existing valid control; no new case required solely for V1                                           |
| V2     | a different task under a task-bound grant is denied                                                  | Phase 9 `task_swap → task_mismatch`; `HP-REPLAY-002` also covers authority reuse across task/run/context boundaries                                                                                                                                        | **ALREADY COVERED**       | Reuse task-binding evidence                                                                                    |
| V3     | another task in the same context is allowed only when the grant is explicitly context-bound          | Current Phase 9 authority binding requires both exact `task_id` and exact `context_id`; existing stable evidence does not model an explicit context-bound grant that intentionally spans tasks                                                             | **DISTINCT RESEARCH GAP** | Add one narrow research-only task-bound/context-bound contrast                                                 |
| V4     | caller/named-delegate mismatch without authorization is denied                                       | `HP-AUTH-003`, `HP-ID-002` and Phase 9 `caller_swap → caller_mismatch`                                                                                                                                                                                     | **ALREADY COVERED**       | Reuse caller/delegate evidence                                                                                 |
| V5     | audience/resource outside bound constraints is denied                                                | `HP-CRED-002`, `HP-TARGET-001`, `HP-APPROVAL-003` and Phase 9 `audience_swap → audience_mismatch`                                                                                                                                                          | **ALREADY COVERED**       | Reuse audience/resource containment evidence                                                                   |
| V6     | authorization-relevant translation widening is denied                                                | Stable `HP-AUTH-001` after T-1 directly evaluates effective downstream authority against upstream delegated authority and records concrete widening witnesses                                                                                              | **ALREADY COVERED**       | Reuse the T-1-refined semantic evaluator                                                                       |
| V7     | equivalent normalization remains allowed when all other constraints hold                             | T-1 permits representation change with equivalent trusted effective meaning; T-2.4 `T2-CANONICALIZATION-VERSION` has a deterministic PASS for changed representation with equivalent security meaning                                                      | **ALREADY COVERED**       | Reuse as the required non-fail normalization control                                                           |
| V8     | strictly narrower effective authority remains allowed when all other constraints hold                | T-1 explicitly treats equal or narrower effective downstream authority as PASS                                                                                                                                                                             | **ALREADY COVERED**       | Reuse the narrower-authority PASS control                                                                      |
| V9     | a bound value changing after authorization is blocked or re-authorized                               | `HP-APPROVAL-001/002/003`; Phase 9 observes exact tool/arguments immediately before dispatch and rejects mismatching action digests with zero bound effect                                                                                                 | **ALREADY COVERED**       | Reuse post-authorization mutation evidence                                                                     |
| V10    | indeterminate authorization-relevant comparison fails closed                                         | T-1 distinguishes evaluator `ERROR` from security `FAIL`; T-2 uses `INCONCLUSIVE` for incomplete trusted comparison evidence. Existing evidence does not yet prove that such an indeterminate authorization decision prevents the protected runtime effect | **REFINEMENT**            | Add a narrow runtime control proving no effect occurs while preserving `INCONCLUSIVE`/`ERROR` result semantics |
| V11    | expired, revoked or otherwise status-invalid authority is denied                                     | Stable `HP-AUTH-004` covers expiry; Phase 9 rejects `status_stale` and `authority_not_current` before effect                                                                                                                                               | **ALREADY COVERED**       | Reuse expiry/current-status evidence                                                                           |
| V12    | required optional revalidation that is stale or unavailable is denied                                | Phase 9 directly covers stale/current status and P1 race recovery revalidates current security state; no direct existing case demonstrates an unavailable required revalidation source                                                                     | **REFINEMENT**            | Add only the unavailable-required-revalidation control; do not duplicate stale-status coverage                 |
| V13    | multiple effects under one task each receive final authorization and a current temporal/status check | Replay/race evidence covers retries, repeated consumption and stale resumed execution, but no current evidence directly models multiple distinct protected effects under one task with an independent final authorization/status decision for each effect  | **DISTINCT RESEARCH GAP** | Add the smallest multi-effect research case with per-effect final checks                                       |

## Classification summary

Exactly 13 vectors are classified:

- `ALREADY COVERED`: **9** — V1, V2, V4, V5, V6, V7, V8, V9, V11;
- `REFINEMENT`: **2** — V10, V12;
- `DISTINCT RESEARCH GAP`: **2** — V3, V13;
- `OUT OF SCOPE`: **0**.

No vector is left unclassified.

## Key boundary decisions

### V3 — task-bound versus context-bound authority

Existing Phase 9 crossing authority is stricter than V3's context-bound positive case: it requires the observed task and context to both match the bound values.

That proves rejection of a task mismatch but does not prove the distinct allowed behavior where authority was intentionally granted to a context and another task inside that context remains authorized.

T-3.3 may therefore create one HandoffProbe-owned local/synthetic research case that distinguishes:

1. task-bound grant + another task in same context → reject;
2. context-bound grant + another task in same context → continue only if every other binding and authority constraint remains valid.

This is research admission only, not a new stable attack decision.

### V10 — fail closed without corrupting result semantics

Arjun's vector concerns runtime authorization behavior.

HandoffProbe's research/scanner result vocabulary remains separate:

- incomplete trusted evidence may be `INCONCLUSIVE`;
- evaluator failure remains `ERROR`;
- neither is automatically a vulnerability `FAIL`.

For an authorization-relevant comparison that cannot be established, T-3.3 should verify that the protected effect is not dispatched while retaining the correct research/scanner result classification.

A runtime denial and a HandoffProbe vulnerability `FAIL` are not the same concept.

### V12 — unavailable required revalidation

Stale status is already directly represented.

The missing precision is only the case where revalidation is required for the protected effect but the trusted revalidation source is unavailable.

T-3.3 should not duplicate `status_stale`. It may add one narrow unavailable-source control and prove zero protected effect.

### V13 — per-effect final authorization

Existing replay and race tests do not establish V13.

A repeated transport attempt, replayed nonce or resumed action is not equivalent to multiple distinct effects intentionally produced under one task.

T-3.3 may add the smallest deterministic case in which:

1. one task legitimately produces more than one protected effect;
2. each effect reaches the final pre-dispatch authorization boundary independently;
3. each effect receives a current temporal/status evaluation;
4. changing or invalidating authority before a later effect prevents that later effect;
5. effect recording proves exactly which synthetic effects occurred.

## T-3.3 admitted execution scope

The overlap map authorizes no new stable attack.

T-3.3 should:

- reuse existing evidence for V1, V2, V4–V9 and V11;
- reuse T-2.4's equivalent-normalization PASS evidence for V7;
- add only narrowly justified research evidence for V3, V10, V12 and V13;
- keep all new work local, deterministic, synthetic and outside the public stable attack corpus unless a later separate admission decision says otherwise;
- preserve the distinction between runtime rejection and HandoffProbe `FAIL / INCONCLUSIVE / ERROR`;
- leave the stable corpus at exactly **22 attacks**.

## T-3.2 decision

T-3.2 is complete when this overlap matrix and its regression checks are merged.

The result justifies targeted T-3.3 research for V3, V10, V12 and V13 only.

It does not justify a new stable attack ID, a release, an A2A conformance claim, compatibility language, partnership language or endorsement language.
