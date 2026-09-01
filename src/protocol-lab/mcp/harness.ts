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
import type { CrossingMcpRuntimeOverride, FakeInvoiceResult, SecurityContext } from '../models.js';
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
  crossingAuthorityObservation?: CrossingObservationState,
  crossingMcpRuntimeOverride?: CrossingMcpRuntimeOverride,
): Promise<{
  era: 'modern';
  result: FakeInvoiceResult;
  crossingVerification?: BoundCrossingVerificationResult;
}> {
  const capability = context.capabilities[0];

  if (capability === undefined) {
    throw new Error('Translated context has no capability.');
  }

  const authorityAudience = new URL('http://handoffprobe.local/mcp');

  const runtimeAudience = new URL(
    crossingMcpRuntimeOverride?.audience ?? authorityAudience.toString(),
  );

  const authorityTool = 'read_invoice';

  const authorityArguments = {
    principal: context.principal,
    caller: context.caller,
    downstream: context.downstream,
    tenant: context.tenant,
    resource: context.resource,
    capability,
  };

  const runtimeTool = crossingMcpRuntimeOverride?.tool ?? authorityTool;

  const runtimeArguments =
    crossingMcpRuntimeOverride?.arguments === undefined
      ? structuredClone(authorityArguments)
      : structuredClone(crossingMcpRuntimeOverride.arguments);

  const handler = createMcpHandler(
    ({ era }) =>
      createFakeToolServer(recorder, context, era, crossingEffectRecorder, {
        ...(runtimeTool === authorityTool ? {} : { runtimeToolName: runtimeTool }),
        allowArbitraryArguments: crossingMcpRuntimeOverride?.arguments !== undefined,
      }),
    {
      legacy: 'reject',
    },
  );

  const transport = new StreamableHTTPClientTransport(runtimeAudience, {
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
      throw new Error('Expected MCP modern era but received ' + String(era) + '.');
    }

    let crossingVerification: BoundCrossingVerificationResult | undefined;

    if (crossingObservation !== undefined) {
      recordMcpCrossingObservation(crossingObservation, {
        audience: runtimeAudience.toString(),
        audienceDerivationSource: 'pinned_configuration',
        tool: runtimeTool,
        arguments: runtimeArguments,
      });
    }

    if (crossingAuthorityObservation !== undefined) {
      recordMcpCrossingObservation(crossingAuthorityObservation, {
        audience: authorityAudience.toString(),
        audienceDerivationSource: 'pinned_configuration',
        tool: authorityTool,
        arguments: authorityArguments,
      });
    }

    if (crossingPreDispatchGate !== undefined) {
      if (crossingObservation === undefined) {
        throw new Error('Crossing pre-dispatch gate requires a crossing observation.');
      }

      crossingVerification = crossingPreDispatchGate(
        crossingObservation,
        crossingAuthorityObservation ?? crossingObservation,
      );

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
        tool: runtimeTool,
        capability,
        resource: context.resource,
      },
    });

    const result = await client.callTool({
      name: runtimeTool,
      arguments: runtimeArguments,
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
        tool: runtimeTool,
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
