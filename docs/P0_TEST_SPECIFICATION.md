# HandoffProbe v0.1 — P0 Security Test Specification

Status: implementation contract

This document defines the twelve mandatory security tests for HandoffProbe
v0.1.

A test is not complete because code exists.

A test is complete only when it can deterministically demonstrate whether its
end-to-end handoff invariant held.

---

# 1. Shared reference fixture

## Principal

Authorized user:

`user:alice`

## Agents

Calling agent:

`agent:sales`

Authorized downstream agent:

`agent:billing`

Alternate unauthorized agent:

`agent:support`

## Tenants

Authorized tenant:

`tenant:acme`

Alternate tenant:

`tenant:globex`

## Resources

Authorized invoice:

`invoice:INV-1001`

Alternate invoice:

`invoice:INV-2002`

## Capabilities

Read:

`invoice.read`

Write:

`invoice.update`

Synthetic refund:

`payment.refund`

## Fake MCP tools

### read_invoice

Reads synthetic local fixture data.

### update_invoice

Modifies only local/in-memory fixture data.

### refund_payment

Writes only to a synthetic refund ledger.

No real payment provider is contacted.

### send_email

Writes only to a synthetic outbox.

No real email is sent.

---

# 2. Required evidence contract

Every P0 test must capture enough structured evidence to reconstruct the
security decision.

Minimum evidence:

- run ID
- test ID
- sequence/event number
- protocol
- protocol version
- boundary/component
- upstream principal
- calling agent
- downstream agent
- tenant where applicable
- upstream authority
- translated authority
- requested capability
- selected MCP tool
- target resource
- authorization result
- synthetic side-effect state before execution
- synthetic side-effect state after execution
- final finding status
- relevant source/provenance metadata

Secrets must never be stored raw.

Credential evidence must use sanitized metadata or fingerprints.

---

# 3. Result semantics

## PASS

The intended attack/mutation was executed and the invariant remained intact.

## FAIL

The attack/mutation was executed and the security invariant was reproducibly
violated.

## NOT_APPLICABLE

The required feature or precondition is absent.

## INCONCLUSIVE

The attack ran, but available evidence cannot prove PASS or FAIL.

## ERROR

HandoffProbe itself could not execute or observe the test correctly.

An ERROR must never be reported as a vulnerability.

---

# HP-AUTH-001 — Delegated authority amplification

## Objective

Detect authority becoming broader during A2A → MCP translation.

## Invariant

Downstream effective authority must not exceed upstream delegated authority.

## Baseline

Upstream delegation:

`invoice.read`

Target:

`invoice:INV-1001`

## Mutation

Attempt to translate the read-only grant into:

`invoice.update`

or the MCP tool:

`update_invoice`

## PASS

The mutation is rejected.

The invoice remains unchanged.

## FAIL

The downstream system performs a protected mutation without receiving a new
valid grant.

## Evidence

- upstream authority
- translated authority
- selected MCP tool
- authorization result
- resource state before
- resource state after

## Default severity

HIGH

---

# HP-AUTH-002 — Missing authority fails open

## Objective

Detect unsafe defaults when upstream authority metadata disappears.

## Invariant

Missing authority must not become broader authority.

## Mutation

Remove authority/scope metadata immediately before handoff translation.

## PASS

The protected action is rejected or translated to no effective authority.

## FAIL

The handoff layer substitutes:

- wildcard authority
- write authority
- administrative authority
- another broader default

and the protected action becomes executable.

## Evidence

- absence of upstream authority
- fallback behavior
- translated authority
- selected tool
- authorization result
- side effect

## Default severity

HIGH

---

# HP-AUTH-003 — Cross-agent authorization reuse

## Objective

Detect authorization reuse by another downstream agent.

## Invariant

Authority delegated to one agent must not automatically authorize another.

## Baseline

Authorized delegate:

`agent:billing`

## Mutation

Replace it with:

`agent:support`

while reusing the original authorization context.

## PASS

Authorization is rejected or a new valid grant is required.

## FAIL

`agent:support` performs the protected action using authority originally issued
for `agent:billing`.

## Evidence

- authorized delegate
- actual delegate
- authorization binding
- selected action
- side effect

## Default severity

HIGH

---

# HP-ID-001 — Original principal continuity loss

## Objective

Detect loss of the original user identity where authorization depends on it.

## Invariant

Protected actions requiring principal-bound policy must remain attributable to
the original principal.

## Baseline

Original principal:

`user:alice`

## Mutation

Drop original-principal information during the handoff while leaving only a
generic service or agent identity.

## PASS

The action is rejected, or an explicit approved representation of the original
principal remains available.

## FAIL

A protected action executes under a generic identity in a way that bypasses
principal-bound policy.

## Evidence

- original principal
- downstream identity
- authorization decision
- protected action
- side effect

## Default severity

MEDIUM

Raise to HIGH when the fixture proves meaningful authorization bypass.

---

# HP-ID-002 — Agent identity substitution

## Objective

Detect authorization surviving an unauthorized change in agent identity.

## Invariant

Identity-bound authority must not survive replacement of the authorized agent.

## Mutation

Change:

`agent:billing`

to:

`agent:support`

after delegation acceptance.

## PASS

The mismatch is rejected.

## FAIL

The protected action executes with the substituted identity while relying on
the old authorization.

## Evidence

- expected agent
- actual agent
- authority binding
- tool invocation
- result

## Default severity

HIGH

---

# HP-TENANT-001 — Tenant context loss or substitution

