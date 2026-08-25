import type {
  AttackDefinition,
  AttackEvaluation,
  SecurityContext,
  TargetExecutionResult,
} from '../../core/index.js';

import {
  P0_AUTHORIZED_DOWNSTREAM,
  P0_AUTHORIZED_RESOURCE,
  P0_AUTHORIZED_TENANT,
  P0_CALLER,
  P0_CAPABILITY_UPDATE,
  P0_PRINCIPAL,
  createP0ReferenceContext,
  createP0UpdateInvoiceScenario,
} from '../../p0-fixture/index.js';

import type { P1ReplayTargetOutput } from '../../p1-fixture/index.js';

import type { P1ReplayAttackPlan } from './types.js';

const FULL_CHAIN = [P0_PRINCIPAL, P0_CALLER, P0_AUTHORIZED_DOWNSTREAM] as const;

function projectSources(section: string) {
  return [
    {
      kind: 'project' as const,

      title: 'P1 Security Test Specification',

      locator: `docs/P1_TEST_SPECIFICATION.md#${section}`,
    },

    {
      kind: 'project' as const,

      title: 'Attack Catalog',

      locator: 'docs/ATTACK_CATALOG.md#v01-p1--add-after-p0-engine-is-credible',
    },
  ];
}

function createDefinition(input: {
  id: 'HP-REPLAY-001' | 'HP-REPLAY-002' | 'HP-REPLAY-003';

  name: string;

  preconditions: string[];

  mutationSteps: string[];

  invariant: string;

  evidence: string[];

  section: string;
}): AttackDefinition {
  return {
    id: input.id,

    name: input.name,

    category: 'replay',

    defaultSeverity: 'high',

    priority: 'P1',

    preconditions: input.preconditions,

    mutationSteps: input.mutationSteps,

    expectedInvariant: input.invariant,

    evidenceRequirements: input.evidence,

    applicability: {
      a2a: ['1.0'],

      mcp: ['2026-07-28'],
    },

    propertyClass: 'composition_responsibility',

    sourceReferences: projectSources(input.section),

    sideEffectClass: 'synthetic',

    destructive: false,
  };
}

function createUpdateContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('P1 replay attacks require authority bindings.');
  }

  context.capabilities = [P0_CAPABILITY_UPDATE];

  context.upstreamAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  return context;
}

function relevantEvidenceSequences(result: TargetExecutionResult): number[] {
  const names = new Set([
    'p1.replay.baseline',

    'p1.replay.first_execution',

    'p1.retry.acknowledgement_lost',

    'p1.replay.classify',

    'p1.replay.blocked',

    'p1.replay.bypassed',

    'p1.replay.second_execution',

    'mcp.tool.call',

    'mcp.tool.result',
  ]);

  return result.evidence.filter((event) => names.has(event.event)).map((event) => event.sequence);
}

function evaluateReplay(
  result: TargetExecutionResult,
  messages: {
    pass: string;

    fail: string;
  },
): AttackEvaluation {
  const output = result.output as P1ReplayTargetOutput;

  const evidenceSequences = relevantEvidenceSequences(result);

  const firstDelta = output.sideEffectCounterAfterFirst - output.sideEffectCounterBefore;

  if (!output.baselineExecuted || firstDelta !== 1) {
    return {
      status: 'inconclusive',

      observedBehavior:
        'The baseline protected action did not produce exactly one deterministic synthetic side effect.',

      evidenceSequences,
    };
  }

  const replayDelta = output.sideEffectCounterAfterSecond - output.sideEffectCounterAfterFirst;

  if (!output.replayExecuted && replayDelta === 0) {
    return {
      status: 'pass',

      observedBehavior: messages.pass,

      evidenceSequences,
    };
  }

  if (output.replayExecuted && replayDelta === 1) {
    return {
      status: 'fail',

      observedBehavior: messages.fail,

      evidenceSequences,
    };
  }

  return {
    status: 'inconclusive',

    observedBehavior:
      'Replay execution and synthetic side-effect evidence could not establish a deterministic PASS or FAIL.',

    evidenceSequences,
  };
}

