import { once } from 'node:events';
import type { Server } from 'node:http';

import type { AgentCard, SendMessageRequest } from '@a2a-js/sdk';
import { Role } from '@a2a-js/sdk';
import { ClientFactory, RestTransportFactory } from '@a2a-js/sdk/client';
import { DefaultRequestHandler, InMemoryTaskStore } from '@a2a-js/sdk/server';
import { UserBuilder, agentCardHandler, restHandler } from '@a2a-js/sdk/server/express';
import express from 'express';

import type { HandoffAdapter, SecurityContext } from '../../core/index.js';
import type { EvidenceRecorder } from '../../protocol-lab/evidence.js';
import type { P0EnforcementMode } from '../mcp/types.js';
import type { P0Scenario } from '../scenario.js';
import type { P0FixtureState } from '../state.js';
import { P0A2aExecutor } from './executor.js';
import type { P0A2aRunState } from './executor.js';

function createAgentCard(restUrl: string): AgentCard {
  return {
    name: 'HandoffProbe P0 Fixture Receiver',

    description: 'Local deterministic A2A receiver for HandoffProbe P0 handoff security tests.',

    provider: undefined,
    version: '0.0.0',

    capabilities: {
      streaming: false,
      pushNotifications: false,
      extensions: [],
    },

    defaultInputModes: ['application/json'],

    defaultOutputModes: ['application/json'],

    skills: [
      {
        id: 'handoffprobe-p0-action',
        name: 'Execute synthetic P0 action',
        description:
          'Translates an A2A security context into a deterministic local MCP fixture action.',
        tags: ['handoff', 'security', 'p0', 'fixture'],
        examples: [],
        inputModes: ['application/json'],
        outputModes: ['application/json'],
        securityRequirements: [],
      },
    ],

    securitySchemes: {},
    securityRequirements: [],

    supportedInterfaces: [
      {
        url: restUrl,
        protocolBinding: 'HTTP+JSON',
        protocolVersion: '1.0',
        tenant: '',
      },
    ],

    signatures: [],
  };
}

function createRequest(
  runId: string,
  context: SecurityContext,
  scenario: P0Scenario,
): SendMessageRequest {
  return {
    tenant: '',

    message: {
      messageId: `${runId}-request`,
      contextId: `${runId}-context`,
      taskId: '',
      role: Role.ROLE_USER,
      metadata: undefined,
      extensions: [],
      referenceTaskIds: [],

      parts: [
        {
          content: {
            $case: 'text',
            value: `Execute synthetic P0 scenario ${scenario.id}.`,
          },
          mediaType: 'text/plain',
          filename: '',
          metadata: undefined,
        },
      ],
    },

    configuration: undefined,

    metadata: {
      handoffprobeContext: context,
    },
  };
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error === undefined) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}

function extractMessageText(
  result: Awaited<
    ReturnType<Awaited<ReturnType<ClientFactory['createFromAgentCard']>>['sendMessage']>
  >,
): string {
  if ('messageId' in result) {
    const part = result.parts[0];

    if (part?.content?.$case === 'text') {
      return part.content.value;
    }
  }

  throw new Error('Expected P0 A2A receiver to return a direct Message.');
}

export async function executeP0A2aFixture(input: {
  recorder: EvidenceRecorder;
  state: P0A2aRunState;
  fixtureState: P0FixtureState;
  context: SecurityContext;
  handoffAdapter: HandoffAdapter;
  scenario: P0Scenario;
  enforcementMode: P0EnforcementMode;
}): Promise<string> {
  const app = express();

  const server = app.listen(0, '127.0.0.1');

  await once(server, 'listening');

  const address = server.address();

  if (address === null || typeof address === 'string') {
    await closeServer(server);

    throw new Error('Unable to determine P0 A2A loopback port.');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  const agentCard = createAgentCard(`${baseUrl}/a2a`);

  const executor = new P0A2aExecutor(
    input.handoffAdapter,
    input.scenario,
    input.enforcementMode,
    input.recorder,
    input.fixtureState,
    input.state,
  );

  const requestHandler = new DefaultRequestHandler(agentCard, new InMemoryTaskStore(), executor);

  app.use(express.json());

  app.use(
    '/.well-known/agent-card.json',
    agentCardHandler({
      agentCardProvider: requestHandler,
    }),
  );

  app.use(
    '/a2a',
    restHandler({
      requestHandler,
      userBuilder: UserBuilder.noAuthentication,
    }),
  );

  try {
    const factory = new ClientFactory({
      transports: [new RestTransportFactory()],
      preferredTransports: ['HTTP+JSON'],
    });

    const client = await factory.createFromAgentCard(agentCard);

    input.recorder.record({
      protocol: 'A2A',
      protocolVersion: '1.0',
      boundary: 'p0-fixture-client -> a2a-rest',
      event: 'a2a.client.send',
      context: input.context,
      details: {
        binding: 'HTTP+JSON',
        transport: 'loopback-http',
        path: '/a2a',
        scenarioId: input.scenario.id,
        selectedTool: input.scenario.tool,
      },
    });

    const response = await client.sendMessage(
      createRequest(input.recorder.runId, input.context, input.scenario),
    );

    const responseText = extractMessageText(response);

    const responseContext = input.state.translatedContext;

    if (responseContext === undefined) {
      throw new Error('P0 A2A executor did not persist translated context.');
    }

    input.recorder.record({
      protocol: 'A2A',
      protocolVersion: '1.0',
      boundary: 'a2a-rest -> p0-fixture-client',
      event: 'a2a.client.receive',
      context: responseContext,
      details: {
        responseType: 'message',
        scenarioId: input.scenario.id,
      },
    });

    return responseText;
  } finally {
    await closeServer(server);
  }
}
