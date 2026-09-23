# Sanction Gate #2 stale-authority / effect-time signal

Date: 2026-09-23

Status: **FROZEN / OVERLAP COMPLETE — EXTERNAL TECHNICAL VALIDATION / TRACEABILITY SIGNAL — NO NEW STABLE ID**

## External source freeze

Primary external record:

https://github.com/math-r-association/sanction-gate/issues/2

Frozen issue metadata:

- issue: `math-r-association/sanction-gate#2`;
- title: `Sanction currency at effect time (stale-authority reuse)`;
- author: `01ehex`;
- created: `2026-09-23T02:23:50Z`;
- state at freeze: open.

Originating A2A proposal:

https://github.com/a2aproject/A2A/issues/2250

Sanction Gate explicitly records that the stale-authority / effect-time point was raised by `@Heaviside479` in A2A `#2250`.

HandoffProbe maintainer acknowledgement:

https://github.com/math-r-association/sanction-gate/issues/2#issuecomment-5791932004

Frozen acknowledgement metadata:

- comment ID: `5791932004`;
- author: `Heaviside479`;
- created: `2026-09-23T08:55:28Z`.

## External technical signal

The external record separates three properties:

1. the sanction artifact is authentic and structurally valid;
2. the sanction remains current for the exact action and context at effect time;
3. the effective action immediately before execution still matches the sanctioned `proposalHash`.

The important boundary is that historical decision evidence is not itself current authority for a later protected effect.

Sanction Gate describes the candidate conformance vector, once its semantics are written, as:

`sanction admitted -> action held before effect -> sanction withdrawn or superseded -> same action resumes -> zero protected effects`

The external record also states that withdrawal ordering and execution-boundary semantics still need to be defined.

At this freeze point:

- no Sanction Gate reference implementation exists;
- no executable Sanction Gate conformance vector is available;
- no validated Sanction Gate conformance result exists.

## HandoffProbe classification

Classification:

**EXTERNAL TECHNICAL VALIDATION / TRACEABILITY SIGNAL — REFINEMENT / NO NEW STABLE ID**

This is meaningful design-level external traceability because another project has promoted the effect-time authority boundary raised in A2A `#2250` into its own explicit technical issue and decomposed the same security properties.

It is not:

- HandoffProbe adoption;
- Sanction Gate adoption of HandoffProbe as tooling;
- independent HandoffProbe reproduction;
- Sanction Gate conformance;
- HandoffProbe conformance with Sanction Gate;
- evidence of a deployed vulnerability;
- an independently validated implementation result;
- a new stable attack.

No completed `EVIDENCE.md` evidence-level promotion is made from this signal alone.

## Overlap analysis

### HP-RACE-002 — governing same-action stale-state invariant

The proposed Sanction Gate vector holds one logical action before its protected effect, changes the governing authority state, and then resumes that same logical action.

That shape is primarily governed by:

`HP-RACE-002 — Partial-failure stale execution`

The relevant invariant is that a resumed protected operation must revalidate current security state before the protected effect rather than execute from stale captured authority or approval state.

The fact that the stale state is represented by a sanction receipt or sanction decision does not by itself create a new failure class.

### HP-AUTH-006 — adjacent but not governing

`HP-AUTH-006 — Stale task authorization reused for later effect` requires a different shape:

1. an earlier protected effect completes legitimately;
2. governing authority later becomes non-current;
3. a later **distinct protected effect** is attempted in the same task/run/context.

Sanction Gate issue `#2` instead proposes holding the same action before its first protected effect and resuming that action after the sanction is withdrawn or superseded.

Therefore `HP-AUTH-006` is adjacent authorization-freshness evidence but is not the governing invariant for the currently proposed Sanction Gate vector.

If Sanction Gate later defines a scenario in which one protected effect completes and a separate later effect inherits the older sanction, direct comparison with `HP-AUTH-006` would become appropriate.

### Final effect binding

The Sanction Gate decomposition also distinguishes current authority from whether the final effective action still matches the sanctioned `proposalHash`.

That is consistent with HandoffProbe’s broader rule that authorization freshness and effective-action binding are separate properties.

Existing target, approval and semantic-authority invariants may become relevant if the effective action changes after sanction, but the current external issue does not demonstrate a new distinct stable gap.

## Relationship to LangGraph #8102

The same-action stale-state portion is consistent with the already frozen LangGraph `#8102` resume analysis:

`docs/LANGGRAPH_8102_REPLAY_RESUME_SIGNAL_20260922.md`

That record likewise classifies stale reuse of a decision for a resumed same logical action primarily as an `HP-RACE-002` refinement and keeps `HP-AUTH-006` adjacent only for a later distinct effect.

Sanction Gate adds useful independent design-level traceability around:

- historical decision artifact versus current authority;
- withdrawal or supersession before effect;
- final effective-action binding;
- explicit zero-protected-effect expectation.

It does not currently add independently executable coverage.

## Future direct comparison gate

A direct Sanction Gate comparison becomes meaningful once the external project provides enough executable semantics to freeze, including:

1. explicit withdrawal or supersession ordering;
2. a defined final execution boundary;
3. exact sanction-currentness semantics;
4. exact `proposalHash` / effective-action binding semantics;
5. a reference implementation or executable conformance vector.

At that point HandoffProbe may freeze the exact Sanction Gate version or commit and compare the smallest deterministic vector:

`sanction admitted -> held before effect -> withdrawn or superseded -> same action resumes -> zero protected effects`

The first comparison should test whether the concrete external vector is already fully represented by `HP-RACE-002` and existing binding invariants.

A new stable attack may be considered only if real executable evidence demonstrates a distinct handoff-specific invariant that survives normal overlap and admission review.

Any reproducible HandoffProbe comparison must be returned to:

https://github.com/math-r-association/sanction-gate/issues/2

with the exact HandoffProbe commit or artifact, tested scope, observed result and explicit non-claims.

## Product and release boundary

This record:

- does not modify `docs/ATTACK_CATALOG.md`;
- does not reserve a new `HP-*` identifier;
- does not change any existing stable attack;
- does not change package version;
- does not trigger a release;
- does not claim adoption or conformance;
- does not claim independent reproduction.

The stable public corpus remains **23 attacks**.

The public package remains **handoffprobe@0.4.0**.

## Traceability decision

The Sanction Gate issue is qualified external technical input and now has a dedicated HandoffProbe freeze / overlap record.

Because no HandoffProbe execution result exists yet, it remains an open research follow-up rather than a completed evidence entry.

The historical `docs/EXTERNAL_GITHUB_THREAD_TRACEABILITY_AUDIT_20260918.md` is not rewritten. Its permanent cross-reference rule applies to this new work.

Any canonical HandoffProbe PR for this freeze / overlap record must contain the full external URL:

https://github.com/math-r-association/sanction-gate/issues/2

After closeout, the external issue timeline should be checked for the resulting GitHub cross-reference.

## Current decision

**EXTERNAL TECHNICAL VALIDATION / TRACEABILITY SIGNAL — REFINEMENT / NO NEW STABLE ID**

Next gate:

`wait for concrete Sanction Gate execution-boundary semantics plus reference implementation or executable conformance vector -> freeze exact external implementation -> perform direct deterministic comparison if it adds evidence`
