import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(path, 'utf8');

describe('R4.3 v0.4.0 release-document reconciliation', () => {
  const readme = read('README.md');
  const installation = read('docs/INSTALLATION.md');
  const usage = read('docs/USAGE.md');
  const changelog = read('CHANGELOG.md');
  const catalog = read('docs/ATTACK_CATALOG.md');
  const cliSpec = read('docs/CLI_SPECIFICATION.md');
  const roadmap = read('docs/ROADMAP.md');
  const notes = read('docs/V0_4_0_RELEASE_NOTES.md');
  const record = read('docs/R4_V0_4_0_RELEASE_DOCS_20260916.md');

  it('aligns the current candidate on 23 stable attacks and HP-AUTH-006', () => {
    for (const text of [readme, usage, changelog, catalog, cliSpec, roadmap, notes, record]) {
      expect(text).toContain('HP-AUTH-006');
    }

    expect(readme).toContain('23 stable attacks total');
    expect(usage).toContain('exactly 23 stable attacks');
    expect(changelog).toContain('22 to 23 attacks');
    expect(cliSpec).toContain('23 stable attacks');
    expect(roadmap).toContain('23 attacks');
    expect(notes).toContain('22 to 23 attacks');
  });

  it('preserves 12 P0 plus 10 P1 plus one advanced classification', () => {
    expect(readme).toContain('1 additional stable advanced attack (`HP-AUTH-006`)');
    expect(usage).toContain('12 P0, 10 P1 and 1 additional advanced attack');
    expect(changelog).toContain('12 P0 + 10 P1 + 1 advanced');
    expect(notes).toContain('12 P0;');
    expect(notes).toContain('10 P1;');
    expect(notes).toContain('1 advanced (`HP-AUTH-006`)');
  });

  it('keeps candidate metadata separate from current public npm truth', () => {
    expect(readme).toContain(
      'Release metadata for this source/package is **`handoffprobe@0.4.0`**.',
    );
    expect(readme).toContain('previously published npm release is `handoffprobe@0.3.0`');
    expect(installation).toContain('current public npm package remains `handoffprobe@0.3.0`');
    expect(notes).toContain('current public npm release remains `handoffprobe@0.3.0`');
    expect(notes).toContain('no `v0.4.0` immutable tag is claimed');
  });

  it('protects historical 22-attack records from mechanical rewriting', () => {
    expect(cliSpec).toContain('The Phase 5 completion record above is historical');
    expect(cliSpec).toContain('all 22 stable attacks');
    expect(roadmap).toContain(
      'Stable corpus remains 22 attacks; package version remains `0.3.0`; T-3 completion does not authorize a release.',
    );
    expect(record).toContain('Historical v0.1/v0.2/v0.3, Phase 5/6 and T-3 records');
  });

  it('requires coordinated publication including npm, Marketplace and both websites', () => {
    for (const text of [
      'public npm `handoffprobe@0.4.0`',
      'reusable GitHub Action / Marketplace presentation',
      'dedicated HandoffProbe product site',
      'HandoffProbe project page on Heaviside Solutions',
      'No half-published release state is accepted.',
    ]) {
      expect(notes).toContain(text);
    }

    expect(roadmap).toContain('https://handoffprobe.heaviside-solutions.com');
    expect(roadmap).toContain('https://heaviside-solutions.com');
  });
});
