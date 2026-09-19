import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const plan = readFileSync('docs/REPOSITORY_CLEANUP_PLAN_20260918.md', 'utf8');

const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('repository cleanup plan documentation', () => {
  it('persists the cleanup sequence in the repository', () => {
    expect(plan).toContain(
      'Status: **COMPLETE — Cleanup A through Cleanup E completed by 2026-09-19.**',
    );

    expect(plan).toContain('# Cleanup B — current documentation reconciliation');

    expect(plan).toContain('# Cleanup C — documentation navigation');

    expect(plan).toContain('# Cleanup D — issue and branch reconciliation');

    expect(plan).toContain('# Cleanup E — reliability and final repository verification');
  });

  it('records completed branch hygiene', () => {
    expect(plan).toContain('- 27 verified merged remote branches deleted;');

    expect(plan).toContain('- 16 divergent branches preserved;');

    expect(plan).toContain('`docs/model-mediated-mutation-roadmap-20260917`');
  });

  it('records the completed compact README and npm strategy', () => {
    expect(plan).toContain('# Cleanup B.1 — compact README / npm presentation');

    expect(plan).toContain('Status: **COMPLETE — 2026-09-18**');

    expect(plan).toContain('There is no separate npm README planned.');

    expect(plan).toContain('The README cleanup itself does **not** justify a package release.');

    expect(plan).toContain(
      'npm presentation will change only with the next otherwise justified normal release',
    );
  });

  it('keeps product truth frozen during cleanup', () => {
    expect(plan).toContain('current verified public release: `handoffprobe@0.4.0`');

    expect(plan).toContain('stable public corpus: **23 attacks**');

    expect(plan).toContain('protocol baseline: A2A 1.0 → MCP 2026-07-28');
  });

  it('keeps the plan linked from the roadmap', () => {
    expect(roadmap).toContain(
      '### Repository cleanup and current-state reconciliation — 2026-09-18',
    );

    expect(roadmap).toContain('`docs/REPOSITORY_CLEANUP_PLAN_20260918.md`');

    expect(roadmap).toContain(
      'Status: **COMPLETE — Cleanup A through Cleanup E completed 2026-09-19.**',
    );

    expect(roadmap).toContain(
      '- [x] compact the root README by removing duplicated long-form material while',
    );
  });
});
