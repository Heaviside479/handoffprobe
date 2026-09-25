import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

const record = read('docs/VATE_A2A_EVIDENCE_REPRODUCTION_20260925.md');
const ledger = read('docs/P12_6_EXTERNAL_SIGNAL_LEDGER_20260925.md');
const roadmap = read('docs/ROADMAP.md');
const index = read('docs/README.md');

describe('VATE A2A evidence reproduction record', () => {
  it('pins the exact upstream input', () => {
    expect(record).toContain('b847004c683de0ed81c7ee5a78d5342b82930fb8');
    expect(record).toContain('234820');
    expect(record).toContain('ec9b2286a18f5500f10a10281dfe6e2620b9aa31b5045ce0748bb89c8308fd31');
  });

  it('records the successful runtime and exits', () => {
    expect(record).toContain('Python: `3.13.15`');
    expect(record).toContain('Node.js: `v24.17.0`');
    expect(record).toContain('npm: `11.13.0`');
    expect(record).toContain('- status: `PASS`');
  });

  it('records all three case outcomes', () => {
    expect(record).toContain('decision: `CONFIRMED_SUCCESS`');
    expect(record).toContain('decision: `INDETERMINATE`');
    expect(record).toContain('effect: `UNKNOWN`');
    expect(record).toContain('decision: `INCOMPLETE`');
    expect(record).toContain('effect: `REPORTED_ONLY`');
  });

  it('preserves the R52 task-versus-effect distinction', () => {
    expect(record).toContain('This reproduced the central upstream claim:');
    expect(record).toContain('original effect remained unknown');
  });

  it('does not inflate the result into external HandoffProbe adoption', () => {
    expect(record).toContain('does not demonstrate external HandoffProbe adoption');
    expect(record).toContain('does not by itself satisfy P11.6 or P12.6');
    expect(ledger).toContain('P12.6 external HandoffProbe product-use evidence');
  });

  it('links the evidence through roadmap and docs index', () => {
    expect(roadmap).toContain('docs/VATE_A2A_EVIDENCE_REPRODUCTION_20260925.md');
    expect(index).toContain('VATE_A2A_EVIDENCE_REPRODUCTION_20260925.md');
  });

  it('preserves the permanent public result-return link', () => {
    const resultUrl =
      'https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5837858177';

    expect(record).toContain(resultUrl);
    expect(ledger).toContain(resultUrl);
    expect(roadmap).toContain(resultUrl);
  });
});
