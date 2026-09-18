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

  it('reconfirms HP-TARGET-001 refinement with no add', () => {
    expect(execution).toContain('Decision: **HP-TARGET-001 REFINEMENT / NO ADD**');
    expect(execution).toContain('stable attack count: **23**');
    expect(execution).toContain('package version change: **no**');
    expect(execution).toContain('release triggered: **no**');

    expect(queue).toContain(
      'Status: **LOCAL EXECUTION COMPLETE — HP-TARGET-001 REFINEMENT / NO ADD; merge and public result return pending.**',
    );

    expect(candidates).toContain(
      'Status: **LOCAL EXECUTION COMPLETE / HP-TARGET-001 REFINEMENT / MERGE PENDING**',
    );

    expect(roadmap).toContain(
      'post-execution classification remains **HP-TARGET-001 REFINEMENT / NO ADD**',
    );
  });

  it('does not promote R-3 into external evidence before public return', () => {
    expect(evidence).not.toContain('Reddit authorized tenant switch after denial');

    expect(execution).toContain('Public result return is not external confirmation.');
  });
});
