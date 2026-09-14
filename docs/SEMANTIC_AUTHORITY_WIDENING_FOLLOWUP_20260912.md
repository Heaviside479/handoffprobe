# Semantic Authority Widening Follow-up

Status: **COMPLETE 2026-09-14** — Outcome B implemented as an HP-AUTH-001 refinement; stable attack count remains 22.
Decision date: 2026-09-12
Execution order update: **T-1 may proceed in parallel while CV-5 directory/product-website item 4 remains deferred to the marketing workflow. CV-5 remains open until that item is completed and verified.**

## 1. Why this follow-up exists

A technical discussion in `a2aproject/A2A` surfaced a concrete A2A -> MCP translation case that is directly relevant to HandoffProbe's handoff-security thesis.

Discussion:

`https://github.com/a2aproject/A2A/discussions/2181`

External implementation:

`https://github.com/arjun2075/a2a-mcp-authority-conformance/pull/1`

The external pull request was merged on 2026-09-12 as:

`c365a7fef4b96f2b5ceae65cfec9deeae5db5bae`

The external fixture isolates a failure class named `SEMANTIC_AUTHORITY_WIDENING` around the fixture-scoped invariant:

```text
effective_authority(downstream) ⊆ delegated_authority(upstream)
```

The key distinction is important:

- representation loss by itself is not automatically a security failure;
- a restriction may disappear from the direct A2A -> MCP representation while still being preserved by equivalent trusted downstream enforcement;
- the security failure occurs when translation causes the effective downstream authority to become broader than the upstream delegated authority.

The external fixture keeps this case separate from explicit attenuation failure and authenticated-leaf mismatch. Its documentation also describes the fixture and HandoffProbe as complementary based on their public scopes. That wording must not be represented as coordination, adoption, endorsement or certification.

## 2. Priority and sequencing

T-1 became active on 2026-09-13 through an explicit project-owner sequencing decision.

CV-5 item 4 remains open and is deferred to the marketing workflow. This exception does not mark CV-5 complete and does not change its exit gate.

T-1 may proceed in parallel because the remaining CV-5 work is distribution/marketing execution rather than a technical prerequisite for this research.

If T-1 work conflicts with a real customer, assessment, payment, delivery or other revenue-validation task, the customer/revenue task takes priority.

CV-6 first-revenue validation may continue in parallel with T-1.
## 3. Research question

Determine whether semantic authority widening caused by lossy handoff translation is:

1. already fully represented by an existing stable HandoffProbe attack/invariant;
2. a refinement that should improve an existing attack's fixtures/evidence/documentation; or
3. a genuinely distinct handoff-specific invariant that merits admission as a future stable attack.

Do not assume outcome 3 in advance.

## 4. Required work

### T1.1 — freeze external evidence

Status: **COMPLETE 2026-09-13** — frozen in `docs/T1_SEMANTIC_AUTHORITY_EVIDENCE_20260913.md`.

- record the exact A2A Discussion reference;
- record the merged external pull request and merge commit;
- inspect the external semantic fixture, tests, documentation and failure taxonomy;
- preserve provenance for any idea, terminology or test shape used during evaluation;
- review the external repository license before copying or adapting any source material;
- prefer independent HandoffProbe implementation over copying external code.

### T1.2 — map against the current HandoffProbe corpus

Status: **COMPLETE 2026-09-13** — 22/22 stable attacks reviewed in `docs/T1_SEMANTIC_AUTHORITY_OVERLAP_MATRIX_20260913.md`; working conclusion favors refinement of HP-AUTH-001 pending independent reproduction.

Review the current 22 stable attacks and explicitly compare the external case against at least:

- delegated-authority amplification / attenuation behavior;
- delegation-chain handling;
- identity / authenticated-leaf continuity;
- target/resource binding where relevant;
- approval and credential boundaries where relevant;
- existing Phase 9 crossing-corpus observations.

Produce a written overlap matrix answering:

- what existing attack already detects;
- what it does not detect;
- whether semantic translation loss is merely another mutation of an existing invariant or a separate property;
- what evidence would distinguish the cases deterministically.

### T1.3 — formalize the candidate invariant

Status: **NOT TRIGGERED** — T1.2 established that the case is an HP-AUTH-001 refinement rather than a distinct invariant requiring separate formalization.

If the case remains distinct after overlap review, define a HandoffProbe-owned candidate invariant using semantic effect rather than field-name equality.

Working formulation:

```text
effective_authority(downstream) ⊆ delegated_authority(upstream)
```

Required interpretation:

- both sides must be evaluated over the same protected action/resource semantics;
- direct field loss is not itself FAIL;
- equivalent trusted downstream enforcement may preserve the invariant;
- newly permitted downstream operations that were prohibited upstream are the candidate failure condition;
- scanner/runtime `ERROR` must remain distinct from security `FAIL`.

