# Research Signal — Protocol-Neutral Handoff Contract Integrity

Status: evidence-backed research candidate — not committed release scope  
Recorded: 2026-09-08  
Roadmap relationship: evaluate during **Release Track R2 / v0.2.0 scope audit**, only after **v0.1.1** is published and verified

## Why this note exists

A multi-turn technical discussion on Indie Hackers around NAEOS produced a concrete external design signal that maps closely to HandoffProbe's core thesis: **handoffs are trust boundaries, and authority must not widen implicitly when state crosses that boundary.**

This note preserves the signal so it is not lost, while deliberately avoiding a premature commitment to ship it in `v0.2.0`.

Source discussion:

`https://www.indiehackers.com/post/what-if-ai-coding-tools-were-only-one-layer-of-the-problem-99b9b7b2ad`

## External qualitative signal

The discussion converged on a portable, declarative, protocol-neutral **Handoff Contract** rather than runtime-only magic.

The proposed contract semantics distinguish:

- **Requested** — what the originating component asks to happen
- **Authorized** — what policy actually permits
- **Untrusted** — which input came from external/tool/agent sources and must not become authority
- **Granted** — the exact downstream capabilities the receiver may exercise

The external participant explicitly framed HandoffProbe as a complementary adversarial testing layer: the contract/enforcement model defines the security semantics, while HandoffProbe could test whether those guarantees survive the handoff.

## Core integrity principle

The strongest invariant from the discussion is:

> A handoff can carry data, but data cannot implicitly carry authority.

A second, stronger formulation is:

> This exact authority grant applies to this exact handoff state, under this exact policy, for these exact capabilities, and only within this validity window.

The important distinction is that **cryptography is not itself the security model**. The contract defines what must be bound; signatures or attestations are mechanisms proving that the binding has not been substituted.

Conceptually:

```text
request
  -> handoff contract
  -> external validation
  -> policy decision
  -> capability grant
  -> attestation / integrity proof
  -> runtime revalidation
  -> downstream execution
```

## Candidate bound state

The discussion suggests that a handoff authority decision may need to bind at least:

- payload or canonical payload digest
- exact authorized capability set
- policy identifier and/or policy version
- relevant identities and provenance
- expiry / validity window
- replay state / nonce / action identity
- audit/reference identifier where useful

The semantic requirement should remain independent of one particular signature algorithm, transport or runtime.

## Candidate verification invariant

A receiver should not merely verify that a contract is authentic. It should verify that the **authenticated authority is still valid for the exact state and action being executed**.

A candidate verification order for future research is:

1. verify the attestation/authenticity mechanism;
2. recompute and compare the canonical handoff-state digest;
3. verify the referenced policy decision is still valid for the current state;
4. verify the granted capability has not widened or been substituted;
5. verify identity/provenance bindings;
6. verify expiry and replay constraints;
7. only then permit the downstream capability/effect.

Working principle:

> Authenticate the decision, then revalidate the state — not just the signature.

## Canonicalization question

A portable contract creates a second-order problem: independent runtimes must agree on what exact state is being attested.

If semantically equivalent or ambiguous representations hash differently — or if two runtimes normalize fields differently — an authentic contract can still become semantically unsafe or non-interoperable.

Research question:

**Should canonicalization rules be part of the protocol-neutral Handoff Contract specification itself, or belong to runtime/profile-specific layers?**

This question must be resolved before treating a state digest as a meaningful cross-runtime invariant.

## Candidate HandoffProbe adversarial surface

If admitted later, the contract model could provide a clean deterministic mutation matrix. Candidate mutation classes include:

- payload mutation after authorization -> digest mismatch
- payload rebinding / detached payload -> state-binding failure
- capability grant widening -> authorization mismatch
- capability substitution -> grant mismatch
- policy identifier/version substitution -> decision mismatch
- identity/provenance substitution -> identity mismatch
- stale-but-authentic decision -> state-validity failure
- expiry manipulation -> validity failure
- replay-state substitution -> replay/nonce failure
- exact replay of a previously valid contract -> replay failure
- field injection that causes data to be reinterpreted as authority -> authority-boundary failure
- canonicalization mismatch across implementations -> semantic binding ambiguity
- authentic attestation over the wrong handoff state -> authenticated-but-invalid authority

These are **research candidates**, not new stable HandoffProbe attack IDs.

## Relationship to current HandoffProbe work

This signal aligns with existing HandoffProbe concepts rather than replacing them:

- authority continuity
- capability widening
- replay/retry behavior
- payload/action binding
- provenance
- approval binding
- effect-before/after-validation ordering
- Phase 9 authority authentication and crossing-boundary evidence

The Phase 9 work may provide useful implementation evidence for evaluating this idea, but no existing Phase 9 case is automatically reclassified as a new public attack.

## Release handling

### v0.1.1

**No impact.**

`v0.1.1` remains a minimal security-maintenance release from the immutable `v0.1.0` release line. No Handoff Contract research or new feature work belongs in that patch release.

### v0.2.0

This note is an **input to R2.1 scope audit**, not a promise that `v0.2.0` will implement Handoff Contracts.

During R2.1, explicitly decide one of:

- `ADMIT_TO_V0.2.0`
- `RESEARCH_ONLY_POST_V0.2.0`
- `DEFER_PENDING_MORE_EXTERNAL_EVIDENCE`
- `REJECT_OUT_OF_SCOPE`

Default before that decision: `RESEARCH_ONLY / NOT COMMITTED`.

## Admission gates before implementation

Do not implement this solely because the discussion is technically interesting. Admission should require:

1. clear fit with the HandoffProbe thesis: security properties lost or widened during a handoff;
2. a deterministic, reproducible observation surface;
3. a protocol-neutral core model rather than NAEOS-specific coupling;
4. no requirement for paid AI/cloud infrastructure for bundled tests;
5. evidence that the new surface adds meaningful coverage beyond existing stable attacks;
6. explicit canonicalization semantics if cross-runtime state digests are involved;
7. clear separation between contract semantics and cryptographic mechanism;
8. attack-catalog review before any new stable HP-ID is created;
9. stable reporter/config/API implications understood before public release;
10. no inflation of the public `22 stable attacks` count unless new attack IDs pass the normal admission and release gates.

## Product/positioning learning

This discussion strengthens a concise HandoffProbe positioning:

> **Handoffs are trust boundaries. Test whether security guarantees survive the handoff.**

A more technical supporting line is:

> **Do not only authenticate the handoff object; verify that the authenticated authority is still valid for the exact state and action being executed.**

These are positioning/research learnings, not claims that HandoffProbe currently implements a generic Handoff Contract validator.

## Next review point

Revisit this document immediately after the `v0.1.1` release gate closes and R2.1 begins.

At that point, compare this external signal against:

- the full `v0.1.0..main` diff;
- existing Phase 9 authority/crossing work;
- any additional external replies or implementation demand;
- the current attack catalog;
- public API/report/config compatibility constraints;
- the desired single user-facing value proposition for `v0.2.0`.
