# HandoffProbe v0.1 — P1 Security Test Specification

Status: implemented on Phase 4 feature branch; final PR/CI/merge gate pending

This document defines the ten advanced P1 handoff security tests admitted
after completion of the mandatory P0 corpus.

P1 does not expand HandoffProbe into a generic protocol scanner.

Every P1 test must demonstrate a security invariant that exists specifically
because authority, identity, consent, state or execution crosses an
A2A 1.0 → MCP 2026-07-28 composition boundary.

A test is complete only when secure and intentionally vulnerable fixtures
produce deterministic, evidence-backed outcomes.

---

# 1. Shared P1 fixture contract

P1 extends the existing Phase 3 synthetic fixture.

The existing canonical identities remain:

- principal: `user:alice`
- calling agent: `agent:sales`
- authorized downstream agent: `agent:billing`
- unauthorized downstream agent: `agent:support`
- tenant: `tenant:acme`
- alternate tenant: `tenant:globex`
- authorized resource: `invoice:INV-1001`
- alternate resource: `invoice:INV-2002`

Existing synthetic tools remain:

- `read_invoice`
- `update_invoice`
- `refund_payment`
- `send_email`

No bundled P1 test may contact a real payment provider, email service,
external database or third-party API.

## Additional deterministic P1 concepts

P1 fixtures may introduce the following synthetic metadata where required:

### Delegation identity

A stable delegation identifier, for example:

`delegation:DEL-1001`

### Delegation chain

A deterministic ordered chain such as:

`user:alice → agent:sales → agent:billing`

Intermediate hops must be explicit when a test depends on lineage.

### Delegation validity

Synthetic validity metadata may include:

- issued sequence/time
- expiry sequence/time
- consumed state
- invalidated state

Tests must use deterministic logical time or a controlled clock.

Wall-clock races are not sufficient evidence.

### Action identity

Protected actions that may be replayed or retried require a stable logical
action identifier, for example:

`action:ACT-1001`

### Attempt identity

Individual transport/execution attempts may additionally use:

- `attempt:ATT-1`
- `attempt:ATT-2`

A retry is not a new logical action merely because it is a new attempt.

### One-time authority

Where applicable, authority may be marked:

`singleUse: true`

and must expose deterministic consumption state.

### Audit lineage

Protected execution evidence must be able to correlate:

- original principal
- A2A task
- delegation / delegation chain
- handoff translation
- downstream MCP request
- selected tool
- resource
- protected side effect

A synthetic correlation identifier may be used to prove continuity.

---

# 2. Required evidence contract

Every P1 test inherits the P0 evidence contract.

Where applicable, P1 evidence additionally includes:

- delegation ID
- delegation chain
- delegation validity / expiry state
- logical action ID
- execution attempt ID
- consumption state before/after
- replay/retry classification
- approval ID
- approved tool
- approved resource
- interruption point
- resume point
- deterministic ordering
- audit/correlation lineage

Secrets must never be stored raw.

Credential evidence remains limited to sanitized metadata or fingerprints.

Evidence must distinguish:

- the logical protected action
- an execution attempt
- the resulting side effect

This distinction is mandatory for replay, retry and race tests.

---

# 3. Result semantics

P1 uses the canonical HandoffProbe result semantics.

## PASS

The intended P1 mutation was executed and the handoff invariant remained
intact.

## FAIL

The intended mutation was executed and a reproducible handoff/composition
security invariant was violated.

## NOT_APPLICABLE

The tested target lacks the required feature or precondition.

Examples:

- no expiring delegation
- no one-time authority
- no approval binding
- no resumable execution path

## INCONCLUSIVE

The mutation ran but evidence cannot prove PASS or FAIL.

## ERROR

HandoffProbe could not execute or observe the test correctly.

`ERROR` must never be treated as a vulnerability.

---

# HP-AUTH-004 — Expired delegation reuse

## Objective

Detect protected downstream execution using delegated authority after its
validity window has ended.

