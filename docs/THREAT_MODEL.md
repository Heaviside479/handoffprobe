# Threat Model

## Scope

The v0.1 threat model covers a composed workflow where one component delegates via A2A 1.0 and a downstream agent reaches tools through MCP 2026-07-28.

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
Bridge / translation logic
    |
    v
MCP client
    |
    v
MCP server / tool
```

The bridge/glue code is a first-class trust boundary, not invisible plumbing.

## Security objective

Security intent established upstream should not become broader, ambiguous, transferable or reusable in an unauthorized way downstream.

A useful invariant is **authority monotonicity**: delegation/translation may preserve or reduce authority, but should not silently increase it.

## Trust boundaries

1. original actor -> calling agent
2. A2A caller -> A2A receiver
3. A2A receiver -> bridge/translation logic
4. bridge -> MCP client/request
5. MCP client -> MCP server
6. MCP server -> tool/resource

BridgeBreak focuses especially on properties that can be lost across boundaries 2-5.

## Assets / properties to protect

- principal identity
- agent identity
- tenant/context identity
- delegated authority
- capability/scope limits
- human approval/consent
- target resource binding
- tool/capability semantic binding
- payload limits such as amount or recipient
- credential confidentiality and audience
- nonce/request uniqueness
- expiration
- cancellation/lifecycle state
- state-handle ownership
- cache isolation
- audit lineage
- execution count / idempotency

## Composition-responsibility gap

Some end-to-end properties may not be assigned cleanly to either protocol. A2A can be correct about delegation and MCP can be correct about tool invocation while the bridge still maps them unsafely.

BridgeBreak treats these as `composition_responsibility` findings rather than falsely labeling every issue as protocol non-conformance.

## Adversary model for tests

BridgeBreak simulates protocol-level and integration-level manipulation in an authorized test environment. Depending on the test, assume an attacker or faulty bridge can influence one or more of:

- downstream message fields
- delegation metadata
- agent/tenant context
- tool selection or capability translation
- resource identifiers
- payload values
- timing/retries/cancellation
- stale captured authorization material
- explicit state handles
- cached tool/capability views
- selected protocol/interface version

The project does not assume compromise of cryptographic primitives.

## Primary failure classes

### Authorization amplification

Downstream receives more capability than upstream granted.

### Identity / tenant discontinuity

The original actor, calling agent or tenant can no longer be reliably associated with the action.

### Delegation confusion

Authority intended for one delegate, action or resource can be reused by another.

### Approval drift

The action executed differs materially from the action a human or policy approved.

### Replay / stale reuse

Authorization or action material can be reused after consumption, cancellation, completion or expiry.

### Tool/resource substitution

A valid authorization for one tool, semantic capability or target is accepted for another.

### Credential over-propagation

Broad upstream bearer credentials cross into MCP when a narrower delegated representation should have been used, or a token crosses audience/resource boundaries.

### State-handle confusion

An explicit state handle created for one principal/task is accepted for another, or possession of the handle is incorrectly treated as authorization.

### Cache-context confusion

A cached downstream capability/tool view from one caller/tenant is reused for another in a way that broadens authority or leaks private capability data.

### Lifecycle / cancellation drift

An upstream A2A task is cancelled or changes state but a downstream MCP action executes later using stale intent.

### Concurrency / duplicate side effect

Race conditions or retries cause a protected action to execute more than allowed.

### Audit lineage loss

The final side effect cannot be linked back to the original actor/delegation/request with enough fidelity to explain who authorized what.

## A2A-specific seam concerns

Relevant A2A 1.0 properties include:

- Agent Card interface/security declarations and optional JWS signatures
- protocol-version/interface selection
- tenant propagation
- per-operation authorization boundaries
- handling of credentials or sensitive material across delegated agent chains
- treating external Agent Cards/messages/artifacts as untrusted input

BridgeBreak should test these only when they affect the A2A -> MCP composition, rather than duplicating A2A TCK coverage.

## MCP-specific seam concerns

Relevant MCP 2026-07-28 properties include:

- request-level stateless behavior (avoid outdated hidden-session assumptions)
- token audience/resource and issuer binding
- prohibition/avoidance of broad token passthrough
- state-handle binding independent of authorization
- header/body routing consistency when bridges construct requests
- private/public cache scope and stale capability views
- MRTR input/approval binding

BridgeBreak should test these only where upstream A2A context is translated into those mechanisms.

## Semantic untrusted-input boundary

Generic prompt-injection detection remains out of scope. However, BridgeBreak may test a structured end-to-end invariant when untrusted A2A content/artifacts cause the bridge to select or authorize a different MCP tool/resource than the trusted upstream policy allowed. The focus is the security-property change, not model jailbreak quality.

## Out of scope initially

- generic model jailbreak quality
- generic prompt injection detection
- malware scanning
- cryptographic algorithm attacks
- generic A2A conformance
- generic MCP server vulnerability scanning
- network exploitation unrelated to protocol composition
- unauthorized testing of third parties

## Safe-testing assumption

All active tests must run against local fixtures, intentionally vulnerable demos, owned systems or targets for which the operator has explicit authorization. v0.1 should use harmless fake tools and synthetic data by default.
