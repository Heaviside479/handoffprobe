import { describe, expect, it } from 'vitest';

import { cloneSecurityContext } from '../src/core/index.js';
import {
  P0_APPROVED_REFUND_PAYLOAD,
  P0_AUTHORIZED_RESOURCE,
  P0_AUTHORIZED_TENANT,
  P0_CAPABILITY_READ,
  P0_CAPABILITY_UPDATE,
  P0_PRINCIPAL,
  P0_UNAUTHORIZED_DOWNSTREAM,
  P0_UNAUTHORIZED_RESOURCE,
  P0_UNAUTHORIZED_TENANT,
  createP0FixtureState,
  createP0ReferenceContext,
  evaluateP0Authorization,
  hashApprovalPayload,
  recordSyntheticRefund,
  snapshotP0FixtureState,
  updateSyntheticInvoice,
} from '../src/p0-fixture/index.js';

function requestFromReference() {
  return {
    principal: P0_PRINCIPAL,
    downstream: 'agent:billing',
    tenant: P0_AUTHORIZED_TENANT,
    resource: P0_AUTHORIZED_RESOURCE,
    capability: P0_CAPABILITY_READ,
    tool: 'read_invoice',
  };
}

describe('P0 shared fixture domain', () => {
  it('creates a secure reference context with separate upstream and effective authority', () => {
    const context = createP0ReferenceContext();

    expect(context.upstreamAuthority).toEqual(context.effectiveAuthority);

    expect(context.upstreamAuthority).not.toBe(context.effectiveAuthority);

    expect(context.forwardedCredential).toBeUndefined();
  });

  it('deep-clones P0 security bindings', () => {
    const original = createP0ReferenceContext();

    const clone = cloneSecurityContext(original);

    clone.effectiveAuthority?.capabilities.push(P0_CAPABILITY_UPDATE);

    expect(original.effectiveAuthority?.capabilities).toEqual([P0_CAPABILITY_READ]);

    expect(clone.approval).not.toBe(original.approval);

    expect(clone.upstreamCredential).not.toBe(original.upstreamCredential);
  });

  it('allows the exact secure reference authorization', () => {
    const decision = evaluateP0Authorization(createP0ReferenceContext(), requestFromReference());

    expect(decision.allowed).toBe(true);

    expect(decision.reasons).toEqual([]);
  });

  it('fails closed when upstream authority is missing', () => {
    const context = createP0ReferenceContext();

    delete context.upstreamAuthority;

    const decision = evaluateP0Authorization(context, requestFromReference());

    expect(decision.allowed).toBe(false);

    expect(decision.reasons).toContain('missing_upstream_authority');
  });

  it('rejects authority amplification', () => {
    const context = createP0ReferenceContext();

    if (context.effectiveAuthority === undefined) {
      throw new Error('Reference context has no effective authority.');
    }

    context.effectiveAuthority.capabilities = [P0_CAPABILITY_READ, P0_CAPABILITY_UPDATE];

    const request = {
      ...requestFromReference(),
      capability: P0_CAPABILITY_UPDATE,
      tool: 'update_invoice',
    };

    const decision = evaluateP0Authorization(context, request);

    expect(decision.allowed).toBe(false);

    expect(decision.authorityNotAmplified).toBe(false);
  });

  it('rejects cross-agent authorization reuse', () => {
    const context = createP0ReferenceContext();

    context.downstream = P0_UNAUTHORIZED_DOWNSTREAM;

    const decision = evaluateP0Authorization(context, {
      ...requestFromReference(),
      downstream: P0_UNAUTHORIZED_DOWNSTREAM,
    });

    expect(decision.allowed).toBe(false);

    expect(decision.reasons).toContain('delegate_mismatch');
  });

  it('rejects tenant substitution', () => {
    const context = createP0ReferenceContext();

    context.tenant = P0_UNAUTHORIZED_TENANT;

    const decision = evaluateP0Authorization(context, {
      ...requestFromReference(),
      tenant: P0_UNAUTHORIZED_TENANT,
    });

    expect(decision.allowed).toBe(false);

    expect(decision.reasons).toContain('tenant_mismatch');
  });

  it('rejects resource substitution', () => {
    const context = createP0ReferenceContext();

    context.resource = P0_UNAUTHORIZED_RESOURCE;

    const decision = evaluateP0Authorization(context, {
      ...requestFromReference(),
      resource: P0_UNAUTHORIZED_RESOURCE,
    });

    expect(decision.allowed).toBe(false);

    expect(decision.reasons).toContain('resource_mismatch');
  });

  it('binds approval to canonical payload content', () => {
    const original = hashApprovalPayload(P0_APPROVED_REFUND_PAYLOAD);

    const sameDifferentKeyOrder = hashApprovalPayload({
      recipient: 'acct:A',
      amount: 20,
    });

    const mutated = hashApprovalPayload({
      amount: 200,
      recipient: 'acct:A',
    });

    expect(sameDifferentKeyOrder).toBe(original);

    expect(mutated).not.toBe(original);
  });

  it('tracks synthetic side effects deterministically without external systems', () => {
    const state = createP0FixtureState();

    const before = snapshotP0FixtureState(state);

    updateSyntheticInvoice(state, P0_AUTHORIZED_RESOURCE, 13000);

    recordSyntheticRefund(state, {
      amount: 20,
      recipient: 'acct:A',
      approvalId: 'approval:refund-001',
    });

    const after = snapshotP0FixtureState(state);

    expect(before.sideEffectCounter).toBe(0);

    expect(after.sideEffectCounter).toBe(2);

    expect(after.invoices[P0_AUTHORIZED_RESOURCE]?.amountCents).toBe(13000);

    expect(after.refunds).toEqual([
      {
        id: 'refund:2',
        amount: 20,
        recipient: 'acct:A',
        approvalId: 'approval:refund-001',
      },
    ]);
  });

  it('stores only credential metadata and no raw bearer secret in the reference context', () => {
    const serialized = JSON.stringify(createP0ReferenceContext());

    expect(serialized).toContain('sha256:fixture-upstream-bearer');

    expect(serialized).not.toContain('Bearer ');

    expect(serialized).not.toContain('rawToken');
  });
});
