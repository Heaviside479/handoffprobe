# LangGraph #8102 replay/resume admission-decision signal

Date: 2026-09-22

Status: **FROZEN / OVERLAP COMPLETE — REFINEMENT / COMPOSITION / NO NEW STABLE ID**

## External source freeze

Originating LangGraph RFC:

https://github.com/langchain-ai/langgraph/issues/8102

Earlier HandoffProbe comment in the same thread:

https://github.com/langchain-ai/langgraph/issues/8102#issuecomment-5764278465

New external technical comment:

https://github.com/langchain-ai/langgraph/issues/8102#issuecomment-5774538909

Frozen comment metadata:

- comment ID: `5774538909`;
- author: `hippoley`;
- created: `2026-09-22T09:58:04Z`;
- thread state at freeze: open.

The external comment is qualified technical input.

It is not:

- adoption of HandoffProbe;
- endorsement of HandoffProbe;
- independent reproduction of a HandoffProbe result;
- evidence that LangGraph is vulnerable;
- evidence that the proposed hook or decision model is already implemented.

## Technical signal

The comment proposes strengthening a pre-execution admission boundary beyond a simple `ALLOW | BLOCK | MODIFY` callback.

The relevant ideas are:

1. preserve the proposed call separately from the effective call;
2. represent suspension such as `REQUIRE_APPROVAL` or `DEFER` separately from blocking;
3. retain stable admission-decision identity and provenance;
4. define whether resume or retry reuses a prior decision or re-evaluates policy;
5. test the actual execution boundary across allow, block, modify, interrupt/resume and crash/resume;
6. prove protected external side effects remain correctly bounded and are not duplicated.

A representative proposed shape is:

`AdmissionDecision(action="allow|block|modify|require_approval", proposed_call=..., effective_call=..., policy_id=..., reason=...)`

## HandoffProbe classification

Classification:

**B — REFINEMENT / COMPOSITION / NO NEW STABLE ID**

The signal is materially useful because it combines decision durability, call binding, recovery semantics and effect identity at one pre-execution boundary.

However, the currently described failure modes overlap existing stable HandoffProbe invariants strongly enough that a separate stable attack class is not justified from this comment alone.

The stable corpus remains **23 attacks**.

The public package remains **handoffprobe@0.4.0**.

No release is triggered.

## Overlap matrix

### HP-RACE-002 — governing same-action stale-state invariant

`HP-RACE-002 — Partial-failure stale execution` already covers an interrupted protected operation where authorization or translated security state exists before final execution and later becomes stale or invalid.

Its invariant requires a resumed attempt to revalidate current security state rather than execute from stale captured authority, approval or intent.

A persisted admission decision becomes another form of captured security state when it is restored and reused after interruption.

Therefore the primary stale-decision resume case is a refinement of `HP-RACE-002`.

### HP-REPLAY-003 — governing duplicate-effect invariant when execution may already have happened

`HP-REPLAY-003 — Retry double execution` distinguishes one logical protected action from multiple execution attempts.

It governs the case where crash, response loss or retry ambiguity causes the same logical action to be attempted again after a protected effect may already have occurred.

The required property is still at most one protected side effect for one logical action unless application semantics explicitly allow more.

Crash/recovery therefore does not create a new replay class merely because process restoration is involved.

### HP-AUTH-006 — adjacent but not governing

`HP-AUTH-006 — Stale task authorization reused for later effect` requires two distinct logical protected effects in one task/run/context.

The LangGraph resume signal primarily concerns continuation or replay of the same interrupted logical action.

If a restored workflow later attempts a separate distinct protected effect, `HP-AUTH-006` becomes relevant, but that is not the primary resume fixture.

The distinction must remain explicit.

### Approval attacks — conditionally adjacent

If `proposed_call` and `effective_call` differ after approval or consent, existing approval invariants may govern:

