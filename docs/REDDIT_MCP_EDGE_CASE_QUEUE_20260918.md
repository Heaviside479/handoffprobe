# Reddit MCP edge-case research queue — 2026-09-18

Status: **ACTIVE — R-1 and R-2 public results returned; R-3 source frozen and overlap unresolved.**

## Purpose

Preserve three concrete community-supplied MCP handoff edge cases without prematurely creating stable attack IDs or mixing them with unrelated research tracks.

Public source thread:

https://www.reddit.com/r/mcp/comments/1wjq57h/i_maintain_handoffprobe_give_me_an_mcp_handoff/

The three cases must remain separate during overlap analysis, deterministic execution, admission and public result return.

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

Status: **PUBLIC RESULT RETURN COMPLETE — HP-RACE-002 REFINEMENT / NO ADD; external response PENDING.**

Originating Reddit author:

`u/Signal_Temporary6572`

Direct Reddit comment permalink supplied by the commenter thread:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakk8w2/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

Canonical direct comment URL:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakk8w2/

Exact supplied comment text:

> what happens when a client reconnects mid-handoff after a transient network blip and the server already rotated its internal session token but the client still presents the old one, do you treat that as a replay or just a stale auth?

The direct permalink was recorded after deterministic execution/merge and before any public HandoffProbe result-return reply.

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

## R-1 execution result — 2026-09-18

Execution record:

`docs/REDDIT_R1_TOKEN_ROTATION_EXECUTION_20260918.md`

Merged execution commit:

`05677e5a00c45bcc20abe06b3622a72d4b7aa43b`

Immutable execution record:

https://github.com/Heaviside479/handoffprobe/blob/05677e5a00c45bcc20abe06b3622a72d4b7aa43b/docs/REDDIT_R1_TOKEN_ROTATION_EXECUTION_20260918.md

Immutable execution test:

https://github.com/Heaviside479/handoffprobe/blob/05677e5a00c45bcc20abe06b3622a72d4b7aa43b/tests/reddit-r1-token-rotation-execution.test.ts

Observed secure path:

- token A initially accepted;
- server-side current generation rotates to B during the interruption;
- reconnect presents stale A;
- current authorization rejects A as `stale_session`;
- MCP tool calls: `0`;
- protected-effect delta: `0`.

Observed intentionally vulnerable path:

- current authorization still rejects stale A;
- pre-interruption authorization snapshot is reused;
- MCP tool calls: `1`;
- protected-effect delta: `1`.

Final admission:

**HP-RACE-002 REFINEMENT / NO ADD**

- no new stable attack ID;
- stable corpus remains **23 attacks**;
- package remains `0.4.0`;
- no release is triggered;
- `HP-REPLAY-003` is not governing because effect count before interruption is exactly `0`;
- `HP-AUTH-006` is not governing because the resumed attempt is the same logical protected action.

## Public result return — 2026-09-18

The merged R-1 result was returned to the originating Reddit discussion:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/

The reply reports:

- secure reconnect with stale A after A → B rotation: current authorization `REJECT`;
- secure MCP dispatch count: `0`;
- secure protected-effect delta: `0`;
- intentionally vulnerable cached pre-interruption authorization reuse;
- vulnerable MCP dispatch count: `1`;
- vulnerable protected-effect delta: `1`;
- final classification: **HP-RACE-002 REFINEMENT / NO ADD**;
- the primary fixture is not classified as `HP-REPLAY-003` because no protected effect occurred before interruption;
- the result is a local synthetic HandoffProbe reproduction, not a claim about a real MCP implementation;
- correction or counter-evidence was explicitly invited.

External response state:

**PENDING**

No substantive response to the returned result has been recorded yet.

The public result return itself is not external confirmation, and silence must not be interpreted as agreement.

`EVIDENCE.md` records R-1 at **Open research follow-up** only.

## R-1 gates

- [x] originating thread, author, exact supplied comment text and direct permalink recorded;
- [x] preliminary overlap with `HP-RACE-002`, `HP-REPLAY-003` and `HP-AUTH-006` recorded;
- [x] no new stable attack ID reserved;
- [x] exact Reddit comment permalink recorded before public result return;
- [x] deterministic fixture implemented;
- [x] secure result reproduced;
- [x] intentionally vulnerable result reproduced;
- [x] protected-effect evidence recorded;
- [x] normal admission decision completed;
- [x] merged immutable result recorded;
- [x] concrete result returned to originating Reddit commenter/thread;
- [x] external response state recorded as PENDING;
- [ ] substantive response classified if one arrives;
- [x] `EVIDENCE.md` inclusion/promotion decision completed at Open research follow-up.

