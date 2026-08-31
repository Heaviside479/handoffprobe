import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const contributorLoop = readFileSync('docs/PHASE8_CONTRIBUTOR_LOOP_20260831.md', 'utf8');
const contributing = readFileSync('CONTRIBUTING.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');

describe('Phase 8.5A Contributor-Loop', () => {
  it('definiert den reproduzierbaren Contributor-Quickstart', () => {
    expect(contributorLoop).toContain('Voraussetzung ist Node.js 24.');
    expect(contributorLoop).toContain('npm ci');
    expect(contributorLoop).toContain('npm run check');
    expect(contributorLoop).toContain('npm run package:check');
    expect(contributorLoop).toContain('git diff --check');
  });

  it('bindet Beiträge an vorhandene synthetische Fixture-Flächen', () => {
    expect(contributorLoop).toContain('`src/p0-fixture`');
    expect(contributorLoop).toContain('`src/p1-fixture`');
    expect(contributorLoop).toContain('`src/protocol-lab`');
    expect(contributorLoop).toContain(
      'Die aktuelle Protokoll-Baseline bleibt A2A `1.0` → MCP `2026-07-28`.',
    );
    expect(contributorLoop).toContain(
      'keine kostenpflichtige KI-API oder kostenpflichtige Cloud-Pflicht',
    );
  });

  it('definiert klare Test-Erwartungen', () => {
    expect(contributorLoop).toContain('## Test-Erwartungen');
    expect(contributorLoop).toContain('### Dokumentationsänderung');
    expect(contributorLoop).toContain('### Fixture- oder Verhaltensänderung');
    expect(contributorLoop).toContain(
      'Ein bestehender Sicherheits- oder Regressionstest darf nicht lediglich gelockert, übersprungen oder entfernt werden',
    );
  });

  it('definiert fokussierte kleine externe Aufgaben', () => {
    expect(contributorLoop).toContain('### Aufgabe A — Clean-Clone-Quickstart verifizieren');
    expect(contributorLoop).toContain(
      '### Aufgabe B — Windows-PowerShell-Beitragspfad dokumentieren',
    );
    expect(contributorLoop).toContain('### Aufgabe C — Bestehende synthetische Fixture erklären');
  });

  it('klassifiziert Issue 20 nicht als Einsteigeraufgabe', () => {
    expect(contributorLoop).toContain(
      'Issue `#20` wird in Phase 8.5A nicht als `good first issue` behandelt',
    );
    expect(contributorLoop).toContain('löst keinen automatischen Adapter-Bau aus');
  });

  it('verlinkt den Contributor-Loop öffentlich', () => {
    expect(contributing).toContain(
      '[Phase-8.5A-Contributor-Quickstart](docs/PHASE8_CONTRIBUTOR_LOOP_20260831.md)',
    );
    expect(readme).toContain('[Contributor-Quickstart](docs/PHASE8_CONTRIBUTOR_LOOP_20260831.md)');
  });

  it('verankert die veröffentlichten externen Aufgaben und schließt 8.5A', () => {
    expect(contributorLoop).toContain('https://github.com/Heaviside479/handoffprobe/issues/22');
    expect(contributorLoop).toContain('https://github.com/Heaviside479/handoffprobe/issues/23');
    expect(contributorLoop).toContain('https://github.com/Heaviside479/handoffprobe/issues/24');
    expect(roadmap).toContain(
      '- [x] 8.5A — reduce contributor friction with focused external tasks and fixtures',
    );
    expect(roadmap).toContain('Phase 8.5A Abschlussprotokoll:');
    expect(roadmap).toContain('Issues `#22`, `#23` und `#24` sind als `good first issue`');
  });
});
