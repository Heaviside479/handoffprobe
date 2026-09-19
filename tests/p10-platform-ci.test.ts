import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

describe('P10.4 platform CI candidate', () => {
  it('defines Linux, macOS and Windows quality jobs with the same Node 24 gates', () => {
    const contents = readFileSync('.github/workflows/ci.yml', 'utf8');

    expect(contents).toContain('name: Quality (${{ matrix.os }})');
    expect(contents).toContain('- ubuntu-latest');
    expect(contents).toContain('- macos-latest');
    expect(contents).toContain('- windows-latest');
    expect(contents).toContain('runs-on: ${{ matrix.os }}');
    expect(contents).toContain('fail-fast: false');
    expect(contents).toContain('node-version: 24');
    expect(contents).toContain('run: npm ci');
    expect(contents).toContain('run: npm run check');
    expect(contents).toContain('run: npm run package:check');
  });

  it('pins repository text checkouts to LF for cross-platform formatting', () => {
    const attributes = readFileSync('.gitattributes', 'utf8');

    expect(attributes.trim()).toBe('* text=auto eol=lf');
  });

  it('records successful GitHub-hosted Windows admission evidence', () => {
    const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
    const record = readFileSync('docs/P10_4_WINDOWS_CI_20260919.md', 'utf8');
    const installation = readFileSync('docs/INSTALLATION.md', 'utf8');
    const compatibility = readFileSync('docs/P10_1_COMPATIBILITY_BASELINE_20260915.md', 'utf8');

    expect(roadmap).toContain(
      '- [x] add Windows CI where practical and explicitly document exclusions where not;',
    );
    expect(record).toContain(
      'Status: **COMPLETE — GitHub-hosted Windows validation passed 2026-09-19**',
    );
    expect(record).toContain(
      'https://github.com/Heaviside479/handoffprobe/actions/runs/35463848235',
    );
    expect(record).toContain('`Quality (windows-latest)`: success');
    expect(record).toContain('`Quality (macos-latest)`: success');
    expect(record).toContain('`Quality (ubuntu-latest)`: success');
    expect(installation).toContain(
      'Windows is CI-verified on GitHub-hosted `windows-latest` with Node 24',
    );
    expect(compatibility).toContain('GitHub-hosted `windows-latest` + Node 24');
    expect(compatibility).toContain(
      'native Windows compatibility for the reusable composite GitHub Action is not claimed',
    );
  });

  it('records successful GitHub-hosted macOS admission evidence', () => {
    const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
    const record = readFileSync('docs/P10_4_MACOS_CI_20260919.md', 'utf8');
    const installation = readFileSync('docs/INSTALLATION.md', 'utf8');

    expect(roadmap).toContain('- [x] add macOS CI coverage;');
    expect(record).toContain(
      'Status: **COMPLETE — GitHub-hosted macOS validation passed 2026-09-19**',
    );
    expect(record).toContain(
      'https://github.com/Heaviside479/handoffprobe/actions/runs/35461542344',
    );
    expect(record).toContain('`Quality (macos-latest)`: success');
    expect(record).toContain('`Quality (ubuntu-latest)`: success');
    expect(installation).toContain(
      'macOS is CI-verified on GitHub-hosted `macos-latest` with Node 24',
    );
  });
});
