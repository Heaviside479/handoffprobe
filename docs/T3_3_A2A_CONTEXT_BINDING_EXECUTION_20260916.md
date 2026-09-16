# T-3.3 A2A context-binding comparison execution

Status: **COMPLETE — 2026-09-16**

Date: 2026-09-16

## Scope

This artifact executes the justified HandoffProbe comparison for the frozen external A2A `#1937` V1–V13 input.

The external vector set remains reviewer-provided discussion input. It is not treated as accepted or normative A2A specification text.

T-3.3 does not add a stable `HP-*` attack ID, change the public HandoffProbe runtime/API/CLI surface, or authorize a release.

Baseline:

- T-3.2 merge commit: `8c15401eafeb92c9d37867d21891565ad65e11c3`
- package version: `0.3.0`
- stable corpus: exactly **22 attacks**
- protocol baseline: **A2A 1.0 → MCP 2026-07-28**
- T-3.3 execution test: `tests/t3-a2a-context-binding-execution.test.ts`
- exact execution-test Git blob: `d6a40142a42f0ddcebcf439a43325d081456d34a`

## Comparison result

| Vector | T-3.2 classification  | HandoffProbe evidence                                                                      | Observed result                                                                                                                                                                                                                                   | T-3.3 decision                  |
| ------ | --------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| V1     | ALREADY COVERED       | Phase 9 valid bound control                                                                | Trusted in-scope task/context request reaches the final MCP dispatch and produces the expected protected effect.                                                                                                                                  | **NO ADD**                      |
| V2     | ALREADY COVERED       | Phase 9 task-swap evidence; HP-REPLAY-002 overlap                                          | A task-bound authority does not authorize a different task. Existing execution rejects the mismatch before the protected effect.                                                                                                                  | **NO ADD**                      |
| V3     | DISTINCT RESEARCH GAP | New T-3.3 local/synthetic execution                                                        | Task-bound grant + another task in the same context is rejected with zero effects; an explicitly context-bound grant + another task in that same context is accepted only while all other tested bindings remain unchanged, producing one effect. | **DISTINCT RESEARCH CANDIDATE** |
| V4     | ALREADY COVERED       | HP-AUTH-003, HP-ID-002, Phase 9 caller-swap                                                | Caller/delegate mismatch is rejected before protected dispatch.                                                                                                                                                                                   | **NO ADD**                      |
| V5     | ALREADY COVERED       | HP-CRED-002, HP-TARGET-001, HP-APPROVAL-003, Phase 9 audience-swap                         | Audience/resource authority outside the bound target is rejected before protected execution.                                                                                                                                                      | **NO ADD**                      |
| V6     | ALREADY COVERED       | HP-AUTH-001 semantic-authority refinement                                                  | Authorization-relevant translation widening is already evaluated as semantic authority widening rather than representation equality alone.                                                                                                        | **NO ADD**                      |
| V7     | ALREADY COVERED       | T-1 semantic refinement and T2-CANONICALIZATION-VERSION                                    | Equivalent trusted normalization can remain PASS when effective security meaning is unchanged.                                                                                                                                                    | **NO ADD**                      |
| V8     | ALREADY COVERED       | T-1 semantic-authority evidence                                                            | Equal or strictly narrower effective downstream authority remains permitted when the other constraints hold.                                                                                                                                      | **NO ADD**                      |
| V9     | ALREADY COVERED       | Phase 9 final pre-dispatch observation and action-digest checks                            | Authorization-relevant mutation between authority basis and final request is rejected before the protected effect.                                                                                                                                | **NO ADD**                      |
| V10    | REFINEMENT            | New T-3.3 local/synthetic execution plus existing T-1/T-2 result semantics                 | Both genuinely indeterminate trusted comparison (`INCONCLUSIVE`) and evaluator/runtime failure (`ERROR`) block protected dispatch with zero effects; neither is converted into vulnerability `FAIL`.                                              | **REFINEMENT**                  |
| V11    | ALREADY COVERED       | HP-AUTH-004 and Phase 9 temporal/status checks                                             | Expired, revoked or otherwise non-current authority is rejected before protected execution.                                                                                                                                                       | **NO ADD**                      |
| V12    | REFINEMENT            | New T-3.3 unavailable-revalidation execution plus existing stale/current evidence          | A required trusted revalidation attempt occurs once; when that source is unavailable the request fails closed with zero protected effects. Existing `status_stale` coverage is not duplicated.                                                    | **REFINEMENT**                  |
| V13    | DISTINCT RESEARCH GAP | New T-3.3 per-effect execution using the real pre-dispatch seam and CrossingEffectRecorder | Two protected-effect attempts under the same task/context receive separate final authorization evaluations. The first current authority produces one effect; the later revoked authority is rejected before dispatch, producing no second effect. | **DISTINCT RESEARCH CANDIDATE** |

