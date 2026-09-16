import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

async function read(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

describe('R4 v0.4.0 scope and SemVer audit', () => {
  it('classifies the admitted capability as a backward-compatible minor candidate', async () => {
    const audit = await read('docs/R4_V0_4_0_SCOPE_SEMVER_AUDIT_20260916.md');

    expect(audit).toContain(
      'R4 classification: backward-compatible MINOR release candidate → `v0.4.0`',
    );
    expect(audit).toContain('one new stable attack ID is admitted: `HP-AUTH-006`');
    expect(audit).toContain('23 stable attacks total');
    expect(audit).toContain('package version remains `0.3.0` until R4.2');
  });

  it('preserves existing public contract surfaces', async () => {
    const audit = await read('docs/R4_V0_4_0_SCOPE_SEMVER_AUDIT_20260916.md');

    for (const text of [
      'exit semantics: `0 / 1 / 2 / 3`',
      'report schema version `1`',
      'Node policy `>=24 <25`',
      'A2A `1.0` → MCP `2026-07-28`',
      'Apache-2.0 Core license',
    ]) {
      expect(audit).toContain(text);
    }
  });

  it('keeps non-admitted research outside the stable corpus', async () => {
    const audit = await read('docs/R4_V0_4_0_SCOPE_SEMVER_AUDIT_20260916.md');

    expect(audit).toContain('V3');
    expect(audit).toContain('**NO ADD**');
    expect(audit).toContain('#2079');
    expect(audit).toContain('T-2 protocol-neutral contract research');
    expect(audit).toContain('Phase 9 crossing-corpus research/conformance cases');
    expect(audit).toContain('queued T-4 witness-observation research');
  });

  it('protects historical 22-attack records from mechanical rewriting', async () => {
    const audit = await read('docs/R4_V0_4_0_SCOPE_SEMVER_AUDIT_20260916.md');

    expect(audit).toContain(
      'Do **not** mechanically replace every earlier `22 attacks` or `0.3.0` statement.',
    );
    expect(audit).toContain(
      'Historical release and research records must remain historically accurate.',
    );
  });

  it('requires coordinated npm, GitHub, Marketplace and website publication', async () => {
    const audit = await read('docs/R4_V0_4_0_SCOPE_SEMVER_AUDIT_20260916.md');

    for (const text of [
      'public npm package `handoffprobe@0.4.0`',
      'GitHub Release `HandoffProbe v0.4.0`',
      'GitHub Action / GitHub Marketplace presentation',
      'https://handoffprobe.heaviside-solutions.com',
      'https://heaviside-solutions.com',
      'No website should claim v0.4.0 is publicly available before publication is verified',
    ]) {
      expect(audit).toContain(text);
    }
  });
});
