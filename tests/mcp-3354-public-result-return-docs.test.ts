import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const evidence = readFileSync('EVIDENCE.md', 'utf8');
const queue = readFileSync('docs/MCP_3354_VERIFIABLE_RESULTS_QUEUE_20260917.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

const mergeCommit = '13e4a525b658077e235a769f6aff6d6e2754a33e';
const resultReturn =
  'https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5731012791';

describe('MCP #3354 public result-return evidence', () => {
  it('records the immutable merged execution and public result return', () => {
    expect(evidence).toContain(mergeCommit);
    expect(evidence).toContain(resultReturn);
    expect(queue).toContain(mergeCommit);
    expect(queue).toContain(resultReturn);
    expect(roadmap).toContain(mergeCommit);
    expect(roadmap).toContain(resultReturn);
  });

  it('keeps the evidence level open until substantive external review exists', () => {
    const start = evidence.indexOf(
      '## 5. MCP #3354 execution-integrity / authorization-boundary comparison',
    );
    const end = evidence.indexOf('## Open technical follow-ups', start);
    const section = evidence.slice(start, end);

    expect(section).toContain('**Evidence level:** Open research follow-up');
    expect(section).toContain('External response to the returned HandoffProbe result: **PENDING**');
    expect(section).toContain('The public result return itself is **not** external confirmation.');
    expect(section).toContain('Silence must not be interpreted as agreement.');
    expect(section).not.toContain('**Evidence level:** External vector comparison + author review');
  });

  it('records the completed return gates while leaving response classification open', () => {
    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE 2026-09-18 — REFINEMENT; external response PENDING.**',
    );

    expect(queue).toContain('- [x] reply to AkiraTamai in MCP `#3354`;');
    expect(queue).toContain(
      '- [ ] record and classify any substantive AkiraTamai response before further implementation that depends on it.',
    );
  });

  it('preserves the scoped research classification and release state', () => {
    expect(evidence).toContain('- classification: **REFINEMENT**;');
    expect(evidence).toContain('- new stable attack: **no**;');
    expect(evidence).toContain('- stable public corpus: **23 attacks**;');
    expect(evidence).toContain('- package version change: **no**;');
    expect(evidence).toContain('- release triggered: **no**.');
  });

  it('records the same pending external-review state in the roadmap', () => {
    expect(roadmap).toContain('#### MCP #3354 public result return — 2026-09-18');
    expect(roadmap).toContain('- external response to the returned result is **PENDING**;');
    expect(roadmap).toContain('- the public HandoffProbe reply is not external confirmation;');
  });
});
