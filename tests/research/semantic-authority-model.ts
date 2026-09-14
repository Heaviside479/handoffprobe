export type SemanticAuthorityStatus = 'pass' | 'fail' | 'error';

export type SemanticAuthorityClassification =
  | 'preserved_or_narrowed'
  | 'semantic_authority_widening'
  | 'binding_failure'
  | 'explicit_authority_escalation'
  | 'error';

export interface ProtectedOperation {
  id: string;
  capability: string;
  resource: string;
  effect: string;
}

export interface SemanticAuthorityInput {
  universe: readonly ProtectedOperation[];
  upstreamAllowed: readonly string[];
  translatedAllowed: readonly string[];
  trustedDownstreamAllowed?: readonly string[];
  representationLost: boolean;
  bindingValid: boolean;
  explicitEscalation: boolean;
}

export interface SemanticAuthorityResult {
  status: SemanticAuthorityStatus;
  classification: SemanticAuthorityClassification;
  representationLost: boolean;
  upstreamAllowed: string[];
  translatedAllowed: string[];
  effectiveDownstreamAllowed: string[];
  wideningWitnesses: string[];
  reason: string;
}

function normalize(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function errorResult(input: SemanticAuthorityInput, reason: string): SemanticAuthorityResult {
  return {
    status: 'error',
    classification: 'error',
    representationLost: input.representationLost,
    upstreamAllowed: normalize(input.upstreamAllowed),
    translatedAllowed: normalize(input.translatedAllowed),
    effectiveDownstreamAllowed: [],
    wideningWitnesses: [],
    reason,
  };
}

export function evaluateSemanticAuthority(input: SemanticAuthorityInput): SemanticAuthorityResult {
  const universeIds = input.universe.map((operation) => operation.id);
  const universe = new Set(universeIds);

  if (universe.size !== universeIds.length) {
    return errorResult(input, 'Operation universe contains duplicate IDs.');
  }

  const trustedDownstreamAllowed = input.trustedDownstreamAllowed;

  const lists: readonly [string, readonly string[]][] = [
    ['upstreamAllowed', input.upstreamAllowed],
    ['translatedAllowed', input.translatedAllowed],
  ];

  const allLists =
    trustedDownstreamAllowed === undefined
      ? lists
      : [...lists, ['trustedDownstreamAllowed', trustedDownstreamAllowed] as const];

  for (const [label, values] of allLists) {
    const unknown = values.find((id) => !universe.has(id));

    if (unknown !== undefined) {
      return errorResult(input, `${label} references unknown operation: ${unknown}`);
    }
  }

  const upstreamAllowed = normalize(input.upstreamAllowed);
  const translatedAllowed = normalize(input.translatedAllowed);

  const effectiveDownstreamAllowed =
    trustedDownstreamAllowed === undefined
      ? translatedAllowed
      : translatedAllowed.filter((id) => new Set(trustedDownstreamAllowed).has(id));

  const normalizedEffective = normalize(effectiveDownstreamAllowed);
  const upstream = new Set(upstreamAllowed);
  const wideningWitnesses = normalizedEffective.filter((id) => !upstream.has(id));

  if (!input.bindingValid) {
    return {
      status: 'fail',
      classification: 'binding_failure',
      representationLost: input.representationLost,
      upstreamAllowed,
      translatedAllowed,
      effectiveDownstreamAllowed: normalizedEffective,
      wideningWitnesses: [],
      reason: 'Identity or authority binding is invalid and remains a separate failure class.',
    };
  }

  if (input.explicitEscalation) {
    return {
      status: 'fail',
      classification: 'explicit_authority_escalation',
      representationLost: input.representationLost,
      upstreamAllowed,
      translatedAllowed,
      effectiveDownstreamAllowed: normalizedEffective,
      wideningWitnesses: [],
      reason: 'Explicit structured authority escalation remains separately classified.',
    };
  }

  if (wideningWitnesses.length > 0) {
    return {
      status: 'fail',
      classification: 'semantic_authority_widening',
      representationLost: input.representationLost,
      upstreamAllowed,
      translatedAllowed,
      effectiveDownstreamAllowed: normalizedEffective,
      wideningWitnesses,
      reason: 'Effective downstream authority permits at least one operation prohibited upstream.',
    };
  }

  return {
    status: 'pass',
    classification: 'preserved_or_narrowed',
    representationLost: input.representationLost,
    upstreamAllowed,
    translatedAllowed,
    effectiveDownstreamAllowed: normalizedEffective,
    wideningWitnesses: [],
    reason:
      'Effective downstream authority is equal to or narrower than upstream delegated authority.',
  };
}
