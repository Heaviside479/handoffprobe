import type {
  AttackDefinition,
  AttackEvaluation,
  SecurityContext,
  TargetExecutionResult,
} from '../../core/index.js';

import {
  P0_APPROVAL_ID,
  P0_APPROVED_REFUND_PAYLOAD,
  P0_AUTHORIZED_RESOURCE,
  P0_AUTHORIZED_TENANT,
  P0_CAPABILITY_REFUND,
  P0_CAPABILITY_UPDATE,
  createP0ReferenceContext,
  hashApprovalPayload,
} from '../../p0-fixture/index.js';

import type { P0Scenario } from '../../p0-fixture/index.js';

import type { P1ApprovalTargetOutput } from '../../p1-fixture/index.js';

import type { P1ApprovalAttackPlan } from './types.js';

const P1_APPROVAL_ALT_RESOURCE = 'invoice:INV-1003';

const P1_APPROVAL_UPDATE_ID = 'approval:update-invoice-1001';

const APPROVED_UPDATE_PAYLOAD = {
  amountCents: 15000,
} as const;

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
  id: 'HP-APPROVAL-002' | 'HP-APPROVAL-003';

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

    category: 'approval',

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

function createUpdateScenario(id: string, resource: string, amountCents: number): P0Scenario {
  return {
    id,

    tool: 'update_invoice',

    buildArguments() {
      return {
        resource,

        amountCents,
      };
    },
  };
}

function createToolSubstitutionContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('HP-APPROVAL-002 requires authority bindings.');
  }

  /*
   * Both actions are allowed by
   * ordinary authority.
   *
   * Therefore approval/tool binding
   * is the property under test.
   */
  context.capabilities = [P0_CAPABILITY_REFUND, P0_CAPABILITY_UPDATE];

  context.upstreamAuthority.capabilities = [P0_CAPABILITY_REFUND, P0_CAPABILITY_UPDATE];

  context.effectiveAuthority.capabilities = [P0_CAPABILITY_REFUND, P0_CAPABILITY_UPDATE];

  return context;
}

function createResourceReuseContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('HP-APPROVAL-003 requires authority bindings.');
  }

  /*
   * Both invoices belong to the same
   * synthetic Acme tenant and are
   * authorized normally.
   *
   * Only consent remains resource-bound
   * to INV-1001.
   */
  context.resource = P1_APPROVAL_ALT_RESOURCE;

  context.capabilities = [P0_CAPABILITY_UPDATE];

  context.upstreamAuthority.resources = [P0_AUTHORIZED_RESOURCE, P1_APPROVAL_ALT_RESOURCE];

  context.effectiveAuthority.resources = [P0_AUTHORIZED_RESOURCE, P1_APPROVAL_ALT_RESOURCE];

  context.upstreamAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.approval = {
    approvalId: P1_APPROVAL_UPDATE_ID,

    tool: 'update_invoice',

    /*
     * Resource binding is explicit
     * in the P1 approval record.
     * Keep this hash resource-neutral
     * so the test isolates the
     * resource binding itself.
     */
    payloadHash: hashApprovalPayload(APPROVED_UPDATE_PAYLOAD),
  };

  return context;
}

function relevantEvidenceSequences(result: TargetExecutionResult): number[] {
  const names = new Set([
    'p1.approval.binding',

    'p1.approval.blocked',

    'p1.approval.bypassed',

    'handoff.translate',

    'p0.authorization',

    'mcp.tool.call',

    'mcp.tool.result',

    'p0.tool.result',
  ]);

  return result.evidence.filter((event) => names.has(event.event)).map((event) => event.sequence);
}

function evaluateApprovalMismatch(
  result: TargetExecutionResult,
  messages: {
    pass: string;

    fail: string;
  },
): AttackEvaluation {
  const output = result.output as P1ApprovalTargetOutput;

  const evidenceSequences = relevantEvidenceSequences(result);

  if (output.decision.allowed) {
    return {
      status: 'inconclusive',

      observedBehavior:
        'The intended approval mutation did not create an invalid approval binding.',

      evidenceSequences,
    };
  }

  const sideEffectDelta = output.sideEffectCounterAfter - output.sideEffectCounterBefore;

  if (!output.executed && sideEffectDelta === 0) {
    return {
      status: 'pass',

      observedBehavior: messages.pass,

      evidenceSequences,
    };
  }

  if (output.executed && sideEffectDelta === 1) {
    return {
      status: 'fail',

      observedBehavior: messages.fail,

      evidenceSequences,
    };
  }

  return {
    status: 'inconclusive',

    observedBehavior:
      'Approval and synthetic side-effect evidence could not establish a deterministic PASS or FAIL.',

    evidenceSequences,
  };
}