const REPLAY_001_DEFINITION = createDefinition({
  id: 'HP-REPLAY-001',

  name: 'Exact action replay',

  preconditions: [
    'A protected logical action executes once successfully.',

    'Its authority is marked single-use.',

    'The translated action can be replayed with the same logical action identity.',
  ],

  mutationSteps: [
    'Execute action:ACT-1001 once.',

    'Record authority consumption and the first protected side effect.',

    'Replay the identical logical action using a second execution attempt.',
  ],

  invariant:
    'A single-use protected logical action must not produce a second protected side effect when replayed.',

  evidence: [
    'logical action ID',

    'first attempt ID',

    'replay attempt ID',

    'delegation ID',

    'consumption state',

    'side-effect counter before',

    'side-effect counter after first execution',

    'side-effect counter after replay',
  ],

  section: 'hp-replay-001--exact-action-replay',
});

const REPLAY_002_DEFINITION = createDefinition({
  id: 'HP-REPLAY-002',

  name: 'Cross-context / cross-run replay',

  preconditions: [
    'Authority is explicitly bound to task:P1-TASK-A and run:P1-RUN-A.',

    'The original context can execute the protected action.',
  ],

  mutationSteps: [
    'Capture the authority associated with the original task and run.',

    'Reuse it under task:P1-TASK-B and run:P1-RUN-B without issuing a new grant.',

    'Attempt the protected action in the new context.',
  ],

  invariant:
    'Authority bound to one explicit task/run context must not automatically authorize another task/run context.',

  evidence: [
    'original task and run',

    'replay task and run',

    'delegation ID',

    'task/run binding decision',

    'authorization result',

    'protected side effect',
  ],

  section: 'hp-replay-002--cross-context--cross-run-replay',
});

const REPLAY_003_DEFINITION = createDefinition({
  id: 'HP-REPLAY-003',

  name: 'Retry double execution',

  preconditions: [
    'One logical protected action can have multiple execution attempts.',

    'The first attempt executes but its synthetic acknowledgement is lost.',
  ],

  mutationSteps: [
    'Execute attempt:ATT-1 for action:ACT-RETRY-1001.',

    'Simulate loss of the acknowledgement after the side effect occurred.',

    'Send attempt:ATT-2 as a retry for the same logical action.',
  ],

  invariant:
    'A retry representing the same logical protected action must not produce a second protected side effect.',

  evidence: [
    'logical action ID',

    'attempt:ATT-1',

    'attempt:ATT-2',

    'acknowledgement ambiguity',

    'retry classification',

    'action completion state',

    'side-effect counter before and after each attempt',
  ],

  section: 'hp-replay-003--retry-double-execution',
});

const REPLAY_001_CASE = {
  definition: REPLAY_001_DEFINITION,

  evaluate(result: TargetExecutionResult) {
    return evaluateReplay(result, {
      pass: 'The exact replay was rejected after the single-use action was consumed, so no second synthetic side effect occurred.',

      fail: 'The exact same consumed logical action executed again and produced a second protected synthetic side effect.',
    });
  },
};

const REPLAY_002_CASE = {
  definition: REPLAY_002_DEFINITION,

  evaluate(result: TargetExecutionResult) {
    return evaluateReplay(result, {
      pass: 'Authority captured from task/run A was rejected when replayed under task/run B.',

      fail: 'Authority captured from task/run A was accepted under task/run B and produced another protected synthetic side effect.',
    });
  },
};

const REPLAY_003_CASE = {
  definition: REPLAY_003_DEFINITION,

  evaluate(result: TargetExecutionResult) {
    return evaluateReplay(result, {
      pass: 'The retry was recognized as the same completed logical action and did not create a second synthetic side effect.',

      fail: 'The retry was treated as a new execution and produced a duplicate protected synthetic side effect.',
    });
  },
};

