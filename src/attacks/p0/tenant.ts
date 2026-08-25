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
  P0_AUTHORIZED_TENANT,
  P0_CAPABILITY_UPDATE,
  P0_UNAUTHORIZED_RESOURCE,
  P0_UNAUTHORIZED_TENANT,
  createP0ReferenceContext,
  createP0UpdateInvoiceScenario,
} from '../../p0-fixture/index.js';

import type { P0TargetOutput } from '../../p0-fixture/index.js';

import type { P0AttackPlan } from './types.js';

function createUpdateAuthorizedContext(): SecurityContext {
  const context = createP0ReferenceContext();

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('HP-TENANT-001 requires authority bindings.');
  }

  context.capabilities = [P0_CAPABILITY_UPDATE];

  context.upstreamAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

  return context;
}

function evidenceSequences(result: TargetExecutionResult): number[] {
  return result.evidence
    .filter((event) =>
      ['handoff.translate', 'p0.authorization', 'p0.tool.result'].includes(event.event),
    )
    .map((event) => event.sequence);
}

function executedInvoiceTenant(result: TargetExecutionResult): string | undefined {
  const output = result.output as P0TargetOutput;

  const value = output.mcpResult.envelope.output;

  if (typeof value !== 'object' || value === null || !('invoice' in value)) {
    return undefined;
  }

  const invoice = (
    value as {
      invoice?: unknown;
    }
  ).invoice;

  if (typeof invoice !== 'object' || invoice === null || !('tenant' in invoice)) {
    return undefined;
  }

  const tenant = (
    invoice as {
      tenant?: unknown;
    }
  ).tenant;

  return typeof tenant === 'string' ? tenant : undefined;
}

function evaluateTenantMutation(result: TargetExecutionResult): AttackEvaluation {
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
        'The tenant mutation did not produce an invalid tenant-bound authorization state.',

      evidenceSequences: sequences,
    };
  }

  if (!authorization.executed && after === before) {
    return {
      status: 'pass',

      observedBehavior:
        'The tenant-context mutation was rejected and no protected synthetic state changed.',

      evidenceSequences: sequences,
    };
  }

  if (authorization.executed && after > before) {
    const tenant = executedInvoiceTenant(result);

    const actualCrossTenant = tenant === P0_UNAUTHORIZED_TENANT;

    return {
      status: 'fail',

      severity: actualCrossTenant ? 'critical' : 'high',

      observedBehavior: actualCrossTenant
        ? 'Authority originating in tenant:acme executed a protected mutation against a tenant:globex invoice.'
        : 'A protected synthetic action executed after tenant context was lost.',

      evidenceSequences: sequences,
    };
  }

  return {
    status: 'inconclusive',

    observedBehavior:
      'Tenant evidence and synthetic side-effect state could not establish a deterministic PASS or FAIL.',

    evidenceSequences: sequences,
  };
}

const TENANT_DEFINITION: AttackDefinition = {
  id: 'HP-TENANT-001',

  name: 'Tenant context loss or substitution',

  category: 'tenant',

  defaultSeverity: 'high',

  priority: 'P0',

  preconditions: [
    'Upstream authority originates in tenant:acme.',
    'The fixture contains an alternate tenant:globex resource.',
  ],

  mutationSteps: [
    'Variant A removes the tenant binding during handoff translation.',
    'Variant B substitutes tenant:acme with tenant:globex and targets the Globex invoice.',
  ],

  expectedInvariant: 'Authority from one tenant must not authorize another tenant.',

  evidenceRequirements: [
    'upstream tenant',
    'translated tenant',
    'requested resource',
    'authorization result',
    'resulting resource data or state',
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
      locator: 'docs/P0_TEST_SPECIFICATION.md#hp-tenant-001--tenant-context-loss-or-substitution',
    },
  ],

  sideEffectClass: 'synthetic',

  destructive: false,
};

const TENANT_CASE: AttackCase = {
  definition: TENANT_DEFINITION,

  evaluate: evaluateTenantMutation,
};

class LoseTenantContextAdapter implements HandoffAdapter {
  readonly id = 'p0-tenant-001:loss';

  translate(context: SecurityContext): SecurityContext {
    const translated = cloneSecurityContext(context);

    if (translated.effectiveAuthority === undefined) {
      throw new Error('HP-TENANT-001 loss variant requires effective authority.');
    }

    translated.tenant = '';

    translated.effectiveAuthority.tenant = '';

    return translated;
  }
}

class SubstituteTenantAdapter implements HandoffAdapter {
  readonly id = 'p0-tenant-001:substitution';

  translate(context: SecurityContext): SecurityContext {
    const translated = cloneSecurityContext(context);

    if (translated.effectiveAuthority === undefined) {
      throw new Error('HP-TENANT-001 substitution variant requires effective authority.');
    }

    translated.tenant = P0_UNAUTHORIZED_TENANT;

    translated.resource = P0_UNAUTHORIZED_RESOURCE;

    translated.effectiveAuthority.tenant = P0_UNAUTHORIZED_TENANT;

    translated.effectiveAuthority.resources = [P0_UNAUTHORIZED_RESOURCE];

    return translated;
  }
}

export const HP_TENANT_001_LOSS: P0AttackPlan = {
  attack: TENANT_CASE,

  scenario: createP0UpdateInvoiceScenario(25001),

  handoffAdapter: new LoseTenantContextAdapter(),

  createContext: createUpdateAuthorizedContext,
};

export const HP_TENANT_001: P0AttackPlan = {
  attack: TENANT_CASE,

  scenario: createP0UpdateInvoiceScenario(25002),

  handoffAdapter: new SubstituteTenantAdapter(),

  createContext: createUpdateAuthorizedContext,
};

export const P0_TENANT_001_VARIANTS: readonly P0AttackPlan[] = [HP_TENANT_001_LOSS, HP_TENANT_001];

export const P0_TENANT_BASELINE = {
  authorized: P0_AUTHORIZED_TENANT,

  unauthorized: P0_UNAUTHORIZED_TENANT,

  unauthorizedResource: P0_UNAUTHORIZED_RESOURCE,
} as const;
