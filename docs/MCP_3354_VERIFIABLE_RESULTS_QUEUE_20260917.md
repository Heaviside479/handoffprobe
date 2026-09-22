# MCP #3354 — Verifiable MCP / authority-boundary research queue

Status: **PUBLIC RESULT RETURN COMPLETE — REFINEMENT; DIRECT AUTHOR REVIEW RECEIVED 2026-09-22; PROPOSAL / CHANGELOG TRACEABILITY RECORDED.**
Date queued: 2026-09-17

## Purpose

Preserve the concrete research seam exposed by the public Verifiable MCP discussion without interrupting R4 closeout or conflating it with A2A T-4.

## Public thread

Issue:
`https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354`

HandoffProbe boundary comment:
`https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5682996881`

AkiraTamai response:
`https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5715753995`

## External technical signal

AkiraTamai agreed that execution integrity and authorization continuity are separate properties and stated that the distinction belongs in the threat model.

The response distinguishes four properties:

1. integrity of the computation;
2. truth/provenance of the inputs;
3. validity or policy suitability of the program;
4. authorization of the inputs in the upstream execution context.

The Verifiable MCP proposal claims the first property. Its `inputCommitment`, `circuitHash` and `nonce` bind a result to committed inputs and a pinned program, but a valid proof does not establish that the committed inputs were within the upstream callers authority.

## Freeze / overlap decision — 2026-09-18

Milestone status:

**FREEZE / OVERLAP COMPLETE 2026-09-18 — REFINEMENT**

Completion record:

`docs/MCP_3354_FREEZE_OVERLAP_20260918.md`

Frozen upstream basis:

- `ripple-node-lab/mcp-verifiable-tools-demo@66a959f79802d3751ba7edc0aec4c1c0e0ee2b36`;
- `docs/spec/verifiable-tools.md` blob `1fd2d0c377388e4d8560fe5b38cf2e2a1d895541`;
- AkiraTamai response `#5715753995`.

Decision:

**REFINEMENT**

The widened-request authorization invariant is already owned by stable `HP-AUTH-001` and existing Phase 9 / T-3 evidence.

The new value is the explicit layer-separation control: a proof may validly establish execution over the effective widened request while the independent authority layer must still reject that request before protected effect.

No new stable attack, package version or release is authorized by this decision.

## Candidate deterministic negative fixture

The useful seam is:

`valid upstream authorization → handoff/translation → schema-valid but semantically widened MCP call → valid execution proof`

Expected separation:

- the execution-proof layer may correctly accept because the pinned program really ran on the committed widened inputs;
- the composed authority layer must still reject when those inputs exceed the approved upstream authority;
- successful proof verification must not be converted into authorization.

Akira described a possible interface in which the authority layer supplies an approved argument commitment and the execution-side `inputCommitment` is compared with it.

Important limitation: Akira stated that the current demo has no authority layer and that he would like to consider adding this negative test. Do not record the case as implemented, reproduced or externally validated unless later evidence demonstrates that.

## Research guardrails

- keep execution integrity separate from input truth, program validity and authorization continuity;
- use only local/synthetic/authorized fixtures;
- do not imply a defect in MCP or the Verifiable MCP proposal merely because the layers enforce different properties;
- do not treat a valid cryptographic proof as proof of upstream authorization;
- classify any later result through the normal HandoffProbe research/admission process before creating a stable attack;
- no release is triggered merely by this queue item.

## Deterministic refinement execution — 2026-09-18

Execution record:

`docs/MCP_3354_PROOF_AUTHORITY_EXECUTION_20260918.md`

Execution test:

`tests/mcp-3354-proof-authority-execution.test.ts`

Observed composition:

- execution-integrity binding over the exact in-scope request: `ACCEPT`;
- semantic authority over the in-scope request: `ACCEPT`;
- positive protected-effect delta: `1`;
- execution-integrity binding over the exact widened effective request: `ACCEPT`;
- semantic authority over that widened request: `REJECT`;
- crossing result: `action_digest_mismatch`;
- widened protected-effect delta: `0`.

The execution uses a HandoffProbe-owned deterministic synthetic binding analogue. It does not reproduce or claim conformance with AkiraTamai's ZK/TEE implementation.

