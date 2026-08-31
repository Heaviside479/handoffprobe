import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const review = readFileSync('docs/PHASE8_REVIEW_20260831.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('Phase 8.6A adoption and research review', () => {
  it('bindet den Review an die ursprüngliche Baseline und den aktuellen Snapshot', () => {
    expect(review).toContain('GitHub Views | 4');
    expect(review).toContain('GitHub Views | 6');
    expect(review).toContain('GitHub Clones | 87');
    expect(review).toContain('GitHub Clones | 244');
    expect(review).toContain('Unique Cloner | 55');
    expect(review).toContain('Unique Cloner | 103');
    expect(review).toContain('npm last-day | 142');
    expect(review).toContain('Release-Asset-Downloads | 3 | +0');
  });

  it('hält die Interpretationsgrenzen der Rohmetriken fest', () => {
    expect(review).toContain('GitHub Traffic ist ein rollierendes 14-Tage-Fenster');
    expect(review).toContain(
      'werden nicht als 244 beziehungsweise 103 HandoffProbe-Nutzer bezeichnet',
    );
    expect(review).toContain('Die 8.0A-Baseline hatte für diese Endpunkte HTTP 404');
    expect(review).toContain('Stars, Forks und Subscriber bleiben bei `0`');
  });

  it('bindet die neue externe Evidenz an Issue 20 und den eingefrorenen Corpus', () => {
    expect(review).toContain('Issue `#20` von `Silentpartnercoding`');
    expect(review).toContain('09aca453f9d5e5552e4ed2cfbda2ed0b22e4d51a');
    expect(review).toContain('f7a72b5c1c0473080aff468d1af6b0500d035d6a00ebbfce1d2499a0897534fb');
    expect(review).toContain('28 datengetriebene Fälle');
    expect(review).toContain('externe Effektbeobachtung');
  });

  it('wählt einen schmalen evidence-backed Phase-9-Pfad statt breiter Framework-Expansion', () => {
    expect(review).toContain(
      'Phase 9 soll nicht mit einem breit angelegten Framework-Adapter beginnen',
    );
    expect(review).toContain('eine schmale externe Crossing-Corpus-Conformance-Integration');
    expect(review).toContain(
      'Matching-, refuting-, partial- oder non-green Ergebnisse sind zulässige Research-Evidenz',
    );
  });

  it('prüft den Phase-9-Admission-Gate explizit', () => {
    expect(review).toContain('## Phase-9-Admission für Issue #20');
    expect(review).toContain('Meaningful handoff/composition path');
    expect(review).toContain('Real demand / research evidence');
    expect(review).toContain('Handoff-specific security value');
    expect(review).toContain('Deterministic reproduction');
    expect(review).toContain('Maintenance/version risk understood');
    expect(review).toContain('No paid infrastructure');
  });

  it('hält die externen Evidenz- und Sicherheitsgrenzen fest', () => {
    expect(review).toContain(
      'native Effekte werden durch einen vom Verifier getrennten Effect Recorder beobachtet',
    );
    expect(review).toContain(
      'Referenz-Fixture-Zeilen dürfen keine Lücken in externer Evidenz füllen',
    );
    expect(review).toContain('das veröffentlichte `handoffprobe@0.1.0` bleibt unveränderlich');
  });

  it('schließt 8.6A in der Roadmap und verankert den Phase-9-Zielpfad', () => {
    expect(roadmap).toContain(
      '- [x] 8.6A — re-measure adoption, review findings and choose Phase 9 from evidence',
    );
    expect(roadmap).toContain('Phase 8.6A Abschlussprotokoll:');
    expect(roadmap).toContain('Issue `#20` — externe Crossing-Corpus-Conformance-Integration');
    expect(roadmap).toContain('docs/PHASE8_REVIEW_20260831.md');
  });
});
