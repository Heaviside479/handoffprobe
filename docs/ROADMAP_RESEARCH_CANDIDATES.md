# HandoffProbe roadmap — additive research candidates

Status: **ACTIVE INDEX — 2026-09-17**

This file is an additive roadmap extension. It does **not** replace or override `docs/ROADMAP.md`, existing release tracks, T-series work, Phase 10 reliability work, the Phase 13 commercial-validation gate, or any existing attack-admission decision.

Its purpose is to keep externally motivated research ideas visible without turning one useful comment into a committed feature or stable attack.

## RC-1 — model-mediated mutation discovery

Status: **RECORDED / NOT ACTIVATED**

Detailed research record:

`docs/MODEL_MEDIATED_MUTATION_DISCOVERY_RESEARCH_20260917.md`

### Why it is recorded

External technical feedback identified a gap between HandoffProbe's deterministic mutation corpus and real agent behavior: a model may rewrite, summarize or reinterpret a constrained request during a handoff in ways that a fixed mutation catalog did not enumerate in advance.

The same feedback also described stale or sticky authority. That second point is already represented by the separately admitted `HP-AUTH-006 — Stale task authorization reused for later effect` in v0.4.0 and therefore does not create another roadmap candidate by itself.

### Intended research direction

If activated later, the preferred shape is:

`model-mediated exploration → capture exact failure → minimize/normalize → reproduce deterministically → deterministic fixture → normal overlap/admission review`

The discovery lane may be nondeterministic. The stable regression corpus may not be.

### Relationship to the main roadmap

- **Phase 10 / P10.3:** adjacent to determinism work because any randomized or model-mediated exploration must preserve reproducibility and recorded provenance. RC-1 is non-blocking and does not expand the Phase 10 exit gate.
- **Phase 16:** potentially relevant to broader handoff coverage only after the original wedge remains proven and only if real evidence shows model-mediated handoff mutation is a recurring coverage gap.
- **Attack admission:** RC-1 does not reserve a new `HP-*` ID and does not create a 24th stable attack. Any eventual counterexample must go through the normal overlap, evidence and admission process.
- **Release sequencing:** RC-1 authorizes no npm version bump and does not change the current release plan.

### Activation gate

Do not implement RC-1 merely because it is documented. Activate a concrete work package only when at least one of these exists:

1. one concrete external/public reproducible agent flow demonstrates a model-mediated handoff mutation that current deterministic fixtures cannot adequately represent; or
2. two independent external technical signals identify materially the same model-mediated coverage gap; or
3. internal research produces a handoff-specific failure that survives overlap review and cannot be responsibly explored with the existing deterministic mutation machinery alone.

### Guardrails

- no new stable attack from a one-off model output;
- no nondeterministic result marketed as deterministic coverage;
- no paid AI API becomes mandatory for Core, CI or the standard stable corpus;
- hosted-model use, if ever explored, must be optional and explicit about cost/data handling;
- prefer local/no-paid reproducibility where useful;
- synthetic, owned or explicitly authorized targets only;
- no secrets/private customer data/undisclosed vulnerability material sent to third-party model providers;
- existing T-series, release, reliability and commercial-validation work keeps priority unless the activation gate is met.

## Current decision

**Record now, build later only if evidence strengthens.**

This keeps the signal without prematurely turning the roadmap into speculative feature work.

## RC-2 — Reddit MCP reconnect token-rotation refinement

Status: **PUBLIC RESULT RETURN COMPLETE / EXTERNAL RESPONSE PENDING**

Detailed queue:

`docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md#r-1--token-rotation-during-interrupted-handoff--reconnect-with-stale-token`

Community feedback supplied a concrete stale-session variant:

`token A valid → server rotates to B → deterministic interruption → reconnect in same handoff context with stale A`.

Preliminary overlap maps the governing negative invariant to stable `HP-RACE-002 — Partial-failure stale execution`.

Current position:

