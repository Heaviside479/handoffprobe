# T-2.3 Handoff Contract overlap matrix

Date: 2026-09-15

Status: **COMPLETE**

Track: **T-2 — protocol-neutral Handoff Contract review**

## Purpose

Classify every T-2.2 candidate invariant against the complete stable HandoffProbe corpus, the completed T-1 semantic-authority decision and Phase 9 crossing evidence before any new research fixture is implemented.

This document is an overlap and research-admission decision only.

It does not:

- create a new stable attack ID;
- change an existing stable attack ID;
- change HandoffProbe runtime behavior;
- change CLI, report, config or GitHub Action contracts;
- change the A2A 1.0 → MCP 2026-07-28 baseline;
- change the stable attack count of 22;
- change package version 0.3.0;
- claim a protocol requirement that primary protocol evidence has not established.

## Classification vocabulary

`ALREADY COVERED`

The protected property and relevant failure mode are already represented by stable HandoffProbe coverage or sufficiently direct existing evidence. A separate T-2 research fixture is not justified.

`REFINEMENT`

The candidate adds useful precision to an existing invariant but does not establish a distinct security property.

`DISTINCT RESEARCH CANDIDATE`

Existing stable coverage is adjacent but does not directly test the proposed security property. A deterministic research fixture may be justified under T-2.4. This is not stable attack admission.

`OUT OF SCOPE`

The candidate does not establish a handoff or composition security property appropriate for HandoffProbe.

## Stable corpus baseline

The stable public corpus remains exactly 22 attacks:

### P0

1. `HP-AUTH-001` — Delegated authority amplification
2. `HP-AUTH-002` — Missing scope fails open at handoff
3. `HP-AUTH-003` — Cross-agent authorization reuse
4. `HP-ID-001` — Original-principal continuity loss
5. `HP-ID-002` — Agent identity substitution across translation
6. `HP-TENANT-001` — Tenant context loss/substitution
7. `HP-TARGET-001` — Resource substitution
8. `HP-TARGET-002` — Capability/tool semantic collision
9. `HP-APPROVAL-001` — Security-sensitive payload mutation after consent
10. `HP-CRED-001` — Broad upstream credential propagation
11. `HP-CRED-002` — Cross-audience credential acceptance
12. `HP-LIFECYCLE-001` — Cancellation not propagated

### P1

13. `HP-AUTH-004` — Expired delegation reuse
14. `HP-AUTH-005` — Delegation-chain truncation
15. `HP-REPLAY-001` — Exact action replay
16. `HP-REPLAY-002` — Cross-context / cross-run replay
17. `HP-REPLAY-003` — Retry double execution
18. `HP-APPROVAL-002` — Tool substitution after approval
19. `HP-APPROVAL-003` — Approval reuse for another resource
20. `HP-RACE-001` — Parallel one-time authority consumption
21. `HP-RACE-002` — Partial-failure stale execution
22. `HP-AUDIT-001` — Cross-protocol audit lineage break

## Candidate decisions

| Candidate invariant | Stable-corpus overlap | T-1 / Phase 9 evidence | Classification | T-2.4 |
| --- | --- | --- | --- | --- |
| Authority / capability monotonicity | `HP-AUTH-001`, with supporting authority cases in `HP-AUTH-002/003/004/005`, target and credential boundaries | T-1 directly resolved semantic widening under `HP-AUTH-001` | **ALREADY COVERED** | No new fixture |
| Replay / logical-action uniqueness | `HP-REPLAY-001/002/003`, `HP-RACE-001`, `HP-RACE-002` | Phase 9 records shared replay-store provenance and second-attempt `nonce_replay` rejection | **ALREADY COVERED** | No new fixture |
| Provenance continuity / mutation visibility | `HP-ID-001/002`, `HP-AUTH-005`, `HP-AUDIT-001`, plus context/audience-sensitive stable cases | Phase 9 observes caller, task, context, audience, tool, arguments, authority and stage provenance | **ALREADY COVERED** | No new fixture |
| Canonicalization / version interpretation consistency | Adjacent to `HP-TARGET-002`; `HP-VERSION-001` exists only in backlog, not stable corpus | T-1 establishes that representation difference alone is not failure, but does not test interpretation divergence | **DISTINCT RESEARCH CANDIDATE** | Yes |
| Ambiguous / duplicate-field interpretation | Adjacent to target substitution, semantic collision, approval mutation and routing backlog | No existing stable case directly exercises parser or precedence disagreement over duplicate security-relevant representations | **DISTINCT RESEARCH CANDIDATE** | Yes |

