import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { createMcpHandler } from '@modelcontextprotocol/server';

import type { BoundCrossingVerificationResult } from '../../phase9/crossing-corpus/binding.js';
import type { CrossingEffectRecorder } from '../../phase9/crossing-corpus/effects.js';
import {
  CrossingPreDispatchRejectedError,
  type CrossingPreDispatchGate,
} from '../../phase9/crossing-corpus/gate.js';
import {
  recordMcpCrossingObservation,
  type CrossingObservationState,
} from '../../phase9/crossing-corpus/observation.js';
import type { EvidenceRecorder } from '../evidence.js';
import type { FakeInvoiceResult, SecurityContext } from '../models.js';
import { createFakeToolServer } from './fake-tools.js';

type McpContentBlock =
  | {
      type: 'text';
      text: string;
    }
  | Record<string, unknown>;

function readTextContent(content: McpContentBlock[]): string {
  for (const block of content) {
    if (block.type === 'text' && typeof block.text === 'string') {
      return block.text;
    }
  }

  throw new Error('MCP fake tool returned no text content.');
}

export async function callReadInvoiceThroughMcp(
  context: SecurityContext,
  recorder: EvidenceRecorder,
  crossingObservation?: CrossingObservationState,
  crossingEffectRecorder?: CrossingEffectRecorder,
  crossingPreDispatchGate?: CrossingPreDispatchGate,
): Promise<{
  era: 'modern';
  result: FakeInvoiceResult;
  crossingVerification?: BoundCrossingVerificationResult;
}> {
  const handler = createMcpHandler(
    ({ era }) => createFakeToolServer(recorder, context, era, crossingEffectRecorder),
    {
      legacy: 'reject',
    },
  );

  const mcpAudience = new URL('http://handoffprobe.local/mcp');

  const transport = new StreamableHTTPClientTransport(mcpAudience, {
    fetch: (input, init) => handler.fetch(new Request(input, init)),
  });

  const client = new Client(
    {
      name: 'handoffprobe-protocol-lab',
      version: '0.0.0',
    },
    {
      versionNegotiation: {
        mode: {
          pin: '2026-07-28',
        },
      },
    },
  );

  try {
    await client.connect(transport);

    const era = client.getProtocolEra();

    if (era === 'modern') {
      recorder.record({
        protocol: 'MCP',
        protocolVersion: '2026-07-28',
        boundary: 'handoff-translation -> mcp-client',
        event: 'mcp.client.connected',
        context,
        details: {
          era,
        },
      });
    } else {
      throw new Error(`Expected MCP modern era but received ${String(era)}.`);
    }

    const capability = context.capabilities[0];

    if (capability === undefined) {
      throw new Error('Translated context has no capability.');
    }

    const toolName = 'read_invoice';
    const toolArguments = {
      principal: context.principal,
      caller: context.caller,
      downstream: context.downstream,
      tenant: context.tenant,
      resource: context.resource,
      capability,
    };

    let crossingVerification: BoundCrossingVerificationResult | undefined;

    if (crossingObservation !== undefined) {
      recordMcpCrossingObservation(crossingObservation, {
        audience: mcpAudience.toString(),
        audienceDerivationSource: 'pinned_configuration',
        tool: toolName,
        arguments: toolArguments,
      });
    }

    if (crossingPreDispatchGate !== undefined) {
      if (crossingObservation === undefined) {
        throw new Error('Crossing pre-dispatch gate requires a crossing observation.');
      }

      crossingVerification = crossingPreDispatchGate(crossingObservation);

      if (crossingVerification.decision.outcome === 'reject') {
        throw new CrossingPreDispatchRejectedError(crossingVerification);
      }
    }

    recorder.record({
      protocol: 'MCP',
      protocolVersion: '2026-07-28',
      boundary: 'mcp-client -> mcp-server',
      event: 'mcp.tool.call',
      context,
      details: {
        tool: toolName,
        capability,
        resource: context.resource,
      },
    });

    const result = await client.callTool({
      name: toolName,
      arguments: toolArguments,
    });

    const text = readTextContent(result.content);

    const parsed = JSON.parse(text) as FakeInvoiceResult;

    recorder.record({
      protocol: 'MCP',
      protocolVersion: '2026-07-28',
      boundary: 'mcp-server -> handoff-translation',
      event: 'mcp.tool.result',
      context,
      details: {
        tool: 'read_invoice',
        invoiceId: parsed.invoiceId,
      },
    });

    return {
      era,
      result: parsed,
      ...(crossingVerification === undefined ? {} : { crossingVerification }),
    };
  } finally {
    await client.close();
    await handler.close();
  }
}
