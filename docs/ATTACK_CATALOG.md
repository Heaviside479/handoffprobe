# Attack Catalog

This is the security-test backlog for the A2A 1.0 -> MCP 2026-07-28 handoff wedge.

IDs become stable once implemented. Every implemented test must include protocol applicability, property class, source/provenance and evidence requirements.

## Admission rule

A core test must exercise the **handoff/composition boundary**. Pure A2A or pure MCP conformance checks should remain preflight/supporting checks unless they are necessary to prove an end-to-end handoff failure.

## v0.1 P0 — implement first

### HP-AUTH-001 — Delegated authority amplification

Verify that downstream MCP capabilities/actions cannot exceed authority established by the upstream A2A task/delegation.

Property: composition_responsibility / spec-linked where applicable.

### HP-AUTH-002 — Missing scope fails open at handoff

Remove/omit upstream authority metadata and verify translation does not substitute a broader downstream default.

### HP-AUTH-003 — Cross-agent authorization reuse

Attempt to use authority/context bound to Agent A when the downstream handoff is acting for Agent B.

### HP-ID-001 — Original-principal continuity loss

Verify the final MCP action can still be attributed to the original authorized actor when policy requires it.

### HP-ID-002 — Agent identity substitution across translation

Replace the downstream agent identity while preserving other translated context and verify authorization does not silently survive.

### HP-TENANT-001 — Tenant context loss/substitution

Where an A2A interface declares tenant context, verify translation cannot drop/substitute it and reach a broader/different downstream MCP resource set.

### HP-TARGET-001 — Resource substitution

Keep the operation type constant but replace the target resource while reusing translated authority.

### HP-TARGET-002 — Capability/tool semantic collision

Verify similarly named upstream capability and downstream MCP tool cannot silently map to broader semantics.

### HP-APPROVAL-001 — Security-sensitive payload mutation after consent

Change a protected value (for example amount, recipient or resource) after trusted upstream approval/constraint but before MCP execution.

### HP-CRED-001 — Broad upstream credential propagation

Detect unnecessary forwarding of a broad upstream bearer credential across the handoff instead of preserving/narrowing delegated authority.

### HP-CRED-002 — Cross-audience credential acceptance

Verify a credential/token associated with one upstream/downstream audience/resource cannot be reused against another MCP target through translation.

### HP-LIFECYCLE-001 — Cancellation not propagated

Cancel/terminate the upstream A2A task before the protected MCP side effect completes and verify stale downstream execution does not occur unless explicitly allowed by semantics.

## v0.1 P1 — add after P0 engine is credible

Implementation contract:

`docs/P1_TEST_SPECIFICATION.md`

The ten IDs in this section form the locked first Phase 4 P1 corpus.

Implementation status as of 2026-08-25:

- 10 / 10 locked P1 attacks implemented
- all ten IDs are now stable
- secure and intentionally vulnerable synthetic fixtures are covered
- final Phase 4 completion remains gated on branch-wide QA, PR CI and merge

### HP-AUTH-004 — Expired delegation reuse

Attempt an action after upstream delegated authority has expired.

### HP-AUTH-005 — Delegation-chain truncation

Remove an intermediate delegation hop and verify the downstream system does not treat the shortened chain as equivalent where lineage is security-relevant.

### HP-REPLAY-001 — Exact action replay

Replay the same translated authorized action after successful consumption.

### HP-REPLAY-002 — Cross-context / cross-run replay

Reuse captured authority in a new task/run/context. This intentionally avoids the outdated assumption of an MCP protocol session in the 2026-07-28 revision.

### HP-REPLAY-003 — Retry double execution

Simulate network ambiguity/retry and verify a protected side effect is not executed twice.

### HP-APPROVAL-002 — Tool substitution after approval

Approve/authorize one upstream action and attempt a different MCP tool after translation.

### HP-APPROVAL-003 — Approval reuse for another resource

Reuse valid upstream consent against a different downstream target.

### HP-RACE-001 — Parallel one-time authority consumption

Send concurrent attempts that consume the same one-time authority.

### HP-RACE-002 — Partial-failure stale execution

Interrupt between authorization/translation/execution and verify a resumed attempt cannot use stale or ambiguous state.

### HP-AUDIT-001 — Cross-protocol audit lineage break

Verify a protected downstream side effect can be correlated to the original actor, A2A task/delegation and translated MCP request without identity collapse.

## Current-spec handoff backlog

These are important 2026-baseline candidates, but should enter v0.1 only if the fixture demonstrates a real handoff-specific failure.

### HP-STATE-001 — Explicit state-handle cross-principal reuse

MCP 2026-07-28 is stateless at protocol core, but applications may mint explicit handles. Verify a handle created downstream for one A2A principal/task cannot be reused by another merely because the handle is known.

### HP-CACHE-001 — Private capability cache crosses principal/tenant

Where MCP tool/capability lists are cached, verify the handoff layer does not reuse a private/broader cached view for a different upstream principal or tenant.

### HP-MRTR-001 — MRTR input response bound to wrong upstream task

Where a downstream MCP operation requests additional input/confirmation, verify the response is bound to the correct A2A task/principal/action.

### HP-MRTR-002 — Delayed MRTR response after upstream cancellation

Verify a delayed input/approval response cannot revive a protected MCP side effect after the governing A2A task has been cancelled or invalidated.

### HP-ROUTING-001 — Handoff-generated MCP routing metadata mismatch

Where the translation layer writes both MCP routing headers and body metadata, mutate one side and verify inconsistent method/tool/resource routing is rejected rather than authorizing a different action.

### HP-VERSION-001 — Cross-protocol version downgrade changes security semantics

Negotiate/select an older or unintended A2A/MCP behavior through the handoff and verify security-critical context is not silently lost due to version translation.

### HP-CONTENT-001 — Untrusted A2A artifact causes unauthorized tool/resource selection

Use untrusted A2A content to influence downstream selection and verify it cannot bypass trusted structured authority/resource constraints. This is a handoff-integrity test, not a generic prompt-injection score.

### HP-CARD-001 — Agent Card capability/security translation mismatch

Where handoff behavior is derived from an Agent Card, verify tampered/stale/unverified capability/security metadata cannot cause broader downstream MCP access. Pure signature validation itself remains A2A-level and should not be duplicated without a handoff consequence.

## Explicitly delegated to existing tools unless handoff-specific

Do not inflate HandoffProbe coverage with standalone checks such as:

- generic Agent Card schema conformance
- generic A2A transport MUST/SHOULD checks
- generic MCP `tools/list` / `tools/call` correctness
- generic MCP server debugging
- generic prompt injection payloads

Use/point to the official A2A TCK/Inspector and MCP Inspector for those jobs.

## Release target

v0.1 must implement at least **12 strong P0 handoff tests** with secure/vulnerable fixtures and evidence. Expand toward ~20 only when each additional test has a defensible handoff-specific invariant. Quality and reproducibility beat checklist size.
