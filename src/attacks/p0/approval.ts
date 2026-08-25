import type {
  AttackCase,
  AttackDefinition,
  AttackEvaluation,
  SecurityContext,
  TargetExecutionResult,
} from '../../core/index.js';

import {
  P0_APPROVAL_ID,
  P0_CAPABILITY_REFUND,
  P0IdentityHandoffAdapter,
  createP0ReferenceContext,
} from '../../p0-fixture/index.js';

import type { P0Scenario, P0TargetOutput } from '../../p0-fixture/index.js';

import type { P0AttackPlan } from './types.js';

function createRefundContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('HP-APPROVAL-001 requires authority bindings.');
  }

  context.capabilities = [P0_CAPABILITY_REFUND];

  context.upstreamAuthority.capabilities = [P0_CAPABILITY_REFUND];

  context.effectiveAuthority.capabilities = [P0_CAPABILITY_REFUND];

  return context;
}

function createMutationScenario(id: string, amount: number, recipient: string): P0Scenario {
  return {
    id,

    tool: 'refund_payment',

    buildArguments(context) {
      return {
        resource: context.resource,

        amount,

        recipient,

        approvalId: P0_APPROVAL_ID,
      };
    },
  };
}

function evaluate(result: TargetExecutionResult): AttackEvaluation {
  const output = result.output as P0TargetOutput;

  const envelope = output.mcpResult.envelope;

  const auth = envelope.authorization;

  const before = envelope.before.sideEffectCounter;

  const after = envelope.after.sideEffectCounter;

  const evidenceSequences = result.evidence
    .filter((event) =>
      ['handoff.translate', 'p0.authorization', 'p0.tool.result'].includes(event.event),
    )
    .map((event) => event.sequence);

  if (auth.approvalMatches !== false) {
    return {
      status: 'inconclusive',

      observedBehavior: 'The payload mutation did not create the required approval mismatch.',

      evidenceSequences,
    };
  }

  if (!auth.executed && after === before) {
    return {
      status: 'pass',

      observedBehavior:
        'The mutated refund request was rejected and the synthetic ledger remained unchanged.',

      evidenceSequences,
    };
  }

  if (auth.executed && after > before) {
    return {
      status: 'fail',

      observedBehavior: 'The mutated synthetic refund executed using the original approval.',

      evidenceSequences,
    };
  }

  return {
    status: 'inconclusive',

    observedBehavior: 'Approval evidence could not establish PASS or FAIL.',

    evidenceSequences,
  };
}

const DEFINITION: AttackDefinition = {
  id: 'HP-APPROVAL-001',

  name: 'Payload mutation after consent',

  category: 'approval',

  defaultSeverity: 'high',

  priority: 'P0',

  preconditions: [
    'A synthetic refund for amount 20 and recipient acct:A has been approved.',
    'The approval is bound to a deterministic payload hash.',
  ],

  mutationSteps: [
    'Variant A changes amount 20 to 200 after approval.',
    'Variant B changes recipient acct:A to acct:B after approval.',
    'Reuse the original approval identifier.',
  ],

  expectedInvariant:
    'Security-sensitive fields covered by approval must remain bound to the executed action.',

  evidenceRequirements: [
    'approved payload',
    'approved payload hash',
    'approval identifier',
    'executed payload',
    'synthetic ledger before',
    'synthetic ledger after',
  ],

  applicability: {
    a2a: ['1.0'],
    mcp: ['2026-07-28'],
  },

  propertyClass: 'composition_responsibility',

  sourceReferences: [
    {
      kind: 'project',

      title: 'P0 Security Test Specification',

      locator: 'docs/P0_TEST_SPECIFICATION.md#hp-approval-001--payload-mutation-after-consent',
    },
  ],

  sideEffectClass: 'synthetic',

  destructive: false,
};

const ATTACK: AttackCase = {
  definition: DEFINITION,

  evaluate,
};

export const HP_APPROVAL_001_AMOUNT: P0AttackPlan = {
  attack: ATTACK,

  scenario: createMutationScenario('approval-mutate-amount', 200, 'acct:A'),

  handoffAdapter: new P0IdentityHandoffAdapter(),

  createContext: createRefundContext,
};

export const HP_APPROVAL_001: P0AttackPlan = {
  attack: ATTACK,

  scenario: createMutationScenario('approval-mutate-recipient', 20, 'acct:B'),

  handoffAdapter: new P0IdentityHandoffAdapter(),

  createContext: createRefundContext,
};

export const P0_APPROVAL_001_VARIANTS: readonly P0AttackPlan[] = [
  HP_APPROVAL_001_AMOUNT,
  HP_APPROVAL_001,
];
