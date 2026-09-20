# Reddit R-4 x402 paid-retry request-binding execution — 2026-09-20

Status: **PUBLIC RESULT RETURN COMPLETE — PROTOCOL SEMANTICS / NO ADD; external response PENDING.**

## Purpose

Execute the frozen R-4 x402 paid-retry research shape through a deterministic
local HandoffProbe fixture.

The source case asks whether an MCP `analyze_property` flow using x402 calls
back successfully after the payment requirement and whether the payment path
works.

HandoffProbe does not perform a real payment in this research case.

The security-relevant question is narrower:

> What happens when the MCP application arguments change between the initial
> payment-required request and the paid retry while the x402 payment terms stay
> unchanged?

## Source provenance

Originating Reddit author:

`u/Emotional-One-5005`

Canonical source:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paxkn52/

Supplied repository:

https://github.com/Zak-bo/real-estate-x402

Frozen external source commit:

`4e99e87da0ccdf3ddcf067958de6b59eb4134414`

The external repository was inspected read-only.

This execution is local and synthetic.

It is not an external end-to-end reproduction.

## Verified dependency baseline

The frozen external repository resolves the relevant packages to:

- `agents@0.21.0`;
- `@x402/core@2.24.0`;
- `@x402/evm@2.24.0`.

The pre-implementation semantic review established that the x402 layer
verifies payment terms and does not automatically bind every MCP application
argument to the payment proof.

The supplied example client contains no separate request-approval object.

## Execution boundary

The R-4 fixture uses:

- no wallet;
- no private key;
- no blockchain;
- no testnet funds;
- no real funds;
- no public facilitator;
- no public paid endpoint;
- no remote MCP execution.

The payment proof and payment requirement are deterministic synthetic fixture
objects.

No payment was made.

## Local execution fixture

Execution test:

`tests/reddit-r4-x402-payment-binding-execution.test.ts`

Base commit:

`76ff2aed785f82cd66692c42eb165e76e44f5b6d`

The local fixture freezes one synthetic payment requirement:

- scheme: `exact`;
- network: `eip155:84532`;
- amount: fixed synthetic amount;
- asset: fixed synthetic token identifier;
- recipient: fixed synthetic recipient;
- timeout: fixed;
- tool: `analyze_property`.

Request A:

- address: `property:A`;
- condition: `average`;
- purchase price: `175000`.

Request B changes exactly one application argument:

- address: `property:B`.

The payment terms and synthetic payment proof remain unchanged.

## Path 1 — unchanged paid retry

Initial request:

- request A;
- deterministic result: `payment_required`;
- protected-effect delta before retry: `0`.

Paid retry:

- tool unchanged;
- arguments unchanged;
- payment terms: `MATCH`;
- synthetic payment verification: `ACCEPT`;
- application request binding: not required;
- effective address: `property:A`;
- protected dispatch: allowed;
- MCP tool-call count: `1`;
- fake-tool execution count: `1`;
- protected-effect delta: `1`.

This is the positive control.

## Path 2 — mutated retry under x402-only semantics

Initial request:

- address: `property:A`;
- deterministic result: `payment_required`;
- protected-effect delta before retry: `0`.

Paid retry:

- tool remains `analyze_property`;
- address changes to `property:B`;
- price/payment terms remain unchanged;
- synthetic payment proof remains unchanged;
- payment terms: `MATCH`;
- synthetic payment verification: `ACCEPT`;
- application request binding: not required;
- effective address: `property:B`;
- protected dispatch: allowed;
- MCP tool-call count: `1`;
- fake-tool execution count: `1`;
- protected-effect delta: `1`.

Classification of this observed path:

**EXPECTED X402-ONLY SEMANTICS**

This result is not classified as a vulnerability.

The payment proof establishes the frozen payment terms.

The fixture does not assume that x402 itself promises binding to every MCP
application argument.

## Path 3 — explicit request-bound composition control

The composition layer explicitly binds the authorization decision to the exact
request-A tool and argument set.

