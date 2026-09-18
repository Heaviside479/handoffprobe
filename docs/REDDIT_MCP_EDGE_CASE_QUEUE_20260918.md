# Reddit MCP edge-case research queue — 2026-09-18

Status: **QUEUED — two external technical signals frozen; implementation not yet authorized.**

## Purpose

Preserve two concrete community-supplied MCP handoff edge cases without prematurely creating stable attack IDs or mixing them with unrelated research tracks.

Public source thread:

https://www.reddit.com/r/mcp/comments/1wjq57h/i_maintain_handoffprobe_give_me_an_mcp_handoff/

The two cases must remain separate during overlap analysis, deterministic execution, admission and public result return.

No package version change, stable-attack count change or release is authorized by this queue.

Current stable public corpus: **23 attacks**.

## Global execution rule

For each Reddit case:

1. preserve the originating public source and author;
2. complete overlap analysis against existing HandoffProbe invariants;
3. build only the smallest deterministic local/synthetic fixture justified by that analysis;
4. keep secure and intentionally vulnerable outcomes separately measurable;
5. measure protected effects explicitly;
6. perform normal attack admission after execution;
7. merge the reproducible result before making public claims;
8. return the concrete merged result to the originating Reddit discussion;
9. invite correction or counter-evidence;
10. classify any substantive external follow-up;
11. decide whether `EVIDENCE.md` should be updated only after reproducible execution and public result return.

A public suggestion alone is not evidence sufficient for `EVIDENCE.md`.

---

# R-1 — token rotation during interrupted handoff / reconnect with stale token

Status: **QUEUED — preliminary overlap: HP-RACE-002 REFINEMENT / NO NEW ID JUSTIFIED AT INTAKE.**

Originating Reddit author:

`u/Signal_Temporary6572`

Source description:

A client begins a handoff with session/auth token A. During the handoff the server rotates its current session token to B. A transient connection failure occurs. The client reconnects in the same handoff context while still presenting stale token A.

The source explicitly asks whether that should be treated as replay or stale authorization.

## Frozen research shape

Required deterministic ordering:

1. establish one handoff context;
2. token A is current and initially accepted;
3. begin one logical protected action;
4. capture the pre-interruption authorization state;
5. before any protected effect, rotate the server-side current token from A to B;
6. deterministically interrupt the connection;
7. resume/reconnect as attempt 2 in the same handoff context;
8. present stale token A;
9. re-evaluate current authorization before MCP dispatch;
10. measure MCP dispatch and protected-effect count.

Identity constraints:

- same logical action ID;
- different attempt IDs;
- same handoff/task/context identity;
- same principal;
- same intended audience;
- no protected effect before the interruption.

That last condition deliberately prevents the primary fixture from becoming a duplicate-effect/retry test.

## Preliminary overlap

### HP-RACE-002 — governing overlap

`HP-RACE-002 — Partial-failure stale execution` already defines:

> A resumed attempt must not use authority, approval or intent that became stale or invalid during a partial failure.

The Reddit case gives a concrete credential/session-token rotation mechanism for that existing invariant.

Preliminary classification:

**REFINEMENT**

Current admission position:

**NO NEW STABLE ATTACK ID JUSTIFIED AT INTAKE**

The intended value is a stronger concrete deterministic fixture/regression for stale authorization on reconnect.

### HP-REPLAY-003 — conditional only

`HP-REPLAY-003 — Retry double execution` governs only if attempt 1 already caused the protected effect and reconnect/retry can cause the same logical action to execute again.

The primary R-1 fixture must therefore keep pre-disconnect protected-effect delta at `0`.

If a later second variant intentionally adds a completed first effect plus acknowledgement ambiguity, that must be classified separately as replay/retry overlap rather than silently folded into the stale-auth result.

### HP-AUTH-006 — not governing

`HP-AUTH-006` concerns a later **distinct protected effect** after an earlier protected effect has already completed under the same task/context.

R-1 resumes the same interrupted logical action, so `HP-AUTH-006` is not the governing invariant.

## Expected deterministic outcomes

Secure:

- token A accepted initially;
- server rotates current token to B;
- reconnect presents A;
- current authorization revalidation rejects A;
- MCP protected dispatch count: `0`;
- protected-effect delta: `0`.

Intentionally vulnerable:

- token A accepted initially;
- server rotates current token to B;
- reconnect presents A;
- implementation trusts the pre-interruption authorization snapshot;
- resumed protected dispatch occurs;
- protected-effect delta: `1`.

## R-1 gates

- [x] external source recorded;
- [x] preliminary overlap with `HP-RACE-002`, `HP-REPLAY-003` and `HP-AUTH-006` recorded;
- [x] no new stable attack ID reserved;
- [ ] exact Reddit comment permalink recorded before public result return;
- [ ] deterministic fixture implemented;
- [ ] secure result reproduced;
- [ ] intentionally vulnerable result reproduced;
- [ ] protected-effect evidence recorded;
- [ ] normal admission decision completed;
- [ ] merged immutable result recorded;
- [ ] concrete result returned to originating Reddit commenter/thread;
- [ ] external response state recorded;
- [ ] substantive response classified if one arrives;
- [ ] `EVIDENCE.md` inclusion/promotion decision completed.