- `HP-APPROVAL-001` for security-sensitive payload mutation after consent;
- `HP-APPROVAL-002` for tool substitution after approval;
- `HP-APPROVAL-003` for approval reuse against another resource.

The admission-decision record can make these mutations easier to observe, but it does not create a new failure class by itself.

### HP-AUDIT-001 — evidence/provenance adjacency

Stable decision identity, policy identity/version and proposal-versus-effective-call lineage improve the ability to explain who authorized what and what actually executed.

That is adjacent to `HP-AUDIT-001`, but provenance structure alone is not the primary security failure being researched here.

## Important semantic distinctions

Future research must keep these cases separate:

1. retry of the same logical action;
2. resume of the same interrupted action;
3. crash plus workflow/process restoration;
4. reuse of an old admission decision;
5. fresh policy evaluation after resume;
6. mutation from proposed call to effective call;
7. authority or policy change between decision and effect;
8. duplicate execution of the same protected effect;
9. a later distinct protected effect in the same task;
10. a new attempt at the same logical protected effect.

Attempt identity must not be confused with logical action identity.

Process restart must not automatically be treated as a new logical action.

## Minimal future deterministic research contract

No fixture is implemented by this freeze record.

If activated, the smallest useful synthetic fixture should model:

`proposed call -> admission decision -> no protected effect yet -> interrupt or simulated crash -> restore state -> resume -> reuse or revalidate decision -> protected-effect observation`

Required evidence should include:

- stable logical action ID;
- execution attempt ID;
- admission decision ID;
- policy ID and deterministic policy version/state;
- proposed call;
- effective call;
- authority state at decision time;
- authority state at resume time;
- whether the decision was reused or re-evaluated;
- protected-effect counter before and after each attempt.

### Control 1 — clean resume

Context, effective call, authority and policy remain unchanged.

A valid recovery path may continue according to explicitly defined application semantics.

The fixture must not invent a failure merely because an interruption occurred.

### Control 2 — effective call changed

Arguments, tool or another security-relevant effective-call element changes after the original decision.

The old decision must not silently authorize the changed action.

Existing approval/binding invariants must be checked before considering any new admission.

### Control 3 — authority or policy state changed

The governing authority or policy state/version changes before resume.

A stale decision must not silently authorize the protected effect.

This is primarily an `HP-RACE-002` refinement unless evidence later proves a distinct invariant.

### Control 4 — crash/recovery of the same logical action

Recovery retries the same logical action after execution status is ambiguous or after an effect may already have occurred.

The protected effect must not execute twice.

This is primarily an `HP-REPLAY-003` refinement.

### Control 5 — explicitly fresh reauthorization

The restored workflow obtains a fresh decision for the current effective call under current authority/policy state.

Exactly one valid protected effect should occur.

## Admission boundary

This record does not:

- reserve a new `HP-*` identifier;
- change `ATTACK_CATALOG.md`;
- expand the stable corpus;
- change package version;
- modify README marketing claims;
- claim a LangGraph defect;
- claim external validation of HandoffProbe.

A future research fixture may be implemented only as a deterministic refinement/composition experiment first.

A new stable attack would require evidence that survives overlap review and proves a handoff-specific negative invariant not already measured by the current corpus.

## Traceability

Because this external GitHub comment materially shapes HandoffProbe research, any later canonical HandoffProbe PR that implements or closes this research must include the full originating issue URL:

https://github.com/langchain-ai/langgraph/issues/8102

and preserve the exact comment URL:

https://github.com/langchain-ai/langgraph/issues/8102#issuecomment-5774538909

A public result return is not authorized by this freeze record.

If a deterministic HandoffProbe result is later merged, result-return and external-response classification must follow the existing external evidence loop.

## Current decision

**REFINEMENT / COMPOSITION / NO NEW STABLE ID**

Next gate:

`freeze/overlap merge -> decide whether deterministic research fixture adds evidence beyond current stable fixtures`
