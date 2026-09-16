# T-3.4 late external follow-up — Arjun / A2A #1937

Status: **RECORDED — event-triggered follow-up after T-3.4**  
Date: 2026-09-16

## Purpose

Record the substantive external response received after the existing T-3.4 public comparison reply without rewriting, renumbering or interrupting the active T-3 execution sequence.

This note is an append-only roadmap addendum. It does not replace `docs/ROADMAP.md`, does not change the T-3.6 next step, does not alter T-4, and does not authorize a new stable attack, release or public conformance claim.

## External follow-up

Public A2A thread:

- issue: `a2aproject/A2A#1937`;
- author: Arjun / `arjun2075`;
- response: `https://github.com/a2aproject/A2A/issues/1937#issuecomment-5697862002`.

Arjun responded after the HandoffProbe V1–V13 comparison had been executed, documented, merged and replied to publicly.

His response states that:

- the reproducible comparison is the kind of use he hoped the vectors would enable;
- the observed results appear consistent with the draft's intended runtime semantics;
- the V10 distinction is useful: an indeterminate comparison must block the protected effect while the scanner may correctly classify the observation as `INCONCLUSIVE` or `ERROR` rather than manufacturing a vulnerability `FAIL`;
- the V3 and V13 results help bound the claims around explicit task-bound versus context-bound behavior and per-effect authorization within one task/context;
- the limitations are correctly preserved: this is implementation evidence about the proposed boundary and invariants, not A2A acceptance of the draft and not conformance certification;
- he intends to preserve those distinctions in later revisions.

## Classification

This is a **qualified external technical/reviewer signal and substantive deep technical dialogue**.

It is evidence that an external draft author reviewed the published HandoffProbe comparison and considered the observed results consistent with the draft's intended runtime semantics.

It is **not** evidence of:

- A2A specification acceptance;
- A2A endorsement of HandoffProbe;
- conformance certification;
- HandoffProbe adoption or production use;
- partnership;
- commercial demand;
- a new stable attack or release requirement.

## Roadmap effect

- T-3.4's previously documented event-triggered follow-up condition is now satisfied by a substantive external response.
- Record this response in the eventual T-3.8 combined closeout.
- No new implementation is justified solely by this reply.
- T-3.6 remains the next active technical execution step.
- T-3.7 and T-3.8 retain their existing gates.
- T-4 remains queued and must not be pulled forward because of this response.
- Stable public corpus remains 22 attacks unless the normal admission/release process separately changes it.

## Public communication rule

A concise public acknowledgement to Arjun is appropriate because it closes the feedback loop and preserves the external technical relationship.

Any later HandoffProbe communication may accurately say that an external draft author reviewed the reproducible comparison and said the results appear consistent with the draft's intended runtime semantics, provided the same communication also preserves the limits above.

Do **not** summarize this as "A2A validated HandoffProbe", "A2A certified HandoffProbe", "official A2A conformance", or any equivalent claim.

For broader visibility, prefer linking the reproducible artifact and public thread over marketing-only claims. The evidence should remain primary; social or website distribution should be secondary and accurately scoped.

## Closeout requirement

T-3.8 must reference this late external response and distinguish:

1. reproducible HandoffProbe implementation evidence;
2. external reviewer/draft-author interpretation of that evidence;
3. what remains unproven or outside scope.

No additional attack admission, release or compatibility claim follows automatically from this addendum.
