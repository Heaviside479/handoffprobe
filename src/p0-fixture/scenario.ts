import type { SecurityContext } from '../core/index.js';
import type { P0McpToolName } from './mcp/types.js';

export type P0FixtureMode = 'secure' | 'vulnerable';

export interface P0Scenario {
  id: string;
  tool: P0McpToolName;

  mcpAudience?: string;

  lifecycleTracking?: boolean;

  cancelLifecycleBeforeTool?: boolean;

  buildArguments(context: SecurityContext): Record<string, unknown>;
}

export const P0_READ_INVOICE_SCENARIO: P0Scenario = {
  id: 'read-authorized-invoice',
  tool: 'read_invoice',

  buildArguments(context) {
    return {
      resource: context.resource,
    };
  },
};

export function createP0UpdateInvoiceScenario(amountCents: number): P0Scenario {
  return {
    id: `update-invoice-${amountCents}`,
    tool: 'update_invoice',

    buildArguments(context) {
      return {
        resource: context.resource,
        amountCents,
      };
    },
  };
}
