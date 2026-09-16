import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
import type { CrossingPreDispatchGate } from '../src/phase9/crossing-corpus/gate.js';
import {
  createCrossingObservationState,
  recordA2aCrossingObservation,
  toExternalCrossingObservedShape,
  type CrossingObservationState,
} from '../src/phase9/crossing-corpus/observation.js';
import { EvidenceRecorder } from '../src/protocol-lab/evidence.js';
import { callReadInvoiceThroughMcp } from '../src/protocol-lab/mcp/harness.js';
import type { SecurityContext } from '../src/protocol-lab/models.js';

const ROOT = process.cwd();
const FIXTURE_PATH = join(ROOT, 'tests/fixtures/t3/ca2a-cross-org-001.json');
const FIXED_AUDIENCE = 'http://handoffprobe.local/mcp';

interface T36Fixture {
  provenance: {
    repository: string;
    commit: string;
    source_file: string;
    source_blob: string;
    source_sha256: string;
    license: string;
    vector_id: string;
    upstream_expected: 'PASS';
  };
  vector: {
    id: string;
    expected: 'PASS';
    chain_artifact: {
      chain_id: string;
      hops: {
        delegatee: string;
        delegator: string;
        delegation_ref: string;
        scope: string;
        hop_signature: string;
      }[];
      leaf_action_ref: string;
      root_delegator: string;
      scope: string;
      version: string;
    };
    delegation_chain_ref: string;
    leaf_preimage: {
      agent_id: string;
      action_type: string;
      scope: string;
      timestamp: string;
    };
  };
}

type ResearchOutcome = 'PASS' | 'FAIL' | 'INCONCLUSIVE' | 'ERROR';

const FIXTURE = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8')) as T36Fixture;

const CONTEXT: SecurityContext = {
  principal: 'user:t3-ca2a-local',
  caller: FIXTURE.vector.leaf_preimage.agent_id,
  downstream: 'mcp:local-fixture',
  tenant: 'tenant:t3-ca2a',
  resource: 'synthetic:payment-route',
  capabilities: [FIXTURE.vector.leaf_preimage.scope],
};

function createObservation(label: string): CrossingObservationState {
  const observation = createCrossingObservationState();

  recordA2aCrossingObservation(observation, {
    caller: FIXTURE.vector.leaf_preimage.agent_id,
    messageId: `t3-ca2a-${label}-message`,
    taskId: `t3-ca2a-${label}-task`,
    contextId: 't3-ca2a-shared-context',
    transportAuthenticated: true,
    taskServerResolved: true,
    contextServerResolved: true,
  });

  return observation;
}

function verification(observation: CrossingObservationState): ReturnType<CrossingPreDispatchGate> {
  return {
    decision: {
      outcome: 'succeed',
      reason: 'accepted',
    },
    observed: toExternalCrossingObservedShape(observation),
    observationReady: true,
    provenanceReadiness: {
      complete: true,
      missing: [],
    },
  };
}

function scopeWithin(authorityScope: string, effectiveScope: string): boolean {
  if (effectiveScope === authorityScope) {
    return true;
  }

  if (authorityScope.endsWith(':*')) {
    const namespace = authorityScope.slice(0, -1);
    return effectiveScope.startsWith(namespace);
  }

  return effectiveScope.startsWith(`${authorityScope}:`);
}

class T36SemanticAuthorityWideningBlockedError extends Error {
  readonly researchOutcome: Extract<ResearchOutcome, 'PASS'> = 'PASS';

  constructor(
    readonly authorityScope: string,
    readonly effectiveScope: string,
  ) {
    super(
      `T-3.6 blocked downstream semantic authority widening: ${authorityScope} -> ${effectiveScope}`,
    );
    this.name = 'T36SemanticAuthorityWideningBlockedError';
  }
}

function ca2aEffectiveRequestGate(): CrossingPreDispatchGate {
  return (observation) => {
    const observed = toExternalCrossingObservedShape(observation);
    const authority = FIXTURE.vector.leaf_preimage;

    if (observed.caller_id !== authority.agent_id) {
      throw new Error('T-3.6 caller no longer matches the frozen cA2A leaf agent.');
    }

    if (observed.mcp_audience.value !== FIXED_AUDIENCE) {
      throw new Error('T-3.6 MCP audience changed from the owned fixed fixture binding.');
    }

    if (observed.mcp_audience.source !== 'pinned_configuration') {
      throw new Error('T-3.6 MCP audience is not observed from pinned configuration.');
    }

    if (observed.tool !== authority.action_type) {
      throw new Error('T-3.6 translated tool no longer matches the frozen leaf action.');
    }

    const effectiveScope = observed.arguments?.delegated_scope;

    if (typeof effectiveScope !== 'string') {
      throw new Error('T-3.6 delegated_scope is not observable at pre-dispatch.');
    }

    if (!scopeWithin(authority.scope, effectiveScope)) {
      throw new T36SemanticAuthorityWideningBlockedError(authority.scope, effectiveScope);
    }

    return verification(observation);
  };
}

