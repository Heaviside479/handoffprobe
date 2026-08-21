# Threat Model

## Scope

The v0.1 threat model covers a composed workflow where one component delegates via A2A and a downstream agent reaches tools through MCP.

```text
Original actor
    |
    v
A2A caller
    |
    v
A2A receiver / downstream agent
    |
    v
MCP client
    |
    v
MCP server / tool
```

## Security objective

Security intent established upstream should not become broader, ambiguous or reusable in an unauthorized way downstream.

## Trust boundaries

1. original actor -> calling agent
2. A2A caller -> A2A receiver
3. downstream agent -> MCP client
4. MCP client -> MCP server
5. MCP server -> tool/resource

BridgeBreak focuses especially on invariants that can be lost across boundaries 2-4.

## Assets / properties to protect

- principal identity
- agent identity
- delegated authority
- capability/scope limits
- human approval/consent
- target resource binding
- payload limits such as amount or recipient
- credential confidentiality
- nonce/request uniqueness
- expiration
- audit continuity
- execution count / idempotency

## Adversary model for tests

BridgeBreak simulates protocol-level and integration-level manipulation in an authorized test environment. Depending on the test, assume an attacker can influence one or more of:

- downstream message fields
- delegation metadata
- tool selection
- resource identifiers
- payload values
- timing/retries
- stale captured authorization material

The project does not assume compromise of cryptographic primitives.

## Primary failure classes

### Authorization amplification

Downstream receives more capability than upstream granted.

### Identity discontinuity

The original actor or calling agent can no longer be reliably associated with the action.

### Delegation confusion

Authority intended for one delegate, action or resource can be reused by another.

### Approval drift

The action executed differs materially from the action a human or policy approved.

### Replay / stale reuse

Authorization or action material can be reused after consumption or expiry.

### Tool/resource substitution

A valid authorization for one tool or target is accepted for another.

### Credential over-propagation

Secrets or bearer credentials cross a boundary where a narrower delegated representation should have been used.

### Concurrency / duplicate side effect

Race conditions or retries cause a protected action to execute more than allowed.

## Out of scope initially

- model jailbreak quality
- generic prompt injection detection
- malware scanning
- cryptographic algorithm attacks
- network exploitation unrelated to protocol composition
- unauthorized testing of third parties

## Safe-testing assumption

All active tests must run against local fixtures, intentionally vulnerable demos, owned systems or targets for which the operator has explicit authorization.
