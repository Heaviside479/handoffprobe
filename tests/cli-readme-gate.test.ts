import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const README_PATH = new URL('../README.md', import.meta.url);

async function readReadme(): Promise<string> {
  return readFile(README_PATH, 'utf8');
}

describe('compact README developer experience contract', () => {
  it('keeps current release and protocol truth visible', async () => {
    const readme = await readReadme();

    for (const text of [
      'handoffprobe@0.4.0',
      'handoffprobe@1.0.0-rc.2',
      '23 stable attacks total',
      'HP-AUTH-006',
      'A2A 1.0 → MCP 2026-07-28',
      'Report schema',
      'Node.js',
    ]) {
      expect(readme).toContain(text);
    }
  });

  it('keeps the stable CLI surface while delegating detailed reference material', async () => {
    const readme = await readReadme();

    for (const text of [
      'handoffprobe test [options]',
      'handoffprobe list',
      'handoffprobe explain <HP-ID>',
      'handoffprobe --version',
      'handoffprobe --help',
      'docs/USAGE.md',
      'docs/CLI_SPECIFICATION.md',
      'docs/INSTALLATION.md',
    ]) {
      expect(readme).toContain(text);
    }
  });

  it('keeps the secure quick start and vulnerable demonstration', async () => {
    const readme = await readReadme();

    expect(readme).toContain('npm exec --yes --package=handoffprobe@0.4.0 -- handoffprobe test');

    expect(readme).toContain('Target: secure');
    expect(readme).toContain('PASS: 23');

    expect(readme).toContain('handoffprobe test --target vulnerable --test HP-AUTH-001');

    expect(readme).toContain('Security gate: FAIL');
  });

  it('makes the public v1 prerelease feedback route explicit', async () => {
    const readme = await readReadme();

    expect(readme).toContain('### v1 prerelease feedback');
    expect(readme).toContain('https://github.com/Heaviside479/handoffprobe/issues/168');
    expect(readme).toContain('Share v1 prerelease feedback');
    expect(readme).toContain(
      'Security-sensitive reports must follow [`SECURITY.md`](SECURITY.md).',
    );
  });

  it('does not duplicate the complete CLI manual in the root README', async () => {
    const readme = await readReadme();

    expect(Buffer.byteLength(readme, 'utf8')).toBeLessThan(12_000);

    for (const removedHeading of [
      '## Configuration',
      '## Reporters',
      '## Output files',
      '## Exit codes',
      '## Troubleshooting',
      '## Command reference',
    ]) {
      expect(readme).not.toContain(removedHeading);
    }
  });

  it('keeps release-channel metadata publication-safe', async () => {
    const readme = await readReadme();

    expect(readme).toContain('Stable npm channel (`latest`) | `handoffprobe@0.4.0`');
    expect(readme).toContain('handoffprobe@1.0.0-rc.2');
    expect(readme).toContain('npm view handoffprobe dist-tags --json');
    expect(readme).toContain(
      '`handoffprobe@1.0.0-rc.1` completed the real npm staged Trusted Publishing path',
    );

    expect(readme).not.toContain('not yet published');
    expect(readme).not.toContain('unpublished release candidate');
    expect(readme).not.toContain(
      'No npm stage, npm publication, prerelease tag or GitHub Release has been created',
    );
  });
});
