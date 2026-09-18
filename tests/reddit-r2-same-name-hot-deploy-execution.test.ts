import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import {
  evaluateP0SemanticAuthority,
  type P0ProtectedOperation,
  type P0SemanticAuthorityDecision,
} from '../src/p0-fixture/index.js';
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

const TOOL_NAME = 'same-name-tool';
const INPUT_SCHEMA_ID = 'schema-v1';

type EffectClass = 'read_only' | 'protected_write';
type Scenario = 'positive-control' | 'secure-negative' | 'vulnerable-negative';
type ApprovalPolicy = 'capability_digest' | 'tool_name_only';

interface CapabilityDefinition {
  readonly toolName: string;
  readonly inputSchemaId: string;
  readonly effectClass: EffectClass;
}

const CAPABILITY_A: CapabilityDefinition = {
  toolName: TOOL_NAME,
  inputSchemaId: INPUT_SCHEMA_ID,
  effectClass: 'read_only',
};

const CAPABILITY_B: CapabilityDefinition = {
  toolName: TOOL_NAME,
  inputSchemaId: INPUT_SCHEMA_ID,
  effectClass: 'protected_write',
};

function capabilityId(capability: CapabilityDefinition): string {
  return [capability.toolName, capability.inputSchemaId, capability.effectClass].join('|');
}

const OPERATION_A = capabilityId(CAPABILITY_A);
const OPERATION_B = capabilityId(CAPABILITY_B);

const OPERATIONS: readonly P0ProtectedOperation[] = [
  {
    id: OPERATION_A,
    capability: TOOL_NAME,
    resource: INPUT_SCHEMA_ID,
    effect: CAPABILITY_A.effectClass,
  },
  {
    id: OPERATION_B,
    capability: TOOL_NAME,
    resource: INPUT_SCHEMA_ID,
    effect: CAPABILITY_B.effectClass,
  },
];

const CONTEXT: SecurityContext = {
  principal: 'user:reddit-r2',
  caller: 'agent:r2-upstream',
  downstream: 'mcp:r2-local-fixture',
  tenant: 'tenant:r2',
  resource: 'invoice:INV-R2',
  capabilities: ['invoice.process'],
};

const REQUEST_ARGUMENTS = {
  resource: 'invoice:INV-R2',
  operation: 'process',
} as const;

interface LayerState {
  authority: 'not_checked' | 'accept' | 'reject' | 'error';
  approval: 'not_checked' | 'match' | 'mismatch';
  authorityDecision?: P0SemanticAuthorityDecision;
  approvalPolicy: ApprovalPolicy;
  approvedDigest?: string;
  effectiveDigest?: string;
}

function capabilityDigest(capability: CapabilityDefinition): string {
  const preimage = JSON.stringify([
    capability.toolName,
    capability.inputSchemaId,
    capability.effectClass,
  ]);

  return `sha256:${createHash('sha256').update(preimage, 'utf8').digest('hex')}`;
}

function authorityDecisionFor(effective: CapabilityDefinition): P0SemanticAuthorityDecision {
  return evaluateP0SemanticAuthority({
    universe: OPERATIONS,
    upstreamAllowed: [OPERATION_A, OPERATION_B],
    translatedAllowed: [capabilityId(effective)],
  });
}

function createObservation(label: string) {
  const observation = createCrossingObservationState();

  recordA2aCrossingObservation(observation, {
    caller: CONTEXT.caller,
    messageId: `reddit-r2-${label}-message`,
    taskId: 'reddit-r2-shared-task',
    contextId: 'reddit-r2-shared-context',
    transportAuthenticated: true,
    taskServerResolved: true,
    contextServerResolved: true,
  });

  return observation;
}

