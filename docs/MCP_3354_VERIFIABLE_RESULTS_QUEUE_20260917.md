# MCP #3354 — Verifiable MCP / authority-boundary research queue

Status: **QUEUED — external technical signal recorded; no implementation authorized.**
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

## External result-return gate

If HandoffProbe later has a reproducible result worth showing:

- [ ] reply to AkiraTamai in MCP `#3354`;
- [ ] reference the exact originating response `#5715753995`;
- [ ] link the exact HandoffProbe commit and stable evidence/fixture;
- [ ] state separately what the execution-proof layer accepted or rejected;
- [ ] state separately what the handoff/authority layer accepted or rejected;
- [ ] preserve the distinction between execution integrity and authorization;
- [ ] describe exactly what was and was not tested;
- [ ] invite correction if the Verifiable MCP interpretation is wrong;
- [ ] record and classify any substantive AkiraTamai response before further implementation that depends on it.

The research item is not complete merely because it is documented here. Completion requires an explicit later decision of `NO ADD / REFINEMENT / DISTINCT RESEARCH CANDIDATE`, plus the public evidence-based follow-up above if HandoffProbe actually produces a reproducible result.
