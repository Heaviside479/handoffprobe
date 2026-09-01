import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

import type { CrossingEffectRecorder } from '../../phase9/crossing-corpus/effects.js';
import type { EvidenceRecorder } from '../evidence.js';
import type { FakeInvoiceResult, SecurityContext } from '../models.js';

const inputSchema = z.object({
  principal: z.string(),
  caller: z.string(),
  downstream: z.string(),
  tenant: z.string(),
  resource: z.string(),
  capability: z.string(),
});

export function createFakeToolServer(
  recorder: EvidenceRecorder,
  context: SecurityContext,
  era: string,
  effectRecorder?: CrossingEffectRecorder,
): McpServer {
  const server = new McpServer({
    name: 'handoffprobe-fixture-mcp',
    version: '0.0.0',
  });

  server.registerTool(
    'read_invoice',
    {
      title: 'Read fake invoice',
      description: 'Returns deterministic in-memory invoice data with no external side effects.',
      inputSchema,
    },
    ({ principal, caller, downstream, tenant, resource, capability }) => {
      effectRecorder?.recordEffect();

      recorder.record({
        protocol: 'TOOL',
        protocolVersion: 'local-fixture-v1',
        boundary: 'mcp-server -> fake-tool',
        event: 'fake_tool.execute',
        context,
        details: {
          tool: 'read_invoice',
          resource,
          tenant,
          principal,
          capability,
          mcpEra: era,
        },
      });

      const invoiceId = resource.replace('invoice:', '');

      const result: FakeInvoiceResult = {
        invoiceId,
        tenant,
        principalObserved: principal,
        callerObserved: caller,
        downstreamObserved: downstream,
        capabilityObserved: capability,
        amountCents: 12900,
        currency: 'EUR',
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result),
          },
        ],
      };
    },
  );

  return server;
}
