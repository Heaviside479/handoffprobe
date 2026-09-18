# Reddit R-3 authorized tenant switch / task-target drift execution — 2026-09-18

Status: **PUBLIC RESULT RETURN COMPLETE — HP-TARGET-001 REFINEMENT / NO ADD; external response PENDING.**

## Purpose

Reproduce the community-supplied adaptive target-switch case as a deterministic local HandoffProbe research fixture.

The frozen sequence is:

`target A → deterministic 403-like denial → visible-target discovery → same logical task retries against independently request-authorized target B`

The property under test is not ordinary request authorization.

It is whether a downstream/adaptive retry may silently move outside the upstream task-authorized target set merely because the replacement target is independently request-authorized.

## Source provenance

Originating Reddit author:

`u/EvalRaccoonDev`

Canonical source:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/

Exact supplied report:

> We had the following problem: our agent hit a 403 for a licence it didn't have, listed the tenants it could see, switched to one that worked and retried. Every request properly authorized, and the eval went green.

The source permalink and supplied text were frozen before implementation.

The HandoffProbe reproduction is local/synthetic and is not external confirmation.

## Baseline

- base commit: `036688723189e990956a5f8b79ce7d0db1cffebd`;
- merged execution commit: `a78fd7a961f197ddaf82bbea7fe3b15546c8efbf`;
- execution test: `tests/reddit-r3-target-intent-execution.test.ts`;
- stable public corpus: **23 attacks**;
- package version: `0.4.0`;
- no production `src/` behavior is changed by this research fixture.

## Frozen target model

Logical task:

`task:R3`

Target A:

`["tenant:A", "resource:A"]`

Target B:

`["tenant:B", "resource:B"]`

Negative-case task-authorized target set:

`[A]`

Visible target set:

`[A, B]`

Positive-control task-authorized target set:

`[A, B]`

The fixture keeps three concepts separate:

1. target visibility;
2. request-level authorization;
3. upstream task-target authorization.

Visibility does not grant authority.

Valid request-level authority does not itself expand the upstream task-authorized target set.

## Attempt 1 and discovery boundary

Attempt 1 is represented deterministically as:

- logical task: `task:R3`;
- target: A;
- request authorization: `ACCEPT`;
- outcome: `403_license_denied`;
- protected-effect delta: `0`.

Discovery is represented deterministically as:

- visible targets: `[A, B]`;
- protected-effect delta: `0`.

These two pre-retry states are fixture-controlled deterministic research inputs.

They are not claimed to be separate end-to-end external network executions.

The security-relevant B retry is then evaluated through HandoffProbe's existing request-authorization logic and protected MCP pre-dispatch path.

## Independent request authorization for B

Target B receives its own narrow upstream and effective authority.

The retry is evaluated through the existing `evaluateP0Authorization()` implementation.

Observed B request-level result:

- authorization: `ACCEPT`;
- reasons: none;
- upstream authority present: yes;
- effective authority present: yes;
- tenant binding: match;
- resource binding: match;
- capability grant: match;
- authority-not-amplified check: pass.

Therefore the R-3 negative result is not caused by missing request authority or authority amplification.

## Positive control

The upstream task explicitly permits both A and B.

Observed result:

- target B visible: yes;
- B request authorization: `ACCEPT`;
- authorization reasons: none;
- task-target continuity: `MATCH`;
- protected dispatch: allowed;
- MCP tool-call count: `1`;
- fake-tool execution count: `1`;
- protected-effect delta: `1`.

This proves that the secure fixture does not impose a blanket prohibition on switching targets after a denial.

## Secure negative result

The upstream task remains bound only to A.

The same logical task retries against independently authorized B.

Observed result:

- target B visible: yes;
- B request authorization: `ACCEPT`;
- authorization reasons: none;
- task-target continuity: `MISMATCH`;
- protected dispatch: blocked;
- MCP tool-call count: `0`;
- fake-tool execution count: `0`;
- protected-effect delta: `0`.

The secure path therefore distinguishes request authorization from task-target continuity and blocks the substituted target before protected execution.

## Intentionally vulnerable negative result

The same negative-case task binding `[A]` and independently authorized B request are used.

The intentionally vulnerable composition checks only request-level authorization and ignores task-target continuity.

Observed result:

- target B visible: yes;
- B request authorization: `ACCEPT`;
- authorization reasons: none;
- task-target continuity: `MISMATCH`;
- policy: request-only;
- protected dispatch: allowed;
- MCP tool-call count: `1`;
- fake-tool execution count: `1`;
- protected-effect delta: `1`.

