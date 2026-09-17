# Model-mediated mutation discovery — research candidate

Status: **RESEARCH CANDIDATE — recorded 2026-09-17; non-blocking; no implementation or stable-attack admission decision.**

## Trigger

External technical feedback highlighted a useful blind spot in HandoffProbe's current deterministic testing model: the stable corpus can deterministically reproduce known handoff mutations, but a real agent may rewrite, summarize or reinterpret a constrained request in model-mediated ways that are not enumerated in advance.

That feedback does not invalidate the deterministic corpus. It suggests a separate discovery lane that could explore realistic model-mediated mutations without weakening HandoffProbe's reproducibility guarantees.

The same external feedback also described stale or "sticky" authority surviving longer than intended. That second class is already represented by the separately admitted `HP-AUTH-006 — Stale task authorization reused for later effect` in v0.4.0 and therefore does not create another candidate by itself.

## Research hypothesis

Explore an **opt-in discovery mode** in which a model can rewrite or mutate a handoff across an agent/tool/protocol boundary, while keeping the stable HandoffProbe regression corpus deterministic.

The intended pipeline is:

```text
model-mediated exploration
        |
        v
interesting handoff failure candidate
        |
        v
capture exact evidence and provenance
        |
        v
minimize / normalize the failure
        |
        v
reproduce without model variability
        |
        v
deterministic fixture
        |
        v
normal overlap + attack-admission review
```

A nondeterministic discovery result is **evidence input**, not a stable HandoffProbe finding or stable attack merely because it occurred once.

## Candidate discovery requirements

If this research is activated later, evaluate whether the discovery lane can:

- mutate or rewrite authorization-relevant handoff material through a real or controlled model-mediated step;
- preserve the upstream caller, authority, context, approval and intended effect as explicit comparison inputs;
- capture the exact downstream target/tool/arguments/context/authority projection immediately before dispatch;
- record whether the protected effect actually occurred;
- distinguish equivalent normalization from security-relevant widening, redirection, identity/context substitution or approval drift;
- repeat the same discovery attempt enough times to measure stability rather than treating one sample as representative;
- minimize any interesting failure into the smallest understandable counterexample;
- convert a confirmed counterexample into a deterministic local/synthetic fixture before it can enter normal regression or attack-admission review.

## Reproducibility record

Where available, discovery evidence should record:

- model/provider and exact model/version identifier;
- local/open-weight versus hosted execution;
- prompt/system/instruction inputs relevant to the mutation;
- original handoff input;
- exact model output or rewritten handoff;
- sampling parameters;
- seed when the model/runtime exposes one;
- adapter/protocol versions;
- caller, task/context, audience/resource, tool/action and authorization-relevant arguments before and after the model-mediated step;
- protected-effect evidence;
- repeated-run observations and observed variance.

If a candidate cannot be stabilized or independently reproduced, keep it as research evidence or `INCONCLUSIVE`; do not promote it into deterministic stable coverage.

## Activation gate

Do **not** implement this simply because it is now documented.

Activate a concrete research work package only when at least one of the following exists:

1. a concrete external agent flow or public reproducible example demonstrates a model-mediated handoff mutation that current deterministic fixtures cannot adequately represent; or
2. two independent external technical signals identify materially the same model-mediated coverage gap; or
3. internal research produces a handoff-specific failure that survives overlap review and cannot be responsibly explored through the existing deterministic mutation machinery alone.

Before implementation, perform an overlap review against the stable attack corpus, Phase 9/T-series evidence and any later admitted attacks.

## Guardrails

- this entry does not create a 24th stable attack;
- no new `HP-*` ID is reserved by this document;
- no npm version bump or release is authorized by this document;
- the stable regression suite remains deterministic;
- nondeterministic model output must never be presented as deterministic coverage;
- no paid AI API may become mandatory for Core, CI or the standard stable corpus;
- any hosted-model integration must be optional, explicit about cost/data handling and separable from the local-first Core;
- prefer local/no-paid reproducibility where technically useful;
- no hidden telemetry;
- use only synthetic, owned or explicitly authorized targets;
- do not send secrets, private customer data or undisclosed vulnerability material to third-party model providers;
- normal evidence, overlap, admission and controlled-release discipline remains authoritative.

## Relationship to Phase 10

Phase 10 already defines deterministic seed handling where randomized coverage is introduced. This research candidate belongs adjacent to that determinism work, but it is **non-blocking** and does not expand the Phase 10 exit gate.

P10.3/P10.4 reliability work, active release synchronization and already queued external-evidence tracks must not be displaced merely to pursue this candidate.

## Research question

> Can model-mediated exploration discover realistic handoff-security failures that a fixed mutation catalog misses, while every shippable regression is reduced to a deterministic, reviewable fixture?

Until the activation gate is met, the correct status is **recorded research candidate, not committed feature**.
