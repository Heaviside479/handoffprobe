import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const t4 = readFileSync('docs/T4_A2A_WITNESS_OBSERVATION_QUEUE_20260916.md', 'utf8');
const t43 = readFileSync('docs/T4_3_PROVIDER_RECONCILIATION_EXECUTION_20260918.md', 'utf8');
const closeout = readFileSync('docs/T3_8_COMBINED_CLOSEOUT_20260916.md', 'utf8');

describe('T-3.8 combined A2A follow-up closeout', () => {
  it('reconciles both public A2A streams with exact evidence references', () => {
    expect(closeout).toContain(
      'https://github.com/a2aproject/A2A/issues/1937#issuecomment-5695896491',
    );
    expect(closeout).toContain(
      'https://github.com/a2aproject/A2A/issues/1937#issuecomment-5697862002',
    );
    expect(closeout).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862',
    );
    expect(closeout).toContain('398daa88c17821b901dbeecc3c2ce79065f87d61');
    expect(closeout).toContain('c616804d3b3daedd7f68b300b8416029b5020942');
    expect(closeout).toContain('c5ba76cab8234cae3b1f3863b4dc06a662e899ec');
  });

  it('records the combined admission decision without adding a stable attack', () => {
    expect(closeout).toContain('V10/V12 **REFINEMENT**; V3/V13 **DISTINCT RESEARCH CANDIDATE**');
    expect(closeout).toContain(
      '**REFINEMENT** of existing `HP-AUTH-001`; no distinct research candidate',
    );
    expect(closeout).toContain('The stable public corpus remains exactly **22 attacks**');
    expect(closeout).toContain('V3 and V13 remain research candidates only');
    expect(closeout).toContain('new stable attack admitted: no');
  });

  it('preserves the evidence-level distinction between #1937 and #2079', () => {
    expect(closeout).toContain('`#1937`: completed external vector comparison + author review');
    expect(closeout).toContain(
      '`#2079`: HandoffProbe execution and public reply complete, but external response/review still pending',
    );
    expect(evidence).toContain(
      'no substantive external technical response/review to that result had been recorded at T-3 closeout',
    );
    expect(evidence).toContain('## Open technical follow-ups');
    expect(evidence).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862',
    );
  });

  it('keeps release and Bayu invariants unchanged', () => {
    expect(closeout).toContain('package version: `0.3.0`');
    expect(closeout).toContain('ef54b950b3ee333c406fa81087685d7f952a028d');
    expect(closeout).toContain('release triggered: no');
    expect(closeout).toContain('docs/T2_5_REVIEW_PACKET_20260915.md');
    expect(closeout).toContain('Bayu packet changed: no');
  });

  it('closes T-3 and advances only to T-4.1', () => {
    expect(roadmap).toContain('Status: **COMPLETE — 2026-09-16; T-4.1 NEXT.**');
    expect(roadmap).toContain('Combined closeout: `docs/T3_8_COMBINED_CLOSEOUT_20260916.md`.');
    expect(roadmap).toContain('T-3 exit gate: **SATISFIED 2026-09-16.**');
    expect(t4).toContain(
      'Status: **T-4.5 public result return complete 2026-09-18; WitnessObservation author review recorded; VATE response pending.**',
    );
    expect(t43).toContain('07d9c8bf38f1fa5bfa0d61f74d92ffe5232b53ba');
    expect(t43).toContain('T-4.4 decision: **DISTINCT RESEARCH CANDIDATE**');
    expect(t43).toContain('New stable attack admitted: **no**.');
    expect(t43).toContain('The stable public corpus remains **23 attacks**.');
    expect(evidence).toContain('**Status:** Completed external review follow-up — 2026-09-17');
    expect(readme).not.toContain('pending #2079 review and T-4 work remain explicitly open');
  });
});