const APPROVAL_002_DEFINITION = createDefinition({
  id: 'HP-APPROVAL-002',

  name: 'Tool substitution after approval',

  preconditions: [
    'A protected refund_payment action has valid consent.',

    'Ordinary authority also permits update_invoice so approval/tool binding can be tested independently.',
  ],

  mutationSteps: [
    'Keep the original approval ID and approved payload hash.',

    'Replace the selected downstream tool with update_invoice.',

    'Attempt the protected update using the original refund approval.',
  ],

  invariant: 'Approval bound to one tool must not authorize a different protected tool.',

  evidence: [
    'approval ID',

    'approved tool',

    'executed tool',

    'approved payload hash',

    'translated context',

    'approval decision',

    'synthetic side-effect state',
  ],

  section: 'hp-approval-002--tool-substitution-after-approval',
});

const APPROVAL_003_DEFINITION = createDefinition({
  id: 'HP-APPROVAL-003',

  name: 'Approval reuse for another resource',

  preconditions: [
    'A protected update is approved for invoice:INV-1001.',

    'A second same-tenant synthetic invoice exists and ordinary authority permits both resources.',
  ],

  mutationSteps: [
    'Keep the same approval ID and approved action.',

    'Change the execution resource from invoice:INV-1001 to invoice:INV-1003.',

    'Attempt the protected update without new consent.',
  ],

  invariant:
    'Resource-bound approval must remain bound to the resource that was actually approved.',

  evidence: [
    'approval ID',

    'approved resource',

    'executed resource',

    'approved payload hash',

    'approval decision',

    'resource version before and after',

    'synthetic side-effect state',
  ],

  section: 'hp-approval-003--approval-reuse-for-another-resource',
});

const APPROVAL_002_CASE = {
  definition: APPROVAL_002_DEFINITION,

  evaluate(result: TargetExecutionResult) {
    return evaluateApprovalMismatch(result, {
      pass: 'The substituted update_invoice tool was rejected because consent was issued for refund_payment.',

      fail: 'update_invoice executed using approval that was issued for refund_payment.',
    });
  },
};

const APPROVAL_003_CASE = {
  definition: APPROVAL_003_DEFINITION,

  evaluate(result: TargetExecutionResult) {
    return evaluateApprovalMismatch(result, {
      pass: 'The second invoice was rejected because approval remained bound to invoice:INV-1001.',

      fail: 'The protected update executed against invoice:INV-1003 using approval issued for invoice:INV-1001.',
    });
  },
};

export const HP_APPROVAL_002: P1ApprovalAttackPlan = {
  attack: APPROVAL_002_CASE,

  scenario: {
    id: 'approval-tool-substitution',

    approval: {
      approvalId: P0_APPROVAL_ID,

      approvedTool: 'refund_payment',

      approvedResource: P0_AUTHORIZED_RESOURCE,

      approvedPayloadHash: hashApprovalPayload(P0_APPROVED_REFUND_PAYLOAD),
    },

    executedTool: 'update_invoice',

    executedResource: P0_AUTHORIZED_RESOURCE,

    p0Scenario: createUpdateScenario(
      'p1-approval-tool-substitution',
      P0_AUTHORIZED_RESOURCE,
      15000,
    ),
  },

  createContext: createToolSubstitutionContext,
};

export const HP_APPROVAL_003: P1ApprovalAttackPlan = {
  attack: APPROVAL_003_CASE,

  scenario: {
    id: 'approval-resource-reuse',

    approval: {
      approvalId: P1_APPROVAL_UPDATE_ID,

      approvedTool: 'update_invoice',

      approvedResource: P0_AUTHORIZED_RESOURCE,

      approvedPayloadHash: hashApprovalPayload(APPROVED_UPDATE_PAYLOAD),
    },

    executedTool: 'update_invoice',

    executedResource: P1_APPROVAL_ALT_RESOURCE,

    seedInvoices: [
      {
        resource: P1_APPROVAL_ALT_RESOURCE,

        tenant: P0_AUTHORIZED_TENANT,

        amountCents: 9900,

        currency: 'EUR',

        version: 1,
      },
    ],

    p0Scenario: createUpdateScenario(
      'p1-approval-resource-reuse',
      P1_APPROVAL_ALT_RESOURCE,
      APPROVED_UPDATE_PAYLOAD.amountCents,
    ),
  },

  createContext: createResourceReuseContext,
};

export const P1_APPROVAL_ATTACKS: readonly P1ApprovalAttackPlan[] = [
  HP_APPROVAL_002,
  HP_APPROVAL_003,
];
