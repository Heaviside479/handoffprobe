import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const queue = readFileSync('docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md', 'utf8');
const candidates = readFileSync('docs/ROADMAP_RESEARCH_CANDIDATES.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');

describe('Reddit MCP edge-case research queue', () => {
  it('tracks all four community research cases with truthful source state', () => {
    expect(queue).toContain(
      'Status: **ACTIVE — R-1, R-2, R-3 and R-4 public results returned; external responses pending.**',
    );
    expect(queue).toContain(
      '# R-1 — token rotation during interrupted handoff / reconnect with stale token',
    );
    expect(queue).toContain('# R-2 — same-name hot deploy / capability drift after approval');
    expect(queue).toContain(
      '# R-3 — authorized tenant switch after denial / task-intent target drift',
    );
    expect(queue).toContain('# R-4 — x402 paid-retry binding / request mutation after 402');
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paxkn52/');
    expect(queue).toContain('`4e99e87da0ccdf3ddcf067958de6b59eb4134414`');
    expect(queue).toContain('**PROTOCOL SEMANTICS / NO ADD**');
    expect(queue).toContain('A live x402 payment is outside the R-4 research boundary.');
    expect(queue).toContain('All R-4 execution must remain local and synthetic.');
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

  it('freezes R-2 as an HP-APPROVAL-002 refinement before execution', () => {
    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE — HP-APPROVAL-002 REFINEMENT / NO ADD; external response PENDING.**',
    );
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakp67i/');
    expect(queue).toContain('### HP-APPROVAL-002 — governing stable invariant');
    expect(queue).toContain('### HP-VERSION-001 — adjacent backlog, not governing');
    expect(queue).toContain('### HP-AUTH-001 — deliberately neutralized in the primary fixture');
    expect(queue).toContain('### HP-RACE-002 — excluded from the primary fixture');
    expect(queue).toContain('`["same-name-tool", "schema-v1", "read_only"]`');
    expect(queue).toContain('`["same-name-tool", "schema-v1", "protected_write"]`');
    expect(queue).toContain('`JSON.stringify([toolName, inputSchemaId, effectClass])`');
    expect(queue).toContain('**HP-APPROVAL-002 REFINEMENT / NO ADD**');
    expect(queue).toContain('- [x] source frozen before fixture implementation;');
    expect(queue).toContain('- [x] deterministic fixture implemented;');
    expect(queue).toContain('The stable public corpus remains **23 attacks**.');
  });

  it('freezes R-3 as an HP-TARGET-001 refinement before implementation', () => {
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/');
    expect(queue).toContain(
      "We had the following problem: our agent hit a 403 for a licence it didn't have",
    );
    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE — HP-TARGET-001 REFINEMENT / NO ADD; external response PENDING.**',
    );
    expect(queue).toContain('### HP-TARGET-001 — governing stable invariant');
    expect(queue).toContain('**HP-TARGET-001 REFINEMENT / NO ADD**');
    expect(queue).toContain('`[["tenant:A", "resource:A"]]`');
    expect(queue).toContain('`[["tenant:A", "resource:A"], ["tenant:B", "resource:B"]]`');
    expect(queue).toContain('request-level authorization for B: `ACCEPT`');
    expect(queue).toContain('task-target continuity: `MISMATCH`');
    expect(queue).toContain(
      '- [x] exact upstream task/intent target-binding representation frozen;',
    );
    expect(queue).toContain(
      '- [x] exact independently authorized alternate-target representation frozen;',
    );
    expect(queue).toContain(
      '- [x] deterministic `403 → visible targets → target switch → retry` sequence frozen;',
    );
    expect(queue).toContain('- [x] positive control for an explicitly multi-target task frozen;');
    expect(queue).toContain(
      '- [x] final pre-implementation decision: `HP-TARGET-001 REFINEMENT / NO ADD`;',
    );
    expect(queue).toContain('- [x] deterministic fixture implemented;');
    expect(queue).toContain('- [x] secure result reproduced;');
    expect(queue).toContain('- [x] intentionally vulnerable result reproduced;');
    expect(queue).toContain('- [x] protected-effect evidence recorded;');
    expect(queue).toContain(
      '- [x] normal admission decision completed as `HP-TARGET-001 REFINEMENT / NO ADD`;',
    );
  });

  it('freezes R-4 x402 semantics and overlap before local execution', () => {
    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE — PROTOCOL SEMANTICS / NO ADD; external response PENDING.**',
    );
    expect(queue).toContain('`agents@0.21.0`');
    expect(queue).toContain('`@x402/core@2.24.0`');
    expect(queue).toContain('`@x402/evm@2.24.0`');
    expect(queue).toContain(
      'It does not by itself establish a cryptographic or protocol-level binding',
    );
    expect(queue).toContain(
      '### HP-APPROVAL-001 — adjacent when explicit request consent exists, not governing here',
    );
    expect(queue).toContain('## Final pre-implementation classification');
    expect(queue).toContain('**PROTOCOL SEMANTICS / NO ADD**');
    expect(queue).toContain('### Positive control — unchanged paid retry');
    expect(queue).toContain('### Protocol-only mutation control');
    expect(queue).toContain('`EXPECTED X402-ONLY SEMANTICS`');
    expect(queue).toContain('### Request-bound composition control');
    expect(queue).toContain('- [x] verify x402 protocol/library payment-binding semantics;');
    expect(queue).toContain('- [x] complete final overlap review;');
    expect(queue).toContain('- [x] freeze the minimal deterministic fixture;');
    expect(queue).toContain('Stable public corpus remains **23 attacks**.');
  });

  it('records all Reddit tracks in the research-candidate index and main roadmap', () => {
    expect(candidates).toContain('## RC-2 — Reddit MCP reconnect token-rotation refinement');
    expect(candidates).toContain('## RC-3 — Reddit same-name capability hot-deploy drift');
    expect(candidates).toContain('## RC-4 — Reddit authorized tenant switch after denial');
    expect(candidates).toContain('## RC-5 — Reddit x402 paid-retry binding after 402');
    expect(candidates).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE / PROTOCOL SEMANTICS / NO ADD / EXTERNAL RESPONSE PENDING**',
    );
    expect(candidates).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE / EXTERNAL RESPONSE PENDING**',
    );
    expect(candidates).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE / EXTERNAL RESPONSE PENDING**',
    );
    expect(candidates).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE / EXTERNAL RESPONSE PENDING**',
    );
    expect(roadmap).toContain('#### Reddit MCP community edge-case queue — 2026-09-18');
    expect(roadmap).toContain(
      'source → overlap → deterministic fixture → protected-effect evidence → admission → merge → Reddit result return → external-response classification → EVIDENCE.md decision',
    );
    expect(roadmap).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakp67i/');
    expect(roadmap).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakw6a1/');
    expect(roadmap).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paxkn52/');
    expect(roadmap).toContain(
      'PUBLIC RESULT RETURN COMPLETE / PROTOCOL SEMANTICS / NO ADD / EXTERNAL RESPONSE PENDING',
    );
  });

  it('records R-1, R-2, R-3 and R-4 as open research after public result return', () => {
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/');
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paly9up/');
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pam978h/');
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pay1b51/');

    expect(queue).toContain(
      '- [x] concrete result returned to originating Reddit commenter/thread;',
    );
    expect(queue).toContain('- [x] external response state recorded as PENDING;');
    expect(queue).toContain('Silence is not agreement or confirmation.');

    expect(evidence).toContain('## 6. Reddit R-1 token-rotation / reconnect refinement');
    expect(evidence).toContain('## 7. Reddit R-2 same-name capability hot-deploy refinement');
    expect(evidence).toContain(
      '## 8. Reddit R-3 authorized target-switch / task-target refinement',
    );
    expect(evidence).toContain('## 9. Reddit R-4 x402 paid-retry request-binding semantics');
    expect(evidence).toContain('**Evidence level:** Open research follow-up');
    expect(evidence).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pam978h/');
    expect(evidence).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paxkn52/');
    expect(evidence).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pay1b51/');
  });
});
