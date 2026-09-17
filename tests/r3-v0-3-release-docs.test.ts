import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(path, 'utf8');

describe('v0.3.0 published release contract', () => {
  const changelog = read('CHANGELOG.md');
  const releaseNotes = read('docs/V0_3_0_RELEASE_NOTES.md');

  it('preserves v0.3.0 as an immutable historical published release', () => {
    expect(releaseNotes).toContain('Status: **published on 2026-09-14.**');
    expect(changelog).toContain('## 0.3.0 — 2026-09-14');
    expect(releaseNotes).toContain('ef54b950b3ee333c406fa81087685d7f952a028d');
  });

  it('preserves the v0.3.0 stable contract and HP-AUTH-001 refinement in historical records', () => {
    expect(releaseNotes).toContain('exactly **22 stable attacks**');
    expect(releaseNotes).toContain('stable ID `HP-AUTH-001`');
    expect(releaseNotes).toContain('report schema version `1`');
  });

  it('keeps v0.3.0 release identity as historical evidence', () => {
    expect(releaseNotes).toContain('handoffprobe@0.3.0');
  });

  it('keeps historical safety, research and post-publication boundaries explicit', () => {
    expect(releaseNotes).toContain('T2 Handoff Contract implementation as a shipped capability');
    expect(releaseNotes).toContain('Phase 9 crossing-corpus research/conformance cases');
    expect(releaseNotes).toContain('GitHub Marketplace presentation was re-verified on 2026-09-15');
  });
});
