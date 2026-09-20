import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

const rootReadme = read('README.md');
const docsIndex = read('docs/README.md');
const installation = read('docs/INSTALLATION.md');
const usage = read('docs/USAGE.md');
const roadmap = read('docs/ROADMAP.md');
const migration = read('docs/MIGRATION.md');
const upgrading = read('docs/UPGRADING.md');
const troubleshooting = read('docs/TROUBLESHOOTING.md');
const faq = read('docs/FAQ.md');
const record = read('docs/P11_5_RELEASE_USER_GUIDANCE_20260920.md');
const packageJson = JSON.parse(read('package.json')) as { version: string };

describe('P11.5 release user guidance', () => {
  it('publishes all four canonical user guides', () => {
    expect(migration).toContain('# Migration guide');
    expect(upgrading).toContain('# Upgrading HandoffProbe');
    expect(troubleshooting).toContain('# Troubleshooting');
    expect(faq).toContain('# Frequently asked questions');
  });

  it('keeps the current release boundary explicit', () => {
    for (const document of [migration, upgrading, troubleshooting, faq]) {
      expect(document).toContain('handoffprobe@0.4.0');
    }

    expect(migration).toContain('23 attacks');
    expect(migration).toContain('report schema version `1`');
    expect(upgrading).toContain('Node.js `>=24 <25`');
    expect(packageJson.version).toBe('0.4.0');
  });

  it('reuses existing release and migration policy instead of replacing it', () => {
    expect(migration).toContain('P10_2_VERSIONED_CONTRACTS_POLICY_20260915.md');
    expect(migration).toContain('V0_4_0_RELEASE_NOTES.md');
    expect(upgrading).toContain('P10_4_DEPENDENCY_UPGRADE_PROCESS_20260919.md');
    expect(record).toContain('does not create a second compatibility policy');
  });

  it('makes the guides discoverable from primary user entry points', () => {
    for (const name of [
      'docs/UPGRADING.md',
      'docs/MIGRATION.md',
      'docs/TROUBLESHOOTING.md',
      'docs/FAQ.md',
    ]) {
      expect(rootReadme).toContain(name);
    }

    for (const name of ['UPGRADING.md', 'MIGRATION.md', 'TROUBLESHOOTING.md', 'FAQ.md']) {
      expect(docsIndex).toContain(`](${name})`);
      expect(installation).toContain(name);
      expect(usage).toContain(name);
    }
  });

  it('records P11.5 without claiming protected completion early', () => {
    expect(roadmap).toContain('### P11.5 — release user guidance');
    expect(roadmap).toContain(
      'Status: **IMPLEMENTATION CANDIDATE — protected validation pending**',
    );
    expect(roadmap).toContain('- [ ] pass protected pull-request validation;');
    expect(roadmap).toContain('- [ ] merge through normal branch protection.');
    expect(record).toContain('Status: **IMPLEMENTATION CANDIDATE — protected validation pending**');
  });

  it('preserves the no-publication boundary', () => {
    expect(record).toContain('change package version');
    expect(record).toContain('stage or publish an npm package');
    expect(record).toContain('create or move a Git tag');
    expect(record).toContain('create a GitHub Release');
  });
});