---

# R-2 — same-name hot deploy / capability drift after approval

Status: **PUBLIC RESULT RETURN COMPLETE — HP-APPROVAL-002 REFINEMENT / NO ADD; external response PENDING.**

Originating Reddit author:

`u/anderson_the_one`

Direct Reddit comment permalink supplied by the originating thread:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakp67i/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

Canonical direct comment URL:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakp67i/

Exact supplied comment text:

> Try a hot deploy in the middle. The sender approves capability version A, then the receiver resolves the same tool name after version B has widened the schema or changed a read into a write. The old approval should be dead, even though the label still matches. I'd bind it to the capability digest, not the tool name.

The exact direct permalink and supplied text were recorded before any R-2 fixture implementation.

## Source description

A sender approves capability version A.

After approval but before protected dispatch, the receiver deterministically changes the effective capability to version B while retaining the same visible tool name.

The security-relevant definition changes underneath the already-issued approval.

The supplied examples are:

- schema widening; or
- changing read-like semantics into write-like semantics.

The source proposes binding approval to the capability definition/digest rather than only the visible tool label.

HandoffProbe treats that digest as one deterministic fixture mechanism, not as a normative MCP requirement.

## Governing research question

The relevant comparison is not merely:

`approved tool name == executed tool name`

It is:

`approved security-relevant capability == effective security-relevant capability at execution`

The question is therefore whether an approval for capability A remains valid when the same label resolves to materially different capability B before execution.

---

## Final pre-implementation overlap review

### HP-APPROVAL-002 — governing stable invariant

`HP-APPROVAL-002 — Tool substitution after approval` already establishes that approval cannot be silently reused when the approved tool identity is replaced before execution.

The existing stable fixture changes the visible tool identity itself.

R-2 keeps that label unchanged and mutates the security-relevant capability definition behind it.

That is a new mechanism and useful regression shape, but the governing property is still approval continuity:

> execution must remain bound to what was actually approved.

R-2 therefore refines the existing stable approval invariant rather than defining a new security property.

Pre-implementation classification:

**HP-APPROVAL-002 REFINEMENT / NO ADD**

### HP-VERSION-001 — adjacent backlog, not governing

The deferred `HP-VERSION-001` direction concerns security-relevant behavior lost or changed through version negotiation or translation.

R-2 deliberately does not model protocol version negotiation.

The transition is a deterministic receiver-side capability replacement:

`approval(A) → replace effective A with B → execute`

No negotiation failure, downgrade algorithm or cross-version translation is required.

`HP-VERSION-001` remains adjacent but is not the governing invariant for the frozen R-2 fixture.

### HP-AUTH-001 — deliberately neutralized in the primary fixture

`HP-AUTH-001` governs semantic authority amplification.

To prevent R-2 from merely reproducing that existing invariant, the deterministic fixture must grant upstream semantic authority for both capability A and capability B.

Therefore:

- semantic authority for A: `ACCEPT`;
- semantic authority for B: `ACCEPT`;
- explicit approval binding: A only.

The negative failure is then caused solely by stale approval surviving the A → B capability replacement.

The secure R-2 path must reject B because approval does not match B, not because B exceeds delegated authority.

### HP-RACE-002 — excluded from the primary fixture

`HP-RACE-002` governs stale execution across partial failure / interruption and resume.

The R-2 primary fixture must contain:

- no network interruption;
- no reconnect;
- no resume;
- no retry attempt;
- no partial-failure state transition.

The only ordering boundary is:

`approval A → deterministic hot deploy A→B → final dispatch`

Therefore `HP-RACE-002` is not governing the primary R-2 fixture.

A future interruption/resume variant would require a separate overlap decision and must not be silently folded into R-2.

---

## Frozen deterministic capability representation

R-2 will use a fixture-local security-relevant capability tuple with exactly three fields:

1. visible tool name;
2. deterministic input-schema identifier;
3. protected effect class.

The primary fixture values are frozen as:

Capability A:

`["same-name-tool", "schema-v1", "read_only"]`

Capability B:

`["same-name-tool", "schema-v1", "protected_write"]`

Properties intentionally held constant:

- visible tool name;
- input-schema identifier;
- caller/principal;
- task/context;
- intended audience;
- request arguments;
- upstream semantic authority.