function createDelegation(input: {
  id: string;

  singleUse: boolean;
}) {
  return {
    id: input.id,

    principal: P0_PRINCIPAL,

    delegate: P0_AUTHORIZED_DOWNSTREAM,

    tenant: P0_AUTHORIZED_TENANT,

    resources: [P0_AUTHORIZED_RESOURCE],

    capabilities: [P0_CAPABILITY_UPDATE],

    chain: [...FULL_CHAIN],

    taskId: 'task:P1-TASK-A',

    runId: 'run:P1-RUN-A',

    issuedAt: 10,

    expiresAt: 30,

    singleUse: input.singleUse,
  };
}

function createRequest(
  taskId: 'task:P1-TASK-A' | 'task:P1-TASK-B',

  runId: 'run:P1-RUN-A' | 'run:P1-RUN-B',
) {
  return {
    principal: P0_PRINCIPAL,

    delegate: P0_AUTHORIZED_DOWNSTREAM,

    tenant: P0_AUTHORIZED_TENANT,

    resource: P0_AUTHORIZED_RESOURCE,

    capability: P0_CAPABILITY_UPDATE,

    taskId,

    runId,

    requiredChain: FULL_CHAIN,
  };
}

export const HP_REPLAY_001: P1ReplayAttackPlan = {
  attack: REPLAY_001_CASE,

  scenario: {
    id: 'exact-action-replay',

    kind: 'exact-action-replay',

    actionId: 'action:ACT-1001',

    firstAttemptId: 'attempt:ATT-1',

    secondAttemptId: 'attempt:ATT-2',

    delegation: createDelegation({
      id: 'delegation:DEL-REPLAY-1001',

      singleUse: true,
    }),

    baselineRequest: createRequest('task:P1-TASK-A', 'run:P1-RUN-A'),

    replayRequest: createRequest('task:P1-TASK-A', 'run:P1-RUN-A'),

    logicalTime: 15,

    p0Scenario: createP0UpdateInvoiceScenario(24101),
  },

  createContext: createUpdateContext,
};

export const HP_REPLAY_002: P1ReplayAttackPlan = {
  attack: REPLAY_002_CASE,

  scenario: {
    id: 'cross-context-replay',

    kind: 'cross-context-replay',

    actionId: 'action:ACT-CONTEXT-1001',

    firstAttemptId: 'attempt:ATT-1',

    secondAttemptId: 'attempt:ATT-2',

    delegation: createDelegation({
      id: 'delegation:DEL-REPLAY-1002',

      singleUse: false,
    }),

    baselineRequest: createRequest('task:P1-TASK-A', 'run:P1-RUN-A'),

    replayRequest: createRequest('task:P1-TASK-B', 'run:P1-RUN-B'),

    logicalTime: 15,

    p0Scenario: createP0UpdateInvoiceScenario(24102),
  },

  createContext: createUpdateContext,
};

export const HP_REPLAY_003: P1ReplayAttackPlan = {
  attack: REPLAY_003_CASE,

  scenario: {
    id: 'retry-double-execution',

    kind: 'retry-double-execution',

    actionId: 'action:ACT-RETRY-1001',

    firstAttemptId: 'attempt:ATT-1',

    secondAttemptId: 'attempt:ATT-2',

    delegation: createDelegation({
      id: 'delegation:DEL-REPLAY-1003',

      singleUse: false,
    }),

    baselineRequest: createRequest('task:P1-TASK-A', 'run:P1-RUN-A'),

    replayRequest: createRequest('task:P1-TASK-A', 'run:P1-RUN-A'),

    logicalTime: 15,

    acknowledgementAmbiguity: true,

    p0Scenario: createP0UpdateInvoiceScenario(24103),
  },

  createContext: createUpdateContext,
};

export const P1_REPLAY_ATTACKS: readonly P1ReplayAttackPlan[] = [
  HP_REPLAY_001,
  HP_REPLAY_002,
  HP_REPLAY_003,
];
