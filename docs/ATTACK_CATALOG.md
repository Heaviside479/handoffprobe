# Attack Catalog

This is the security-test backlog for the A2A 1.0 -> MCP 2026-07-28 wedge.

IDs become stable once implemented. Every implemented test must include protocol applicability, property class, source/provenance and evidence requirements.

## Admission rule

A core test must exercise the **composition seam**. Pure A2A or pure MCP conformance checks should remain preflight/supporting checks unless they are necessary to prove an end-to-end composition failure.

## v0.1 P0 — implement first

### BB-AUTH-001 — Delegated authority amplification
Verify that downstream MCP capabilities/actions cannot exceed authority established by the upstream A2A task/delegation.

Property: composition_responsibility / spec-linked where applicable.

### BB-AUTH-002 — Missing scope fails open at bridge
Remove/omit upstream authority metadata and verify bridge translation does not substitute a broader downstream default.

### BB-AUTH-003 — Cross-agent authorization reuse
Attempt to use authority/context bound to Agent A when the downstream bridge is acting for Agent B.

### BB-ID-001 — Original-principal continuity loss
Verify the final MCP action can still be attributed to the original authorized actor when policy requires it.

### BB-ID-002 — Agent identity substitution across translation
Replace the downstream agent identity while preserving other translated context and verify authorization does not silently survive.

### BB-TENANT-001 — Tenant context loss/substitution
Where an A2A interface declares tenant context, verify translation cannot drop/substitute it and reach a broader/different downstream MCP resource set.

### BB-TARGET-001 — Resource substitution
Keep the operation type constant but replace the target resource while reusing the translated authority.

### BB-TARGET-002 — Capability/tool semantic collision
Verify similarly named upstream capability and downstream MCP tool cannot silently map to broader semantics.

### BB-APPROVAL-001 — Security-sensitive payload mutation after consent
Change a protected value (for example amount, recipient or resource) after trusted upstream approval/constraint but before MCP execution.

### BB-CRED-001 — Broad upstream credential propagation
Detect unnecessary forwarding of a broad upstream bearer credential across the bridge instead of preserving/narrowing delegated authority.

### BB-CRED-002 — Cross-audience credential acceptance
Verify a credential/token associated with one upstream/downstream audience/resource cannot be reused against another MCP target through bridge translation.

### BB-LIFECYCLE-001 — Cancellation not propagated
Cancel/terminate the upstream A2A task before the protected MCP side effect completes and verify stale downstream execution does not occur unless explicitly allowed by semantics.

## v0.1 P1 — add after P0 engine is credible

### BB-AUTH-004 — Expired delegation reuse
Attempt an action after upstream delegated authority has expired.

### BB-AUTH-005 — Delegation-chain truncation
Remove an intermediate delegation hop and verify the downstream system does not treat the shortened chain as equivalent where lineage is security-relevant.

### BB-REPLAY-001 — Exact action replay
Replay the same translated authorized action after successful consumption.

### BB-REPLAY-002 — Cross-context / cross-run replay
Reuse captured authority in a new task/run/context. This intentionally avoids the outdated assumption of an MCP protocol session in the 2026-07-28 revision.

### BB-REPLAY-003 — Retry double execution
Simulate network ambiguity/retry and verify a protected side effect is not executed twice.

### BB-APPROVAL-002 — Tool substitution after approval
Approve/authorize one upstream action and attempt a different MCP tool after translation.

### BB-APPROVAL-003 — Approval reuse for another resource
Reuse valid upstream consent against a different downstream target.

### BB-RACE-001 — Parallel one-time authority consumption
Send concurrent attempts that consume the same one-time authority.

### BB-RACE-002 — Partial-failure stale execution
Interrupt between authorization/translation/execution and verify a resumed attempt cannot use stale or ambiguous state.

### BB-AUDIT-001 — Cross-protocol audit lineage break
Verify a protected downstream side effect can be correlated to the original actor, A2A task/delegation and translated MCP request without identity collapse.

## Current-spec seam backlog

These are important 2026-baseline candidates, but should enter v0.1 only if the fixture demonstrates a real composition-specific failure.

### BB-STATE-001 — Explicit state-handle cross-principal reuse
MCP 2026-07-28 is stateless at protocol core, but applications may mint explicit handles. Verify a handle created downstream for one A2A principal/task cannot be reused by another merely because the handle is known.

### BB-CACHE-001 — Private capability cache crosses principal/tenant
Where MCP tool/capability lists are cached, verify a bridge does not reuse a private/broader cached view for a different upstream principal or tenant.

### BB-MRTR-001 — MRTR input response bound to wrong upstream task
Where a downstream MCP operation requests additional input/confirmation, verify the response is bound to the correct A2A task/principal/action.

### BB-MRTR-002 — Delayed MRTR response after upstream cancellation
Verify a delayed input/approval response cannot revive a protected MCP side effect after the governing A2A task has been cancelled or invalidated.

### BB-ROUTING-001 — Bridge-generated MCP routing metadata mismatch
Where the bridge writes both MCP routing headers and body metadata, mutate one side and verify inconsistent method/tool/resource routing is rejected rather than authorizing a different action.

### BB-VERSION-001 — Cross-protocol version downgrade changes security semantics
Negotiate/select an older or unintended A2A/MCP behavior through the bridge and verify security-critical context is not silently lost due to version translation.

### BB-CONTENT-001 — Untrusted A2A artifact causes unauthorized tool/resource selection
Use untrusted A2A content to influence downstream selection and verify it cannot bypass the trusted structured authority/resource constraints. This is a composition-integrity test, not a generic prompt-injection score.

### BB-CARD-001 — Agent Card capability/security translation mismatch
Where bridge behavior is derived from an Agent Card, verify tampered/stale/unverified capability/security metadata cannot cause broader downstream MCP access. Pure signature validation itself remains A2A-level and should not be duplicated without a seam consequence.

## Explicitly delegated to existing tools unless composition-specific

Do not inflate BridgeBreak coverage with standalone checks such as:

- generic Agent Card schema conformance
- generic A2A transport MUST/SHOULD checks
- generic MCP `tools/list` / `tools/call` correctness
- generic MCP server debugging
- generic prompt injection payloads

Use/point to the official A2A TCK/Inspector and MCP Inspector for those jobs.

## Release target

v0.1 must implement at least **12 strong P0 composition tests** with secure/vulnerable fixtures and evidence. Expand toward ~20 only when each additional test has a defensible seam-specific invariant. Quality and reproducibility beat checklist size.