## Invariant

Authority that has expired before the protected downstream authorization
decision must not authorize that action.

## Baseline

Create a valid synthetic delegation:

`delegation:DEL-1001`

bound to:

- `user:alice`
- `agent:billing`
- `tenant:acme`
- `invoice:INV-1001`
- `invoice.update`

The baseline action executes while the delegation is valid.

## Mutation

Advance deterministic logical time beyond the delegation expiry boundary
before the MCP authorization/execution point.

Then reuse the same translated delegation.

## PASS

The protected action is rejected because the delegation is expired.

No synthetic protected side effect occurs.

## FAIL

The protected action executes using the expired delegation.

## Evidence

- delegation ID
- issued point
- expiry point
- authorization/execution point
- validity state
- translated authority
- tool
- resource
- authorization result
- side-effect counter before/after

## Default severity

HIGH when expired authority enables a protected mutation.

MEDIUM when demonstrated impact is constrained to lower-impact protected
access.

---

# HP-AUTH-005 — Delegation-chain truncation

## Objective

Detect security-relevant delegation lineage disappearing during handoff.

## Invariant

When authorization depends on the full delegation chain, removing an
intermediate delegator must not preserve equivalent downstream authority.

## Baseline

Delegation lineage:

`user:alice → agent:sales → agent:billing`

The downstream action is valid only while the complete trusted chain is
present.

## Mutation

Remove:

`agent:sales`

from the translated lineage while preserving the final principal, delegate,
resource and capability values.

## PASS

The shortened chain is rejected or requires a newly valid delegation.

## FAIL

The protected downstream action executes while treating the truncated chain as
equivalent to the original chain.

## Evidence

- original delegation chain
- translated delegation chain
- missing hop
- authority binding
- authorization result
- protected action
- side effect

## Default severity

HIGH when truncation permits protected action under authority whose lineage is
security-relevant.

Otherwise MEDIUM.

---

# HP-REPLAY-001 — Exact action replay

## Objective

Detect successful reuse of an already consumed protected action.

## Invariant

A protected action defined by fixture policy as single-use must not execute
again merely because its exact translated request is replayed.

## Baseline

Execute:

`action:ACT-1001`

once successfully using valid single-use authority.

Record its successful consumption.

## Mutation

Replay the identical translated protected action with the same:

- logical action ID
- authority
- tool
- resource
- protected payload

## PASS

The replay is rejected or returns an idempotent result without a second
protected side effect.

## FAIL

The same logical action causes a second protected side effect.

## Evidence

- logical action ID
- first attempt ID
- replay attempt ID
- authority identity
- consumption state
- side-effect counter before first execution
- side-effect counter after first execution
- side-effect counter after replay

## Default severity

HIGH for duplicate protected mutation, financial action or equivalent
meaningful side effect.

---

# HP-REPLAY-002 — Cross-context / cross-run replay

## Objective

Detect authority captured from one upstream task/run being accepted in another
security context.

## Invariant

Authority bound to one task/run/context must not automatically authorize a new
task/run/context.

## Baseline

Issue valid authority for:

`task:P1-TASK-A`

and:

`run:P1-RUN-A`

Execute or capture the translated authority in that original context.

## Mutation

Reuse the captured authority in:

`task:P1-TASK-B`

and:

`run:P1-RUN-B`

without issuing a new valid grant.

Do not model this as an MCP protocol session requirement.

The test concerns explicit application/composition bindings.

## PASS

The context mismatch is rejected or new valid authority is required.

## FAIL

The protected action executes in the new context using authority captured from
the old context.

## Evidence

- original run/task
- replay run/task
- delegation/action identifier
- context binding
- translated authority
- authorization result
- side effect

## Default severity

HIGH.

---

# HP-REPLAY-003 — Retry double execution

## Objective

Detect duplicate protected side effects caused by ambiguous retry handling
across the handoff.

## Invariant

