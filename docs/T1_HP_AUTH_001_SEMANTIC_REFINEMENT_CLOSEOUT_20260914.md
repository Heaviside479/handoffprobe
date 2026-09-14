# T1 HP-AUTH-001 Semantic Authority Refinement Closeout

Status: **COMPLETE 2026-09-14**

## Decision

T-1 outcome remains:

**B — refine existing `HP-AUTH-001`; do not create a new stable attack ID.**

The stable public attack corpus remains **22 attacks**.

The governing invariant remains:

```text
effective_authority(downstream) ⊆ delegated_authority(upstream)
```

This refinement strengthens how HandoffProbe represents and explains that existing invariant. It does not admit a second semantic-authority attack.

## Productive implementation

The productive P0 fixture now contains a deterministic semantic-authority evaluator in:

`src/p0-fixture/semantic-authority.ts`

The evaluator:

- operates over a finite HandoffProbe-owned protected-operation universe;
- normalizes operation IDs deterministically;
- records upstream allowed operations;
- records translated allowed operations;
- applies an optional trusted downstream restriction to derive effective downstream operations;
- returns `FAIL` only when effective downstream authority contains a concrete operation that was not permitted upstream;
- returns the concrete widening operation IDs as witnesses;
- treats an invalid model as evaluator `ERROR`, never as a security `FAIL`.

`HP-AUTH-001` keeps its existing direct `invoice.read` -> `invoice.update` mutation as a stable regression case.

For the bundled secure fixture, enforced authorization is modeled as trusted downstream enforcement over the upstream operation set. The attempted translated update therefore has no effective protected operation and remains `PASS`.

For the intentionally vulnerable bypass fixture, no trusted downstream restriction is applied. The protected update becomes effective and `HP-AUTH-001` reports the concrete witness:

`invoice:INV-1001:update`

The stable attack evidence now explains:

- upstream permitted operation set;
- translated permitted operation set;
- effective downstream operation set;
- trusted downstream enforcement state;
- equal / narrower / broader relation;
- concrete semantic-widening witness operations.

If the productive semantic evaluator returns an internal model `ERROR`, `HP-AUTH-001` throws evaluation failure so the existing `CoreRunner` error path produces a finding with status `error`. It is not converted into a vulnerability finding.

## Compatibility and scope

This refinement intentionally preserves:

- stable ID `HP-AUTH-001`;
- default severity `high`;
- property class `composition_responsibility`;
- A2A `1.0` -> MCP `2026-07-28` applicability;
- the stable public attack count of **22**;
- the existing CLI/report/exit-code contracts;
- the package-root export contract;
- the GitHub Action contract.

The semantic evaluator is wired through the internal P0 fixture export used by the stable attack implementation. `src/index.ts` is unchanged.

No version bump is part of T1.6 implementation work. `package.json` remains at `0.2.0`.

## Validation

T1.6 validation includes:

- focused semantic-authority evaluator tests;
- focused productive P0 authorization attack tests;
- secure `HP-AUTH-001` PASS;
- intentionally vulnerable `HP-AUTH-001` reproducible FAIL;
- concrete semantic widening witness assertion;
- deterministic normalization and invalid-model controls;
- TypeScript and ESLint validation;
- exact stable-ID guard confirming 22 IDs;
- full repository `npm run check`;
- `npm run package:check`;
- package-root / version / Action guards;
- `git diff --check`.

The final closeout branch must remain green on all of those gates before merge.

## Release follow-through

The merged roadmap defines **Release Track R3**.

`v0.3.0` is the expected next public release candidate only if this merged HP-AUTH-001 refinement is confirmed as a backward-compatible shipped security capability during release scope freeze.

R3 must coordinate the version bump and publication across npm, immutable Git tag, GitHub Release, reusable Action / Marketplace presentation, release documentation and external exact-version verification.

`v0.3.1` is not the first release for this capability; it remains a later patch version after `v0.3.0`.

## T-1 completion

T1.1 evidence freeze, T1.2 overlap review, T1.4 independent reproduction, T1.5 admission decision and T1.6 product follow-through are complete.

T1.3 was **not triggered** because T1.2 established that the case is a refinement of the existing HP-AUTH-001 invariant rather than a genuinely distinct invariant requiring separate formalization.

T-1 is therefore complete. T-2 may build on this result without duplicating semantic-authority work.
