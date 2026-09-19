import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const plan = readFileSync('docs/REPOSITORY_CLEANUP_PLAN_20260918.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('Cleanup D branch and issue reconciliation', () => {
  it('records Cleanup D completion', () => {
    expect(plan).toContain('# Cleanup D — issue and branch reconciliation');
    expect(plan).toContain('Status: **COMPLETE — 2026-09-19**');
    expect(plan).toContain('15 remote branches were deleted');
    expect(plan).toContain('Cleanup D is complete.');
  });

  it('preserves the historical v0.3 discovery branch', () => {
    expect(plan).toContain('roadmap/v0.3.0-postrelease-github-discovery');
    expect(plan).toContain('7446452d1e5f1d4e3a0e0d900ec8ae9abd0c8543');
  });

  it('records the issue 38 closeout without promoting T-2.7', () => {
    expect(plan).toContain('was closed as completed on 2026-09-19');
    expect(plan).toContain('WAITING FOR RESPONSE from Bayu');
    expect(plan).toContain('NO EXTERNAL REVIEW RECEIVED');
    expect(plan).toContain('does not treat silence as validation');
  });

  it('marks the Cleanup D roadmap gates complete', () => {
    expect(roadmap).toContain(
      '- [x] audit all 16 divergent branches individually before any further deletion;',
    );
    expect(roadmap).toContain(
      '- [x] reconcile stale issue #38 against completed T-2.1–T-2.6 and pending T-2.7;',
    );
    expect(roadmap).toContain('Cleanup A through Cleanup E completed 2026-09-19.');
  });
});
