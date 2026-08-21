# Planned Architecture

## Design goals

- local-first
- deterministic
- modular attack definitions
- reproducible evidence
- protocol adapters separated from security rules
- no cloud dependency
- easy CI use

## Proposed high-level modules

```text
CLI
 |
 v
Run Orchestrator
 |---------------------------|
 v                           v
Target/Protocol Adapters     Attack Registry
 |                           |
 v                           v
A2A Harness -> MCP Harness   Attack Executor
 |                           |
 |---------------------------|
             v
         Assertions
             |
             v
        Findings Model
             |
      -----------------
      |       |       |
   Terminal  JSON  Markdown
```

## Suggested repository shape

```text
src/
  cli/
  core/
    runner/
    findings/
    evidence/
    assertions/
  protocols/
    a2a/
    mcp/
  attacks/
    authorization/
    identity/
    replay/
    approval/
    substitution/
    concurrency/
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

Should describe:

- stable ID
- name
- category
- severity default
- preconditions
- mutation/execution steps
- expected invariant
- evidence requirements

### TargetAdapter

Abstracts how BridgeBreak sends actions to the target and captures protocol traces. Attack logic should not depend on one SDK implementation where avoidable.

### SecurityContext

Canonical representation of the security intent crossing the boundary, such as:

- principal / original actor
- calling agent
- delegated agent
- allowed scopes/capabilities
- approved tool/action
- target resource
- important payload constraints
- expiry / nonce / request identity

### Finding

Minimum fields:

- test ID
- title
- severity
- status
- expected security invariant
- observed behavior
- evidence
- reproduction metadata
- remediation guidance where reliable

## Evidence

BridgeBreak should prefer structured evidence over prose. Every failure should make it possible to answer:

1. What security context existed before the boundary?
2. What reached the downstream side?
3. What action was attempted/executed?
4. Why does this violate the invariant?

## Report stability

Human terminal output may evolve quickly. Once a JSON schema is published, changes should be versioned to avoid breaking CI consumers.
