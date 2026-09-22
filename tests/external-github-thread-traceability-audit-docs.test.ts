import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const audit = readFileSync('docs/EXTERNAL_GITHUB_THREAD_TRACEABILITY_AUDIT_20260918.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const t4 = readFileSync('docs/T4_5_PUBLIC_RESULT_RETURN_20260918.md', 'utf8');

describe('external GitHub thread traceability audit', () => {
  it('tracks every verified external HandoffProbe GitHub thread', () => {
    expect(audit).toContain('https://github.com/a2aproject/A2A/issues/1937');
    expect(audit).toContain('https://github.com/a2aproject/A2A/issues/2079');
    expect(audit).toContain('https://github.com/a2aproject/A2A/issues/1769');
    expect(audit).toContain(
      'https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354',
    );
    expect(audit).toContain(
      'https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2',
    );
    expect(audit).toContain('https://github.com/modelcontextprotocol/typescript-sdk/issues/2777');
  });

  it('keeps the MCPShip registry thread outside HandoffProbe lineage', () => {
    expect(audit).toContain('## Excluded: MCP Registry #1579');
    expect(audit).toContain(
      'The Heaviside479 comment in this thread explicitly discusses **MCPShip**',
    );
  });

  it('records the repaired canonical PR cross-references', () => {
    expect(audit).toContain('PR #93 → A2A #1937');
    expect(audit).toContain('PR #103 → A2A #2079');
    expect(audit).toContain('PR #121 → A2A #1769 and VATE #2');
    expect(audit).toContain('PR #115 → MCP #3354');
    expect(audit).toContain(
      'https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5775696397',
    );
    expect(audit).toContain('https://github.com/ripple-node-lab/mcp-verifiable-tools-demo/pull/36');
    expect(audit).toContain('9b63cb023fa966e6da54d252d2827990d2d7fdbe');
    expect(audit).toContain(
      'https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5777698218',
    );
    expect(audit).toContain('https://github.com/ripple-node-lab/mcp-verifiable-tools-demo/pull/37');
    expect(audit).toContain('803935c0fbcd34ead12976a52a6ad857c09e9fdc');
    expect(roadmap).toContain('docs/EXTERNAL_GITHUB_THREAD_TRACEABILITY_AUDIT_20260918.md');
  });

  it('locks the permanent GitHub cross-reference rule into policy', () => {
    expect(audit).toContain('## Permanent GitHub cross-reference rule');
    expect(audit).toContain(
      'the canonical HandoffProbe PR or closeout PR for that work must contain the **full external GitHub issue/PR URL**',
    );
    expect(audit).toContain(
      'the external GitHub timeline must be checked for the visible HandoffProbe cross-reference',
    );
    expect(audit).toContain(
      'must **not** receive an artificial PR merely to manufacture a cross-reference',
    );

    expect(evidence).toContain(
      'the canonical HandoffProbe PR/closeout must contain the **full external GitHub issue or pull-request URL**',
    );
    expect(roadmap).toContain(
      'the canonical HandoffProbe PR/closeout must include the **full external GitHub issue/PR URL**',
    );
    expect(roadmap).toContain('GitHub cross-reference presence is provenance metadata only');
  });

  it('adds missing initiating comments and the VATE reciprocal record to Evidence', () => {
    expect(evidence).toContain(
      'https://github.com/a2aproject/A2A/issues/1937#issuecomment-5684030629',
    );
    expect(evidence).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5682091042',
    );
    expect(evidence).toContain(
      'https://github.com/a2aproject/A2A/issues/1769#issuecomment-5682264021',
    );
    expect(evidence).toContain(
      'https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3354#issuecomment-5682996881',
    );
    expect(evidence).toContain(
      '60c8c7c9cf89fc6011eb95f9d67b5d25233338b7/docs/interop/handoffprobe-reconciliation-review.md',
    );
  });

  it('preserves evidence truth and does not manufacture a new result', () => {
    expect(evidence).toContain('**Evidence level:** Open research follow-up');
    expect(audit).toContain('no new attack ID');
    expect(audit).toContain('no new research execution');
    expect(audit).toContain('no release');
    expect(t4).toContain('the HandoffProbe tests were **not rerun** by the VATE maintainer');
    expect(t4).toContain(
      'It does not change the evidence level, does not constitute an independent rerun and does not reopen T-4.',
    );
  });
});
