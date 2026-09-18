# MCP #3354 — Verifiable MCP freeze and overlap analysis

Status: **COMPLETE — frozen input classified as REFINEMENT; no stable attack admitted; execution not yet performed.**

Date: 2026-09-18

## Purpose

Freeze the exact public Verifiable MCP input relevant to HandoffProbe and classify its overlap with existing HandoffProbe evidence before any implementation.

This document does not claim a defect in MCP or Verifiable MCP and does not authorize a release.

## External discussion

Originating HandoffProbe boundary comment:

https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5682996881

AkiraTamai response:

https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5715753995

Akira agreed that execution integrity and upstream authorization are separate properties and that the distinction belongs in the threat model.

He described the proposed negative fixture as useful:

- the downstream call may be schema-valid but semantically wider than the upstream authority;
- the execution proof may remain fully valid for those widened inputs;
- proof verification therefore accepts by design;
- the composed authority layer must still reject;
- Verifiable MCP itself does not obtain or judge the upstream approval.

## Frozen upstream implementation basis

Repository:

`ripple-node-lab/mcp-verifiable-tools-demo`

Frozen commit:

`66a959f79802d3751ba7edc0aec4c1c0e0ee2b36`

Commit date:

2026-09-12

Relevant specification:

`docs/spec/verifiable-tools.md`

Git blob:

`1fd2d0c377388e4d8560fe5b38cf2e2a1d895541`

Security document Git blob:

`f3b6cef3df175e04a2d343450e172cf3aef3b028`

The frozen commit predates AkiraTamai's 2026-09-17 response.

No later public MCP #3354 comment currently demonstrates that the proposed approved-argument-authority negative fixture has been implemented upstream.

Therefore HandoffProbe must not describe that upstream fixture as implemented, reproduced or externally validated.

## Frozen proof-layer claim

The relevant Verifiable MCP property is deliberately narrower than authorization.

A valid execution proof establishes the relationship between:

- pinned program / `circuitHash`;
- committed input / `inputCommitment`;
- returned output / result binding;
- request freshness / nonce where applicable.

It does not establish that the committed downstream input was authorized by the upstream caller.

Execution integrity and authorization continuity are separate properties.

## HandoffProbe evidence baseline

### Stable HP-AUTH-001

The governing semantic-authority relation already exists:

`effective_authority(downstream) ⊆ delegated_authority(upstream)`

Authorization-relevant widening at the handoff boundary is therefore already a stable HandoffProbe property.

### Phase 9 crossing corpus

Phase 9 already measures the actual final pre-dispatch MCP request and independently records the protected local effect.

Relevant existing negative controls include:

- `tool_swap` → `action_digest_mismatch`;
- `arguments_swap` → `action_digest_mismatch`;
- native widened/mutated lane can reach a local effect;
- bound lane rejects before protected effect.

### T-3.6 real-shape translation evidence

T-3.6 already demonstrates the same semantic-authority containment shape with a real pinned upstream delegation fixture:

- upstream scope remains `mycelium:payment`;
- downstream translation widens to `mycelium:*`;
- the widened effective request is rejected before dispatch;
- protected effect delta remains zero.

## Overlap decision

### Property A — proof validates execution over the effective downstream inputs

Classification: **OUTSIDE THE AUTHORIZATION INVARIANT / EXPECTED PROOF-LAYER BEHAVIOR**.

A valid proof for a widened request is not itself a vulnerability in Verifiable MCP.

The proof layer is expected to answer whether the pinned computation ran on the committed inputs.

### Property B — successful proof verification must not imply upstream authorization

Classification: **REFINEMENT**.

The governing security invariant already belongs to stable `HP-AUTH-001`.

The Verifiable MCP input adds a useful additional evidence layer:

`proof valid for effective request` does not imply `effective request authorized`.

That distinction should be preserved explicitly if HandoffProbe executes the comparison.

### Property C — schema-valid semantic widening after authorization

Classification: **ALREADY COVERED**.

Stable semantic-authority evidence, Phase 9 and T-3.6 already represent this boundary.

## Admission decision

Overall MCP #3354 classification:

**REFINEMENT**

No new stable attack is admitted.

The public corpus remains **23 attacks**.

No package version change is authorized.

No release is triggered.

## Smallest justified execution candidate

A later execution is justified only as a narrow research refinement if it can prove the layer separation without duplicating the existing authorization corpus.

The minimum deterministic scenario is:

1. freeze one upstream-authorized argument set;
2. derive its approved commitment;
3. translate to a schema-valid but semantically widened downstream argument set;
4. produce or verify execution evidence that is valid for the widened effective request;
5. record that the proof/execution-integrity layer accepts that effective request;
6. independently compare the widened request with the upstream approved authority;
7. reject before HandoffProbe's protected synthetic effect;
8. prove effect delta is zero;
9. include an in-scope positive control where proof and authority both accept.

The research result must keep separate:

- proof verification result;
- authority verification result;
- HandoffProbe scanner/research outcome;
- protected effect observation.

## Guardrails

Any later execution must:

- remain local, deterministic and synthetic;
- avoid claiming Verifiable MCP or MCP vulnerability;
- avoid treating proof validity as authorization;
- avoid copying expected outcomes from the external proposal;
- preserve PASS / FAIL / INCONCLUSIVE / ERROR semantics;
- reuse existing HandoffProbe authority machinery where possible;
- not create a stable attack without a separate normal admission decision.

## External result-return obligation

If HandoffProbe executes this refinement and obtains a reproducible result, the result must be returned to AkiraTamai in MCP #3354 with:

- exact HandoffProbe commit and evidence;
- frozen upstream revision;
- proof-layer result;
- authority-layer result;
- effect observation;
- tested and untested scope;
- explicit invitation to correct the interpretation.

A substantive response must then be recorded before this research item is finally closed.
