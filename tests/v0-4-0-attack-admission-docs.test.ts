import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const admission = readFileSync('docs/V0_4_0_ATTACK_ADMISSION_20260916.md', 'utf8');

describe('v0.4.0 T-3 attack admission decision', () => {
  it('preserves the release baseline before implementation', () => {
    expect(admission).toContain('repository base: `525b5643859b7f07009f5ecb25d34facd272b3d4`');
    expect(admission).toContain('stable corpus: **22 attacks**');
    expect(admission).toContain('package version: `0.3.0`');
    expect(admission).toContain('does not yet add a stable attack');
  });

  it('does not duplicate V3 as a new stable attack', () => {
    expect(admission).toContain('## V3 — task-bound versus context-bound authority');
    expect(admission).toContain('`HP-REPLAY-002 — Cross-context / cross-run replay`');
    expect(admission).toContain('### V3 decision');
    expect(admission).toContain('**NO ADD**');
    expect(admission).toContain('Do not create a new stable ID for V3.');
  });

  it('separates V13 from the closest existing stable attacks', () => {
    expect(admission).toContain('## V13 — independent final authorization for multiple effects');
    expect(admission).toContain('`HP-AUTH-004 — Expired delegation reuse`');
    expect(admission).toContain('`HP-REPLAY-003 — Retry double execution`');
    expect(admission).toContain('`HP-RACE-002 — Partial-failure stale execution`');
    expect(admission).toContain('There is no partial-failure/resume requirement.');
  });

  it('admits only HP-AUTH-006 for stable implementation', () => {
    expect(admission).toContain('**ADMIT FOR STABLE IMPLEMENTATION as `HP-AUTH-006`**');
    expect(admission).toContain('HP-AUTH-006 — Stale task authorization reused for later effect');
    expect(admission).toContain('PASS requires total protected-effect delta `1`');
    expect(admission).toContain('FAIL requires total protected-effect delta `2`');
    expect(admission).toContain('Implement only `HP-AUTH-006` from this admission.');
  });

  it('keeps v0.4.0 conditional on successful stable implementation', () => {
    expect(admission).toContain('stable attacks: **22**');
    expect(admission).toContain('`HP-AUTH-006`: admitted for implementation, not yet stable');
    expect(admission).toContain('the stable corpus may become **23 attacks**');
    expect(admission).toContain('justify the planned pre-1.0 minor release `0.4.0`');
    expect(admission).toContain('No version bump, tag or npm publication occurs before');
  });
});
