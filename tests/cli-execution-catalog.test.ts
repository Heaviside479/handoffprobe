import { describe, expect, it } from 'vitest';

import {
  CLI_EXECUTION_CATALOG,
  CLI_EXECUTION_CATALOG_BY_ID,
  getCliExecutionBinding,
} from '../src/cli/execution-catalog.js';
import { CoreRunner } from '../src/core/index.js';

const EXPECTED_IDS = [
  'HP-APPROVAL-001',
  'HP-AUTH-001',
  'HP-AUTH-002',
  'HP-AUTH-003',
  'HP-CRED-001',
  'HP-CRED-002',
  'HP-ID-001',
  'HP-ID-002',
  'HP-LIFECYCLE-001',
  'HP-TARGET-001',
  'HP-TARGET-002',
  'HP-TENANT-001',
  'HP-APPROVAL-002',
  'HP-APPROVAL-003',
  'HP-AUDIT-001',
  'HP-AUTH-004',
  'HP-AUTH-005',
  'HP-RACE-001',
  'HP-RACE-002',
  'HP-REPLAY-001',
  'HP-REPLAY-002',
  'HP-REPLAY-003',
] as const;

describe('CLI execution catalog', () => {
  it('binds exactly the 22 stable attacks in deterministic P0/P1 ID order', () => {
    const ids = CLI_EXECUTION_CATALOG.map((binding) => binding.definition.id);

    expect(ids).toEqual(EXPECTED_IDS);
    expect(new Set(ids).size).toBe(22);
    expect(CLI_EXECUTION_CATALOG_BY_ID.size).toBe(22);
  });

  it('reuses the canonical AttackDefinition owned by each AttackCase', () => {
    for (const binding of CLI_EXECUTION_CATALOG) {
      expect(binding.definition).toBe(binding.attack.definition);
      expect(binding.definition.id).toMatch(/^HP-[A-Z]+-\d{3}$/);
    }
  });

  it('creates fresh contexts and both bundled target modes for every binding', () => {
    for (const binding of CLI_EXECUTION_CATALOG) {
      const firstContext = binding.createContext();
      const secondContext = binding.createContext();

      expect(firstContext).not.toBe(secondContext);

      const secure = binding.createTarget('secure');
      const vulnerable = binding.createTarget('vulnerable');

      expect(secure).not.toBe(vulnerable);
      expect(secure.id).toContain('secure');
      expect(vulnerable.id).toContain('vulnerable');
    }
  });

  it('looks up canonical bindings by stable attack ID', () => {
    for (const id of EXPECTED_IDS) {
      const binding = getCliExecutionBinding(id);

      expect(binding).toBeDefined();
      expect(binding?.definition.id).toBe(id);
    }

    expect(getCliExecutionBinding('HP-UNKNOWN-999')).toBeUndefined();
  });

  it('passes every stable attack against the bundled secure target', async () => {
    const runner = new CoreRunner();

    for (const binding of CLI_EXECUTION_CATALOG) {
      const id = binding.definition.id;
      const result = await runner.run({
        attack: binding.attack,
        target: binding.createTarget('secure'),
        context: binding.createContext(),
        runId: `cli-catalog:secure:${id}`,
      });

      if (result.error !== undefined) {
        throw new Error(`${id}: secure catalog execution returned ${result.error.code}.`);
      }

      expect(result.finding.status).toBe('pass');
      expect(result.finding.testId).toBe(id);
    }
  });

  it('reproduces FAIL for every stable attack against the bundled vulnerable target', async () => {
    const runner = new CoreRunner();

    for (const binding of CLI_EXECUTION_CATALOG) {
      const id = binding.definition.id;
      const result = await runner.run({
        attack: binding.attack,
        target: binding.createTarget('vulnerable'),
        context: binding.createContext(),
        runId: `cli-catalog:vulnerable:${id}`,
      });

      if (result.error !== undefined) {
        throw new Error(`${id}: vulnerable catalog execution returned ${result.error.code}.`);
      }

      expect(result.finding.status).toBe('fail');
      expect(result.finding.testId).toBe(id);
    }
  });
});