Multiple attempts representing one logical protected action must not produce
multiple protected side effects unless explicitly intended by application
semantics.

## Baseline

Create:

`action:ACT-RETRY-1001`

with first attempt:

`attempt:ATT-1`

The fixture executes the protected side effect but intentionally withholds or
loses the synthetic acknowledgement.

## Mutation

Issue retry:

`attempt:ATT-2`

for the same logical action.

## PASS

The retry is deduplicated, recognized as already completed or otherwise
prevents a second side effect.

## FAIL

The retry executes the same logical protected action a second time.

## Evidence

- logical action ID
- both attempt IDs
- first execution state
- simulated acknowledgement ambiguity
- retry classification
- side-effect counter before
- after attempt 1
- after attempt 2

## Default severity

HIGH.

---

# HP-APPROVAL-002 — Tool substitution after approval

## Objective

Detect approval for one action being reused for another downstream tool.

## Invariant

Approval bound to tool A must not authorize tool B.

## Baseline

Approve a protected payload for:

`refund_payment`

with a stable approval ID and payload hash.

## Mutation

After approval but before execution, keep the approval while replace the
selected MCP tool with another protected tool such as:

`update_invoice`

The mutation must retain enough other context to prove that the approval/tool
binding is the security property under test.

## PASS

Tool mismatch is rejected or requires new matching approval.

## FAIL

The substituted protected tool executes using approval issued for the original
tool.

## Evidence

- approval ID
- approved tool
- executed tool
- approved payload hash
- translated context
- authorization/approval decision
- side-effect state

## Default severity

HIGH.

---

# HP-APPROVAL-003 — Approval reuse for another resource

## Objective

Detect valid consent for one protected resource being reused for another.

## Invariant

Resource-bound approval must remain bound to the approved resource.

## Baseline

Approve a protected action for:

`invoice:INV-1001`

## Mutation

Reuse the same approval ID and otherwise valid context against a second
same-tenant synthetic resource:

`invoice:INV-1003`

without issuing new consent.

`invoice:INV-1003` belongs to `tenant:acme`, just like the approved
`invoice:INV-1001`.

This deliberately isolates approval/resource binding from tenant isolation.
The ordinary authority context permits both synthetic resources; only the
approval remains bound to `invoice:INV-1001`.

## PASS

The resource mismatch is rejected or requires a new matching approval.

## FAIL

The protected action executes against `INV-1003` under approval issued for
`INV-1001`.

## Evidence

- approval ID
- approved resource
- requested/executed resource
- approved payload/hash where applicable
- authorization/approval result
- resource state before/after

## Default severity

HIGH.

Raise to CRITICAL only if a realistic fixture demonstrates cross-tenant
protected access with corresponding impact.

---

# HP-RACE-001 — Parallel one-time authority consumption

## Objective

Detect concurrent use of authority intended to permit only one protected
execution.

## Invariant

One-time authority must authorize at most one successful protected side effect.

## Baseline

Create one valid single-use grant:

`delegation:DEL-ONCE-1001`

for one protected logical action.

## Mutation

Start two deterministic concurrent execution attempts against the same
single-use authority.

The fixture must use a controlled synchronization barrier so both attempts
reach the consumption boundary reproducibly.

## PASS

At most one protected attempt succeeds and side-effect state changes once.

## FAIL

Both attempts consume the same one-time authority and both protected side
effects execute.

## Evidence

- delegation ID
- single-use marker
- both attempt IDs
- synchronization/barrier events
- consumption state before/after
- authorization result for each attempt
- side-effect counter

## Default severity

HIGH.

---

# HP-RACE-002 — Partial-failure stale execution

## Objective

Detect stale or ambiguous protected execution after an interrupted handoff is
resumed.

## Invariant

A resumed attempt must not use authority, approval or intent that became stale
or invalid during a partial failure.

## Baseline

Begin a valid protected action.

Pause at a deterministic boundary after translation/authorization context
exists but before final protected execution.

## Mutation

At the interruption point:

