# T1.4 Semantic Authority Independent Reproduction

Status: **COMPLETE 2026-09-14**

## Purpose

Independently reproduce the semantic-authority-widening research case inside HandoffProbe without copying the external implementation and without changing the public stable attack corpus.

The reproduction tests whether the existing HP-AUTH-001 invariant can distinguish semantic authority preservation from actual downstream widening when handoff translation is lossy.

## Implementation boundary

Research-only files:

- `tests/research/semantic-authority-model.ts`
- `tests/t1-semantic-authority-reproduction.test.ts`

No `src/`, package metadata, CLI, GitHub Action, public export or stable attack ID was changed by this reproduction.

The public stable attack count therefore remains **22**.

## HandoffProbe-owned model

The reproduction evaluates a finite HandoffProbe-owned protected-operation universe.

It compares:

- operations permitted by upstream delegated authority;
- operations represented after translation;
- optional trusted downstream enforcement;
- effective downstream permitted operations.

The failure predicate is semantic effect:

`effective_authority(downstream) ⊄ delegated_authority(upstream)`

A concrete newly permitted protected operation is retained as the widening witness.

Representation loss alone is not a security failure.

## Required controls reproduced

The following controls are deterministic:

1. direct preservation -> PASS;
2. representation loss plus equivalent trusted downstream enforcement -> PASS;
3. representation loss without equivalent enforcement and with newly permitted authority -> FAIL candidate;
4. stricter downstream authority -> PASS;
5. identity/binding-invalid case -> separately classified binding failure;
6. explicit structured authority escalation -> separately classified escalation failure;
7. invalid research-model/runtime input -> ERROR, not security FAIL.

The semantic widening case reports a concrete protected-operation witness rather than relying only on field-name inequality.

## Determinism

The targeted T1.4 test suite contains 9 tests.

The reproduction was executed repeatedly across five separate Vitest process runs and remained deterministic.

Result:

- repeated reproduction runs: PASS;
- targeted typecheck: PASS;
- targeted lint: PASS;
- diff check: PASS;
- public/runtime-surface guard: PASS.

## Full repository validation

After the repeated reproduction runs, the complete repository check passed.

Measured result:

- 71 test files passed;
- 371 tests passed;
- formatting passed;
- lint passed;
- typecheck passed;
- secret scan passed;
- build passed.

Expected Phase 9 negative-path rejection diagnostics continued to appear on stderr during the full suite. They are tested rejection behavior and did not represent failed tests.

## T1.4 conclusion

The independent reproduction demonstrates that semantic authority widening can be evaluated deterministically as an effective-authority subset property while preserving the following distinctions:

- representation loss alone is non-failing;
- equivalent trusted downstream enforcement may preserve authority;
- stricter downstream authority is valid;
- identity/binding failures remain separate;
- explicit structured escalation remains separate;
- runtime/model ERROR remains separate from security FAIL.

This evidence is sufficient to proceed to the T1.5 admission decision.

The reproduction is research evidence. It is not yet a public HP-AUTH-001 implementation change and does not change HandoffProbe coverage claims.
