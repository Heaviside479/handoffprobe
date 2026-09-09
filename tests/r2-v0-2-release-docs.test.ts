import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(path, 'utf8');

describe('v0.2.0 final release documentation', () => {
  const readme = read('README.md');
  const installation = read('docs/INSTALLATION.md');
  const usage = read('docs/USAGE.md');
  const security = read('SECURITY.md');
  const contributing = read('CONTRIBUTING.md');
  const changelog = read('CHANGELOG.md');
  const releaseNotes = read('docs/V0_2_0_RELEASE_NOTES.md');

  it('documents the published v0.2.0 release target', () => {
    expect(readme).toContain('The release package version is `0.2.0`.');
    expect(readme).toContain(
      'Source and package metadata for this release are finalized at `0.2.0`',
    );
    expect(installation).toContain('HandoffProbe `0.2.0` is the release version');
    expect(installation).toContain('source checkout reports');
    expect(releaseNotes).toContain('Status: final release notes for v0.2.0.');
    expect(readme).toContain(
      'HandoffProbe v0.2.0 is publicly available on npm and as a GitHub Release.',
    );
    expect(releaseNotes).toContain('Publication status: completed 2026-09-09.');
  });

  it('preserves the stable v0.2.0 public runtime contract', () => {
    expect(readme).toContain('exactly 22 stable attacks');
    expect(usage).toContain('v0.2.0 preserves exactly 22 stable attacks');
    expect(usage).toContain('preserves report schema version `1`');
    expect(releaseNotes).toContain('CLI exit semantics remain `0 / 1 / 2 / 3`');
  });

  it('keeps Phase 9 research-only at the public runtime boundary', () => {
    expect(readme).toContain(
      'Phase 9 crossing-corpus functionality remains repository research/conformance tooling',
    );
    expect(contributing).toContain(
      'Phase 9 crossing-corpus functionality remains repository research/conformance tooling',
    );
    expect(releaseNotes).toContain(
      'not exposed through the public CLI, package-root API or GitHub Action',
    );
  });

  it('records the v0.2.0 changelog and explicit release-note limitations', () => {
    expect(changelog).toContain('## 0.2.0 — 2026-09-09');
    expect(changelog).toContain('### User-facing product contract');
    expect(changelog).toContain('### Security and maintenance');
    expect(changelog).toContain('### Research and developer experience');
    expect(changelog).toContain('### Limitations');
    expect(releaseNotes).toContain('## Explicit limitations');
    expect(releaseNotes).toContain('`operator_independent` validation');
  });

  it('reconciles security and contributor guidance without claiming publication', () => {
    expect(security).toContain('v0.2.0 release safety boundary');
    expect(contributing).toContain('v0.2.0 public product scope remains deliberately narrow');
    const publicDocs = [readme, installation, usage, security, contributing, releaseNotes].join(
      '\n',
    );
    expect(publicDocs).not.toContain('current public package version is `0.1.1`');
    expect(publicDocs).toContain('handoffprobe@0.2.0');
  });
});
