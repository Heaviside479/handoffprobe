import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { CrossingEffectRecorder } from '../src/phase9/crossing-corpus/effects.js';
import {
  CrossingPreDispatchRejectedError,
  type CrossingPreDispatchGate,
} from '../src/phase9/crossing-corpus/gate.js';
import {
  createCrossingObservationState,
  recordA2aCrossingObservation,
  toExternalCrossingObservedShape,
} from '../src/phase9/crossing-corpus/observation.js';
import { EvidenceRecorder } from '../src/protocol-lab/evidence.js';
import { callReadInvoiceThroughMcp } from '../src/protocol-lab/mcp/harness.js';
import type { SecurityContext } from '../src/protocol-lab/models.js';

const TOOL = 'analyze_property';

const REQUEST_A = {
  address: 'property:A',
  condition: 'average',
  purchase_price: 175000,
} as const;

const REQUEST_B = {
  ...REQUEST_A,
  address: 'property:B',
} as const;

const PAYMENT_TERMS = {
  scheme: 'exact',
  network: 'eip155:84532',
  amount: '80000',
  asset: 'synthetic:usdc',
  payTo: 'synthetic:recipient:r4',
  maxTimeoutSeconds: 60,
} as const;

const PAYMENT_PROOF = {
  id: 'synthetic-proof:r4:001',
  accepted: PAYMENT_TERMS,
  valid: true,
} as const;

const CONTEXT: SecurityContext = {
  principal: 'user:reddit-r4',
  caller: 'agent:r4-upstream',
  downstream: 'mcp:r4-local-fixture',
  tenant: 'tenant:r4',
  resource: 'property-analysis',
  capabilities: ['property.analyze'],
};

type Scenario = 'unchanged-paid-retry' | 'x402-only-mutated-retry' | 'request-bound-mutated-retry';

type Policy = 'x402_only' | 'request_bound';

interface RequestArguments {
  address: string;
  condition: string;
  purchase_price: number;
}

interface LayerState {
  paymentTerms: 'not_checked' | 'match' | 'mismatch';
  paymentVerification: 'not_checked' | 'accept' | 'reject';
  requestBinding: 'not_required' | 'match' | 'mismatch';
  policy: Policy;
  effectiveAddress?: string;
}

function paymentTermsId(terms: typeof PAYMENT_TERMS): string {
  return JSON.stringify([
    terms.scheme,
    terms.network,
    terms.amount,
    terms.asset,
    terms.payTo,
    terms.maxTimeoutSeconds,
  ]);
}

function requestDigest(tool: string, args: RequestArguments): string {
  const preimage = JSON.stringify([tool, args.address, args.condition, args.purchase_price]);

  return `sha256:${createHash('sha256').update(preimage, 'utf8').digest('hex')}`;
}

const REQUEST_A_BINDING = requestDigest(TOOL, REQUEST_A);

function createObservation(label: string) {
  const observation = createCrossingObservationState();

  recordA2aCrossingObservation(observation, {
    caller: CONTEXT.caller,
    messageId: `reddit-r4-${label}-message`,
    taskId: 'task:R4',
    contextId: 'context:R4',
    transportAuthenticated: true,
    taskServerResolved: true,
    contextServerResolved: true,
  });

  return observation;
}

function paymentTermsMatch(): boolean {
  return paymentTermsId(PAYMENT_PROOF.accepted) === paymentTermsId(PAYMENT_TERMS);
}

function createPaidRetryGate(policy: Policy, state: LayerState): CrossingPreDispatchGate {
  return (observation) => {
    const observed = toExternalCrossingObservedShape(observation);

    const args = observed.arguments as Partial<RequestArguments> | undefined;

    if (observed.tool !== TOOL) {
      throw new Error(`R-4 tool mismatch: expected ${TOOL}, received ${String(observed.tool)}`);
    }

    if (
      args === undefined ||
      typeof args.address !== 'string' ||
      typeof args.condition !== 'string' ||
      typeof args.purchase_price !== 'number'
    ) {
      throw new Error('R-4 paid retry arguments are incomplete.');
    }

    const effectiveArgs: RequestArguments = {
      address: args.address,
      condition: args.condition,
      purchase_price: args.purchase_price,
    };

    state.effectiveAddress = effectiveArgs.address;

    const termsMatch = paymentTermsMatch();

    state.paymentTerms = termsMatch ? 'match' : 'mismatch';

    const paymentVerified = termsMatch && PAYMENT_PROOF.valid === true;

    state.paymentVerification = paymentVerified ? 'accept' : 'reject';

    if (policy === 'request_bound') {
      state.requestBinding =
        requestDigest(TOOL, effectiveArgs) === REQUEST_A_BINDING ? 'match' : 'mismatch';
    } else {
      state.requestBinding = 'not_required';
    }

    const bindingAccepted = policy === 'x402_only' || state.requestBinding === 'match';

    const accepted = paymentVerified && bindingAccepted;

    return {
      decision: accepted
        ? {
            outcome: 'succeed',
            reason: 'accepted',
          }
        : {
            outcome: 'reject',
            reason: 'action_digest_mismatch',
          },
      observed,
      observationReady: true,
      provenanceReadiness: {
        complete: true,
        missing: [],
      },
    };
  };
}

function scenarioConfig(scenario: Scenario): {
  args: RequestArguments;
  policy: Policy;
  semantics: 'unchanged_retry' | 'expected_x402_only_semantics' | 'explicit_request_binding';
} {
  switch (scenario) {
    case 'unchanged-paid-retry':
      return {
        args: { ...REQUEST_A },
        policy: 'x402_only',
        semantics: 'unchanged_retry',
      };

    case 'x402-only-mutated-retry':
      return {
        args: { ...REQUEST_B },
        policy: 'x402_only',
        semantics: 'expected_x402_only_semantics',
      };

    case 'request-bound-mutated-retry':
      return {
        args: { ...REQUEST_B },
        policy: 'request_bound',
        semantics: 'explicit_request_binding',
      };
  }
}

