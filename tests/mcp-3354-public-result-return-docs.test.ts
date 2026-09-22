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
const directAuthorReview =
  'https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5777698218';
const fixturePr = 'https://github.com/ripple-node-lab/mcp-verifiable-tools-demo/pull/37';
const fixtureMerge = '803935c0fbcd34ead12976a52a6ad857c09e9fdc';

describe('MCP #3354 public result-return evidence', () => {
  it('records the immutable HandoffProbe result and external follow-up chain', () => {
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

    expect(evidence).toContain(directAuthorReview);
    expect(evidence).toContain(fixturePr);
    expect(evidence).toContain(fixtureMerge);
    expect(queue).toContain(directAuthorReview);
    expect(queue).toContain(fixturePr);
    expect(queue).toContain(fixtureMerge);
    expect(roadmap).toContain(directAuthorReview);
    expect(roadmap).toContain(fixturePr);
    expect(roadmap).toContain(fixtureMerge);
  });

  it('records the direct scoped author review and evidence promotion', () => {
    const start = evidence.indexOf(
      '## 5. MCP #3354 execution-integrity / authorization-boundary comparison',
    );
    const end = evidence.indexOf('## 6. Reddit R-1', start);
    const section = evidence.slice(start, end);

    expect(section).toContain('**Evidence level:** External vector comparison + author review');
    expect(section).toContain('Direct post-result author review: **RECEIVED**.');
    expect(section).toContain(directAuthorReview);
    expect(section).toContain(fixturePr);
    expect(section).toContain(fixtureMerge);
    expect(section).toContain(
      'This is scoped external author review of the comparison. It is not an independent rerun of HandoffProbe.',
    );
    expect(section).not.toContain('**Evidence level:** Open research follow-up');
  });

  it('records the completed return and author-review gates', () => {
    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE — REFINEMENT; DIRECT AUTHOR REVIEW RECEIVED 2026-09-22; PROPOSAL / CHANGELOG TRACEABILITY RECORDED.**',
    );
    expect(queue).toContain('- [x] reply to AkiraTamai in MCP `#3354`;');
    expect(queue).toContain(
      '- [x] record and classify the direct AkiraTamai post-result author review and the resulting proposal / changelog traceability.',
    );
    expect(queue).toContain(
      '**DIRECT AUTHOR REVIEW RECEIVED — EXTERNAL VECTOR COMPARISON + AUTHOR REVIEW**',
    );
  });

  it('preserves the scoped research classification and release state', () => {
    expect(evidence).toContain('- classification: **REFINEMENT**;');
    expect(evidence).toContain('- new stable attack: **no**;');
    expect(evidence).toContain('- stable public corpus: **23 attacks**;');
    expect(evidence).toContain('- package version change: **no**;');
    expect(evidence).toContain('- release triggered: **no**.');
  });

  it('records the direct author review and proposal traceability in the roadmap', () => {
    expect(roadmap).toContain(
      '#### MCP #3354 public result return and external author review — 2026-09-18 / 2026-09-22',
    );
    expect(roadmap).toContain(directAuthorReview);
    expect(roadmap).toContain(fixturePr);
    expect(roadmap).toContain(fixtureMerge);
    expect(roadmap).toContain('changelog `2026-09-22-002`');
    expect(roadmap).toContain('evidence is now **External vector comparison + author review**');
  });

  it('keeps proposal impact separate from adoption or standardization claims', () => {
    expect(evidence).toContain('pre-SEP proposal');
    expect(evidence).toContain('2026-09-22-002');
    expect(evidence).toContain(
      'It does not establish HandoffProbe adoption, endorsement, MCP standardization, SEP acceptance or independent HandoffProbe reproduction.',
    );
    expect(evidence).toContain('- independent external rerun of HandoffProbe;');
    expect(evidence).toContain('- SEP acceptance or standardization;');
  });
});
