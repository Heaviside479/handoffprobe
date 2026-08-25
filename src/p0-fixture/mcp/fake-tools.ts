import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

import type { SecurityContext } from '../../core/index.js';
import type { EvidenceRecorder } from '../../protocol-lab/evidence.js';
import { evaluateP0Authorization } from '../authorization.js';
import { P0_CAPABILITY_READ, P0_CAPABILITY_REFUND, P0_CAPABILITY_UPDATE } from '../constants.js';
import { hashApprovalPayload } from '../payload-hash.js';
import {
  recordSyntheticEmail,
  recordSyntheticRefund,
  snapshotP0FixtureState,
  updateSyntheticInvoice,
} from '../state.js';
import type { P0FixtureState } from '../state.js';
import type {
  P0EnforcementMode,
  P0McpToolName,
  P0ToolAuthorization,
  P0ToolEnvelope,
} from './types.js';

const SEND_EMAIL_CAPABILITY = 'message.send';

const readInvoiceSchema = z.object({
  resource: z.string(),
});

const updateInvoiceSchema = z.object({
  resource: z.string(),
  amountCents: z.number().int(),
});

const refundPaymentSchema = z.object({
  resource: z.string(),
  amount: z.number(),
  recipient: z.string(),
  approvalId: z.string(),
});

const sendEmailSchema = z.object({
  resource: z.string(),
  recipient: z.string(),
  subject: z.string(),
});

function requiredCapability(tool: P0McpToolName): string {
  switch (tool) {
    case 'read_invoice':
      return P0_CAPABILITY_READ;

    case 'update_invoice':
      return P0_CAPABILITY_UPDATE;

    case 'refund_payment':
      return P0_CAPABILITY_REFUND;

    case 'send_email':
      return SEND_EMAIL_CAPABILITY;
  }
}

function approvalMatches(
  context: SecurityContext,
  tool: P0McpToolName,
  payload: unknown,
  approvalId?: string,
): boolean | null {
  if (tool !== 'refund_payment') {
    return null;
  }

  const approval = context.approval;

  if (approval === undefined || approvalId === undefined) {
    return false;
  }

  return (
    approval.approvalId === approvalId &&
    approval.tool === tool &&
    approval.payloadHash === hashApprovalPayload(payload)
  );
}

function buildAuthorization(input: {
  context: SecurityContext;
  tool: P0McpToolName;
  resource: string;
  mode: P0EnforcementMode;
  downstreamAudience: string;
  approvalPayload?: unknown;
  approvalId?: string;
}): P0ToolAuthorization {
  const capability = requiredCapability(input.tool);

  const decision = evaluateP0Authorization(input.context, {
    principal: input.context.principal,
    downstream: input.context.downstream,
    tenant: input.context.tenant,
    resource: input.resource,
    capability,
    tool: input.tool,
  });

  const semanticBindingMatches = input.context.capabilities.includes(capability);

  const approval = approvalMatches(
    input.context,
    input.tool,
    input.approvalPayload,
    input.approvalId,
  );

  const forwardedCredential = input.context.forwardedCredential;

  const credentialAudienceMatches =
    forwardedCredential === undefined
      ? null
      : forwardedCredential.audience === input.downstreamAudience;

  const credentialAccepted =
    forwardedCredential !== undefined &&
    (credentialAudienceMatches === true || input.mode === 'bypass');

  const reasons = [...decision.reasons];

  if (!semanticBindingMatches) {
    reasons.push('tool_capability_semantic_mismatch');
  }

  if (credentialAudienceMatches === false) {
    reasons.push('credential_audience_mismatch');
  }

  if (approval === false) {
    reasons.push('approval_binding_mismatch');
  }

  const invariantAllowed =
    decision.allowed &&
    semanticBindingMatches &&
    approval !== false &&
    credentialAudienceMatches !== false;

  const executed = invariantAllowed || input.mode === 'bypass';

  return {
    policyMode: input.mode,
    invariantAllowed,
    executed,
    decision,
    approvalMatches: approval,

    semanticBindingMatches,

    downstreamAudience: input.downstreamAudience,

    credentialForwarded: forwardedCredential !== undefined,

    credentialAudienceMatches,

    credentialAccepted,

    reasons,
  };
}

function recordAuthorization(
  recorder: EvidenceRecorder,
  context: SecurityContext,
  input: {
    tool: P0McpToolName;
    resource: string;
    capability: string;
    authorization: P0ToolAuthorization;
    before: ReturnType<typeof snapshotP0FixtureState>;
  },
): void {
  recorder.record({
    protocol: 'TOOL',
    protocolVersion: 'local-p0-fixture-v1',
    boundary: 'mcp-server -> p0-authorization',
    event: 'p0.authorization',
    context,
    details: {
      selectedTool: input.tool,
      requestedCapability: input.capability,
      targetResource: input.resource,
      upstreamAuthority: context.upstreamAuthority,
      translatedAuthority: context.effectiveAuthority,
      authorizationResult: input.authorization.invariantAllowed,
      executed: input.authorization.executed,
      policyMode: input.authorization.policyMode,
      authorizationReasons: input.authorization.reasons,
      approvalMatches: input.authorization.approvalMatches,

      semanticBindingMatches: input.authorization.semanticBindingMatches,

      downstreamAudience: input.authorization.downstreamAudience,

      credentialFingerprint: context.forwardedCredential?.fingerprint,

      credentialClass: context.forwardedCredential?.credentialClass,

      credentialAudience: context.forwardedCredential?.audience,

      credentialForwarded: input.authorization.credentialForwarded,

      credentialAudienceMatches: input.authorization.credentialAudienceMatches,

      credentialAccepted: input.authorization.credentialAccepted,

      sideEffectStateBefore: input.before,
    },
  });
}

