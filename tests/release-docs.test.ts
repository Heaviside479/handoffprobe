import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

async function read(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

describe('v0.1 installation and usage documentation', () => {
  it('keeps README accurate after the public release', async () => {
    const readme = await read('README.md');

    expect(readme).toContain('The npm package is publicly available as **`handoffprobe@0.1.0`**.');
    expect(readme).toContain('current public package version is `0.1.0`');
    expect(readme).toContain('docs/INSTALLATION.md');
    expect(readme).toContain('docs/USAGE.md');
    expect(readme).toContain('npx --yes --package=handoffprobe@0.1.0 handoffprobe --version');
    expect(readme).toContain('npx --yes --package=handoffprobe@0.1.0 handoffprobe test');
  });

  it('documents source, tarball and public npm installation', async () => {
    const installation = await read('docs/INSTALLATION.md');

    for (const text of [
      'Node.js `>=24 <25`',
      'The npm package is publicly available as `handoffprobe@0.1.0`.',
      'npm ci',
      'npm run build',
      'PACKAGE_TARBALL="$(npm pack --silent)"',
      'npx --yes --package="./$PACKAGE_TARBALL" handoffprobe --version',
      'npx --yes --package=handoffprobe@0.1.0 handoffprobe --version',
      'npm install --save-dev handoffprobe@0.1.0',
      'owned, synthetic or explicitly authorized target',
    ]) {
      expect(installation).toContain(text);
    }
  });

  it('documents the complete stable CLI and automation surface', async () => {
    const usage = await read('docs/USAGE.md');

    for (const text of [
      'handoffprobe test [options]',
      'handoffprobe list',
      'handoffprobe explain <HP-ID>',
      '--target vulnerable',
      '--test HP-AUTH-001',
      '--fail-on medium',
      '--reporter terminal',
      '--reporter json',
      '--reporter markdown',
      '--output handoffprobe-report.json',
      'handoffprobe.config.json',
      'CLI flags override configuration values.',
      'schema version `1`',
      '22 stable attacks: 12 P0 and 10 P1',
    ]) {
      expect(usage).toContain(text);
    }
  });

  it('documents exit semantics, redaction and the composition-safety demo', async () => {
    const usage = await read('docs/USAGE.md');

    for (const exitCode of ['0', '1', '2', '3']) {
      expect(usage).toMatch(new RegExp('\\|\\s+`' + exitCode + '`\\s+\\|', 'u'));
    }

    expect(usage).toContain('Exit `1` is a security finding, not a scanner crash.');
    expect(usage).toContain('safe evidence counts and deterministic sequence references');
    expect(usage).toContain('upstream A2A authority can be individually valid');
    expect(usage).toContain(
      'downstream MCP tool behavior can be individually valid under correct authority',
    );
    expect(usage).toContain(
      'translation/handoff can still broaden the effective authority incorrectly',
    );
  });
});
