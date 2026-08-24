import { describe, expect, it } from 'vitest';

import { cloneSecurityContext } from '../src/core/index.js';
import { EvidenceRecorder } from '../src/protocol-lab/evidence.js';
import {
  P0_APPROVAL_ID,
  P0_AUTHORIZED_RESOURCE,
  P0_CAPABILITY_READ,
  P0_CAPABILITY_REFUND,
  P0_CAPABILITY_UPDATE,
  createP0FixtureState,
  createP0ReferenceContext,
  callP0ToolThroughMcp,
} from '../src/p0-fixture/index.js';

function recorder(runId: string) {
  return new EvidenceRecorder(runId, 'secure', runId);
}

function grant(capability: string) {
  const context = createP0ReferenceContext();

  context.capabilities = [capability];

  if (context.upstreamAuthority === undefined || context.effectiveAuthority === undefined) {
    throw new Error('Reference authority is missing.');
  }

  context.upstreamAuthority.capabilities = [capability];

  context.effectiveAuthority.capabilities = [capability];

  return context;
}

describe('P0 MCP fixture', () => {
  it('reads the authorized invoice through modern MCP without a side effect', async () => {
    const state = createP0FixtureState();

    const evidence = recorder('p0-mcp-read');

    const result = await callP0ToolThroughMcp({
      context: createP0ReferenceContext(),
      recorder: evidence,
      state,
      tool: 'read_invoice',
      arguments: {
        resource: P0_AUTHORIZED_RESOURCE,
      },
    });

    expect(result.era).toBe('modern');

    expect(result.envelope.authorization.invariantAllowed).toBe(true);

    expect(result.envelope.authorization.executed).toBe(true);

    expect(result.envelope.before.sideEffectCounter).toBe(0);

    expect(result.envelope.after.sideEffectCounter).toBe(0);

    expect(evidence.events.map((event) => event.event)).toEqual([
      'mcp.client.connected',
      'mcp.tool.call',
      'p0.authorization',
      'p0.tool.result',
      'mcp.tool.result',
    ]);
  });

  it('executes an update only when both upstream and effective authority grant it', async () => {
    const state = createP0FixtureState();

    const result = await callP0ToolThroughMcp({
      context: grant(P0_CAPABILITY_UPDATE),
      recorder: recorder('p0-mcp-update'),
      state,
      tool: 'update_invoice',
      arguments: {
        resource: P0_AUTHORIZED_RESOURCE,
        amountCents: 15000,
      },
    });

    expect(result.envelope.authorization.invariantAllowed).toBe(true);

    expect(result.envelope.after.sideEffectCounter).toBe(1);

    expect(result.envelope.after.invoices[P0_AUTHORIZED_RESOURCE]?.amountCents).toBe(15000);
  });

  it('rejects delegated authority amplification without changing invoice state', async () => {
    const context = createP0ReferenceContext();

    if (context.effectiveAuthority === undefined) {
      throw new Error('Effective authority is missing.');
    }

    context.capabilities = [P0_CAPABILITY_UPDATE];

    context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

    const state = createP0FixtureState();

    const before = cloneSecurityContext(context);

    const result = await callP0ToolThroughMcp({
      context,
      recorder: recorder('p0-mcp-amplification-secure'),
      state,
      mode: 'enforce',
      tool: 'update_invoice',
      arguments: {
        resource: P0_AUTHORIZED_RESOURCE,
        amountCents: 16000,
      },
    });

    expect(before.upstreamAuthority?.capabilities).toEqual([P0_CAPABILITY_READ]);

    expect(result.envelope.authorization.invariantAllowed).toBe(false);

    expect(result.envelope.authorization.reasons).toContain(
      'authority_amplification_or_binding_change',
    );

    expect(result.envelope.after.sideEffectCounter).toBe(0);

    expect(result.envelope.after.invoices[P0_AUTHORIZED_RESOURCE]?.amountCents).toBe(12900);
  });

  it('can deterministically model a vulnerable fail-open executor', async () => {
    const context = createP0ReferenceContext();

    if (context.effectiveAuthority === undefined) {
      throw new Error('Effective authority is missing.');
    }

    context.capabilities = [P0_CAPABILITY_UPDATE];

    context.effectiveAuthority.capabilities = [P0_CAPABILITY_UPDATE];

    const result = await callP0ToolThroughMcp({
      context,
      recorder: recorder('p0-mcp-amplification-vulnerable'),
      state: createP0FixtureState(),
      mode: 'bypass',
      tool: 'update_invoice',
      arguments: {
        resource: P0_AUTHORIZED_RESOURCE,
        amountCents: 17000,
      },
    });

    expect(result.envelope.authorization.invariantAllowed).toBe(false);

    expect(result.envelope.authorization.executed).toBe(true);

    expect(result.envelope.after.sideEffectCounter).toBe(1);

    expect(result.envelope.after.invoices[P0_AUTHORIZED_RESOURCE]?.amountCents).toBe(17000);
  });

  it('executes only a refund payload matching the approval binding', async () => {
    const valid = await callP0ToolThroughMcp({
      context: grant(P0_CAPABILITY_REFUND),
      recorder: recorder('p0-mcp-refund-valid'),
      state: createP0FixtureState(),
      tool: 'refund_payment',
      arguments: {
        resource: P0_AUTHORIZED_RESOURCE,
        amount: 20,
        recipient: 'acct:A',
        approvalId: P0_APPROVAL_ID,
      },
    });

    expect(valid.envelope.authorization.approvalMatches).toBe(true);

    expect(valid.envelope.after.refunds).toHaveLength(1);

    const mutated = await callP0ToolThroughMcp({
      context: grant(P0_CAPABILITY_REFUND),
      recorder: recorder('p0-mcp-refund-mutated'),
      state: createP0FixtureState(),
      tool: 'refund_payment',
      arguments: {
        resource: P0_AUTHORIZED_RESOURCE,
        amount: 200,
        recipient: 'acct:A',
        approvalId: P0_APPROVAL_ID,
      },
    });

    expect(mutated.envelope.authorization.approvalMatches).toBe(false);

    expect(mutated.envelope.authorization.executed).toBe(false);

    expect(mutated.envelope.after.refunds).toEqual([]);
  });

  it('blocks protected execution after lifecycle cancellation', async () => {
    const context = grant(P0_CAPABILITY_UPDATE);

    if (context.lifecycle === undefined) {
      throw new Error('Lifecycle context is missing.');
    }

    context.lifecycle.state = 'cancelled';

    const result = await callP0ToolThroughMcp({
      context,
      recorder: recorder('p0-mcp-cancelled'),
      state: createP0FixtureState(),
      tool: 'update_invoice',
      arguments: {
        resource: P0_AUTHORIZED_RESOURCE,
        amountCents: 18000,
      },
    });

    expect(result.envelope.authorization.reasons).toContain('governing_task_cancelled');

    expect(result.envelope.authorization.executed).toBe(false);

    expect(result.envelope.after.sideEffectCounter).toBe(0);
  });

  it('registers send_email but does not let invoice.read semantically authorize it', async () => {
    const result = await callP0ToolThroughMcp({
      context: createP0ReferenceContext(),
      recorder: recorder('p0-mcp-email-semantic-binding'),
      state: createP0FixtureState(),
      tool: 'send_email',
      arguments: {
        resource: P0_AUTHORIZED_RESOURCE,
        recipient: 'fixture@example.invalid',
        subject: 'Synthetic only',
      },
    });

    expect(result.envelope.authorization.invariantAllowed).toBe(false);

    expect(result.envelope.authorization.reasons).toContain('tool_capability_semantic_mismatch');

    expect(result.envelope.after.outbox).toEqual([]);
  });
});
