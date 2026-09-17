import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const evidence = readFileSync('EVIDENCE.md', 'utf8');
const followup = readFileSync(
  'docs/T3_CA2A_EXTERNAL_AUTHOR_CONFIRMATION_20260917.md',
  'utf8',
);

describe('T-3 cA2A external author confirmation', () => {
  it('records the scoped external confirmation', () => {
    expect(followup).toContain('Status: **COMPLETE — 2026-09-17**');
    expect(followup).toContain('4951899c6bb016928e299e9bf9993086885a45ae');
    expect(followup).toContain('cross-org-001-independent-signers');
    expect(followup).toContain('issuecomment-5706400400');
    expect(followup).toContain('issuecomment-5710063080');
  });

  it('updates only the evidence classification and preserves non-claims', () => {
    expect(evidence).toContain('A2A #2079 cA2A real-shape translation-boundary comparison');
    expect(evidence).toContain('external author confirmation — 2026-09-17');
    expect(evidence).toContain('extension proposal itself remains open upstream');
    expect(followup).toContain('no new stable attack is admitted');
    expect(followup).toContain('no package-version change is authorized');
  });
});
