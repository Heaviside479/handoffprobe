export interface SecurityContext {
  principal: string;
  caller: string;
  downstream: string;
  tenant: string;
  resource: string;
  capabilities: string[];
}

export function cloneSecurityContext(context: SecurityContext): SecurityContext {
  return {
    ...context,
    capabilities: [...context.capabilities],
  };
}
