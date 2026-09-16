import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');
const closeout = readFileSync('docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md', 'utf8');

describe('T-3.7 cA2A public reply closeout documentation', () => {
  it('records the exact public reply and reproducible T-3.6 basis', () => {
    expect(closeout).toContain('Status: **COMPLETE — 2026-09-16**');
    expect(closeout).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862',
    );
    expect(closeout).toContain('c616804d3b3daedd7f68b300b8416029b5020942');
    expect(closeout).toContain('4951899c6bb016928e299e9bf9993086885a45ae');
    expect(closeout).toContain('cross-org-001-independent-signers');
    expect(closeout).toContain('668e3950c54fef486a0bf433c4542b968ee645e33bed2d2b952ce94f4d8bba81');
  });

  it('records the positive and widening-negative boundary result', () => {
    expect(closeout).toContain('downstream `delegated_scope`: `mycelium:payment`');
    expect(closeout).toContain('protected local fake-effect delta: `1`');
    expect(closeout).toContain('downstream `delegated_scope`: `mycelium:*`');
    expect(closeout).toContain('`mcp.tool.call`: `0`');
    expect(closeout).toContain('protected fake-tool executions: `0`');
    expect(closeout).toContain('protected fake-effect delta: `0`');
  });

  it('keeps #2079 open in the evidence index until external review exists', () => {
    expect(evidence).toContain(
      'A2A `#2079` real cA2A shape / bytes comparison completed its HandoffProbe execution and public reply',
    );
    expect(evidence).toContain(
      'no substantive external technical response/review to that result had been recorded at T-3 closeout',
    );
    expect(evidence).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862',
    );
    expect(evidence).toContain('docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md');
    expect(closeout).toContain(
      'must **not** promote this stream to a completed external-evidence entry yet',
    );
  });

  it('preserves the T-3.7 closeout after T-3.8 without changing release or stable-corpus semantics', () => {
    expect(roadmap).toContain('COMPLETE — 2026-09-16; T-4.1 NEXT');
    expect(roadmap).toContain('Status: **COMPLETE — 2026-09-16**');
    expect(roadmap).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862',
    );
    expect(roadmap).toContain('docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md');
    expect(closeout).toContain('stable public corpus: **22 attacks**');
    expect(closeout).toContain('package version: `0.3.0`');
    expect(closeout).toContain('release triggered: no');
    expect(closeout).toContain('a cA2A or A2A vulnerability');
    expect(closeout).toContain('compatibility certification');
  });
});
