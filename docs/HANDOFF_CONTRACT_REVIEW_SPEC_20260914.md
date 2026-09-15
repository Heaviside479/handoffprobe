# Protocol-neutral Handoff Contract review spec

Status: active research track
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

Status: **COMPLETE — 2026-09-15**

- [x] draft the protocol-neutral contract with explicit separation of contract semantics, attestation / binding and runtime enforcement;
- [x] evaluate authority / capability monotonicity;
- [x] evaluate replay and logical-action uniqueness;
- [x] evaluate provenance continuity and mutation visibility;
- [x] evaluate canonicalization / version interpretation consistency;
- [x] evaluate ambiguity / duplicate-field interpretation;
- [x] document PASS, FAIL, INCONCLUSIVE / ERROR, overlap and protocol-evidence boundaries for every candidate.

Evidence: `docs/PROTOCOL_NEUTRAL_HANDOFF_CONTRACT_DRAFT_20260915.md`.

Completion of T-2.2 does not admit a new attack or authorize implementation. T-2.3 overlap classification remains mandatory before any new research case.

### T-2.3 — build an overlap matrix before implementation

Status: **COMPLETE — 2026-09-15**

- [x] map every proposed contract invariant against all 22 stable attacks;
- [x] map against Phase-9 crossing-corpus evidence;
- [x] map authority/capability items against the T-1 semantic-authority-widening decision;
- [x] classify each row as `ALREADY COVERED / REFINEMENT / DISTINCT RESEARCH CANDIDATE / OUT OF SCOPE`;
- [x] do not assign new attack IDs during this step.

Evidence: `docs/T2_3_HANDOFF_CONTRACT_OVERLAP_MATRIX_20260915.md`.

T-2.3 retains exactly two candidates for deterministic T-2.4 research: canonicalization/version interpretation consistency and ambiguous/duplicate-field interpretation. This is research admission only and does not create stable attack IDs.

### T-2.4 — deterministic research cases

Status: **COMPLETE — 2026-09-15**

Only the two rows retained by T-2.3 were implemented:

- `T2-CANONICALIZATION-VERSION`;
- `T2-AMBIGUOUS-DUPLICATE-FIELD`.

- [x] create the smallest local/synthetic PASS fixture;
- [x] create the smallest local/synthetic FAIL fixture;
- [x] add a control case where representation changes but equivalent trusted enforcement preserves the invariant, when applicable;
- [x] keep execution deterministic and no-paid;
- [x] capture structured HandoffProbe-owned research evidence without forcing premature Phase-9/runtime integration;
- [x] keep research-case naming separate from stable HP attack IDs until admission.

Evidence: `docs/T2_4_DETERMINISTIC_RESEARCH_CASES_20260915.md`.

Validation completed with 76 test files / 397 tests passing. The two focused research suites contain 12 deterministic tests total. The research modules remain outside the public package/API/CLI/Action build surface.

T-2.4 admits zero stable attacks, leaves the stable corpus at 22, leaves package version `0.3.0` unchanged and does not authorize a release/version bump.

### T-2.5 — internal review gate

Status: **COMPLETE — 2026-09-15**

Before asking for external review:

- [x] full repository checks pass for all code/test changes;
- [x] the contract draft is understandable without requiring the reviewer to know HandoffProbe internals, with a compact review packet as the entry point;
- [x] every test claim is bound to reproducible local evidence;
- [x] the stable attack count remains 22, with the eight backlog candidates counted separately;
- [x] no unsupported affirmative partnership, endorsement, compatibility, certification, adoption or external-validation claim appears; explicit disclaimer/non-goal language is permitted and required;
- [x] the public review packet contains no customer/private data or secrets.

Evidence: `docs/T2_5_INTERNAL_REVIEW_GATE_20260915.md`.

Review packet: `docs/T2_5_REVIEW_PACKET_20260915.md`.

T-2.5 authorizes T-2.6 preparation only. It does not authorize external posting or reviewer contact by itself. The exact T-2.6 public message still requires explicit project-owner approval before publication.

### T-2.6 — external review handoff

Status: **COMPLETE — 2026-09-15**

After project-owner approval of the exact public message:

- [x] publish or expose the reviewable contract/evidence in the public HandoffProbe repository;
- [x] reply in the existing Indie Hackers thread with the exact public review URL;
- [x] ask specifically for review of semantic boundaries, not promotion or endorsement;
- [x] invite the reviewer to identify ambiguous invariants, missing controls or places where NAEOS interprets the boundary differently;
- [x] do not claim review completion until the reviewer actually responds.

Evidence: `docs/T2_6_EXTERNAL_HANDOFF_20260915.md`.

The exact public message was explicitly approved by the project owner before publication. The project owner confirmed publication in the existing Indie Hackers thread on 2026-09-15.

Publication completes the external handoff only. It does not constitute external validation, compatibility, adoption, partnership, certification or endorsement.

### T-2.7 — review outcome and admission decisions

Status: **WAITING FOR RESPONSE**

If external review arrives:

- [ ] record each substantive review point;
- [ ] classify it as `ACCEPT / MODIFY / REJECT / NEEDS EVIDENCE` with rationale;
- [ ] update the contract or fixtures only where evidence supports the change;
- [ ] run normal attack-admission discipline for any genuinely distinct security invariant;
- [ ] preserve no-add decisions when existing attacks already cover the case;
- [ ] never treat reviewer participation as product adoption, partnership or endorsement without separate evidence.

No T-2.7 technical or release decision is made while the external review request is unanswered.

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
