import { describe, expect, it } from 'vitest';

import { CoreRunner, isSecurityFailure } from '../src/core/index.js';

import { HP_LIFECYCLE_001, P0_LIFECYCLE_BASELINE } from '../src/attacks/index.js';

import { P0TargetAdapter } from '../src/p0-fixture/index.js';

async function runLifecycle(fixture: 'secure' | 'vulnerable') {
  return new CoreRunner().run({
    attack: HP_LIFECYCLE_001.attack,

    target: new P0TargetAdapter(
      fixture,
      HP_LIFECYCLE_001.scenario,
      HP_LIFECYCLE_001.handoffAdapter,
    ),

    context: HP_LIFECYCLE_001.createContext(),

    runId: `p0-hp-lifecycle-001-${fixture}`,
  });
}

function sequence(result: Awaited<ReturnType<typeof runLifecycle>>, event: string): number {
  const value = result.evidence.find((candidate) => candidate.event === event)?.sequence;

  if (value === undefined) {
    throw new Error(`Missing lifecycle evidence event: ${event}`);
  }

  return value;
}

describe('productive HP-LIFECYCLE-001', () => {
  it('publishes stable HIGH P0 definition', () => {
    const definition = HP_LIFECYCLE_001.attack.definition;

    expect(definition.id).toBe('HP-LIFECYCLE-001');

    expect(definition.defaultSeverity).toBe('high');

    expect(definition.priority).toBe('P0');

    expect(definition.applicability).toEqual({
      a2a: ['1.0'],

      mcp: ['2026-07-28'],
    });
  });

  it('secure fixture blocks the side effect after cancellation', async () => {
    const result = await runLifecycle('secure');

    expect(result.finding.status).toBe('pass');

    expect(isSecurityFailure(result.finding)).toBe(false);

    const auth = result.evidence.find((event) => event.event === 'p0.authorization');

    expect(auth?.details).toMatchObject({
      authorizationResult: false,

      executed: false,

      policyMode: 'enforce',
    });

    expect(auth?.details.authorizationReasons).toContain('governing_task_cancelled');
  });

  it('vulnerable fixture executes protected side effect after cancellation', async () => {
    const result = await runLifecycle('vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(isSecurityFailure(result.finding)).toBe(true);

    const tool = result.evidence.find((event) => event.event === 'p0.tool.result');

    expect(tool?.details.executed).toBe(true);

    const before = (
      tool?.details.sideEffectStateBefore as
        | {
            sideEffectCounter?: number;
          }
        | undefined
    )?.sideEffectCounter;

    const after = (
      tool?.details.sideEffectStateAfter as
        | {
            sideEffectCounter?: number;
          }
        | undefined
    )?.sideEffectCounter;

    expect(typeof before).toBe('number');

    expect(typeof after).toBe('number');

    expect(after!).toBeGreaterThan(before!);
  });

  it('proves start -> request -> cancellation -> tool-result ordering', async () => {
    const result = await runLifecycle('vulnerable');

    const start = sequence(result, 'lifecycle.start');

    const request = sequence(result, 'mcp.tool.call');

    const cancellation = sequence(result, 'lifecycle.cancel');

    const toolResult = sequence(result, 'p0.tool.result');

    expect(start).toBeLessThan(request);

    expect(request).toBeLessThan(cancellation);

    expect(cancellation).toBeLessThan(toolResult);

    const cancel = result.evidence.find((event) => event.event === 'lifecycle.cancel');

    expect(cancel?.details).toMatchObject({
      taskId: P0_LIFECYCLE_BASELINE.taskId,

      previousState: 'active',

      state: 'cancelled',

      delayPoint: 'after_mcp_request_before_tool_execution',
    });
  });

  it('is reproducible across vulnerable runs', async () => {
    const first = await runLifecycle('vulnerable');

    const second = await runLifecycle('vulnerable');

    expect(
      first.evidence.map((event) => ({
        sequence: event.sequence,

        protocol: event.protocol,

        event: event.event,

        boundary: event.boundary,
      })),
    ).toEqual(
      second.evidence.map((event) => ({
        sequence: event.sequence,

        protocol: event.protocol,

        event: event.event,

        boundary: event.boundary,
      })),
    );
  });

  it('retains stable test ID and provenance', async () => {
    const result = await runLifecycle('vulnerable');

    const lifecycleEvents = result.evidence.filter((event) => event.event.startsWith('lifecycle.'));

    expect(lifecycleEvents).toHaveLength(2);

    expect(
      lifecycleEvents.every(
        (event) => event.testId === 'HP-LIFECYCLE-001' && event.provenance.length >= 1,
      ),
    ).toBe(true);

    expect(result.finding.evidenceSequences.length).toBeGreaterThanOrEqual(4);
  });
});
