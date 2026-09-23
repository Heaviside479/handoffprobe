import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const record = readFileSync('docs/SANCTION_GATE_2_STALE_AUTHORITY_SIGNAL_20260923.md', 'utf8');
const candidates = readFileSync('docs/ROADMAP_RESEARCH_CANDIDATES.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const evidence = readFileSync('EVIDENCE.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');
const attackCatalog = readFileSync('docs/ATTACK_CATALOG.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  version: string;
};

describe('Sanction Gate #2 stale-authority external signal', () => {
  it('freezes the exact external source and origin', () => {
    expect(record).toContain('https://github.com/math-r-association/sanction-gate/issues/2');
    expect(record).toContain('https://github.com/a2aproject/A2A/issues/2250');
    expect(record).toContain('author: `01ehex`');
    expect(record).toContain('created: `2026-09-23T02:23:50Z`');
    expect(record).toContain(
      'https://github.com/math-r-association/sanction-gate/issues/2#issuecomment-5791932004',
    );
  });

  it('records the three-property decomposition and future vector', () => {
    expect(record).toContain('the sanction artifact is authentic and structurally valid');
    expect(record).toContain(
      'the sanction remains current for the exact action and context at effect time',
    );
    expect(record).toContain(
      'the effective action immediately before execution still matches the sanctioned `proposalHash`',
    );
    expect(record).toContain(
      'sanction admitted -> action held before effect -> sanction withdrawn or superseded -> same action resumes -> zero protected effects',
    );
  });

  it('classifies same-action stale authority under HP-RACE-002', () => {
    expect(record).toContain('HP-RACE-002 — governing same-action stale-state invariant');
    expect(record).toContain(
      'The fact that the stale state is represented by a sanction receipt or sanction decision does not by itself create a new failure class.',
    );
  });

  it('keeps HP-AUTH-006 adjacent but not governing', () => {
    expect(record).toContain('HP-AUTH-006 — adjacent but not governing');
    expect(record).toContain('an earlier protected effect completes legitimately');
    expect(record).toContain('a later **distinct protected effect** is attempted');
    expect(record).toContain('holding the same action before its first protected effect');
  });

  it('preserves stable product truth', () => {
    expect(packageJson.version).toBe('0.4.0');
    expect(readme).toContain('23 stable attacks total');
    expect(record).toContain('The stable public corpus remains **23 attacks**.');
    expect(record).toContain('The public package remains **handoffprobe@0.4.0**.');
    expect(record).toContain('does not reserve a new `HP-*` identifier');
  });

  it('does not invent implementation, conformance, adoption or reproduction', () => {
    expect(record).toContain('no Sanction Gate reference implementation exists');
    expect(record).toContain('no validated Sanction Gate conformance result exists');
    expect(record).toContain('HandoffProbe adoption');
    expect(record).toContain('independent HandoffProbe reproduction');
    expect(record).toContain('No completed `EVIDENCE.md` evidence-level promotion');
  });

  it('records the future direct-comparison gate', () => {
    expect(record).toContain('## Future direct comparison gate');
    expect(record).toContain('explicit withdrawal or supersession ordering');
    expect(record).toContain('a reference implementation or executable conformance vector');
  });

  it('indexes the signal without changing the stable attack catalog', () => {
    expect(candidates).toContain('## RC-7 — Sanction Gate sanction currency at effect time');
    expect(roadmap).toContain(
      '#### Sanction Gate #2 stale-authority / effect-time signal — 2026-09-23',
    );
    expect(evidence).toContain(
      'Sanction Gate #2 is frozen as an open design-level **external technical validation / traceability signal**',
    );
    expect(docsIndex).toContain('SANCTION_GATE_2_STALE_AUTHORITY_SIGNAL_20260923.md');
    expect(attackCatalog).toContain(
      'HP-AUTH-006 — Stale task authorization reused for later effect',
    );
    expect(attackCatalog).not.toContain('Sanction Gate');
  });
});
