# P12.6 external signal ledger

Initial date: 2026-09-25\n\nLast live review: 2026-09-26

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

## Signal 3 — VATE reproduction and author acknowledgement

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

**external research reproduction — successfully executed; public result
returned.**

Completed on 2026-09-25:

- fixed ZIP size matched: `234820` bytes;
- fixed ZIP SHA-256 matched:
  `ec9b2286a18f5500f10a10281dfe6e2620b9aa31b5045ce0748bb89c8308fd31`;
- Python `3.13.15`;
- Node.js `v24.17.0`;
- npm `11.13.0`;
- package check: exit `0`, `PASS`;
- live three-case exchange: exit `0`, `PASS`;
- saved-run verification: exit `0`, `PASS`;
- R17: `CONFIRMED_SUCCESS / OBSERVED_LOCAL_BYTES / DO_NOT_REPEAT`;
- R52: `INDETERMINATE / UNKNOWN / QUERY_SAME_ATTEMPT`;
- R86: `INCOMPLETE / REPORTED_ONLY / QUERY_SAME_ATTEMPT`;
- 23 runtime boundary probes executed;
- 72 request/response pairs reconciled;
- 131 received files rechecked;
- all three received assessments recomputed.

The R52 run reproduced the intended distinction that an evidence-review Task may
reach `TASK_STATE_COMPLETED` while the original operation effect remains
`UNKNOWN`.

Evidence:

`docs/VATE_A2A_EVIDENCE_REPRODUCTION_20260925.md`

Public result return:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5837858177

Upstream response received on 2026-09-26:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5841835511

Poke-nushi created a durable VATE reproduction record:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/blob/89a0b5314f4619383e10406a342ac9b6df3bec78/docs/interop/handoffprobe-a2a-reproduction.md

The response states that the HandoffProbe maintainer reproduction was recorded,
linked from the VATE A2A guide and roadmap, and that the R52 distinction is
particularly useful.

Classification:

**author acknowledgement of the returned external-research reproduction.**

The VATE maintainer did not independently rerun HandoffProbe. This does not
establish VATE conformance, HandoffProbe adoption, production validation or
independent external HandoffProbe execution.

This reproduction strengthens the research/result-return loop but is not
P12.6 external HandoffProbe product-use evidence because the VATE package was
executed by the HandoffProbe maintainer.

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

### 2026-09-26 Burs-IA / LUMEN follow-up

The earlier Burs-IA three-case corpus review later progressed into an external
VATE SUT-result exercise against pinned VATE commit
`cb04cb53a33456327c21cd8bb5b26e087e2efff1`.

Public follow-up:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5841045090

Canonical public package:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5842127880

Reported VATE results:

- `compare`: 3 passed / 73 failed / 0 skipped / 76 total;
- the 73 failures are the intentionally unsubmitted remainder of the corpus;
- `verify-bundle`: 54 passed / 0 failed;
- public SUT result, comparison report, implementation report, bundle
  verification and derivation material were published;
- an initially incorrect descriptor comparison was preserved and corrected
  rather than hidden.

Updated classification:

**external VATE SUT / ecosystem research evidence.**

This materially strengthens the external VATE review ecosystem, but it is not
HandoffProbe execution, HandoffProbe adoption or evidence for the P12.6
HandoffProbe-use threshold. No direct HandoffProbe test is justified from this
bundle alone.

## Signal 5 — HandoffProbe issue #185 / AACP-017

Source:

https://github.com/Heaviside479/handoffprobe/issues/185

Pinned external reproducer:

https://github.com/arjun2075/aacp017-handoffprobe-repro/tree/31c3afc0e4253e77e3242fe46c3099ae9d6e1549

The external developer reports executing the public `handoffprobe@0.4.0`
package without source modification.

Reported current-product result:

- secure bundled corpus: `23 / 23 PASS`;
- vulnerable bundled corpus: `23 / 23 FAIL`;
- existing stable attacks behaved as documented.

The submitted AACP-017 reproducer then isolates a predicate-level authority
representation question. Under an opaque-identifier encoding, the current
semantic-authority algebra places both `amount < 5000 -> amount <= 4999` and
`amount < 5000 -> amount <= 5000` into the same changed-identifier failure
class, even though the first transformation is semantics-preserving over
integer cents.

The exact external reproducer was independently rerun by the HandoffProbe
maintainer on 2026-09-26 and reproduced its documented observation.

Evidence:

`docs/AACP_017_PREDICATE_AUTHORITY_SIGNAL_20260926.md`

Public result return:

https://github.com/Heaviside479/handoffprobe/issues/185#issuecomment-5846617504

Classification:

**independently attributable external HandoffProbe package execution + research
input.**

This is current P12.6 evidence of an external developer running the public
package and reporting concrete results.

It is not:

- HandoffProbe adoption;
- external integration;
- repeated use;
- a customer or paid assessment;
- a defect claim against the current 23 stable attacks;
- a stable-attack admission.

AACP-017 enters overlap/admission review as a research input. The stable corpus
remains 23.

## P11.6 current state

Canonical P11.6 feedback thread:

https://github.com/Heaviside479/handoffprobe/issues/168

Observed through 2026-09-26:

- issue remains open;
- external comment count remains `0`;
- direct fresh installation / CLI / Action / release-guide feedback in issue
  #168 remains `PENDING`;
- issue #185 is a fresh external public-package execution and research report,
  but it is not silently relabeled as a response to the dedicated P11.6
  onboarding / CLI / Action / release-guide request.

The MCP, A2A, VATE and AACP-017 signals above are therefore classified in their
own evidence lanes.

P11.6 remains active.

## P12.6 current state

The current signals now include one independently attributable external
execution of the published HandoffProbe package.

Therefore:

- external technical response: **present**;
- external reviewer acknowledgement: **present**;
- upstream change influenced by HandoffProbe evidence: **present**;
- independently attributable external HandoffProbe execution: **present via
  issue #185 / AACP-017**;
- independently attributable HandoffProbe integration: **not yet established**;
- repeated external use: **not yet established**;
- adoption: **not claimed**;
- commercial HandoffProbe intent or customer evidence from these signals:
  **not established**;
- P12.6 has at least one instance matching the roadmap example of an external
  developer running the package and reporting concrete results;
- the minimum GA evidence threshold remains undefined;
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

1. [COMPLETED] VATE reproduction returned publicly with exact evidence.
2. [COMPLETED] VATE maintainer acknowledgement and durable reproduction record
   classified without promotion to adoption or conformance.
3. [COMPLETED] First current independently attributable external public-package
   execution captured through HandoffProbe issue #185.
4. Perform the normal AACP-017 overlap/admission review before any model or
   stable-corpus implementation decision.
5. Preserve MCP #3354 and A2A #1769 at their already demonstrated evidence
   levels.
6. Do not interrupt the current A2A #1769 Poke-nushi / ogasurfproject-jpg
   field-mapping exchange unless a concrete HandoffProbe question or vector is
   directed back to this project.
7. After an RC is publicly installable, invite relevant external reviewers to
   run the exact RC package and update issue #168 with the exact prerelease
   installation path.
8. Define the minimum GA external-evidence threshold explicitly.
9. Resolve local npm authentication only for required local registry inspection;
   do not replace the OIDC stage workflow with a traditional direct-publish
   path.
10. Keep npm stage, publication, prerelease tag creation and GitHub Release
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
