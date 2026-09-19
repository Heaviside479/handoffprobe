import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

describe('P10.4 platform CI candidate', () => {
  it('defines Linux and macOS quality jobs with the same Node 24 gates', () => {
    const contents = readFileSync('.github/workflows/ci.yml', 'utf8');

    expect(contents).toContain('name: Quality (${{ matrix.os }})');
    expect(contents).toContain('- ubuntu-latest');
    expect(contents).toContain('- macos-latest');
    expect(contents).toContain('runs-on: ${{ matrix.os }}');
    expect(contents).toContain('fail-fast: false');
    expect(contents).toContain('node-version: 24');
    expect(contents).toContain('run: npm ci');
    expect(contents).toContain('run: npm run check');
    expect(contents).toContain('run: npm run package:check');
  });
});
