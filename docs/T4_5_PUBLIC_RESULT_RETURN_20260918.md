# T-4.5 public result return

Status: **COMPLETE — scoped external author review received from WitnessObservation and VATE; T-4 closed.**

Date: 2026-09-18

## Purpose

Record the public return of the reproducible HandoffProbe T-4 result to the external contributors and threads that materially informed the comparison.

This record does not treat silence as confirmation and does not claim external validation.

## Reproducible HandoffProbe result

- T-4.3 fixture commit: `07d9c8bf38f1fa5bfa0d61f74d92ffe5232b53ba`
- merged T-4.3 / T-4.4 state: `360f3345cf72ca60e0a91a81b91164dad7dd3d2c`
- execution record: `docs/T4_3_PROVIDER_RECONCILIATION_EXECUTION_20260918.md`
- T-4.4 classification: **DISTINCT RESEARCH CANDIDATE**
- new stable attack admitted: **no**
- stable public corpus: **23 attacks**
- release triggered: **no**

## A2A #1769 result return

Public reply:

https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729838541

Recipients / relevant contributors:

- Takao Sato / `Poke-nushi`
- Toshikatsu Oga / `ogasurfproject-jpg`

The reply returns the cross-comparison result spanning VATE and WitnessObservation, links the immutable HandoffProbe fixture and evidence, preserves the upstream scope boundaries, states tested and untested scope, and invites correction or counter-evidence.

## VATE implementation-review result return

Public reply:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5729853773

Recipient:

- Takao Sato / `Poke-nushi`

The reply returns the VATE-specific provider-side original-attempt reconciliation result, links the immutable HandoffProbe fixture and evidence, states the local/synthetic limitations, and invites correction or a stronger counterexample/vector.

## Returned technical result

HandoffProbe reproduced the following narrow property:

- one protected synthetic effect executes;
- caller-facing response loss leaves caller outcome `unknown`;
- blind fresh execution is not accepted as recovery;
- recovery queries the provider read-only for the original attempt;
- logical action identity, attempt identity and execution evidence must validate;
- valid evidence resolves the caller to `confirmed_success`;
- reconciliation produces zero additional protected effects;
- missing or mismatched evidence remains `INCONCLUSIVE`;
- provider lookup failure remains `ERROR`.

WitnessObservation R1-R4 were not treated as provider execution reconciliation or authorized-action equivalence. No additional signed WitnessObservation fixture was required for this T-4 result.

## External response state

Current state: **COMPLETE — scoped external author review received from WitnessObservation and VATE.**

### WitnessObservation response

Public response:

https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729937680

Author:

- Toshikatsu Oga / `ogasurfproject-jpg`

Classification: **CONFIRMATION + CLARIFICATION**.

Oga confirmed that:

- the WitnessObservation / execution-reconciliation boundary used by HandoffProbe is correct;
- WitnessObservation R1-R4 cover observation, integrity, continuity and non-suppressed disagreement;
- provider execution evidence and authorized-action equivalence belong to a separate execution-binding layer;
- the layers compose rather than subsume one another;
- no additional signed WitnessObservation fixture was required for the T-4 result;
- provider-side original-attempt reconciliation is the right general model;
- keeping the result as a distinct research candidate rather than directly creating a stable attack is appropriate to the reviewed boundary.

Oga added an important clarification:

A provider-signed attestation bound to the original logical action ID and attempt ID proves attestation and binding. It does not by itself prove an independently confirmed world-side effect.

The current HandoffProbe fixture separately measures its local synthetic protected effect through HandoffProbe-owned runtime/effect evidence. The clarification therefore does not invalidate the local fixture; it limits generalization to production provider evidence.

Oga also referenced supplemental NENRIN revision `62b60205`. HandoffProbe has not frozen or executed that newer artifact as part of this T-4 result.

### VATE response

Public response:

https://github.com/a2aproject/A2A/issues/1769#issuecomment-5732275655

Author:

- Takao Sato / `Poke-nushi`

Classification: **CONFIRMATION + CLARIFICATION**.

Poke-nushi reviewed the pinned T-4 closeout and stated that the separation of action binding, unknown caller outcome and original-attempt reconciliation matches the VATE points previously raised in the thread.

The review specifically recognizes the reported local recovery behavior:

- reconciliation checks evidence against the original action and attempt;
- missing or mismatched evidence remains unresolved;
- reconciliation produces no additional protected effect;
- the provider report remains distinct from the synthetic protected effect measured by HandoffProbe.

The review also preserves an important A2A boundary:

- action, attempt and evidence-source references can remain available to the receiver;
- A2A task state remains distinguishable from evidence about an external operation's outcome;
- the receiver remains responsible for assessing what the referenced evidence establishes.

This is scoped author review of the reported HandoffProbe result. It is **not** an independent rerun of HandoffProbe.

It does not establish A2A or VATE conformance, production-world reconciliation, certification, endorsement or independent confirmation of a real-world side effect.

### Post-closeout VATE issue-specific acknowledgement

After the A2A-side VATE author review, Poke-nushi also responded in the canonical VATE implementation-review issue:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5733113059

The response links an immutable VATE-side technical review record:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/blob/60c8c7c9cf89fc6011eb95f9d67b5d25233338b7/docs/interop/handoffprobe-reconciliation-review.md

That record preserves the three-property comparison, the pinned HandoffProbe sources, the reported local result and the scope boundary. It explicitly states that source/package correspondence was checked and that the HandoffProbe tests were **not rerun** by the VATE maintainer.

HandoffProbe acknowledged that issue-specific record here:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5733216447

This is additional reciprocal provenance and scoped author acknowledgement. It does not change the evidence level, does not constitute an independent rerun and does not reopen T-4.

Canonical HandoffProbe closeout PR:

https://github.com/Heaviside479/handoffprobe/pull/121

That PR now carries explicit full links to both A2A #1769 and VATE #2, and the external GitHub timelines expose the corresponding HandoffProbe cross-reference events.

### Final T-4 closeout

Both materially relevant external review paths now have substantive responses:

- WitnessObservation: **CONFIRMATION + CLARIFICATION**;
- VATE: **CONFIRMATION + CLARIFICATION**.

T-4 is therefore closed as a completed scoped external-review research result.

The T-4.4 admission decision remains unchanged:

**DISTINCT RESEARCH CANDIDATE / NO STABLE ATTACK ADD**

The stable public corpus remains **23 attacks**.

Package version remains `0.4.0`.

No release is triggered.
