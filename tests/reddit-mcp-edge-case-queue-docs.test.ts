import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const queue = readFileSync('docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md', 'utf8');
const candidates = readFileSync('docs/ROADMAP_RESEARCH_CANDIDATES.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');

describe('Reddit MCP edge-case research queue', () => {
  it('freezes both community research tracks without adding stable IDs', () => {
    expect(queue).toContain(
      '# R-1 — token rotation during interrupted handoff / reconnect with stale token',
    );
    expect(queue).toContain('# R-2 — same-name hot deploy / capability drift after approval');
    expect(queue).toContain('Current stable public corpus: **23 attacks**.');
    expect(queue).toContain('no new stable attack ID reserved');
  });

  it('classifies token rotation as an HP-RACE-002 refinement', () => {
    expect(queue).toContain(
      'Status: **EXECUTION COMPLETE — HP-RACE-002 REFINEMENT / NO ADD; public result return NEXT.**',
    );
    expect(queue).toContain(
      '`HP-REPLAY-003 — Retry double execution` governs only if attempt 1 already caused the protected effect',
    );
    expect(queue).toContain('`HP-AUTH-006` concerns a later **distinct protected effect**');
  });

  it('keeps same-name hot deploy admission unresolved', () => {
    expect(queue).toContain('RESEARCH CANDIDATE — ADMISSION UNRESOLVED');
    expect(queue).toContain('`HP-APPROVAL-002 — Tool substitution after approval`');
    expect(queue).toContain('`HP-VERSION-001`');
    expect(queue).toContain('No new `HP-*` ID is reserved.');
  });

  it('records both tracks in the research-candidate index and main roadmap', () => {
    expect(candidates).toContain('## RC-2 — Reddit MCP reconnect token-rotation refinement');
    expect(candidates).toContain('## RC-3 — Reddit same-name capability hot-deploy drift');
    expect(roadmap).toContain('#### Reddit MCP community edge-case queue — 2026-09-18');
    expect(roadmap).toContain(
      'source → overlap → deterministic fixture → protected-effect evidence → admission → merge → Reddit result return → external-response classification → EVIDENCE.md decision',
    );
  });

  it('keeps evidence promotion gated until execution and result return', () => {
    expect(queue).toContain('`EVIDENCE.md` remains unchanged at queue creation.');
    expect(queue).toContain('silence is not agreement or confirmation.');

    expect(evidence).not.toContain('Reddit MCP reconnect token-rotation refinement');
    expect(evidence).not.toContain('Reddit same-name capability hot-deploy drift');
  });
});
