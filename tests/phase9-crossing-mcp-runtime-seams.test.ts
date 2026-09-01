import { describe, expect, it } from 'vitest';

import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
import { toExternalCrossingObservedShape } from '../src/phase9/crossing-corpus/observation.js';
import { runProtocolFixture } from '../src/protocol-lab/fixture.js';
import type { CrossingMcpRuntimeOverride } from '../src/protocol-lab/models.js';

type ExpectedRejectReason = 'audience_mismatch' | 'action_digest_mismatch';

function expectedRejectReason(id: string): ExpectedRejectReason {
  return id === 'audience' ? 'audience_mismatch' : 'action_digest_mismatch';
}

interface SeamCase {
  readonly id: string;
  readonly override: CrossingMcpRuntimeOverride;
  readonly assertDifference: (
    actual: ReturnType<typeof toExternalCrossingObservedShape>,
    authority: ReturnType<typeof toExternalCrossingObservedShape>,
  ) => void;
}

const SEAMS: readonly SeamCase[] = [
  {
    id: 'audience',
    override: {
      audience: 'https://mcp.example/other',
    },
    assertDifference(actual, authority) {
      expect(actual.mcp_audience.value).toBe('https://mcp.example/other');

      expect(authority.mcp_audience.value).toBe('http://handoffprobe.local/mcp');
    },
  },
  {
    id: 'tool',
    override: {
      tool: 'interop.other',
    },
    assertDifference(actual, authority) {
      expect(actual.tool).toBe('interop.other');
      expect(authority.tool).toBe('read_invoice');
    },
  },
  {
    id: 'arguments',
    override: {
      arguments: {
        message: 'substituted',
      },
    },
    assertDifference(actual, authority) {
      expect(actual.arguments).toEqual({
        message: 'substituted',
      });

      expect(authority.arguments).toMatchObject({
        principal: 'user:alice',
        caller: 'agent:sales',
        downstream: 'agent:billing',
        tenant: 'tenant:acme',
        resource: 'invoice:INV-1001',
        capability: 'invoice.read',
      });
    },
  },
];

describe('Phase 9 MCP crossing runtime seams', () => {
  for (const seam of SEAMS) {
    it('dispatches the mutated ' + seam.id + ' in the native lane', async () => {
      const effects = new CrossingEffectRecorder();
      const before = effects.snapshot();

      const result = await runProtocolFixture('secure', {
        runId: 'hp-phase9-mcp-' + seam.id + '-native-001',
        crossingObservation: true,
        crossingEffectRecorder: effects,
        crossingMcpRuntimeOverride: seam.override,
      });

      const observation = result.crossingObservation;

      if (observation === undefined) {
        throw new Error('Native MCP seam produced no observation.');
      }

      const actual = toExternalCrossingObservedShape(observation);

      if (seam.id === 'audience') {
        expect(actual.mcp_audience.value).toBe('https://mcp.example/other');
      }

      if (seam.id === 'tool') {
        expect(actual.tool).toBe('interop.other');
      }

      if (seam.id === 'arguments') {
        expect(actual.arguments).toEqual({
          message: 'substituted',
        });
      }

      expect(effects.deltaSince(before)).toEqual({
        before: 0,
        after: 1,
        delta: 1,
      });
    });

    it('exposes the mutated ' + seam.id + ' to the gate before effect', async () => {
      const effects = new CrossingEffectRecorder();
      const before = effects.snapshot();

      let gateCalls = 0;
      let gateDecision:
        | {
            outcome: 'reject';
            reason: ExpectedRejectReason;
          }
        | undefined;

      await expect(
        runProtocolFixture('secure', {
          runId: 'hp-phase9-mcp-' + seam.id + '-gate-001',
          crossingObservation: true,
          crossingEffectRecorder: effects,
          crossingMcpRuntimeOverride: seam.override,
          crossingPreDispatchGate: (observation, authorityObservation) => {
            gateCalls += 1;

            if (authorityObservation === undefined) {
              throw new Error('MCP seam requires authority observation.');
            }

            const actual = toExternalCrossingObservedShape(observation);

            const authority = toExternalCrossingObservedShape(authorityObservation);

            seam.assertDifference(actual, authority);

            const decision = {
              outcome: 'reject' as const,
              reason: expectedRejectReason(seam.id),
            };

            gateDecision = decision;

            return {
              decision,
              observed: actual,
              observationReady: true,
              provenanceReadiness: {
                complete: false,
                missing: ['focused_test.provenance_not_measured'],
              },
            };
          },
        }),
      ).rejects.toThrow();

      expect(gateCalls).toBe(1);

      expect(gateDecision).toEqual({
        outcome: 'reject',
        reason: expectedRejectReason(seam.id),
      });

      expect(effects.deltaSince(before)).toEqual({
        before: 0,
        after: 0,
        delta: 0,
      });
    });
  }
});
