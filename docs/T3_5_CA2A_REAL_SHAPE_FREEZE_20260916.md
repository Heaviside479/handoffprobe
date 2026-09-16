# T-3.5 real delegation-chain shape freeze for A2A #2079

Status: **COMPLETE — 2026-09-16**

## Purpose

Freeze the exact public delegation-chain shape and the smallest HandoffProbe-owned A2A→MCP projection that T-3.6 may execute.

This is research/conformance evidence only. It does not claim a vulnerability in cA2A, A2A, `argentum-core`, or `delegation-chain-ref-v1`; it does not claim compatibility, certification, endorsement, adoption, partnership, a new stable HandoffProbe attack, or a release requirement.

## External request

A2A `#2079` comment:

- URL: `https://github.com/a2aproject/A2A/issues/2079#issuecomment-5688209314`
- author: `giskard09`
- requested property: run the HandoffProbe A2A→MCP negative fixture against the real public delegation-chain shape/bytes rather than only describing the boundary in prose.

The frozen distinction is:

1. the upstream chain can prove properties of the **declared delegation chain**, including continuity and monotonic narrowing;
2. that does **not** by itself prove that the **effective downstream request produced by translation** remains inside the declared authority.

T-3.6 tests only the second property.

## Pinned upstream material

Repository:

- `giskard09/argentum-core`
- commit: `4951899c6bb016928e299e9bf9993086885a45ae`
- license at that revision: **Apache License 2.0**

Directory:

- `examples/conformance/delegation-chain-ref/`

Pinned files:

| File | Git blob | Upstream SHA-256 |
| --- | --- | --- |
| `vectors.json` | `a616b20c12169268c065c92571fd078bd852dbfe` | `98b040763ee0a1274abf9a6d2ddfa908f43ddbeac5949c8db6f6656025ef1af3` |
| `cross-org-vectors.json` | `39066b73db43c247be9a2b2e34578a111897a656` | `fab4982ccc557287c187244bb0106a2f82ac903a1da74e82e49a7808f7522f54` |
| `replay-vectors.json` | `5f19972f730abf3ec7731d0dbb61eb7c4b38f59a` | `2c2daecbdc99db317e68f350dd32f0d7f17dbce10fe9a33b99343f29510f1905` |
| `verify.py` | `54097a6e32878f6c23aa4a160c7fc1da3c821957` | `377670af12a56a2184309464fb2d4c75b3d66f2fdb1e3d6f854786f6dca006fd` |

Upstream `SHA256SUMS` Git blob:

- `10bbe478e6552658a311ac6053e3145cbfa3bbd0`

Any adapted bytes or code in T-3.6 must preserve provenance and comply with Apache-2.0. Prefer the smallest HandoffProbe-owned adapter/fixture over wholesale copying.

## Frozen real-shape control

The primary real-shape control for T-3.6 is:

- vector: `cross-org-001-independent-signers`
- expected upstream result: `PASS`
- version: `delegation-chain-ref-v1`
- root delegator: `test-cross-org-a`
- leaf agent: `test-cross-org-c`
- leaf action: `payment.route`
- leaf scope: `mycelium:payment`
- chain scope: `mycelium:payment`
- independent signers: `test-cross-org-a → test-cross-org-b → test-cross-org-c`

The source fixture is self-contained test material. T-3.6 must not contact production services, registrations, billing systems, external agents, or real payment infrastructure.

## What the upstream verifier proves

For the pinned material, `verify.py` evaluates the delegation-chain invariants represented by the fixture, including:

- chain continuity;
- root anchoring;
- leaf anchoring;
- monotonic scope narrowing;
- per-hop signature validity where present;
- replay behavior represented by the replay fixture.

Those properties concern the upstream declared chain and its fixture semantics.

They are not evidence that an independently translated MCP request is inside the verified leaf authority.

## Smallest T-3.6 projection

T-3.6 will use an owned deterministic adapter rather than treating the upstream format as MCP semantics.

Trusted authority source:

    leaf_agent = leaf_preimage.agent_id
    action     = leaf_preimage.action_type
    scope      = leaf_preimage.scope

For the frozen positive control:

    leaf_agent = test-cross-org-c
    action     = payment.route
    scope      = mycelium:payment

The authorization-relevant downstream projection is intentionally minimal:

    P(R_effective) = {
      tool,
      delegated_scope
    }

Mapping:

- upstream `leaf_preimage.action_type` → downstream `tool`;
- upstream `leaf_preimage.scope` → downstream authorization-relevant argument `delegated_scope`;
- MCP audience is a HandoffProbe-owned fixed fixture value, observed at the pre-dispatch boundary but not claimed to come from the upstream chain.

T-3.6 positive control:

    tool            = payment.route
    delegated_scope = mycelium:payment

T-3.6 widening negative:

    tool            = payment.route
    delegated_scope = mycelium:*

The upstream fixture defines `mycelium:*` as covering the broader namespace, so translating a verified `mycelium:payment` authority into `mycelium:*` is intentionally broader for this owned test mapping.

The upstream bytes remain valid and unchanged in both lanes. Only the HandoffProbe-owned downstream translation differs.

## T-3.6 required observation boundary

Immediately before any protected fake effect, T-3.6 must observe:

- downstream MCP audience;
- downstream tool;
- authorization-relevant arguments, including `delegated_scope`;
- the verified upstream authority used as the comparison basis.

The accepted request must be the request dispatched.

The valid/in-scope control may produce exactly one fake protected effect.

The widening negative must be evaluated before protected dispatch/effect and must record zero protected effects if the gate blocks it.

Any scanner/research result remains `PASS / FAIL / INCONCLUSIVE / ERROR` according to HandoffProbe result semantics. A fail-closed runtime denial is not automatically a vulnerability `FAIL`.

## Boundary and non-claims

T-3.6 does not test or claim:

- cA2A hardware attestation;
- sealed payload confidentiality;
- cA2A wire compatibility;
- generic A2A conformance;
- generic MCP authorization semantics;
- production security of `argentum-core`;
- a vulnerability in cA2A or A2A.

The property under test is narrower:

> Given upstream bytes that verify cleanly under the pinned delegation-chain fixture, does the owned A2A→MCP translation preserve the declared effective authority at the final pre-dispatch boundary?

## T-3.5 decision

T-3.5 is complete with this exact pin and projection contract.

T-3.6 may now implement only the minimal deterministic local fixture required to execute the positive control and widening negative described above.

The HandoffProbe stable corpus remains exactly **22 attacks**, package version remains `0.3.0`, and no release is authorized by T-3.5.
