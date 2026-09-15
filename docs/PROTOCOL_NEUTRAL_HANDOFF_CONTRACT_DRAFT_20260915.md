# Protocol-neutral Handoff Contract

Status: **REVIEW DRAFT — NOT YET SENT FOR EXTERNAL REVIEW**

Date: 2026-09-15

Track: **T-2 — protocol-neutral Handoff Contract review**

## Purpose

This draft defines a minimal set of protocol-neutral security properties for a handoff between an upstream component and a downstream component.

It is intended for independent technical review and deterministic research.

It is not:

- a new wire protocol;
- an A2A or MCP specification;
- a compatibility certification;
- a claim that every listed property is normatively required by A2A or MCP;
- a claim that NAEOS or any other implementation is vulnerable or compatible;
- an automatic source of new HandoffProbe stable attack IDs.

The current HandoffProbe public corpus remains 22 stable attacks.

## Handoff model

A security-relevant handoff has three distinct layers.

### 1. Contract semantics

What security property is intended to remain true across the handoff?

Examples include authority limits, action identity, provenance continuity and interpretation consistency.

### 2. Attestation / binding

What trusted evidence binds the relevant identity, authority, payload, version, provenance or logical action to the claim?

A semantic claim without trustworthy binding may be unverifiable.

### 3. Runtime enforcement

What does the downstream runtime actually prevent or allow?

A handoff can preserve fields or metadata while still permitting an unsafe downstream effect.

These layers must be evaluated separately.

A schema-valid or representation-preserving handoff is not automatically secure.

## Result vocabulary

Each candidate invariant uses the following result boundaries.

### PASS

Available evidence demonstrates that the protected property remains true for the observed handoff.

### FAIL

Available evidence demonstrates a concrete violation of the protected property and the relevant unsafe downstream interpretation or effect is observable.

### INCONCLUSIVE

The handoff may be safe or unsafe, but required trusted evidence is absent, ambiguous or outside the observation boundary.

Missing evidence must not be silently replaced with assumed values.

### ERROR

The evaluator, fixture, adapter or observation mechanism cannot produce a valid determination.

An evaluator `ERROR` must never be converted into a security `FAIL`.

---

## Candidate invariant 1 — Authority / capability monotonicity

### Protected property

Effective downstream authority must not exceed the authority delegated upstream.

Conceptually:

`effective_authority(downstream) ⊆ delegated_authority(upstream)`

### Upstream claim / input

A trusted upstream authority statement, delegation, constraint or equivalent policy input defining the permitted protected operations.

### Downstream interpretation

The set of protected operations that the downstream runtime will actually permit after translation and any trusted downstream restrictions.

### Binding / attestation evidence

Evidence must bind the relevant actor or delegation context to:

- upstream permitted authority;
- translated authority;
- downstream target or operation;
- any trusted downstream restriction used to narrow authority.

### Runtime enforcement expectation

Trusted downstream enforcement may preserve or narrow upstream authority.

Representation loss or transformation alone is not a failure if the effective downstream authority remains equal to or narrower than the delegated upstream authority.

### PASS

Every effective downstream protected operation is permitted by the trusted upstream delegation.

### FAIL

At least one concrete effective downstream protected operation is not permitted by the trusted upstream delegation.

### INCONCLUSIVE / ERROR boundary

`INCONCLUSIVE` when the effective downstream operation set or its trusted binding cannot be established.

`ERROR` when the authority evaluator itself cannot construct or compare a valid model.

### Known HandoffProbe overlap

This candidate is constrained by completed T-1 work.

The existing stable `HP-AUTH-001` invariant already owns downstream authority amplification. T-1 concluded that semantic authority widening is a refinement of `HP-AUTH-001`, not a separate stable attack.

T-2 must not duplicate that decision.

### Protocol evidence classification

**Implementation-independent security candidate with existing HandoffProbe evidence.**

No claim is made here that A2A or MCP independently defines this exact cross-protocol invariant in these terms.

---

## Candidate invariant 2 — Replay / logical-action uniqueness

### Protected property

A protected logical action that is intended to be single-use must not gain additional valid executions merely because the handoff is retried, replayed or moved into another execution context.

### Upstream claim / input

A trusted logical-action identity and any relevant task, actor, authorization, freshness, nonce or single-use constraint.

### Downstream interpretation

The downstream request or effect that represents execution of that logical action.