async function runScenario(scenario: Scenario) {
  const config = scenarioConfig(scenario);

  const initialRequest = {
    tool: TOOL,
    arguments: { ...REQUEST_A },
    result: 'payment_required' as const,
    protectedEffectDelta: 0,
    paymentTerms: PAYMENT_TERMS,
  };

  const effects = new CrossingEffectRecorder();
  const before = effects.snapshot();

  const recorder = new EvidenceRecorder(`reddit-r4-${scenario}`, 'secure');

  const observation = createObservation(scenario);

  const state: LayerState = {
    paymentTerms: 'not_checked',
    paymentVerification: 'not_checked',
    requestBinding: 'not_required',
    policy: config.policy,
  };

  let dispatch: 'allowed' | 'blocked' = 'allowed';

  try {
    await callReadInvoiceThroughMcp(
      CONTEXT,
      recorder,
      observation,
      effects,
      createPaidRetryGate(config.policy, state),
      undefined,
      {
        tool: TOOL,
        arguments: {
          ...config.args,
        },
      },
    );
  } catch (error) {
    if (error instanceof CrossingPreDispatchRejectedError) {
      dispatch = 'blocked';
    } else {
      throw error;
    }
  }

  const delta = effects.deltaSince(before);

  return {
    scenario,
    semantics: config.semantics,

    initialRequest,

    paymentProofId: PAYMENT_PROOF.id,
    paymentProofTerms: paymentTermsId(PAYMENT_PROOF.accepted),
    requiredPaymentTerms: paymentTermsId(PAYMENT_TERMS),

    paidRetry: {
      tool: TOOL,
      arguments: config.args,
    },

    paymentTerms: state.paymentTerms,
    paymentVerification: state.paymentVerification,
    requestBinding: state.requestBinding,
    policy: state.policy,
    effectiveAddress: state.effectiveAddress,

    dispatch,
    protectedEffectDelta: delta.delta,

    mcpToolCallCount: recorder.events.filter((event) => event.event === 'mcp.tool.call').length,

    fakeToolExecuteCount: recorder.events.filter((event) => event.event === 'fake_tool.execute')
      .length,

    events: recorder.events.map((event) => event.event),
  };
}

describe('Reddit R-4 x402 paid-retry request binding', () => {
  it('freezes one deterministic synthetic payment requirement and proof', () => {
    expect(PAYMENT_TERMS.scheme).toBe('exact');
    expect(PAYMENT_TERMS.network).toBe('eip155:84532');

    expect(PAYMENT_PROOF.valid).toBe(true);

    expect(paymentTermsMatch()).toBe(true);

    expect(requestDigest(TOOL, REQUEST_A)).toBe(REQUEST_A_BINDING);

    expect(requestDigest(TOOL, REQUEST_B)).not.toBe(REQUEST_A_BINDING);
  });

  it('allows the unchanged paid retry', async () => {
    const result = await runScenario('unchanged-paid-retry');

    expect(result.initialRequest.result).toBe('payment_required');
    expect(result.initialRequest.protectedEffectDelta).toBe(0);

    expect(result.paidRetry.arguments).toEqual(REQUEST_A);

    expect(result.paymentTerms).toBe('match');
    expect(result.paymentVerification).toBe('accept');
    expect(result.requestBinding).toBe('not_required');

    expect(result.effectiveAddress).toBe('property:A');

    expect(result.dispatch).toBe('allowed');
    expect(result.protectedEffectDelta).toBe(1);

    expect(result.mcpToolCallCount).toBe(1);
    expect(result.fakeToolExecuteCount).toBe(1);
  });

  it('allows a mutated application argument under x402-only payment semantics', async () => {
    const result = await runScenario('x402-only-mutated-retry');

    expect(result.initialRequest.arguments.address).toBe('property:A');
    expect(result.paidRetry.arguments.address).toBe('property:B');

    expect(result.paymentProofTerms).toBe(result.requiredPaymentTerms);

    expect(result.paymentTerms).toBe('match');
    expect(result.paymentVerification).toBe('accept');
    expect(result.requestBinding).toBe('not_required');

    expect(result.semantics).toBe('expected_x402_only_semantics');

    expect(result.effectiveAddress).toBe('property:B');

    expect(result.dispatch).toBe('allowed');
    expect(result.protectedEffectDelta).toBe(1);

    expect(result.mcpToolCallCount).toBe(1);
    expect(result.fakeToolExecuteCount).toBe(1);
  });

  it('blocks the mutated retry when the composition explicitly binds request A', async () => {
    const result = await runScenario('request-bound-mutated-retry');

    expect(result.initialRequest.arguments.address).toBe('property:A');
    expect(result.paidRetry.arguments.address).toBe('property:B');

    expect(result.paymentTerms).toBe('match');
    expect(result.paymentVerification).toBe('accept');

    expect(result.requestBinding).toBe('mismatch');
    expect(result.semantics).toBe('explicit_request_binding');

    expect(result.dispatch).toBe('blocked');
    expect(result.protectedEffectDelta).toBe(0);

    expect(result.mcpToolCallCount).toBe(0);
    expect(result.fakeToolExecuteCount).toBe(0);
  });

  it('reproduces all three paid-retry summaries deterministically', async () => {
    for (const scenario of [
      'unchanged-paid-retry',
      'x402-only-mutated-retry',
      'request-bound-mutated-retry',
    ] as const) {
      const first = await runScenario(scenario);
      const second = await runScenario(scenario);

      expect(first).toEqual(second);
    }
  });
});
