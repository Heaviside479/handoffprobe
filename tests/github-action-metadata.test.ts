import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const SETUP_NODE_SHA = '249970729cb0ef3589644e2896645e5dc5ba9c38';
const UPLOAD_ARTIFACT_SHA = '043fb46d1a93c77aae656e7c1c64a875d1fc6a0a';

function externalUsesEntries(contents: string): string[] {
  return [...contents.matchAll(/^\s*uses:\s*([^\s]+)\s*$/gmu)]
    .map((match) => match[1])
    .filter((entry): entry is string => entry !== undefined && !entry.startsWith('./'));
}

describe('HandoffProbe action metadata', () => {
  it('defines the locked Phase 6 input and output surface', async () => {
    const contents = await readFile('action.yml', 'utf8');

    expect(contents).toContain('using: composite');
    expect(contents).toContain('target:');
    expect(contents).toContain('tests:');
    expect(contents).toContain('fail-on:');
    expect(contents).toContain('artifact-name:');
    expect(contents).toContain('default: secure');
    expect(contents).toContain('default: high');
    expect(contents).toContain('default: handoffprobe-report');
    expect(contents).toContain('exit-code:');
    expect(contents).toContain('result:');
    expect(contents).toContain('report-path:');
    expect(contents).toContain('summary-path:');
  });

  it('uses immutable external action pins and the action source directory', async () => {
    const contents = await readFile('action.yml', 'utf8');

    expect(contents).toContain(`actions/setup-node@${SETUP_NODE_SHA}`);
    expect(contents).toContain(`actions/upload-artifact@${UPLOAD_ARTIFACT_SHA}`);
    expect(contents).toContain('npm ci --ignore-scripts --no-audit --no-fund');
    expect(contents).toContain('node "$GITHUB_ACTION_PATH/dist/github-action/run-action.js"');

    for (const entry of externalUsesEntries(contents)) {
      expect(entry).toMatch(/@[0-9a-f]{40}$/u);
    }
  });

  it('does not interpolate action inputs directly into shell commands', async () => {
    const contents = await readFile('action.yml', 'utf8');

    expect(contents).not.toMatch(/run:[^\n]*\$\{\{\s*inputs\./u);
    expect(contents).not.toContain('pull_request_target');
    expect(contents).toContain('HANDOFFPROBE_ACTION_TARGET: ${{ inputs.target }}');
    expect(contents).toContain('HANDOFFPROBE_EXIT_CODE: ${{ steps.scan.outputs.exit-code }}');
  });
});
