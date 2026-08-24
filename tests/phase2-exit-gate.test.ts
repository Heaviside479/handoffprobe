import { describe, expect, it } from 'vitest';

import { CoreRunner } from '../src/core/index.js';
import type {
  AttackCase,
  AttackDefinition,
  HandoffAdapter,
  SecurityContext,
  SourceReference,
} from '../src/core/index.js';
import { ProtocolLabTargetAdapter } from '../src/protocol-lab/target-adapter.js';

const CONTEXT: SecurityContext = {
  principal: 'user:alice',
  caller: 'agent:sales',
  downstream: 'agent:billing',
  tenant: 'tenant:acme',
  resource: 'invoice:INV-1001',
  capabilities: ['invoice.read'],
};

const SOURCE: SourceReference = {
  kind: 'project',
  title: 'Phase 2 exit-gate contract',
  locator: 'docs/ROADMAP.md#phase-2--core-security-engine',
};

function definition(id: 'HP-CORE-101' | 'HP-CORE-102', name: string): AttackDefinition {
  return {
    id,
    name,
    category: 'phase2-exit-gate',
    defaultSeverity: 'medium',
    priority: 'P0',
    preconditions: ['local protocol lab'],
    mutationSteps: ['observe translated context'],
    expectedInvariant: 'Attack logic can evaluate the handoff without rewriting protocol plumbing.',
    evidenceRequirements: ['original context', 'translated context'],
    applicability: {
      a2a: ['1.0'],
      mcp: ['2026-07-28'],
    },
    propertyClass: 'composition_responsibility',
    sourceReferences: [SOURCE],
    sideEffectClass: 'synthetic',
    destructive: false,
  };
}

const PRINCIPAL_CASE: AttackCase = {
  definition: definition('HP-CORE-101', 'Principal continuity test case'),

  evaluate(result) {
    const preserved = result.originalContext.principal === result.translatedContext.principal;

    return {
      status: preserved ? 'pass' : 'fail',
      observedBehavior: preserved
        ? 'Principal continuity was preserved.'
        : 'Principal continuity was lost.',
    };
  },
};

const TENANT_CASE: AttackCase = {
  definition: definition('HP-CORE-102', 'Tenant continuity test case'),

  evaluate(result) {
    const preserved = result.originalContext.tenant === result.translatedContext.tenant;

    return {
      status: preserved ? 'pass' : 'fail',
      observedBehavior: preserved
        ? 'Tenant continuity was preserved.'
        : 'Tenant continuity was lost.',
    };
  },
};

class SubstitutePrincipalAdapter implements HandoffAdapter {
  readonly id = 'test:substitute-principal';

  translate(context: SecurityContext): SecurityContext {
    return {
      ...context,
      principal: context.downstream,
      capabilities: [...context.capabilities],
    };
  }
}

describe('Phase 2 exit gate', () => {
  it('reuses identical protocol plumbing for independent attack cases', async () => {
    const runner = new CoreRunner();

    const target = new ProtocolLabTargetAdapter('secure');

    const principal = await runner.run({
      attack: PRINCIPAL_CASE,
      target,
      context: CONTEXT,
      runId: 'phase2-exit-principal',
    });

    const tenant = await runner.run({
      attack: TENANT_CASE,
      target,
      context: CONTEXT,
      runId: 'phase2-exit-tenant',
    });

    expect(principal.finding.status).toBe('pass');

    expect(tenant.finding.status).toBe('pass');

    expect(principal.evidence.map((event) => event.event)).toEqual(
      tenant.evidence.map((event) => event.event),
    );

    expect(principal.evidence).toHaveLength(9);

    expect(tenant.evidence).toHaveLength(9);
  });

  it('uses a first-class handoff adapter without changing A2A or MCP plumbing', async () => {
    const result = await new CoreRunner().run({
      attack: PRINCIPAL_CASE,
      target: new ProtocolLabTargetAdapter('secure', new SubstitutePrincipalAdapter()),
      context: CONTEXT,
      runId: 'phase2-exit-custom-handoff',
    });

    expect(result.finding.status).toBe('fail');

    const handoffEvent = result.evidence.find((event) => event.event === 'handoff.translate');

    expect(handoffEvent?.details).toMatchObject({
      handoffAdapter: 'test:substitute-principal',
    });
  });

  it('propagates attack provenance into findings and evidence', async () => {
    const result = await new CoreRunner().run({
      attack: TENANT_CASE,
      target: new ProtocolLabTargetAdapter('secure'),
      context: CONTEXT,
      runId: 'phase2-exit-provenance',
    });

    expect(result.finding.sources).toEqual([SOURCE]);

    expect(
      result.evidence.every((event) =>
        event.provenance.some((source) => source.locator === SOURCE.locator),
      ),
    ).toBe(true);
  });

  it('proves independent attack logic can change without protocol changes', async () => {
    const alwaysInconclusive: AttackCase = {
      definition: definition('HP-CORE-102', 'Independent evaluator'),

      evaluate() {
        return {
          status: 'inconclusive',
          observedBehavior: 'Test-only evaluator intentionally returned inconclusive.',
        };
      },
    };

    const result = await new CoreRunner().run({
      attack: alwaysInconclusive,
      target: new ProtocolLabTargetAdapter('secure'),
      context: CONTEXT,
      runId: 'phase2-exit-independent-attack',
    });

    expect(result.finding.status).toBe('inconclusive');

    expect(result.evidence).toHaveLength(9);
  });
});
