import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const record = readFileSync('docs/MCP_3354_FREEZE_OVERLAP_20260918.md', 'utf8');
const queue = readFileSync('docs/MCP_3354_VERIFIABLE_RESULTS_QUEUE_20260917.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('MCP #3354 freeze and overlap record', () => {
  it('pins the exact external implementation and interpretation input', () => {
    expect(record).toContain('66a959f79802d3751ba7edc0aec4c1c0e0ee2b36');
    expect(record).toContain('1fd2d0c377388e4d8560fe5b38cf2e2a1d895541');
    expect(record).toContain(
      'https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5715753995',
    );
  });

  it('classifies the seam as a refinement rather than a new stable attack', () => {
    expect(record).toContain('Overall MCP #3354 classification:');
    expect(record).toContain('**REFINEMENT**');
    expect(record).toContain('No new stable attack is admitted.');
    expect(record).toContain('The public corpus remains **23 attacks**.');
  });

  it('preserves proof and authorization as separate layers', () => {
    expect(record).toContain(
      '`proof valid for effective request` does not imply `effective request authorized`',
    );
    expect(record).toContain('proof verification result;');
    expect(record).toContain('authority verification result;');
    expect(record).toContain('protected effect observation.');
  });

  it('updates the queue and roadmap without triggering a release', () => {
    expect(queue).toContain('FREEZE / OVERLAP COMPLETE 2026-09-18 — REFINEMENT');
    expect(roadmap).toContain('#### MCP #3354 freeze / overlap decision — 2026-09-18');
    expect(roadmap).toContain('No release or package-version change is triggered.');
  });
});