The external finite-operation-universe model is evidence for the research question, not automatically HandoffProbe's final generalized model.

### T1.4 — reproduce independently in HandoffProbe

Status: **COMPLETE 2026-09-14** — independent deterministic reproduction recorded in `docs/T1_SEMANTIC_AUTHORITY_REPRODUCTION_20260914.md`.

Build the smallest deterministic HandoffProbe-owned synthetic reproduction needed to answer the research question.

Minimum controls should include:

- direct preservation -> expected PASS;
- representation loss with equivalent trusted downstream enforcement -> expected PASS;
- representation loss without equivalent enforcement causing newly permitted authority -> expected FAIL candidate;
- stricter downstream authority -> expected PASS;
- an identity/binding-invalid control that remains classified separately from semantic widening;
- an explicit attenuation/escalation control that remains classified separately where applicable.

Requirements:

- local/synthetic only;
- no third-party production target;
- no paid AI service;
- deterministic repeated runs;
- evidence sufficient to explain why effective authority did or did not widen;
- no secret-bearing evidence.

### T1.5 — admission decision

Status: **COMPLETE 2026-09-14**

Decision: **B — refine HP-AUTH-001; do not create a new stable attack ID.**

Evidence: `docs/T1_SEMANTIC_AUTHORITY_ADMISSION_DECISION_20260914.md`.

After the independent reproduction, make one explicit decision:

**A. Existing attack already covers it**
Improve fixtures/evidence/docs if useful, but do not create a duplicate attack ID.

**B. Existing attack needs a refinement**
Extend the existing invariant/test shape under normal compatibility and release discipline.

**C. Distinct invariant is justified**
Only then draft a new attack specification and candidate ID through the normal attack-admission process.

No new stable attack ID may be created solely because an external fixture uses a distinct failure name.

### T1.6 — product and research follow-through

Status: **COMPLETE 2026-09-14**

Outcome B was implemented under the existing stable ID `HP-AUTH-001`.

Closeout evidence:

`docs/T1_HP_AUTH_001_SEMANTIC_REFINEMENT_CLOSEOUT_20260914.md`

The productive refinement:

- preserves the existing direct `invoice.read` -> `invoice.update` regression;
- adds a deterministic finite protected-operation evaluator for upstream, translated and effective downstream authority;
- models trusted downstream restriction explicitly where applicable;
- requires a concrete newly permitted operation witness before semantic widening is classified as `FAIL`;
- preserves representation loss / translation change as non-failing when effective downstream authority remains equal or narrower;
- keeps evaluator/model `ERROR` separate from security `FAIL`;
- preserves `HP-AUTH-001`, severity, property class and protocol applicability;
- keeps the stable public corpus at **22 attacks**;
- leaves the package-root API, GitHub Action contract and package version unchanged during T1.6.

No distinct attack was admitted. T1.3 therefore remained not triggered.

The next public version is not bumped as part of T1.6. The merged R3 roadmap records `v0.3.0` as the expected candidate only after this refinement is merged and the release scope is frozen, with npm/GitHub/tag/Action/Marketplace/documentation verification performed as one coordinated release.

## 5. External-signal interpretation

The 2026-09-12 interaction is a meaningful qualitative technical signal because an external developer:

- engaged substantively with the proposed handoff-boundary case;
- implemented an executable negative/control fixture around the semantic subset invariant;
- separated that case from other authority/binding failures;
- documented HandoffProbe as a broader complementary tool based on public scope.

This is **not** proof of HandoffProbe adoption, partnership, endorsement, compatibility certification or commercial demand.

It is evidence that the problem framing can generate concrete independent technical work and should therefore be evaluated seriously after the current commercial-launch baseline is complete.

## 6. Guardrails

- no claim that A2A or MCP normatively defines this authorization model unless supported by the protocols;
- no claim that representation loss is always a vulnerability;
- no claim of coordination or endorsement by the external repository owner;
- no copying of external implementation without license/provenance review;
- no production-world or unauthorized third-party testing;
- no new public attack count until normal admission and release gates are satisfied;
- no blocking or displacement of the remaining CV-5 distribution work; T-1 proceeds in parallel.

## 7. Exit gate

This follow-up is complete when HandoffProbe has an evidence-backed written decision showing whether semantic authority widening under lossy A2A -> MCP translation is:

- already covered;
- an existing-attack refinement; or
- a distinct admitted handoff-security invariant.

Any implementation resulting from that decision must preserve deterministic evidence, secret safety, existing public-contract discipline and the distinction between research/conformance evidence and public stable attack claims.
