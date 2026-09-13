# T1.2 Semantic Authority Overlap Matrix

Status: **COMPLETE 2026-09-13 — overlap review complete; admission decision remains deferred until independent reproduction**

## 1. Research question

This review asks whether semantic authority widening caused by lossy A2A -> MCP translation is already represented by the current 22 stable HandoffProbe attacks, is best treated as a refinement of an existing attack, or appears to require a distinct invariant.

The external research case uses the fixture-scoped relation:

`effective_authority(downstream) ⊆ delegated_authority(upstream)`

Representation loss by itself is not a failure. A failure requires a concrete downstream operation to become permitted even though it was not permitted by the upstream delegated authority.

## 2. Classification vocabulary

- **DIRECT** — same core security property.
- **ADJACENT** — can expose one dimension or special case of widening but has a different primary invariant.
- **SEPARATE CONTROL** — useful for distinguishing another failure class from semantic widening.
- **NOT MATERIAL** — does not materially answer the semantic-authority question.

## 3. Stable attack overlap matrix — 22 / 22

| Stable attack | Classification | What it already detects | What it does not establish for T-1 |
| --- | --- | --- | --- |
| HP-AUTH-001 Delegated authority amplification | **DIRECT** | Downstream effective authority becoming broader than upstream delegated authority. Its documented invariant is already the same core security property as the T-1 candidate. | Current stable fixture broadens structured capability authority (`invoice.read` -> `invoice.update`). It does not yet prove semantic equivalence across lossy representations, trusted compensating downstream enforcement, or operation-set comparison where the wire fields differ. |
| HP-AUTH-002 Missing scope fails open at handoff | **ADJACENT** | Complete removal of authority/scope followed by an unsafe broader fallback. | Does not distinguish partial representation loss from semantic loss and does not model a lost constraint that is equivalently enforced downstream. |
| HP-AUTH-003 Cross-agent authorization reuse | **SEPARATE CONTROL** | Authority reused after the acting downstream agent changes. | Tests delegate binding, not whether unchanged identities receive broader effective semantic authority. |
| HP-ID-001 Original-principal continuity loss | **SEPARATE CONTROL** | Loss/collapse of the original authorized actor. | Identity continuity can remain valid while semantic authority still widens. |
| HP-ID-002 Agent identity substitution across translation | **SEPARATE CONTROL** | Authorization surviving unauthorized agent substitution. | Semantic widening can occur with the correct authenticated agent and therefore must not be classified as identity substitution. |
| HP-TENANT-001 Tenant context loss/substitution | **ADJACENT** | Tenant loss/substitution reaching a broader or different resource set. | Tenant is one possible authority dimension, but the attack does not generalize arbitrary semantic constraints or equivalent downstream enforcement. |
| HP-TARGET-001 Resource substitution | **ADJACENT** | Authority moving from one resource to another while the operation remains constant. | Resource binding is one concrete authority dimension; T-1 must also handle widening where resource binding remains correct. |
| HP-TARGET-002 Capability/tool semantic collision | **ADJACENT** | A translation mapping similarly named capabilities/tools to broader downstream semantics. | Focuses on capability/tool mapping collision, not general loss of an upstream policy constraint while the selected action/tool can remain the same. |
| HP-APPROVAL-001 Security-sensitive payload mutation after consent | **ADJACENT** | Approved security-sensitive values changing before execution. | Approval binding can remain intact while translation independently widens effective authority. |
| HP-CRED-001 Broad upstream credential propagation | **ADJACENT** | A broad credential crossing the boundary instead of narrower delegated authority. | Detects credential propagation policy, not semantic equivalence of translated authority constraints. |
| HP-CRED-002 Cross-audience credential acceptance | **SEPARATE CONTROL** | Credential authority being accepted against the wrong audience/resource. | Audience validity may be correct while semantic authority widens. |
| HP-LIFECYCLE-001 Cancellation not propagated | **NOT MATERIAL** | Execution after governing upstream cancellation. | Temporal lifecycle failure is distinct from translation-time semantic widening. |
| HP-AUTH-004 Expired delegation reuse | **SEPARATE CONTROL** | Authority used after delegation expiry. | Temporal validity can remain correct while semantic restrictions are lost during translation. |
| HP-AUTH-005 Delegation-chain truncation | **ADJACENT** | Loss of an intermediate delegation hop where chain lineage/attenuation matters. | A semantic restriction may be lost without truncating the delegation chain, and the same representation loss may be safe when equivalent downstream enforcement exists. |
| HP-REPLAY-001 Exact action replay | **NOT MATERIAL** | Reuse of an already consumed translated action. | Replay does not answer translation-time authority subset semantics. |
| HP-REPLAY-002 Cross-context / cross-run replay | **NOT MATERIAL** | Captured authority reused in another task/run/context. | Cross-context reuse is distinct from widening inside one legitimate handoff. |
| HP-REPLAY-003 Retry double execution | **NOT MATERIAL** | Duplicate protected side effects caused by retry ambiguity. | Idempotency/retry semantics are independent of authority-set widening. |
| HP-APPROVAL-002 Tool substitution after approval | **ADJACENT** | A different MCP tool being executed than the one authorized upstream. | T-1 can fail while the tool remains unchanged and only a semantic restriction on allowed operations is lost. |
| HP-APPROVAL-003 Approval reuse for another resource | **ADJACENT** | Consent reused against another downstream resource. | Resource-scoped consent is a special binding case rather than a general semantic authority comparison. |
| HP-RACE-001 Parallel one-time authority consumption | **NOT MATERIAL** | Concurrent consumption of one-time authority. | Concurrency does not determine whether translation widened effective authority. |
| HP-RACE-002 Partial-failure stale execution | **NOT MATERIAL** | Resumption after partial failure using stale/ambiguous state. | Recovery-state safety is independent from semantic translation loss. |
| HP-AUDIT-001 Cross-protocol audit lineage break | **SEPARATE CONTROL** | Loss of correlation between actor, task/delegation and MCP request. | Audit lineage may remain complete while the translated policy nevertheless permits additional operations. |

