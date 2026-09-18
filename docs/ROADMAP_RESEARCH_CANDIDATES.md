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

Status: **QUEUED / NOT YET EXECUTED**

Detailed queue:

`docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md#r-1--token-rotation-during-interrupted-handoff--reconnect-with-stale-token`

Community feedback supplied a concrete stale-session variant:

`token A valid → server rotates to B → deterministic interruption → reconnect in same handoff context with stale A`.

Preliminary overlap maps the governing negative invariant to stable `HP-RACE-002 — Partial-failure stale execution`.

Current position:

- classification: **REFINEMENT**;
- no new stable ID justified at intake;
- `HP-REPLAY-003` becomes governing only if a prior protected effect already occurred and the reconnect can duplicate the same logical action;
- `HP-AUTH-006` is not governing because R-1 resumes the same interrupted logical action rather than authorizing a later distinct effect;
- implementation is authorized only as a narrow deterministic research/regression fixture after the queue is merged;
- final admission remains evidence-driven.

The merged result must be returned to the originating Reddit discussion before the research loop is considered complete.

## RC-3 — Reddit same-name capability hot-deploy drift

Status: **QUEUED / DISTINCTNESS UNRESOLVED**

Detailed queue:

`docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md#r-2--same-name-hot-deploy--capability-drift-after-approval`

Community feedback supplied a capability-version edge case in which approval is issued for version A and the same visible tool name resolves to materially different version B before execution.

Preliminary overlap:

- `HP-APPROVAL-002` is relevant but currently mutates the tool identity itself;
- `HP-VERSION-001` is adjacent but does not by itself settle stale approval under same-name capability drift.

Current position:

- classification: **RESEARCH CANDIDATE — ADMISSION UNRESOLVED**;
- no new stable `HP-*` ID reserved;
- a deterministic capability-definition/digest fixture is permitted only after the queue is merged;
- a later stable ID requires normal distinctness/admission evidence;
- the merged result must be returned to the originating Reddit discussion;
- `EVIDENCE.md` remains gated on reproducible execution and public result return.
