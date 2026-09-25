# VATE A2A evidence-review reproduction

Date: 2026-09-25

Status: **COMPLETE — fixed external reproduction package reproduced successfully**

## Purpose

Record HandoffProbe maintainer-side reproduction of the fixed VATE A2A
evidence-review package published by Takao Sato in VATE issue #2.

This is an external research reproduction and public result-return input.

It is not:

- an external HandoffProbe user;
- an external HandoffProbe integration;
- an external-SUT VATE conformance result;
- production validation;
- certification;
- general A2A interoperability proof.

## Upstream source

Issue:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5833914791

Pinned reproduction guide commit:

`b847004c683de0ed81c7ee5a78d5342b82930fb8`

Guide:

https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/blob/b847004c683de0ed81c7ee5a78d5342b82930fb8/docs/a2a/evidence-reproduction.md

## Fixed package identity

Package:

`vate-a2a-evidence-starter-06.zip`

Expected and observed size:

`234820` bytes

Expected and observed SHA-256:

`ec9b2286a18f5500f10a10281dfe6e2620b9aa31b5045ce0748bb89c8308fd31`

The downloaded package matched both pinned identity checks exactly before
extraction.

## Runtime

Observed reproduction environment:

- Python: `3.13.15`
- Node.js: `v24.17.0`
- npm: `11.13.0`
- execution: local POSIX environment
- transport: loopback HTTP
- provider account: none
- external credentials: none

Python 3.13 was installed separately for this reproduction. The macOS system
Python was not replaced.

## Package check

Command:

`python -I -B starter.py check`

Exit status:

`0`

Observed result:

- status: `PASS`
- source files: `201`
- R17: `CONFIRMED_SUCCESS`
- R52: `INDETERMINATE`
- R86: `INCOMPLETE`

The check explicitly described its scope as fixed package bytes and recomputed
historical assessments without issuer authentication.

## Live exchange

Command:

`python -I -B starter.py run --name handoffprobe-20260925T183006Z`

Exit status:

`0`

Observed summary:

- status: `PASS`
- cases: `3`
- boundary probes: `23`
- recipient invocations: `3`
- temporary servers stopped: `true`
- delivered RPC shapes: `59`
- requests reconciled: `72`
- positive downloaded files: `131`
- lost response observations: `1`

## Three-case result

### R17

Observed:

- decision: `CONFIRMED_SUCCESS`
- effect: `OBSERVED_LOCAL_BYTES`
- retry: `DO_NOT_REPEAT`
- task state: `TASK_STATE_COMPLETED`
- downloaded original files: `52`
- all downloaded bytes matched
- recomputed prior assessment matched

### R52

Observed:

- decision: `INDETERMINATE`
- effect: `UNKNOWN`
- retry: `QUERY_SAME_ATTEMPT`
- task state: `TASK_STATE_COMPLETED`
- downloaded original files: `36`
- all downloaded bytes matched
- recomputed prior assessment matched

This reproduced the central upstream claim: completion of the evidence-review
A2A Task does not establish that the original operation effect is known.

The saved Task remained completed while the original effect remained unknown.

### R86

Observed:

- decision: `INCOMPLETE`
- effect: `REPORTED_ONLY`
- retry: `QUERY_SAME_ATTEMPT`
- task state: `TASK_STATE_COMPLETED`
- downloaded original files: `43`
- all downloaded bytes matched
- recomputed prior assessment matched

## Boundary probes

The live run exercised 23 boundary probes.

Observed examples included:

- unsupported A2A version rejected before fetch;
- wrong core field spelling rejected before fetch;
- unknown VATE phase rejected before fetch;
- subject/transaction mismatch rejected before fetch;
- foreign disclosure receipt rejected before fetch;
- non-loopback and filesystem references rejected before fetch;
- encoded traversal reference rejected before fetch;
- wrong manifest digest classified `INVALID`;
- wrong receipt digest classified `INVALID`;
- wrong attempt and authorization instance classified `INVALID`;
- unavailable declared receipt classified `INCOMPLETE`;
- media-type mismatch classified `INVALID`;
- redirecting store classified `INVALID`;
- task/context mismatch rejected before fetch;
- terminal review Task was not re-executed;
- lost `GetTask` response was recovered without reassessment;
- provider execution remained false for the lost-response recovery;
- store remained exact-path and read-only.

No attempt is made here to promote these observations beyond the fixed
reproduction package contract.

## Saved-run verification

Command:

`python -I -B starter.py verify-run --name handoffprobe-20260925T183006Z`

Exit status:

`0`

Observed result:

`PASS`

Saved-run verification observed:

- client/server requests reconciled: `72`
- downloaded positive files: `131`
- lost response observations: `1`
- normal Task responses bound to evidence: `20`
- preserved sources: `201`
- rechecked received files: `131`
- recomputed received assessments: `3`
- reconstructed request bindings: `3`
- bound RPC request/response pairs: `72`
- successful delivered RPC shapes: `59`

The verifier explicitly does not claim complete A2A conformance or SDK
interoperability.

## HandoffProbe classification

Classification:

**SUCCESSFUL EXTERNAL RESEARCH REPRODUCTION / RESULT-RETURN INPUT**

This result strengthens the HandoffProbe research loop because an externally
published, pinned package was independently downloaded, identity-checked and
executed without modifying the upstream package to obtain a pass.

It does not demonstrate external HandoffProbe adoption because the reproduction
was executed by the HandoffProbe maintainer.

It does not by itself satisfy P11.6 or P12.6.

## Next action

Return the reproduction result publicly to VATE issue #2 with:

- pinned guide commit;
- package SHA-256;
- Python / Node / npm versions;
- commands;
- exit statuses;
- three case outcomes;
- the reproduced R52 Task-completion/original-effect distinction;
- explicit scope boundary.

Then preserve any upstream response separately.

## Release boundary

This reproduction does not:

- add a stable HandoffProbe attack;
- change the protocol baseline;
- close P11.6;
- complete P12.6;
- authorize npm stage;
- authorize npm publication;
- authorize a prerelease Git tag;
- authorize a GitHub Release;
- authorize `1.0.0`.
