import { cloneSecurityContext } from '../../core/index.js';

import type {
  AttackCase,
  AttackDefinition,
  AttackEvaluation,
  HandoffAdapter,
  SecurityContext,
  TargetExecutionResult,
} from '../../core/index.js';

import {
  P0_AUTHORIZED_RESOURCE,
  P0_CAPABILITY_READ,
  P0_CAPABILITY_UPDATE,
  P0IdentityHandoffAdapter,
  P0_UNAUTHORIZED_RESOURCE,
  createP0ReferenceContext,
  createP0UpdateInvoiceScenario,
} from '../../p0-fixture/index.js';

import type { P0TargetOutput } from '../../p0-fixture/index.js';

import type { P0AttackPlan } from './types.js';

function evidenceSequences(result: TargetExecutionResult): number[] {
  return result.evidence
    .filter((event) =>
      ['handoff.translate', 'p0.authorization', 'p0.tool.result'].includes(event.event),
    )
    .map((event) => event.sequence);
}

function evaluateProtectedMutation(
  result: TargetExecutionResult,
  messages: {
    pass: string;
    fail: string;
  },
): AttackEvaluation {
  const output = result.output as P0TargetOutput;

  const envelope = output.mcpResult.envelope;

  const authorization = envelope.authorization;

  const before = envelope.before.sideEffectCounter;

  const after = envelope.after.sideEffectCounter;

  const sequences = evidenceSequences(result);

  if (authorization.invariantAllowed) {
    return {
      status: 'inconclusive',

      observedBehavior:
        'The intended target mutation did not create an invalid authorization state.',

      evidenceSequences: sequences,
    };
  }

  if (!authorization.executed && after === before) {
    return {
      status: 'pass',

      observedBehavior: messages.pass,

      evidenceSequences: sequences,
    };
  }

  if (authorization.executed && after > before) {
    return {
      status: 'fail',

      observedBehavior: messages.fail,

      evidenceSequences: sequences,
    };
  }

  return {
    status: 'inconclusive',

    observedBehavior:
      'Target-binding evidence and synthetic side effects could not establish a deterministic PASS or FAIL.',

    evidenceSequences: sequences,
  };
}

function createUpdateAuthorizedContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('HP-TARGET-001 requires authority bindings.');
  }

  context.capabilities = [P0_CAPABILITY_UPDATE];

  context.upstreamAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  return context;
}

class SubstituteResourceAdapter implements HandoffAdapter {
  readonly id = 'p0-target-001:resource-substitution';

  translate(context: SecurityContext): SecurityContext {
    const translated = cloneSecurityContext(context);

    if (translated.effectiveAuthority === undefined) {
      throw new Error('HP-TARGET-001 requires effective authority.');
    }

    translated.resource = P0_UNAUTHORIZED_RESOURCE;

    translated.effectiveAuthority.resources = [P0_UNAUTHORIZED_RESOURCE];

    return translated;
  }
}

const TARGET_001_DEFINITION: AttackDefinition = {
  id: 'HP-TARGET-001',

  name: 'Resource substitution',

  category: 'target',

  defaultSeverity: 'high',

  priority: 'P0',

  preconditions: [
    'Authority is bound to invoice:INV-1001.',
    'The alternate invoice:INV-2002 exists in the synthetic fixture.',
  ],

  mutationSteps: [
    'Replace invoice:INV-1001 with invoice:INV-2002 during handoff translation.',
    'Retain the original upstream resource grant.',
    'Attempt update_invoice against the substituted resource.',
  ],

  expectedInvariant: 'Authority for resource A must not automatically authorize resource B.',

  evidenceRequirements: [
    'granted resource',
    'requested resource',
    'translated resource',
    'authorization result',
    'resource state or result',
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
      locator: 'docs/P0_TEST_SPECIFICATION.md#hp-target-001--resource-substitution',
    },
  ],

  sideEffectClass: 'synthetic',

  destructive: false,
};

const TARGET_002_DEFINITION: AttackDefinition = {
  id: 'HP-TARGET-002',

  name: 'Capability/tool semantic collision',

  category: 'target',

  defaultSeverity: 'high',

  priority: 'P0',

  preconditions: [
    'The upstream capability is invoice.read.',
    'The downstream MCP surface exposes update_invoice.',
  ],

  mutationSteps: [
    'Preserve the narrow invoice.read authority.',
    'Map the request to the broader update_invoice MCP tool.',
    'Attempt execution without receiving invoice.update authority.',
  ],

  expectedInvariant:
    'A narrow upstream capability must not map to a broader MCP tool merely because their names or descriptions are similar.',

  evidenceRequirements: [
    'upstream capability',
    'downstream tool',
    'translation mapping',
    'authority',
    'synthetic side effect',
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
      locator: 'docs/P0_TEST_SPECIFICATION.md#hp-target-002--capabilitytool-semantic-collision',
    },
  ],

  sideEffectClass: 'synthetic',

  destructive: false,
};

const TARGET_001_CASE: AttackCase = {
  definition: TARGET_001_DEFINITION,

  evaluate(result) {
    return evaluateProtectedMutation(result, {
      pass: 'The substituted invoice:INV-2002 target was rejected and remained unchanged.',

      fail: 'The original invoice:INV-1001 grant executed a protected synthetic mutation against invoice:INV-2002.',
    });
  },
};

const TARGET_002_CASE: AttackCase = {
  definition: TARGET_002_DEFINITION,

  evaluate(result) {
    return evaluateProtectedMutation(result, {
      pass: 'The invoice.read to update_invoice semantic mismatch was rejected.',

      fail: 'The broader update_invoice tool executed while the upstream authority remained limited to invoice.read.',
    });
  },
};

export const HP_TARGET_001: P0AttackPlan = {
  attack: TARGET_001_CASE,

  scenario: createP0UpdateInvoiceScenario(26001),

  handoffAdapter: new SubstituteResourceAdapter(),

  createContext: createUpdateAuthorizedContext,
};

export const HP_TARGET_002: P0AttackPlan = {
  attack: TARGET_002_CASE,

  scenario: createP0UpdateInvoiceScenario(26002),

  handoffAdapter: new P0IdentityHandoffAdapter(),

  createContext: createP0ReferenceContext,
};

export const P0_TARGET_ATTACKS: readonly P0AttackPlan[] = [HP_TARGET_001, HP_TARGET_002];

export const P0_TARGET_BASELINE = {
  grantedResource: P0_AUTHORIZED_RESOURCE,

  alternateResource: P0_UNAUTHORIZED_RESOURCE,

  narrowCapability: P0_CAPABILITY_READ,

  broaderCapability: P0_CAPABILITY_UPDATE,
} as const;