Classification remains:

**REFINEMENT**

No new stable attack is admitted.

The stable public corpus remains **23 attacks**.

No package version change or release is triggered.

Public result return to AkiraTamai in MCP `#3354` completed after merge. Direct scoped author review was received on 2026-09-22. Independent HandoffProbe rerun is not established.

## Public result return — 2026-09-18

Merged HandoffProbe execution state:

`13e4a525b658077e235a769f6aff6d6e2754a33e`

Public HandoffProbe result return:

`https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5731012791`

The reply records separately:

- execution-integrity binding result;
- semantic-authority result;
- protected-effect observation;
- the frozen upstream implementation revision;
- the fact that HandoffProbe used its own deterministic synthetic binding analogue;
- the fact that HandoffProbe did not reproduce or claim conformance with the upstream ZK/TEE implementation;
- the `REFINEMENT` classification;
- the absence of a new stable attack or release implication.

External response state:

**DIRECT AUTHOR REVIEW RECEIVED — EXTERNAL VECTOR COMPARISON + AUTHOR REVIEW**

Earlier upstream specification follow-up:

`https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5775696397`

Associated upstream PR #36:

`https://github.com/ripple-node-lab/mcp-verifiable-tools-demo/pull/36`

Merged upstream PR #36 commit:

`9b63cb023fa966e6da54d252d2827990d2d7fdbe`

Direct AkiraTamai author review:

`https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5777698218`

Authorization-continuity negative fixture:

`https://github.com/ripple-node-lab/mcp-verifiable-tools-demo/pull/37`

Merged PR #37 commit:

`803935c0fbcd34ead12976a52a6ad857c09e9fdc`

AkiraTamai directly confirmed that the HandoffProbe interpretation of the boundary is the intended one and identified nothing to correct.

He also confirmed the scope note: the HandoffProbe run did not exercise the ZK or TEE paths, while the composition rule was the relevant tested boundary.

The merged upstream negative fixture mirrors the HandoffProbe comparison:

- approved in-scope call: proof valid and approved commitment matches;
- schema-valid widened call: proof valid;
- widened call: rejected by approved-commitment mismatch.

This satisfies the scoped author-review condition for **External vector comparison + author review**.

It does not constitute independent HandoffProbe reproduction.

## Proposal / changelog traceability — 2026-09-22

The MCP `#3354` issue now explicitly describes itself as a pre-SEP proposal.

Its current description explicitly includes the authorization-continuity non-guarantee and identifies `inputCommitment` as the contact point between execution integrity and an external authority check.

Changelog entry `2026-09-22-002`:

- thanks `@Heaviside479`;
- links the HandoffProbe boundary discussion;
- links the AkiraTamai boundary response;
- links the HandoffProbe public result return;
- records the authorization-continuity edits;
- links merged negative fixture PR #37.

The issue also states an intent to continue proposal discussion through the MCP Security IG / Contributor Discord and to link that work from an eventual Extensions Track SEP PR.

This is external technical impact and traceability evidence only.

It does not establish:

- HandoffProbe adoption;
- endorsement;
- MCP standardization;
- SEP acceptance;
- independent HandoffProbe reproduction;
- a new stable attack.

Classification remains **REFINEMENT**.

Stable public corpus remains **23 attacks**.

## External result-return gate

If HandoffProbe later has a reproducible result worth showing:

- [x] reply to AkiraTamai in MCP `#3354`;
- [x] reference the exact originating response `#5715753995`;
- [x] link the exact HandoffProbe commit and stable evidence/fixture;
- [x] state separately what the execution-proof layer accepted or rejected;
- [x] state separately what the handoff/authority layer accepted or rejected;
- [x] preserve the distinction between execution integrity and authorization;
- [x] describe exactly what was and was not tested;
- [x] invite correction if the Verifiable MCP interpretation is wrong;
- [x] record and classify the direct AkiraTamai post-result author review and the resulting proposal / changelog traceability.

The research item is complete at **REFINEMENT / External vector comparison + author review**. No new stable attack is admitted, the stable public corpus remains **23 attacks**, and no package-version change or release is triggered.
