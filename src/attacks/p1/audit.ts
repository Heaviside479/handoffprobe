import type {
  AttackDefinition,
  AttackEvaluation,
  SecurityContext,
  TargetExecutionResult,
} from '../../core/index.js';

import {
  P0_CAPABILITY_UPDATE,
  createP0ReferenceContext,
  createP0UpdateInvoiceScenario,
} from '../../p0-fixture/index.js';

import type { P1AuditTargetOutput } from '../../p1-fixture/index.js';

import type { P1AuditAttackPlan } from './types.js';

const AUDIT_TASK_ID = 'task:P1-AUDIT-1001';

function createAuditContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('HP-AUDIT-001 requires authority bindings.');
  }

  context.capabilities = [P0_CAPABILITY_UPDATE];
  context.upstreamAuthority.capabilities = [P0_CAPABILITY_UPDATE];
  context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.lifecycle = {
    taskId: AUDIT_TASK_ID,
    state: 'active',
  };

  return context;
}

function relevantEvidenceSequences(result: TargetExecutionResult): number[] {
  const relevant = new Set([
    'p1.audit.baseline',
    'p1.audit.lineage_mutation',
    'p1.audit.blocked',
    'p1.audit.bypassed',
    'a2a.receiver.receive',
    'handoff.translate',
    'mcp.tool.call',
    'mcp.tool.result',
    'p1.audit.final',
  ]);

  return result.evidence
    .filter((event) => relevant.has(event.event))
    .map((event) => event.sequence);
}

function evaluate(result: TargetExecutionResult): AttackEvaluation {
  const output = result.output as P1AuditTargetOutput;
  const evidenceSequences = relevantEvidenceSequences(result);

  if (output.lineageReconstructable || output.translatedHasTaskBinding) {
    return {
      status: 'inconclusive',
      observedBehavior:
        'The intended audit mutation did not remove the mandatory governing task binding.',
      evidenceSequences,
    };
  }

  const delta = output.sideEffectCounterAfter - output.sideEffectCounterBefore;

  if (!output.executed && delta === 0) {
    return {
      status: 'pass',
      observedBehavior:
        'The protected action was rejected when mandatory accountable task lineage was missing.',
      evidenceSequences,
    };
  }

  if (output.executed && output.sideEffectId !== null && delta === 1) {
    return {
      status: 'fail',
      observedBehavior:
        'A protected synthetic side effect executed after the handoff lost the mandatory governing task lineage.',
      evidenceSequences,
    };
  }

  return {
    status: 'inconclusive',
    observedBehavior: 'Audit-lineage evidence could not establish a deterministic PASS or FAIL.',
    evidenceSequences,
  };
}

const DEFINITION: AttackDefinition = {
  id: 'HP-AUDIT-001',
  name: 'Cross-protocol audit lineage break',
  category: 'audit',
  defaultSeverity: 'medium',
  priority: 'P1',

  preconditions: [
    'A protected synthetic update has a trustworthy original principal and governing task.',
    'The A2A to MCP handoff requires accountable task lineage.',
  ],

  mutationSteps: [
    'Retain normal authority while removing the governing task binding at the handoff.',
    'Allow the vulnerable fixture to continue into MCP.',
    'Check whether the resulting side effect can still be reliably attributed to the governing task.',
  ],

  expectedInvariant:
    'Protected execution requiring accountability must preserve trustworthy original-principal and governing-task lineage across A2A, handoff and MCP.',

  evidenceRequirements: [
    'original principal',
    'governing task ID',
    'delegation ID',
    'handoff ID',
    'MCP request identity',
    'selected tool and resource',
    'side-effect identity',
    'missing lineage element',
    'final correlation result',
  ],

  applicability: {
    a2a: ['1.0'],
    mcp: ['2026-07-28'],
  },

  propertyClass: 'composition_responsibility',

  sourceReferences: [
    {
      kind: 'project',
      title: 'P1 Security Test Specification',
      locator: 'docs/P1_TEST_SPECIFICATION.md#hp-audit-001--cross-protocol-audit-lineage-break',
    },
    {
      kind: 'project',
      title: 'Attack Catalog',
      locator: 'docs/ATTACK_CATALOG.md#v01-p1--add-after-p0-engine-is-credible',
    },
  ],

  sideEffectClass: 'synthetic',
  destructive: false,
};

const ATTACK = {
  definition: DEFINITION,
  evaluate,
};

export const HP_AUDIT_001: P1AuditAttackPlan = {
  attack: ATTACK,

  scenario: {
    id: 'cross-protocol-audit-lineage-break',
    originalTaskId: AUDIT_TASK_ID,
    delegationId: 'delegation:DEL-AUDIT-1001',
    handoffId: 'handoff:HOF-AUDIT-1001',
    mcpRequestId: 'mcp-request:MCP-AUDIT-1001',
    p0Scenario: createP0UpdateInvoiceScenario(24801),
  },

  createContext: createAuditContext,
};

export const P1_AUDIT_ATTACKS: readonly P1AuditAttackPlan[] = [HP_AUDIT_001];
