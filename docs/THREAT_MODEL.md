# Threat Model

## Scope

This threat model describes the current verified HandoffProbe public product boundary: `handoffprobe@0.4.0`, with 23 stable attacks across the A2A 1.0 -> MCP 2026-07-28 composition wedge.

The current stable corpus consists of 12 P0 attacks, 10 P1 attacks and one advanced stable attack, `HP-AUTH-006`. Node.js `>=24 <25`, config schema `1` and report schema `1` remain the current public baseline.

Research records and backlog candidates may describe additional threat classes without making those classes stable product coverage.

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
Handoff / translation logic
    |
    v
MCP client
    |
    v
MCP server / tool
```

The handoff/glue code is a first-class trust boundary, not invisible plumbing.

## Security objective

Security intent established upstream should not become broader, ambiguous, transferable or reusable in an unauthorized way downstream.

A useful invariant is **authority monotonicity**: delegation/translation may preserve or reduce authority, but should not silently increase it.

## Trust boundaries

1. original actor -> calling agent
2. A2A caller -> A2A receiver
3. A2A receiver -> handoff/translation logic
4. handoff -> MCP client/request
5. MCP client -> MCP server
6. MCP server -> tool/resource

HandoffProbe focuses especially on properties that can be lost across boundaries 2-5.

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

Some end-to-end properties may not be assigned cleanly to either protocol. A2A can be correct about delegation and MCP can be correct about tool invocation while the handoff still maps them unsafely.

HandoffProbe treats these as `composition_responsibility` findings rather than falsely labeling every issue as protocol non-conformance.

## Adversary model for tests

HandoffProbe simulates protocol-level and integration-level manipulation in an authorized test environment. Depending on the test, assume an attacker or faulty translation layer can influence one or more of:

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

## Current stable coverage

The current stable corpus is intentionally narrower than the complete threat model.

| Handoff property                                                               | Current stable IDs                                                     | State                    |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------ |
| Authorization continuity and freshness                                         | `HP-AUTH-001` through `HP-AUTH-006`                                    | Stable                   |
| Identity and tenant continuity                                                 | `HP-ID-001`, `HP-ID-002`, `HP-TENANT-001`                              | Stable                   |
| Target and tool binding                                                        | `HP-TARGET-001`, `HP-TARGET-002`, `HP-APPROVAL-002`, `HP-APPROVAL-003` | Stable                   |
| Approved payload integrity                                                     | `HP-APPROVAL-001`                                                      | Stable                   |
| Credential propagation and audience                                            | `HP-CRED-001`, `HP-CRED-002`                                           | Stable                   |
| Replay and retry behavior                                                      | `HP-REPLAY-001`, `HP-REPLAY-002`, `HP-REPLAY-003`                      | Stable                   |
| Lifecycle and concurrency                                                      | `HP-LIFECYCLE-001`, `HP-RACE-001`, `HP-RACE-002`                       | Stable                   |
| Audit lineage                                                                  | `HP-AUDIT-001`                                                         | Stable                   |
| State handle, cache, MRTR, routing, version, content and Agent Card candidates | No stable ID currently admitted                                        | Research or backlog only |

The rows above account for the current 23 stable attacks. Threat classes outside those rows remain research or backlog unless they pass the normal evidence-backed admission process.

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

## A2A-specific handoff concerns

Relevant A2A 1.0 properties include:

- Agent Card interface/security declarations and optional JWS signatures
- protocol-version/interface selection
- tenant propagation
- per-operation authorization boundaries
- handling of credentials or sensitive material across delegated agent chains
- treating external Agent Cards/messages/artifacts as untrusted input

HandoffProbe should test these only when they affect the A2A -> MCP handoff, rather than duplicating A2A TCK coverage.

## MCP-specific handoff concerns

Relevant MCP 2026-07-28 properties include:

- request-level stateless behavior (avoid outdated hidden-session assumptions)
- token audience/resource and issuer binding
- prohibition/avoidance of broad token passthrough
- state-handle binding independent of authorization
- header/body routing consistency when handoff logic constructs requests
- private/public cache scope and stale capability views
- MRTR input/approval binding

HandoffProbe should test these only where upstream A2A context is translated into those mechanisms.

## Semantic untrusted-input boundary

Generic prompt-injection detection remains out of scope. However, HandoffProbe may test a structured end-to-end invariant when untrusted A2A content/artifacts cause the handoff layer to select or authorize a different MCP tool/resource than the trusted upstream policy allowed. The focus is the security-property change, not model jailbreak quality.

## Execution integrity vs authorization continuity

A downstream execution proof and an upstream authorization binding answer different security questions.

An execution-integrity mechanism may establish that a particular program ran on particular committed inputs and produced a particular output. That evidence does not, by itself, establish that those inputs were authorized by the original actor, caller, delegation or approval in the current execution context.

For composed A2A → MCP workflows, HandoffProbe therefore keeps at least these properties distinct:

- **computation integrity** — did the pinned computation run on the committed inputs and produce the committed output?
- **input truth/provenance** — are the supplied inputs themselves authentic or supported by trusted provenance?
- **program validity/policy suitability** — is the identified computation actually the computation policy intended to authorize or rely on?
- **input authorization continuity** — were these exact downstream inputs within the authority carried from the upstream caller/delegation/approval?

A schema-valid but semantically widened downstream MCP request may satisfy an execution proof while still violating authority monotonicity. In such a case, proof verification succeeding must not override a separate handoff/authority rejection.

External design discussion motivating this explicit boundary:
`https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5715753995`.

This records a composition-security boundary, not a claim that the Verifiable MCP proposal, MCP itself or another project is vulnerable or non-conformant.

## Current product limitations

The threat model may intentionally describe threat classes that are broader than the current stable corpus. Their presence here does not imply stable product support.

HandoffProbe is not a generic A2A conformance suite, generic MCP vulnerability scanner, generic prompt-injection product, production authorization provider, runtime firewall or security certification.

Current user-facing support boundaries and non-claims are defined in `docs/LIMITATIONS.md`.

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

All active tests must run against bundled or local fixtures, intentionally vulnerable demos, owned systems or targets for which the operator has explicit authorization. The current public Core defaults to harmless synthetic fixtures and synthetic effects. It does not grant or imply permission to scan arbitrary third-party systems.