Stable corpus coverage: **22 / 22 attacks reviewed**.

## 4. Most important overlap: HP-AUTH-001

HP-AUTH-001 already states the governing invariant:

`Downstream effective authority must not exceed upstream delegated authority.`

That is materially the same security property as the external fixture-scoped formulation:

`effective_authority(downstream) ⊆ delegated_authority(upstream)`

The difference discovered by T-1 is currently in the **representation and evidence model**, not yet in the security property itself.

The current HP-AUTH-001 stable fixture demonstrates authority amplification by replacing a narrow capability with a broader capability. That is a valid concrete instance of the invariant.

The external signal demonstrates a harder instance:

1. an upstream semantic constraint exists;
2. its direct representation is lost during translation;
3. the same loss is safe when equivalent trusted downstream enforcement preserves the effective permitted-operation set;
4. the same loss is unsafe when no equivalent enforcement exists and a concrete previously prohibited operation becomes permitted.

Therefore field loss cannot itself be the failure predicate.

## 5. Why HP-AUTH-002 is not sufficient

HP-AUTH-002 covers a useful related case: missing authority must not fail open into broader fallback authority.

T-1 is more specific in a different way. The upstream authority may still be present and mostly translated correctly. Only one semantic restriction may lose its direct representation.

A correct implementation may also intentionally omit that representation while enforcing the same restriction through a trusted downstream policy.

HP-AUTH-002 therefore does not replace the semantic comparison required by T-1.

## 6. Identity, binding and attenuation controls

The following existing attacks provide important negative controls rather than duplicate coverage:

- HP-AUTH-003;
- HP-ID-001;
- HP-ID-002;
- HP-TENANT-001;
- HP-TARGET-001;
- HP-AUTH-005;
- HP-CRED-002;
- HP-APPROVAL-002;
- HP-APPROVAL-003.

A T-1 reproduction must show that a semantic-widening FAIL can occur while the relevant identity and binding controls remain valid.

Where a control itself is invalid, the result must retain its existing classification rather than being relabeled semantic authority widening.

## 7. Phase 9 overlap

Phase 9 supplies useful crossing-boundary evidence and implementation patterns but does not currently constitute a stable semantic-authority attack.

The frozen Phase 9 crossing corpus exercises and observes dimensions including:

- authenticated A2A caller;
- message, task and context binding;
- MCP audience;
- MCP tool and arguments;
- authority observation and authenticated authority artifacts;
- replay handling;
- pre-dispatch rejection and local synthetic effect evidence.

Observed discriminating examples include caller, message, task, context, audience, tool and argument swaps plus replay rejection.

This evidence is valuable for T-1 because it demonstrates deterministic crossing-boundary observation, rebinding, issuer authentication, pre-dispatch gates and effect recording.

However, Phase 9 does not establish a general semantic relation between the set of operations permitted upstream and the effective set permitted after translation.

An authority digest or authenticated artifact can be intact while the translation represented by that artifact is semantically broader than the upstream policy.

Phase 9 therefore acts as **supporting/control evidence**, not duplicate stable coverage.

## 8. Deterministic evidence needed to distinguish the cases

The next independent reproduction must be able to show all of the following without relying on field-name equality:

1. **direct preservation -> PASS**
   - downstream effective permitted operations are equal to or narrower than upstream;

2. **representation loss + equivalent trusted downstream enforcement -> PASS**
   - a constraint may disappear from the translated representation while the effective permitted-operation set remains equal to or narrower than upstream;

3. **representation loss + no equivalent enforcement -> FAIL candidate**
   - at least one concrete downstream operation is newly permitted even though upstream prohibited it;

4. **stricter downstream authority -> PASS**
   - downstream may safely become narrower;

5. **identity/binding-invalid control -> existing identity/binding classification**
   - not semantic widening;

6. **explicit delegation attenuation/escalation control -> existing authority/binding classification where applicable**
   - no duplicate classification solely because the semantic evaluator can also observe broader effect;

7. **runtime/scanner ERROR -> ERROR**
   - never converted into security FAIL.

The evidence should identify at least one concrete witness operation for a widening result.

## 9. T1.2 working conclusion

**Current evidence favors outcome B: HP-AUTH-001 refinement, not a distinct new stable attack.**

Reason:

- the core HP-AUTH-001 invariant already covers downstream effective authority exceeding upstream delegated authority;
- the external case adds a stronger semantic representation/evidence model for determining that invariant under lossy translation;
- no reviewed stable attack currently provides that semantic equivalence model;
- no evidence yet justifies duplicating the same governing security property under a new stable attack ID.

This is a **working overlap conclusion**, not the final T1.5 admission decision.

No new attack ID is created and the public stable attack count remains **22**.

## 10. Consequence for the next T-1 step

Because the overlap review does not currently support a genuinely distinct invariant, T1.3 does not need to invent a separate candidate attack property.

Instead, T1.4 should independently reproduce the semantic PASS/FAIL/control cases inside HandoffProbe and determine whether HP-AUTH-001 can be refined without weakening its existing stable contract.

The reproduction must be HandoffProbe-owned, deterministic, local/synthetic and independently implemented.

Only after that evidence exists should T1.5 make the final choice between:

- **A — existing HP-AUTH-001 already covers the case without modification;**
- **B — HP-AUTH-001 should be refined;**
- **C — evidence unexpectedly demonstrates a genuinely distinct invariant.**

Option C remains possible only if the independent reproduction reveals a property not already governed by HP-AUTH-001.
