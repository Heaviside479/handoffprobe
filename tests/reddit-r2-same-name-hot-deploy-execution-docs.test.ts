import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const execution = readFileSync('docs/REDDIT_R2_SAME_NAME_HOT_DEPLOY_EXECUTION_20260918.md', 'utf8');
const queue = readFileSync('docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md', 'utf8');
const candidates = readFileSync('docs/ROADMAP_RESEARCH_CANDIDATES.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');

describe('Reddit R-2 same-name hot-deploy execution record', () => {
  it('records the three observed execution outcomes', () => {
    expect(execution).toContain('## Positive control');
    expect(execution).toContain('## Secure negative result');
    expect(execution).toContain('## Intentionally vulnerable negative result');

    expect(execution).toContain('approval binding: `MISMATCH`');
    expect(execution).toContain('protected-effect delta: `0`');
    expect(execution).toContain('protected-effect delta: `1`');
  });

  it('isolates approval continuity from semantic authority widening', () => {
    expect(execution).toContain('upstream semantic authority for B: `ACCEPT`');
    expect(execution).toContain('authority widening witnesses: none');
  });

  it('reconfirms HP-APPROVAL-002 refinement with no add', () => {
    expect(execution).toContain('Decision: **HP-APPROVAL-002 REFINEMENT / NO ADD**');
    expect(execution).toContain('stable attack count: **23**');
    expect(execution).toContain('package version change: **no**');
    expect(execution).toContain('release triggered: **no**');
  });

  it('records completed R-2 public result return with external response pending', () => {
    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE — HP-APPROVAL-002 REFINEMENT / NO ADD; external response PENDING.**',
    );
    expect(candidates).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE / EXTERNAL RESPONSE PENDING**',
    );
    expect(execution).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paly9up/');
    expect(execution).toContain('`7ffcd7254a85391e0937ec514a39f4507af26727`');
    expect(roadmap).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paly9up/');
    expect(queue).toContain(
      '- [x] concrete result returned to originating Reddit commenter/thread;',
    );
    expect(queue).toContain('- [x] external response state recorded as PENDING;');
  });

  it('records R-2 only as Open research follow-up while response is pending', () => {
    expect(evidence).toContain('## 7. Reddit R-2 same-name capability hot-deploy refinement');
    expect(evidence).toContain('**Evidence level:** Open research follow-up');
    expect(evidence).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paly9up/');
    expect(evidence).toContain('The public result return itself is **not** external confirmation.');
  });
});
