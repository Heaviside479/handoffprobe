export interface SyntheticInvoice {
  resource: string;
  tenant: string;
  amountCents: number;
  currency: 'EUR';
  version: number;
}

export interface SyntheticRefund {
  id: string;
  amount: number;
  recipient: string;
  approvalId: string;
}

export interface SyntheticOutboxMessage {
  id: string;
  recipient: string;
  subject: string;
}

export interface P0FixtureState {
  invoices: Record<string, SyntheticInvoice>;
  refunds: SyntheticRefund[];
  outbox: SyntheticOutboxMessage[];
  sideEffectCounter: number;
}

export interface P0FixtureSnapshot {
  invoices: Record<string, SyntheticInvoice>;
  refunds: SyntheticRefund[];
  outbox: SyntheticOutboxMessage[];
  sideEffectCounter: number;
}

function cloneInvoices(
  invoices: Record<string, SyntheticInvoice>,
): Record<string, SyntheticInvoice> {
  return Object.fromEntries(
    Object.entries(invoices).map(([key, invoice]) => [
      key,
      {
        ...invoice,
      },
    ]),
  );
}

export function createP0FixtureState(): P0FixtureState {
  return {
    invoices: {
      'invoice:INV-1001': {
        resource: 'invoice:INV-1001',
        tenant: 'tenant:acme',
        amountCents: 12900,
        currency: 'EUR',
        version: 1,
      },

      'invoice:INV-2002': {
        resource: 'invoice:INV-2002',
        tenant: 'tenant:globex',
        amountCents: 8800,
        currency: 'EUR',
        version: 1,
      },
    },

    refunds: [],
    outbox: [],
    sideEffectCounter: 0,
  };
}

export function snapshotP0FixtureState(state: P0FixtureState): P0FixtureSnapshot {
  return {
    invoices: cloneInvoices(state.invoices),

    refunds: state.refunds.map((refund) => ({
      ...refund,
    })),

    outbox: state.outbox.map((message) => ({
      ...message,
    })),

    sideEffectCounter: state.sideEffectCounter,
  };
}

export function updateSyntheticInvoice(
  state: P0FixtureState,
  resource: string,
  amountCents: number,
): SyntheticInvoice {
  const invoice = state.invoices[resource];

  if (invoice === undefined) {
    throw new Error(`Synthetic invoice not found: ${resource}`);
  }

  const updated: SyntheticInvoice = {
    ...invoice,
    amountCents,
    version: invoice.version + 1,
  };

  state.invoices[resource] = updated;

  state.sideEffectCounter += 1;

  return {
    ...updated,
  };
}

export function recordSyntheticRefund(
  state: P0FixtureState,
  input: {
    amount: number;
    recipient: string;
    approvalId: string;
  },
): SyntheticRefund {
  state.sideEffectCounter += 1;

  const refund: SyntheticRefund = {
    id: `refund:${state.sideEffectCounter}`,
    amount: input.amount,
    recipient: input.recipient,
    approvalId: input.approvalId,
  };

  state.refunds.push(refund);

  return {
    ...refund,
  };
}

export function recordSyntheticEmail(
  state: P0FixtureState,
  input: {
    recipient: string;
    subject: string;
  },
): SyntheticOutboxMessage {
  state.sideEffectCounter += 1;

  const message: SyntheticOutboxMessage = {
    id: `email:${state.sideEffectCounter}`,
    recipient: input.recipient,
    subject: input.subject,
  };

  state.outbox.push(message);

  return {
    ...message,
  };
}
