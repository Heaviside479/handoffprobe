# Phase 9.1D / 9.1E — Frozen Crossing-Corpus Execution and Submission

Status: completed 2026-09-01

## Scope

This record covers HandoffProbe Phase 9.1D and Phase 9.1E for the external A2A
1.0 → MCP 2026-07-28 crossing corpus requested through Issue `#20`.

This is conformance evidence. It is not a vulnerability disclosure and does
not claim production-world exploitation.

## Frozen corpus identity

The execution is bound to:

- upstream repository: `Silentpartnercoding/minority-prophet-border`;
- upstream commit: `09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a`;
- corpus SHA-256: `f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb`;
- A2A Protocol 1.0;
- MCP Protocol 2026-07-28;
- exactly 28 frozen data-driven cases.

The local pinned manifest and all 14 files covered by that manifest were
verified byte-for-byte before execution.

## HandoffProbe-owned execution

HandoffProbe executed all 28 cases through its own local protocol-lab path.

Each case produced:

- a native lane without the bound crossing verifier;
- a bound lane with the verifier at the real pre-dispatch boundary.

The complete execution produced:

- 28 result rows in exact frozen order;
- 58 total attempt-level evidence records;
- externally observed native attempts for every case;
- externally observed bound attempts for every case;
- HandoffProbe runtime observations instead of copied reference-fixture rows.

The `externally_observed` label is used according to the frozen intake
contract: the evidence is produced by the external HandoffProbe implementation
through its own observation and effect path.

It does not mean that a production system or third-party service was changed.

## Runtime observation boundary

The evidence path records:

- transport-authenticated A2A caller identity;
- actual A2A message ID;
- server-resolved task ID;
- server-resolved context ID;
- actual MCP transport audience;
- exact MCP tool immediately before dispatch;
- exact MCP arguments immediately before dispatch;
- pre-mutation authority observation;
- actual post-mutation runtime observation;
- authority and stage verification provenance;
- status currentness and freshness provenance;
- replay-store provenance shared across required attempts.

A missing runtime value remains missing. Reference fixture values are never
used to fill observation gaps.

## Effect observation

`CrossingEffectRecorder` remains outside the verifier and is incremented only
from the productive synthetic MCP receiver path.

The submitted evidence records:

- `outside_verifier: true`;
- `production_world_effect: false`;
- effect semantics `local_synthetic_mcp_receiver_execution`.

The effect counter therefore measures actual local synthetic receiver
execution. It does not claim a production-world or third-party effect.

## Observed discrimination

The frozen intake derived 26 discriminating cases.

For those negative cases the measured pattern is:

- native lane: productive execution with effect delta `1`;
- bound lane: expected rejection with effect delta `0`.

The two valid controls succeed on both lanes with effect delta `1`.

Every frozen bound expectation matches.

Examples:

- `caller_swap` → `caller_mismatch`;
- `message_swap` → `message_mismatch`;
- `task_swap` → `task_mismatch`;
- `context_swap` → `context_mismatch`;
- `audience_swap` → `audience_mismatch`;
- `tool_swap` → `action_digest_mismatch`;
- `arguments_swap` → `action_digest_mismatch`;
- `replay` attempt 1 → `succeed / accepted`;
- `replay` attempt 2 → `reject / nonce_replay`.

## Submission artifacts

The measured implementation and generator are bound to:

`a91110245c3932fd98b3156b2595836927566ede`

The exact generated evidence is archived at:

`artifacts/phase9/a2a-mcp-crossing-v2/handoffprobe-a91110245c3932fd98b3156b2595836927566ede/`

`submission.json` SHA-256-binds exactly 12 required artifacts:

1. corpus manifest;
2. result;
3. raw log;
4. adapter config;
5. implementation;
6. effect recorder;
7. replay store;
8. caller source;
9. audience source;
10. status source policy;
11. authority authentication;
12. grade evidence.

The raw log contains exactly 58 runtime attempt records.

## Adapter transformation disclosure

The corpus bytes remain pinned and hash-verified.

The runtime adapter declares `identified_transformation`, because frozen
abstract identities and actions must be rebound onto the actual HandoffProbe
runtime before each frozen mutation is applied.

The adapter does not pretend that this runtime mapping is an `exact_bytes`
execution.

## Submitted independence grade

The submission declares:

`implementation_independent`

The measured runtime, verifier, observation path and effect recorder are
HandoffProbe-owned and do not use the frozen Python reference implementation as
the measured implementation.

The submission does not claim:

`operator_independent`

The implementation and adapter execution have the same HandoffProbe operator.

## Frozen upstream intake result

The exact frozen
`fixtures/phase9/a2a-mcp-crossing-v2/runner/verify_submission.py`
was executed against the archived `submission.json` without
`--confirmed-grade`.

The verifier returned exit code `0`.

Derived summary:

- `submitted_grade`: `implementation_independent`;
- `confirmed_grade`: `null`;
- `valid_both`: `true`;
- `observed_discrimination`: `true`;
- 26 discriminating cases;
- `complete_bound_external`: `true`;
- `complete_external_execution`: `true`;
- `bound_expectations_match`: `true`;
- `unmeasured_bound_cases`: `[]`;
- `expectation_mismatches`: `[]`;
- `green_eligible`: `false`.

`green_eligible: false` is expected.

The frozen intake contract reserves an intake-confirmed grade for an external
reviewer. HandoffProbe therefore does not self-award `--confirmed-grade` and
does not describe this evidence as upstream-certified Green.

## Reproducibility checkpoints

- full 28-case execution:
  `931a0868e4effcb0768169880656b870173f2ffb`;
- attempt-level execution evidence:
  `0ccf24e6387812b324148d03f4bef15a66ad5d1a`;
- submission generator and measured implementation:
  `a91110245c3932fd98b3156b2595836927566ede`;
- archived intake-valid evidence:
  `f5e73c7b194ba0d53a94c85ae79d6338939f63e6`.

## Completion decision

Phase 9.1D is complete because the full frozen 28-case corpus executes through
the HandoffProbe-owned runtime and observation path with effect recording
outside the verifier.

Phase 9.1E is complete because a reviewable hash-bound submission was generated,
archived and accepted by the frozen intake verifier without self-confirming the
reviewer grade.

Phase 9.1F remains open.

Publication and any response to Issue `#20` are separate follow-up actions.
