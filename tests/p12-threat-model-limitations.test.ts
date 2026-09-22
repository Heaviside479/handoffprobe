import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const threatModel = readFileSync('docs/THREAT_MODEL.md', 'utf8');
const limitations = readFileSync('docs/LIMITATIONS.md', 'utf8');
const evidence = readFileSync('docs/P12_2_THREAT_MODEL_LIMITATIONS_20260921.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const packageJsonText = readFileSync('package.json', 'utf8');

const phase12 = roadmap.slice(
  roadmap.indexOf('# Phase 12 — HandoffProbe v1.0 GA'),
  roadmap.indexOf('# Phase 13 — Commercial validation'),
);

describe('P12.2 threat model', () => {
  it('removes stale v0.1 release-facing wording', () => {
    expect(threatModel).not.toContain('The v0.1 threat model covers');
    expect(threatModel).not.toContain('v0.1 should use harmless fake tools');
  });

  it('records the current verified product boundary', () => {
    expect(threatModel).toContain('`handoffprobe@0.4.0`');
    expect(threatModel).toContain('23 stable attacks');
    expect(threatModel).toContain('A2A 1.0 -> MCP 2026-07-28');
    expect(threatModel).toContain('`HP-AUTH-006`');
  });

  it('separates stable coverage from research coverage', () => {
    expect(threatModel).toContain('## Current stable coverage');
    expect(threatModel).toContain('No stable ID currently admitted');
    expect(threatModel).toContain('Research or backlog only');
  });
});

describe('P12.2 limitations', () => {
  it('states runtime and protocol limits', () => {
    expect(limitations).toContain('Node.js >=24 <25');
    expect(limitations).toContain('A2A 1.0 -> MCP 2026-07-28');
  });

  it('distinguishes synthetic fixtures from production validation', () => {
    expect(limitations).toContain(
      'It does not prove that an unrelated production agent system is secure',
    );
  });

  it('does not claim certification', () => {
    expect(limitations).toContain('a security certification');
    expect(limitations).toContain('a guarantee that the system has no vulnerabilities');
  });

  it('keeps external evidence bounded', () => {
    expect(limitations).toContain('Silence from an upstream author or user is not validation');
  });
});

describe('P12.2 integration', () => {
  it('links current limitations and evidence', () => {
    expect(docsIndex).toContain('](LIMITATIONS.md)');
    expect(docsIndex).toContain('](P12_2_THREAT_MODEL_LIMITATIONS_20260921.md)');
    expect(readme).toContain('[Limitations](docs/LIMITATIONS.md)');
  });

  it('records completed P12.1 and P12.2 repository admission', () => {
    expect(phase12).toContain(
      'Status: **COMPLETE — merged through protected PR #171 on 2026-09-21**',
    );
    expect(phase12).toContain(
      'Status: **COMPLETE — merged through protected PR #172 on 2026-09-21**',
    );
  });

  it('does not authorize a release', () => {
    expect(packageJsonText).toContain('"version": "0.4.0"');
    expect(evidence).toContain('v1.0 GA');
  });
});
