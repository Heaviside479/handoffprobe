import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const closeout = readFileSync('docs/T4_5_PUBLIC_RESULT_RETURN_20260918.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('T-4 final external-review closeout', () => {
  it('records the VATE author review and closes T-4', () => {
    expect(closeout).toContain(
      'Status: **COMPLETE — scoped external author review received from WitnessObservation and VATE; T-4 closed.**',
    );
    expect(closeout).toContain(
      'https://github.com/a2aproject/A2A/issues/1769#issuecomment-5732275655',
    );
    expect(closeout).toContain('Classification: **CONFIRMATION + CLARIFICATION**.');
    expect(closeout).toContain(
      'This is scoped author review of the reported HandoffProbe result. It is **not** an independent rerun of HandoffProbe.',
    );
  });

  it('promotes only to the scoped author-review evidence level', () => {
    expect(evidence).toContain('**Evidence level:** External vector comparison + author review');
    expect(evidence).toContain(
      '**Status:** Completed scoped external author review — WitnessObservation and VATE responses received',
    );
    expect(evidence).toContain(
      'https://github.com/a2aproject/A2A/issues/1769#issuecomment-5732275655',
    );
    expect(evidence).toContain('The review does not report an independent HandoffProbe rerun.');
  });

  it('keeps the admission and release state unchanged', () => {
    expect(closeout).toContain('**DISTINCT RESEARCH CANDIDATE / NO STABLE ATTACK ADD**');
    expect(closeout).toContain('The stable public corpus remains **23 attacks**.');
    expect(closeout).toContain('Package version remains `0.4.0`.');
    expect(closeout).toContain('No release is triggered.');
  });

  it('records the completed T-4 state in the main roadmap', () => {
    expect(roadmap).toContain('T-4 is **CLOSED**;');
    expect(roadmap).toContain(
      'T-4 evidence level is now **External vector comparison + author review**;',
    );
    expect(roadmap).toContain(
      'https://github.com/a2aproject/A2A/issues/1769#issuecomment-5732275655',
    );
  });

  it('removes the stale VATE-pending closeout state', () => {
    expect(closeout).not.toContain('Current state: **PENDING**.');
    expect(closeout).not.toContain(
      'T-4 remains open only for the VATE response classification and final closeout.',
    );
  });
});
