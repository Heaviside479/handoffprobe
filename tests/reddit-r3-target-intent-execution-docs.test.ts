import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const execution = readFileSync('docs/REDDIT_R3_TARGET_INTENT_EXECUTION_20260918.md', 'utf8');

const queue = readFileSync('docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md', 'utf8');

const candidates = readFileSync('docs/ROADMAP_RESEARCH_CANDIDATES.md', 'utf8');

const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');

describe('Reddit R-3 target-intent execution record', () => {
  it('records the three observed protected-effect outcomes', () => {
    expect(execution).toContain('## Positive control');
    expect(execution).toContain('## Secure negative result');
    expect(execution).toContain('## Intentionally vulnerable negative result');

    expect(execution).toContain('task-target continuity: `MATCH`');
    expect(execution).toContain('task-target continuity: `MISMATCH`');
    expect(execution).toContain('protected-effect delta: `0`');
    expect(execution).toContain('protected-effect delta: `1`');
  });

  it('proves B has valid independent request authority', () => {
    expect(execution).toContain(
      'The retry is evaluated through the existing `evaluateP0Authorization()` implementation.',
    );
    expect(execution).toContain('authorization: `ACCEPT`');
    expect(execution).toContain('authority-not-amplified check: pass');
    expect(execution).toContain('authorization reasons: none');
  });

  it('preserves the synthetic boundary of attempt 1 and discovery', () => {
    expect(execution).toContain(
      'These two pre-retry states are fixture-controlled deterministic research inputs.',
    );
    expect(execution).toContain(
      'They are not claimed to be separate end-to-end external network executions.',
    );
  });

  it('records completed R-3 public result return with external response pending', () => {
    expect(execution).toContain('Decision: **HP-TARGET-001 REFINEMENT / NO ADD**');
    expect(execution).toContain('stable attack count: **23**');

    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE — HP-TARGET-001 REFINEMENT / NO ADD; external response PENDING.**',
    );

    expect(candidates).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE / EXTERNAL RESPONSE PENDING**',
    );

    expect(execution).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pam978h/');
    expect(execution).toContain('`a78fd7a961f197ddaf82bbea7fe3b15546c8efbf`');

    expect(queue).toContain(
      '- [x] concrete result returned to originating Reddit commenter/thread;',
    );
    expect(queue).toContain('- [x] external response state recorded as PENDING;');
  });

  it('records R-3 only as Open research follow-up while response is pending', () => {
    expect(evidence).toContain(
      '## 8. Reddit R-3 authorized target-switch / task-target refinement',
    );
    expect(evidence).toContain('**Evidence level:** Open research follow-up');
    expect(evidence).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pam978h/');
    expect(evidence).toContain('The public result return itself is **not** external confirmation.');

    expect(roadmap).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pam978h/');
  });
});
