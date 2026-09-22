import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const record = readFileSync('docs/LANGGRAPH_8102_REPLAY_RESUME_SIGNAL_20260922.md', 'utf8');
const candidates = readFileSync('docs/ROADMAP_RESEARCH_CANDIDATES.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');
const attackCatalog = readFileSync('docs/ATTACK_CATALOG.md', 'utf8');
const readme = readFileSync('README.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  version: string;
};

describe('LangGraph #8102 replay/resume research signal', () => {
  it('freezes the exact external source without claiming external validation', () => {
    expect(record).toContain(
      'https://github.com/langchain-ai/langgraph/issues/8102#issuecomment-5774538909',
    );
    expect(record).toContain('author: `hippoley`');
    expect(record).toContain('created: `2026-09-22T09:58:04Z`');
    expect(record).toContain('It is not:');
    expect(record).toContain('independent reproduction of a HandoffProbe result');
    expect(record).toContain('evidence that LangGraph is vulnerable');
  });

  it('classifies the signal as refinement/composition rather than a new stable attack', () => {
    expect(record).toContain('**B — REFINEMENT / COMPOSITION / NO NEW STABLE ID**');
    expect(record).toContain('primary stale-decision resume case is a refinement of `HP-RACE-002`');
    expect(record).toContain('Crash/recovery therefore does not create a new replay class');
    expect(record).toContain(
      '`HP-AUTH-006` becomes relevant, but that is not the primary resume fixture',
    );
  });

  it('preserves the current stable product truth', () => {
    expect(packageJson.version).toBe('0.4.0');
    expect(readme).toContain('23 stable attacks total');
    expect(record).toContain('The stable corpus remains **23 attacks**.');
    expect(record).toContain('The public package remains **handoffprobe@0.4.0**.');
    expect(record).toContain('No release is triggered.');
  });

  it('does not add a LangGraph-derived stable attack to the catalog', () => {
    expect(attackCatalog).not.toContain('LANGGRAPH-8102');
    expect(attackCatalog).not.toContain('Durable admission-decision semantics');
    expect(record).toContain('does not:');
    expect(record).toContain('reserve a new `HP-*` identifier');
  });

  it('records RC-6 and indexes the detailed research record', () => {
    expect(candidates).toContain('## RC-6 — LangGraph durable admission decision across resume');
    expect(candidates).toContain(
      'Status: **FROZEN / OVERLAP COMPLETE — REFINEMENT / COMPOSITION / NO NEW STABLE ID**',
    );
    expect(candidates).toContain('docs/LANGGRAPH_8102_REPLAY_RESUME_SIGNAL_20260922.md');
    expect(docsIndex).toContain('LANGGRAPH_8102_REPLAY_RESUME_SIGNAL_20260922.md');
  });

  it('freezes the five minimum future research controls without implementing them', () => {
    expect(record).toContain('### Control 1 — clean resume');
    expect(record).toContain('### Control 2 — effective call changed');
    expect(record).toContain('### Control 3 — authority or policy state changed');
    expect(record).toContain('### Control 4 — crash/recovery of the same logical action');
    expect(record).toContain('### Control 5 — explicitly fresh reauthorization');
    expect(record).toContain('No fixture is implemented by this freeze record.');
  });
});
