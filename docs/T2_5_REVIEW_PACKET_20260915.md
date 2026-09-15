# T-2 protocol-neutral Handoff Contract — review packet

Status: **READY FOR OWNER-APPROVED EXTERNAL HANDOFF — NOT YET SENT**

Date: 2026-09-15

## Purpose

This is the compact entry point for independent technical review of HandoffProbe's protocol-neutral Handoff Contract research.

The review asks whether the proposed handoff security boundaries are stated narrowly enough, whether evidence requirements are strong enough, and whether implementation assumptions are explicit.

It is not a request for promotion, endorsement, adoption, certification or a compatibility claim.

## What is being reviewed

The contract separates a security-relevant handoff into three layers:

1. **Contract semantics** — what protected property is supposed to remain true?
2. **Attestation / binding** — what trusted evidence binds the relevant identity, authority, payload, provenance, version or context?
3. **Runtime enforcement** — what unsafe downstream interpretation or effect is actually prevented or allowed?

It uses four result classes: `PASS`, `FAIL`, `INCONCLUSIVE` and `ERROR`.

## Existing-coverage decision

Five protocol-neutral candidates were compared with all 22 stable HandoffProbe attacks, T-1 authority research and Phase 9 crossing evidence.

Already covered without a new T-2 fixture:

- authority / capability monotonicity;
- replay / logical-action uniqueness;
- provenance continuity / mutation visibility.

Retained as distinct deterministic research candidates:

- `T2-CANONICALIZATION-VERSION`;
- `T2-AMBIGUOUS-DUPLICATE-FIELD`.

These names are research labels only. They are not stable `HP-*` attack IDs.

## Research case A — canonicalization / version interpretation

Question:

> Can a security-relevant value acquire a different effective meaning because two handoff stages canonicalize or interpret it differently?

The deterministic evaluator distinguishes:

- `PASS` when representation changes but trusted effective security meaning remains equivalent;
- `FAIL` when trusted upstream and downstream interpretation produce different effective security meanings, with a concrete witness;
- `INCONCLUSIVE` when trusted interpretation evidence is incomplete.

Representation difference alone is not treated as a failure.

## Research case B — ambiguous / duplicate-field interpretation

Question:

> Can multiple valid-looking representations of the same security-relevant field cause different handoff stages to select different protected values?

The deterministic evaluator distinguishes:

- `PASS` when trusted deterministic precedence selects the same effective value;
- `PASS` when conflicting values are rejected before protected execution;
- `FAIL` when stage precedence selects different values and the divergent downstream value reaches a protected decision, with a concrete witness;
- `INCONCLUSIVE` when trusted precedence/effective-value evidence is incomplete or no protected downstream decision is observed.

## Evidence

Primary review artifacts:

- [`PROTOCOL_NEUTRAL_HANDOFF_CONTRACT_DRAFT_20260915.md`](./PROTOCOL_NEUTRAL_HANDOFF_CONTRACT_DRAFT_20260915.md)
- [`T2_3_HANDOFF_CONTRACT_OVERLAP_MATRIX_20260915.md`](./T2_3_HANDOFF_CONTRACT_OVERLAP_MATRIX_20260915.md)
- [`T2_4_DETERMINISTIC_RESEARCH_CASES_20260915.md`](./T2_4_DETERMINISTIC_RESEARCH_CASES_20260915.md)

Research implementation:

- [`../src/research/t2-handoff-contract/canonicalization-version.ts`](../src/research/t2-handoff-contract/canonicalization-version.ts)
- [`../src/research/t2-handoff-contract/ambiguous-duplicate-field.ts`](../src/research/t2-handoff-contract/ambiguous-duplicate-field.ts)

Focused tests:

- [`../tests/t2-canonicalization-version-research.test.ts`](../tests/t2-canonicalization-version-research.test.ts)
- [`../tests/t2-ambiguous-duplicate-field-research.test.ts`](../tests/t2-ambiguous-duplicate-field-research.test.ts)

Validation recorded for T-2.4:

- full repository check: **76 test files / 397 tests passed**;
- focused T-2.4 suites: **12 / 12 tests passed**;
- public-surface guard passed;
- stable corpus remains **22**;
- new stable attacks admitted: **0**;
- package version remains `0.3.0`.

## Suggested review questions

Please challenge the research on these points:

1. Are the protected properties narrow enough to avoid combining distinct security failures?
2. Are contract semantics, trusted binding and runtime enforcement separated clearly enough?
3. Do `FAIL` outcomes require enough concrete evidence?
4. Are any `INCONCLUSIVE` cases incorrectly treated as safe or unsafe?
5. Do either of the two retained research cases actually overlap an existing invariant more than the matrix acknowledges?
6. Does your architecture interpret canonicalization/version or duplicate-field boundaries differently?
7. Are there implementation-specific assumptions that should be explicit before any future stable-attack admission decision?

## Boundaries

This packet does **not** establish:

- an A2A or MCP normative requirement beyond cited primary evidence;
- a NAEOS vulnerability;
- NAEOS compatibility;
- a partnership or endorsement;
- external validation;
- a new stable HandoffProbe attack;
- a release or version-bump decision.

The stable public HandoffProbe corpus remains 22 attacks.

## External handoff status

This packet has passed the HandoffProbe T-2.5 internal gate but has **not yet been sent for external review**.

The exact T-2.6 public message must be approved by the project owner before the packet is shared in the existing Indie Hackers thread.
