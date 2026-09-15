# Protocol-neutral Handoff Contract review spec

Status: queued research track
Date: 2026-09-14
Owner: HandoffProbe

## Purpose

Turn the external Indie Hackers technical dialogue into a small, reviewable, protocol-neutral handoff contract and a deterministic HandoffProbe research matrix without inflating the stable attack corpus or implying protocol endorsement.

This is a research and design-validation track. It is not a new protocol proposal, not a compatibility certification, and not an automatic source of new stable attack IDs.

## External signal

Source thread:

`https://www.indiehackers.com/post/what-if-ai-coding-tools-were-only-one-layer-of-the-problem-99b9b7b2ad`

The external participant `bayu` explicitly expressed interest in reviewing a minimal protocol-neutral Handoff Contract and deterministic HandoffProbe cases against the NAEOS architecture.

The discussion identified several useful boundaries for review:

- version / canonicalization mismatch;
- capability or authority widening;
- replay;
- provenance mutation or loss;
- ambiguous or duplicate fields;
- distinction between contract semantics, attestation / binding, and runtime enforcement.

This is treated as an external technical-review signal only. It is not evidence of HandoffProbe adoption, a partnership, an endorsement, or commercial demand.

## Sequencing

This track is named **T-2** in the roadmap.

- T-1 semantic-authority-widening research is complete and remains authoritative for the authority-widening admission decision.
- T-2 must reuse the completed T-1 overlap/admission result instead of duplicating or pre-empting it.
- Documentation-only contract drafting may proceed now that T-1 is complete, provided it does not block CV-5 distribution work.
- No new stable attack ID, release claim, CLI/API surface, or package behavior may be introduced until the normal attack-admission and release gates are satisfied.

## Goal

Produce a compact public draft that makes handoff invariants explicit enough for independent review and for deterministic HandoffProbe research cases to test the same expectations across implementations.

The draft should answer three separate questions for each invariant:

1. **Contract semantics** — what property is supposed to remain true across the handoff?
2. **Attestation / binding** — what evidence binds the relevant identity, authority, payload, provenance, version or context to that claim?
3. **Runtime enforcement** — what does the downstream runtime actually prevent or allow?

A handoff may be schema-valid or representation-preserving while still failing one of these layers. The contract must keep those failure classes separate.

## Non-goals

- inventing a new wire protocol;
- replacing A2A, MCP or any other protocol specification;
- claiming NAEOS compatibility or certification;
- claiming that A2A or MCP normatively requires an invariant unless primary protocol evidence supports that statement;
- turning every external suggestion into a HandoffProbe attack;
- copying external code or text without provenance/license review;
- testing production or third-party systems without authorization;
- changing the public stable attack count from 22 before normal admission and release discipline.

## T-2 work packages

### T-2.1 — freeze the review input

Status: **COMPLETE — 2026-09-15**

- [x] preserve the exact Indie Hackers thread URL and a concise factual summary of the exchange;
- [x] record the external reviewer handle only as `bayu` unless a stronger public identity is independently verified;
- [x] record the proposed review dimensions exactly as external research inputs, not as accepted HandoffProbe requirements;
- [x] cross-reference T-1 and the existing P0/P1/Phase-9 evidence before drafting new invariants.

Evidence: `docs/T2_1_REVIEW_INPUT_FREEZE_20260915.md`.

### T-2.2 — draft the minimal Handoff Contract

Create a protocol-neutral draft under `docs/` that defines a small set of candidate invariants.

At minimum evaluate these candidate classes:

- authority / capability monotonicity across the handoff;
- replay and logical-action uniqueness;
- provenance continuity and mutation visibility;
- canonicalization / version interpretation consistency;
- ambiguity / duplicate-field handling where representation can change human or runtime interpretation.

For every candidate invariant, document:

- protected property;
- upstream claim/input;
- downstream interpretation;
- binding/attestation evidence;
- runtime enforcement expectation;
- PASS condition;
- FAIL condition;
- INCONCLUSIVE / ERROR boundary;
- known overlap with existing HandoffProbe attacks;
- whether protocol evidence is normative, implementation-specific, or absent.

