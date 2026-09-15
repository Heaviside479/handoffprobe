import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

async function read(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

describe('v0.3.0 published documentation', () => {
  it('keeps the packaged README aligned with the published release', async () => {
    const readme = await read('README.md');

    expect(readme).toContain('Package release metadata is **`handoffprobe@0.3.0`**.');
    expect(readme).toContain('This README documents the published v0.3.0 release.');
    expect(readme).toContain('https://handoffprobe.heaviside-solutions.com');
    expect(readme).toContain('https://handoffprobe.heaviside-solutions.com/security-assessment');
    expect(readme).not.toContain('During coordinated publication');
  });

  it('documents public v0.3.0 execution and local packaged execution consistently', async () => {
    const installation = await read('docs/INSTALLATION.md');

    for (const text of [
      'Node.js `>=24 <25`',
      'current public npm package is `handoffprobe@0.3.0`',
      'npm exec --yes --package=handoffprobe@0.3.0 -- handoffprobe --version',
      'npm install --save-dev --save-exact handoffprobe@0.3.0',
      'HandoffProbe 0.3.0',
      'npx --yes --package="./$PACKAGE_TARBALL" handoffprobe --version',
      'owned, synthetic or explicitly authorized target',
    ]) {
      expect(installation).toContain(text);
    }
  });

  it('documents the preserved stable CLI and v0.3.0 semantic-authority behavior', async () => {
    const usage = await read('docs/USAGE.md');

    for (const text of [
      'v0.3.0 release contract',
      '22 stable attacks: 12 P0 and 10 P1',
      'HP-AUTH-001',
      'effective downstream authority',
      'schema version `1`',
      'handoffprobe test [options]',
      'handoffprobe list',
      'handoffprobe explain <HP-ID>',
      '--reporter json',
      '--output handoffprobe-report.json',
    ]) {
      expect(usage).toContain(text);
    }
  });

  it('keeps safety, research and publication boundaries explicit', async () => {
    const security = await read('SECURITY.md');
    const contributing = await read('CONTRIBUTING.md');
    const releaseNotes = await read('docs/V0_3_0_RELEASE_NOTES.md');

    expect(security).toContain('v0.3.0 release safety boundary');
    expect(contributing).toContain('v0.3.0 release product scope');
    expect(releaseNotes).toContain('Status: **published on 2026-09-14.**');
    expect(releaseNotes).toContain('No new stable attack ID is introduced by this release.');
    expect(releaseNotes).toContain('T2 Handoff Contract implementation as a shipped capability');
  });
});
