import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const evidence = readFileSync('EVIDENCE.md', 'utf8');
const followup = readFileSync(
  'docs/T3_CA2A_EXTERNAL_AUTHOR_CONFIRMATION_20260917.md',
  'utf8',
);
const t37 = readFileSync(
  'docs/T3_7_CA2A_PUBLIC_REPLY_CLOSEOUT_20260916.md',
  'utf8',
);
const t38 = readFileSync('docs/T3_8_COMBINED_CLOSEOUT_20260916.md', 'utf8');

describe('T-3 post-closeout cA2A external author confirmation', () => {
  it('records the exact pinned input, HandoffProbe evidence and public confirmation', () => {
    expect(followup).toContain('Status: **COMPLETE — 2026-09-17**');
    expect(followup).toContain('4951899c6bb016928e299e9bf9993086885a45ae');
    expect(followup).toContain('cross-org-001-independent-signers');
    expect(followup).toContain('c616804d3b3daedd7f68b300b8416029b5020942');
    expect(followup).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5706400400',
    );
    expect(followup).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5710063080',
    );
  });

  it('promotes only the scoped #2079 HandoffProbe loop to completed external evidence', () => {
    expect(evidence).toContain(
      '## 3. A2A #2079 cA2A real-shape translation-boundary comparison',
    );
    expect(evidence).toContain(
      '**Status:** Completed scoped comparison and external author confirmation — 2026-09-17',
    );
    expect(evidence).toContain(
      "[giskard09's external author confirmation](https://github.com/a2aproject/A2A/issues/2079#issuecomment-5706400400)",
    );
    expect(evidence).toContain(
      'The `#2079` extension proposal itself remains open upstream',
    );
    expect(evidence).toContain(
      'the A2A `#1769` third-party witness / conduct-observation follow-up in T-4',
    );
  });

  it('preserves the historical T-3 closeout state instead of rewriting it', () => {
    expect(evidence).toContain(
      'no substantive external technical response/review to that result had been recorded at T-3 closeout',
    );
    expect(t37).toContain(
      'must **not** promote this stream to a completed external-evidence entry yet',
    );
    expect(t38).toContain(
      '`#2079`: HandoffProbe execution and public reply complete, but external response/review still pending',
    );
    expect(followup).toContain(
      'The T-3.7 and T-3.8 closeout documents remain historically correct.',
    );
  });

  it('keeps the confirmation within the existing non-claim and release boundaries', () => {
    expect(followup).toContain('a cA2A vulnerability');
    expect(followup).toContain('an A2A vulnerability');
    expect(followup).toContain('compatibility certification');
    expect(followup).toContain('conformance certification');
    expect(followup).toContain('no new stable attack is admitted');
    expect(followup).toContain('no package-version change is authorized');
    expect(followup).toContain(
      'the already published `v0.4.0` release identity is not changed',
    );
  });
});
