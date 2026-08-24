export interface AuthorityGrant {
  principal: string;
  delegate: string;
  tenant: string;
  resources: string[];
  capabilities: string[];
}

export interface ApprovalBinding {
  approvalId: string;
  tool: string;
  payloadHash: string;
}

export type CredentialClass = 'bearer' | 'delegated';

export interface CredentialBinding {
  fingerprint: string;
  credentialClass: CredentialClass;
  audience: string;
}

export type LifecycleState = 'active' | 'cancelled' | 'completed';

export interface LifecycleContext {
  taskId: string;
  state: LifecycleState;
}

export interface SecurityContext {
  principal: string;
  caller: string;
  downstream: string;
  tenant: string;
  resource: string;

  /**
   * Legacy/effective capability view retained for the
   * Phase 1 protocol laboratory.
   */
  capabilities: string[];

  /**
   * Authority established before the handoff.
   */
  upstreamAuthority?: AuthorityGrant;

  /**
   * Authority presented to the downstream side after
   * handoff translation.
   */
  effectiveAuthority?: AuthorityGrant;

  /**
   * Optional security-sensitive approval binding.
   */
  approval?: ApprovalBinding;

  /**
   * Sanitized upstream credential metadata.
   * Raw credentials are never stored here.
   */
  upstreamCredential?: CredentialBinding;

  /**
   * Sanitized credential metadata observed downstream.
   * Raw credentials are never stored here.
   */
  forwardedCredential?: CredentialBinding;

  /**
   * Governing task lifecycle state.
   */
  lifecycle?: LifecycleContext;
}

function cloneAuthorityGrant(grant: AuthorityGrant): AuthorityGrant {
  return {
    ...grant,
    resources: [...grant.resources],
    capabilities: [...grant.capabilities],
  };
}

export function cloneSecurityContext(context: SecurityContext): SecurityContext {
  return {
    principal: context.principal,
    caller: context.caller,
    downstream: context.downstream,
    tenant: context.tenant,
    resource: context.resource,
    capabilities: [...context.capabilities],

    ...(context.upstreamAuthority === undefined
      ? {}
      : {
          upstreamAuthority: cloneAuthorityGrant(context.upstreamAuthority),
        }),

    ...(context.effectiveAuthority === undefined
      ? {}
      : {
          effectiveAuthority: cloneAuthorityGrant(context.effectiveAuthority),
        }),

    ...(context.approval === undefined
      ? {}
      : {
          approval: {
            ...context.approval,
          },
        }),

    ...(context.upstreamCredential === undefined
      ? {}
      : {
          upstreamCredential: {
            ...context.upstreamCredential,
          },
        }),

    ...(context.forwardedCredential === undefined
      ? {}
      : {
          forwardedCredential: {
            ...context.forwardedCredential,
          },
        }),

    ...(context.lifecycle === undefined
      ? {}
      : {
          lifecycle: {
            ...context.lifecycle,
          },
        }),
  };
}
