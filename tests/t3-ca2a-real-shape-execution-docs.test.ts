import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const EVIDENCE = join(ROOT, 'docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md');
const ROADMAP = join(ROOT, 'docs/ROADMAP.md');

describe('T-3.6 cA2A real-shape execution evidence', () => {
  it('records the exact pinned upstream and adapted fixture provenance', () => {
    const evidence = readFileSync(EVIDENCE, 'utf8');

    expect(evidence).toContain('`giskard09/argentum-core`');
    expect(evidence).toContain('`4951899c6bb016928e299e9bf9993086885a45ae`');
    expect(evidence).toContain('`39066b73db43c247be9a2b2e34578a111897a656`');
    expect(evidence).toContain(
      '`fab4982ccc557287c187244bb0106a2f82ac903a1da74e82e49a7808f7522f54`',
    );
    expect(evidence).toContain('`cross-org-001-independent-signers`');
    expect(evidence).toContain(
      '`668e3950c54fef486a0bf433c4542b968ee645e33bed2d2b952ce94f4d8bba81`',
    );
    expect(evidence).toContain('Apache-2.0');
  });

  it('records the positive control and widening-negative observations', () => {
    const evidence = readFileSync(EVIDENCE, 'utf8');

    expect(evidence).toContain('leaf agent: `test-cross-org-c`');
    expect(evidence).toContain('leaf action: `payment.route`');
    expect(evidence).toContain('leaf scope: `mycelium:payment`');
    expect(evidence).toContain('delegated_scope = mycelium:payment');
    expect(evidence).toContain('delegated_scope = mycelium:*');
    expect(evidence).toContain('`mcp.tool.call`: exactly `1`');
    expect(evidence).toContain('`fake_tool.execute`: exactly `1`');
    expect(evidence).toContain('`mcp.tool.call`: exactly `0`');
    expect(evidence).toContain('`fake_tool.execute`: exactly `0`');
  });

  it('keeps the result bounded to research evidence and unchanged release invariants', () => {
    const evidence = readFileSync(EVIDENCE, 'utf8');

    expect(evidence).toContain('stable public corpus remains exactly **22 attacks**');
    expect(evidence).toContain('package version remains `0.3.0`');
    expect(evidence).toContain('does not authorize a release');
    expect(evidence).toContain('does not mean:');
  });

  it('preserves T-3.6 evidence after the T-3 combined closeout', () => {
    const roadmap = readFileSync(ROADMAP, 'utf8');

    expect(roadmap).toContain('Status: **COMPLETE — 2026-09-16; T-4.1 NEXT.**');
    expect(roadmap).toContain('Evidence: `docs/T3_6_CA2A_REAL_SHAPE_EXECUTION_20260916.md`.');
    expect(roadmap).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862',
    );
    expect(roadmap).toContain('Closeout: `docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md`.');
  });
});
