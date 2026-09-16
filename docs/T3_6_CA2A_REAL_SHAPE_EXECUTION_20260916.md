# T-3.6 cA2A real-shape execution evidence

Status: **COMPLETE — 2026-09-16**

## Purpose

Execute the T-3.5 frozen cA2A real-shape control through HandoffProbe's existing local A2A→MCP pre-dispatch seam and test whether a HandoffProbe-owned downstream translation that exceeds the verified upstream leaf scope is blocked before a protected fake effect.

This is research/conformance evidence only. It does not claim a vulnerability in cA2A, A2A, `argentum-core`, or the pinned delegation-chain fixture. It does not claim compatibility, certification, endorsement, adoption, partnership, a new stable HandoffProbe attack, or a release requirement.

## Pinned upstream basis

Repository:

- `giskard09/argentum-core`
- commit: `4951899c6bb016928e299e9bf9993086885a45ae`
- source: `examples/conformance/delegation-chain-ref/cross-org-vectors.json`
- source Git blob: `39066b73db43c247be9a2b2e34578a111897a656`
- source SHA-256: `fab4982ccc557287c187244bb0106a2f82ac903a1da74e82e49a7808f7522f54`
- license: Apache-2.0
- vector: `cross-org-001-independent-signers`
- upstream expected result: `PASS`

HandoffProbe-owned adapted fixture:

- `tests/fixtures/t3/ca2a-cross-org-001.json`
- fixture SHA-256: `668e3950c54fef486a0bf433c4542b968ee645e33bed2d2b952ce94f4d8bba81`

The adapted fixture preserves the exact upstream control values needed by this research test and records source provenance. It is local test material only.

## Frozen authority used by the execution

The upstream positive control exposes:

- leaf agent: `test-cross-org-c`
- leaf action: `payment.route`
- leaf scope: `mycelium:payment`
- chain scope: `mycelium:payment`
- version: `delegation-chain-ref-v1`

T-3.6 does not reinterpret the upstream format as MCP authorization semantics. The HandoffProbe-owned projection remains:

    upstream leaf_preimage.action_type -> downstream tool
    upstream leaf_preimage.scope       -> downstream delegated_scope

The MCP audience remains the owned fixed fixture value:

    http://handoffprobe.local/mcp

## Runtime boundary

T-3.6 reuses HandoffProbe's existing local MCP harness.

Immediately before the pre-dispatch gate, HandoffProbe records the effective:

- MCP audience;
- tool;
- authorization-relevant arguments.

The same runtime tool and arguments are then used by the dispatch path if the gate accepts. The protected effect is a deterministic local fake-tool effect recorder; no production service, external agent, payment system, registration, billing system, or third-party infrastructure is contacted.

## Positive control

Upstream authority:

    action = payment.route
    scope  = mycelium:payment

Observed downstream request:

    audience        = http://handoffprobe.local/mcp
    tool            = payment.route
    delegated_scope = mycelium:payment

Observed result:

- pre-dispatch gate: accepted;
- research outcome: `PASS`;
- `mcp.tool.call`: exactly `1`;
- `fake_tool.execute`: exactly `1`;
- protected fake-effect delta: exactly `1`.

This proves that the owned control path can execute the in-scope projection and that the effect recorder observes the protected local effect.

## Widening negative

The pinned upstream fixture and declared leaf authority remain unchanged:

    action = payment.route
    scope  = mycelium:payment

Only the HandoffProbe-owned downstream translation changes:

    audience        = http://handoffprobe.local/mcp
    tool            = payment.route
    delegated_scope = mycelium:*

The effective downstream scope is therefore broader than the frozen upstream leaf scope under the T-3.5 owned comparison rule.

Observed result:

- the effective request is observable at the final pre-dispatch boundary;
- the widening is rejected before protected dispatch;
- research outcome: `PASS`;
- authority scope recorded as `mycelium:payment`;
- effective scope recorded as `mycelium:*`;
- `mcp.tool.call`: exactly `0`;
- `fake_tool.execute`: exactly `0`;
- protected fake-effect delta: exactly `0`.

The test therefore demonstrates the requested application/translation-layer containment property for this owned mapping: a clean upstream delegation-chain control does not by itself authorize an independently widened downstream effective request.

## Test evidence

Execution test:

- `tests/t3-ca2a-real-shape-execution.test.ts`

Focused verification on 2026-09-16:

- 2 / 2 focused test files passed;
- 7 / 7 focused tests passed;
- diff hygiene passed.

The execution contains three deterministic checks:

1. provenance and the frozen real positive-control shape remain exact;
2. the in-scope downstream projection executes exactly one local fake effect;
3. the widened downstream projection is blocked before dispatch/effect while the pinned upstream fixture remains unchanged.

## Result semantics

`PASS` here means the HandoffProbe research fixture observed the intended containment behavior at the owned pre-dispatch boundary.

It does not mean:

- cA2A is certified or compatible with HandoffProbe;
- A2A defines this downstream authorization model;
- `argentum-core` is secure in production;
- a cA2A or A2A vulnerability was found;
- every A2A→MCP translator behaves this way.

A fail-closed runtime denial, observation gap, or comparison failure must continue to be classified under the appropriate HandoffProbe research semantics and must not be converted automatically into a vulnerability `FAIL`.

## T-3.6 decision

T-3.6 is complete as reproducible research/conformance evidence.

The result remains an existing semantic-authority containment/refinement signal rather than a new stable attack admission. The stable public corpus remains exactly **22 attacks**, package version remains `0.3.0`, and T-3.6 does not authorize a release.

T-3.7 may now reply publicly to giskard09 with the exact pinned input, HandoffProbe evidence, observed positive/negative behavior, and the limitations above.
