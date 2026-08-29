import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const README_PATH = new URL('../README.md', import.meta.url);

async function readReadme(): Promise<string> {
  return readFile(README_PATH, 'utf8');
}

describe('Phase 5 README developer experience gate', () => {
  it('documents the complete stable CLI surface', async () => {
    const readme = await readReadme();

    for (const text of [
      '22 stable attacks total',
      'handoffprobe test [options]',
      'handoffprobe list',
      'handoffprobe explain <HP-ID>',
      'handoffprobe --version',
      'handoffprobe --help',
    ]) {
      expect(readme).toContain(text);
    }
  });

  it('documents secure, vulnerable and severity workflows', async () => {
    const readme = await readReadme();

    for (const text of [
      'Target: secure',
      '--target vulnerable',
      '--test HP-AUTH-001',
      '--fail-on medium',
      'info < low < medium < high < critical',
    ]) {
      expect(readme).toContain(text);
    }
  });

  it('documents config, reporters and output', async () => {
    const readme = await readReadme();

    for (const text of [
      'handoffprobe.config.json',
      '--reporter terminal',
      '--reporter json',
      '--reporter markdown',
      '--output handoffprobe-report.json',
      'CLI flags override config values.',
    ]) {
      expect(readme).toContain(text);
    }
  });

  it('documents exit codes, redaction and troubleshooting', async () => {
    const readme = await readReadme();

    for (const text of [
      'ERROR is never converted into vulnerability exit code `1`',
      '## Security and redaction',
      '## Troubleshooting',
      'A2A 1.0 → MCP 2026-07-28',
    ]) {
      expect(readme).toContain(text);
    }

    for (const exitCode of ['0', '1', '2', '3']) {
      expect(readme).toMatch(new RegExp(`\\|\\s+\`${exitCode}\`\\s+\\|`, 'u'));
    }
  });

  it('documents packaged npx execution without claiming a public release', async () => {
    const readme = await readReadme();

    expect(readme).toContain(`PACKAGE_TARBALL="$(npm pack --silent)"`);

    expect(readme).toContain(`npx --yes --package="./$PACKAGE_TARBALL" handoffprobe test`);

    expect(readme).toContain('npx handoffprobe test');
    expect(readme).toContain('not publicly released yet');
  });
});
