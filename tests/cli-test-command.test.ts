import { describe, expect, it } from 'vitest';

import { renderCliTestRun, resolveCliTestSelection, runCliTests } from '../src/cli/test-command.js';

describe('CLI test command execution', () => {
  it('selects all 22 stable attacks when no IDs are requested', () => {
    const selection = resolveCliTestSelection(undefined);

    expect(selection.unknownIds).toEqual([]);
    expect(selection.bindings).toHaveLength(22);
    expect(selection.bindings[0]?.definition.id).toBe('HP-APPROVAL-001');
    expect(selection.bindings[21]?.definition.id).toBe('HP-REPLAY-003');
  });

  it('deduplicates selection and preserves canonical catalog order', () => {
    const selection = resolveCliTestSelection([
      'HP-CRED-001',
      'HP-AUTH-001',
      'HP-CRED-001',
      'HP-NOT-999',
    ]);

    expect(selection.unknownIds).toEqual(['HP-NOT-999']);
    expect(selection.bindings.map((binding) => binding.definition.id)).toEqual([
      'HP-AUTH-001',
      'HP-CRED-001',
    ]);
  });

  it('executes the full secure corpus as 22 PASS findings', async () => {
    const selection = resolveCliTestSelection(undefined);

    const run = await runCliTests({
      target: 'secure',
      bindings: selection.bindings,
    });

    expect(run.selectedIds).toHaveLength(22);
    expect(run.summary).toEqual({
      pass: 22,
      fail: 0,
      notApplicable: 0,
      inconclusive: 0,
      error: 0,
      total: 22,
    });
  });

  it('executes a vulnerable subset as deterministic FAIL findings', async () => {
    const selection = resolveCliTestSelection(['HP-REPLAY-003', 'HP-AUTH-001', 'HP-CRED-001']);

    const run = await runCliTests({
      target: 'vulnerable',
      bindings: selection.bindings,
    });

    expect(run.selectedIds).toEqual(['HP-AUTH-001', 'HP-CRED-001', 'HP-REPLAY-003']);

    expect(run.summary).toEqual({
      pass: 0,
      fail: 3,
      notApplicable: 0,
      inconclusive: 0,
      error: 0,
      total: 3,
    });

    expect(run.results.map((result) => result.finding.status)).toEqual(['fail', 'fail', 'fail']);
  });

  it('renders protocol baseline, findings and summary deterministically', async () => {
    const selection = resolveCliTestSelection(['HP-AUTH-001']);

    const first = await runCliTests({
      target: 'secure',
      bindings: selection.bindings,
    });

    const second = await runCliTests({
      target: 'secure',
      bindings: selection.bindings,
    });

    const firstOutput = renderCliTestRun(first);
    const secondOutput = renderCliTestRun(second);

    expect(firstOutput).toBe(secondOutput);
    expect(firstOutput).toContain('Protocols: A2A 1.0 | MCP 2026-07-28');
    expect(firstOutput).toContain('PASS           HP-AUTH-001 Delegated authority amplification');
    expect(firstOutput).toContain('PASS: 1');
    expect(firstOutput).toContain('ERROR: 0');
    expect(firstOutput).toContain('Security gate: informational in Phase 5.3');
  });
});
