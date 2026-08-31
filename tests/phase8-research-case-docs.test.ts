import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { HP_AUTH_001 } from '../src/attacks/p0/authorization.js';

const researchFall = readFileSync('docs/PHASE8_RESEARCH_CASE_HP_AUTH_001_20260831.md', 'utf8');

const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');

describe('Phase 8.4A reproduzierbarer HP-AUTH-001 Research-Fall', () => {
  it('bindet den öffentlichen Fall an die produktive Attack-Definition', () => {
    const definition = HP_AUTH_001.attack.definition;

    expect(definition.id).toBe('HP-AUTH-001');
    expect(definition.name).toBe('Delegated authority amplification');
    expect(definition.defaultSeverity).toBe('high');
    expect(definition.propertyClass).toBe('composition_responsibility');
    expect(definition.applicability).toEqual({
      a2a: ['1.0'],
      mcp: ['2026-07-28'],
    });

    expect(researchFall).toContain(
      'Die effektive nachgelagerte Berechtigung darf die upstream delegierte Berechtigung nicht überschreiten.',
    );
    expect(researchFall).toContain('A2A `1.0`');
    expect(researchFall).toContain('MCP `2026-07-28`');
  });

  it('dokumentiert Mutation und erwartete Ergebnisse', () => {
    expect(researchFall).toContain('`invoice.read`');
    expect(researchFall).toContain('`invoice.update`');
    expect(researchFall).toContain('`invoice:INV-1001`');
    expect(researchFall).toContain('`update_invoice`');
    expect(researchFall).toContain(
      'PASS           HP-AUTH-001 Delegated authority amplification [HIGH]',
    );
    expect(researchFall).toContain(
      'FAIL           HP-AUTH-001 Delegated authority amplification [HIGH]',
    );
    expect(researchFall).toContain('SECURE_EXIT=0');
    expect(researchFall).toContain('VULNERABLE_EXIT=1');
  });

  it('bindet die Reproduktion an das unveränderliche öffentliche Paket', () => {
    expect(researchFall).toContain('handoffprobe@0.1.0');
    expect(researchFall).toContain('2aa56211d7559cac2cf2052275af45331fba6663');
  });

  it('trennt A2A, Handoff-Grenze und MCP sauber', () => {
    expect(researchFall).toContain('### A2A-lokale Beobachtung');
    expect(researchFall).toContain('### Beobachtung an der Handoff-Grenze');
    expect(researchFall).toContain('### MCP-lokale Beobachtung');
    expect(researchFall).toContain(
      'protokollübergreifender Autorisierungsfehler an der A2A-zu-MCP-Handoff-Grenze',
    );
  });

  it('hält die Responsible-Disclosure-Grenze fest', () => {
    expect(researchFall).toContain('keine private Meldung an einen Drittanbieter erforderlich');
    expect(researchFall).toContain(
      'Dieser Fall behauptet keine Schwachstelle in den A2A- oder MCP-Spezifikationen.',
    );
  });

  it('verlinkt den Research-Fall und schließt 8.4A in der Roadmap', () => {
    expect(readme).toContain(
      '[Reproduzierbarer Research-Fall HP-AUTH-001](docs/PHASE8_RESEARCH_CASE_HP_AUTH_001_20260831.md)',
    );
    expect(roadmap).toContain(
      '- [x] 8.4A — publish a reproducible research case with responsible-disclosure gates',
    );
    expect(roadmap).toContain('Phase 8.4A Abschlussprotokoll:');
    expect(roadmap).toContain(
      'Detailnachweis: `docs/PHASE8_RESEARCH_CASE_HP_AUTH_001_20260831.md`.',
    );
  });
});