---

# R-2 — same-name hot deploy / capability drift after approval

Status: **QUEUED — DISTINCTNESS UNRESOLVED; research candidate only, no stable ID reserved.**

Originating Reddit author:

`u/anderson_the_one`

Source description:

A sender approves capability version A. During the handoff the receiver hot-deploys or resolves version B under the **same tool name**. Version B has materially widened the schema or changed protected semantics, for example from a read-like operation to a write-like operation.

The source proposes binding approval to a capability digest rather than only the tool label.

## Frozen research question

The important comparison is not merely:

`approved tool name == executed tool name`

It is:

`approved capability definition == effective capability definition at execution`

The deterministic fixture should therefore keep the visible tool name identical while changing a security-relevant capability definition between approval and final execution.

Candidate binding material may include a deterministic digest over the security-relevant capability definition.

This queue does not prescribe a production cryptographic format.

## Preliminary overlap

### HP-APPROVAL-002 — partial overlap, not exact coverage

`HP-APPROVAL-002 — Tool substitution after approval` changes the selected tool after approval.

R-2 is different in mechanism:

- the tool label remains the same;
- the effective capability definition changes after approval.

The existing approval invariant is therefore relevant, but current `HP-APPROVAL-002` does not by itself demonstrate same-name capability-version drift.

### HP-VERSION-001 — adjacent backlog candidate

`HP-VERSION-001` concerns security-relevant behavior lost or changed through version negotiation/translation.

R-2 is adjacent because a version change alters effective semantics, but the proposed Reddit fixture specifically concerns a previously issued approval surviving a hot-deployed capability change under the same name.

Overlap must be resolved with execution evidence rather than by name alone.

## Preliminary classification

**RESEARCH CANDIDATE — ADMISSION UNRESOLVED**

No new `HP-*` ID is reserved.

A new stable ID would require later evidence that:

1. the negative security invariant is distinct from existing approval/version invariants;
2. secure and intentionally vulnerable outcomes are deterministic;
3. protected-effect evidence gives a clear PASS/FAIL oracle;
4. the result is handoff/composition-specific rather than generic deployment/version management;
5. normal admission review concludes existing stable IDs cannot represent the failure accurately.

## Candidate deterministic shape

Version A:

- tool name: unchanged stable label;
- capability definition: A;
- capability digest: A;
- approval is issued against A.

Deterministic transition:

- pause after approval and before protected dispatch;
- replace effective capability definition A with B;
- retain the same visible tool name.

Version B negative:

- capability definition differs materially from A;
- candidate example: schema widening or a change from read-only semantics to protected mutation semantics;
- capability digest B differs from A.

Secure:

- final execution compares the approved capability binding to the effective capability;
- A/B mismatch is rejected before protected effect;
- protected-effect delta: `0`.

Intentionally vulnerable:

- final execution checks only the visible tool name or otherwise ignores the security-relevant capability change;
- stale approval for A authorizes B;
- protected-effect delta: `1`.

## R-2 gates

- [x] external source recorded;
- [x] preliminary overlap with `HP-APPROVAL-002` and `HP-VERSION-001` recorded;
- [x] no new stable attack ID reserved;
- [ ] exact Reddit comment permalink recorded before public result return;
- [ ] exact security-relevant capability-definition subset frozen;
- [ ] deterministic capability digest/binding representation frozen;
- [ ] deterministic hot-deploy/version-transition fixture implemented;
- [ ] secure result reproduced;
- [ ] intentionally vulnerable result reproduced;
- [ ] protected-effect evidence recorded;
- [ ] normal overlap/admission decision completed;
- [ ] merged immutable result recorded;
- [ ] concrete result returned to originating Reddit commenter/thread;
- [ ] external response state recorded;
- [ ] substantive response classified if one arrives;
- [ ] `EVIDENCE.md` inclusion/promotion decision completed.

---

# Execution order

Default research order:

1. **R-1 token rotation / reconnect**
2. **R-2 same-name hot deploy / capability drift**

R-1 goes first because its governing stable invariant is already clear and the fixture can be kept narrowly inside `HP-RACE-002`.

R-2 follows because its distinctness is genuinely unresolved and requires a stricter overlap/admission step before any stable-ID decision.

Do not combine the two fixtures.

Do not add either case to the public stable attack catalog merely because it originated from community feedback.

## Evidence policy

`EVIDENCE.md` remains unchanged at queue creation.

After each reproducible result is merged and publicly returned:

- record the exact immutable HandoffProbe commit/artifact;
- record the exact Reddit result-return URL;
- record external response state;
- distinguish HandoffProbe reproduction from external confirmation;
- update `EVIDENCE.md` only to the strongest evidence level actually demonstrated;
- silence is not agreement or confirmation.
