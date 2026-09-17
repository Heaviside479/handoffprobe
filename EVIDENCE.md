# HandoffProbe external technical evidence

This page indexes public, reproducible HandoffProbe evidence that has received meaningful external technical review or follow-up.

It is intentionally narrower than a marketing page. An entry here does **not** imply protocol endorsement, standards acceptance, certification, production-world validation, partnership, commercial adoption, or a security guarantee unless the linked evidence explicitly establishes that narrower claim.

The goal is simple:

> make it easy to trace an external technical input to the exact HandoffProbe comparison, reproducible artifact, public discussion, and stated limitations.

## Evidence levels used here

- **External rerun / reviewer confirmation** — an external person independently reran or reviewed a frozen HandoffProbe evidence package and publicly recorded a scoped result.
- **External vector comparison + author review** — an external technical author supplied or requested concrete vectors, HandoffProbe executed a reproducible comparison, and the author publicly reviewed the observed result.
- **Open research follow-up** — qualified external input exists, but the HandoffProbe comparison or external review is not complete yet. Open work is not presented as completed evidence.

---

## 1. Phase 9 A2A → MCP crossing corpus

**Evidence level:** External rerun / reviewer confirmation  
**Status:** Completed  
**Scope:** Frozen A2A 1.0 → MCP 2026-07-28 crossing corpus; local synthetic MCP receiver

### What was tested

HandoffProbe executed the frozen Phase 9 crossing corpus and recorded attempt-level evidence for the defined A2A → MCP boundary profile.

Detailed execution record:

- [`docs/PHASE9_CROSSING_CORPUS_EXECUTION_20260901.md`](docs/PHASE9_CROSSING_CORPUS_EXECUTION_20260901.md)

### External review

An external reviewer independently reran the final measured implementation and exact frozen intake and publicly confirmed the submitted `implementation_independent` grade.

