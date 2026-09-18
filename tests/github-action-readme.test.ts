import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

describe('compact GitHub Action README contract', () => {
  it('keeps the external Action entry point visible', async () => {
    const contents = await readFile('README.md', 'utf8');

    expect(contents).toContain('## GitHub Action');
    expect(contents).toContain('source-backed composite GitHub Action');
    expect(contents).toContain('[`action.yml`](action.yml)');
    expect(contents).toContain('target: secure');
    expect(contents).toContain('fail-on: high');
    expect(contents).toContain('artifact-name: handoffprobe-report');
  });

  it('documents immutable release pinning without recommending main', async () => {
    const contents = await readFile('README.md', 'utf8');

    const releaseState = JSON.parse(await readFile('docs/RELEASE_STATE.json', 'utf8')) as {
      releaseCommit: string;
      version: string;
    };

    expect(contents).toContain(`Heaviside479/handoffprobe@${releaseState.releaseCommit}`);

    expect(contents).toContain(
      `The pin above is the reviewed exact release commit for HandoffProbe v${releaseState.version}.`,
    );

    expect(contents).not.toContain('uses: Heaviside479/handoffprobe@main');
  });

  it('delegates the full Action contract to the canonical specification', async () => {
    const contents = await readFile('README.md', 'utf8');

    expect(contents).toContain('docs/GITHUB_INTEGRATION_SPECIFICATION.md');

    expect(contents).toContain('inputs, outputs, artifact behavior');
  });
});
