import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(path, 'utf8');

describe('v0.3.0 release-candidate contract', () => {
  const readme = read('README.md');
  const installation = read('docs/INSTALLATION.md');
  const usage = read('docs/USAGE.md');
  const security = read('SECURITY.md');
  const contributing = read('CONTRIBUTING.md');
  const changelog = read('CHANGELOG.md');
  const releaseNotes = read('docs/V0_3_0_RELEASE_NOTES.md');

  it('records v0.3.0 as a candidate without claiming publication', () => {
    expect(releaseNotes).toContain('Status: **release candidate — not yet published.**');
    expect(changelog).toContain('## 0.3.0 — release candidate (2026-09-14)');
    expect(readme).toContain('Release-candidate source metadata is **`handoffprobe@0.3.0`**.');
    expect(installation).toContain('HandoffProbe `0.3.0` is the current release candidate');
    expect(readme).not.toContain(
      'HandoffProbe v0.3.0 is publicly available on npm and as a GitHub Release.',
    );
  });

  it('preserves the stable public contract while refining HP-AUTH-001', () => {
    expect(releaseNotes).toContain('exactly **22 stable attacks**');
    expect(releaseNotes).toContain('stable ID `HP-AUTH-001`');
    expect(releaseNotes).toContain('report schema version `1`');
    expect(usage).toContain('v0.3.0 release-candidate contract');
    expect(usage).toContain('effective downstream authority');
  });

  it('keeps current public registry and Action examples on v0.2.0 until publication', () => {
    expect(readme).toContain('currently published npm and GitHub release remains `v0.2.0`');
    expect(installation).toContain('current public npm package remains `handoffprobe@0.2.0`');
    expect(readme).toContain('handoffprobe@0.2.0');
    expect(installation).toContain('handoffprobe@0.2.0');
    expect(usage).toContain('published `v0.2.0` Action pin');
  });

  it('keeps safety and research boundaries explicit', () => {
    expect(security).toContain('v0.3.0 release-candidate safety boundary');
    expect(contributing).toContain('v0.3.0 release-candidate product scope');
    expect(releaseNotes).toContain('T2 Handoff Contract implementation as a shipped capability');
    expect(releaseNotes).toContain('Phase 9 crossing-corpus research/conformance cases');
  });
});