### T-2.3 — build an overlap matrix before implementation

- [ ] map every proposed contract invariant against all 22 stable attacks;
- [ ] map against Phase-9 crossing-corpus evidence;
- [ ] map authority/capability items against the T-1 semantic-authority-widening decision;
- [ ] classify each row as `ALREADY COVERED / REFINEMENT / DISTINCT RESEARCH CANDIDATE / OUT OF SCOPE`;
- [ ] do not assign new attack IDs during this step.

### T-2.4 — deterministic research cases

Only for rows that remain useful after overlap review:

- [ ] create the smallest local/synthetic PASS fixture;
- [ ] create the smallest local/synthetic FAIL fixture;
- [ ] add a control case where representation changes but equivalent trusted enforcement preserves the invariant, when applicable;
- [ ] keep execution deterministic and no-paid;
- [ ] capture evidence through existing HandoffProbe-owned observation paths where possible;
- [ ] keep research-case naming separate from stable HP attack IDs until admission.

Initial candidate case families may include:

- canonicalization/version mismatch with divergent downstream meaning;
- authority/capability widening not already resolved by T-1;
- replay across a logically identical action boundary;
- provenance mutation/loss that changes attribution or trust decisions;
- ambiguous/duplicate fields that change the effective downstream decision.

### T-2.5 — internal review gate

Before asking for external review:

- [ ] full repository checks pass for any code/test changes;
- [ ] the contract draft is understandable without requiring the reviewer to know HandoffProbe internals;
- [ ] every test claim is bound to reproducible local evidence;
- [ ] stable attack count remains unchanged unless a separate attack-admission decision has completed;
- [ ] no partnership, endorsement, compatibility or certification language appears;
- [ ] public links contain no customer/private data or secrets.

### T-2.6 — external review handoff

After project-owner approval of the exact public message:

- [ ] publish or expose the reviewable contract/evidence in the public HandoffProbe repository;
- [ ] reply in the existing Indie Hackers thread with the exact public review URL;
- [ ] ask specifically for review of semantic boundaries, not promotion or endorsement;
- [ ] invite the reviewer to identify ambiguous invariants, missing controls or places where NAEOS interprets the boundary differently;
- [ ] do not claim review completion until the reviewer actually responds.

External posting remains supervised and requires explicit approval of the exact message before publication.

### T-2.7 — review outcome and admission decisions

If external review arrives:

- [ ] record each substantive review point;
- [ ] classify it as `ACCEPT / MODIFY / REJECT / NEEDS EVIDENCE` with rationale;
- [ ] update the contract or fixtures only where evidence supports the change;
- [ ] run normal attack-admission discipline for any genuinely distinct security invariant;
- [ ] preserve no-add decisions when existing attacks already cover the case;
- [ ] never treat reviewer participation as product adoption, partnership or endorsement without separate evidence.

## Deliverables

Expected deliverables are:

1. protocol-neutral Handoff Contract draft;
2. overlap matrix against the 22 stable attacks, Phase 9 and T-1;
3. deterministic research fixtures only where justified;
4. reproducible evidence for those fixtures;
5. one public review URL;
6. a written external-review outcome if/when feedback is received;
7. explicit attack-admission/no-add decisions for any proposed new invariant.

## Exit gate

T-2 is complete when:

- a minimal protocol-neutral contract is public and reviewable;
- proposed invariants have been mapped against existing HandoffProbe coverage;
- any retained research cases are deterministic, local/synthetic and evidence-backed;
- the exact review artifact has been shared with `bayu` in the existing Indie Hackers thread after explicit project-owner approval;
- any received review feedback has been recorded and resolved or explicitly left open;
- no unsupported adoption, endorsement, certification or attack-count claim has been introduced.

If no external review is received, the track may still close after a documented review window if the public artifact and internal evidence gates are complete; lack of response must be recorded as `NO EXTERNAL REVIEW RECEIVED`, not silently treated as validation.
