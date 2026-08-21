# Initial Attack Catalog

This is the v0.1 test backlog. IDs are provisional until implemented, then should remain stable.

## Authorization and delegation

### BB-AUTH-001 — Delegated scope escalation
Verify that downstream MCP capabilities cannot exceed the A2A-delegated scope.

### BB-AUTH-002 — Scope omission fallback
Remove or omit delegated scope metadata and verify the downstream side fails closed rather than granting defaults broader than the caller intended.

### BB-AUTH-003 — Cross-agent authorization reuse
Attempt to use authorization material issued for Agent A from Agent B.

### BB-AUTH-004 — Expired delegation reuse
Attempt an action after delegated authority has expired.

### BB-AUTH-005 — Delegation-chain truncation
Remove an intermediate delegation hop and verify the downstream system does not treat the shortened chain as equivalent.

## Identity

### BB-ID-001 — Original-principal loss
Verify the original actor remains attributable through A2A -> MCP.

### BB-ID-002 — Agent identity substitution
Replace the downstream agent identity while preserving other authorization context.

### BB-ID-003 — Generic-service-account collapse
Detect cases where multiple distinct agent identities become indistinguishable at the tool boundary in a way that defeats authorization/audit expectations.

## Replay and lifecycle

### BB-REPLAY-001 — Exact request replay
Replay the same authorized action after success.

### BB-REPLAY-002 — Cross-session replay
Reuse captured authorization in a later session/context.

### BB-REPLAY-003 — Retry double execution
Simulate network ambiguity/retry and verify a protected side effect is not executed twice.

## Approval / consent integrity

### BB-APPROVAL-001 — Payload mutation after approval
Change a security-sensitive payload value after approval but before tool execution.

### BB-APPROVAL-002 — Tool substitution after approval
Approve one tool/action and attempt another.

### BB-APPROVAL-003 — Approval reuse for another resource
Reuse valid approval against a different target resource.

## Target and namespace binding

### BB-TARGET-001 — Resource substitution
Keep operation type constant but replace the target resource identifier.

### BB-TARGET-002 — Tool namespace confusion
Attempt to resolve a similarly named tool from another namespace/server.

### BB-TARGET-003 — Capability-name collision
Verify identical/similar capability names across layers cannot silently map to broader semantics.

## Credentials

### BB-CRED-001 — Upstream bearer credential propagation
Detect unnecessary forwarding of a broad upstream credential to the downstream MCP boundary.

### BB-CRED-002 — Credential audience mismatch
Verify credentials intended for one audience/server are rejected by another.

## Concurrency and state

### BB-RACE-001 — Parallel authorization consumption
Send concurrent attempts that consume the same one-time authority.

### BB-RACE-002 — State mismatch after partial failure
Interrupt the flow between authorization and execution and verify resumed execution cannot use stale/ambiguous state.

## Initial release target

v0.1 should implement approximately 15-20 tests from this catalog with strong fixtures and evidence rather than shipping a larger shallow checklist.
