import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

const signal = read('docs/AACP_017_PREDICATE_AUTHORITY_SIGNAL_20260926.md');
const decision = read('docs/AACP_017_OVERLAP_ADMISSION_DECISION_20260926.md');
const ledger = read('docs/P12_6_EXTERNAL_SIGNAL_LEDGER_20260925.md');
const roadmap = read('docs/ROADMAP.md');
const research = read('docs/ROADMAP_RESEARCH_CANDIDATES.md');
const evidence = read('EVIDENCE.md');
const threat = read('docs/THREAT_MODEL.md');
const limits = read('docs/LIMITATIONS.md');
const catalog = read('docs/ATTACK_CATALOG.md');
const context = read('PROJECT_CONTEXT.md');
const vate = read('docs/VATE_A2A_EVIDENCE_REPRODUCTION_20260925.md');
const index = read('docs/README.md');

describe('AACP-017 external signal and 2026-09-26 follow-up', () => {
  it('pins the independent external HandoffProbe execution', () => {
    expect(signal).toContain('https://github.com/Heaviside479/handoffprobe/issues/185');
    expect(signal).toContain(
      'https://github.com/Heaviside479/handoffprobe/issues/185#issuecomment-5846617504',
    );
    expect(signal).toContain('31c3afc0e4253e77e3242fe46c3099ae9d6e1549');
    expect(signal).toContain('handoffprobe@0.4.0');
    expect(signal).toContain('secure corpus: `23 / 23 PASS`');
    expect(signal).toContain('vulnerable corpus: `23 / 23 FAIL`');
    expect(signal).toContain('`node reproduce.mjs`: exit `0`');
  });

  it('updates P12.6 without inventing adoption or GA readiness', () => {
    expect(ledger).toContain(
      'independently attributable external HandoffProbe execution: **present via',
    );
    expect(ledger).toContain('minimum GA evidence threshold remains undefined');
    expect(ledger).toContain('P12.6 external-use gate: **not claimed complete**');
    expect(ledger).toContain('adoption: **not claimed**');
    expect(roadmap).toContain('issue #185 / AACP-017');
  });

  it('keeps the stable corpus and admission boundary intact', () => {
    expect(signal).toContain('stable corpus remains **23 attacks**');
    expect(signal).toContain('no `HP-*` ID is reserved');
    expect(research).toContain('RC-8 — AACP-017 predicate-level authority normalization');
    expect(research).toContain('NO NEW STABLE ID');
    expect(catalog).toContain('predicate-equivalence solver');
  });

  it('pins the completed AACP-017 overlap/admission decision', () => {
    expect(decision).toContain(
      'COMPLETE — NO ADD / HP-AUTH-001-OWNED / BOUNDED REFINEMENT RESEARCH ONLY',
    );
    expect(decision).toContain(
      'NO ADD — retain stable `HP-AUTH-001`; do not reserve a new `HP-*` ID.',
    );
    expect(decision).toContain('keeps the stable corpus at **23 attacks**');
    expect(decision).toContain('No runtime change is authorized by this overlap decision.');
    expect(decision).toContain(
      'bounded `HP-AUTH-001` refinement research only, behind a separate proof gate.',
    );

    expect(signal).toContain('OVERLAP REVIEW COMPLETE / NO ADD');
    expect(research).toContain(
      'OVERLAP REVIEW COMPLETE — NO ADD / HP-AUTH-001-OWNED / BOUNDED REFINEMENT RESEARCH ONLY',
    );
    expect(roadmap).toContain('complete the AACP-017 overlap/admission review: **NO ADD**');
    expect(index).toContain('AACP_017_OVERLAP_ADMISSION_DECISION_20260926.md');
  });

  it('records the model limitation in current contracts', () => {
    expect(threat).toContain('Predicate-level authority representation boundary');
    expect(limits).toContain('Predicate and value-constraint limitation');
    expect(context).toContain(
      'published `handoffprobe@0.4.0` package is now recorded through issue #185',
    );
  });

  it('records the VATE author acknowledgement without promotion', () => {
    const ack =
      'https://github.com/Poke-nushi/Verifiable-Agent-Trust-Envelope/issues/2#issuecomment-5841835511';

    expect(ledger).toContain(ack);
    expect(vate).toContain(ack);
    expect(vate).toContain('AUTHOR ACKNOWLEDGEMENT OF THE REPRODUCTION RECORD');
    expect(vate).toContain('did not independently rerun HandoffProbe');
  });

  it('records the external execution in the evidence index and docs index', () => {
    expect(evidence).toContain('AACP-017 predicate-level authority external reproduction');
    expect(evidence).toContain(
      'independently attributable external HandoffProbe package execution',
    );
    expect(index).toContain('AACP_017_PREDICATE_AUTHORITY_SIGNAL_20260926.md');
  });
});
