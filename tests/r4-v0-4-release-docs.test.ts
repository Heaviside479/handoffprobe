import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(path, 'utf8');

describe('R4 v0.4.0 historical release evidence', () => {
  const notes = read('docs/V0_4_0_RELEASE_NOTES.md');
  const candidate = read('docs/R4_V0_4_0_RELEASE_DOCS_20260916.md');
  const closeout = read('docs/R4_V0_4_0_POSTPUBLICATION_CLOSEOUT_20260917.md');

  it('preserves the pre-publication candidate checkpoint', () => {
    expect(candidate).toContain('Status: **R4.3 CANDIDATE');
    expect(candidate).toContain(
      'current public npm release during preparation: `handoffprobe@0.3.0`',
    );
    expect(candidate).toContain('stable corpus: **23 attacks** = 12 P0 + 10 P1 + 1 advanced');
    expect(candidate).toContain('new stable ID: `HP-AUTH-006`');
    expect(candidate).toContain('Historical v0.1/v0.2/v0.3, Phase 5/6 and T-3 records');
  });

  it('preserves the final released v0.4.0 identity and closeout', () => {
    expect(closeout).toContain('Status: **COMPLETE — 2026-09-17.**');
    expect(closeout).toContain('released package: `handoffprobe@0.4.0`');
    expect(closeout).toContain('release commit: `8ffdbec95e8ebe6fe1db1f3c2151d571461d596d`');
    expect(closeout).toContain('public stable corpus: **23 attacks** = 12 P0 + 10 P1 + 1 advanced');
    expect(closeout).toContain('HP-AUTH-006 — Stale task authorization reused for later effect');
    expect(closeout).toContain('R4 is therefore **COMPLETE**.');
  });

  it('preserves publication and historical-record boundaries', () => {
    expect(notes).toContain(
      'Status: **RELEASED AND VERIFIED — coordinated publication and post-publication verification completed 2026-09-17.**',
    );
    expect(notes).toContain(
      'At the pre-publication checkpoint on 2026-09-16, npm still exposed `handoffprobe@0.3.0`',
    );
    expect(notes).toContain('No half-published release state is accepted.');
    expect(closeout).toContain(
      'Historical documents and roadmap sections that truthfully describe the earlier 22-attack / v0.3.0 state remain historical evidence',
    );
    expect(closeout).toContain('T-4 was not part of the v0.4.0 shipped capability.');
  });
});
