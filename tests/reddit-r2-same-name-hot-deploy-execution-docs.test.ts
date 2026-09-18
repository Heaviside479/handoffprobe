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

  it('updates the tracked R-2 state after execution', () => {
    expect(queue).toContain(
      'Status: **LOCAL EXECUTION COMPLETE — HP-APPROVAL-002 REFINEMENT / NO ADD; merge and public result return pending.**',
    );
    expect(candidates).toContain(
      'Status: **LOCAL EXECUTION COMPLETE / HP-APPROVAL-002 REFINEMENT / MERGE PENDING**',
    );
    expect(roadmap).toContain(
      'post-execution classification remains **HP-APPROVAL-002 REFINEMENT / NO ADD**',
    );
  });

  it('does not promote R-2 into external evidence before public return', () => {
    expect(evidence).not.toContain('Reddit R-2 same-name capability hot-deploy');
    expect(execution).toContain(
      'No public result claim should precede the merged reproducible artifact.',
    );
  });
});