function recordResult(
  recorder: EvidenceRecorder,
  context: SecurityContext,
  envelope: P0ToolEnvelope,
): void {
  recorder.record({
    protocol: 'TOOL',
    protocolVersion: 'local-p0-fixture-v1',
    boundary: 'p0-tool -> mcp-server',
    event: 'p0.tool.result',
    context,
    details: {
      selectedTool: envelope.tool,
      authorizationResult: envelope.authorization.invariantAllowed,
      executed: envelope.authorization.executed,
      sideEffectStateBefore: envelope.before,
      sideEffectStateAfter: envelope.after,
      output: envelope.output,
    },
  });
}

function textResult(envelope: P0ToolEnvelope) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(envelope),
      },
    ],
  };
}

export function createP0FakeToolServer(
  recorder: EvidenceRecorder,
  context: SecurityContext,
  state: P0FixtureState,
  era: string,
  mode: P0EnforcementMode,
  downstreamAudience: string,
): McpServer {
  const server = new McpServer({
    name: 'handoffprobe-p0-fixture-mcp',
    version: '0.0.0',
  });

  server.registerTool(
    'read_invoice',
    {
      title: 'Read synthetic invoice',
      description: 'Reads deterministic in-memory invoice data.',
      inputSchema: readInvoiceSchema,
    },
    ({ resource }) => {
      const before = snapshotP0FixtureState(state);

      const authorization = buildAuthorization({
        context,
        tool: 'read_invoice',
        resource,
        mode,
        downstreamAudience,
      });

      recordAuthorization(recorder, context, {
        tool: 'read_invoice',
        resource,
        capability: P0_CAPABILITY_READ,
        authorization,
        before,
      });

      const invoice = authorization.executed ? (state.invoices[resource] ?? null) : null;

      const after = snapshotP0FixtureState(state);

      const envelope: P0ToolEnvelope = {
        tool: 'read_invoice',
        authorization,
        before,
        after,
        output: {
          invoice,
          mcpEra: era,
        },
      };

      recordResult(recorder, context, envelope);

      return textResult(envelope);
    },
  );

  server.registerTool(
    'update_invoice',
    {
      title: 'Update synthetic invoice',
      description: 'Updates only deterministic in-memory invoice data.',
      inputSchema: updateInvoiceSchema,
    },
    ({ resource, amountCents }) => {
      const before = snapshotP0FixtureState(state);

      const authorization = buildAuthorization({
        context,
        tool: 'update_invoice',
        resource,
        mode,
        downstreamAudience,
      });

      recordAuthorization(recorder, context, {
        tool: 'update_invoice',
        resource,
        capability: P0_CAPABILITY_UPDATE,
        authorization,
        before,
      });

      const invoice = authorization.executed
        ? updateSyntheticInvoice(state, resource, amountCents)
        : null;

      const after = snapshotP0FixtureState(state);

      const envelope: P0ToolEnvelope = {
        tool: 'update_invoice',
        authorization,
        before,
        after,
        output: {
          invoice,
          mcpEra: era,
        },
      };

      recordResult(recorder, context, envelope);

      return textResult(envelope);
    },
  );

  server.registerTool(
    'refund_payment',
    {
      title: 'Record synthetic refund',
      description: 'Writes only to the deterministic in-memory refund ledger.',
      inputSchema: refundPaymentSchema,
    },
    ({ resource, amount, recipient, approvalId }) => {
      const before = snapshotP0FixtureState(state);

      const payload = {
        amount,
        recipient,
      };

      const authorization = buildAuthorization({
        context,
        tool: 'refund_payment',
        resource,
        mode,
        downstreamAudience,
        approvalPayload: payload,
        approvalId,
      });

      recordAuthorization(recorder, context, {
        tool: 'refund_payment',
        resource,
        capability: P0_CAPABILITY_REFUND,
        authorization,
        before,
      });

      const refund = authorization.executed
        ? recordSyntheticRefund(state, {
            amount,
            recipient,
            approvalId,
          })
        : null;

      const after = snapshotP0FixtureState(state);

      const envelope: P0ToolEnvelope = {
        tool: 'refund_payment',
        authorization,
        before,
        after,
        output: {
          refund,
          approvedPayloadHash: context.approval?.payloadHash,
          executedPayloadHash: hashApprovalPayload(payload),
          mcpEra: era,
        },
      };

      recordResult(recorder, context, envelope);

      return textResult(envelope);
    },
  );

  server.registerTool(
    'send_email',
    {
      title: 'Record synthetic email',
      description: 'Writes only to the deterministic in-memory outbox.',
      inputSchema: sendEmailSchema,
    },
    ({ resource, recipient, subject }) => {
      const before = snapshotP0FixtureState(state);

      const authorization = buildAuthorization({
        context,
        tool: 'send_email',
        resource,
        mode,
        downstreamAudience,
      });

      recordAuthorization(recorder, context, {
        tool: 'send_email',
        resource,
        capability: SEND_EMAIL_CAPABILITY,
        authorization,
        before,
      });

      const message = authorization.executed
        ? recordSyntheticEmail(state, {
            recipient,
            subject,
          })
        : null;

      const after = snapshotP0FixtureState(state);

      const envelope: P0ToolEnvelope = {
        tool: 'send_email',
        authorization,
        before,
        after,
        output: {
          message,
          mcpEra: era,
        },
      };

      recordResult(recorder, context, envelope);

      return textResult(envelope);
    },
  );

  return server;
}
