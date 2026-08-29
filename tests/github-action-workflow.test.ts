import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const CHECKOUT_SHA = 'de0fac2e4500dabe0009e67214ff5f5447ce83dd';

function externalUsesEntries(contents: string): string[] {
  return [...contents.matchAll(/^\s*uses:\s*([^\s]+)\s*$/gmu)]
    .map((match) => match[1])
    .filter((entry): entry is string => entry !== undefined && !entry.startsWith('./'));
}

describe('HandoffProbe reference workflow', () => {
  it('runs the local HandoffProbe action on pull requests', async () => {
    const contents = await readFile('.github/workflows/handoffprobe.yml', 'utf8');

    expect(contents).toContain('name: HandoffProbe');
    expect(contents).toContain('pull_request:');
    expect(contents).not.toContain('pull_request_target');
    expect(contents).toContain('permissions:\n  contents: read');
    expect(contents).toContain(`actions/checkout@${CHECKOUT_SHA}`);
    expect(contents).toContain('persist-credentials: false');
  });

  it('invokes the repository action exactly once with the configured target', async () => {
    const contents = await readFile('.github/workflows/handoffprobe.yml', 'utf8');

    const localActionUses = [...contents.matchAll(/^\s*uses:\s*\.\/\s*$/gmu)];

    expect(localActionUses).toHaveLength(1);
    expect(contents).toContain('target: vulnerable');
    expect(contents).toContain('fail-on: high');
    expect(contents).toContain('artifact-name: handoffprobe-report');
    expect(contents).not.toMatch(/^\s*tests:\s*/gmu);
  });

  it('pins every external action to an immutable commit', async () => {
    const contents = await readFile('.github/workflows/handoffprobe.yml', 'utf8');

    for (const entry of externalUsesEntries(contents)) {
      expect(entry).toMatch(/@[0-9a-f]{40}$/u);
    }
  });
});
