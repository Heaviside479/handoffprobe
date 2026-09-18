# T-4.2 WitnessObservation / VATE overlap and boundary analysis

Status: **COMPLETE — 2026-09-18; T-4.3 NEXT.**

Date: 2026-09-18

## Purpose

Classify the frozen WitnessObservation and VATE properties against existing HandoffProbe stable attacks and completed research evidence before any T-4.3 implementation decision.

This document does not create a stable attack, change the public corpus, authorize a release, or claim A2A, WitnessObservation or VATE conformance.

The stable public corpus remains exactly **23 attacks**.

## Frozen input

Primary frozen input:

- `docs/T4_1_UPSTREAM_FREEZE_20260917.md`
- canonical WitnessObservation pin: `4d7c9c270c2846465fafdea9833869c5660c4ae2`
- supplemental boundary vector: `4828da51cf3c865b989ede27a0d15d2acc234e25`
- canonical VATE reproduction revision: `4a63adb4ade9d6e1affe622744a49056413a8c86`

Oga later confirmed the frozen WitnessObservation scope and corrected the earlier `signed.json` reference in A2A `#1769` comment `#5722127484`.

Oga subsequently reiterated the same boundary in comment `#5728468834`: `4d7c9c27` remains canonical, `signed.json` / `obs.json` remain regenerated non-source material, `4828da51` remains supplemental, and no additional signed fixture will be produced unless this analysis identifies a concrete property requiring one.


Gaowei comment `#5722725065` from the already-completed A2A `#1937` track is supporting input only. It does not reopen T-3.

## Classification vocabulary

`ALREADY COVERED` means existing stable or completed research/runtime evidence directly represents the security property strongly enough that T-4 does not need another research property.

`REFINEMENT` means the governing property already exists but the external input adds useful evidence-state or recovery precision.

`DISTINCT RESEARCH GAP` means current HandoffProbe evidence does not directly model the property and a narrow local synthetic fixture may be justified.

`OUT OF SCOPE` means the property is profile-specific or otherwise does not by itself establish a HandoffProbe handoff/composition security invariant.

`NEEDS EVIDENCE` means the input identifies a potentially relevant distinction, but current evidence does not yet establish a concrete handoff security consequence sufficient to justify implementation.

## Existing HandoffProbe baseline

- `HP-AUTH-001` and T-1 own semantic authority monotonicity: effective downstream authority must not exceed upstream delegated authority.
- stable approval and target attacks already bind protected action, tool, payload and resource semantics.
- `HP-AUTH-005` covers security-relevant delegation-chain truncation.
- `HP-AUDIT-001` covers trustworthy end-to-end correlation from original principal through A2A delegation and MCP request to protected side effect.
- `HP-REPLAY-003` already models a protected effect whose acknowledgement is lost, followed by a retry of the same logical action.
- `HP-RACE-002` covers stale execution after an interrupted handoff is resumed.
- Phase 9 records actual caller, task, context, audience, tool and arguments at the real pre-dispatch boundary and keeps the synthetic effect recorder outside the verifier.
- completed T-3 `#1937` evidence covers caller/task/context/target/scope/status binding and fail-closed runtime behavior.
- completed T-3 `#2079` evidence demonstrates that a cryptographically valid upstream delegation shape can still require separate downstream translation-containment enforcement.

## Decision matrix

| Candidate property | Most relevant existing evidence | Classification | T-4 consequence |
| --- | --- | --- | --- |
| R1 structural witness distinctness from hop endpoints | No stable HandoffProbe invariant requires a third-party witness. Oga explicitly limits R1 to key-level distinctness and not organizational/operator independence. | **OUT OF SCOPE** | Treat as WitnessObservation profile policy unless later evidence demonstrates a composition-security consequence. Do not create a HandoffProbe case solely for R1. |
| R2 evidence-id recomputation / record integrity | Phase 9 already authenticates authority artifacts, recomputes binding material and preserves exact provenance; HandoffProbe separately verifies evidence identity and runtime effects. | **ALREADY COVERED** | Reuse evidence-integrity discipline. Do not mislabel digest recomputation as provider execution reconciliation. |
| R3 delegation/evidence hop continuity | `HP-AUTH-005`, `HP-AUDIT-001` and Phase 9 stage-link evidence already cover missing, substituted or discontinuous security-relevant lineage. | **ALREADY COVERED** | Hidden-hop and forged-prev-pointer examples are useful comparison controls but do not justify another research property. |
| R4 preservation of conflicting witness verdicts | HandoffProbe preserves structured result semantics, but existing stable/runtime evidence does not model a set of independent witness verdicts whose disagreement is selectively suppressed. No protected-effect consequence has yet been demonstrated. | **NEEDS EVIDENCE** | Do not implement yet. Revisit only if a concrete disagreement-suppression handoff can be tied to a protected decision/effect. |
| Cryptographically valid linkage while the conduct assertion is false or misleading | HandoffProbe already separates provenance from semantic truth and keeps the Phase 9 effect recorder outside the verifier. The threat model likewise separates computation/integrity evidence from input truth and authorization continuity. | **REFINEMENT** | Preserve this distinction explicitly in T-4 evidence. A valid signature/link does not promote an assertion to runtime truth. No separate attack is justified by this distinction alone. |
| Authorized-action equivalence at the final A2A -> MCP boundary | `HP-AUTH-001`, `HP-TARGET-001`, `HP-APPROVAL-001/002/003`, Phase 9 tool/argument binding, T-1 semantic authority and completed T-3 `#1937/#2079` evidence directly cover this boundary. | **ALREADY COVERED** | WitnessObservation v0 being silent on action equivalence is an upstream scope boundary, not a HandoffProbe gap. Reuse current authority/effect evidence. |
| Caller outcome state after response loss | `HP-REPLAY-003` already executes the first protected effect, loses the acknowledgement and tests a retry; `HP-RACE-002` covers interrupted stale execution. HandoffProbe does not currently make the callers unknown-original-outcome state a first-class research result. | **REFINEMENT** | If T-4.3 proceeds, preserve original-outcome uncertainty explicitly instead of collapsing it into success or failure. Do not duplicate the existing retry-double-effect invariant. |
| Provider-side reconciliation of the original attempt after response loss | Existing `HP-REPLAY-003` prevents duplicate effects but does not require a read-only provider query for the original attempt followed by validation of execution evidence. `HP-RACE-002` revalidates current security state but does not recover the original attempts outcome. | **DISTINCT RESEARCH GAP** | A smallest local/synthetic T-4.3 fixture is justified for original-attempt reconciliation only. It must not duplicate retry, replay or stale-resume coverage. |