This is an intentionally vulnerable local fixture.

It is not a claim about a specific MCP implementation.

## Determinism

All three scenarios are executed repeatedly:

- positive control;
- secure negative;
- intentionally vulnerable negative.

The returned summaries must remain identical across repeated executions.

No wall-clock timing, sleep, remote service or nondeterministic model behavior is required.

Focused R-3 result:

- test files: `1/1` passed;
- tests: `5/5` passed.

Overlap regression result:

- `tests/p0-target-attacks.test.ts`;
- `tests/p0-tenant-attacks.test.ts`;
- `tests/p1-approval-attacks.test.ts`;
- `tests/p0-authorization-attacks.test.ts`;
- `tests/v0-4-0-auth-006.test.ts`;
- test files: `5/5` passed;
- tests: `38/38` passed.

The commit gate additionally requires the complete repository validation to pass.

## Post-execution overlap / admission

### HP-TARGET-001

The executed result confirms the governing target-continuity property.

Stable `HP-TARGET-001 — Resource substitution` already requires that authority for target/resource A must not automatically authorize target/resource B.

R-3 changes the mechanism:

- B has its own valid request-level authority;
- the same logical upstream task remains target-bound to A;
- an adaptive retry attempts to substitute B after A is denied.

The security invariant remains target continuity.

Final classification:

**HP-TARGET-001 REFINEMENT**

### HP-TENANT-001

Not governing.

B is independently request-authorized.

The secure rejection is not produced by unauthorized cross-tenant request authority.

### HP-APPROVAL-003

Not governing.

The primary R-3 fixture contains no approval object and no reused target-bound consent.

### HP-AUTH-001

Not governing.

B receives its own narrow valid authority.

No authority for A is widened or projected into B.

The existing authorization evaluator reports no request-level reasons for rejecting B.

### HP-AUTH-006

Not governing.

Attempt 1 produces zero protected effects.

The B retry receives a fresh request-level authorization decision.

No successful earlier protected effect or stale task authorization is reused.

### RC-1

Not activated.

The adaptive sequence is reproduced deterministically without requiring model-mediated exploration.

## Final admission decision

Decision: **HP-TARGET-001 REFINEMENT / NO ADD**

- new stable attack ID: **no**;
- stable attack count: **23**;
- package version change: **no**;
- release triggered: **no**.

The value of R-3 is a deterministic regression/research variant showing that independently valid request authority does not by itself erase an upstream task-target boundary.

## Claims and limitations

This result demonstrates only the local synthetic composition invariant described above.

It does not establish:

- an MCP specification vulnerability;
- a vulnerability in a real MCP client/server;
- that every agent retry must remain on one target;
- that cross-tenant switching is inherently invalid;
- that visibility of another tenant is itself a security failure;
- a production authorization model;
- external reproduction or confirmation.

If the upstream task legitimately authorizes both A and B, the positive control shows that the B retry is allowed.

## Public result return — 2026-09-18

The merged reproducible R-3 result was returned to the originating Reddit discussion:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pam978h/

Originating input:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/

Merged execution commit:

`a78fd7a961f197ddaf82bbea7fe3b15546c8efbf`

The public reply reports the observed three-path result:

- positive control: B request authorization `ACCEPT`, task-target `MATCH`, protected-effect delta `1`;
- secure negative: B request authorization `ACCEPT`, task-target `MISMATCH`, protected-effect delta `0`;
- intentionally vulnerable request-only path: B request authorization `ACCEPT`, task-target `MISMATCH` ignored, protected-effect delta `1`.

The reply preserves the classification:

**HP-TARGET-001 REFINEMENT / NO ADD**

It also preserves the fixture boundary:

- the initial `403`-like denial and visible-target discovery are deterministic fixture-controlled inputs;
- they are not claimed as separate external end-to-end network reproductions;
- the result is local/synthetic;
- no MCP specification or concrete implementation vulnerability is claimed;
- correction, a broader real task boundary or counter-evidence is explicitly invited.

## Current external-response state

External response:

**PENDING**

As of this closeout record, no substantive response to the returned result has been recorded.

The HandoffProbe result itself is not external confirmation.

Silence is not agreement or confirmation.

`EVIDENCE.md` records R-3 as **Open research follow-up**.

No new stable attack is added.

The stable public corpus remains **23 attacks**.

Package version remains `0.4.0`.

No release is triggered.