## Complete 22-attack mapping

The table below forces each of the 22 stable attacks through the T-2 candidate set.

Legend:

- `D` = direct overlap
- `S` = supporting or adjacent overlap
- `—` = no material overlap

| Stable attack | Authority | Replay | Provenance | Canon/version | Ambiguity |
| --- | :---: | :---: | :---: | :---: | :---: |
| `HP-AUTH-001` | D | — | S | S | — |
| `HP-AUTH-002` | D | — | S | — | S |
| `HP-AUTH-003` | D | — | S | — | — |
| `HP-ID-001` | — | — | D | — | — |
| `HP-ID-002` | S | — | D | — | S |
| `HP-TENANT-001` | S | — | D | — | S |
| `HP-TARGET-001` | S | — | S | S | S |
| `HP-TARGET-002` | S | — | S | S | S |
| `HP-APPROVAL-001` | S | — | S | — | S |
| `HP-CRED-001` | D | — | S | — | — |
| `HP-CRED-002` | S | S | D | — | — |
| `HP-LIFECYCLE-001` | — | S | S | — | — |
| `HP-AUTH-004` | D | S | S | — | — |
| `HP-AUTH-005` | D | — | D | — | — |
| `HP-REPLAY-001` | — | D | S | — | — |
| `HP-REPLAY-002` | S | D | S | — | — |
| `HP-REPLAY-003` | — | D | S | — | — |
| `HP-APPROVAL-002` | S | — | S | S | S |
| `HP-APPROVAL-003` | S | S | S | — | S |
| `HP-RACE-001` | — | D | S | — | — |
| `HP-RACE-002` | — | D | S | — | S |
| `HP-AUDIT-001` | — | — | D | — | — |

No row in this table changes the semantics or ownership of a stable attack.

Supporting overlap is not sufficient by itself to classify a new candidate as already covered.

## Candidate 1 — authority / capability monotonicity

### Stable overlap

Primary ownership is `HP-AUTH-001`.

The stable attack already evaluates whether concrete effective downstream protected operations exceed upstream delegated authority.

Additional stable cases exercise narrower authority-related failure modes, including:

- missing scope;
- cross-agent authorization reuse;
- expiry;
- delegation-chain integrity;
- broad credential propagation;
- cross-audience use;
- resource and tool substitution.

### T-1 decision

T-1 already made the relevant admission decision:

`effective_authority(downstream) ⊆ delegated_authority(upstream)`

Semantic authority widening was classified as a refinement of `HP-AUTH-001`, not a new stable attack.

### Decision

**ALREADY COVERED**

T-2.4 must not create another authority-widening research fixture merely under a new protocol-neutral label.

## Candidate 2 — replay / logical-action uniqueness

### Stable overlap

Direct stable ownership spans:

- `HP-REPLAY-001`;
- `HP-REPLAY-002`;
- `HP-REPLAY-003`;
- `HP-RACE-001`;
- `HP-RACE-002`.

Together these already distinguish exact replay, cross-context reuse, retry double execution, concurrent one-time consumption and stale resumed execution.

### Phase 9 evidence

Phase 9 records replay-store provenance shared across required attempts.

Its replay example records:

- attempt 1 accepted;
- attempt 2 rejected as `nonce_replay`;
- productive local receiver effect observation outside the verifier.

### Decision

**ALREADY COVERED**

No T-2.4 replay fixture is justified without new evidence of a logically distinct replay property.

## Candidate 3 — provenance continuity / mutation visibility

### Stable overlap

Direct and supporting stable coverage includes:

- `HP-ID-001` for original-principal continuity;
- `HP-ID-002` for identity substitution;
- `HP-AUTH-005` for delegation lineage;
- `HP-AUDIT-001` for cross-protocol audit correlation;
- tenant, target, audience and approval cases where provenance participates in the security decision.