function createApprovalGate(
  approved: CapabilityDefinition,
  effective: CapabilityDefinition,
  policy: ApprovalPolicy,
  state: LayerState,
): CrossingPreDispatchGate {
  return (observation) => {
    const observed = toExternalCrossingObservedShape(observation);

    if (observed.tool !== effective.toolName) {
      throw new Error(
        `R-2 effective tool mismatch: expected ${effective.toolName}, received ${String(
          observed.tool,
        )}`,
      );
    }

    const authorityDecision = authorityDecisionFor(effective);
    state.authorityDecision = authorityDecision;

    if (authorityDecision.status === 'error') {
      state.authority = 'error';
      throw new Error(`R-2 semantic authority evaluation failed: ${authorityDecision.reason}`);
    }

    state.authority = authorityDecision.status === 'pass' ? 'accept' : 'reject';

    const approvedDigest = capabilityDigest(approved);
    const effectiveDigest = capabilityDigest(effective);

    state.approvedDigest = approvedDigest;
    state.effectiveDigest = effectiveDigest;

    const approvalAccepted =
      policy === 'capability_digest'
        ? approvedDigest === effectiveDigest
        : approved.toolName === effective.toolName;

    state.approval = approvalAccepted ? 'match' : 'mismatch';

    const accepted = authorityDecision.status === 'pass' && approvalAccepted;

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
  approved: CapabilityDefinition;
  effective: CapabilityDefinition;
  policy: ApprovalPolicy;
} {
  switch (scenario) {
    case 'positive-control':
      return {
        approved: CAPABILITY_B,
        effective: CAPABILITY_B,
        policy: 'capability_digest',
      };

    case 'secure-negative':
      return {
        approved: CAPABILITY_A,
        effective: CAPABILITY_B,
        policy: 'capability_digest',
      };

    case 'vulnerable-negative':
      return {
        approved: CAPABILITY_A,
        effective: CAPABILITY_B,
        policy: 'tool_name_only',
      };
  }
}

async function runScenario(scenario: Scenario) {
  const config = scenarioConfig(scenario);
  const effects = new CrossingEffectRecorder();
  const before = effects.snapshot();

  const recorder = new EvidenceRecorder(
    `reddit-r2-${scenario}`,
    scenario === 'vulnerable-negative' ? 'vulnerable' : 'secure',
  );

  const observation = createObservation(scenario);

  const state: LayerState = {
    authority: 'not_checked',
    approval: 'not_checked',
    approvalPolicy: config.policy,
  };

  let dispatch: 'allowed' | 'blocked' = 'allowed';

  try {
    await callReadInvoiceThroughMcp(
      CONTEXT,
      recorder,
      observation,
      effects,
      createApprovalGate(config.approved, config.effective, config.policy, state),
      undefined,
      {
        tool: config.effective.toolName,
        arguments: {
          ...REQUEST_ARGUMENTS,
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
    approvedCapability: capabilityId(config.approved),
    effectiveCapability: capabilityId(config.effective),
    approvedToolName: config.approved.toolName,
    effectiveToolName: config.effective.toolName,
    approvedDigest: state.approvedDigest,
    effectiveDigest: state.effectiveDigest,
    approvalPolicy: state.approvalPolicy,
    approval: state.approval,
    authority: state.authority,
    authorityStatus: state.authorityDecision?.status,
    authorityWideningWitnesses: state.authorityDecision?.wideningWitnesses ?? [],
    dispatch,
    effectDelta: delta.delta,
    mcpToolCallCount: recorder.events.filter((event) => event.event === 'mcp.tool.call').length,
    fakeToolExecuteCount: recorder.events.filter((event) => event.event === 'fake_tool.execute')
      .length,
    events: recorder.events.map((event) => event.event),
  };
}

describe('Reddit R-2 same-name capability hot deploy after approval', () => {
  it('binds the approval digest to the security-relevant capability definition', () => {
    expect(CAPABILITY_A.toolName).toBe(CAPABILITY_B.toolName);
    expect(CAPABILITY_A.inputSchemaId).toBe(CAPABILITY_B.inputSchemaId);
    expect(CAPABILITY_A.effectClass).toBe('read_only');
    expect(CAPABILITY_B.effectClass).toBe('protected_write');

    expect(capabilityDigest(CAPABILITY_A)).not.toBe(capabilityDigest(CAPABILITY_B));
  });

  it('allows the positive control when approval is issued directly for capability B', async () => {
    const result = await runScenario('positive-control');

    expect(result.approvedCapability).toBe(OPERATION_B);
    expect(result.effectiveCapability).toBe(OPERATION_B);
    expect(result.authority).toBe('accept');
    expect(result.authorityStatus).toBe('pass');
    expect(result.authorityWideningWitnesses).toEqual([]);
    expect(result.approvalPolicy).toBe('capability_digest');
    expect(result.approval).toBe('match');
    expect(result.approvedDigest).toBe(result.effectiveDigest);
    expect(result.dispatch).toBe('allowed');
    expect(result.effectDelta).toBe(1);
    expect(result.mcpToolCallCount).toBe(1);
    expect(result.fakeToolExecuteCount).toBe(1);
  });

  it('securely rejects capability B when only capability A was approved', async () => {
    const result = await runScenario('secure-negative');

    expect(result.approvedCapability).toBe(OPERATION_A);
    expect(result.effectiveCapability).toBe(OPERATION_B);

    expect(result.approvedToolName).toBe(result.effectiveToolName);

    expect(result.authority).toBe('accept');
    expect(result.authorityStatus).toBe('pass');
    expect(result.authorityWideningWitnesses).toEqual([]);

    expect(result.approvalPolicy).toBe('capability_digest');
    expect(result.approval).toBe('mismatch');
    expect(result.approvedDigest).not.toBe(result.effectiveDigest);

    expect(result.dispatch).toBe('blocked');
    expect(result.effectDelta).toBe(0);
    expect(result.mcpToolCallCount).toBe(0);
    expect(result.fakeToolExecuteCount).toBe(0);
  });

  it('reproduces the vulnerable label-only approval path', async () => {
    const result = await runScenario('vulnerable-negative');

    expect(result.approvedCapability).toBe(OPERATION_A);
    expect(result.effectiveCapability).toBe(OPERATION_B);

    expect(result.approvedToolName).toBe(result.effectiveToolName);

    expect(result.authority).toBe('accept');
    expect(result.authorityStatus).toBe('pass');
    expect(result.authorityWideningWitnesses).toEqual([]);

    expect(result.approvedDigest).not.toBe(result.effectiveDigest);

    expect(result.approvalPolicy).toBe('tool_name_only');
    expect(result.approval).toBe('match');

    expect(result.dispatch).toBe('allowed');
    expect(result.effectDelta).toBe(1);
    expect(result.mcpToolCallCount).toBe(1);
    expect(result.fakeToolExecuteCount).toBe(1);
  });

  it('reproduces all three scenario summaries deterministically', async () => {
    for (const scenario of [
      'positive-control',
      'secure-negative',
      'vulnerable-negative',
    ] as const) {
      const first = await runScenario(scenario);
      const second = await runScenario(scenario);

      expect(first).toEqual(second);
    }
  });
});