1. invalidate, cancel or supersede the governing security state;
2. resume or retry the interrupted operation using the stale captured state.

## PASS

The resumed attempt revalidates current security state and rejects stale
execution.

## FAIL

The resumed attempt executes the protected side effect using state that was
invalidated after the original attempt began.

## Evidence

- logical action ID
- interruption point
- captured security state
- invalidation event
- resume/retry event
- revalidation result
- deterministic sequence ordering
- side-effect counter before/after

## Default severity

HIGH.

---

# HP-AUDIT-001 — Cross-protocol audit lineage break

## Objective

Detect inability to correlate a protected downstream side effect with the
original upstream actor and governing handoff.

## Invariant

A protected action requiring accountable lineage must retain enough trustworthy
correlation to reconstruct:

original principal → A2A task/delegation → handoff translation → MCP request →
protected side effect.

## Baseline

Execute a protected synthetic update with complete lineage evidence.

## Mutation

Drop or substitute one security-relevant correlation/binding at the handoff
while allowing execution to continue.

The mutation must make end-to-end attribution materially ambiguous rather than
merely removing optional logging decoration.

## PASS

Execution is rejected when mandatory accountable lineage is unavailable, or
the trustworthy lineage remains reconstructable from retained evidence.

## FAIL

A protected side effect executes while the fixture cannot reliably correlate
it to the original actor/governing task because the handoff lost the required
lineage.

## Evidence

- original principal
- A2A task ID
- delegation ID/chain where applicable
- handoff correlation ID
- MCP request identity
- selected tool/resource
- side-effect identity
- missing/substituted lineage element
- final correlation result

## Default severity

MEDIUM.

Raise to HIGH only when the lost lineage also enables a meaningful
authorization, non-repudiation or accountability bypass with demonstrated
impact.

---

# 4. P1 implementation constraints

All ten P1 tests must satisfy these constraints.

## Handoff-specific admission

The violation must depend on cross-boundary composition.

A generic protocol conformance failure alone is not sufficient.

## Deterministic time

Expiry tests must use controlled logical time.

Do not depend on real sleeping or wall-clock timing for correctness.

## Deterministic concurrency

Race tests must use explicit barriers/gates.

A flaky real-time race is not an acceptable test oracle.

## Replay identity

Replay/retry tests must distinguish logical action identity from transport
attempt identity.

## Safe side effects

Bundled fixtures remain local and synthetic.

No external side effect may be necessary to prove a FAIL.

## Evidence quality

Every FAIL must retain sufficient evidence to reproduce the security decision.

## Error semantics

Infrastructure, adapter, timeout or observation failure remains `ERROR`.

It must never become vulnerability `FAIL`.

---

# 5. P1 release acceptance gate

Phase 4 P1 implementation is not complete until:

- all 10 P1 tests are implemented
- all 10 IDs are stable
- every definition has priority `P1`
- every definition records protocol applicability
- every definition records property class
- every definition records source/provenance metadata
- secure fixtures PASS every applicable mutation
- vulnerable fixtures FAIL exactly where designed
- NOT_APPLICABLE is used when a required feature is genuinely absent
- INCONCLUSIVE is used when evidence cannot prove the invariant
- ERROR never masquerades as FAIL
- expiry behavior is deterministic
- replay/retry action identity is deterministic
- race ordering is deterministic
- approval bindings remain explicit
- audit lineage evidence is reproducible
- no raw secrets appear in evidence
- no bundled test creates a real external side effect
- the complete P0 corpus remains green
- the Phase 1 protocol-lab regression remains green
- the complete repository quality gate remains green

The required P1 set is:

1. HP-AUTH-004
2. HP-AUTH-005
3. HP-REPLAY-001
4. HP-REPLAY-002
5. HP-REPLAY-003
6. HP-APPROVAL-002
7. HP-APPROVAL-003
8. HP-RACE-001
9. HP-RACE-002
10. HP-AUDIT-001