Only the protected effect class changes.

This deliberately chooses the source comment's read → write example rather than combining schema widening and effect mutation in one primary fixture.

A schema-widening variant may be researched later, but it must not be needed to establish the primary result.

## Frozen deterministic binding representation

Fixture binding preimage:

`JSON.stringify([toolName, inputSchemaId, effectClass])`

Fixture binding:

`SHA-256(UTF-8(binding preimage))`

This is a deterministic local HandoffProbe representation only.

It is not:

- a proposed MCP wire format;
- a protocol requirement;
- a claim that production systems must use SHA-256;
- a general JSON canonicalization design.

The tuple shape is fixed by the fixture, so no general schema-canonicalization problem is introduced.

## Frozen execution ordering

1. create capability A;
2. create capability B;
3. establish upstream authority that permits both A and B;
4. issue explicit approval bound to A's capability digest;
5. record protected-effect count `0`;
6. deterministically replace effective capability A with B;
7. keep the visible tool label unchanged;
8. perform final approval-binding evaluation;
9. only then permit or reject protected dispatch;
10. record protected-effect delta.

There is exactly one A → B transition.

There is no interruption/resume or retry.

## Required deterministic controls

### Positive control

Approval is issued directly for B.

Expected:

- upstream semantic authority for B: `ACCEPT`;
- approval binding for B: `MATCH`;
- protected dispatch: allowed;
- protected-effect delta: `1`.

This proves that the secure fixture does not simply prohibit B.

### Secure negative

Approval remains bound to A and effective capability becomes B.

Expected:

- upstream semantic authority for B: `ACCEPT`;
- visible tool label: unchanged;
- approved digest A != effective digest B;
- protected dispatch: blocked;
- protected-effect delta: `0`.

### Intentionally vulnerable negative

Approval remains bound to A and effective capability becomes B.

The intentionally vulnerable path validates only the unchanged visible tool name or otherwise ignores the security-relevant capability binding.

Expected:

- upstream semantic authority for B: `ACCEPT`;
- visible tool label: unchanged;
- stale approval accepted;
- protected dispatch: occurs;
- protected-effect delta: `1`.

## Pre-implementation decision

**HP-APPROVAL-002 REFINEMENT / NO ADD**

A deterministic fixture is justified because current stable execution changes the visible tool identity, while R-2 tests the same approval-continuity invariant when identity-by-label remains constant and semantics change underneath it.

The fixture is regression/research evidence for an existing stable invariant.

It does not reserve or justify a new stable `HP-*` ID at this stage.

The stable public corpus remains **23 attacks**.

Package version remains `0.4.0`.

No release is triggered.

`EVIDENCE.md` remains unchanged until reproducible execution is merged and the concrete result is returned to the originating Reddit discussion.

## R-2 execution result — 2026-09-18

Execution record:

`docs/REDDIT_R2_SAME_NAME_HOT_DEPLOY_EXECUTION_20260918.md`

Execution test:

`tests/reddit-r2-same-name-hot-deploy-execution.test.ts`

Observed positive control:

- upstream semantic authority for B: `ACCEPT`;
- approval directly bound to B: `MATCH`;
- protected-effect delta: `1`.

Observed secure negative:

- approval remains bound to A;
- effective capability becomes B under the same visible tool name;
- upstream semantic authority for B: `ACCEPT`;
- authority widening witnesses: none;
- capability digest A != capability digest B;
- approval binding: `MISMATCH`;
- protected-effect delta: `0`.

Observed intentionally vulnerable negative:

- approval remains bound to A;
- effective capability becomes B under the same visible tool name;
- upstream semantic authority for B: `ACCEPT`;
- capability digest A != capability digest B;
- label-only approval accepts because the visible tool name still matches;
- protected-effect delta: `1`.

All three scenario summaries reproduced deterministically.

Post-execution classification:

**HP-APPROVAL-002 REFINEMENT / NO ADD**

`HP-AUTH-001` is not governing because B remains within upstream semantic authority.

`HP-RACE-002` is not governing because no interruption, reconnect, resume or retry occurs.

`HP-VERSION-001` remains adjacent but is not governing because no protocol-version negotiation or translation occurs.

No new stable attack ID is justified.

Stable corpus remains **23 attacks**.

Package remains `0.4.0`.

No release is triggered.

`EVIDENCE.md` now records R-2 at the strongest demonstrated level: **Open research follow-up**.

