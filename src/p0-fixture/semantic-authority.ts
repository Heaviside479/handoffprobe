export type P0SemanticAuthorityStatus = 'pass' | 'fail' | 'error';

export interface P0ProtectedOperation {
  id: string;
  capability: string;
  resource: string;
  effect: string;
}

export interface P0SemanticAuthorityInput {
  universe: readonly P0ProtectedOperation[];
  upstreamAllowed: readonly string[];
  translatedAllowed: readonly string[];
  trustedDownstreamAllowed?: readonly string[];
}

export interface P0SemanticAuthorityDecision {
  status: P0SemanticAuthorityStatus;
  upstreamAllowed: string[];
  translatedAllowed: string[];
  effectiveDownstreamAllowed: string[];
  wideningWitnesses: string[];
  reason: string;
}

function normalize(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function errorDecision(
  input: P0SemanticAuthorityInput,
  reason: string,
): P0SemanticAuthorityDecision {
  return {
    status: 'error',
    upstreamAllowed: normalize(input.upstreamAllowed),
    translatedAllowed: normalize(input.translatedAllowed),
    effectiveDownstreamAllowed: [],
    wideningWitnesses: [],
    reason,
  };
}

export function evaluateP0SemanticAuthority(
  input: P0SemanticAuthorityInput,
): P0SemanticAuthorityDecision {
  const universeIds = input.universe.map((operation) => operation.id);
  const universe = new Set(universeIds);

  if (universe.size !== universeIds.length) {
    return errorDecision(input, 'Operation universe contains duplicate IDs.');
  }

  const lists: readonly (readonly [string, readonly string[]])[] = [
    ['upstreamAllowed', input.upstreamAllowed],
    ['translatedAllowed', input.translatedAllowed],
    ...(input.trustedDownstreamAllowed === undefined
      ? []
      : [['trustedDownstreamAllowed', input.trustedDownstreamAllowed] as const]),
  ];

  for (const [label, values] of lists) {
    const unknown = values.find((id) => !universe.has(id));

    if (unknown !== undefined) {
      return errorDecision(input, `${label} references unknown operation: ${unknown}`);
    }
  }

  const upstreamAllowed = normalize(input.upstreamAllowed);
  const translatedAllowed = normalize(input.translatedAllowed);
  const trusted =
    input.trustedDownstreamAllowed === undefined
      ? undefined
      : new Set(input.trustedDownstreamAllowed);

  const effectiveDownstreamAllowed = normalize(
    trusted === undefined ? translatedAllowed : translatedAllowed.filter((id) => trusted.has(id)),
  );

  const upstream = new Set(upstreamAllowed);
  const wideningWitnesses = effectiveDownstreamAllowed.filter((id) => !upstream.has(id));

  if (wideningWitnesses.length > 0) {
    return {
      status: 'fail',
      upstreamAllowed,
      translatedAllowed,
      effectiveDownstreamAllowed,
      wideningWitnesses,
      reason:
        'Effective downstream authority permits at least one protected operation prohibited upstream.',
    };
  }

  return {
    status: 'pass',
    upstreamAllowed: upstreamAllowed,
    translatedAllowed,
    effectiveDownstreamAllowed: effectiveDownstreamAllowed,
    wideningWitnesses: [],
    reason:
      'Effective downstream authority is equal to or narrower than upstream delegated authority.',
  };
}
