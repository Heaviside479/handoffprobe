import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const evidence = readFileSync('EVIDENCE.md', 'utf8');
const queue = readFileSync('docs/MCP_3354_VERIFIABLE_RESULTS_QUEUE_20260917.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

const mergeCommit = '13e4a525b658077e235a769f6aff6d6e2754a33e';
const resultReturn =
  'https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5731012791';
const externalFollowup =
  'https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5775696397';
const upstreamPr = 'https://github.com/ripple-node-lab/mcp-verifiable-tools-demo/pull/36';
const upstreamMerge = '9b63cb023fa966e6da54d252d2827990d2d7fdbe';

describe('MCP #3354 public result-return evidence', () => {
  it('records the immutable merged execution and public result return', () => {
    expect(evidence).toContain(mergeCommit);
    expect(evidence).toContain(resultReturn);
    expect(queue).toContain(mergeCommit);
    expect(queue).toContain(resultReturn);
    expect(roadmap).toContain(mergeCommit);
    expect(roadmap).toContain(resultReturn);
    expect(evidence).toContain(externalFollowup);
    expect(evidence).toContain(upstreamPr);
    expect(evidence).toContain(upstreamMerge);
    expect(queue).toContain(externalFollowup);
    expect(roadmap).toContain(externalFollowup);
  });

  it('keeps the evidence level open until substantive external review exists', () => {
    const start = evidence.indexOf(
      '## 5. MCP #3354 execution-integrity / authorization-boundary comparison',
    );
    const end = evidence.indexOf('## Open technical follow-ups', start);
    const section = evidence.slice(start, end);

    expect(section).toContain('**Evidence level:** Open research follow-up');
    expect(section).toContain('Post-result external technical follow-up: **RECEIVED**');
    expect(section).toContain('The public result return itself is **not** external confirmation.');
    expect(section).toContain('Silence must not be interpreted as agreement.');
    expect(section).not.toContain('**Evidence level:** External vector comparison + author review');
  });

  it('records the completed return gates while leaving response classification open', () => {
    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE 2026-09-18 — REFINEMENT; substantive post-result technical follow-up received; direct HandoffProbe result review not established.**',
    );

    expect(queue).toContain('- [x] reply to AkiraTamai in MCP `#3354`;');
    expect(queue).toContain(
      '- [x] record and classify the substantive AkiraTamai post-result technical follow-up; direct HandoffProbe result review remains unestablished.',
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
    expect(roadmap).toContain(
      '- substantive post-result external technical follow-up received on 2026-09-22:',
    );
    expect(roadmap).toContain('- the public HandoffProbe reply is not external confirmation;');
  });
});
