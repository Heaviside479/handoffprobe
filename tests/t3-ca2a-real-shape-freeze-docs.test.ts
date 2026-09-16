import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const FREEZE = join(ROOT, 'docs/T3_5_CA2A_REAL_SHAPE_FREEZE_20260916.md');
const ROADMAP = join(ROOT, 'docs/ROADMAP.md');

describe('T-3.5 real delegation-chain shape freeze', () => {
  it('pins the exact external request and upstream revision', () => {
    const freeze = readFileSync(FREEZE, 'utf8');

    expect(freeze).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5688209314',
    );
    expect(freeze).toContain('`giskard09/argentum-core`');
    expect(freeze).toContain('`4951899c6bb016928e299e9bf9993086885a45ae`');
    expect(freeze).toContain('Apache License 2.0');
  });

  it('pins every consumed upstream blob and SHA-256 digest', () => {
    const freeze = readFileSync(FREEZE, 'utf8');

    const expected = [
      'a616b20c12169268c065c92571fd078bd852dbfe',
      '98b040763ee0a1274abf9a6d2ddfa908f43ddbeac5949c8db6f6656025ef1af3',
      '39066b73db43c247be9a2b2e34578a111897a656',
      'fab4982ccc557287c187244bb0106a2f82ac903a1da74e82e49a7808f7522f54',
      '5f19972f730abf3ec7731d0dbb61eb7c4b38f59a',
      '2c2daecbdc99db317e68f350dd32f0d7f17dbce10fe9a33b99343f29510f1905',
      '54097a6e32878f6c23aa4a160c7fc1da3c821957',
      '377670af12a56a2184309464fb2d4c75b3d66f2fdb1e3d6f854786f6dca006fd',
      '10bbe478e6552658a311ac6053e3145cbfa3bbd0',
    ];

    for (const value of expected) {
      expect(freeze).toContain(`\`${value}\``);
    }
  });

  it('freezes the real positive shape and translation-gap boundary', () => {
    const freeze = readFileSync(FREEZE, 'utf8');

    expect(freeze).toContain('`cross-org-001-independent-signers`');
    expect(freeze).toContain('leaf agent: `test-cross-org-c`');
    expect(freeze).toContain('leaf action: `payment.route`');
    expect(freeze).toContain('leaf scope: `mycelium:payment`');

    expect(freeze).toContain(
      'that does **not** by itself prove that the **effective downstream request produced by translation** remains inside the declared authority',
    );
  });

  it('limits T-3.6 to the smallest owned A2A-to-MCP projection', () => {
    const freeze = readFileSync(FREEZE, 'utf8');
    const roadmap = readFileSync(ROADMAP, 'utf8');

    expect(freeze).toContain('P(R_effective) = {');
    expect(freeze).toContain('delegated_scope = mycelium:payment');
    expect(freeze).toContain('delegated_scope = mycelium:*');
    expect(freeze).toContain('The upstream bytes remain valid and unchanged in both lanes.');
    expect(freeze).toContain(
      'A fail-closed runtime denial is not automatically a vulnerability `FAIL`.',
    );
    expect(freeze).toContain('stable corpus remains exactly **22 attacks**');
    expect(freeze).toContain('package version remains `0.3.0`');

    expect(roadmap).toContain('Status: **COMPLETE — 2026-09-16; T-4.1 NEXT.**');
    expect(roadmap).toContain('Evidence: `docs/T3_5_CA2A_REAL_SHAPE_FREEZE_20260916.md`.');
    expect(roadmap).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862',
    );
    expect(roadmap).toContain('Closeout: `docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md`.');
  });
});
