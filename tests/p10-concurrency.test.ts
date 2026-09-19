import { describe, expect, it } from 'vitest';

import { HP_RACE_001 } from '../src/attacks/p1/index.js';
import { CoreRunner } from '../src/core/index.js';
import { resolveCliTestSelection, runCliTests } from '../src/cli/test-command.js';
import { P1RaceTargetAdapter } from '../src/p1-fixture/index.js';

import type { CliTargetFixture } from '../src/cli/execution-catalog.js';
import type { P1FixtureMode } from '../src/p1-fixture/index.js';

async function runRaceInstance(fixture: P1FixtureMode, runId: string) {
  return new CoreRunner().run({
    attack: HP_RACE_001.attack,
    target: new P1RaceTargetAdapter(fixture, HP_RACE_001.scenario),
    context: HP_RACE_001.createContext(),
    runId,
    correlationId: runId + ':correlation',
  });
}

function eventCount(result: Awaited<ReturnType<typeof runRaceInstance>>, event: string): number {
  return result.evidence.filter((item) => item.event === event).length;
}

describe('P10.3 concurrency reliability', () => {
  it('keeps independent secure race executions isolated under concurrency', async () => {
    const runIds = Array.from({ length: 6 }, (_, index) => 'p10-concurrency-secure-' + index);

    const results = await Promise.all(runIds.map((runId) => runRaceInstance('secure', runId)));

    expect(results).toHaveLength(6);

    results.forEach((result, index) => {
      const runId = runIds[index];

      expect(result.finding.status).toBe('pass');
      expect(result.finding.runId).toBe(runId);
      expect(result.finding.correlationId).toBe(runId + ':correlation');
      expect(new Set(result.evidence.map((item) => item.runId))).toEqual(new Set([runId]));
      expect(new Set(result.evidence.map((item) => item.correlationId))).toEqual(
        new Set([runId + ':correlation']),
      );
      expect(eventCount(result, 'p1.race.arrive')).toBe(2);
      expect(eventCount(result, 'p1.race.side_effect')).toBe(1);
      expect(eventCount(result, 'p1.race.blocked')).toBe(1);
    });
  });

  it('keeps independent vulnerable race executions isolated under concurrency', async () => {
    const runIds = Array.from({ length: 6 }, (_, index) => 'p10-concurrency-vulnerable-' + index);

    const results = await Promise.all(runIds.map((runId) => runRaceInstance('vulnerable', runId)));

    expect(results).toHaveLength(6);

    results.forEach((result, index) => {
      const runId = runIds[index];

      expect(result.finding.status).toBe('fail');
      expect(result.finding.runId).toBe(runId);
      expect(result.finding.correlationId).toBe(runId + ':correlation');
      expect(new Set(result.evidence.map((item) => item.runId))).toEqual(new Set([runId]));
      expect(eventCount(result, 'p1.race.arrive')).toBe(2);
      expect(eventCount(result, 'p1.race.side_effect')).toBe(2);
      expect(eventCount(result, 'p1.race.blocked')).toBe(0);
    });
  });

  it('runs simultaneous full stable corpora without outcome drift', async () => {
    const selection = resolveCliTestSelection(undefined);

    expect(selection.unknownIds).toEqual([]);
    expect(selection.bindings).toHaveLength(23);

    const targets: readonly CliTargetFixture[] = ['secure', 'vulnerable', 'secure', 'vulnerable'];

    const runs = await Promise.all(
      targets.map((target) =>
        runCliTests({
          target,
          bindings: selection.bindings,
        }),
      ),
    );

    runs.forEach((run, index) => {
      const target = targets[index];

      expect(run.target).toBe(target);
      expect(run.selectedIds).toHaveLength(23);

      if (target === 'secure') {
        expect(run.summary).toEqual({
          pass: 23,
          fail: 0,
          notApplicable: 0,
          inconclusive: 0,
          error: 0,
          total: 23,
        });
      } else {
        expect(run.summary).toEqual({
          pass: 0,
          fail: 23,
          notApplicable: 0,
          inconclusive: 0,
          error: 0,
          total: 23,
        });
      }
    });

    expect(runs[0]?.selectedIds).toEqual(runs[2]?.selectedIds);
    expect(runs[1]?.selectedIds).toEqual(runs[3]?.selectedIds);
    expect(runs[0]?.results.map((result) => result.finding.status)).toEqual(
      runs[2]?.results.map((result) => result.finding.status),
    );
    expect(runs[1]?.results.map((result) => result.finding.status)).toEqual(
      runs[3]?.results.map((result) => result.finding.status),
    );
  }, 15_000);
});
