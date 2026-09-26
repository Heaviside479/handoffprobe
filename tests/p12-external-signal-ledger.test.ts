import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

const roadmap = read('docs/ROADMAP.md');
const p11 = read('docs/P11_6_EXTERNAL_FEEDBACK_ROUND_20260920.md');
const p125 = read('docs/P12_5_GA_CANDIDATE_PROOF_20260922.md');
const ledger = read('docs/P12_6_EXTERNAL_SIGNAL_LEDGER_20260925.md');
const docsIndex = read('docs/README.md');

describe('P12.6 external signal ledger', () => {
  it('preserves the external-response signals without promoting them to product use', () => {
    expect(ledger).toContain('MCP issue #3354');
    expect(ledger).toContain(
      'external technical response with an observable upstream specification/demo',
    );
    expect(ledger).toContain('A2A issue #1769');
    expect(ledger).toContain('had **not rerun HandoffProbe locally**');
    expect(ledger).toContain('P12.6 external-use gate: **not claimed complete**');
  });

  it('records the VATE reproduction as the immediate research action', () => {
    expect(ledger).toContain('VATE reproduction and author acknowledgement');
    expect(ledger).toContain('successfully executed; public result');
    expect(ledger).toContain('ec9b2286a18f5500f10a10281dfe6e2620b9aa31b5045ce0748bb89c8308fd31');
    expect(roadmap).toContain('fixed VATE reproduction path was successfully executed');
  });

  it('keeps direct P11.6 feedback pending', () => {
    expect(p11).toContain('issue #168 still has zero external comments');
    expect(p11).toContain('`PENDING`');
    expect(roadmap).toContain('HandoffProbe issue #168 still has zero external comments');
  });

  it('records the rc stage preflight without claiming trusted-publishing failure', () => {
    expect(p125).toContain('1fc3228fc8fd21ef5ddb43919aa7886a0269b41f');
    expect(p125).toContain('intended prerelease dist-tag for a later authorized stage: `next`');
    expect(p125).toContain('returned npm `E401` because local npm authentication was invalid');
    expect(p125).toContain('does not establish a GitHub OIDC Trusted Publishing failure');
    expect(ledger).toContain('it did not stage a package');
    expect(ledger).toContain('it did not publish a package');
  });

  it('records the live rc publication without promoting it to adoption', () => {
    expect(ledger).toContain('## RC.1 live prerelease publication — 2026-09-26');
    expect(ledger).toContain('36248869620');
    expect(ledger).toContain('3c220007-493b-4d09-bb99-ac90ef129912');
    expect(ledger).toContain('https://slsa.dev/provenance/v1');
    expect(ledger).toContain('HANDOFFPROBE_RC_PUBLICATION_VERIFY=OK');
    expect(ledger).toContain('does not itself satisfy P12.6');
    expect(ledger).toContain('The repository candidate is `handoffprobe@1.0.0-rc.2`.');
  });

  it('records the Sanction Gate wait-state follow-up', () => {
    expect(ledger).toContain(
      'https://github.com/math-r-association/sanction-gate/issues/2#issuecomment-5847135938',
    );
    expect(ledger).toContain('there is currently no Sanction Gate vector available for comparison');
    expect(ledger).toContain('No response from HandoffProbe is required at this point.');
  });

  it('indexes the new ledger', () => {
    expect(docsIndex).toContain(
      '[`P12_6_EXTERNAL_SIGNAL_LEDGER_20260925.md`](P12_6_EXTERNAL_SIGNAL_LEDGER_20260925.md)',
    );
  });

  it('preserves the release authorization boundary', () => {
    expect(ledger).toContain('does not authorize npm stage');
    expect(ledger).toContain('does not authorize npm publication');
    expect(ledger).toContain('does not authorize `1.0.0`');
    expect(ledger).toContain('The stable npm `latest` release remains `handoffprobe@0.4.0`.');
  });
});
