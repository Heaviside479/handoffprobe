import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { VERSION } from '../src/index.js';

async function read(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

describe('R4 v0.4.0 version synchronization', () => {
  it('synchronizes candidate package and exported versions', async () => {
    const manifest = JSON.parse(await read('package.json')) as { version: string };
    const lock = JSON.parse(await read('package-lock.json')) as {
      version: string;
      packages?: Record<string, { version?: string }>;
    };

    expect(manifest.version).toBe('0.4.0');
    expect(lock.version).toBe('0.4.0');
    expect(lock.packages?.['']?.version).toBe('0.4.0');
    expect(VERSION).toBe('0.4.0');
  });

  it('synchronizes terminal, JSON and Markdown reporter version expectations', async () => {
    const reporters = await read('tests/cli-reporters.test.ts');
    const record = await read('docs/R4_V0_4_0_VERSION_SYNC_20260916.md');

    expect(reporters).toContain("expect(first).toContain('Version: 0.4.0');");
    expect(reporters).toContain("expect(parsed.handoffProbeVersion).toBe('0.4.0');");
    expect(reporters).toContain("expect(first).toContain('- Version: 0.4.0');");

    expect(record).toContain('terminal, JSON and Markdown reporter version expectations');
  });

  it('records candidate rather than publication state', async () => {
    const record = await read('docs/R4_V0_4_0_VERSION_SYNC_20260916.md');

    expect(record).toContain(
      'R4.2 COMPLETE — candidate version metadata synchronized to `0.4.0`; nothing published or tagged.',
    );
    expect(record).toContain('public npm version remains `handoffprobe@0.3.0` until publication');
    expect(record).toContain('no `v0.4.0` tag exists as part of this step');
    expect(record).toContain(
      'no website is allowed to claim that v0.4.0 is publicly available yet',
    );
  });

  it('keeps the admitted 23-attack capability tied to this candidate', async () => {
    const record = await read('docs/R4_V0_4_0_VERSION_SYNC_20260916.md');

    expect(record).toContain('HP-AUTH-006 — Stale task authorization reused for later effect');
    expect(record).toContain('canonical stable corpus: **23 attacks**');
    expect(record).toContain('protocol baseline remains A2A 1.0 → MCP 2026-07-28');
  });
});
