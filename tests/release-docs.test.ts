import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

async function read(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

describe('v0.3.0 release-candidate documentation', () => {
  it('keeps the packaged README release-safe across coordinated publication', async () => {
    const readme = await read('README.md');

    expect(readme).toContain('Package release metadata is **`handoffprobe@0.3.0`**.');
    expect(readme).toContain(
      'verify registry availability with `npm view handoffprobe@0.3.0 version`',
    );
    expect(readme).toContain('https://handoffprobe.heaviside-solutions.com');
    expect(readme).toContain('https://handoffprobe.heaviside-solutions.com/security-assessment');
    expect(readme).not.toContain('currently published npm and GitHub release remains `v0.2.0`');
    expect(readme).not.toContain(
      'HandoffProbe v0.3.0 is publicly available on npm and as a GitHub Release.',
    );
  });

  it('documents public v0.2.0 execution and local v0.3.0 candidate execution separately', async () => {
    const installation = await read('docs/INSTALLATION.md');

    for (const text of [
      'Node.js `>=24 <25`',
      'current public npm package remains `handoffprobe@0.2.0`',
      'npm exec --yes --package=handoffprobe@0.2.0 -- handoffprobe --version',
      'npm install --save-dev --save-exact handoffprobe@0.2.0',
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
      'v0.3.0 release-candidate contract',
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

  it('keeps candidate safety, research and publication boundaries explicit', async () => {
    const security = await read('SECURITY.md');
    const contributing = await read('CONTRIBUTING.md');
    const releaseNotes = await read('docs/V0_3_0_RELEASE_NOTES.md');

    expect(security).toContain('v0.3.0 release-candidate safety boundary');
    expect(contributing).toContain('v0.3.0 release-candidate product scope');
    expect(releaseNotes).toContain('release candidate — not yet published');
    expect(releaseNotes).toContain('No new stable attack ID is introduced');
    expect(releaseNotes).toContain('T2 Handoff Contract implementation as a shipped capability');
  });
});
