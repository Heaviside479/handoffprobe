import { describe, expect, it } from 'vitest';

import {
  T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID,
  evaluateT2AmbiguousDuplicateField,
  type T2AmbiguousDuplicateFieldInput,
} from '../src/research/t2-handoff-contract/ambiguous-duplicate-field.js';

const FIRST_WINS: T2AmbiguousDuplicateFieldInput = {
  upstream: {
    fieldName: 'resource',
    values: ['invoice:INV-1001', 'invoice:INV-9000'],
    effectiveValue: 'invoice:INV-1001',
    resolutionRule: 'first-value-wins',
    trusted: true,
  },
  downstream: {
    fieldName: 'resource',
    values: ['invoice:INV-1001', 'invoice:INV-9000'],
    effectiveValue: 'invoice:INV-1001',
    resolutionRule: 'first-value-wins',
    trusted: true,
  },
  ambiguityRejected: false,
  rejectionTrusted: false,
  protectedDecisionObserved: true,
};

const PRECEDENCE_DIVERGENCE: T2AmbiguousDuplicateFieldInput = {
  ...FIRST_WINS,
  downstream: {
    ...FIRST_WINS.downstream,
    effectiveValue: 'invoice:INV-9000',
    resolutionRule: 'last-value-wins',
  },
};

describe('T-2.4 ambiguous/duplicate-field research case', () => {
  it('keeps the research label separate from stable HP attack IDs', () => {
    expect(T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID).toBe('T2-AMBIGUOUS-DUPLICATE-FIELD');
    expect(T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID.startsWith('HP-')).toBe(false);
  });

  it('passes when trusted deterministic precedence selects the same effective value', () => {
    expect(evaluateT2AmbiguousDuplicateField(FIRST_WINS)).toEqual({
      researchId: 'T2-AMBIGUOUS-DUPLICATE-FIELD',
      outcome: 'PASS',
      ambiguityDetected: true,
      reason: 'Trusted resolution produces the same effective security value across the handoff.',
    });
  });

  it('passes when conflicting values are rejected before protected execution', () => {
    expect(
      evaluateT2AmbiguousDuplicateField({
        ...PRECEDENCE_DIVERGENCE,
        ambiguityRejected: true,
        rejectionTrusted: true,
        protectedDecisionObserved: false,
      }),
    ).toEqual({
      researchId: 'T2-AMBIGUOUS-DUPLICATE-FIELD',
      outcome: 'PASS',
      ambiguityDetected: true,
      reason:
        'Conflicting duplicate-field values are rejected by trusted enforcement before protected execution.',
    });
  });

  it('fails with a concrete witness when parser precedence changes the protected value', () => {
    expect(evaluateT2AmbiguousDuplicateField(PRECEDENCE_DIVERGENCE)).toEqual({
      researchId: 'T2-AMBIGUOUS-DUPLICATE-FIELD',
      outcome: 'FAIL',
      ambiguityDetected: true,
      reason:
        'Trusted upstream and downstream precedence select different security values and the downstream value reaches a protected decision.',
      witness: {
        fieldName: 'resource',
        upstreamValues: ['invoice:INV-1001', 'invoice:INV-9000'],
        upstreamEffectiveValue: 'invoice:INV-1001',
        upstreamResolutionRule: 'first-value-wins',
        downstreamValues: ['invoice:INV-1001', 'invoice:INV-9000'],
        downstreamEffectiveValue: 'invoice:INV-9000',
        downstreamResolutionRule: 'last-value-wins',
      },
    });
  });

  it('stays inconclusive when disagreement is observed without a protected downstream decision', () => {
    expect(
      evaluateT2AmbiguousDuplicateField({
        ...PRECEDENCE_DIVERGENCE,
        protectedDecisionObserved: false,
      }),
    ).toEqual({
      researchId: 'T2-AMBIGUOUS-DUPLICATE-FIELD',
      outcome: 'INCONCLUSIVE',
      ambiguityDetected: true,
      reason:
        'Parser or precedence disagreement is observable, but acceptance into a protected downstream decision is not.',
    });
  });

  it('stays inconclusive when trusted duplicate-field evidence is missing', () => {
    expect(
      evaluateT2AmbiguousDuplicateField({
        ...FIRST_WINS,
        downstream: {
          ...FIRST_WINS.downstream,
          trusted: false,
        },
      }),
    ).toEqual({
      researchId: 'T2-AMBIGUOUS-DUPLICATE-FIELD',
      outcome: 'INCONCLUSIVE',
      ambiguityDetected: null,
      reason:
        'Trusted duplicate-field representation evidence is required on both sides of the handoff.',
    });
  });

  it('is deterministic across repeated evaluation', () => {
    const first = evaluateT2AmbiguousDuplicateField(PRECEDENCE_DIVERGENCE);
    const second = evaluateT2AmbiguousDuplicateField(structuredClone(PRECEDENCE_DIVERGENCE));

    expect(second).toEqual(first);
  });
});
