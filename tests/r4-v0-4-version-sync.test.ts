import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

async function read(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

describe('R4 v0.4.0 historical version synchronization', () => {
  it('preserves the historical v0.4.0 candidate synchronization record', async () => {
    const record = await read('docs/R4_V0_4_0_VERSION_SYNC_20260916.md');

    expect(record).toContain(
      'R4.2 COMPLETE — candidate version metadata synchronized to `0.4.0`; nothing published or tagged.',
    );
    expect(record).toContain('source candidate version: `0.4.0`');
    expect(record).toContain('public npm version remains `handoffprobe@0.3.0` until publication');
  });

  it('preserves historical reporter-version synchronization evidence', async () => {
    const record = await read('docs/R4_V0_4_0_VERSION_SYNC_20260916.md');

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

  it('keeps the admitted 23-attack capability tied to the historical candidate', async () => {
    const record = await read('docs/R4_V0_4_0_VERSION_SYNC_20260916.md');

    expect(record).toContain('HP-AUTH-006 — Stale task authorization reused for later effect');
    expect(record).toContain('canonical stable corpus: **23 attacks**');
    expect(record).toContain('protocol baseline remains A2A 1.0 → MCP 2026-07-28');
  });
});