Transport attempts and logical actions must not be treated as equivalent concepts.

### Binding / attestation evidence

Evidence should bind the protected downstream execution to the logical action and, where relevant:

- actor;
- task or context;
- action payload;
- authorization;
- freshness or nonce state;
- previous consumption state.

### Runtime enforcement expectation

Retries may be permitted when semantics require them, but protected side effects must obey the logical-action uniqueness and replay rules governing the authorization.

### PASS

Repeated transport attempts do not produce an unauthorized additional protected execution.

### FAIL

A replayed, reused or retried logical action produces an additional protected execution that the governing authorization or single-use semantics do not permit.

### INCONCLUSIVE / ERROR boundary

`INCONCLUSIVE` when logical-action identity or effect observation cannot be established strongly enough to distinguish retry from replay.

`ERROR` when replay-state evaluation or observation fails internally.

### Known HandoffProbe overlap

Potential existing coverage includes:

- `HP-REPLAY-001` — exact action replay;
- `HP-REPLAY-002` — cross-context / cross-run replay;
- `HP-REPLAY-003` — retry double execution;
- Phase 9 replay-store evidence and `nonce_replay` discrimination.

T-2.3 must determine whether any proposed replay case adds a genuinely distinct handoff property.

### Protocol evidence classification

**Implementation-independent security candidate with HandoffProbe and Phase 9 evidence.**

No protocol-normative requirement is asserted by this draft unless later primary-spec evidence supports it.

---

## Candidate invariant 3 — Provenance continuity / mutation visibility

### Protected property

Security-relevant provenance required for attribution or policy must remain trustworthy across the handoff, and any security-relevant mutation must be visible rather than silently collapsing distinct actors, tasks, contexts or actions.

### Upstream claim / input

Trusted provenance associated with the originating actor, delegation, task, context, action or approval.

### Downstream interpretation

The identity and lineage the downstream runtime or audit system associates with the protected request and resulting effect.

### Binding / attestation evidence

Evidence should permit correlation between the protected downstream effect and the relevant upstream provenance, including the translation step where security-relevant interpretation changes.

### Runtime enforcement expectation

If policy depends on provenance, the downstream system must not silently substitute, collapse or discard security-relevant lineage in a way that changes authorization, attribution or trust decisions.

### PASS

Required provenance remains trustworthy and sufficient to correlate the downstream effect with the governing upstream security context.

### FAIL

A security-relevant provenance mutation or loss changes attribution or a trust decision while remaining accepted as equivalent.

### INCONCLUSIVE / ERROR boundary

`INCONCLUSIVE` when required provenance is outside the observation boundary or cannot be authenticated strongly enough to support the claim.

`ERROR` when the observation or correlation mechanism fails internally.

### Known HandoffProbe overlap

Potential existing coverage includes:

- `HP-AUDIT-001` — cross-protocol audit lineage break;
- identity continuity attacks;
- delegation-chain lineage;
- Phase 9 caller, task, context, audience, authority and stage-verification provenance.

T-2.3 must determine whether a proposed provenance case is already covered, a refinement or genuinely distinct.

### Protocol evidence classification

**Implementation-independent security candidate with existing HandoffProbe and Phase 9 evidence.**

No general A2A/MCP normative provenance guarantee is asserted here.

---

## Candidate invariant 4 — Canonicalization / version interpretation consistency

### Protected property

Security-relevant input must not acquire a different effective meaning across the handoff solely because upstream and downstream components canonicalize, normalize or interpret versions differently.

### Upstream claim / input

The exact security-relevant value or structured representation together with the version or interpretation context required to understand it.

### Downstream interpretation

The canonical or effective value used by the downstream security or execution decision.

### Binding / attestation evidence

Evidence should preserve enough information to compare:

- original representation;
- interpretation or version context;
- transformation;
- effective downstream interpretation.

### Runtime enforcement expectation

A handoff must not silently convert an input into a security-relevant meaning that the trusted upstream interpretation did not authorize.

Equivalent representations may remain valid when trusted interpretation preserves the same protected meaning.

### PASS

The effective downstream interpretation is security-equivalent to the trusted upstream interpretation, or a trusted downstream restriction safely narrows it.

### FAIL

A canonicalization or version mismatch creates a concrete broader, different or otherwise unauthorized downstream security meaning.

### INCONCLUSIVE / ERROR boundary

