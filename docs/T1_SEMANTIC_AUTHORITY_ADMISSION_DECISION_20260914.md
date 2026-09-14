# T1.5 Semantic Authority Admission Decision

Status: **COMPLETE 2026-09-14**

Decision: **B — refine the existing HP-AUTH-001 attack**

## Decision

Do not create a new stable attack ID for semantic authority widening.

The public stable attack count remains **22**.

Semantic authority widening under lossy A2A -> MCP translation is governed by the existing HP-AUTH-001 invariant:

`Downstream effective authority must not exceed upstream delegated authority.`

The new evidence shows that HP-AUTH-001 should be refined so that its test/evidence model can reason about semantic authority preservation rather than only direct structured-field widening.

## Why this is not a distinct attack

T1.2 established that HP-AUTH-001 already owns the core security property.

T1.4 independently demonstrated that:

- direct preservation passes;
- representation loss with equivalent trusted downstream enforcement passes;
- representation loss that creates a newly permitted protected operation fails;
- stricter downstream authority passes;
- binding failure remains separately classifiable;
- explicit structured escalation remains separately classifiable;
- model/runtime error remains ERROR.

No additional governing security invariant was required to explain the semantic-widening failure.

The difference is therefore in the strength of the HP-AUTH-001 representation, fixture and evidence model, not in the existence of a new security property.

## Required HP-AUTH-001 refinement

A future implementation refinement should preserve the current stable HP-AUTH-001 identity and compatibility while adding semantic evidence capable of showing:

1. upstream permitted protected operations;
2. effective downstream permitted protected operations;
3. trusted downstream enforcement where relevant;
4. whether effective downstream authority is equal to, narrower than or broader than upstream;
5. at least one concrete newly permitted operation when widening occurs.

The existing read-to-update HP-AUTH-001 fixture remains useful as a direct structured amplification regression and should not be discarded merely because a stronger semantic fixture is added.

## Classification boundaries

The refinement must not collapse existing failures into HP-AUTH-001.

In particular:

- identity/delegate mismatch remains an identity or binding failure;
- tenant/resource substitution remains governed by its existing attack where applicable;
- explicit structured escalation remains distinguishable from lossy semantic widening;
- ERROR remains non-vulnerability ERROR;
- representation loss alone remains non-failing when equivalent trusted downstream enforcement preserves effective authority.

## Release discipline

This decision does not modify the current v0.2.0 public runtime or stable attack count.

The HP-AUTH-001 implementation refinement must go through normal compatibility, regression, documentation and release gates.

No release number is forced by T1.5 alone.

## Final admission result

Outcome A — existing attack requires no modification: **rejected**.

Outcome B — existing attack should be refined: **accepted**.

Outcome C — genuinely distinct new invariant / new attack candidate: **rejected by current evidence**.

Therefore:

**HP-AUTH-001 remains the stable attack identity, and semantic authority widening becomes an evidence-backed refinement path for that existing attack.**
