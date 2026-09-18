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

  it('updates the queue and roadmap while keeping result return pending', () => {
    expect(queue).toContain(
      'Status: **EXECUTION COMPLETE — HP-RACE-002 REFINEMENT / NO ADD; public result return NEXT.**',
    );
    expect(queue).toContain('- [x] deterministic fixture implemented;');
    expect(queue).toContain('- [x] normal admission decision completed;');
    expect(queue).toContain(
      '- [ ] concrete result returned to originating Reddit commenter/thread;',
    );

    expect(roadmap).toContain('#### Reddit R-1 token-rotation execution — 2026-09-18');
  });

  it('does not prematurely promote R-1 into EVIDENCE.md', () => {
    expect(evidence).not.toContain('Reddit R-1 token-rotation / reconnect execution');
  });
});
