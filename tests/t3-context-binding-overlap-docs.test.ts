import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const MATRIX = join(ROOT, 'docs/T3_2_A2A_CONTEXT_BINDING_OVERLAP_MATRIX_20260916.md');
const ROADMAP = join(ROOT, 'docs/ROADMAP.md');

describe('T-3.2 A2A context-binding overlap matrix', () => {
  it('classifies every frozen V1-V13 vector exactly once', () => {
    const matrix = readFileSync(MATRIX, 'utf8');

    const expected = new Map([
      ['V1', 'ALREADY COVERED'],
      ['V2', 'ALREADY COVERED'],
      ['V3', 'DISTINCT RESEARCH GAP'],
      ['V4', 'ALREADY COVERED'],
      ['V5', 'ALREADY COVERED'],
      ['V6', 'ALREADY COVERED'],
      ['V7', 'ALREADY COVERED'],
      ['V8', 'ALREADY COVERED'],
      ['V9', 'ALREADY COVERED'],
      ['V10', 'REFINEMENT'],
      ['V11', 'ALREADY COVERED'],
      ['V12', 'REFINEMENT'],
      ['V13', 'DISTINCT RESEARCH GAP'],
    ]);

    for (const [vector, classification] of expected) {
      const rowPattern = new RegExp(`^\\|\\s*${vector}\\s*\\|.*\\*\\*${classification}\\*\\*`, 'm');

      expect(matrix).toMatch(rowPattern);
    }

    const vectorRows = matrix.match(/^\|\s*V(?:[1-9]|1[0-3])\s*\|/gm) ?? [];

    expect(vectorRows).toHaveLength(13);
  });

  it('keeps the classification totals and stable-corpus guard explicit', () => {
    const matrix = readFileSync(MATRIX, 'utf8');

    expect(matrix).toContain('`ALREADY COVERED`: **9**');
    expect(matrix).toContain('`REFINEMENT`: **2**');
    expect(matrix).toContain('`DISTINCT RESEARCH GAP`: **2**');
    expect(matrix).toContain('`OUT OF SCOPE`: **0**');
    expect(matrix).toContain('stable corpus at exactly **22 attacks**');
  });

  it('admits research only for V3, V10, V12 and V13', () => {
    const matrix = readFileSync(MATRIX, 'utf8');

    expect(matrix).toContain('targeted T-3.3 research for V3, V10, V12 and V13 only');

    expect(matrix).toContain(
      'A runtime denial and a HandoffProbe vulnerability `FAIL` are not the same concept.',
    );

    expect(matrix).toContain('task-bound grant + another task in same context → reject');

    expect(matrix).toContain(
      'context-bound grant + another task in same context → continue only if every other binding and authority constraint remains valid',
    );

    expect(matrix).toContain(
      'A repeated transport attempt, replayed nonce or resumed action is not equivalent to multiple distinct effects intentionally produced under one task.',
    );
  });

  it('preserves T-3.2 completion after the T-3 combined closeout', () => {
    const roadmap = readFileSync(ROADMAP, 'utf8');

    expect(roadmap).toContain('Status: **COMPLETE — 2026-09-16; T-4.1 NEXT.**');

    expect(roadmap).toContain(
      '- [x] map V1–V13 from A2A `#1937` against all relevant stable attacks, Phase 9, T-1 and the T-2 contract;',
    );

    expect(roadmap).toContain(
      '- [x] classify each vector as `ALREADY COVERED / REFINEMENT / DISTINCT RESEARCH GAP / OUT OF SCOPE` with rationale;',
    );

    expect(roadmap).toContain(
      '- [x] reuse existing deterministic HandoffProbe machinery wherever the vector is already represented;',
    );

    expect(roadmap).toContain(
      'https://github.com/a2aproject/A2A/issues/1937#issuecomment-5695896491',
    );

    expect(roadmap).toContain(
      'https://github.com/a2aproject/A2A/issues/2079#issuecomment-5699008862',
    );
  });
});
