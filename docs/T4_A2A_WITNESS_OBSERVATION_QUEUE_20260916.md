# T-4 — A2A third-party witness / conduct-observation follow-up

Status: **READY — T-3 complete 2026-09-16; T-4.1 NEXT.**
Date queued: 2026-09-16

Current scheduling note — 2026-09-17: the historical readiness marker above is preserved as part of the T-3 closeout record. Operationally, T-4.1 remains queued until the R4/v0.4.0 release closeout is complete; the canonical WitnessObservation pin identified below does not by itself complete T-4.1.

## Purpose

Capture the new A2A `#1769` technical input without changing the currently executing T-3 implementation scope.

T-3 is complete. This T-4 item remained intentionally separate while T-3 was active so the external comment could not create mid-implementation scope creep, rewrite the T-3 evidence plan, or disturb the frozen Bayu T-2 review packet.

T-4.1 remains queued behind the R4/v0.4.0 release closeout. Once that closeout is complete, T-4.1 begins from the clean post-R4 baseline. The frozen Bayu T-2 review packet remains independent and must still not be rewritten by this track.

## External input

Public A2A thread:

- issue: `a2aproject/A2A#1769`;
- new comment by Toshikatsu Oga / `ogasurfproject-jpg`:
  `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5694467702`;
- linked draft repository/artifact:
  `ogasurfproject-jpg/horizon-shield` → `workers/hs-ledger/nenrin/task-delegation-bind-v0/EXTENSION.md`.

The commenter describes an adjacent draft verifier profile for an **independent third-party conduct observation** bound to a specific A2A task and delegation hop.

Reported shape includes:

- `WitnessObservation = { task_id, hop, prev_evidence_id, conduct verdict, witness_id, witness_sig, edge_sig, evidence_id }`;
- `evidence_id` derived from a canonical preimage digest;
- witness independence from the hop endpoints;
- delegation/evidence continuity across hops;
- disagreement preservation rather than collapsing conflicting witness verdicts to a favorable result;
- Ed25519 signatures and offline key matching;
- a reported reference implementation plus 21 adversarial tests covering cases such as self-witness, bind swap, hidden hop, forged edge, cross-task replay and post-sign tamper.

The author explicitly states that the work is a **draft**, is not yet wired into a live service, and is not yet independently outsider-verified beyond its published specification and tests. Signatures/digests establish who asserted something and how artifacts are linked; they do not prove that a conduct assertion is true.

This is qualified external technical input, not HandoffProbe adoption, A2A specification acceptance, interoperability certification, partnership, endorsement, commercial demand or proof of a vulnerability.

## Canonical WitnessObservation pin supplied 2026-09-17

After HandoffProbe requested an exact immutable upstream revision rather than inferring from a moving branch, Toshikatsu Oga supplied the canonical WitnessObservation side for the later T-4 comparison:

- public pin response: `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5712951510`;
- canonical upstream commit: `4d7c9c270c2846465fafdea9833869c5660c4ae2`;
- canonical path: `workers/hs-ledger/nenrin/task-delegation-bind-v0/`;
- named artifacts at that commit: `EXTENSION.md`, `bind.mjs`, `sign.mjs`, and the frozen signed example `signed.json`.

The author also mapped concrete adversarial inputs onto the seams HandoffProbe proposed to test:

- third-party observation binding: `A1 self-witness rejected (R1)` and `S1 spoofed witness rejected`;
- hop continuity: `A4 hidden hop breaks chain continuity`, `A4b forged prev pointer breaks chain`, `S2 forged edge (signed by receiver, not delegator) rejected`, plus the cross-language two-hop `prod-t2 chain continuous` case;
- disagreement preservation: `A3 full witness set yields disagreement`, the suppressed-subset `A3` case, and `S4 post-sign verdict tamper rejected`;
- cross-implementation canonicalization: `cross_lang_test` feeds Python-produced observations into the JS ledger recomputation and requires matching canonical bytes for acceptance.

Important scope limits supplied by the author must be preserved:

- R1 establishes only that `witness_id` is structurally distinct from `hop.from` and `hop.to`; it does **not** prove organizational or social non-affiliation;
- the specific response-loss / caller-outcome-unknown case has **no dedicated WitnessObservation v0 vector yet**; this remains a real comparison gap rather than coverage that HandoffProbe may infer;
- the VATE artifact belongs to Takao Sato / `Poke-nushi`, so its canonical revision must be frozen independently;
- the WitnessObservation work remains a draft whose vectors pass but which is not yet outsider-validated; signatures and digests prove assertion/linkage, not semantic truth.

HandoffProbe acknowledged those boundaries and the canonical pin here:
`https://github.com/a2aproject/A2A/issues/1769#issuecomment-5713030346`.

This author-supplied pin is a T-4 freeze input, not completion of T-4.1 by itself. T-4.1 must still independently fetch/preserve the pinned material, record hashes where practical, check provenance/license, and freeze the VATE side before overlap or implementation decisions.

## Why this is separate from T-3

T-3 currently owns two concrete external follow-ups:

1. Arjun / A2A `#1937` context-binding vectors;
2. giskard09 / A2A `#2079` real cA2A delegation-chain shape vs downstream translated effective request.

Those work packages are already being implemented and have their own frozen inputs, overlap decisions, deterministic evidence requirements and public-reply gates.

