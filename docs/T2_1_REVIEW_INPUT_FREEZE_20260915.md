# T-2.1 external review input freeze

Date: 2026-09-15

Status: **COMPLETE**

Track: **T-2 — protocol-neutral Handoff Contract review**

## Purpose

Freeze the exact external Indie Hackers review signal before HandoffProbe drafts new protocol-neutral invariants or creates any new research case.

This document is research evidence only.

It does not change:

- HandoffProbe runtime behavior;
- CLI behavior;
- package-root API;
- GitHub Action behavior;
- report schema `1`;
- config schema `1`;
- A2A 1.0 → MCP 2026-07-28 protocol baseline;
- the stable attack count of 22;
- npm package version `0.3.0`;
- the immutable `v0.3.0` release tag or artifact.

## External source

Exact Indie Hackers thread:

`https://www.indiehackers.com/post/what-if-ai-coding-tools-were-only-one-layer-of-the-problem-99b9b7b2ad`

External reviewer handle:

`bayu`

No stronger public identity is asserted by HandoffProbe at this stage.

## Factual exchange summary

The external discussion produced a narrow technical-review signal.

The participant identified as `bayu` expressed interest in reviewing:

1. a minimal protocol-neutral Handoff Contract; and
2. deterministic HandoffProbe cases against the NAEOS architecture.

The exchange surfaced these review dimensions:

- version / canonicalization mismatch;
- capability or authority widening;
- replay;
- provenance mutation or loss;
- ambiguous or duplicate fields;
- separation between contract semantics, attestation / binding, and runtime enforcement.

These are frozen as **external research inputs**.

They are not automatically accepted as HandoffProbe requirements, stable security invariants, new attack IDs, protocol claims or evidence of product adoption.

## Reviewer attribution boundary

Until independently verified public evidence supports a stronger identity, HandoffProbe records the reviewer only as:

`bayu`

HandoffProbe does not infer or claim:

- legal identity;
- employment or organizational affiliation;
- partnership;
- endorsement;
- certification authority;
- customer status;
- HandoffProbe adoption;
- NAEOS compatibility.

## Existing HandoffProbe evidence that constrains T-2

### Stable corpus

The released public corpus remains:

- 12 P0 attacks;
- 10 P1 attacks;
- 22 stable attacks total.

Primary references:

- `docs/ATTACK_CATALOG.md`
- `docs/P0_TEST_SPECIFICATION.md`
- `docs/P1_TEST_SPECIFICATION.md`

T-2 must map candidate invariants against this existing corpus before any new research-case or attack-admission decision.

### T-1 semantic authority decision

T-1 is complete.

Its evidence-backed outcome is:

**refine existing `HP-AUTH-001`; do not create a new stable attack ID.**

The governing semantic-authority invariant is:

`effective_authority(downstream) ⊆ delegated_authority(upstream)`

Primary references:

- `docs/T1_SEMANTIC_AUTHORITY_ADMISSION_DECISION_20260914.md`
- `docs/T1_SEMANTIC_AUTHORITY_OVERLAP_MATRIX_20260913.md`
- `docs/T1_HP_AUTH_001_SEMANTIC_REFINEMENT_CLOSEOUT_20260914.md`

Therefore any T-2 authority or capability monotonicity candidate must reuse the T-1 result and must not create parallel authority work merely because the representation differs.

### Phase 9 crossing evidence

Phase 9 already contains deterministic crossing-corpus evidence around:

- caller and authority binding;
- audience binding;
- provenance;
- freshness and status;
- replay;
- execution effects;
- deterministic A2A 1.0 → MCP 2026-07-28 crossing behavior.

Primary references:

- `docs/PHASE9_CROSSING_CORPUS_INTEGRATION_SPEC_20260831.md`
- `docs/PHASE9_CROSSING_CORPUS_EXECUTION_20260901.md`
- `docs/R2_V0_2_0_PHASE9_PRODUCTIZATION_DECISION_20260909.md`

T-2 must distinguish genuinely new candidate invariants from Phase 9 evidence already present in the repository.

## Frozen review dimensions

The following five candidate families proceed to T-2.2 for protocol-neutral drafting and then to T-2.3 for overlap classification:

1. **Authority / capability monotonicity**
   - constrained by the completed T-1 `HP-AUTH-001` decision.

2. **Replay / logical-action uniqueness**
   - must be compared with existing replay attacks and Phase 9 replay evidence.

3. **Provenance continuity / mutation visibility**
   - must be compared with existing audit-lineage and Phase 9 provenance evidence.

4. **Canonicalization / version interpretation consistency**
   - currently treated only as a candidate research dimension until overlap and evidence review are complete.

5. **Ambiguous / duplicate-field interpretation**
   - currently treated only as a candidate research dimension until overlap and evidence review are complete.

None of these candidate families receives a new stable HP attack ID during T-2.1.

## Explicit non-decisions

T-2.1 does **not** decide:

- that any new stable attack is required;
- that any candidate invariant is protocol-normative;
- that NAEOS is vulnerable or compatible;
- that HandoffProbe should support another protocol baseline;
- that any production system should be tested;
- that package version `0.3.0` should change;
- that a public external-review request should be sent yet.

Those decisions belong to later evidence gates.

## Next gate

T-2.2 may now draft the minimal protocol-neutral Handoff Contract.

T-2.3 must then classify each candidate against:

- all 22 stable attacks;
- Phase 9 crossing evidence;
- the completed T-1 semantic-authority decision.

No deterministic new research case is justified until that overlap review is complete.

## T-2.1 exit gate

T-2.1 is complete because:

- the exact Indie Hackers thread URL is preserved;
- the factual external exchange is summarized;
- the reviewer is recorded only as `bayu`;
- the review dimensions are frozen as external research inputs rather than accepted requirements;
- T-1, P0/P1 and Phase 9 evidence are explicitly cross-referenced;
- no HandoffProbe runtime, release artifact, public attack count or package version is changed.
