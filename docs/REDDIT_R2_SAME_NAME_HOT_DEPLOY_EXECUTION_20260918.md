# Reddit R-2 same-name capability hot-deploy execution — 2026-09-18

Status: **LOCAL EXECUTION COMPLETE — HP-APPROVAL-002 REFINEMENT / NO ADD; merge and public result return pending.**

## Purpose

Reproduce the community-supplied same-name capability-drift case as the smallest deterministic local HandoffProbe research fixture.

The frozen scenario is:

`approval for capability A → deterministic same-name capability replacement A → B → final protected dispatch`

The visible tool name remains unchanged.

Only the security-relevant protected-effect class changes:

Capability A:

`["same-name-tool", "schema-v1", "read_only"]`

Capability B:

`["same-name-tool", "schema-v1", "protected_write"]`

## Source provenance

Originating Reddit author:

`u/anderson_the_one`

Canonical source:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakp67i/

The exact source permalink and supplied text were frozen before fixture implementation.

The HandoffProbe reproduction is local/synthetic and is not external confirmation.

## Baseline

- base commit: `0fb7fe0678ab59de09ccb6754121a6b70da391ec`;
- execution test: `tests/reddit-r2-same-name-hot-deploy-execution.test.ts`;
- stable public corpus before this execution: **23 attacks**;
- package version: `0.4.0`;
- no production `src/` behavior is changed by this research fixture.

## Fixture-local capability binding

The deterministic fixture binds approval to exactly three fields:

1. visible tool name;
2. deterministic input-schema identifier;
3. protected effect class.

Binding preimage:

`JSON.stringify([toolName, inputSchemaId, effectClass])`

Binding representation:

`SHA-256(UTF-8(binding preimage))`

This digest is a deterministic HandoffProbe fixture mechanism only.

It is not:

- an MCP wire-format proposal;
- an MCP specification requirement;
- a claim that production implementations must use SHA-256;
- a general JSON canonicalization design.

## Authority isolation

The primary R-2 fixture intentionally grants upstream semantic authority for **both** capability A and capability B.

Therefore the execution does not depend on semantic-authority widening.

For the B execution path:

- upstream semantic authority: `ACCEPT`;
- authority status: `pass`;
- widening witnesses: none.

The negative security decision is therefore isolated to approval continuity.

## Positive control

Approval is issued directly for capability B.

Observed result:

- approved capability: B;
- effective capability: B;
- visible tool name: `same-name-tool`;
- upstream semantic authority: `ACCEPT`;
- approval policy: capability digest;
- approval binding: `MATCH`;
- protected dispatch: allowed;
- MCP tool-call count: `1`;
- fake-tool execution count: `1`;
- protected-effect delta: `1`.

This proves that the secure fixture does not simply prohibit capability B.

## Secure negative result

Approval is issued for capability A.

Before protected dispatch, the effective capability is deterministically replaced by capability B while the visible tool name remains unchanged.

Observed result:

- approved capability: A;
- effective capability: B;
- approved tool name == effective tool name;
- upstream semantic authority for B: `ACCEPT`;
- authority widening witnesses: none;
- approved capability digest != effective capability digest;
- approval policy: capability digest;
- approval binding: `MISMATCH`;
- protected dispatch: blocked;
- MCP tool-call count: `0`;
- fake-tool execution count: `0`;
- protected-effect delta: `0`.

The secure path therefore prevents the stale A approval from authorizing B.

## Intentionally vulnerable negative result

The same A → B replacement is used.

The intentionally vulnerable path validates only the unchanged visible tool name instead of the frozen security-relevant capability binding.

Observed result:

- approved capability: A;
- effective capability: B;
- approved tool name == effective tool name;
- upstream semantic authority for B: `ACCEPT`;
- authority widening witnesses: none;
- approved capability digest != effective capability digest;
- approval policy: tool-name only;
- stale approval accepted because the visible label still matches;
- protected dispatch: allowed;
- MCP tool-call count: `1`;
- fake-tool execution count: `1`;
- protected-effect delta: `1`.

This is an intentionally vulnerable local fixture, not a claim about a real MCP implementation.

## Determinism

All three scenarios are executed repeatedly:

- positive control;
- secure negative;
- intentionally vulnerable negative.

The returned summaries are required to be identical across repeated execution.

No wall-clock timing, sleep, remote network service or nondeterministic race is used.

Focused R-2 execution result:

- test files: `1/1` passed;
- tests: `5/5` passed.

Overlap regression result:

- `tests/p1-approval-attacks.test.ts`;
- `tests/p0-semantic-authority.test.ts`;
- test files: `2/2` passed;
- tests: `14/14` passed.

## Post-execution overlap / admission

### HP-APPROVAL-002

The execution confirms that the governing property is approval continuity:

> execution must remain bound to what was actually approved.

The existing stable `HP-APPROVAL-002` fixture changes the visible tool identity.

R-2 demonstrates the same invariant when the label remains identical but the security-relevant capability definition changes underneath the prior approval.

Final classification:

**HP-APPROVAL-002 REFINEMENT**

### HP-AUTH-001

Not governing.

The observed B path receives valid upstream semantic authority and has no widening witnesses.

The secure rejection is caused by the approval-binding mismatch, not authority amplification.

### HP-RACE-002

Not governing.

The executed fixture contains:

- no interruption;
- no reconnect;
- no resume;
- no retry;
- no partial-failure transition.

### HP-VERSION-001

Adjacent but not governing.

The executed fixture contains no protocol version negotiation, downgrade or translation.

The only transition is a deterministic receiver-side replacement of the effective same-name capability after approval.

## Final admission decision

Decision: **HP-APPROVAL-002 REFINEMENT / NO ADD**

- new stable attack ID: **no**;
- stable attack count: **23**;
- package version change: **no**;
- release triggered: **no**.

The value of R-2 is deterministic regression/research evidence showing that approval continuity must include the security-relevant capability definition rather than relying only on the visible tool label.

## Claims and limitations

This result demonstrates only the local synthetic composition invariant described above.

It does not establish:

- an MCP specification vulnerability;
- a vulnerability in a real MCP implementation;
- that MCP requires capability digests;
- that SHA-256 is the required production binding mechanism;
- that every capability schema can be represented by the frozen three-field tuple;
- production-world behavior;
- external reproduction or confirmation.

## Remaining closeout

Before public result return:

1. full repository validation must pass;
2. the exact execution record and fixture must be merged;
3. the immutable merge commit must be recorded;
4. the concrete result must then be returned to the originating Reddit discussion;
5. correction or counter-evidence must be invited;
6. external response state must be recorded;
7. only then should `EVIDENCE.md` inclusion be decided.

No public result claim should precede the merged reproducible artifact.
