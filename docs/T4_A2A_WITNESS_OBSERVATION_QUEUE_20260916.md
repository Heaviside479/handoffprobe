# T-4 — A2A third-party witness / conduct-observation follow-up

Status: **T-4.5 public result return complete 2026-09-18; WitnessObservation author review recorded; VATE response pending.**
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

Later correction: the line above preserves what the author originally named at the time. Independent inspection and later Oga comments `#5722127484` and `#5728468834` confirmed that `signed.json` and `obs.json` are regenerated gitignored non-source material and are not part of the immutable canonical pin. The canonical pin therefore consists only of tracked source and tests.


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

## Canonical VATE pin supplied 2026-09-17

Takao Sato / `Poke-nushi` then supplied the canonical VATE side for the later T-4 comparison:

- public response: `https://github.com/a2aproject/A2A/issues/1769#issuecomment-5713423719`;
- canonical VATE repository revision: `4a63adb4ade9d6e1affe622744a49056413a8c86`;
- fixed reproduction document: `docs/interop/vaara-execution-reproduction.md`;
- package identity: `docs/interop/vaara-execution-reproduction.package.json`;
- fixed archive: `vate-reproduction-local-draft-01.zip`;
- archive SHA-256: `5f1fe2d4bf656cc02c25c04757180fc3d6111296e157abfc61f5b3e7715d3f7e`;
- manifest SHA-256: `d603a1638ee3160a20dc0cda3b84664ae1de937fd5705b0a35dca1ee2ac82279`;
- pinned VATE source: `a15b9f5e64413f7a1312ec8e9e7731e8ebdb1f60`;
- pinned Vaara source: `cfb5495c0c8d08fb34a99501c670f4ed225e7870`;
- pinned `rfc8785`: `0.1.4`.

The supplied VATE package keeps three comparison properties distinct:

- **Action binding:** changed target arguments are rejected against the authorization before the handler starts; unchanged caller/receiver/hop continuity alone does not prove that the requested action still matches the authorized action.
- **Outcome state:** response loss can leave the caller uncertain about the original attempt without any conflicting witness verdicts; the controller preserves that state and blocks a fresh-permit retry.
- **Reconciliation:** recovery queries the provider about the original attempt and validates execution evidence; merely recomputing the digest of a supplied record does not recover missing execution evidence.

The saved package cases provide concrete reference points:

- `J28` — successful control / `CONFIRMED_SUCCESS`;
- `P93` — changed target rejected before handler execution / `HANDLER_NOT_STARTED`;
- `L64` — response-loss packet stops before reconciliation / `INCOMPLETE`;
- `V17` — success reports exist while acquisition/effect evidence remains incomplete / `INCOMPLETE`.

Scope boundaries must remain explicit:

- this is a single-operator local stdio experiment;
- VATE records in this path are unsigned;
- VATE output hashes are adapter-derived;
- A2A transport is outside the reproduction scope;
- Vaara source in the package is `AGPL-3.0-or-later`, while VATE and `rfc8785` retain Apache-2.0 licensing;
- a matching package hash proves identity of the published package, not independent attestation or production conformance.

With the Oga WitnessObservation commit and this VATE package now both identified, T-4 has canonical author-supplied inputs on both sides. That still does **not** complete T-4.1: after R4 closeout HandoffProbe must independently fetch and preserve the pinned artifacts, verify hashes/provenance/licenses, and only then perform the overlap comparison.

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

- [x] freeze the exact `#1769` comment, author and timestamp;
- [x] pin the exact `horizon-shield` upstream commit used for review;
- [x] preserve the exact `EXTENSION.md`, reference implementation and adversarial-vector/test inputs relevant to the comparison;
- [x] record hashes/digests where practical;
- [x] review repository and file-level license/provenance before copying or adapting any code or vectors;
- [x] record whether the upstream material changed between this queue date and the actual T-4 start.
Completion evidence: [`T4_1_UPSTREAM_FREEZE_20260917.md`](T4_1_UPSTREAM_FREEZE_20260917.md)