## Required T-4.2 questions

### What does an independent witness add beyond existing signed lineage?

It adds an additional observation source and potentially preserves disagreement between observers. The frozen R1 rule itself proves only structural key distinctness, not actual operator independence. HandoffProbe therefore does not treat R1 alone as a new handoff invariant.

### Is witness independence itself handoff-specific?

Not on the frozen evidence. Requiring a particular independent observer is a profile/policy choice unless a concrete composition failure depends on that independence.

### Can signatures and linkage validate while downstream action exceeds authority?

Yes. The supplemental WitnessObservation boundary vector demonstrates that its v0 evidence identity is silent on authorized-action match, while HandoffProbe T-1, Phase 9 and T-3 already model the downstream authority/effect boundary separately.

### Can a validly linked observation remain misleading or false?

Yes. Cryptographic provenance establishes who asserted a record and how it links; it does not establish semantic truth. HandoffProbe already keeps verifier assertions separate from independently observed runtime/effect evidence.

### Is disagreement preservation a distinct failure class?

Current evidence is insufficient to decide that as a HandoffProbe attack property. Selective suppression may matter, but T-4 currently lacks a demonstrated protected-decision or protected-effect consequence. Classification remains `NEEDS EVIDENCE`.

### Is a hidden or forged hop distinct from existing coverage?

No current distinct gap is demonstrated. Security-relevant hop removal/substitution overlaps `HP-AUTH-005`, `HP-AUDIT-001` and Phase 9 chain/stage-link evidence.

## VATE boundary result

VATE contributes three useful comparison dimensions that must remain separate:

1. action binding;
2. caller outcome state after response loss;
3. provider-side reconciliation of the original attempt.

Action binding is already covered by HandoffProbe.

Caller outcome state is a refinement of existing retry/partial-failure evidence.

Provider-side original-attempt reconciliation is the only property in this T-4.2 review currently classified as a `DISTINCT RESEARCH GAP`.

## T-4.3 admission boundary

T-4.2 justifies at most one new research fixture:

**original-attempt provider reconciliation after response loss**.

The smallest acceptable fixture should:

- execute one local synthetic protected action;
- lose the caller-facing response after the effect has occurred;
- retain an explicit caller state that the original outcome is unknown;
- prevent a blind fresh execution from being treated as recovery;
- perform a read-only provider-side lookup for the original attempt;
- validate returned execution evidence against the original logical action / attempt identity;
- resolve the caller state only from that reconciliation evidence;
- retain exact effect-counter evidence proving whether the original action executed;
- include a clean reconciliation control and evidence-backed negative controls;
- remain local, deterministic and synthetic.

This fixture must not claim production VATE conformance, must not copy upstream implementation code, and must not create a stable attack ID through T-4.3.

No additional Oga signed fixture is currently required: the WitnessObservation canonical source plus the supplemental boundary vector are sufficient for this overlap decision. A separate signed record should be requested only if later execution identifies a specific evidence gap that requires it.

## T-4.2 decision

Exactly eight candidate properties are classified:

- `ALREADY COVERED`: **3**;
- `REFINEMENT`: **2**;
- `DISTINCT RESEARCH GAP`: **1**;
- `OUT OF SCOPE`: **1**;
- `NEEDS EVIDENCE`: **1**.

No new stable attack is admitted.

The stable public corpus remains **23 attacks**.

T-4 may proceed to T-4.3 only for the narrowly identified provider-side original-attempt reconciliation gap. Disagreement preservation remains unimplemented unless later concrete evidence establishes a handoff-specific protected-effect consequence.
