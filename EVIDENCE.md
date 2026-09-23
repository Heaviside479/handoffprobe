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
- [HandoffProbe boundary comment](https://github.com/a2aproject/A2A/issues/1937#issuecomment-5684030629)
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

### Earlier upstream specification follow-up

Before the direct author review, AkiraTamai supplied a substantive upstream specification follow-up:

- [AkiraTamai specification follow-up](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5775696397)
- [upstream specification PR #36](https://github.com/ripple-node-lab/mcp-verifiable-tools-demo/pull/36)
- merged upstream commit `9b63cb023fa966e6da54d252d2827990d2d7fdbe`

That earlier change explicitly recorded the execution-integrity versus authorization-continuity separation at the upstream specification level. By itself it was not a direct HandoffProbe result review. The later direct author review below is the evidence that supports the scoped author-review promotion.

### External author review

Arjun subsequently reviewed the comparison publicly and wrote that the results **appear consistent with the draft's intended runtime semantics**.

His follow-up specifically highlighted:

- the V10 distinction: an indeterminate comparison must block the protected effect while the scanner may still correctly classify the result as `INCONCLUSIVE` or `ERROR` instead of inventing a vulnerability `FAIL`;
- V3 and V13 as useful deterministic evidence for task-bound vs. context-bound behavior and per-effect authorization within one task/context;
- the importance of preserving the limitations around general product support, distributed-concurrency coverage and accepted A2A conformance semantics.

He also explicitly characterized the result as implementation evidence about the proposed boundary/invariants, **not** A2A acceptance of the draft or conformance certification.

- [Arjun's public review of the HandoffProbe comparison](https://github.com/a2aproject/A2A/issues/1937#issuecomment-5697862002)
- [HandoffProbe review acknowledgement](https://github.com/a2aproject/A2A/issues/1937#issuecomment-5698439348)
- [Canonical HandoffProbe closeout PR #93](https://github.com/Heaviside479/handoffprobe/pull/93)
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
- [HandoffProbe initial boundary comment](https://github.com/a2aproject/A2A/issues/2079#issuecomment-5682091042)
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
- [Canonical HandoffProbe closeout PR #103](https://github.com/Heaviside479/handoffprobe/pull/103)
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

## 4. A2A #1769 WitnessObservation / VATE reconciliation comparison

**Evidence level:** External vector comparison + author review
**Status:** Completed scoped external author review — WitnessObservation and VATE responses received
**Scope:** Deterministic local/synthetic provider-side original-attempt reconciliation

### External input / HandoffProbe participation

- [A2A issue #1769](https://github.com/a2aproject/A2A/issues/1769)
- [HandoffProbe initial evidence/context comment](https://github.com/a2aproject/A2A/issues/1769#issuecomment-5682264021)
- [VATE implementation-review issue #2](https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2)

### Reproducible HandoffProbe result

T-4 isolated provider-side reconciliation of the original attempt after caller-facing response loss as a distinct research gap.

The local fixture reproduces:

- one protected synthetic effect;
- caller outcome remaining `unknown` after response loss;
- no blind fresh execution as recovery;
- read-only provider lookup of the original attempt;
- validation of logical action identity, attempt identity and execution evidence;
- `confirmed_success` only after valid reconciliation evidence;
- zero additional protected effects during reconciliation;
- `INCONCLUSIVE` for missing or mismatched evidence;
- `ERROR` for provider lookup failure.

Artifacts:

- [immutable fixture commit](https://github.com/Heaviside479/handoffprobe/commit/07d9c8bf38f1fa5bfa0d61f74d92ffe5232b53ba)
- [execution/admission record](https://github.com/Heaviside479/handoffprobe/blob/360f3345cf72ca60e0a91a81b91164dad7dd3d2c/docs/T4_3_PROVIDER_RECONCILIATION_EXECUTION_20260918.md)
- [public A2A result return](https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729838541)
- [public VATE result return](https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5729853773)

T-4.4 classification: **DISTINCT RESEARCH CANDIDATE**.

No stable attack was added. The stable public corpus remains **23 attacks** and no release was triggered.

### WitnessObservation author review

Toshikatsu Oga / `ogasurfproject-jpg` reviewed the returned comparison:

- [public author review](https://github.com/a2aproject/A2A/issues/1769#issuecomment-5729937680)

Classification: **CONFIRMATION + CLARIFICATION**.

The review confirms the compose-rather-than-subsume boundary between WitnessObservation and provider execution reconciliation and confirms that no additional signed WitnessObservation fixture was required for this result.

The author also clarified that provider attestation bound to the original action and attempt establishes attestation and binding, but not independently confirmed world-side effect truth by itself.

The current HandoffProbe fixture separately measures its own local synthetic protected effect. The author clarification therefore limits production generalization rather than invalidating the fixture.

A supplemental NENRIN execution-side candidate at revision `62b60205` was mentioned in the review. HandoffProbe has not frozen or executed that artifact as part of this result.

### VATE author review

Takao Sato / `Poke-nushi` reviewed the pinned T-4 closeout:

- [public VATE author review](https://github.com/a2aproject/A2A/issues/1769#issuecomment-5732275655)

Classification: **CONFIRMATION + CLARIFICATION**.

The review states that the T-4 separation of action binding, unknown caller outcome and original-attempt reconciliation matches the VATE points raised earlier in the thread.

It also recognizes the bounded local result: evidence is checked against the original action and attempt, missing or mismatched evidence stays unresolved, and reconciliation adds no protected effect.

Poke-nushi additionally preserves the distinction between A2A task state and evidence of an external operation's outcome, with the receiver responsible for assessing what referenced evidence establishes.

The review does not report an independent HandoffProbe rerun. It is therefore scoped author review rather than independent reproduction.

### VATE issue-specific acknowledgement

After the A2A-side author review, Poke-nushi also closed the VATE-specific traceability loop in VATE issue #2:

- [HandoffProbe VATE result return](https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5729853773)
- [Poke-nushi VATE issue acknowledgement](https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5733113059)
- [Immutable VATE technical review record](https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/blob/60c8c7c9cf89fc6011eb95f9d67b5d25233338b7/docs/interop/handoffprobe-reconciliation-review.md)
- [HandoffProbe acknowledgement](https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5733216447)
- [Canonical HandoffProbe closeout PR #121](https://github.com/Heaviside479/handoffprobe/pull/121)

The VATE record explicitly says that the source/package correspondence was checked and that the HandoffProbe tests were **not rerun** by the VATE maintainer. This strengthens provenance and reciprocal traceability, but it does not raise the evidence level above scoped author review or convert the result into independent reproduction.

### Current review state

Both materially relevant external sides now have substantive author review:

- WitnessObservation: **CONFIRMATION + CLARIFICATION**;
- VATE: **CONFIRMATION + CLARIFICATION**.

This item is now completed scoped external evidence at **External vector comparison + author review**.

Neither review is treated as A2A/VATE conformance, production-world validation, certification or independent proof of a real-world side effect.

### Limitations

This result does not establish:

- production VATE, WitnessObservation, A2A or MCP conformance;
- a defect in any of those projects;
- operator-independent or production-world reconciliation;
- that provider attestation alone proves a world-side effect;
- a new stable HandoffProbe attack;
- certification, endorsement, partnership or adoption.

---

## 5. MCP #3354 execution-integrity / authorization-boundary comparison

**Evidence level:** External vector comparison + author review
**Status:** Completed scoped external author review and proposal traceability update — 2026-09-22
**Scope:** Deterministic local/synthetic execution-integrity and upstream-authorization composition comparison

### External technical input

AkiraTamai publicly confirmed the distinction between execution integrity and authorization of the effective inputs in MCP `#3354`.

- [MCP #3354](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354)
- [HandoffProbe boundary comment](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5682996881)
- [AkiraTamai boundary response](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5715753995)

The frozen upstream demo basis used for the HandoffProbe execution remains:

`ripple-node-lab/mcp-verifiable-tools-demo@66a959f79802d3751ba7edc0aec4c1c0e0ee2b36`

HandoffProbe classified the seam as **REFINEMENT** because semantic downstream authority widening is already governed by stable `HP-AUTH-001`.

### Reproducible HandoffProbe result

Merged HandoffProbe result:

- [merge commit](https://github.com/Heaviside479/handoffprobe/commit/13e4a525b658077e235a769f6aff6d6e2754a33e)
- [`docs/MCP_3354_PROOF_AUTHORITY_EXECUTION_20260918.md`](docs/MCP_3354_PROOF_AUTHORITY_EXECUTION_20260918.md)
- [`tests/mcp-3354-proof-authority-execution.test.ts`](tests/mcp-3354-proof-authority-execution.test.ts)

The deterministic positive control observed:

- execution-integrity binding: `ACCEPT`;
- semantic authority: `ACCEPT`;
- protected local synthetic effect: `1`.

The deterministic widened case observed:

- execution-integrity binding for the exact widened effective request: `ACCEPT`;
- semantic authority: `REJECT`;
- crossing decision: `action_digest_mismatch`;
- MCP tool call: `0`;
- protected local synthetic effect: `0`.

The result demonstrates the narrow composition rule that valid execution-integrity evidence for an effective request must not be substituted for upstream authorization of that request.

### Public result return

The merged result was returned publicly to AkiraTamai in the originating MCP thread:

- [HandoffProbe public result return](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5731012791)
- [Canonical HandoffProbe closeout PR #115](https://github.com/Heaviside479/handoffprobe/pull/115)

The reply includes the immutable HandoffProbe merge commit, execution record, deterministic test, observed layer outcomes and scope limitations, and explicitly invites correction or counter-evidence.

### External author review

Direct post-result author review: **RECEIVED**.

- [AkiraTamai direct author review](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5777698218)
- [authorization-continuity fixture PR #37](https://github.com/ripple-node-lab/mcp-verifiable-tools-demo/pull/37)
- merged upstream commit `803935c0fbcd34ead12976a52a6ad857c09e9fdc`

AkiraTamai directly replied to `@Heaviside479` after the HandoffProbe result return and confirmed that the HandoffProbe reading of the boundary is the intended one, with nothing to correct.

The response also confirms the tested scope: the HandoffProbe run did not exercise the upstream ZK or TEE paths; the relevant comparison was the composition rule between execution integrity and authorization continuity.

The upstream negative fixture mirrors the comparison shape:

- an in-scope call verifies and matches the approved commitment;
- a schema-valid widened call also verifies;
- the widened call is rejected by approved-commitment mismatch.

This is scoped external author review of the comparison. It is not an independent rerun of HandoffProbe.

The evidence level is therefore **External vector comparison + author review**.

### Proposal and changelog traceability

The MCP `#3354` issue description now explicitly frames the work as a **pre-SEP proposal**.

The issue states an intent to continue the proposal discussion through the MCP Security IG / Contributor Discord and later link that work from an eventual Extensions Track SEP PR. This records planned proposal follow-up; it is not evidence that a SEP has been accepted.

The issue text now explicitly includes the authorization-continuity boundary and describes `inputCommitment` as the interface point available to an external authority check.

Changelog entry `2026-09-22-002` records edits following the authorization-continuity discussion, thanks `@Heaviside479`, links the HandoffProbe boundary discussion and public result return, and links the merged negative fixture in PR #37.

This is external technical impact and traceability evidence. It does not establish HandoffProbe adoption, endorsement, MCP standardization, SEP acceptance or independent HandoffProbe reproduction.

### Admission and release state

- classification: **REFINEMENT**;
- new stable attack: **no**;
- stable public corpus: **23 attacks**;
- package version change: **no**;
- release triggered: **no**.

### Limitations

This result does not establish:

- a vulnerability in MCP;
- a vulnerability in Verifiable MCP;
- Verifiable MCP conformance;
- reproduction of the upstream ZK or TEE implementation by HandoffProbe;
- independent external rerun of HandoffProbe;
- production cryptographic assurance;
- production-world effects;
- HandoffProbe adoption;
- endorsement of HandoffProbe;
- MCP specification acceptance;
- SEP acceptance or standardization;
- a new stable HandoffProbe attack.

---

## 6. Reddit R-1 token-rotation / reconnect refinement

**Evidence level:** Open research follow-up

**Status:** Reproducible HandoffProbe result returned publicly; external commenter response pending
**Scope:** Deterministic local/synthetic stale-session reconnect comparison

### External technical input

A Reddit contributor supplied a concrete interrupted-handoff edge case:

- token A is initially current;
- the server rotates current session state to B;
- a transient interruption occurs;
- the same logical action reconnects while still presenting stale A;
- the contributor explicitly asked whether this should be treated as replay or stale authorization.

Originating source:

- [Reddit source comment](https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakk8w2/)

### Reproducible HandoffProbe result

HandoffProbe reduced the case to a deterministic local synthetic fixture.

Merged execution:

- [merge commit](https://github.com/Heaviside479/handoffprobe/commit/05677e5a00c45bcc20abe06b3622a72d4b7aa43b)
- [`docs/REDDIT_R1_TOKEN_ROTATION_EXECUTION_20260918.md`](docs/REDDIT_R1_TOKEN_ROTATION_EXECUTION_20260918.md)
- [`tests/reddit-r1-token-rotation-execution.test.ts`](tests/reddit-r1-token-rotation-execution.test.ts)

Secure path:

- token A initially accepted;
- current server-side generation changes to B before any protected effect;
- reconnect presents stale A;
- current authorization: `REJECT`;
- reason: `stale_session`;
- MCP tool calls: `0`;
- protected-effect delta: `0`.

Intentionally vulnerable path:

- current authorization still rejects stale A;
- the pre-interruption authorization snapshot is reused;
- MCP tool calls: `1`;
- protected-effect delta: `1`.

### Admission result

Final classification:

**HP-RACE-002 REFINEMENT / NO ADD**

The fixture is governed by the existing partial-failure stale-execution invariant.

`HP-REPLAY-003` is not governing for the primary fixture because the protected-effect count before interruption is exactly `0`.

`HP-AUTH-006` is not governing because R-1 resumes the same interrupted logical protected action rather than authorizing a later distinct protected effect.

No new stable attack was added.

The stable public corpus remains **23 attacks**, package version remains `0.4.0`, and no release was triggered.

### Public result return

The merged reproducible result was returned to the originating Reddit discussion:

- [HandoffProbe public result return](https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/)

The reply includes the observed secure and intentionally vulnerable outcomes, the admission classification, the replay boundary and the local/synthetic limitation, and explicitly invites correction or counter-evidence.

### Current external-review state

External response to the returned HandoffProbe result:

**PENDING**

No substantive external response has been recorded as of this closeout.

The public result return itself is **not** external confirmation.

Silence must not be interpreted as agreement.

This item therefore remains an **Open research follow-up**.

### Limitations

This result does not establish:

- a vulnerability in MCP;
- a vulnerability in a real MCP client or server;
- production session-token semantics;
- a normative token-rotation design;
- production authentication assurance;
- external reproduction or confirmation;
- a new stable HandoffProbe attack.

---

## 7. Reddit R-2 same-name capability hot-deploy refinement

**Evidence level:** Open research follow-up

**Status:** Reproducible HandoffProbe result returned publicly; external commenter response pending
**Scope:** Deterministic local/synthetic same-name capability-drift comparison

### External technical input

A Reddit contributor supplied a concrete approval-continuity edge case:

- capability A is approved;
- before protected dispatch, the receiver resolves the same visible tool name to materially changed capability B;
- the security-relevant capability changes even though the label remains identical;
- the contributor suggested binding approval to the capability definition/digest rather than only the tool name.

Originating source:

- [Reddit source comment](https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakp67i/)

### Reproducible HandoffProbe result

HandoffProbe reduced the case to a deterministic local synthetic fixture.

Merged execution:

- [merge commit](https://github.com/Heaviside479/handoffprobe/commit/7ffcd7254a85391e0937ec514a39f4507af26727)
- [`docs/REDDIT_R2_SAME_NAME_HOT_DEPLOY_EXECUTION_20260918.md`](docs/REDDIT_R2_SAME_NAME_HOT_DEPLOY_EXECUTION_20260918.md)
- [`tests/reddit-r2-same-name-hot-deploy-execution.test.ts`](tests/reddit-r2-same-name-hot-deploy-execution.test.ts)

Observed positive control:

- upstream semantic authority for B: `ACCEPT`;
- approval directly bound to B: `MATCH`;
- protected-effect delta: `1`.

Observed secure negative:

- approval remains bound to A;
- effective capability becomes B under the same visible tool name;
- upstream semantic authority for B: `ACCEPT`;
- approval binding: `MISMATCH`;
- protected-effect delta: `0`.

Observed intentionally vulnerable label-only negative:

- approval remains bound to A;
- effective capability becomes B;
- upstream semantic authority for B: `ACCEPT`;
- the unchanged tool label is treated as sufficient;
- stale approval is accepted;
- protected-effect delta: `1`.

### Admission result

Final classification:

**HP-APPROVAL-002 REFINEMENT / NO ADD**

The result refines the existing approval-continuity invariant.

No new stable attack was added.

The stable public corpus remains **23 attacks**, package version remains `0.4.0`, and no release was triggered.

### Public result return

The merged reproducible result was returned to the originating Reddit discussion:

- [HandoffProbe public result return](https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paly9up/)

The reply includes the observed positive, secure-negative and intentionally vulnerable outcomes, the admission classification, the local/synthetic limitation, and an invitation for correction or counter-evidence.

### Current external-review state

External response to the returned HandoffProbe result:

**PENDING**

No substantive external response has been recorded as of this closeout.

The public result return itself is **not** external confirmation.

Silence must not be interpreted as agreement.

This item therefore remains an **Open research follow-up**.

### Limitations

This result does not establish:

- an MCP specification vulnerability;
- a vulnerability in a real MCP implementation;
- a normative requirement to use SHA-256 capability digests;
- production-world behavior;
- external reproduction or confirmation;
- a new stable HandoffProbe attack.

---

## 8. Reddit R-3 authorized target-switch / task-target refinement

**Evidence level:** Open research follow-up

**Status:** Reproducible HandoffProbe result returned publicly; external commenter response pending
**Scope:** Deterministic local/synthetic target-continuity comparison

### External technical input

A Reddit contributor reported an adaptive retry case in which an agent:

- received a `403` for an original target;
- enumerated visible tenants;
- switched to another target;
- retried successfully;
- had proper request-level authorization on each request.

Originating source:

- [Reddit source comment](https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/)

The HandoffProbe research question was whether independently valid request authority for alternate target B is sufficient when the same logical upstream task remains target-bound to A.

### Reproducible HandoffProbe result

Merged execution:

- [merge commit](https://github.com/Heaviside479/handoffprobe/commit/a78fd7a961f197ddaf82bbea7fe3b15546c8efbf)
- [`docs/REDDIT_R3_TARGET_INTENT_EXECUTION_20260918.md`](docs/REDDIT_R3_TARGET_INTENT_EXECUTION_20260918.md)
- [`tests/reddit-r3-target-intent-execution.test.ts`](tests/reddit-r3-target-intent-execution.test.ts)

Target B is evaluated through HandoffProbe's existing request-level authorization logic.

Observed B request-level authorization:

- authorization: `ACCEPT`;
- rejection reasons: none;
- tenant binding: match;
- resource binding: match;
- capability grant: match;
- authority-not-amplified check: pass.

Observed positive control:

- upstream task permits A and B;
- B request authorization: `ACCEPT`;
- task-target continuity: `MATCH`;
- protected-effect delta: `1`.

Observed secure negative:

- upstream task permits only A;
- B request authorization: `ACCEPT`;
- task-target continuity: `MISMATCH`;
- protected dispatch blocked;
- protected-effect delta: `0`.

Observed intentionally vulnerable request-only negative:

- upstream task permits only A;
- B request authorization: `ACCEPT`;
- task-target continuity: `MISMATCH`;
- task-target mismatch ignored;
- protected-effect delta: `1`.

### Admission result

Final classification:

**HP-TARGET-001 REFINEMENT / NO ADD**

The result refines the existing resource/target-substitution invariant.

No new stable attack was added.

The stable public corpus remains **23 attacks**, package version remains `0.4.0`, and no release was triggered.

### Public result return

The merged reproducible result was returned to the originating Reddit discussion:

- [HandoffProbe public result return](https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pam978h/)

The reply reports the three observed execution paths, preserves the `HP-TARGET-001 REFINEMENT / NO ADD` classification, states the synthetic/local limitations, distinguishes request authorization from task-target authority, and invites correction or counter-evidence.

### Current external-review state

External response to the returned HandoffProbe result:

**PENDING**

No substantive external response has been recorded as of this closeout.

The public result return itself is **not** external confirmation.

Silence must not be interpreted as agreement.

This item therefore remains an **Open research follow-up**.

### Limitations

This result does not establish:

- an MCP specification vulnerability;
- a vulnerability in a real MCP client/server;
- that cross-tenant switching is inherently invalid;
- that every retry must remain on the original target;
- that visibility itself grants or violates authority;
- production-world behavior;
- external reproduction or confirmation;
- a new stable HandoffProbe attack.

The initial `403`-like denial and target-discovery stages are deterministic fixture-controlled research inputs rather than claims of separate external end-to-end network reproduction.

---

## 9. Reddit R-4 x402 paid-retry request-binding semantics

**Evidence level:** Open research follow-up

**Status:** Reproducible HandoffProbe result returned publicly; external commenter response pending
**Scope:** Deterministic local/synthetic x402 payment-term versus MCP request-binding comparison

### External technical input

A Reddit contributor supplied a public MCP/x402 implementation and asked
HandoffProbe to test the `analyze_property` flow, including the callback after
HTTP 402 and the payment path.

Originating source:

- [Reddit source comment](https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paxkn52/)

Supplied repository:

- [Zak-bo/real-estate-x402](https://github.com/Zak-bo/real-estate-x402)

Frozen external source commit:

`4e99e87da0ccdf3ddcf067958de6b59eb4134414`

The relevant frozen dependency baseline was:

- `agents@0.21.0`;
- `@x402/core@2.24.0`;
- `@x402/evm@2.24.0`.

Read-only package inspection established the composition boundary used by the
fixture: x402 verification binds payment terms, while every MCP application
argument is not automatically part of that payment-term binding.

### Reproducible HandoffProbe result

Merged execution:

- [merge commit](https://github.com/Heaviside479/handoffprobe/commit/d012c506a6e44680fb649ff8ab64fb32f41a9bae)
- [`docs/REDDIT_R4_X402_PAYMENT_BINDING_EXECUTION_20260920.md`](docs/REDDIT_R4_X402_PAYMENT_BINDING_EXECUTION_20260920.md)
- [`tests/reddit-r4-x402-payment-binding-execution.test.ts`](tests/reddit-r4-x402-payment-binding-execution.test.ts)

Observed unchanged paid retry:

- payment-term match: `MATCH`;
- synthetic payment verification: `ACCEPT`;
- effective property: `property:A`;
- protected dispatch: allowed;
- protected-effect delta: `1`.

Observed x402-only property mutation:

- property changes from `property:A` to `property:B`;
- payment terms and synthetic payment proof remain unchanged;
- payment-term match: `MATCH`;
- synthetic payment verification: `ACCEPT`;
- protected dispatch: allowed;
- protected-effect delta: `1`;
- classification: `EXPECTED X402-ONLY SEMANTICS`.

Observed explicit request-bound composition control:

- payment-term match: `MATCH`;
- synthetic payment verification: `ACCEPT`;
- application request binding: `MISMATCH`;
- protected dispatch: blocked;
- protected-effect delta: `0`.

### Admission result

Final classification:

**PROTOCOL SEMANTICS / NO ADD**

The local result separates two properties:

1. payment-term verification;
2. optional application-level binding to one exact MCP request.

The x402-only mutated-request path is not classified as a vulnerability.

No new stable attack was added.

The stable public corpus remains **23 attacks**, package version remains
`0.4.0`, and no release was triggered.

### Public result return

The merged reproducible result was returned to the originating Reddit
discussion:

- [HandoffProbe public result return](https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pay1b51/)

The reply links the immutable execution record and deterministic test, explains
the observed request-mutation behavior, preserves the local/synthetic
limitations, and explicitly invites correction or counter-evidence.

### Current external-review state

External response to the returned HandoffProbe result:

**PENDING**

No substantive external response has been recorded as of this closeout.

The public result return itself is **not** external confirmation.

Silence must not be interpreted as agreement.

This item therefore remains an **Open research follow-up**.

### Limitations

This result does not establish:

- an x402 protocol vulnerability;
- a vulnerability in `real-estate-x402`;
- a Cloudflare Agents vulnerability;
- a facilitator vulnerability;
- successful live payment settlement;
- successful Base Sepolia execution;
- that every x402 payment must bind every MCP application argument;
- production-world behavior;
- external reproduction or confirmation;
- a new stable HandoffProbe attack.

No wallet, private key, testnet funds, real funds, public facilitator or public
paid endpoint was used.

---

## Open technical follow-ups

Open work is intentionally separated from completed evidence.

Current examples include:

- Reddit R-1 has completed deterministic execution, admission and public result return; the originating commenter's substantive response remains pending.
- Reddit R-2 has completed deterministic execution, admission and public result return; the originating commenter's substantive response remains pending.
- Reddit R-3 has completed deterministic execution, admission and public result return; the originating commenter's substantive response remains pending.
- Reddit R-4 has completed deterministic execution, admission and public result return; the originating commenter's substantive response remains pending.
- Sanction Gate #2 is frozen as an open design-level **external technical validation / traceability signal** derived from the stale-authority / effect-time boundary raised in A2A #2250. No reference implementation, validated conformance result, HandoffProbe execution or independent reproduction exists yet. Future direct comparison is gated on concrete Sanction Gate execution-boundary semantics plus a reference implementation or executable conformance vector.

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

For external GitHub threads, an additional mandatory traceability rule applies whenever the thread materially produces HandoffProbe technical work:

- the canonical HandoffProbe PR/closeout must contain the **full external GitHub issue or pull-request URL**;
- after closeout, verify that the external GitHub timeline exposes the corresponding HandoffProbe cross-reference / “mentioned this issue” entry;
- preserve the canonical HandoffProbe PR/commit alongside the external source in the relevant closeout/evidence record;
- repair missing historical linkage when discovered, but do not manufacture a technical PR for a comment-only signal that produced no HandoffProbe work;
- treat the cross-reference as provenance metadata only, never as external confirmation, independent reproduction or evidence-level promotion.

For non-GitHub sources, preserve the equivalent exact source permalink, public result-return permalink and immutable HandoffProbe artifact.

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
