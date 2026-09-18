# T-4.3 provider-side original-attempt reconciliation execution

Status: **LOCAL EXECUTION VERIFIED — immutable fixture commit pending.**

Date: 2026-09-18

## Purpose

Execute only the distinct research gap admitted by T-4.2: provider-side reconciliation of the original attempt after response loss.

This is research evidence only. It does not create a stable attack, change the public corpus, authorize a release, or claim production VATE, A2A or MCP conformance.

## Baseline

- baseline main commit: `408ccd8d6e1e5c26854c54bdf11d3d5c533096ca`;
- T-4.2 completion: PR `#110`;
- execution file: `tests/t4-provider-reconciliation-execution.test.ts`;
- existing production source under `src/` remains unchanged;
- stable public corpus remains 23 attacks.

## Fixture boundary

The fixture is local, deterministic and synthetic.

It reuses HandoffProbe owned runtime components:

- `callReadInvoiceThroughMcp` for the local MCP fake-tool path;
- `CrossingEffectRecorder` for independent protected-effect counting;
- `EvidenceRecorder` for MCP tool-call and fake-tool execution evidence.

No VATE implementation code is copied. No external provider, credential, network service or destructive effect is used.

## Reconciliation model

The clean path is:

1. execute one protected synthetic action under one logical action ID and one attempt ID;
2. observe exactly one MCP tool call, one fake-tool execution and one protected effect;
3. simulate loss of the caller-facing response after the effect;
4. preserve caller outcome as `unknown`;
5. block blind fresh execution while the original outcome remains unknown;
6. perform a read-only provider lookup for the original attempt;
7. validate returned evidence against the original logical action ID and attempt ID;
8. require evidence for exactly one protected effect;
9. resolve the caller state to `confirmed_success` only after the evidence validates;
10. verify that reconciliation itself produces zero additional protected effects.

## Research outcomes

### Clean control

- original effect count: exactly 1;
- caller state after response loss: `unknown`;
- provider lookup count: exactly 1;
- effect delta during lookup: 0;
- final research outcome: `PASS`;
- final caller state: `confirmed_success`.

### Evidence-backed negative controls

- mismatched logical action identity: `INCONCLUSIVE`;
- mismatched attempt identity: `INCONCLUSIVE`;
- missing provider execution evidence: `INCONCLUSIVE`;
- provider lookup failure: `ERROR`.

None of those conditions is converted into vulnerability `FAIL`.

## Distinction from HP-REPLAY-003

`HP-REPLAY-003` already proves that a retry for the same completed logical action must not create a duplicate protected side effect after acknowledgement loss.

T-4.3 does not duplicate that invariant. It adds the previously missing evidence state: the caller can remain uncertain about the original attempt and later resolve that same attempt through a read-only provider lookup without executing the protected action again.

## Determinism

The clean scenario is executed twice and the resulting caller state, retry decision, reconciliation result, effect count, lookup count and event sequence must match.

## Local verification

Focused execution before this record was created:

- test file: `tests/t4-provider-reconciliation-execution.test.ts`;
- 8 tests passed;
- TypeScript typecheck passed;
- diff hygiene passed.

The normal full repository gate is run after this record is created so the complete T-4.3 worktree is validated together.

## Scope and nonclaims

- no stable attack ID is introduced;
- no `src/` implementation is changed;
- no package metadata is changed;
- no production VATE conformance is claimed;
- no WitnessObservation signature or independent-witness behavior is reproduced here;
- no claim is made that WitnessObservation, VATE, A2A or MCP contains a defect;
- no normative protocol requirement is inferred from this research fixture;
- witness-disagreement preservation remains outside this execution because T-4.2 classified it as `NEEDS EVIDENCE`;
- action-binding widening is not reimplemented because T-4.2 classified that property as already covered.

## T-4.4 boundary

This document does not make the T-4.4 admission decision.

After the immutable T-4.3 fixture commit is known, T-4.4 must explicitly classify the result as `NO ADD`, `REFINEMENT`, or `DISTINCT RESEARCH CANDIDATE` and record the exact fixture commit before any T-4.5 public result is posted.