## R-2 public result return — 2026-09-18

Merged execution commit:

`7ffcd7254a85391e0937ec514a39f4507af26727`

Public result-return comment:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paly9up/

Originating source:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakp67i/

External response state:

**PENDING**

The public result return itself is not external confirmation.

Silence is not agreement or confirmation.

Stable corpus remains **23 attacks**.

Package remains `0.4.0`.

No release is triggered.

## R-2 gates

- [x] originating thread, author and exact supplied comment text recorded;
- [x] exact Reddit comment permalink recorded;
- [x] source frozen before fixture implementation;
- [x] complete overlap review against `HP-APPROVAL-002`, `HP-VERSION-001`, `HP-AUTH-001` and `HP-RACE-002`;
- [x] pre-implementation classification recorded as `HP-APPROVAL-002 REFINEMENT / NO ADD`;
- [x] no new stable attack ID reserved;
- [x] exact security-relevant capability-definition subset frozen;
- [x] deterministic capability digest/binding representation frozen;
- [x] deterministic A → B transition ordering frozen;
- [x] upstream semantic authority for both A and B frozen to isolate approval continuity;
- [x] positive control frozen;
- [x] primary fixture excludes interruption/resume semantics;
- [x] deterministic fixture implemented;
- [x] secure result reproduced;
- [x] intentionally vulnerable result reproduced;
- [x] positive control reproduced;
- [x] protected-effect evidence recorded;
- [x] post-execution admission decision reconfirmed;
- [x] merged immutable result recorded;
- [x] concrete result returned to originating Reddit commenter/thread;
- [x] external response state recorded as PENDING;
- [ ] substantive response classified if one arrives;
- [x] `EVIDENCE.md` inclusion/promotion decision completed at Open research follow-up.

---

# R-3 — authorized tenant switch after denial / task-intent target drift

Status: **SOURCE FROZEN — RESEARCH CANDIDATE; DISTINCTNESS UNRESOLVED; implementation blocked pending full overlap and fixture-shape freeze.**

Originating Reddit author:

`u/EvalRaccoonDev`

Direct Reddit comment permalink supplied by the commenter thread:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

Canonical direct comment URL:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/

Exact supplied comment text:

> We had the following problem: our agent hit a 403 for a licence it didn't have, listed the tenants it could see, switched to one that worked and retried. Every request properly authorized, and the eval went green.

The exact direct comment permalink and supplied text were recorded before any R-3 fixture implementation.

## Source description

The reported agent:

1. attempted an operation for a licence it did not have and received a `403`;
2. enumerated tenants it could see;
3. switched to another tenant where the request worked;
4. retried;
5. received valid request-level authorization on each request;
6. nevertheless caused the evaluation to pass after changing the effective target.

The interesting boundary is therefore not necessarily request-level authorization.

The research question is whether an agent may silently substitute a different target/tenant after a denial when the upstream task, intent or approval was bound to the original target.

If the upstream task already permits **any independently authorized visible tenant**, then the switch may be legitimate and this negative case does not exist.

HandoffProbe must not describe the source report as a vulnerability without first freezing that task/intent boundary.

## Preliminary overlap

### HP-TARGET-001 — closest stable neighbor, but not exact coverage yet

`HP-TARGET-001 — Resource substitution` verifies that authority for resource A must not automatically authorize resource B.

Its current stable fixture substitutes the target while retaining the original upstream resource grant.

R-3 differs in an important way:

- the alternate target may have its own valid request-level authorization;
- the security question may therefore be the continuity of the **upstream task/intent target**, not whether the second request lacks local authority.

R-3 may ultimately reduce to an `HP-TARGET-001` refinement, but that decision requires a deterministic fixture that isolates task-bound target continuity from ordinary request authorization.

### HP-TENANT-001 — adjacent, not governing on the supplied facts

`HP-TENANT-001 — Tenant context loss or substitution` demonstrates cross-tenant protected access when authority originating in one tenant reaches an unauthorized alternate tenant/resource.

The R-3 source explicitly says every request was properly authorized.

Therefore the supplied shape is not, by itself, the existing `HP-TENANT-001` cross-tenant authorization failure.

### HP-APPROVAL-003 — conditional only

`HP-APPROVAL-003 — Approval reuse for another resource` becomes relevant only if the original operation carried explicit approval/consent bound to the first target and that approval was reused for the alternate target.

The supplied comment does not establish that condition.

Do not make approval reuse part of the primary fixture unless the frozen R-3 shape explicitly includes it.