describe('T-3.6 cA2A real-shape A2A-to-MCP execution', () => {
  it('preserves exact pinned provenance and the real positive control shape', () => {
    expect(FIXTURE.provenance).toEqual({
      repository: 'giskard09/argentum-core',
      commit: '4951899c6bb016928e299e9bf9993086885a45ae',
      source_file: 'examples/conformance/delegation-chain-ref/cross-org-vectors.json',
      source_blob: '39066b73db43c247be9a2b2e34578a111897a656',
      source_sha256: 'fab4982ccc557287c187244bb0106a2f82ac903a1da74e82e49a7808f7522f54',
      license: 'Apache-2.0',
      vector_id: 'cross-org-001-independent-signers',
      upstream_expected: 'PASS',
    });

    expect(FIXTURE.vector.id).toBe('cross-org-001-independent-signers');
    expect(FIXTURE.vector.expected).toBe('PASS');
    expect(FIXTURE.vector.chain_artifact.version).toBe('delegation-chain-ref-v1');
    expect(FIXTURE.vector.chain_artifact.root_delegator).toBe('test-cross-org-a');
    expect(FIXTURE.vector.chain_artifact.hops).toHaveLength(2);
    expect(FIXTURE.vector.leaf_preimage).toEqual({
      agent_id: 'test-cross-org-c',
      action_type: 'payment.route',
      scope: 'mycelium:payment',
      timestamp: '2026-08-01T10:00:00.000Z',
    });
  });

  it('allows the in-scope real-shape control and records exactly one local fake effect', async () => {
    const effects = new CrossingEffectRecorder();
    const before = effects.snapshot();
    const recorder = new EvidenceRecorder('t3-ca2a-real-shape-control', 'secure');
    const observation = createObservation('control');

    const result = await callReadInvoiceThroughMcp(
      CONTEXT,
      recorder,
      observation,
      effects,
      ca2aEffectiveRequestGate(),
      undefined,
      {
        tool: FIXTURE.vector.leaf_preimage.action_type,
        arguments: {
          delegated_scope: FIXTURE.vector.leaf_preimage.scope,
        },
      },
    );

    const observed = toExternalCrossingObservedShape(observation);

    expect(result.crossingVerification?.decision).toEqual({
      outcome: 'succeed',
      reason: 'accepted',
    });
    expect(observed.mcp_audience).toEqual({
      value: FIXED_AUDIENCE,
      source: 'pinned_configuration',
    });
    expect(observed.tool).toBe('payment.route');
    expect(observed.arguments).toEqual({
      delegated_scope: 'mycelium:payment',
    });
    expect(effects.deltaSince(before)).toEqual({
      before: 0,
      after: 1,
      delta: 1,
    });
    expect(recorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(1);
    expect(recorder.events.filter((event) => event.event === 'fake_tool.execute')).toHaveLength(1);

    const dispatched = recorder.events.find((event) => event.event === 'mcp.tool.call');
    expect(dispatched?.details.tool).toBe(observed.tool);
  });

  it('blocks a downstream scope widening before dispatch while the pinned upstream fixture stays unchanged', async () => {
    const effects = new CrossingEffectRecorder();
    const before = effects.snapshot();
    const recorder = new EvidenceRecorder('t3-ca2a-real-shape-widening', 'secure');
    const observation = createObservation('widening');

    await expect(
      callReadInvoiceThroughMcp(
        CONTEXT,
        recorder,
        observation,
        effects,
        ca2aEffectiveRequestGate(),
        undefined,
        {
          tool: FIXTURE.vector.leaf_preimage.action_type,
          arguments: {
            delegated_scope: 'mycelium:*',
          },
        },
      ),
    ).rejects.toMatchObject({
      name: 'T36SemanticAuthorityWideningBlockedError',
      researchOutcome: 'PASS',
      authorityScope: 'mycelium:payment',
      effectiveScope: 'mycelium:*',
    });

    const observed = toExternalCrossingObservedShape(observation);

    expect(FIXTURE.vector.expected).toBe('PASS');
    expect(FIXTURE.vector.leaf_preimage.scope).toBe('mycelium:payment');
    expect(observed.mcp_audience).toEqual({
      value: FIXED_AUDIENCE,
      source: 'pinned_configuration',
    });
    expect(observed.tool).toBe('payment.route');
    expect(observed.arguments).toEqual({
      delegated_scope: 'mycelium:*',
    });
    expect(effects.deltaSince(before)).toEqual({
      before: 0,
      after: 0,
      delta: 0,
    });
    expect(recorder.events.filter((event) => event.event === 'mcp.tool.call')).toHaveLength(0);
    expect(recorder.events.filter((event) => event.event === 'fake_tool.execute')).toHaveLength(0);
  });
});
