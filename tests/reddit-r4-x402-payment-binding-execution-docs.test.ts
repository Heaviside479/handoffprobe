import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const execution = readFileSync('docs/REDDIT_R4_X402_PAYMENT_BINDING_EXECUTION_20260920.md', 'utf8');

const queue = readFileSync('docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md', 'utf8');

const candidates = readFileSync('docs/ROADMAP_RESEARCH_CANDIDATES.md', 'utf8');

const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');

describe('Reddit R-4 x402 payment-binding execution record', () => {
  it('records all three measured local execution paths', () => {
    expect(execution).toContain('## Path 1 — unchanged paid retry');
    expect(execution).toContain('## Path 2 — mutated retry under x402-only semantics');
    expect(execution).toContain('## Path 3 — explicit request-bound composition control');

    expect(execution).toContain('**EXPECTED X402-ONLY SEMANTICS**');
    expect(execution).toContain('protected-effect delta: `1`');
    expect(execution).toContain('protected-effect delta: `0`');
  });

  it('preserves the no-payment execution boundary', () => {
    expect(execution).toContain('No payment was made.');
    expect(execution).toContain('- no wallet;');
    expect(execution).toContain('- no private key;');
    expect(execution).toContain('- no testnet funds;');
    expect(execution).toContain('- no real funds;');
    expect(execution).toContain('- no public facilitator;');
    expect(execution).toContain('- no public paid endpoint;');
  });

  it('keeps the final admission at protocol semantics with no add', () => {
    expect(execution).toContain('Decision: **PROTOCOL SEMANTICS / NO ADD**');
    expect(execution).toContain('stable attack count: **23**');
    expect(execution).toContain('package version change: **no**');
    expect(execution).toContain('release triggered: **no**');

    expect(queue).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE — PROTOCOL SEMANTICS / NO ADD; external response PENDING.**',
    );

    expect(candidates).toContain(
      'Status: **PUBLIC RESULT RETURN COMPLETE / PROTOCOL SEMANTICS / NO ADD / EXTERNAL RESPONSE PENDING**',
    );

    expect(roadmap).toContain(
      'PUBLIC RESULT RETURN COMPLETE / PROTOCOL SEMANTICS / NO ADD / EXTERNAL RESPONSE PENDING',
    );
  });

  it('records R-4 at Open research follow-up after public result return', () => {
    expect(evidence).toContain('## 9. Reddit R-4 x402 paid-retry request-binding semantics');
    expect(evidence).toContain('**Evidence level:** Open research follow-up');
    expect(evidence).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/paxkn52/');
    expect(evidence).toContain('https://www.reddit.com/r/mcp/comments/1wjq57h/comment/pay1b51/');
    expect(evidence).toContain(
      'https://github.com/Heaviside479/handoffprobe/commit/d012c506a6e44680fb649ff8ab64fb32f41a9bae',
    );
    expect(evidence).toContain('The public result return itself is **not** external confirmation.');
  });

  it('does not claim an external implementation vulnerability', () => {
    expect(execution).toContain('It does not establish:');
    expect(execution).toContain('- an x402 protocol vulnerability;');
    expect(execution).toContain('- a vulnerability in `real-estate-x402`;');
    expect(execution).toContain('- a Cloudflare Agents vulnerability;');
  });
});
