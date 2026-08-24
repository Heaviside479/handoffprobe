import type { AuthorityGrant, SecurityContext } from '../core/index.js';

export interface P0AuthorizationRequest {
  principal: string;
  downstream: string;
  tenant: string;
  resource: string;
  capability: string;
  tool: string;
}

export interface P0AuthorizationDecision {
  allowed: boolean;
  reasons: string[];

  upstreamAuthorityPresent: boolean;

  effectiveAuthorityPresent: boolean;

  principalMatches: boolean;

  delegateMatches: boolean;

  tenantMatches: boolean;

  resourceMatches: boolean;

  capabilityAllowed: boolean;

  authorityNotAmplified: boolean;

  lifecycleAllows: boolean;
}

function includesAll(subset: readonly string[], superset: readonly string[]): boolean {
  return subset.every((value) => superset.includes(value));
}

function authorityDoesNotAmplify(
  upstream: AuthorityGrant | undefined,
  effective: AuthorityGrant | undefined,
): boolean {
  if (upstream === undefined || effective === undefined) {
    return false;
  }

  return (
    effective.principal === upstream.principal &&
    effective.delegate === upstream.delegate &&
    effective.tenant === upstream.tenant &&
    includesAll(effective.resources, upstream.resources) &&
    includesAll(effective.capabilities, upstream.capabilities)
  );
}

export function evaluateP0Authorization(
  context: SecurityContext,
  request: P0AuthorizationRequest,
): P0AuthorizationDecision {
  const upstream = context.upstreamAuthority;

  const effective = context.effectiveAuthority;

  const principalMatches = effective?.principal === request.principal;

  const delegateMatches = effective?.delegate === request.downstream;

  const tenantMatches = effective?.tenant === request.tenant;

  const resourceMatches = effective?.resources.includes(request.resource) ?? false;

  const capabilityAllowed = effective?.capabilities.includes(request.capability) ?? false;

  const authorityNotAmplified = authorityDoesNotAmplify(upstream, effective);

  const lifecycleAllows = context.lifecycle?.state !== 'cancelled';

  const reasons: string[] = [];

  if (upstream === undefined) {
    reasons.push('missing_upstream_authority');
  }

  if (effective === undefined) {
    reasons.push('missing_effective_authority');
  }

  if (!principalMatches) {
    reasons.push('principal_mismatch');
  }

  if (!delegateMatches) {
    reasons.push('delegate_mismatch');
  }

  if (!tenantMatches) {
    reasons.push('tenant_mismatch');
  }

  if (!resourceMatches) {
    reasons.push('resource_mismatch');
  }

  if (!capabilityAllowed) {
    reasons.push('capability_not_granted');
  }

  if (!authorityNotAmplified) {
    reasons.push('authority_amplification_or_binding_change');
  }

  if (!lifecycleAllows) {
    reasons.push('governing_task_cancelled');
  }

  return {
    allowed: reasons.length === 0,
    reasons,

    upstreamAuthorityPresent: upstream !== undefined,

    effectiveAuthorityPresent: effective !== undefined,

    principalMatches,
    delegateMatches,
    tenantMatches,
    resourceMatches,
    capabilityAllowed,
    authorityNotAmplified,
    lifecycleAllows,
  };
}
