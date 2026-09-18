# T-4.5 public result return

Status: **PUBLIC RESULT RETURN COMPLETE — external response classification pending.**

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

Current state: **PARTIAL EXTERNAL REVIEW RECEIVED — WitnessObservation reviewed; VATE response pending.**

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

Current state: **PENDING**.

No substantive response to the VATE-specific result return has been recorded yet.

Silence is not treated as agreement or confirmation.

T-4 remains open only for the VATE response classification and final closeout.
