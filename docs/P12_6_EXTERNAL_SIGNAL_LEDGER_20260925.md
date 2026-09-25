# P12.6 external signal ledger

Date: 2026-09-25

Status: **ACTIVE — external signals classified; no P12.6 product-use gate claimed**

## Purpose

Preserve current external HandoffProbe-adjacent signals, distinguish technical
review from actual product use, and define the immediate external-evidence work
queue without inflating evidence levels.

This ledger supports P11.6 and P12.6 but does not replace either gate.

## Evidence classification rule

The project distinguishes:

- external technical response;
- external reviewer acknowledgement;
- external research reproduction opportunity;
- actual external HandoffProbe execution;
- actual external HandoffProbe integration;
- commercial interest;
- qualifying P12.6 product-use evidence.

Technical discussion, acknowledgement, upstream design changes or general praise
must not be relabeled as external HandoffProbe use unless an external party
actually executes or integrates HandoffProbe and the use can be evidenced.

## Signal 1 — MCP issue #3354

Source:

https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5777698218

Observed external response:

- AkiraTamai explicitly confirmed that the HandoffProbe reading of the boundary
  was the intended one;
- the upstream security considerations were updated to name authorization
  continuity as a separate non-guarantee;
- `inputCommitment` was documented as the comparison point between verified
  execution and an external authority layer;
- the upstream demo added a negative fixture in
  `ripple-node-lab/mcp-verifiable-tools-demo#37`;
- the response explicitly compared the new fixture to the two-row HandoffProbe
  result.

Classification:

**external technical response with an observable upstream specification/demo
change influenced by HandoffProbe evidence.**

This is valuable external research evidence.

It is **not** evidence that AkiraTamai executed or integrated HandoffProbe, so it
does not by itself satisfy the P12.6 external-use gate.

It is also not relabeled as P11.6 release-feedback evidence because that round
specifically asks for current installation, CLI, Action and user-guidance
feedback.

## Signal 2 — A2A issue #1769

Relevant external response:

https://github.com/a2aproject/A2A/issues/1769#issuecomment-5710413588

Observed external response:

- Takao Sato explicitly read the pinned HandoffProbe execution record;
- he described the native-versus-bound comparison and external effect recording
  as relevant to the trace under discussion;
- he explicitly stated that he had **not rerun HandoffProbe locally**.

Classification:

**external technical review / acknowledgement of HandoffProbe evidence.**

This is useful reviewer evidence but is not external product use.

Current 2026-09-25 follow-up discussion continues to reinforce the distinction
between A2A Task completion and the original operation effect, but no external
HandoffProbe run has been demonstrated in that thread.

## Signal 3 — VATE reproduction opportunity

Source:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5833914791

Takao Sato published a reproducible A2A evidence-review guide with:

- a fixed package;
- commands for local execution;
- saved-result verification;
- three synthetic historical cases;
- a request for reproduction results including package digest, runtime
  versions, command, exit status and relevant result or error.

The guide explicitly states that it is not an external-SUT conformance result.

Classification:

**external research reproduction opportunity — execution pending.**

Immediate action:

1. reproduce the published fixed input independently;
2. preserve package digest, runtime versions, exact command and exit status;
3. record observed results or errors without repairing failures into passes;
4. return the result publicly when the evidence is complete;
5. classify any overlap with HandoffProbe separately from VATE conformance.

This activity can strengthen the research/result-return loop but is not
automatically P12.6 HandoffProbe product-use evidence.

## Signal 4 — Burs-IA VATE corpus review

Source:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5834730544

The Burs-IA / BRS-00193 review explicitly described itself as:

- a three-case source-grounded corpus/contract review;
- no external SUT adapter;
- no reference-runner execution;
- no generated SUT result file;
- no conformance or certification claim.

The review raised a useful wording concern: external comparison can demonstrate
that a digest mismatch is terminal before execution without necessarily proving
the internal ordering of every policy evaluation step.

Classification:

**external research-quality signal only.**

This is not HandoffProbe product use and must not be counted toward P12.6.

The wording lesson should be retained for future HandoffProbe evidence claims:
claim only the ordering or effect boundary actually observed by the evidence.

## P11.6 current state

Canonical P11.6 feedback thread:

https://github.com/Heaviside479/handoffprobe/issues/168

Observed on 2026-09-25:

- issue remains open;
- external comment count remains `0`;
- direct fresh installation / CLI / Action / release-guide feedback remains
  `PENDING`.

The MCP, A2A and VATE research responses above are not silently relabeled as
P11.6 release feedback.

P11.6 therefore remains active.

## P12.6 current state

The current signals demonstrate useful external technical attention and
upstream response, but they do **not** yet demonstrate independently
attributable external HandoffProbe execution or integration.

Therefore:

- external technical response: **present**;
- external reviewer acknowledgement: **present**;
- upstream change influenced by HandoffProbe evidence: **present**;
- independently attributable external HandoffProbe execution: **not yet
  established by these signals**;
- independently attributable HandoffProbe integration: **not yet established
  by these signals**;
- P12.6 external-use gate: **not claimed complete**.

## RC.1 stage preflight — 2026-09-25

Repository state at preflight:

- protected `main` merge commit:
  `1fc3228fc8fd21ef5ddb43919aa7886a0269b41f`;
- repository package identity: `handoffprobe@1.0.0-rc.1`;
- verified public npm version: `0.4.0`;
- npm `latest` dist-tag: `0.4.0`;
- no observed `next` dist-tag;
- `handoffprobe@1.0.0-rc.1` was not already present in the public registry;
- workflow safety checks for `.github/workflows/npm-stage.yml` passed locally;
- intended prerelease dist-tag for a later separately authorized stage:
  `next`.

Local inspection of:

`npm stage list handoffprobe --json`

failed with npm `E401` because the local npm authentication token/session was no
longer valid.

Classification of that result:

- it is a **local npm authentication/readback problem**;
- it does not prove a failure of GitHub OIDC Trusted Publishing;
- it did not dispatch the stage workflow;
- it did not stage a package;
- it did not publish a package;
- it did not move `latest`;
- it does not authorize bypassing the Trusted Publishing path with a
  traditional publication token.

## Immediate work queue

1. Execute the VATE fixed reproduction and return evidence-backed results.
2. Preserve MCP #3354 as an external technical-response/upstream-change signal.
3. Preserve A2A #1769 as reviewer acknowledgement, not external execution.
4. After an RC is publicly installable, invite relevant external reviewers to
   run the exact RC package rather than merely discuss HandoffProbe evidence.
5. After an RC is publicly installable, update HandoffProbe issue #168 with the
   exact prerelease installation path and request direct CLI / Action / docs
   feedback.
6. Resolve local npm authentication only for required local registry inspection;
   do not replace the OIDC stage workflow with a traditional direct-publish
   path.
7. Keep npm stage, publication, prerelease tag creation and GitHub Release
   creation separately authorized.

## Release boundary

This ledger:

- does not close P11.6;
- does not complete P12.6;
- does not authorize npm stage;
- does not authorize npm publication;
- does not authorize a Git tag;
- does not authorize a GitHub Release;
- does not authorize `1.0.0`;
- does not add a stable attack.

The verified public npm release remains `handoffprobe@0.4.0`.

The repository candidate remains `handoffprobe@1.0.0-rc.1`.
