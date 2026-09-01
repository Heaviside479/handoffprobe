import { describe, expect, it } from 'vitest';

import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
import { runProtocolFixture } from '../src/protocol-lab/fixture.js';

describe('Phase 9 crossing effect recorder', () => {
  it('records independent monotonic effect counts', () => {
    const recorder = new CrossingEffectRecorder();
    const before = recorder.snapshot();

    expect(before).toEqual({ count: 0 });

    recorder.recordEffect();

    expect(recorder.count).toBe(1);
    expect(recorder.deltaSince(before)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });
  });

  it('rejects invalid future snapshots', () => {
    const recorder = new CrossingEffectRecorder();

    expect(() => recorder.deltaSince({ count: 1 })).toThrow('Invalid crossing effect snapshot.');
  });

  it('counts only actual fake-tool executions and can span attempts', async () => {
    const recorder = new CrossingEffectRecorder();

    const firstBefore = recorder.snapshot();

    await runProtocolFixture('secure', {
      runId: 'hp-crossing-effect-001',
      crossingEffectRecorder: recorder,
    });

    expect(recorder.deltaSince(firstBefore)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });

    const secondBefore = recorder.snapshot();

    await runProtocolFixture('secure', {
      runId: 'hp-crossing-effect-002',
      crossingEffectRecorder: recorder,
    });

    expect(recorder.deltaSince(secondBefore)).toEqual({
      before: 1,
      after: 2,
      delta: 1,
    });
  });
});
