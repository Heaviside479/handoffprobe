import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const queue = readFileSync('docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md', 'utf8');
const candidates = readFileSync('docs/ROADMAP_RESEARCH_CANDIDATES.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');

describe('Reddit MCP edge-case research queue', () => {
  it('tracks all three community research cases with truthful source state', () => {
    expect(queue).toContain(
      'Status: **ACTIVE — R-1 public result returned; R-2 source freeze pending; R-3 source frozen and overlap unresolved.**',
    );
    expect(queue).toContain(
      '# R-1 — token rotation during interrupted handoff / reconnect with stale token',
    );
    expect(queue).toContain('# R-2 — same-name hot deploy / capability drift after approval');
    expect(queue).toContain(
      '# R-3 — authorized tenant switch after denial / task-intent target drift',
    );
    expect(queue).toContain('Current stable public corpus: **23 attacks**.');
    expect(queue).toContain('no new stable attack ID reserved');
  });

  it('classifies token rotation as an HP-RACE-002 refinement', () => {
    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE — HP-RACE-002 REFINEMENT / NO ADD; external response PENDING.**',
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

  it('freezes R-3 source while keeping target-drift admission unresolved', () => {
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/');
    expect(queue).toContain(
      "We had the following problem: our agent hit a 403 for a licence it didn't have",
    );
    expect(queue).toContain(
      '### HP-TARGET-001 — closest stable neighbor, but not exact coverage yet',
    );
    expect(queue).toContain('### HP-TENANT-001 — adjacent, not governing on the supplied facts');
    expect(queue).toContain('### HP-APPROVAL-003 — conditional only');
    expect(queue).toContain(
      '### HP-AUTH-001 — not governing if request authority remains narrow and valid',
    );
    expect(queue).toContain('### HP-AUTH-006 — not governing on the supplied facts');
    expect(queue).toContain(
      '### RC-1 — model-mediated mutation discovery is adjacent, not activated by this comment alone',
    );
    expect(queue).toContain('**RESEARCH CANDIDATE — DISTINCTNESS UNRESOLVED**');
    expect(queue).toContain('- [x] source frozen before fixture implementation;');
    expect(queue).toContain(
      '- [ ] final pre-implementation decision: `HP-TARGET-001` refinement vs distinct research fixture;',
    );
  });

  it('records all Reddit tracks in the research-candidate index and main roadmap', () => {
    expect(candidates).toContain('## RC-2 — Reddit MCP reconnect token-rotation refinement');
    expect(candidates).toContain('## RC-3 — Reddit same-name capability hot-deploy drift');
    expect(candidates).toContain('## RC-4 — Reddit authorized tenant switch after denial');
    expect(candidates).toContain(
      'Status: **SOURCE FROZEN / DISTINCTNESS UNRESOLVED / IMPLEMENTATION BLOCKED**',
    );
    expect(candidates).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE / EXTERNAL RESPONSE PENDING**',
    );
    expect(candidates).toContain(
      'Status: **QUEUED / DISTINCTNESS UNRESOLVED / SOURCE FREEZE INCOMPLETE**',
    );
    expect(roadmap).toContain('#### Reddit MCP community edge-case queue — 2026-09-18');
    expect(roadmap).toContain(
      'source → overlap → deterministic fixture → protected-effect evidence → admission → merge → Reddit result return → external-response classification → EVIDENCE.md decision',
    );
    expect(roadmap).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/');
  });

  it('records R-1 as open research after public return without promoting R-2', () => {
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/');
    expect(queue).toContain(
      '- [x] concrete result returned to originating Reddit commenter/thread;',
    );
    expect(queue).toContain('- [x] external response state recorded as PENDING;');
    expect(queue).toContain('silence is not agreement or confirmation.');

    expect(evidence).toContain('## 6. Reddit R-1 token-rotation / reconnect refinement');
    expect(evidence).toContain('**Evidence level:** Open research follow-up');
    expect(evidence).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/');
    expect(evidence).not.toContain('Reddit same-name capability hot-deploy drift');
    expect(evidence).not.toContain('Reddit authorized tenant switch after denial');
  });
});
