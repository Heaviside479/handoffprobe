# v0.4.0 attack admission — T-3 research candidates

Status: **ADMISSION DECISION — 2026-09-16**

## Purpose

Evaluate the two T-3.3 `DISTINCT RESEARCH CANDIDATE` results, V3 and V13, against the existing 22 stable HandoffProbe attacks before any stable-ID, attack-count, package-version or release change.

This is an admission decision only. It does not yet add a stable attack, change the CLI execution catalog, change package version `0.3.0`, or authorize publication of `v0.4.0`.

Baseline:

- repository base: `525b5643859b7f07009f5ecb25d34facd272b3d4`;
- stable corpus: **22 attacks**;
- package version: `0.3.0`;
- protocol baseline: **A2A 1.0 → MCP 2026-07-28**;
- T-3 execution evidence: `docs/T3_3_A2A_CONTEXT_BINDING_EXECUTION_20260916.md`;
- T-3 combined closeout: `docs/T3_8_COMBINED_CLOSEOUT_20260916.md`.

## Admission rule

A new stable HandoffProbe attack must represent a defensible handoff/composition failure that is not already measured by an existing stable attack.

A research fixture can justify a new stable attack only when:

1. the negative security failure is distinct from existing stable invariants;
2. the secure and intentionally vulnerable outcomes can be made deterministic;
3. protected-effect evidence distinguishes PASS from FAIL;
4. the attack has a stable handoff-specific invariant rather than only a positive compatibility/control case;
5. source/provenance and claim boundaries remain explicit.

## V3 — task-bound versus context-bound authority

T-3 V3 demonstrated two behaviors:

- a task-bound grant is rejected when used under another task in the same context;
- an explicitly context-bound grant may authorize another task in that same context while the other tested bindings remain unchanged.

### Overlap

The negative security failure is already represented by stable `HP-REPLAY-002 — Cross-context / cross-run replay`.

`HP-REPLAY-002` already defines that authority explicitly bound to one task/run context must not automatically authorize another task/run context. Its deterministic mutation captures authority from task/run A and reuses it under task/run B without issuing a new grant.

V3 adds an important positive semantic distinction: an explicitly context-bound grant is not equivalent to a task-bound grant and must not be rejected merely because the task identifier changes inside the authorized context.

That distinction improves comparison semantics and helps prevent false positives, but it does not by itself define a new vulnerability class beyond the stable task-bound replay failure.

### V3 decision

**NO ADD**

- Do not create a new stable ID for V3.
- Keep the context-bound positive lane as research/compatibility evidence.
- Do not broaden `HP-REPLAY-002` into a claim that all cross-task use is invalid; its existing invariant remains explicitly task/run-bound.
- A future product change may refine binding-scope representation if HandoffProbe gains a public context-bound authority model, but that is separate from this release admission.

## V13 — independent final authorization for multiple effects

T-3 V13 demonstrated two distinct protected-effect attempts under one shared task/context:

1. effect 1 received a final authorization while authority was current and produced exactly one protected effect;
2. authority then became non-current;
3. effect 2, still under the same task/context, received a separate final authorization and was rejected before MCP dispatch/effect.

The security property is that authorization of an earlier effect or of the containing task/plan must not be reused as blanket authorization for a later distinct protected effect after governing authority changes.

### Overlap with existing stable attacks

#### `HP-AUTH-004 — Expired delegation reuse`

`HP-AUTH-004` tests one protected action attempted after a delegation is already expired.

V13 is different: an earlier effect legitimately succeeds first, the containing task remains active, authority changes between effects, and a later distinct effect must be independently re-authorized.

#### `HP-REPLAY-003 — Retry double execution`

`HP-REPLAY-003` tests two attempts representing the same logical action after acknowledgement ambiguity.

V13 is different: the second effect is not a retry of the first logical action and duplicate-effect prevention is not the governing invariant.

#### `HP-RACE-002 — Partial-failure stale execution`

`HP-RACE-002` pauses one protected operation after translation, invalidates authority during the interruption, then resumes that same operation from captured state.

V13 is different: effect 1 has completed normally before authority changes; effect 2 is a later independent protected effect in the same task/context. There is no partial-failure/resume requirement.

#### Other stable attacks

The remaining stable identity, tenant, target, approval, credential, delegation-chain, audit and one-time-consumption attacks do not measure the per-effect current-authorization requirement under a still-live shared task/context.

### V13 decision

**ADMIT FOR STABLE IMPLEMENTATION as `HP-AUTH-006`**

Provisional stable name:

`HP-AUTH-006 — Stale task authorization reused for later effect`

Provisional invariant:

> Successful authorization of an earlier protected effect in a task/context must not authorize a later distinct protected effect after the governing authority becomes non-current; each protected effect must receive a current final authorization before dispatch.

Required deterministic scenario:

1. establish one task/context and valid authority;
2. execute effect A successfully and record exactly one protected effect;
3. keep the same task/context but make the governing authority non-current;
4. attempt distinct effect B;
5. secure fixture re-evaluates current authority and blocks effect B before `mcp.tool.call`;
6. intentionally vulnerable fixture reuses the earlier task-level authorization and executes effect B;
7. PASS requires total protected-effect delta `1`; FAIL requires total protected-effect delta `2`;
8. evidence must prove that effect A and effect B are distinct logical protected effects rather than retry attempts.

Required evidence includes:

- shared task ID and context ID;
- distinct effect/action identities;
- authority state at each final authorization point;
- final authorization decision per effect;
- exact request evaluated immediately before dispatch;
- `mcp.tool.call` evidence per effect;
- protected fake-effect counter before, after effect A and after effect B.

## Release implication

This admission decision does **not** yet change the stable corpus.

Current state remains:

- stable attacks: **22**;
- package version: `0.3.0`;
- `HP-AUTH-006`: admitted for implementation, not yet stable;
- `v0.4.0`: candidate release only.

If `HP-AUTH-006` is implemented with secure/vulnerable deterministic fixtures, included in the public execution catalog, covered by the normal full repository/release gates and then merged, the stable corpus may become **23 attacks** and the additive public capability can justify the planned pre-1.0 minor release `0.4.0`.

No version bump, tag or npm publication occurs before that implementation and release gate succeeds.

## Next step

Implement only `HP-AUTH-006` from this admission.

Do not create a V3 stable ID in the same implementation.