### HP-AUTH-001 — not governing if request authority remains narrow and valid

`HP-AUTH-001 — Delegated authority amplification` governs semantic authority widening.

If the alternate tenant request uses independently valid authority and no effective authority set is widened beyond its grant, `HP-AUTH-001` is not the governing invariant.

### HP-AUTH-006 — not governing on the supplied facts

`HP-AUTH-006` requires stale task authorization from an earlier completed protected effect to authorize a later distinct effect.

R-3 can be reproduced with:

- zero protected effects on the denied first attempt; and
- fresh valid request-level authorization on the alternate target.

Under that shape, stale task authorization is not the property under test.

### RC-1 — model-mediated mutation discovery is adjacent, not activated by this comment alone

The behavior may have been produced by model-mediated planning or adaptive agent logic.

That makes R-3 relevant to RC-1, but the public comment alone does not establish the exact model-mediated mechanism or a reproducible model flow.

RC-1 therefore remains unactivated by R-3 intake alone.

## Preliminary classification

**RESEARCH CANDIDATE — DISTINCTNESS UNRESOLVED**

No new stable `HP-*` ID is reserved.

The central candidate invariant is:

> A downstream/adaptive retry must not silently replace an upstream task-bound target with a different target merely because the replacement is independently request-authorized.

That invariant is only meaningful when the upstream task actually binds the allowed target set.

## Candidate deterministic shape

Freeze a synthetic task with:

- original allowed target: `tenant:A / resource:A`;
- alternate visible target: `tenant:B / resource:B`;
- alternate request-level authority: independently valid;
- upstream task-authorized target set: contains A, not B.

Attempt 1:

- targets A;
- receives a deterministic `403`-like denial;
- protected-effect delta: `0`.

Discovery step:

- returns a deterministic visible-target set containing B;
- visibility alone does not expand the task-authorized target set.

Attempt 2:

- same logical upstream task;
- switches target from A to B;
- request-level authorization for B: `ACCEPT`.

Secure composition path:

- final task/intent target-continuity check rejects B;
- protected-effect delta: `0`.

Intentionally vulnerable composition path:

- implementation treats request-level authorization for B as sufficient;
- silently accepts the target substitution;
- protected-effect delta: `1`.

Required positive control:

- upstream task explicitly permits both A and B;
- switching to independently authorized B is allowed;
- protected-effect delta: `1`.

The positive control is required so the fixture tests task-bound target continuity rather than inventing a generic prohibition on switching tenants.

## R-3 gates

- [x] originating thread and author recorded;
- [x] exact supplied comment text recorded;
- [x] exact direct Reddit comment permalink recorded;
- [x] source frozen before fixture implementation;
- [x] preliminary overlap against `HP-TARGET-001`, `HP-TENANT-001`, `HP-APPROVAL-003`, `HP-AUTH-001`, `HP-AUTH-006` and RC-1 recorded;
- [x] no new stable attack ID reserved;
- [ ] exact upstream task/intent target-binding representation frozen;
- [ ] exact independently authorized alternate-target representation frozen;
- [ ] deterministic `403 → visible targets → target switch → retry` sequence frozen;
- [ ] positive control for an explicitly multi-target task frozen;
- [ ] final pre-implementation decision: `HP-TARGET-001` refinement vs distinct research fixture;
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

# Execution order

Current research state:

1. **R-1 token rotation / reconnect** — execution and public result return complete; external response pending.
2. **R-2 same-name hot deploy / capability drift** — execution, admission and public result return complete; external response pending.
3. **R-3 authorized tenant switch after denial** — source frozen; overlap and deterministic fixture-shape freeze may proceed, but implementation remains blocked until the R-3 gates above are complete.

R-2 and R-3 are independent research cases.

R-3 overlap work does not need to wait for the missing R-2 permalink, but neither case may enter fixture implementation before its own source/overlap gates are satisfied.

Do not combine the fixtures.

Do not add any case to the public stable attack catalog merely because it originated from community feedback.

## Evidence policy

`EVIDENCE.md` remains unchanged at queue creation.

After each reproducible result is merged and publicly returned:

- record the exact immutable HandoffProbe commit/artifact;
- record the exact Reddit result-return URL;
- record external response state;
- distinguish HandoffProbe reproduction from external confirmation;
- update `EVIDENCE.md` only to the strongest evidence level actually demonstrated;
- silence is not agreement or confirmation.
