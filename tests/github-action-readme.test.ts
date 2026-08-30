import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

describe('GitHub Action README contract', () => {
  it('documents the source-backed action and secure self-test', async () => {
    const contents = await readFile('README.md', 'utf8');

    expect(contents).toContain('## GitHub Action');
    expect(contents).toContain('source-backed composite GitHub Action');
    expect(contents).toContain('GITHUB_ACTION_PATH');
    expect(contents).toContain('uses: ./');
    expect(contents).toContain('target: secure');
    expect(contents).toContain('fail-on: high');
    expect(contents).toContain('artifact-name: handoffprobe-report');
  });

  it('documents external immutable revision pinning without recommending main', async () => {
    const contents = await readFile('README.md', 'utf8');

    expect(contents).toContain(
      'Heaviside479/handoffprobe@90fdd691b390c420e3288383ad7efa7e0fb69e6f',
    );
    expect(contents).toContain(
      'The pin above is the reviewed immutable commit for HandoffProbe v0.1.0.',
    );
    expect(contents).not.toContain('uses: Heaviside479/handoffprobe@main');
  });

  it('documents action inputs, outputs and exit semantics', async () => {
    const contents = await readFile('README.md', 'utf8');

    for (const input of ['`target`', '`tests`', '`fail-on`', '`artifact-name`']) {
      expect(contents).toContain(input);
    }

    for (const output of ['`exit-code`', '`result`', '`report-path`', '`summary-path`']) {
      expect(contents).toContain(output);
    }

    expect(contents).toContain(
      'exit code `1` means the scan completed correctly and found a qualifying vulnerability',
    );
    expect(contents).toContain('exit code `2` means usage or configuration failure');
    expect(contents).toContain('exit code `3` means scanner, runtime or output failure');
  });

  it('documents the protected repository merge gate', async () => {
    const contents = await readFile('README.md', 'utf8');

    expect(contents).toContain(
      'The protected `main` branch of this repository currently requires:',
    );
    expect(contents).toContain('`HandoffProbe`');
    expect(contents).toContain('`Quality`');
    expect(contents).toContain('`Dependency Review`');
    expect(contents).toContain('security failure blocks a non-draft pull request');
    expect(contents).toContain('docs/GITHUB_INTEGRATION_SPECIFICATION.md');
  });
});