## Objective

Detect cross-tenant authority leakage.

## Invariant

Authority from one tenant must not authorize another tenant.

## Baseline

Authorized:

`tenant:acme`

Unauthorized:

`tenant:globex`

## Mutation A

Drop tenant context.

## Mutation B

Replace Acme with Globex.

## PASS

Globex resources remain inaccessible.

## FAIL

Authority originating in Acme accesses or mutates a Globex resource.

## Evidence

- upstream tenant
- translated tenant
- requested resource
- authorization result
- resulting resource data/state

## Default severity

CRITICAL when actual cross-tenant protected access is demonstrated.

Otherwise HIGH.

---

# HP-TARGET-001 — Resource substitution

## Objective

Detect authority moving from one resource to another.

## Invariant

Authority for resource A must not automatically authorize resource B.

## Baseline

Authorized resource:

`invoice:INV-1001`

## Mutation

Replace target with:

`invoice:INV-2002`

without replacing the grant.

## PASS

Access to INV-2002 is rejected.

## FAIL

The original grant successfully accesses or changes INV-2002.

## Evidence

- granted resource
- requested resource
- translated resource
- authorization result
- resource state/result

## Default severity

HIGH

---

# HP-TARGET-002 — Capability/tool semantic collision

## Objective

Detect unsafe mapping between similar but semantically different capabilities.

## Invariant

A narrow upstream capability must not map to a broader MCP tool merely because
their names/descriptions are similar.

## Baseline

Upstream:

`invoice.read`

## Mutation

Map the request to:

`update_invoice`

## PASS

Semantic mismatch is rejected.

## FAIL

The broader tool executes under the narrow read grant.

## Evidence

- upstream capability
- downstream tool
- translation mapping
- authority
- side effect

## Default severity

HIGH

---

# HP-APPROVAL-001 — Payload mutation after consent

## Objective

Detect approved action parameters changing before execution.

## Invariant

Security-sensitive fields covered by approval must remain bound to the executed
action.

## Baseline

Approved synthetic refund:

amount:

`20`

recipient:

`acct:A`

## Mutation A

Change amount:

`20 → 200`

## Mutation B

Change recipient:

`acct:A → acct:B`

after approval and before MCP execution.

## PASS

The changed request is rejected or requires new matching approval.

## FAIL

The synthetic refund executes with changed protected fields using the original
approval.

## Evidence

- approved payload
- approved payload hash
- approval identifier
- executed payload
- synthetic ledger before
- synthetic ledger after

## Default severity

HIGH

---

# HP-CRED-001 — Broad upstream credential propagation

## Objective

Detect unnecessary forwarding of broad credentials across the handoff.

## Invariant

A broad upstream credential must not cross into MCP when fixture policy expects
narrow delegated authority instead.

## Mutation

Configure the vulnerable handoff to forward the upstream bearer credential to
the MCP side.

## PASS

The broad credential never becomes visible to the MCP server/tool.

## FAIL

The downstream side receives the broad credential contrary to the configured
security contract.

## Evidence

Never record the raw token.

Record only:

- credential fingerprint
- credential class
- original audience
- downstream audience
- forwarding decision

## Default severity

MEDIUM

Raise to HIGH when actionable authority is demonstrated.

---

# HP-CRED-002 — Cross-audience credential acceptance

## Objective

Detect bearer authority crossing an audience/resource boundary.

## Invariant

A credential intended for one audience must not authorize another.

## Baseline

Expected audience:

`mcp://billing`

## Mutation

Reuse the credential against another synthetic MCP audience or resource.

## PASS

Audience/resource mismatch is rejected.

## FAIL

The unintended target accepts and authorizes the credential.

## Evidence

- credential fingerprint
- expected audience
- actual audience
- target resource
- authorization result

## Default severity

HIGH

---

# HP-LIFECYCLE-001 — Cancellation not propagated

## Objective

Detect stale downstream execution after the governing upstream task has been
cancelled.

## Invariant

Cancellation of the governing upstream task must prevent the protected
downstream side effect unless semantics explicitly permit completion.

## Baseline

1. A2A task starts.
2. Downstream operation begins.
3. Protected side effect is intentionally delayed.

## Mutation

Cancel the A2A task before the delayed MCP side effect.

## PASS

The side effect never occurs.

## FAIL

The protected side effect executes after cancellation using stale authority or
intent.

## Evidence

- task ID
- start event
- downstream request event
- cancellation event
- side-effect event
- deterministic ordering
- side-effect counter before/after

## Default severity

HIGH

---

# 4. P0 release acceptance gate

HandoffProbe v0.1 must not ship until all of the following are true:

- all 12 P0 tests are implemented
- all tests have stable `HP-*` IDs
- all tests run deterministically
- secure fixture passes every applicable P0 test
- vulnerable fixture fails exactly where designed
- each FAIL carries sufficient reproducible evidence
- runner ERROR cannot masquerade as FAIL
- every test records protocol applicability
- every test records provenance/source metadata
- raw secrets never appear in evidence
- bundled fixtures cannot create real external side effects
- all tests are runnable without a paid AI service

The required P0 set is:

1. HP-AUTH-001
2. HP-AUTH-002
3. HP-AUTH-003
4. HP-ID-001
5. HP-ID-002
6. HP-TENANT-001
7. HP-TARGET-001
8. HP-TARGET-002
9. HP-APPROVAL-001
10. HP-CRED-001
11. HP-CRED-002
12. HP-LIFECYCLE-001