- final classification: **HP-RACE-002 REFINEMENT / NO ADD**;
- no new stable ID;
- merged execution commit: `05677e5a00c45bcc20abe06b3622a72d4b7aa43b`;
- direct Reddit comment: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakk8w2/
- the direct permalink was recorded after execution/merge and before public result return;
- `HP-REPLAY-003` is not governing because the pre-interruption protected-effect count is `0`;
- `HP-AUTH-006` is not governing because R-1 resumes the same interrupted logical action rather than authorizing a later distinct effect;
- stable public corpus remains **23 attacks**;
- public result return: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/
- external response state: **PENDING**;
- evidence level: **Open research follow-up**.

Active execution work for RC-2 is complete. Any later substantive external response must be classified faithfully before evidence promotion.

## RC-3 — Reddit same-name capability hot-deploy drift

Status: **PUBLIC RESULT RETURN COMPLETE / EXTERNAL RESPONSE PENDING**

Detailed queue:

`docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md#r-2--same-name-hot-deploy--capability-drift-after-approval`

Originating source:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakp67i/

Community feedback supplied a capability-drift edge case in which approval is issued for capability A and the same visible tool name resolves to materially different capability B before execution.

Completed pre-implementation overlap:

- `HP-APPROVAL-002` is the governing stable invariant: execution must remain bound to what was actually approved;
- R-2 refines that invariant because the visible tool label remains unchanged while the security-relevant capability definition changes;
- `HP-VERSION-001` is adjacent but not governing because the primary fixture contains no version negotiation, downgrade or translation;
- `HP-AUTH-001` is deliberately neutralized by allowing both A and B in upstream semantic authority while explicit approval binds only A;
- `HP-RACE-002` is excluded because the primary fixture has no interruption, reconnect, resume or retry.

Frozen primary capability change:

`["same-name-tool", "schema-v1", "read_only"]`

→

`["same-name-tool", "schema-v1", "protected_write"]`

Frozen fixture binding:

`SHA-256(UTF-8(JSON.stringify([toolName, inputSchemaId, effectClass])))`

Current position:

- pre-implementation classification: **HP-APPROVAL-002 REFINEMENT / NO ADD**;
- exact Reddit source is frozen before implementation;
- no new stable `HP-*` ID is reserved;
- deterministic local execution completed within the frozen shape;
- positive control observed authority `ACCEPT`, approval `MATCH` and protected-effect delta `1`;
- secure negative observed authority `ACCEPT`, approval `MISMATCH` and protected-effect delta `0`;
- intentionally vulnerable label-only negative observed authority `ACCEPT`, stale approval acceptance and protected-effect delta `1`;
- repeated summaries were deterministic;
- post-execution classification remains **HP-APPROVAL-002 REFINEMENT / NO ADD**;
- merged execution commit: `7ffcd7254a85391e0937ec514a39f4507af26727`;
- public result return: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paly9up/
- external response state: **PENDING**;
- evidence level: **Open research follow-up**;
- secure negative must observe upstream authority `ACCEPT`, approval mismatch and protected-effect delta `0`;
- intentionally vulnerable negative must observe upstream authority `ACCEPT`, stale approval acceptance and protected-effect delta `1`;
- positive control must approve B directly and produce protected-effect delta `1`;
- post-execution admission must reconfirm the refinement classification;
- the merged result has been returned to the originating Reddit discussion;
- `EVIDENCE.md` records the item as **Open research follow-up** while external response is pending.

## RC-4 — Reddit authorized tenant switch after denial

Status: **PUBLIC RESULT RETURN COMPLETE / EXTERNAL RESPONSE PENDING**

Detailed queue:

`docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md#r-3--authorized-tenant-switch-after-denial--task-intent-target-drift`

Originating source:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/

Community feedback supplied an adaptive retry case in which an agent receives a denial on one target, enumerates visible tenants, switches to another target and succeeds while each individual request remains properly authorized.

Preliminary overlap:

- `HP-TARGET-001` is the closest stable neighbor, but its current fixture proves unauthorized resource substitution rather than an independently authorized alternate target that may violate task-bound intent;
- `HP-TENANT-001` is adjacent but is not governing when the alternate request is independently authorized;
- `HP-APPROVAL-003` is conditional on explicit target-bound approval reuse;
- `HP-AUTH-001` is not governing when no semantic authority widening occurs;
- `HP-AUTH-006` is not governing when the first denied attempt has zero protected effects and the alternate request receives fresh authorization;
- RC-1 is adjacent if the switch is model-mediated, but the source report alone does not establish a reproducible model-mediated flow.

