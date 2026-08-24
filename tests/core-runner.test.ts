import { describe, expect, it } from 'vitest';

import { CoreRunner, isSecurityFailure } from '../src/core/index.js';
import type {
  AttackCase,
  AttackDefinition,
  SecurityContext,
  TargetAdapter,
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

const DEFINITION: AttackDefinition = {
  id: 'HP-CORE-001',
  name: 'Core runner test invariant',
  category: 'core-test',
  defaultSeverity: 'medium',
  priority: 'P0',
  preconditions: ['local test target'],
  mutationSteps: ['test-only mutation'],
  expectedInvariant: 'The observed principal remains user:alice.',
  evidenceRequirements: ['upstream principal', 'translated principal'],
  applicability: {
    a2a: ['1.0'],
    mcp: ['2026-07-28'],
  },
  propertyClass: 'composition_responsibility',
  sourceReferences: [],
  sideEffectClass: 'synthetic',
  destructive: false,
};

const CASE: AttackCase = {
  definition: DEFINITION,

  evaluate(result) {
    const preserved = result.translatedContext.principal === result.originalContext.principal;

    return {
      status: preserved ? 'pass' : 'fail',
      observedBehavior: preserved
        ? 'Principal continuity was preserved.'
        : 'Principal continuity was lost.',
    };
  },
};

describe('core runner', () => {
  it('runs the secure protocol lab through the target adapter', async () => {
    const runner = new CoreRunner();

    const result = await runner.run({
      attack: CASE,
      target: new ProtocolLabTargetAdapter('secure'),
      context: CONTEXT,
      runId: 'hp-runner-secure-001',
    });

    expect(result.finding.status).toBe('pass');

    expect(result.finding.testId).toBe('HP-CORE-001');

    expect(result.finding.correlationId).toBe('hp-runner-secure-001:HP-CORE-001');

    expect(result.evidence).toHaveLength(9);

    expect(
      result.evidence.every(
        (event) => event.testId === 'HP-CORE-001' && event.runId === 'hp-runner-secure-001',
      ),
    ).toBe(true);
  });

  it('produces a deterministic fail for the vulnerable protocol lab', async () => {
    const runner = new CoreRunner();

    const input = {
      attack: CASE,
      target: new ProtocolLabTargetAdapter('vulnerable'),
      context: CONTEXT,
      runId: 'hp-runner-vulnerable-001',
    } as const;

    const first = await runner.run(input);

    const second = await runner.run(input);

    expect(second).toEqual(first);

    expect(first.finding.status).toBe('fail');

    expect(first.finding.observedBehavior).toBe('Principal continuity was lost.');

    expect(isSecurityFailure(first.finding)).toBe(true);
  });

  it('converts adapter failures into error findings rather than security failures', async () => {
    const target: TargetAdapter = {
      id: 'throwing-target',

      execute() {
        throw new Error('synthetic adapter failure');
      },
    };

    const result = await new CoreRunner().run({
      attack: CASE,
      target,
      context: CONTEXT,
      runId: 'hp-runner-error-001',
    });

    expect(result.finding.status).toBe('error');

    expect(result.finding.severity).toBe('info');

    expect(result.error?.code).toBe('ADAPTER_ERROR');

    expect(isSecurityFailure(result.finding)).toBe(false);
  });

  it('reports deterministic timeout errors without converting them to fail', async () => {
    const target: TargetAdapter = {
      id: 'timeout-target',

      async execute(input) {
        await new Promise<void>((resolve) => {
          input.signal.addEventListener('abort', () => resolve(), {
            once: true,
          });
        });

        throw new Error('aborted');
      },
    };

    const result = await new CoreRunner().run({
      attack: CASE,
      target,
      context: CONTEXT,
      runId: 'hp-runner-timeout-001',
      timeoutMs: 10,
    });

    expect(result.finding.status).toBe('error');

    expect(result.error?.code).toBe('TIMEOUT');

    expect(isSecurityFailure(result.finding)).toBe(false);
  });

  it('rejects invalid timeout configuration as a structured error result', async () => {
    const result = await new CoreRunner().run({
      attack: CASE,
      target: new ProtocolLabTargetAdapter('secure'),
      context: CONTEXT,
      runId: 'hp-runner-invalid-timeout-001',
      timeoutMs: 0,
    });

    expect(result.finding.status).toBe('error');

    expect(result.error?.code).toBe('INVALID_TIMEOUT');

    expect(result.evidence).toEqual([]);
  });
});
