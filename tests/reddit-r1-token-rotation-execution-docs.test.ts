import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const execution = readFileSync('docs/REDDIT_R1_TOKEN_ROTATION_EXECUTION_20260918.md', 'utf8');
const queue = readFileSync('docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');

describe('Reddit R-1 token-rotation execution closeout', () => {
  it('records the secure and intentionally vulnerable protected-effect results', () => {
    expect(execution).toContain('MCP tool-call count: `0`');
    expect(execution).toContain('protected-effect delta: `0`');
    expect(execution).toContain('MCP tool-call count: `1`');
    expect(execution).toContain('protected-effect delta: `1`');
  });

  it('classifies R-1 as an HP-RACE-002 refinement with no new attack', () => {
    expect(execution).toContain('**REFINEMENT**');
    expect(execution).toContain('Decision: **NO ADD**');
    expect(execution).toContain('stable corpus: **23 attacks**');
    expect(execution).toContain('package version change: **no**');
    expect(execution).toContain('release triggered: **no**');
  });

  it('keeps replay and AUTH-006 outside the governing invariant', () => {
    expect(execution).toContain('protected-effect count before interruption: `0`');
    expect(execution).toContain('### HP-REPLAY-003');
    expect(execution).toContain('Not governing for the primary R-1 fixture.');
    expect(execution).toContain('### HP-AUTH-006');
  });

  it('records the exact R-1 source and immutable merged artifact', () => {
    expect(execution).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pakk8w2/');
    expect(execution).toContain('`05677e5a00c45bcc20abe06b3622a72d4b7aa43b`');
    expect(execution).toContain('The HandoffProbe reproduction is not external confirmation.');
    expect(queue).toContain(
      '- [x] exact Reddit comment permalink recorded before public result return;',
    );
    expect(queue).toContain('- [x] merged immutable result recorded;');
  });

  it('records completed public result return with external response pending', () => {
    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE — HP-RACE-002 REFINEMENT / NO ADD; external response PENDING.**',
    );
    expect(queue).toContain('- [x] deterministic fixture implemented;');
    expect(queue).toContain('- [x] normal admission decision completed;');
    expect(queue).toContain(
      '- [x] concrete result returned to originating Reddit commenter/thread;',
    );
    expect(queue).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/');
    expect(execution).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pal4fcr/');

    expect(roadmap).toContain('#### Reddit R-1 token-rotation execution — 2026-09-18');
    expect(roadmap).toContain('external response state: **PENDING**');
  });

  it('records only Open research follow-up evidence while external response is pending', () => {
    expect(evidence).toContain('## 6. Reddit R-1 token-rotation / reconnect refinement');
    expect(evidence).toContain('**Evidence level:** Open research follow-up');
    expect(evidence).toContain('**PENDING**');
    expect(evidence).toContain('The public result return itself is **not** external confirmation.');
  });
});
