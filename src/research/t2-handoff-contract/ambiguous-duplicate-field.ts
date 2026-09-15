export const T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID = 'T2-AMBIGUOUS-DUPLICATE-FIELD' as const;

export type T2AmbiguousDuplicateFieldOutcome = 'PASS' | 'FAIL' | 'INCONCLUSIVE';

export interface T2DuplicateFieldObservation {
  fieldName: string;
  values: string[];
  effectiveValue?: string;
  resolutionRule?: string;
  trusted: boolean;
}

export interface T2AmbiguousDuplicateFieldInput {
  upstream: T2DuplicateFieldObservation;
  downstream: T2DuplicateFieldObservation;
  ambiguityRejected: boolean;
  rejectionTrusted: boolean;
  protectedDecisionObserved: boolean;
}

export interface T2AmbiguousDuplicateFieldWitness {
  fieldName: string;
  upstreamValues: string[];
  upstreamEffectiveValue: string;
  upstreamResolutionRule: string;
  downstreamValues: string[];
  downstreamEffectiveValue: string;
  downstreamResolutionRule: string;
}

export interface T2AmbiguousDuplicateFieldResult {
  researchId: typeof T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID;
  outcome: T2AmbiguousDuplicateFieldOutcome;
  ambiguityDetected: boolean | null;
  reason: string;
  witness?: T2AmbiguousDuplicateFieldWitness;
}

function nonEmpty(value: string | undefined): value is string {
  return value !== undefined && value.trim().length > 0;
}

function hasValidValues(values: readonly string[]): boolean {
  return values.length > 0 && values.every((value) => value.trim().length > 0);
}

function hasAmbiguity(values: readonly string[]): boolean {
  return new Set(values).size > 1;
}

export function evaluateT2AmbiguousDuplicateField(
  input: T2AmbiguousDuplicateFieldInput,
): T2AmbiguousDuplicateFieldResult {
  const upstream = input.upstream;
  const downstream = input.downstream;

  const comparableField =
    nonEmpty(upstream.fieldName) &&
    nonEmpty(downstream.fieldName) &&
    upstream.fieldName === downstream.fieldName;

  const completeTrustedRepresentationEvidence =
    upstream.trusted &&
    downstream.trusted &&
    comparableField &&
    hasValidValues(upstream.values) &&
    hasValidValues(downstream.values);

  if (!completeTrustedRepresentationEvidence) {
    return {
      researchId: T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID,
      outcome: 'INCONCLUSIVE',
      ambiguityDetected: null,
      reason:
        'Trusted duplicate-field representation evidence is required on both sides of the handoff.',
    };
  }

  const ambiguityDetected = hasAmbiguity(upstream.values) || hasAmbiguity(downstream.values);

  if (!ambiguityDetected) {
    if (
      nonEmpty(upstream.effectiveValue) &&
      nonEmpty(downstream.effectiveValue) &&
      upstream.effectiveValue === downstream.effectiveValue
    ) {
      return {
        researchId: T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID,
        outcome: 'PASS',
        ambiguityDetected: false,
        reason:
          'No conflicting duplicate-field values are present and both sides use the same trusted effective value.',
      };
    }

    return {
      researchId: T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID,
      outcome: 'INCONCLUSIVE',
      ambiguityDetected: false,
      reason:
        'No duplicate-field ambiguity is established, but trusted effective-value equivalence is not fully observable.',
    };
  }

  if (input.ambiguityRejected && input.rejectionTrusted) {
    return {
      researchId: T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID,
      outcome: 'PASS',
      ambiguityDetected: true,
      reason:
        'Conflicting duplicate-field values are rejected by trusted enforcement before protected execution.',
    };
  }

  const upstreamEffectiveValue = upstream.effectiveValue;
  const downstreamEffectiveValue = downstream.effectiveValue;
  const upstreamResolutionRule = upstream.resolutionRule;
  const downstreamResolutionRule = downstream.resolutionRule;

  if (
    !nonEmpty(upstreamEffectiveValue) ||
    !nonEmpty(downstreamEffectiveValue) ||
    !nonEmpty(upstreamResolutionRule) ||
    !nonEmpty(downstreamResolutionRule)
  ) {
    return {
      researchId: T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID,
      outcome: 'INCONCLUSIVE',
      ambiguityDetected: true,
      reason:
        'Ambiguity is present, but trusted precedence and effective-value evidence is incomplete.',
    };
  }

  if (upstreamEffectiveValue === downstreamEffectiveValue) {
    return {
      researchId: T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID,
      outcome: 'PASS',
      ambiguityDetected: true,
      reason: 'Trusted resolution produces the same effective security value across the handoff.',
    };
  }

  if (!input.protectedDecisionObserved) {
    return {
      researchId: T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID,
      outcome: 'INCONCLUSIVE',
      ambiguityDetected: true,
      reason:
        'Parser or precedence disagreement is observable, but acceptance into a protected downstream decision is not.',
    };
  }

  return {
    researchId: T2_AMBIGUOUS_DUPLICATE_FIELD_RESEARCH_ID,
    outcome: 'FAIL',
    ambiguityDetected: true,
    reason:
      'Trusted upstream and downstream precedence select different security values and the downstream value reaches a protected decision.',
    witness: {
      fieldName: upstream.fieldName,
      upstreamValues: [...upstream.values],
      upstreamEffectiveValue,
      upstreamResolutionRule,
      downstreamValues: [...downstream.values],
      downstreamEffectiveValue,
      downstreamResolutionRule,
    },
  };
}