### Phase 9 evidence

The Phase 9 runtime observation boundary records:

- authenticated caller identity;
- message ID;
- task ID;
- context ID;
- transport audience;
- MCP tool;
- MCP arguments;
- pre-mutation authority;
- post-mutation runtime observation;
- authority and stage verification provenance;
- status freshness provenance;
- replay-store provenance.

Phase 9 also discriminates caller, message, task, context, audience, tool and argument mutation.

### Decision

**ALREADY COVERED**

The T-2 contract remains useful as a protocol-neutral explanation layer, but current evidence does not justify another provenance attack or research fixture.

## Candidate 4 — canonicalization / version interpretation consistency

### Existing overlap

`HP-TARGET-002` can expose semantic collision when differently represented capabilities or tools map to broader semantics.

T-1 also establishes an important negative rule:

representation change alone is not a security failure when effective trusted enforcement preserves or narrows the protected property.

The catalog contains `HP-VERSION-001`, but that item is backlog only and is not one of the 22 stable attacks.

### Gap

The stable corpus does not directly exercise a case where:

1. the same security-relevant input is accepted by both sides;
2. upstream and downstream use different canonicalization or version interpretation;
3. the resulting effective downstream meaning materially differs;
4. the divergent meaning reaches or would reach a protected decision;
5. equivalent trusted interpretation remains a PASS control.

### Decision

**DISTINCT RESEARCH CANDIDATE**

T-2.4 should create the smallest deterministic local/synthetic research fixture for this gap.

No stable attack ID is assigned.

## Candidate 5 — ambiguous / duplicate-field interpretation

### Existing overlap

Several stable attacks can observe consequences that may also result from ambiguity:

- `HP-TARGET-001`;
- `HP-TARGET-002`;
- `HP-APPROVAL-001`;
- `HP-APPROVAL-002`;
- `HP-APPROVAL-003`;
- `HP-RACE-002`.

The backlog routing candidate is also adjacent.

### Gap

The stable corpus does not directly exercise parser or precedence disagreement where:

1. multiple valid-looking representations encode the same security-relevant concept;
2. different handoff stages select different effective values;
3. the disagreement changes authorization, identity, target, approval or execution meaning;
4. deterministic rejection or consistent trusted precedence remains a PASS control.

This is a mechanism-level handoff ambiguity not established merely by observing the downstream substitution consequence.

### Decision

**DISTINCT RESEARCH CANDIDATE**

T-2.4 should create the smallest deterministic local/synthetic research fixture for this gap.

No stable attack ID is assigned.

## Phase 9 conclusion

Phase 9 materially reduces T-2 novelty.

It already provides deterministic HandoffProbe-owned evidence for identity, task, context, audience, authority, stage, payload and replay binding.

Therefore T-2.4 must not duplicate those crossing cases.

The two retained research candidates must be scoped specifically to interpretation divergence:

1. canonicalization / version interpretation;
2. ambiguous / duplicate-field interpretation.

## T-2.4 admission result

Retained for deterministic research:

- `T2-CANONICALIZATION-VERSION` — research name only;
- `T2-AMBIGUOUS-DUPLICATE-FIELD` — research name only.

These are research labels, not stable HandoffProbe attack IDs.

Not retained for new T-2.4 fixtures:

- authority / capability monotonicity;
- replay / logical-action uniqueness;
- provenance continuity / mutation visibility.

## Stable-corpus guard

After T-2.3:

- stable attacks: **22**;
- new stable attacks admitted: **0**;
- existing stable IDs modified: **0**;
- research candidates retained: **2**;
- package version remains **0.3.0**.

Any later attack admission requires a separate evidence-backed decision after deterministic research and external review.

## T-2.3 exit gate

T-2.3 is complete because:

- all five T-2.2 candidate invariants are classified;
- all 22 stable attacks are explicitly mapped;
- T-1 is authoritative for authority widening;
- Phase 9 crossing evidence is incorporated;
- each candidate has one allowed classification;
- no new stable attack ID is assigned;
- exactly two distinct research candidates remain for T-2.4.
