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

const arbitraryInputSchema = z.object({}).catchall(z.unknown());

export interface CrossingSyntheticDispatchConfig {
  runtimeToolName?: string;
  allowArbitraryArguments?: boolean;
}

function readStringArgument(
  input: Record<string, unknown>,
  field: string,
  fallback: string,
): string {
  const value = input[field];
  return typeof value === 'string' ? value : fallback;
}

export function createFakeToolServer(
  recorder: EvidenceRecorder,
  context: SecurityContext,
  era: string,
  effectRecorder?: CrossingEffectRecorder,
  crossingDispatch?: CrossingSyntheticDispatchConfig,
): McpServer {
  const server = new McpServer({
    name: 'handoffprobe-fixture-mcp',
    version: '0.0.0',
  });

  const executeSyntheticEffect = (tool: string, input: Record<string, unknown>) => {
    effectRecorder?.recordEffect();

    const principal = readStringArgument(input, 'principal', context.principal);
    const caller = readStringArgument(input, 'caller', context.caller);
    const downstream = readStringArgument(input, 'downstream', context.downstream);
    const tenant = readStringArgument(input, 'tenant', context.tenant);
    const resource = readStringArgument(input, 'resource', context.resource);
    const capability = readStringArgument(input, 'capability', context.capabilities[0] ?? '');

    recorder.record({
      protocol: 'TOOL',
      protocolVersion: 'local-fixture-v1',
      boundary: 'mcp-server -> fake-tool',
      event: 'fake_tool.execute',
      context,
      details: {
        tool,
        resource,
        tenant,
        principal,
        capability,
        mcpEra: era,
      },
    });

    const result: FakeInvoiceResult = {
      invoiceId: resource.replace('invoice:', ''),
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
          type: 'text' as const,
          text: JSON.stringify(result),
        },
      ],
    };
  };

  const registerProductiveTool = (tool: string, allowArbitraryArguments: boolean): void => {
    const common = {
      title: 'Read fake invoice',
      description: 'Returns deterministic in-memory invoice data with no external side effects.',
    };

    if (allowArbitraryArguments) {
      server.registerTool(
        tool,
        {
          ...common,
          inputSchema: arbitraryInputSchema,
        },
        (input) => executeSyntheticEffect(tool, input),
      );
      return;
    }

    server.registerTool(
      tool,
      {
        ...common,
        inputSchema,
      },
      (input) => executeSyntheticEffect(tool, input),
    );
  };

  const runtimeToolName = crossingDispatch?.runtimeToolName ?? 'read_invoice';

  const allowArbitraryArguments = crossingDispatch?.allowArbitraryArguments === true;

  registerProductiveTool(
    'read_invoice',
    allowArbitraryArguments && runtimeToolName === 'read_invoice',
  );

  if (runtimeToolName !== 'read_invoice') {
    registerProductiveTool(runtimeToolName, allowArbitraryArguments);
  }

  return server;
}
