# Planned Architecture

## Design goals

- local-first
- deterministic
- modular attack definitions
- reproducible structured evidence
- protocol adapters separated from security rules
- source/version-linked checks
- explicit handoff/translation model
- safe by default
- no cloud dependency
- easy CI use

## Protocol baseline

v0.1 targets:

- A2A 1.0 (HTTP+JSON first)
- MCP 2026-07-28

The architecture must not assume the pre-2026 MCP session model. Cross-run or state-handle concepts must be explicit application state, not an implicit MCP session.

## Proposed high-level modules

```text
CLI
 |
 v
Run Orchestrator
 |-----------------------------------|
 v                                   v
Target / Protocol Adapters           Attack Registry
 |                                   |
 v                                   v
A2A Harness -> Handoff -> MCP Harness Attack Executor
 |                                   |
 |-----------------------------------|
                 v
            Assertions
                 |
                 v
          Evidence Timeline
                 |
                 v
           Findings Model
                 |
          -----------------
          |       |       |
       Terminal  JSON  Markdown
```

The **HandoffAdapter** is a first-class object. HandoffProbe exists to test how intent and security context are translated across this boundary.

## Suggested repository shape

```text
src/
  cli/
  core/
    runner/
    findings/
    evidence/
    assertions/
    safety/
  protocols/
    a2a/
    mcp/
  handoffs/
  attacks/
    authorization/
    identity/
    replay/
    approval/
    substitution/
    state/
    lifecycle/
    audit/
  reporters/
  config/

fixtures/
  secure-a2a-mcp/
  vulnerable-a2a-mcp/

tests/
  unit/
  integration/
  regression/
```

This is a starting design, not a reason to create empty abstractions before they are needed.

## Core domain objects

### AttackDefinition

Should describe at minimum:

- stable `HP-*` ID
- name
- category
- default severity
- priority
- preconditions
- mutation/execution steps
- expected invariant
- evidence requirements
- A2A version applicability
- MCP version applicability
- property class (`spec_required`, `spec_recommended`, `hardening`, `composition_responsibility`)
- source references
- destructive/side-effect flags
- OWASP/CWE mappings when useful

A core `AttackDefinition` must satisfy the handoff-specific admission rule in `PROJECT_CONTEXT.md`.

### TargetAdapter

Abstracts how HandoffProbe sends actions to the target and captures protocol traces. Attack logic should not depend on one SDK implementation where avoidable.

### HandoffAdapter

Represents the A2A -> MCP translation layer under test. It should expose enough structured data to compare upstream security intent with downstream tool execution without requiring framework-specific attack logic.

### SecurityContext

Canonical representation of security intent crossing the boundary, such as:

- original principal
- calling agent
- delegated/downstream agent
- tenant/context identity
- allowed scopes/capabilities
- approved tool/action
- target resource
- security-sensitive payload constraints
- expiry / nonce / request identity
- credential audience
- lifecycle state (active/cancelled/completed)

### EvidenceEvent

Each important boundary observation should be a structured event containing:

- run ID / correlation ID
- timestamp or deterministic sequence number
- protocol and protocol version
- component/side of boundary
- principal/agent identity where observable
- action/tool/resource
- relevant sanitized security context
- request/response hash or fixture reference

Secrets must be redacted before persistence/reporting.

### Finding

Minimum fields:

- test ID
- title
- severity
- status
- property class
- protocol-version applicability
- expected security invariant
- observed behavior
- evidence references
- reproduction metadata
- source references
- remediation guidance where reliable

## Evidence

HandoffProbe should prefer structured evidence over prose. Every failure should make it possible to answer:

1. What security intent existed before the A2A -> MCP handoff?
2. What reached the downstream side?
3. What action was attempted/executed?
4. What translation or lifecycle step changed the invariant?
5. Why does this violate the stated property?
6. Can the same failure be reproduced deterministically?

## Protocol-specific architecture notes

### A2A 1.0

- record selected interface/transport/protocol version
- retain `tenant` context when present
- treat Agent Cards/messages/artifacts as untrusted input
- distinguish signed/verified Agent Card state from unsigned state
- capture relevant authorization/delegation context without persisting secrets

### MCP 2026-07-28

- do not model a hidden protocol session
- capture request-level protocol metadata
- support tests involving header/body routing consistency where the translation layer writes both
- model explicit state handles separately from authorization
- model cache scope only when the tested implementation uses cached capability/tool lists
- model MRTR input/approval lifecycle when a handoff test requires it

## Safe execution model

v0.1 defaults to local fixtures and loopback targets. Fake tools should implement harmless side effects such as incrementing counters or writing temporary fixture state.

If remote target support is introduced later:

- require an explicit opt-in flag/config
- make authorization responsibility visible to the operator
- default destructive tests off
- require a target allowlist or explicit host
- never infer permission to test a third party

## Report stability

Human terminal output may evolve quickly. Once a JSON schema is published, changes should be versioned to avoid breaking CI consumers.