The paid retry then changes:

`property:A → property:B`

while preserving the same synthetic payment proof.

Observed:

- payment terms: `MATCH`;
- synthetic payment verification: `ACCEPT`;
- application request binding: `MISMATCH`;
- protected dispatch: blocked;
- MCP tool-call count: `0`;
- fake-tool execution count: `0`;
- protected-effect delta: `0`.

This demonstrates the additional application/composition property required if
a payment confirmation is intended to authorize one exact MCP request.

It does not claim that x402 itself requires this property.

## Determinism

Focused execution result:

- test files: `1/1` passed;
- tests: `5/5` passed.

The fixture repeats all three scenario summaries and requires identical
results.

No network timing, wallet state, blockchain state, remote service or
model-mediated decision is involved.

## Post-execution overlap / admission

### HP-APPROVAL-001

Adjacent, but not governing.

If an application separately represents payment confirmation as consent to one
exact MCP argument set, payload mutation after that consent becomes an approval
binding problem.

The supplied implementation does not establish such an approval object.

### HP-APPROVAL-002 / HP-APPROVAL-003

Not governing.

The primary fixture does not reuse approval across tools or across an
explicitly resource-bound approval.

### HP-REPLAY-002

Not governing.

The primary fixture remains inside one pre-settlement retry flow and does not
move completed authority into another run or independent execution context.

### HP-TARGET-001

Not governing.

The fixture deliberately does not assume that changing the analyzed property
is independently unauthorized.

### HP-REPLAY-001 / HP-REPLAY-003

Not governing.

The primary fixture does not test proof reuse after successful settlement,
duplicate settlement or ambiguous duplicate protected execution.

## Final admission decision

Decision: **PROTOCOL SEMANTICS / NO ADD**

- new stable attack ID: **no**;
- stable attack count: **23**;
- package version change: **no**;
- release triggered: **no**.

The R-4 value is a deterministic composition-boundary regression:

- x402 payment-term verification and MCP application-request binding are
  separate properties;
- the first property can accept while an optional explicit second property
  rejects.

The observed x402-only argument mutation is not labelled a vulnerability.

## Claims and limitations

This result demonstrates only the local deterministic fixture described above.

It does not establish:

- an x402 protocol vulnerability;
- a vulnerability in `real-estate-x402`;
- a Cloudflare Agents vulnerability;
- a facilitator vulnerability;
- successful real payment settlement;
- successful Base Sepolia execution;
- that payment must always bind every application argument;
- external reproduction or confirmation.

The public result must preserve those limitations.

## Public result return

Merged execution commit:

`d012c506a6e44680fb649ff8ab64fb32f41a9bae`

Immutable execution record:

https://github.com/Heaviside479/handoffprobe/blob/d012c506a6e44680fb649ff8ab64fb32f41a9bae/docs/REDDIT_R4_X402_PAYMENT_BINDING_EXECUTION_20260920.md

Immutable execution test:

https://github.com/Heaviside479/handoffprobe/blob/d012c506a6e44680fb649ff8ab64fb32f41a9bae/tests/reddit-r4-x402-payment-binding-execution.test.ts

Public result-return comment:

https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pay1b51/

The public reply preserves the measured local result and explicitly states that:

- no live payment was attempted;
- the x402-only mutation result is expected protocol semantics rather than a
  vulnerability finding;
- an explicit application-level request binding blocks the changed-property
  retry before dispatch;
- the result does not establish a vulnerability in x402, Cloudflare Agents or
  `real-estate-x402`;
- correction or counter-evidence was invited from the originating developer.

## Current external-review state

External response to the returned HandoffProbe result:

**PENDING**

The public result return itself is not external confirmation.

Silence must not be interpreted as agreement or confirmation.

The strongest demonstrated evidence level is therefore:

**Open research follow-up**

No new stable attack is added.

Stable public corpus remains **23 attacks**.

Package remains `0.4.0`.

No release is triggered.

The only remaining R-4 follow-up is to classify any substantive external
response if one arrives.
