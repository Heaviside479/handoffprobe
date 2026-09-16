import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

async function read(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

describe('v0.4.0 release-candidate documentation', () => {
  it('keeps the packaged README aligned with candidate and public registry truth', async () => {
    const readme = await read('README.md');

    expect(readme).toContain(
      'Release metadata for this source/package is **`handoffprobe@0.4.0`**.',
    );
    expect(readme).toContain('previously published npm release is `handoffprobe@0.3.0`');
    expect(readme).toContain('23 stable attacks total');
    expect(readme).toContain('HP-AUTH-006');
    expect(readme).toContain('https://handoffprobe.heaviside-solutions.com');
    expect(readme).toContain('https://handoffprobe.heaviside-solutions.com/security-assessment');
  });

  it('separates public v0.3.0 execution from local v0.4.0 candidate execution', async () => {
    const installation = await read('docs/INSTALLATION.md');

    for (const text of [
      'Node.js `>=24 <25`',
      'HandoffProbe `0.4.0` is the current source release candidate and is not yet published.',
      'current public npm package remains `handoffprobe@0.3.0`',
      'npm exec --yes --package=handoffprobe@0.3.0 -- handoffprobe --version',
      'npm install --save-dev --save-exact handoffprobe@0.3.0',
      'current v0.4.0 release-candidate source checkout reports',
      'HandoffProbe 0.4.0',
      'npx --yes --package="./$PACKAGE_TARBALL" handoffprobe --version',
      'owned, synthetic or explicitly authorized target',
    ]) {
      expect(installation).toContain(text);
    }
  });

  it('documents the 23-attack stable candidate and preserved contracts', async () => {
    const usage = await read('docs/USAGE.md');

    for (const text of [
      'v0.4.0 release candidate',
      'exactly 23 stable attacks: 12 P0, 10 P1 and 1 additional advanced attack',
      'HP-AUTH-001',
      'HP-AUTH-006',
      'report schema version `1`',
      'handoffprobe test [options]',
      'handoffprobe list',
      'handoffprobe explain <HP-ID>',
      '--reporter json',
      '--output handoffprobe-report.json',
    ]) {
      expect(usage).toContain(text);
    }
  });

  it('keeps release notes explicit about admission and publication boundaries', async () => {
    const releaseNotes = await read('docs/V0_4_0_RELEASE_NOTES.md');

    expect(releaseNotes).toContain('Status: **release candidate — not published.**');
    expect(releaseNotes).toContain(
      'HP-AUTH-006 — Stale task authorization reused for later effect',
    );
    expect(releaseNotes).toContain('V3: `NO ADD`');
    expect(releaseNotes).toContain('V13: admitted for stable implementation as `HP-AUTH-006`');
    expect(releaseNotes).toContain('current public npm release remains `handoffprobe@0.3.0`');
    expect(releaseNotes).toContain('No half-published release state is accepted.');
  });
});
