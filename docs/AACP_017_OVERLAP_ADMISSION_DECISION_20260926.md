# AACP-017 Overlap / Admission Decision

Date: 2026-09-26

Status: **COMPLETE — NO ADD / HP-AUTH-001-OWNED / BOUNDED REFINEMENT RESEARCH ONLY**

## Input

This decision reviews the externally reproduced AACP-017 predicate-level
authority case recorded in:

`docs/AACP_017_PREDICATE_AUTHORITY_SIGNAL_20260926.md`

The reproduced example compares integer-cent predicates:

- upstream: `amount < 5000`;
- semantics-preserving downstream form: `amount <= 4999`;
- genuinely wider downstream form: `amount <= 5000`.

Under the external opaque-identifier representation, both changed downstream
forms enter the same failure class.

## Governing security invariant

The governing stable invariant already belongs to `HP-AUTH-001`:

`Downstream effective authority must not exceed upstream delegated authority.`

A predicate rewrite that genuinely permits a previously prohibited protected
effect is therefore an instance of downstream authority amplification, not a
new security property.

AACP-017 does not establish a second handoff-specific invariant.

## Overlap decision

Admission result:

**NO ADD — retain stable `HP-AUTH-001`; do not reserve a new `HP-*` ID.**

The distinction exposed by AACP-017 is in the expressiveness of the current
semantic-authority representation, not in ownership of the governing security
property.

This is consistent with the earlier T1 semantic-authority admission decision,
which established that semantic authority widening is an evidence/model
refinement of `HP-AUTH-001`.

## Current model boundary

The productive semantic-authority evaluator reasons over a finite universe of
concrete protected-operation IDs and compares upstream, translated and
effective downstream operation sets.

It is intentionally not a general predicate-equivalence or policy-language
solver.

Therefore the current stable model does not claim that syntactically different
numeric predicates are automatically recognized as semantically equivalent.

The AACP-017 observation remains a valid representation-boundary finding.

## Why runtime implementation is not authorized yet

The external example demonstrates one bounded integer-cent equivalence:

`amount < 5000` is equivalent to `amount <= 4999`.

That example alone is insufficient justification for general predicate
normalization.

A productive implementation would first require a deliberately bounded domain
with deterministic semantics. It must avoid unsafe inference across arbitrary
numeric, logical or policy-language expressions.

No runtime change is authorized by this overlap decision.

## Bounded refinement research gate

A future AACP-017 follow-up may investigate a bounded refinement of
`HP-AUTH-001` only if it can establish all of the following:

1. a handoff-specific authority-continuity use case rather than generic policy
   equivalence;
2. an explicitly bounded predicate domain;
3. deterministic canonical semantics for that domain;
4. a secure case where equivalent re-encoding preserves authority;
5. an intentionally vulnerable case where the predicate genuinely widens
   effective downstream authority;
6. concrete evidence identifying the newly permitted downstream effect or
   value region;
7. deterministic ERROR behavior for unsupported or ambiguous predicates;
8. preservation of the existing `HP-AUTH-001` regression behavior and stable
   identity.

If those conditions cannot be satisfied without becoming a general policy
solver, the current documented limitation remains the correct product boundary.

## Stable boundary

This decision:

- creates no new stable attack;
- reserves no new `HP-*` ID;
- keeps the stable corpus at **23 attacks**;
- does not modify runtime behavior;
- does not modify the package version;
- does not authorize npm publication;
- does not authorize a Git tag or GitHub Release;
- does not claim arbitrary predicate-equivalence support.

## Final classification

AACP-017 is classified as:

**HP-AUTH-001-owned semantic-authority representation research.**

Current admission result:

**NO ADD.**

Possible future work:

**bounded `HP-AUTH-001` refinement research only, behind a separate proof gate.**