## New deterministic execution evidence

The focused T-3.3 suite contains five tests:

1. V3 task-bound versus explicitly context-bound authority;
2. V10 fail-closed `INCONCLUSIVE`;
3. V10 fail-closed `ERROR`;
4. V12 required trusted revalidation unavailable;
5. V13 per-effect final authorization under one shared task/context.

Focused execution on 2026-09-16:

- test files: **1 passed / 1**
- tests: **5 passed / 5**
- TypeScript typecheck: **PASS**
- diff hygiene: **PASS**

The test uses the existing productive synthetic MCP path and existing `CrossingEffectRecorder`. The pre-dispatch gate runs after the final MCP audience/tool/arguments observation and before `mcp.tool.call` and fake-tool execution.

## Final-request invariant

For the new V3 and V13 execution cases, the gate compares the runtime observation at the final pre-dispatch boundary against a separate authority observation.

V13 additionally records each request evaluated by the gate and verifies that the accepted protected request corresponds to the request that reaches the MCP tool-call evidence.

A rejected second V13 effect produces:

- no second `mcp.tool.call`;
- no second `fake_tool.execute`;
- no increment to the protected-effect count.

## Result-semantics boundary

V10 preserves two independent concepts:

- runtime authorization is fail-closed when the required authorization comparison cannot be established;
- HandoffProbe research/scanner classification remains `INCONCLUSIVE` or `ERROR` as appropriate.

Runtime denial is therefore not automatically a vulnerability `FAIL`.

## Limitations

The new V3, V10, V12 and V13 cases are local, deterministic, synthetic research fixtures.

They do not establish:

- acceptance of the external draft by the A2A project;
- A2A endorsement of HandoffProbe;
- general protocol conformance certification;
- a new stable HandoffProbe attack;
- production support for a general context-bound authorization object;
- arbitrary batching, concurrency or distributed multi-effect semantics;
- availability semantics for every possible external status/revalidation service.

V3's positive context-bound path is an explicit research grant mode used to distinguish task-bound from context-bound semantics. It is not a change to the existing stable Phase 9 verifier.

V10's blocked-comparison cases are research controls that preserve the existing HandoffProbe result vocabulary.

V12 models the specifically admitted missing case: a required trusted revalidation source is unavailable immediately before protected dispatch.

V13 proves independent final authorization for two deterministic protected-effect attempts under one task/context; it does not claim coverage of every multi-effect orchestration model.

## Admission decision

T-3.3 produces:

- V1, V2, V4, V5, V6, V7, V8, V9 and V11: **NO ADD**;
- V10 and V12: **REFINEMENT**;
- V3 and V13: **DISTINCT RESEARCH CANDIDATE**.

No stable attack admission is made.

The stable corpus remains exactly **22 attacks**, package version remains `0.3.0`, and no release is authorized by this comparison.

Repository-wide quality/security gates completed successfully on 2026-09-16:

- **81 / 81 test files passed**;
- **417 / 417 tests passed**;
- build passed;
- npm package dry-run passed with package version `0.3.0`;
- secret-safety check passed;
- immutable `v0.3.0` tag remained `ef54b950b3ee333c406fa81087685d7f952a028d`;
- stable corpus remained **22 attacks** (12 P0 + 10 P1);
- eight current-spec `HP-*` headings remain non-stable backlog candidates;
- execution-test blob remained `d6a40142a42f0ddcebcf439a43325d081456d34a`;
- diff hygiene passed.

T-3.3 is complete. T-3.4, the factual public reply to Arjun, is next and has not yet been posted.
