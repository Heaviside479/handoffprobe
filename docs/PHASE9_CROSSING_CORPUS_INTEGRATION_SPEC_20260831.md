# Phase 9.1A — Crossing-Corpus integration contract

Status: local implementation contract

## Purpose

Phase 9 starts with the evidence-selected target from Issue `#20`: a narrow external A2A 1.0 → MCP 2026-07-28 crossing-corpus conformance integration.

This work does not create a broad framework adapter. It defines the boundary that later runtime work must satisfy before any corpus execution is treated as external evidence.

## Frozen external input

The integration is bound to:

- upstream repository: `Silentpartnercoding/minority-prophet-border`;
- corpus commit: `09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a`;
- corpus SHA-256: `f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb`;
- A2A Protocol 1.0;
- MCP Protocol 2026-07-28;
- 28 data-driven external case identities.

Later upstream changes require a new pin and review. They must not silently change this integration.

## Baseline HandoffProbe gaps at contract lock

When this contract was locked, the protocol lab was a useful local baseline but
was not yet a valid implementation-independent execution of the external
corpus.

The baseline gaps were:

- the A2A harness currently uses `UserBuilder.noAuthentication`;
- the request currently uses an empty `taskId`;
- the client currently constructs the request `contextId` itself;
- transport-authenticated caller provenance is not yet recorded;
- server-resolved message/task/context binding is not yet modeled for the external contract;
- MCP audience provenance is not yet recorded;
- externally observed before/after effects are not yet produced.

These were integration gaps, not vulnerability findings.

Phase 9.1D and Phase 9.1E later closed these runtime and evidence gaps. The
completed execution and intake record is documented in
`docs/PHASE9_CROSSING_CORPUS_EXECUTION_20260901.md`.

## Integration boundaries

The implementation must preserve HandoffProbe's existing A2A 1.0 → MCP 2026-07-28 engine and must not create an independent scanner.

The external corpus is an input and conformance contract. HandoffProbe owns its own observation path.

The external case IDs must remain externally attributable and must not rename them into existing HandoffProbe attack IDs.

A corpus outcome may match, refute, partially reproduce, or fail to reproduce the reference expectations. Non-green results remain evidence if their provenance is complete.

## 9.1B offline corpus loader contract

The first runtime package is an offline pinned-corpus loader.

It must:

1. consume repository-owned pinned fixture bytes or an explicitly supplied local corpus directory;
2. verify the corpus identity before parsing cases;
3. verify the pinned SHA-256 before execution;
4. reject missing, changed, malformed, or mismatched corpus material deterministically;
5. expose the original external case IDs without remapping them to attack IDs;
6. perform no implicit download during a test run;
7. must not require network access for normal deterministic tests;
8. require no paid API, model provider, cloud service, or production target.

Fetching or refreshing upstream material is a separate maintainer action and must never silently alter a pinned test.

## Provenance contract

A later executable mapping must capture evidence for the actual crossing boundary, including:

- transport-authenticated A2A caller source;
- A2A message ID;
- server-resolved task ID and context ID where applicable;
- authority and stage-link verification;
- exact MCP audience plus the source from which that audience was derived;
- exact tool and arguments immediately before dispatch;
- status freshness/currentness source;
- replay state shared across the attempts that require it.

A missing value cannot be treated as equality merely because the corresponding value is also absent on the other side.

## Effect observation contract

For implementation-independent evidence, the effect recorder is outside the verifier.

It must record the before/after effect count for each attempt independently from the decision logic being evaluated.

Reference-fixture rows cannot be copied into HandoffProbe output to fill observation gaps.

A result without externally observed native and bound attempts for every required case must remain partial or non-green.

## Security and authorization

All Phase 9 work remains local, synthetic, public, or explicitly authorized.

No real credentials, private user data, undisclosed third-party vulnerability details, paid model API, paid analytics, SaaS account, billing integration, or hidden telemetry may be introduced.

Issue `#20` is a conformance/research request, not a vulnerability report.

## Work packages

- 9.1A — lock this integration contract and protect it with documentation regression tests.
- 9.1B — implement the offline pinned-corpus loader and digest verification.
- 9.1C — map the external crossing fields and provenance into a HandoffProbe-owned observation model.
- 9.1D — add an effect recorder outside the verifier and execute the complete 28-case corpus.
- 9.1E — produce reviewable result/submission artifacts and validate them against the pinned external intake contract.
- 9.1F — publish the evidence outcome, update Issue `#20`, and review whether any broader framework adapter is justified.

Each work package must pass the normal repository quality gates before protected merge.
