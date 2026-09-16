import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

async function read(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

describe('v0.4.0 release documentation', () => {
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
      'HandoffProbe release metadata is synchronized at `0.4.0`.',
      'npm view handoffprobe@0.4.0 version',
      'npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe --version',
      'npm install --save-dev --save-exact handoffprobe@0.4.0',
      'The v0.4.0 source checkout reports',
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
      'HandoffProbe v0.4.0 contains exactly 23 stable attacks',
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

    expect(releaseNotes).toContain(
      'Status: **v0.4.0 release record — public availability must be verified on the corresponding release surfaces.**',
    );
    expect(releaseNotes).toContain(
      'HP-AUTH-006 — Stale task authorization reused for later effect',
    );
    expect(releaseNotes).toContain('V3: `NO ADD`');
    expect(releaseNotes).toContain('V13: admitted for stable implementation as `HP-AUTH-006`');
    expect(releaseNotes).toContain(
      'At the pre-publication checkpoint on 2026-09-16, npm still exposed `handoffprobe@0.3.0`',
    );
    expect(releaseNotes).toContain('No half-published release state is accepted.');
  });
});
