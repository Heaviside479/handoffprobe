import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(path, 'utf8');

describe('v0.3.0 published release contract', () => {
  const readme = read('README.md');
  const installation = read('docs/INSTALLATION.md');
  const usage = read('docs/USAGE.md');
  const security = read('SECURITY.md');
  const contributing = read('CONTRIBUTING.md');
  const changelog = read('CHANGELOG.md');
  const releaseNotes = read('docs/V0_3_0_RELEASE_NOTES.md');

  it('records v0.3.0 as published with immutable release identity', () => {
    expect(releaseNotes).toContain('Status: **published on 2026-09-14.**');
    expect(changelog).toContain('## 0.3.0 — 2026-09-14');
    expect(readme).toContain('Package release metadata is **`handoffprobe@0.3.0`**.');
    expect(readme).toContain('This README documents the published v0.3.0 release.');
    expect(installation).toContain('HandoffProbe `0.3.0` is the current published release.');
    expect(releaseNotes).toContain('ef54b950b3ee333c406fa81087685d7f952a028d');
  });

  it('preserves the stable public contract while refining HP-AUTH-001', () => {
    expect(releaseNotes).toContain('exactly **22 stable attacks**');
    expect(releaseNotes).toContain('stable ID `HP-AUTH-001`');
    expect(releaseNotes).toContain('report schema version `1`');
    expect(usage).toContain('v0.3.0 release contract');
    expect(usage).toContain('effective downstream authority');
  });

  it('keeps npm, source docs and Action guidance on the published v0.3.0 baseline', () => {
    expect(readme).toContain('handoffprobe@0.3.0');
    expect(readme).toContain('https://handoffprobe.heaviside-solutions.com');
    expect(installation).toContain('current public npm package is `handoffprobe@0.3.0`');
    expect(installation).toContain('handoffprobe@0.3.0');
    expect(usage).toContain('immutable v0.3.0 release pin');
    expect(usage).toContain('ef54b950b3ee333c406fa81087685d7f952a028d');
  });

  it('keeps safety, research and post-publication boundaries explicit', () => {
    expect(security).toContain('v0.3.0 release safety boundary');
    expect(contributing).toContain('v0.3.0 release product scope');
    expect(releaseNotes).toContain('T2 Handoff Contract implementation as a shipped capability');
    expect(releaseNotes).toContain('Phase 9 crossing-corpus research/conformance cases');
    expect(releaseNotes).toContain('Marketplace-specific presentation verification remains open');
  });
});
