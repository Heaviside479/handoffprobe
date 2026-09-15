# T-2.4 deterministic research cases

Status: **COMPLETE — 2026-09-15**

## Purpose

T-2.4 implements only the two candidates retained by the T-2.3 overlap matrix:

- `T2-CANONICALIZATION-VERSION`
- `T2-AMBIGUOUS-DUPLICATE-FIELD`

These are research labels only. They are not stable `HP-*` attack IDs and are not admitted into the public 22-attack corpus.

## Scope boundary

The research implementation is intentionally isolated under:

- `src/research/t2-handoff-contract/canonicalization-version.ts`
- `src/research/t2-handoff-contract/ambiguous-duplicate-field.ts`

Tests are isolated under:

- `tests/t2-canonicalization-version-research.test.ts`
- `tests/t2-ambiguous-duplicate-field-research.test.ts`

The research modules are not exported from the package root, are not referenced by the CLI or GitHub Action, and are not emitted into `dist/research` by the public build.

T-2.4 changes no stable attack ID, CLI/API/report/config contract, protocol baseline, public attack count, package version, release artifact or immutable release tag.

## Case A — canonicalization / version interpretation

Research label: `T2-CANONICALIZATION-VERSION`

Invariant under study:

> Representation or interpretation-version changes across a handoff are acceptable only when trusted upstream and downstream interpretation preserve the same effective security meaning.

Deterministic outcomes:

- **PASS** — representation changes while trusted effective security meaning remains equivalent.
- **FAIL** — trusted upstream and downstream interpretation resolve to different effective security meanings; the result contains a concrete divergence witness.
- **INCONCLUSIVE** — trusted representation, interpretation-version or effective-meaning evidence is incomplete.

The evaluator does not classify representation difference alone as a failure. This preserves the T-1 semantic principle that representation changes are not security failures without a concrete meaning change.

Focused coverage: **5 tests**.

## Case B — ambiguous / duplicate-field interpretation

Research label: `T2-AMBIGUOUS-DUPLICATE-FIELD`

Invariant under study:

> Conflicting representations of the same security-relevant field must either be rejected before protected execution or resolve through trusted deterministic precedence to the same effective security value across the handoff.

Deterministic outcomes:

- **PASS** — trusted deterministic precedence selects the same effective value across the handoff.
- **PASS** — conflicting values are rejected by trusted enforcement before protected execution.
- **FAIL** — upstream and downstream precedence select different security values and the downstream value reaches a protected decision; the result contains a concrete witness.
- **INCONCLUSIVE** — ambiguity exists but trusted precedence/effective-value evidence is incomplete, or disagreement is observable without a protected downstream decision.

Focused coverage: **7 tests**.

## Evidence model

Both evaluators are pure, deterministic and local. Their inputs contain only synthetic trusted interpretation observations; their outputs contain structured outcome, reason and, for a proven FAIL, a concrete witness.

No network target, production system, paid service, model call, customer data or secret is required.

The cases intentionally do not modify Phase 9 runtime plumbing merely to prove research admission. They reuse HandoffProbe's established principle of structured trusted observations and produce HandoffProbe-owned structured research evidence. Runtime integration remains a separate future admission decision if either case is promoted into the stable product.

## Validation record

Validation on 2026-09-15:

- focused canonicalization/version suite: **5 / 5 passed**;
- focused ambiguous/duplicate-field suite: **7 / 7 passed**;
- combined T-2.4 focused suite: **12 / 12 passed**;
- full repository check: **76 test files / 397 tests passed**;
- TypeScript typecheck: passed;
- lint: passed;
- build: passed;
- public-surface guard: passed;
- stable-ID guard: passed;
- diff hygiene: passed.

Release guard:

- package version remains `0.3.0`;
- immutable `v0.3.0` resolves to `ef54b950b3ee333c406fa81087685d7f952a028d`;
- new stable attacks admitted: **0**;
- stable attack count remains **22**.

## T-2.4 conclusion

Both T-2.3 research candidates are now reproducible enough for the T-2.5 internal review gate.

This completion is **not** an attack-admission decision. It does not establish that either candidate will become a stable HandoffProbe attack, does not authorize a version bump, and does not constitute external validation.

Bayu has not been contacted with the review packet yet. External handoff remains gated by T-2.5 and explicit project-owner approval of the exact T-2.6 public message.