- [Public external reviewer confirmation](https://github.com/Heaviside479/handoffprobe/issues/20#issuecomment-5516189138)
- [Source discussion / intake issue](https://github.com/Heaviside479/handoffprobe/issues/20)

With that narrowly scoped reviewer confirmation supplied to the frozen intake, the recorded profile derives `green_eligible: true` under the Phase 9 evidence model.

### What this does **not** establish

This is profile-scoped evidence, not a general certification. It does not establish:

- `operator_independent` execution;
- production-world effects;
- restart-durable or multi-process replay protection;
- production key management;
- general A2A or MCP conformance certification;
- security of arbitrary real deployments.

---

## 2. A2A #1937 context-binding vector comparison

**Evidence level:** External vector comparison + author review  
**Status:** Completed comparison; later revisions may be compared separately  
**Scope:** Draft optional context-binding profile for delegated authority; deterministic local/synthetic comparison

### External input

The A2A `#1937` discussion developed a concrete optional context-binding profile and a V1–V13 conformance-vector set. The thread explicitly invited a HandoffProbe comparison against those vectors.

- [A2A issue #1937](https://github.com/a2aproject/A2A/issues/1937)
- [Arjun's comparison request / vector discussion](https://github.com/a2aproject/A2A/issues/1937#issuecomment-5689749343)

Before implementation, HandoffProbe mapped the vectors against existing stable attacks and prior research evidence:

- [`docs/T3_2_A2A_CONTEXT_BINDING_OVERLAP_MATRIX_20260916.md`](docs/T3_2_A2A_CONTEXT_BINDING_OVERLAP_MATRIX_20260916.md)

The reproducible execution then classified the vectors as follows:

- existing evidence already represented V1, V2, V4, V5, V6, V7, V8, V9 and V11;
- V10 and V12 required targeted refinement evidence;
- V3 and V13 exposed distinct research gaps worth exercising separately;
- no stable attack ID was added solely because of this comparison.

Execution artifact:

- [`docs/T3_3_A2A_CONTEXT_BINDING_EXECUTION_20260916.md`](docs/T3_3_A2A_CONTEXT_BINDING_EXECUTION_20260916.md)
- [Immutable execution artifact used in the public reply](https://github.com/Heaviside479/handoffprobe/blob/398daa88c17821b901dbeecc3c2ce79065f87d61/docs/T3_3_A2A_CONTEXT_BINDING_EXECUTION_20260916.md)

### Public HandoffProbe result

HandoffProbe published the reproducible comparison back into the A2A thread, including the explicit limitation that the V3/V10/V12/V13 cases are deterministic local/synthetic fixtures rather than an A2A conformance claim.

- [HandoffProbe public comparison reply](https://github.com/a2aproject/A2A/issues/1937#issuecomment-5695896491)

### External author review

Arjun subsequently reviewed the comparison publicly and wrote that the results **appear consistent with the draft's intended runtime semantics**.

His follow-up specifically highlighted:

- the V10 distinction: an indeterminate comparison must block the protected effect while the scanner may still correctly classify the result as `INCONCLUSIVE` or `ERROR` instead of inventing a vulnerability `FAIL`;
- V3 and V13 as useful deterministic evidence for task-bound vs. context-bound behavior and per-effect authorization within one task/context;
- the importance of preserving the limitations around general product support, distributed-concurrency coverage and accepted A2A conformance semantics.

He also explicitly characterized the result as implementation evidence about the proposed boundary/invariants, **not** A2A acceptance of the draft or conformance certification.

- [Arjun's public review of the HandoffProbe comparison](https://github.com/a2aproject/A2A/issues/1937#issuecomment-5697862002)
- [`docs/ROADMAP_T3_ARJUN_FOLLOWUP_20260916.md`](docs/ROADMAP_T3_ARJUN_FOLLOWUP_20260916.md)

### What this does **not** establish

This comparison does not establish:

- A2A acceptance of the draft profile;
- A2A endorsement of HandoffProbe;
- conformance certification;
- general HandoffProbe product support for every vector shape;
- distributed-concurrency coverage beyond the recorded fixtures;
- production-world behavior;
- a new stable attack or release by itself.

---

## 3. A2A #2079 cA2A real-shape translation-boundary comparison

**Evidence level:** External vector comparison + author review
**Status:** Completed external review follow-up — 2026-09-17
**Scope:** Pinned cA2A delegation-chain vector projected through HandoffProbe's deterministic local A2A → MCP translation boundary

### External input and reproducible HandoffProbe result

The A2A `#2079` real cA2A shape / bytes comparison completed its HandoffProbe execution and public reply during T-3 against a concrete cross-organization delegation-chain input.

HandoffProbe pinned:

- `giskard09/argentum-core@4951899c6bb016928e299e9bf9993086885a45ae`;
- vector `cross-org-001-independent-signers`;
- leaf action `payment.route`;
- upstream scope `mycelium:payment`;
- upstream expected result `PASS`.

The reproducible HandoffProbe execution kept the pinned upstream input unchanged. The in-scope control preserved downstream `delegated_scope = mycelium:payment` and produced exactly one protected local fake effect. The translation-only negative widened only the downstream scope to `mycelium:*` and was blocked before MCP dispatch, with zero protected fake-tool execution.

- [A2A issue #2079](https://github.com/a2aproject/A2A/issues/2079)
- [HandoffProbe public comparison reply](https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862)
- [`docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md`](docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md)
- [`docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md`](docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md)
- [`docs/T3_8_COMBINED_CLOSEOUT_20260916.md`](docs/T3_8_COMBINED_CLOSEOUT_20260916.md)

The dated T-3 record states that no substantive external technical response/review to that result had been recorded at T-3 closeout. That historical state is preserved in the T-3.7 and T-3.8 closeout records.

### External author confirmation

On 2026-09-17, giskard09 independently checked the pinned vector (`4951899c`, `cross-org-001-independent-signers`, scope `mycelium:payment`, expected `PASS`) against the HandoffProbe evidence document and publicly confirmed the scoped boundary interpretation.

The confirmation distinguishes two properties:

- the upstream delegation-chain verifier establishes the signed chain's integrity and monotonic scope narrowing across hops;
- a later widening from `mycelium:payment` to `mycelium:*` introduced by HandoffProbe's own projection is a downstream translation-layer property, not something the upstream verifier is expected to catch.

giskard09 also explicitly agreed with the narrow framing: containment refinement, not a cA2A/A2A finding.

- [giskard09 external author confirmation](https://github.com/a2aproject/A2A/issues/2079#issuecomment-5706400400)
- [HandoffProbe acknowledgement](https://github.com/a2aproject/A2A/issues/2079#issuecomment-5710063080)
- [`docs/T3_CA2A_EXTERNAL_AUTHOR_CONFIRMATION_20260917.md`](docs/T3_CA2A_EXTERNAL_AUTHOR_CONFIRMATION_20260917.md)

### Admission and claim boundary

This later author confirmation changes the evidence-index state of `#2079` from an open external-review follow-up to completed scoped external evidence. It does **not** change the T-3 admission result:

- stable attack admission: **NO ADD**;
- research outcome: **REFINEMENT** of the existing `HP-AUTH-001` semantic-authority evidence path;
- distinct research candidate from this stream: **NO**.

It also does not establish:

- a cA2A or A2A vulnerability;
- A2A acceptance, endorsement or protocol conformance;
- HandoffProbe compatibility certification;
- independent re-certification of the upstream delegation-chain verifier;
- production-world behavior;
- partnership, adoption or commercial validation;
- a new stable attack or release by itself.

---

## Open technical follow-ups

Open work is intentionally separated from completed evidence.

Current examples include:

- the A2A `#1769` third-party witness / conduct-observation follow-up in T-4 is the next research track after the completed T-3 closeout; it remains open until its own freeze, overlap, execution/admission and public-reply gates are satisfied.

See [`docs/ROADMAP.md`](docs/ROADMAP.md) and [`docs/T4_A2A_WITNESS_OBSERVATION_QUEUE_20260916.md`](docs/T4_A2A_WITNESS_OBSERVATION_QUEUE_20260916.md) for the authoritative work sequencing.

Open items do not become evidence entries above until their own reproducibility and review conditions are met.

---

## Evidence policy

### Global external result-return rule

This rule applies to **every qualified external technical input** that materially influences a HandoffProbe research track, comparison, fixture, admission decision or evidence claim, regardless of protocol, repository, contributor or project.

The required loop is:

1. freeze the exact external source, author, public thread/comment and relevant scope;
2. preserve or pin the exact upstream material used for comparison where practical;
3. perform HandoffProbe overlap analysis before adding new implementation;
4. if execution is justified, produce a reproducible HandoffProbe artifact and exact immutable commit/reference;
5. return the concrete HandoffProbe result to the same external contributor or originating technical thread;
6. state exactly what HandoffProbe tested, what it observed, what it did **not** test, and the applicable limitations/non-claims;
7. invite correction, counter-evidence or confirmation from the external contributor;
8. record any substantive response and classify it as confirmation, correction, counter-example, new input or unresolved disagreement before dependent follow-on implementation;
9. if no substantive external response arrives, record that fact explicitly rather than implying review or confirmation.

Returning the result publicly is required whenever HandoffProbe produces a reproducible result from an external technical input. External confirmation itself is **not** required and must never be invented.

Evidence status must therefore remain distinct:

- a reproduced HandoffProbe result with no external response remains an **open external-review follow-up**;
- a public technical author/reviewer confirmation may qualify for **external vector comparison + author review**;
- an independent external rerun/review may qualify for **external rerun / reviewer confirmation**;
- disagreement or correction remains valuable evidence and must be preserved rather than filtered out.

A research item must not be promoted to completed external evidence merely because HandoffProbe posted a result. The evidence index should reflect the strongest level actually demonstrated.

A future entry should include, where applicable:

1. the exact external source or request;
2. frozen/pinned input material;
3. the HandoffProbe overlap/admission decision before new code;
4. a reproducible execution artifact;
5. the exact HandoffProbe commit or immutable artifact used publicly;
6. the public external follow-up or reviewer statement;
7. explicit limitations and non-claims.

HandoffProbe prefers narrow, reproducible evidence over broad claims.