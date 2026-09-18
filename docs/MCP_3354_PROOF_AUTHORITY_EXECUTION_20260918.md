# MCP #3354 — execution-integrity / authority boundary execution

Status: **COMPLETE — deterministic refinement execution; public result return NEXT.**

Date: 2026-09-18

## Purpose

Execute the smallest research refinement admitted by:

`docs/MCP_3354_FREEZE_OVERLAP_20260918.md`

The property under test is deliberately layered:

`valid execution-integrity evidence for the effective request`

does not imply:

`the effective request was authorized by the upstream caller`.

This execution does not create a new stable HandoffProbe attack and does not claim a defect in MCP or Verifiable MCP.

## Frozen external basis

Public MCP discussion:

https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354

HandoffProbe boundary comment:

https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5682996881

AkiraTamai response:

https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5715753995

Frozen upstream implementation repository:

`ripple-node-lab/mcp-verifiable-tools-demo`

Frozen upstream commit:

`66a959f79802d3751ba7edc0aec4c1c0e0ee2b36`

Frozen specification blob:

`1fd2d0c377388e4d8560fe5b38cf2e2a1d895541`

## Execution scope

The test is:

`tests/mcp-3354-proof-authority-execution.test.ts`

It reuses HandoffProbe-owned components:

- `evaluateP0SemanticAuthority`;
- `callReadInvoiceThroughMcp`;
- `CrossingEffectRecorder`;
- the Phase 9 final pre-dispatch gate;
- HandoffProbe structured runtime evidence.

No external service, credential, payment system or production side effect is used.

## Execution-integrity layer

HandoffProbe does **not** claim to reproduce AkiraTamai's ZK, TEE or other cryptographic proof implementation.

The test uses a deterministic HandoffProbe-owned synthetic binding analogue for the narrow property required by this comparison.

For the fixture subset it binds:

- a fixed synthetic program identity / `circuitHash`;
- the exact effective argument object;
- a fixed 32-byte salt;
- a deterministic input commitment;
- the deterministic synthetic program output;
- an output commitment;
- a fixed nonce.

The fixture input subset is limited to simple ASCII strings and safe integers.

This is intentionally not presented as general RFC 8785, MCP-extension conformance, ZK proof verification or production cryptographic evidence.

The only research question is whether an execution-integrity layer can correctly accept evidence for the *actual effective widened request* while the independent authorization layer rejects that same request.

## Upstream authority

The allowed synthetic operation is:

`payment.route|scope=mycelium:payment`

The widened downstream operation is:

`payment.route|scope=mycelium:*`

HandoffProbe evaluates the existing semantic-authority relation:

`effective_authority(downstream) ⊆ delegated_authority(upstream)`

through the existing `evaluateP0SemanticAuthority` machinery.

## Positive control

Effective downstream request:

- action: `payment.route`;
- delegated scope: `mycelium:payment`;
- amount: `2000` cents.

Observed layers:

- execution-integrity binding: `ACCEPT`;
- semantic authority: `ACCEPT`;
- crossing gate: `succeed / accepted`;
- MCP tool call: exactly `1`;
- local protected fake-tool effect: exactly `1`.

This proves the control can reach the protected synthetic effect when both layers accept.

## Widened negative

Upstream allowed authority remains:

`payment.route|scope=mycelium:payment`

The downstream effective request is changed to:

`payment.route|scope=mycelium:*`

Execution-integrity evidence is generated for that exact widened request.

Observed layers:

- execution-integrity binding for the widened effective request: `ACCEPT`;
- semantic-authority decision: `FAIL`;
- widening witness: `payment.route|scope=mycelium:*`;
- crossing gate: `reject / action_digest_mismatch`;
- MCP tool call: exactly `0`;
- local protected fake-tool effect: exactly `0`.

The proof/binding layer is therefore not treated as authorization.

The authority layer remains independently decisive.

## Binding negative control

Evidence generated for the narrow request does not verify against the widened effective request.

The narrow and widened input commitments differ deterministically.

This prevents the test from obtaining the desired layer split by simply reusing evidence for a different input.

## Research classification

The execution confirms the freeze/overlap decision:

**REFINEMENT**

Reason:

- the governing downstream-authority invariant is already owned by stable `HP-AUTH-001`;
- Phase 9 and T-3 already cover semantic widening at the handoff boundary;
- MCP #3354 adds a useful independent execution-integrity layer that can legitimately accept the widened effective request while authorization still rejects it.

New stable attack admitted: **no**.

Stable public corpus: **23 attacks**.

Package version change: **no**.

Release triggered: **no**.

## Limitations

This execution does not establish:

- a vulnerability in MCP;
- a vulnerability in Verifiable MCP;
- MCP acceptance or endorsement;
- Verifiable MCP conformance;
- execution of AkiraTamai's actual proof implementation;
- production cryptographic assurance;
- production-world effects;
- general JCS or RFC 8785 compatibility;
- that every proof layer should perform authorization.

The execution instead demonstrates the narrower composition rule:

> execution integrity over the effective request must not be substituted for upstream authorization of that request.

## Public result-return gate

After this execution is committed, reviewed by repository CI and merged, HandoffProbe must return the concrete result to AkiraTamai in MCP #3354.

The public reply must include:

- the exact merged HandoffProbe commit;
- this execution record;
- the exact test;
- frozen upstream revision;
- proof/binding layer result;
- authority-layer result;
- effect observation;
- tested and untested scope;
- explicit statement that HandoffProbe did not reproduce the upstream ZK/TEE implementation;
- invitation to correct the interpretation or provide a stronger counterexample.

After posting the public result, HandoffProbe must:

1. update `EVIDENCE.md` with the strongest evidence level actually demonstrated;
2. record the public reply URL in the MCP #3354 queue and roadmap;
3. keep any external-response state explicit;
4. classify any substantive AkiraTamai response before final research closeout;
5. never interpret silence as confirmation.
