import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const FREEZE = join(ROOT, 'docs/T3_1_EXTERNAL_A2A_INPUT_FREEZE_20260916.md');
const ROADMAP = join(ROOT, 'docs/ROADMAP.md');

describe('T-3.1 external A2A input freeze', () => {
  it('freezes both exact public comments and authors', () => {
    const freeze = readFileSync(FREEZE, 'utf8');

    expect(freeze).toContain(
      'https://github.com/a2aproject/A2A/issues/1937#issuecomment-5689749343',
    );
    expect(freeze).toContain('author: `arjun2075`');
    expect(freeze).toContain('created: `2026-09-15T23:48:30Z`');

    expect(freeze).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5688209314',
    );
    expect(freeze).toContain('author: `giskard09`');
    expect(freeze).toContain('created: `2026-09-15T21:16:36Z`');
  });

  it('pins upstream material and integrity references before consumption', () => {
    const freeze = readFileSync(FREEZE, 'utf8');

    expect(freeze).toContain('`giskard09/argentum-core`');
    expect(freeze).toContain('`4951899c6bb016928e299e9bf9993086885a45ae`');
    expect(freeze).toContain('Apache License 2.0');
    expect(freeze).toContain('`98b040763ee0a1274abf9a6d2ddfa908f43ddbeac5949c8db6f6656025ef1af3`');
    expect(freeze).toContain('`fab4982ccc557287c187244bb0106a2f82ac903a1da74e82e49a7808f7522f54`');
    expect(freeze).toContain('`2c2daecbdc99db317e68f350dd32f0d7f17dbce10fe9a33b99343f29510f1905`');
    expect(freeze).toContain('`377670af12a56a2184309464fb2d4c75b3d66f2fdb1e3d6f854786f6dca006fd`');
  });

  it('freezes the HandoffProbe baseline and Bayu packet isolation', () => {
    const freeze = readFileSync(FREEZE, 'utf8');

    expect(freeze).toContain('stable corpus: exactly **22 attacks**');
    expect(freeze).toContain('**A2A 1.0 → MCP 2026-07-28**');
    expect(freeze).toContain('`HP-AUTH-001` refinement');
    expect(freeze).toContain('T-2.7 remains independently `WAITING FOR RESPONSE`');
    expect(freeze).toContain(
      '- `https://github.com/Heaviside479/handoffprobe/blob/dd77f6d28e9f5dd8863670b2b12e6a7bbc32bb09/docs/T2_5_REVIEW_PACKET_20260915.md`',
    );
    expect(freeze).not.toContain('T2_5_REVIEW_PACKET_20260915.md`(');
  });

  it('preserves T-3.1 completion after later T-3 progress', () => {
    const roadmap = readFileSync(ROADMAP, 'utf8');

    expect(roadmap).toContain('#### T-3.1 — freeze both external inputs before implementation');
    expect(roadmap).toContain(
      '- [x] preserve the exact two comment URLs, authors, timestamps, requested comparison/test scope and any linked public artifacts;',
    );
    expect(roadmap).toContain(
      '- [x] pin exact upstream repository/commit/vector references before consuming external test material;',
    );
    expect(roadmap).toContain(
      '- [x] review provenance and license terms before copying or adapting any external vectors/code;',
    );
    expect(roadmap).toContain(
      '- [x] record the current HandoffProbe baseline: `v0.3.0`, 22 stable attacks, A2A 1.0 → MCP 2026-07-28, T-1 semantic-authority refinement and Phase-9 crossing evidence;',
    );
    expect(roadmap).toContain('- [x] keep the Bayu T-2 review packet unchanged.');
    expect(roadmap).toContain('  - Evidence: `docs/T3_1_EXTERNAL_A2A_INPUT_FREEZE_20260916.md`.');
    expect(roadmap).not.toContain('unchanged.\\n  - Evidence:');
  });
});
