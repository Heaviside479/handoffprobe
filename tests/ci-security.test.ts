import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const CHECKOUT_SHA = 'de0fac2e4500dabe0009e67214ff5f5447ce83dd';
const SETUP_NODE_SHA = '249970729cb0ef3589644e2896645e5dc5ba9c38';
const DEPENDENCY_REVIEW_SHA = 'a1d282b36b6f3519aa1f3fc636f609c47dddb294';

async function workflow(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

function externalUsesEntries(contents: string): string[] {
  return [...contents.matchAll(/^\s*uses:\s*([^\s]+)\s*$/gmu)]
    .map((match) => match[1])
    .filter((entry): entry is string => entry !== undefined && !entry.startsWith('./'));
}

describe('Phase 6 repository workflow security', () => {
  it('pins CI actions to immutable commits with read-only repository access', async () => {
    const contents = await workflow('.github/workflows/ci.yml');

    expect(contents).toContain('permissions:\n  contents: read');
    expect(contents).toContain(`actions/checkout@${CHECKOUT_SHA}`);
    expect(contents).toContain(`actions/setup-node@${SETUP_NODE_SHA}`);
    expect(contents).toContain('persist-credentials: false');
    expect(contents).not.toContain('pull_request_target');

    for (const entry of externalUsesEntries(contents)) {
      expect(entry).toMatch(/@[0-9a-f]{40}$/u);
    }
  });

  it('runs dependency review only on pull requests with a high vulnerability gate', async () => {
    const contents = await workflow('.github/workflows/dependency-review.yml');

    expect(contents).toContain('pull_request:');
    expect(contents).not.toContain('pull_request_target');
    expect(contents).toContain('permissions:\n  contents: read');
    expect(contents).toContain(`actions/checkout@${CHECKOUT_SHA}`);
    expect(contents).toContain(`actions/dependency-review-action@${DEPENDENCY_REVIEW_SHA}`);
    expect(contents).toContain('fail-on-severity: high');
    expect(contents).toContain('fail-on-scopes: runtime, development, unknown');
    expect(contents).toContain('comment-summary-in-pr: never');
    expect(contents).toContain('license-check: false');
    expect(contents).toContain('vulnerability-check: true');

    for (const entry of externalUsesEntries(contents)) {
      expect(entry).toMatch(/@[0-9a-f]{40}$/u);
    }
  });
});