## T-4.2 — overlap and boundary analysis

Before implementing any new HandoffProbe case, map the proposal against:

- `HP-AUDIT-001` cross-protocol audit-lineage behavior;
- relevant stable identity, authority, approval, replay and lifecycle attacks;
- Phase 9 crossing/effect evidence;
- T-1 semantic-authority widening;
- the T-2 protocol-neutral separation of Contract Semantics, Attestation / Binding and Runtime Enforcement;
- completed T-3 findings from `#1937` and `#2079`.

Post-T-3 supporting signal for this overlap analysis:

- `chgaowei` added A2A `#1937` comment `#5722725065`: `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5722725065`;
- the comment proposes fail-closed binding of the authenticated acting principal, A2A task/context, target, non-widening scope and validity window;
- it specifically calls out the A2A -> MCP translation boundary, where an apparently attenuated A2A chain can still produce a wider downstream effect, and says binding should be checked again at the tool boundary against the actual caller;
- the resolvable-DID leaf identity described there is source-specific and is explicitly not presented as A2A conformance;
- this comment does not reopen completed T-3 work and does not independently justify a new fixture, stable attack or admission decision;
- it may be used as supporting external input in T-4.2 only where it materially sharpens the existing cross-protocol boundary analysis. If it materially informs a reproducible HandoffProbe result, that result must be returned to `#1937` under the external-evidence return-loop policy.


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

T-4.2 completion evidence: [`T4_2_WITNESS_VATE_OVERLAP_MATRIX_20260918.md`](T4_2_WITNESS_VATE_OVERLAP_MATRIX_20260918.md).

T-4.2 classified eight candidate properties:

- `ALREADY COVERED`: 3;
- `REFINEMENT`: 2;
- `DISTINCT RESEARCH GAP`: 1;
- `OUT OF SCOPE`: 1;
- `NEEDS EVIDENCE`: 1.

The only T-4.3 research fixture currently justified is provider-side reconciliation of the original attempt after response loss. No stable attack is admitted by T-4.2 and the stable corpus remains 23 attacks.

## T-4.3 — smallest deterministic research fixture, only if justified

Status: **COMPLETE — 2026-09-18.**

- [x] implemented only the smallest local/synthetic fixture justified by T-4.2;
- [x] used harmless local fake effects and no unauthorized external systems;
- [x] kept provider execution evidence and actual runtime/effect observations distinct; no WitnessObservation signature layer was introduced into this reconciliation-only fixture;
- [x] included a clean original-attempt reconciliation control;
- [x] included only evidence-backed negative controls for action mismatch, attempt mismatch, missing evidence and provider lookup failure;
- [x] did not duplicate action-binding widening because T-4.2 already classified that property as covered;
- [x] preserved `PASS / FAIL / INCONCLUSIVE / ERROR` semantics and never converted missing evidence into vulnerability `FAIL`;
- [x] ran focused tests plus the normal repository quality/security gate;
- [x] recorded the exact immutable fixture commit and reproducibility evidence.

Completion evidence: `docs/T4_3_PROVIDER_RECONCILIATION_EXECUTION_20260918.md`.

Immutable fixture commit: `07d9c8bf38f1fa5bfa0d61f74d92ffe5232b53ba`.

Verified local result:

- caller state remains `unknown` after response loss even though exactly one protected effect occurred;
- blind fresh execution is blocked while the original outcome is unknown;
- a read-only provider lookup for the same original attempt resolves the caller to `confirmed_success` only when action identity, attempt identity and execution evidence validate;
- reconciliation itself produces zero additional protected effects;
- missing or mismatched evidence remains `INCONCLUSIVE`;
- provider lookup failure remains `ERROR`;
- focused T-4.3 execution passed 8/8 tests;
- full repository validation passed 92/92 test files and 465/465 tests plus build.

This work remains research evidence and does not create a stable attack.
## T-4.4 — explicit admission decision

After the reproducible T-4.3 execution, the explicit decision is:

**DISTINCT RESEARCH CANDIDATE**

Rationale:

- provider-side reconciliation of the original attempt is technically distinct from the duplicate-effect invariant already owned by `HP-REPLAY-003`;
- T-4.3 makes caller outcome uncertainty and read-only recovery of the same original attempt first-class reproducible evidence;
- the fixture does not demonstrate a new stable vulnerability, authorization bypass, duplicate protected effect or protocol defect;
- therefore the result remains a research candidate and requires a separate later normal admission decision before any stable attack could exist.

New stable attack admitted: **no**.

The stable public corpus remains **23 attacks**.

Release triggered: **no**.

T-4.4 completion evidence is recorded in `docs/T4_3_PROVIDER_RECONCILIATION_EXECUTION_20260918.md` using immutable fixture commit `07d9c8bf38f1fa5bfa0d61f74d92ffe5232b53ba`.

T-4.5 is now the next step.
Guardrails:

- no automatic stable attack ID;
- current stable public corpus remains **23 attacks** (`12 P0 + 10 P1 + HP-AUTH-006`) unless a separate normal admission/release decision changes it; T-4 itself does not change that count;
- no release is triggered merely because T-4 completes;
- do not describe a profile-specific policy requirement as normative A2A/MCP behavior without protocol evidence;
- do not claim that a successful signature/digest check proves a witness statement is true;
- do not claim a defect in `horizon-shield`, A2A or another project unless the reproduced evidence supports that narrow claim and responsible disclosure requirements are satisfied.

## T-4.5 — public thread follow-up

Only after the upstream material is frozen and any HandoffProbe comparison is reproducible:

- [x] reply in A2A `#1769` with the exact overlap/result rather than a speculative promise — https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729838541;
- [x] report WitnessObservation-specific findings back to Toshikatsu Oga / `ogasurfproject-jpg`, explicitly referencing the canonical input comment `#5712951510` — returned in https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729838541;
- [x] report VATE-specific reproduction findings back to Takao Sato / `Poke-nushi` in the VATE implementation review issue (`Poke-nushi/Verifiable-Agent-Trust-Envelope#2`), explicitly referencing the canonical VATE input comment `#5713423719` — https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5729853773;
- [x] if a VATE finding changes or informs A2A caller/task/context binding or artifact-carriage requirements, also summarize that result in A2A `#1769` and reference `#5713423719` — cross-comparison returned in https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729838541;
- [x] if a final comparison result spans both WitnessObservation and VATE, post one evidence-backed cross-comparison summary in A2A `#1769` that mentions both authors and links the exact HandoffProbe evidence/commit — https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729838541;
- [x] preserve each authors scope boundaries and do not turn one upstream projects result into a claim about the other;
- [x] distinguish cryptographic provenance/linkage from semantic truth and runtime authorization;
- [x] report exactly what HandoffProbe did and did not test;
- [x] link stable evidence/commit references where useful;
- [x] invite correction if the upstream interpretation is wrong;
- [x] record the substantive WitnessObservation author reply and classify it before final T-4 closeout — https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729937680
  - classification: **CONFIRMATION + CLARIFICATION**;
  - confirmed: compose-rather-than-subsume boundary, no additional signed WitnessObservation fixture required, and provider-side original-attempt reconciliation remains a distinct research candidate;
  - clarification: provider attestation proves attestation and binding, not an independently confirmed world-side effect by itself;
  - supplemental NENRIN revision `62b60205` was mentioned but was not frozen or tested by this T-4 result.
- [ ] record and classify the VATE-specific external response before final T-4 closeout; current state: **PENDING**.

Do not post a HandoffProbe product pitch merely because the thread is active.

## T-4 exit gate

T-4 is complete only when the new `#1769` input has been frozen, overlap-checked against the existing corpus/T-1/T-2/T-3 evidence, any justified fixture is reproducible, an explicit `NO ADD / REFINEMENT / DISTINCT RESEARCH CANDIDATE` decision exists, and any public HandoffProbe follow-up is factual and evidence-backed.

T-4.1 remains queued behind R4 closeout. T-4 as a whole remains open until this exit gate is satisfied.