The new `#1769` witness-observation proposal is adjacent but materially different. It concerns independent observation / evidence provenance / disagreement preservation rather than the exact T-3.3 and T-3.5–T-3.7 work already underway.

Therefore:

- **do not add new T-3.3 cases because of this comment**;
- **do not change the T-3.3 acceptance/exit criteria**;
- **do not delay the planned #1937 or #2079 replies merely to absorb this new input**;
- **do not modify the Bayu T-2 review packet**;
- evaluate this proposal only after the current T-3 scope has produced its planned evidence.

## T-4.1 — freeze exact upstream material

Once R4 closeout is complete:

- [ ] freeze the exact `#1769` comment, author and timestamp;
- [ ] pin the exact `horizon-shield` upstream commit used for review;
- [ ] preserve the exact `EXTENSION.md`, reference implementation and adversarial-vector/test inputs relevant to the comparison;
- [ ] record hashes/digests where practical;
- [ ] review repository and file-level license/provenance before copying or adapting any code or vectors;
- [ ] record whether the upstream material changed between this queue date and the actual T-4 start.

## T-4.2 — overlap and boundary analysis

Before implementing any new HandoffProbe case, map the proposal against:

- `HP-AUDIT-001` cross-protocol audit-lineage behavior;
- relevant stable identity, authority, approval, replay and lifecycle attacks;
- Phase 9 crossing/effect evidence;
- T-1 semantic-authority widening;
- the T-2 protocol-neutral separation of Contract Semantics, Attestation / Binding and Runtime Enforcement;
- completed T-3 findings from `#1937` and `#2079`.

At minimum, answer these questions:

- What security property does an independent witness add beyond signed lineage/provenance already represented elsewhere?
- Is witness independence itself a handoff-specific invariant or only a policy choice of the external profile?
- Can all signatures/digests/linkage validate while the actual downstream action still exceeds the authority that should have governed it?
- Can a validly linked observation remain misleading or false without cryptographic failure?
- Does disagreement preservation expose a distinct failure class, or is it already representable as audit/evidence loss or mutation?
- Does a hidden/forged hop remain distinct after existing chain-continuity and replay coverage is considered?

Classify each candidate property as:

`ALREADY COVERED / REFINEMENT / DISTINCT RESEARCH GAP / OUT OF SCOPE / NEEDS EVIDENCE`.

No code is justified before this overlap map exists.

## T-4.3 — smallest deterministic research fixture, only if justified

If T-4.2 finds a real HandoffProbe-specific evidence gap:

- [ ] implement only the smallest local/synthetic fixture needed to demonstrate it;
- [ ] use harmless fake effects and no unauthorized external systems;
- [ ] keep observer assertions, cryptographic linkage and actual runtime/effect observations distinct in evidence;
- [ ] include a clean control where signatures/linkage and runtime behavior agree;
- [ ] include only evidence-backed negative controls;
- [ ] where relevant, include a case in which witness/signature/linkage is structurally valid but the downstream effective request or effect violates the governing authority;
- [ ] preserve `PASS / FAIL / INCONCLUSIVE / ERROR` semantics and never convert missing evidence into a vulnerability `FAIL`;
- [ ] run focused tests plus normal repository quality/security gates;
- [ ] record exact commit, fixture inputs and reproducibility evidence.

This work remains research/conformance evidence unless the normal attack-admission process independently justifies a product change.

## T-4.4 — explicit admission decision

After any justified execution, decide one of:

- `NO ADD`;
- `REFINEMENT` of an existing stable attack/evidence path;
- `DISTINCT RESEARCH CANDIDATE` requiring a separate later admission decision.

Guardrails:

- no automatic stable attack ID;
- current stable public corpus remains **23 attacks** (`12 P0 + 10 P1 + HP-AUTH-006`) unless a separate normal admission/release decision changes it; T-4 itself does not change that count;
- no release is triggered merely because T-4 completes;
- do not describe a profile-specific policy requirement as normative A2A/MCP behavior without protocol evidence;
- do not claim that a successful signature/digest check proves a witness statement is true;
- do not claim a defect in `horizon-shield`, A2A or another project unless the reproduced evidence supports that narrow claim and responsible disclosure requirements are satisfied.

## T-4.5 — public thread follow-up

Only after the upstream material is frozen and any HandoffProbe comparison is reproducible:

- [ ] reply in A2A `#1769` with the exact overlap/result rather than a speculative promise;
- [ ] distinguish cryptographic provenance/linkage from semantic truth and runtime authorization;
- [ ] report exactly what HandoffProbe did and did not test;
- [ ] link stable evidence/commit references where useful;
- [ ] invite correction if the upstream interpretation is wrong;
- [ ] record any substantive reply and classify it before further implementation.

Do not post a HandoffProbe product pitch merely because the thread is active.

## T-4 exit gate

T-4 is complete only when the new `#1769` input has been frozen, overlap-checked against the existing corpus/T-1/T-2/T-3 evidence, any justified fixture is reproducible, an explicit `NO ADD / REFINEMENT / DISTINCT RESEARCH CANDIDATE` decision exists, and any public HandoffProbe follow-up is factual and evidence-backed.

T-4.1 remains queued behind R4 closeout. T-4 as a whole remains open until this exit gate is satisfied.
