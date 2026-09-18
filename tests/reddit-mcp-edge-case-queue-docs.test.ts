import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const queue = readFileSync('docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md', 'utf8');
const candidates = readFileSync('docs/ROADMAP_RESEARCH_CANDIDATES.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');

describe('Reddit MCP edge-case research queue', () => {
  it('tracks both community research cases without pretending both sources are frozen', () => {
    expect(queue).toContain(
      'Status: **ACTIVE — R-1 executed and direct comment source frozen; R-2 queued with exact direct-comment permalink pending.**',
    );
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
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakk8w2/');
    expect(queue).toContain('`05677e5a00c45bcc20abe06b3622a72d4b7aa43b`');
    expect(queue).toContain(
      '- [x] exact Reddit comment permalink recorded before public result return;',
    );
  });

  it('keeps same-name hot deploy admission unresolved', () => {
    expect(queue).toContain('RESEARCH CANDIDATE — ADMISSION UNRESOLVED');
    expect(queue).toContain('`HP-APPROVAL-002 — Tool substitution after approval`');
    expect(queue).toContain('`HP-VERSION-001`');
    expect(queue).toContain('### HP-AUTH-001 — semantic-widening overlap to resolve');
    expect(queue).toContain('### HP-RACE-002 — conditional timing overlap');
    expect(queue).toContain('Exact direct Reddit comment permalink:');
    expect(queue).toContain('**PENDING**');
    expect(queue).toContain(
      '- [ ] exact Reddit comment permalink recorded and source frozen before fixture implementation;',
    );
    expect(queue).toContain('No new `HP-*` ID is reserved.');
  });

  it('records both tracks in the research-candidate index and main roadmap', () => {
    expect(candidates).toContain('## RC-2 — Reddit MCP reconnect token-rotation refinement');
    expect(candidates).toContain('## RC-3 — Reddit same-name capability hot-deploy drift');
    expect(candidates).toContain('Status: **EXECUTION COMPLETE / RESULT RETURN PENDING**');
    expect(candidates).toContain(
      'Status: **QUEUED / DISTINCTNESS UNRESOLVED / SOURCE FREEZE INCOMPLETE**',
    );
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