`INCONCLUSIVE` when equivalence cannot be determined from available version, canonicalization or transformation evidence.

`ERROR` when canonicalization or interpretation evaluation fails internally.

### Known HandoffProbe overlap

Possible nearby coverage includes:

- `HP-TARGET-002` — capability/tool semantic collision;
- the existing backlog candidate `HP-VERSION-001`;
- T-1 evidence showing that representation difference alone is not authority failure.

No new attack admission is implied.

### Protocol evidence classification

**Candidate research invariant.**

Current T-2 evidence does not establish a general cross-protocol normative requirement for this formulation.

---

## Candidate invariant 5 — Ambiguous / duplicate-field interpretation

### Protected property

Multiple representations of the same security-relevant concept must not allow different components to select different effective values in a way that changes authorization, target selection, identity, approval or protected execution.

### Upstream claim / input

A security-relevant structured input containing one or more fields whose precedence, duplication or interpretation can affect a protected decision.

### Downstream interpretation

The single effective value or meaning used by translation, authorization and execution.

### Binding / attestation evidence

Evidence should show:

- the relevant original fields;
- any duplicate or ambiguous representations;
- the precedence or normalization rule applied;
- the effective downstream value used for the protected decision.

### Runtime enforcement expectation

Security-relevant ambiguity must be rejected or resolved by a trusted deterministic rule whose resulting meaning remains within the authorized upstream intent.

### PASS

All security-relevant components reach the same trusted effective interpretation, or ambiguity is rejected before protected execution.

### FAIL

Different valid-looking representations cause upstream and downstream components to use materially different security meanings and the unsafe downstream interpretation is accepted.

### INCONCLUSIVE / ERROR boundary

`INCONCLUSIVE` when parser or precedence behavior cannot be observed strongly enough to establish the effective interpretation.

`ERROR` when the fixture or evaluator cannot construct a valid ambiguity comparison.

### Known HandoffProbe overlap

Potential nearby coverage includes:

- target/resource substitution;
- capability/tool semantic collision;
- payload mutation after approval;
- routing-metadata mismatch backlog research.

T-2.3 must determine whether duplicate-field ambiguity is already covered or remains a distinct research candidate.

### Protocol evidence classification

**Candidate research invariant.**

No general A2A/MCP normative duplicate-field rule is claimed by this document.

---

## Cross-candidate rules

The following rules apply to all candidate invariants.

1. A representation change alone is not a security failure.
2. Trusted compensating downstream enforcement may preserve or narrow the protected property.
3. Missing evidence remains missing; it must not be replaced with assumed reference values.
4. `ERROR` is not `FAIL`.
5. A concrete unsafe downstream interpretation or effect is required for a security `FAIL`.
6. Existing stable HandoffProbe attack IDs must not be silently repurposed.
7. No new stable attack ID is created by this draft.
8. Protocol-normative claims require primary protocol evidence.
9. Production or third-party testing requires authorization.
10. External review does not imply partnership, adoption, compatibility or endorsement.

## Relationship to existing HandoffProbe evidence

This draft is constrained by:

- the 22 stable HandoffProbe attacks;
- T-1 semantic-authority outcome B under stable `HP-AUTH-001`;
- Phase 9 crossing-corpus evidence;
- the T-2.1 frozen external review input.

T-2.3 must perform the formal overlap classification before implementation of any new deterministic research case.

## Review questions

Independent reviewers are specifically invited to challenge:

1. whether each protected property is stated narrowly enough;
2. whether semantics, binding and runtime enforcement are sufficiently separated;
3. whether PASS and FAIL require enough concrete evidence;
4. whether any `INCONCLUSIVE` case is incorrectly treated as safe or unsafe;
5. whether an invariant is already covered by another candidate;
6. whether a candidate depends on implementation-specific assumptions that should be explicit;
7. whether representation changes with equivalent trusted enforcement are handled correctly.

## T-2.2 exit gate

T-2.2 is complete when this draft contains, for every candidate invariant:

- protected property;
- upstream claim/input;
- downstream interpretation;
- binding/attestation evidence;
- runtime enforcement expectation;
- PASS;
- FAIL;
- INCONCLUSIVE / ERROR boundary;
- known HandoffProbe overlap;
- protocol-evidence classification.

Completion of T-2.2 does not authorize new attack implementation.

The next mandatory step is T-2.3 overlap classification.
