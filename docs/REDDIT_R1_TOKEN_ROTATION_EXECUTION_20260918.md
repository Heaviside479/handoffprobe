# Reddit R-1 token-rotation / reconnect execution — 2026-09-18

Status: **PUBLIC RESULT RETURN COMPLETE — HP-RACE-002 REFINEMENT / NO ADD; external response PENDING.**

## Purpose

Reproduce the community-supplied stale-token reconnect edge case as the smallest deterministic local HandoffProbe research fixture.

The scenario is:

`token A current → protected action begins → no protected effect → deterministic interruption → server rotates current token to B → same logical action reconnects as attempt 2 with stale token A`

This work tests whether reconnect/resume revalidates current authorization state or incorrectly trusts the pre-interruption authorization snapshot.

## Source provenance

Originating Reddit author:

`u/Signal_Temporary6572`

Direct comment permalink:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakk8w2/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

Canonical comment URL:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakk8w2/

Exact supplied comment text:

> what happens when a client reconnects mid-handoff after a transient network blip and the server already rotated its internal session token but the client still presents the old one, do you treat that as a replay or just a stale auth?

The direct permalink was recorded after the deterministic execution had already been merged and before any public HandoffProbe result-return reply.

That sequencing is recorded explicitly rather than rewriting the historical execution order.

The HandoffProbe reproduction is not external confirmation.

## Baseline

- base commit: `218e50ba4f19b77d8135a6bef2a8f4b8d7d4d248`;
- merged execution commit: `05677e5a00c45bcc20abe06b3622a72d4b7aa43b`;
- execution test: `tests/reddit-r1-token-rotation-execution.test.ts`;
- stable public corpus before and after this research execution: **23 attacks**;
- package version remains `0.4.0`;
- existing stable attack code under `src/` is unchanged.

## Fixture boundary

The fixture is local, deterministic and synthetic.

It reuses HandoffProbe-owned runtime components:

- `EvidenceRecorder`;
- `CrossingEffectRecorder`;
- `callReadInvoiceThroughMcp`.

It does not use a real session provider, real credential, external MCP server or destructive side effect.

Token values are represented only as synthetic generations:

- `A`;
- `B`.

They are not real bearer credentials.

## Deterministic identity

The research fixture keeps constant:

- logical action ID;
- task ID;
- handoff/context ID;
- principal;
- intended downstream MCP operation.

The transport/execution attempt changes from:

- `attempt:R1-ATT-1`
- to `attempt:R1-ATT-2`.

Attempt 1 produces **zero protected effects** before interruption.

That constraint intentionally isolates stale authorization after partial failure from duplicate-effect retry behavior.

## Secure result

Sequence:

1. token generation A is current;
2. A is accepted for the initial authorization snapshot;
3. protected-effect count is still `0`;
4. the connection is deterministically interrupted;
5. server-side current generation changes from A to B;
6. attempt 2 reconnects in the same handoff context presenting A;
7. current authorization is re-evaluated;
8. A is classified as `stale_session`;
9. protected MCP dispatch is blocked.

Observed result:

- initial authorization: `ACCEPT`;
- current authorization after rotation: `REJECT`;
- current reason: `stale_session`;
- MCP tool-call count: `0`;
- fake-tool execution count: `0`;
- protected-effect delta: `0`.

## Intentionally vulnerable result

The same deterministic sequence is used, except the resumed path trusts the authorization snapshot captured before the interruption.

Observed result:

- initial authorization: `ACCEPT`;
- current authorization after rotation: `REJECT`;
- stale current reason: `stale_session`;
- cached pre-interruption authorization reused: yes;
- resumed protected dispatch: yes;
- MCP tool-call count: `1`;
- fake-tool execution count: `1`;
- protected-effect delta: `1`.

This is an intentionally vulnerable local fixture, not a claim about a real MCP implementation.

## Determinism

Both secure and intentionally vulnerable scenarios are executed repeatedly.

The complete returned research summaries must match across repeated runs.

No wall-clock race, sleep or external network dependency is used.

## Overlap / admission

### HP-RACE-002

Final classification:

**REFINEMENT**

The demonstrated invariant is already owned by stable:

`HP-RACE-002 — Partial-failure stale execution`

Its invariant requires a resumed operation to revalidate governing security state that may have changed during an interruption.

Token rotation from A to B is a concrete credential/session-state invalidation mechanism for that existing invariant.

### HP-REPLAY-003

Not governing for the primary R-1 fixture.

`HP-REPLAY-003 — Retry double execution` requires a protected effect to occur before acknowledgement ambiguity and then tests whether retry causes the same logical action to execute a second time.

R-1 deliberately proves:

- protected-effect count before interruption: `0`.

There is therefore no first protected effect to duplicate.

### HP-AUTH-006

Not governing.

`HP-AUTH-006` concerns a later **distinct protected effect** after an earlier protected effect has completed under the same task/context.

R-1 instead resumes the same interrupted logical protected action.

## Final admission decision

Decision: **NO ADD**

- new stable attack ID: **no**;
- stable attack changed: **no**;
- stable corpus: **23 attacks**;
- package version change: **no**;
- release triggered: **no**.

The value of R-1 is a concrete deterministic regression/research variant for the already-stable `HP-RACE-002` invariant.

## Local verification

Execution validation:

- R-1 focused execution: 4/4 tests passed;
- existing P1 race/audit regression passed;
- full repository validation passed;
- 97/97 test files passed;
- 486/486 tests passed;
- TypeScript build passed;
- diff hygiene passed.

Expected rejection stderr from existing Phase 9 negative cases remains normal test behavior.

## Claims and limitations

This result demonstrates only the local synthetic composition invariant described above.

It does not establish:

- an MCP specification vulnerability;
- a vulnerability in a real MCP server/client;
- a requirement that implementations literally use generation labels A/B;
- a normative session-token rotation design;
- production authentication assurance;
- external reproduction or confirmation.

## Public result return — 2026-09-18

The reproducible merged result was returned to the originating Reddit comment:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/

Originating input:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakk8w2/

Merged execution commit:

`05677e5a00c45bcc20abe06b3622a72d4b7aa43b`

The public reply reports the deterministic secure and intentionally vulnerable outcomes, preserves the `HP-RACE-002 REFINEMENT / NO ADD` classification, distinguishes the fixture from `HP-REPLAY-003`, states that the reproduction is local/synthetic, and invites correction or counter-evidence.

## Current external-response state

External response:

**PENDING**

As of this closeout record, no substantive response to the returned result has been recorded.

The HandoffProbe result itself is not external confirmation.

Silence is not agreement or confirmation.

`EVIDENCE.md` records the item as **Open research follow-up**.

No new stable attack is added, the stable public corpus remains **23 attacks**, package version remains `0.4.0`, and no release is triggered.
