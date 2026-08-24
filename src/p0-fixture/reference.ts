import type { AuthorityGrant, SecurityContext } from '../core/index.js';
import {
  P0_APPROVAL_ID,
  P0_AUTHORIZED_DOWNSTREAM,
  P0_AUTHORIZED_RESOURCE,
  P0_AUTHORIZED_TENANT,
  P0_CALLER,
  P0_CAPABILITY_READ,
  P0_CREDENTIAL_FINGERPRINT,
  P0_MCP_AUDIENCE,
  P0_PRINCIPAL,
  P0_TASK_ID,
} from './constants.js';
import { hashApprovalPayload } from './payload-hash.js';

export const P0_APPROVED_REFUND_PAYLOAD = {
  amount: 20,
  recipient: 'acct:A',
} as const;

export function createReferenceAuthority(): AuthorityGrant {
  return {
    principal: P0_PRINCIPAL,
    delegate: P0_AUTHORIZED_DOWNSTREAM,
    tenant: P0_AUTHORIZED_TENANT,
    resources: [P0_AUTHORIZED_RESOURCE],
    capabilities: [P0_CAPABILITY_READ],
  };
}

export function createP0ReferenceContext(): SecurityContext {
  return {
    principal: P0_PRINCIPAL,
    caller: P0_CALLER,
    downstream: P0_AUTHORIZED_DOWNSTREAM,
    tenant: P0_AUTHORIZED_TENANT,
    resource: P0_AUTHORIZED_RESOURCE,
    capabilities: [P0_CAPABILITY_READ],

    upstreamAuthority: createReferenceAuthority(),

    effectiveAuthority: createReferenceAuthority(),

    approval: {
      approvalId: P0_APPROVAL_ID,
      tool: 'refund_payment',
      payloadHash: hashApprovalPayload(P0_APPROVED_REFUND_PAYLOAD),
    },

    upstreamCredential: {
      fingerprint: P0_CREDENTIAL_FINGERPRINT,
      credentialClass: 'bearer',
      audience: P0_MCP_AUDIENCE,
    },

    lifecycle: {
      taskId: P0_TASK_ID,
      state: 'active',
    },
  };
}
