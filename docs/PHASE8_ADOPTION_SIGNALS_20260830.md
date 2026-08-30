# Phase 8.2B — Telemetry-Free Adoption Signals

Status: completed 2026-08-30

Repository baseline: `2b8a08b4a3808dc415d53bfa2e9b6d452bd88769`

## Purpose

Phase 8.2B improves public and opt-in ways to learn whether HandoffProbe is being used repeatedly and which integrations are actually requested.

It does not add hidden product telemetry, hosted analytics, accounts, signup requirements, tracking pixels, third-party usage SDKs, or automatic network reporting from the CLI or GitHub Action.

## Pre-change signal audit

Before Phase 8.2B:

- `.github` contained a pull-request template and workflows but no structured issue forms for adoption feedback or adapter demand;
- the README stated that HandoffProbe has no telemetry or signup requirement;
- public users had no dedicated opt-in path to report one-time versus repeat use;
- public users had no structured demand path aligned with the Phase 8 adapter admission gate;
- GitHub Discussions were not required for this work package;
- raw GitHub and npm counters remained contextual platform signals rather than verified users.

The absence of a structured opt-in path made repeat usage and integration demand harder to distinguish without adding product telemetry.

## Added signal 1— adoption and integration feedback

`.github/ISSUE_TEMPLATE/adoption-feedback.yml` provides a voluntary public issue form.

It asks for:

- usage mode;
- exact HandoffProbe version or revision;
- handoff or integration path;
- one-time versus repeated usage frequency;
- optional public repository URL;
- what worked;
- friction or blockers;
- optional integration or adapter need.

The form explicitly says that HandoffProbe does not collect hidden usage telemetry and that submission is optional and public.

A maintainer-created test submission must not be counted as independent adoption.

A self-reported issue is evidence of an opt-in report, not automatically evidence of a unique user, production deployment, or verified organization.

## Added signal 2 — adapter and integration demand

`.github/ISSUE_TEMPLATE/adapter-request.yml` provides a voluntary public demand signal for Phase 8.3A.

It asks for:

- both sides of the handoff/composition path;
- protocol and framework versions;
- real demand evidence;
- handoff-specific security value;
- deterministic local, authorized, or reproducible research test path;
- paid-infrastructure requirements;
- maintenance and versioning risk;
- optional public references.

This mirrors the Phase 8 adapter admission gate without promising implementation.

Requests that do not establish handoff-specific security value or reproducibility remain evidence to review, not automatic roadmap commitments.

## Issue chooser safety

`.github/ISSUE_TEMPLATE/config.yml` keeps blank issues enabled and links security-sensitive reporters to the repository security policy.

The public adoption and adapter forms both instruct reporters not to include secrets, private data, or undisclosed vulnerabilities.

Security-sensitive reports continue to follow `SECURITY.md`; Phase 8.2B does not move vulnerability disclosure into public issues.

## Public discovery

The README links directly to both opt-in issue forms and explains:

- no hidden usage telemetry is collected;
- feedback is public and voluntary;
- adoption reports can describe repeated local or CI use;
- adapter requests feed evidence gathering rather than guaranteeing implementation;
- secrets and undisclosed vulnerabilities do not belong in these public forms.

`CONTRIBUTING.md` also points contributors to the same opt-in demand paths.

## Measurement rules

Phase 8 continues to distinguish signals from claims:

- an adoption-feedback issue is one opt-in report, not automatically one unique user;
- a public repository URL is stronger evidence only when the repository visibly uses HandoffProbe;
- repeat-use claims are self-reported unless supported by public integration evidence;
- adapter-request counts measure requests, not implementation priority by themselves;
- maintainer-created test issues and synthetic audit repositories are excluded from independent-adoption claims;
- GitHub stars remain secondary;
- raw clone, view, release-download, and npm-download counters retain their existing interpretation caveats.

## Explicit non-changes

Phase 8.2B adds no:

- CLI telemetry;
- GitHub Action telemetry;
- analytics SDK;
- tracking pixel;
- account or signup requirement;
- hosted dashboard;
- automatic usage-report network request;
- paid analytics dependency;
- paid AI dependency.

No scanner behavior, attack behavior, protocol baseline, report schema, `action.yml`, package metadata, or already published `handoffprobe@0.1.0` artifact is changed.

## Next work package

Proceed to Phase 8.3A: research and rank adapter demand using real evidence.

The new adapter-request form is a collection channel for that evidence, not evidence that any adapter already meets the admission gate.
