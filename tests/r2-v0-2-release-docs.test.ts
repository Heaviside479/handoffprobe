import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(path, 'utf8');

describe('v0.2.0 historical release documentation', () => {
  const changelog = read('CHANGELOG.md');
  const releaseNotes = read('docs/V0_2_0_RELEASE_NOTES.md');

  it('preserves the published v0.2.0 release record', () => {
    expect(releaseNotes).toContain('Status: final release notes for v0.2.0.');
    expect(releaseNotes).toContain('Publication status: completed 2026-09-09.');
    expect(releaseNotes).toContain('The public npm package is `handoffprobe@0.2.0`');
    expect(releaseNotes).toContain('GitHub Release is published as `HandoffProbe v0.2.0`');
  });

  it('preserves the v0.2.0 stable public runtime contract as history', () => {
    expect(releaseNotes).toContain('CLI exit semantics remain `0 / 1 / 2 / 3`');
    expect(releaseNotes).toContain('report schema remains version `1`');
    expect(releaseNotes).toContain('22 stable attacks');
    expect(releaseNotes).toContain(
      'not exposed through the public CLI, package-root API or GitHub Action',
    );
  });

  it('preserves the v0.2.0 changelog and limitations', () => {
    expect(changelog).toContain('## 0.2.0 — 2026-09-09');
    expect(changelog).toContain('### User-facing product contract');
    expect(changelog).toContain('### Security and maintenance');
    expect(changelog).toContain('### Research and developer experience');
    expect(changelog).toContain('### Limitations');
    expect(releaseNotes).toContain('## Explicit limitations');
    expect(releaseNotes).toContain('`operator_independent` validation');
  });
});
