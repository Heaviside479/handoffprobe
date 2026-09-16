import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const ARTIFACT = 'docs/T3_3_A2A_CONTEXT_BINDING_EXECUTION_20260916.md';

function readArtifact(): string {
  return readFileSync(ARTIFACT, 'utf8');
}

function vectorRows(text: string): string[] {
  return text.split('\n').filter((line) => /^\|\s*V(?:[1-9]|1[0-3])\s*\|/u.test(line));
}

describe('T-3.3 A2A context-binding comparison artifact', () => {
  it('records every frozen V1-V13 vector exactly once', () => {
    const artifact = readArtifact();
    const rows = vectorRows(artifact);

    expect(rows).toHaveLength(13);

    expect(rows.map((row) => /^\|\s*(V(?:[1-9]|1[0-3]))\s*\|/u.exec(row)?.[1])).toEqual([
      'V1',
      'V2',
      'V3',
      'V4',
      'V5',
      'V6',
      'V7',
      'V8',
      'V9',
      'V10',
      'V11',
      'V12',
      'V13',
    ]);
  });

  it('preserves the exact T-3.2 admission outcomes after execution', () => {
    const artifact = readArtifact();
    const rows = vectorRows(artifact);

    const row = (vector: string): string => {
      const match = rows.find((candidate) =>
        new RegExp(`^\\|\\s*${vector}\\s*\\|`, 'u').test(candidate),
      );

      if (match === undefined) {
        throw new Error(`Missing ${vector} row.`);
      }

      return match;
    };

    for (const vector of ['V1', 'V2', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V11']) {
      expect(row(vector)).toContain('**NO ADD**');
    }

    for (const vector of ['V10', 'V12']) {
      expect(row(vector)).toContain('**REFINEMENT**');
    }

    for (const vector of ['V3', 'V13']) {
      expect(row(vector)).toContain('**DISTINCT RESEARCH CANDIDATE**');
    }
  });

  it('records the new runtime evidence and fail-closed boundaries', () => {
    const artifact = readArtifact();

    expect(artifact).toContain('5 passed / 5');
    expect(artifact).toContain('Task-bound grant + another task in the same context is rejected');
    expect(artifact).toContain(
      'Both genuinely indeterminate trusted comparison (`INCONCLUSIVE`) and evaluator/runtime failure (`ERROR`) block protected dispatch with zero effects',
    );
    expect(artifact).toContain(
      'when that source is unavailable the request fails closed with zero protected effects',
    );
    expect(artifact).toContain(
      'The first current authority produces one effect; the later revoked authority is rejected before dispatch',
    );
  });

  it('keeps research, release and specification boundaries explicit', () => {
    const artifact = readArtifact();

    expect(artifact).toContain('T-3.2 merge commit: `8c15401eafeb92c9d37867d21891565ad65e11c3`');
    expect(artifact).toMatch(/exact execution-test Git blob: `[a-f0-9]{40}`/u);
    expect(artifact).toContain('stable corpus: exactly **22 attacks**');
    expect(artifact).toContain('package version: `0.3.0`');
    expect(artifact).toContain('No stable attack admission is made.');
    expect(artifact).toContain(
      'It is not treated as accepted or normative A2A specification text.',
    );
    expect(artifact).toContain('Status: **COMPLETE — 2026-09-16**');
    expect(artifact).toContain('Repository-wide quality/security gates completed successfully');
    expect(artifact).toContain('**81 / 81 test files passed**');
    expect(artifact).toContain('**417 / 417 tests passed**');
    expect(artifact).toContain('stable corpus remained **22 attacks**');
    expect(artifact).toContain(
      'T-3.3 is complete. T-3.4, the factual public reply to Arjun, is next and has not yet been posted.',
    );
  });
});