Current position:

- final pre-implementation classification: **HP-TARGET-001 REFINEMENT / NO ADD**;
- source permalink and exact supplied text were frozen before implementation;
- no new stable `HP-*` ID is reserved;
- negative-case task-authorized target set is exactly `[A]`;
- alternate B is visible and has independent fresh request-level authorization `ACCEPT`;
- visibility, request authority and task-target authority remain separate layers;
- attempt 1 denial has protected-effect delta `0`;
- discovery has protected-effect delta `0`;
- secure B retry must observe request authorization `ACCEPT`, task-target `MISMATCH` and effect delta `0`;
- intentionally vulnerable B retry must observe request authorization `ACCEPT`, ignored task-target mismatch and effect delta `1`;
- positive control explicitly authorizes `[A, B]` at task level and must produce effect delta `1`;
- `HP-TENANT-001`, `HP-APPROVAL-003`, `HP-AUTH-001`, `HP-AUTH-006` and RC-1 are excluded/neutralized from the governing primary invariant;
- deterministic local execution completed within the frozen shape;
- B request-level authorization is `ACCEPT` with no rejection reasons;
- positive control observes task-target `MATCH` and protected-effect delta `1`;
- secure negative observes task-target `MISMATCH` and protected-effect delta `0`;
- intentionally vulnerable request-only path observes the same `MISMATCH` but protected-effect delta `1`;
- repeated scenario summaries are deterministic;
- post-execution classification remains **HP-TARGET-001 REFINEMENT / NO ADD**;
- merged execution commit: `a78fd7a961f197ddaf82bbea7fe3b15546c8efbf`;
- public result return: https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pam978h/
- external response state: **PENDING**;
- evidence level: **Open research follow-up**;
- the result remains **HP-TARGET-001 REFINEMENT / NO ADD**;
- no new stable attack ID or release is triggered.

## RC-5 — Reddit x402 paid-retry binding after 402

Status: **PUBLIC RESULT RETURN COMPLETE / PROTOCOL SEMANTICS / NO ADD / EXTERNAL RESPONSE PENDING**

Detailed queue:

`docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md#r-4--x402-paid-retry-binding--request-mutation-after-402`

Originating source:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paxkn52/

Supplied external implementation:

https://github.com/Zak-bo/real-estate-x402

Frozen external source commit:

`4e99e87da0ccdf3ddcf067958de6b59eb4134414`

Community feedback asks HandoffProbe to exercise an MCP `analyze_property`
tool that uses x402 and to verify the paid callback/retry path.

The security-relevant research question is whether a payment requirement and
payment proof remain correctly scoped when the paid MCP retry differs from the
request that produced the 402 requirement.

Current position:

- exact Reddit source is frozen;
- exact external repository snapshot is frozen;
- locked dependencies are `agents@0.21.0`, `@x402/core@2.24.0` and
  `@x402/evm@2.24.0`;
- exact published-package semantics have been inspected read-only;
- x402 payment verification is payment-term binding, not automatic binding of
  every MCP application argument;
- the supplied example client contains no separate request-approval object;
- `HP-APPROVAL-001` is adjacent only when an application adds explicit
  request-specific consent;
- `HP-APPROVAL-002`, `HP-APPROVAL-003`, `HP-REPLAY-002`,
  `HP-REPLAY-001`, `HP-REPLAY-003` and `HP-TARGET-001` are not governing
  the primary fixture;
- final pre-implementation classification is **PROTOCOL SEMANTICS / NO ADD**;
- no vulnerability conclusion has been made about x402 or the supplied project;
- no live payment has been made;
- no new stable `HP-*` ID is reserved;
- stable public corpus remains **23 attacks**;
- package remains `0.4.0`;
- no release is triggered.

Local execution result:

- unchanged paid retry: payment `ACCEPT`, dispatch allowed, protected-effect delta `1`;
- x402-only property mutation: payment `ACCEPT`, dispatch allowed,
  protected-effect delta `1`, labelled `EXPECTED X402-ONLY SEMANTICS`;
- explicit request-bound composition: payment `ACCEPT`, request binding
  `MISMATCH`, dispatch blocked, protected-effect delta `0`;
