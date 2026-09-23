import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const audit = readFileSync('docs/P12_1_GA_READINESS_AUDIT_20260921.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

const phase12 = roadmap.slice(
  roadmap.indexOf('# Phase 12 — HandoffProbe v1.0 GA'),
  roadmap.indexOf('# Phase 13 — Commercial validation'),
);

describe('P12.1 GA readiness audit', () => {
  it('keeps the current release unchanged and does not authorize v1.0', () => {
    expect(audit).toContain('Current verified public release:');
    expect(audit).toContain('`handoffprobe@0.4.0`');
    expect(audit).toContain('v1.0 is **not yet');
    expect(audit).toContain('P12.1 does not change `0.4.0`');
  });

  it('records the clean Phase 12 execution baseline', () => {
    expect(audit).toContain('126 test files passed');
    expect(audit).toContain('633 tests passed');
    expect(audit).toContain('23 PASS / 0 FAIL / 0 ERROR');
    expect(audit).toContain('JSON report schema: `1`');
  });

  it('identifies the current GA blockers without inventing completion', () => {
    expect(audit).toContain('### 11. Threat model current');
    expect(audit).toContain('State: **BLOCKED**');

    expect(audit).toContain('### 12. Limitations documented');
    expect(audit).toContain('State: **PARTIAL — CONSOLIDATION REQUIRED**');

    expect(audit).toContain('### 13. External users demonstrated');
    expect(audit).toContain('State: **BLOCKED**');

    expect(audit).toContain('### 14. Release automation proven');
    expect(audit).toContain('State: **PARTIAL**');
  });

  it('preserves P11.6 as an independent open gate', () => {
    expect(audit).toContain('P11.6 remains active');
    expect(audit).toContain('fresh external feedback');
    expect(audit).toContain('`NO RESPONSE`');
  });

  it('defines a v1 contract-freeze candidate without freezing it prematurely', () => {
    expect(audit).toContain('## v1 public-contract freeze candidate');
    expect(audit).toContain('exit codes `0 / 1 / 2 / 3`');
    expect(audit).toContain('config schema version `1`');
    expect(audit).toContain('JSON report schema version `1`');
    expect(audit).toContain('P12.1 does **not** yet declare these contracts permanently frozen');
  });

  it('does not require artificial intermediate releases', () => {
    expect(audit).toContain('There is no requirement to publish artificial intermediate versions');
    expect(audit).toContain('`1.0.0` release candidate');
    expect(audit).toContain('No option is selected by this audit');
  });
});

describe('current roadmap execution model', () => {
  it('keeps the public release at 0.4.0 without forcing intermediate minors', () => {
    expect(roadmap).toContain('## Current execution model — authoritative from 2026-09-21');
    expect(roadmap).toContain('Current verified public release: **`handoffprobe@0.4.0`**');
    expect(roadmap).toContain(
      '`0.5.0` through `0.9.0`: only for independently justified backward-compatible',
    );
  });

  it('keeps external waits asynchronous instead of stopping internal development', () => {
    expect(roadmap).toContain(
      'Waiting for an external reply must not create an idle development state',
    );
    expect(phase12).toContain(
      'Do not stop internal development merely because an external response is',
    );
    expect(phase12).toContain('## P12.6 — asynchronous external-use and adoption evidence');
  });

  it('defines the complete GA work-package path', () => {
    expect(phase12).toContain('## P12.1 — GA readiness audit');
    expect(phase12).toContain('## P12.2 — current threat model and limitations contract');
    expect(phase12).toContain('## P12.3 — v1 public-contract freeze');
    expect(phase12).toContain('## P12.4 — internal GA hardening and backlog disposition');
    expect(phase12).toContain('## P12.5 — GA candidate and live release-engineering proof');
    expect(phase12).toContain('## P12.6 — asynchronous external-use and adoption evidence');
    expect(phase12).toContain('## P12.7 — final GA decision and coordinated publication');
  });

  it('allows an RC to support validation without mislabeling it as GA', () => {
    expect(phase12).toContain(
      'an evidence-backed `1.0.0-rc.1` materially improves final validation',
    );
    expect(phase12).toContain('it remains a prerelease and does not waive P11.6 or P12.6');
    expect(phase12).toContain(
      'the decision does not itself authorize a version change, npm stage, npm publication, tag or GitHub Release',
    );
    expect(phase12).toContain(
      'the concrete prerelease version transition remains a separately controlled step',
    );
  });

  it('keeps Cloud and Enterprise demand-gated without blocking technical expansion', () => {
    expect(roadmap).toContain('# Phase 14 — HandoffProbe Cloud beta');
    expect(roadmap).toContain('Status: **CONDITIONAL — demand gate not yet satisfied**');
    expect(roadmap).toContain(
      'Phase 15 does not need to complete before Phase 16 technical work can proceed',
    );
    expect(roadmap).toContain('It is independent of whether Cloud or Enterprise is built');
  });
});