- focused execution: `5/5` tests passed;
- final admission remains **PROTOCOL SEMANTICS / NO ADD**;
- no wallet, payment, testnet or public endpoint was used.

Merged execution commit:

`d012c506a6e44680fb649ff8ab64fb32f41a9bae`

Public result return:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pay1b51/

Evidence state:

**Open research follow-up**

External response:

**PENDING**

Next gate:

`classify substantive external response if one arrives`

Live/public/testnet payment execution is outside this candidate's research boundary.
R-4 must use deterministic local/synthetic payment semantics only.

## RC-6 — LangGraph durable admission decision across resume

Status: **FROZEN / OVERLAP COMPLETE — REFINEMENT / COMPOSITION / NO NEW STABLE ID**

Detailed research record:

`docs/LANGGRAPH_8102_REPLAY_RESUME_SIGNAL_20260922.md`

Originating source:

https://github.com/langchain-ai/langgraph/issues/8102

External technical comment:

https://github.com/langchain-ai/langgraph/issues/8102#issuecomment-5774538909

The external signal asks how a pre-execution admission decision should behave across interrupt, retry and crash/recovery boundaries, including proposal-versus-effective-call preservation, stable decision provenance and exactly-once side-effect behavior.

Current overlap result:

- stale reuse of a decision for the same interrupted logical action is primarily an `HP-RACE-002` refinement;
- duplicate execution after retry/crash ambiguity is primarily an `HP-REPLAY-003` refinement;
- `HP-AUTH-006` remains adjacent only when a later **distinct** protected effect is attempted;
- approval attacks remain conditionally adjacent when the effective call differs from the approved/proposed action;
- decision provenance is adjacent to `HP-AUDIT-001`;
- no distinct stable failure class has yet been demonstrated.

Current position:

- classification: **REFINEMENT / COMPOSITION / NO NEW STABLE ID**;
- no new `HP-*` ID reserved;
- stable corpus remains **23 attacks**;
- public package remains `0.4.0`;
- no release triggered;
- no claim that LangGraph is vulnerable;
- no claim that the proposed hook is implemented;
- no external HandoffProbe validation claim;
- no public result return yet.

Possible next research step:

a deterministic synthetic fixture may compare clean resume, changed effective call, changed authority/policy state, crash/recovery duplicate-effect handling and explicitly fresh reauthorization.

Fixture work must preserve logical action identity, attempt identity, admission-decision identity and protected-effect evidence separately.

## RC-7 — Sanction Gate sanction currency at effect time

Status: **FROZEN / OVERLAP COMPLETE — EXTERNAL TECHNICAL VALIDATION / TRACEABILITY SIGNAL — NO NEW STABLE ID**

Detailed research record:

`docs/SANCTION_GATE_2_STALE_AUTHORITY_SIGNAL_20260923.md`

External source:

https://github.com/math-r-association/sanction-gate/issues/2

Originating A2A proposal:

https://github.com/a2aproject/A2A/issues/2250

The external Sanction Gate record promotes the stale-authority / effect-time boundary raised by `@Heaviside479` into a first-class external issue and separates artifact validity, current authority and final effective-action binding.

Candidate vector once external semantics exist:

`sanction admitted -> action held before effect -> sanction withdrawn or superseded -> same action resumes -> zero protected effects`

Current overlap result:

- same-action stale-state resume is primarily an `HP-RACE-002` refinement;
- `HP-AUTH-006` remains adjacent but is not governing because its stable scenario requires an earlier completed protected effect followed by a later distinct effect;
- effective-action binding may overlap existing target, approval and semantic-authority invariants;
- no distinct stable failure class has been demonstrated.

Current position:

- classification: **EXTERNAL TECHNICAL VALIDATION / TRACEABILITY SIGNAL — REFINEMENT / NO NEW STABLE ID**;
- no new `HP-*` ID reserved;
- stable corpus remains **23 attacks**;
- public package remains `0.4.0`;
- no release triggered;
- no reference implementation exists at freeze time;
- no validated Sanction Gate conformance result exists;
- no independent HandoffProbe reproduction exists;
- no adoption claim is made.

Future direct comparison is gated on concrete withdrawal ordering, execution-boundary semantics and a reference implementation or executable conformance vector.
