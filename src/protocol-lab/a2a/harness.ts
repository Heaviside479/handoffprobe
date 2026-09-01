import { once } from 'node:events';
import type { Server } from 'node:http';

import type { AgentCard, SendMessageRequest } from '@a2a-js/sdk';
import { Role } from '@a2a-js/sdk';
import { ClientFactory, RestTransportFactory } from '@a2a-js/sdk/client';
import { DefaultRequestHandler, InMemoryTaskStore } from '@a2a-js/sdk/server';
import { agentCardHandler, restHandler, UserBuilder } from '@a2a-js/sdk/server/express';
import express, { type Request as ExpressRequest } from 'express';

import type { HandoffAdapter } from '../../core/index.js';
import type { EvidenceRecorder } from '../evidence.js';
import type { FixtureMode, LabRunState, SecurityContext } from '../models.js';
import { HandoffLabExecutor } from './executor.js';

function createAgentCard(restUrl: string): AgentCard {
  return {
    name: 'HandoffProbe Protocol Lab Receiver',
    description: 'Local deterministic A2A receiver used by HandoffProbe protocol fixtures.',
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
        id: 'handoff-read-invoice',
        name: 'Handoff fake invoice read',
        description: 'Translates A2A security context into a local MCP fake-tool request.',
        tags: ['handoff', 'security', 'fixture'],
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
  serverResolveIds: boolean,
): SendMessageRequest {
  return {
    tenant: '',
    message: {
      messageId: `${runId}-request`,
      contextId: serverResolveIds ? '' : `${runId}-context`,
      taskId: '',
      role: Role.ROLE_USER,
      metadata: undefined,
      extensions: [],
      referenceTaskIds: [],
      parts: [
        {
          content: {
            $case: 'text',
            value: 'Read the authorized invoice.',
          },
          mediaType: 'text/plain',
          filename: '',
          metadata: undefined,
        },
      ],
    },
    configuration: undefined,
    metadata: {
      handoffprobeContext: {
        ...context,
        capabilities: [...context.capabilities],
      },
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

  throw new Error('Expected A2A receiver to return a direct Message.');
}

export async function executeA2aFixture(input: {
  fixture: FixtureMode;
  recorder: EvidenceRecorder;
  state: LabRunState;
  context: SecurityContext;
  handoffAdapter: HandoffAdapter;
}): Promise<string> {
  const app = express();

  const server = app.listen(0, '127.0.0.1');

  await once(server, 'listening');

  const address = server.address();

  if (address === null || typeof address === 'string') {
    await closeServer(server);

    throw new Error('Unable to determine A2A loopback port.');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  const agentCard = createAgentCard(`${baseUrl}/a2a`);

  const executor = new HandoffLabExecutor(input.handoffAdapter, input.recorder, input.state);

  const requestHandler = new DefaultRequestHandler(agentCard, new InMemoryTaskStore(), executor);

  const crossingObservationEnabled = input.state.crossingObservation !== undefined;
  const localAuthorization = 'Bearer handoffprobe-local-fixture-caller';

  const userBuilder = crossingObservationEnabled
    ? (request: ExpressRequest) => {
        const authenticated = request.headers.authorization === localAuthorization;
        const authorityCaller = authenticated ? input.context.caller : '';
        const callerOmitted = input.state.crossingObservedOmissions?.has('caller_id') === true;

        input.state.a2aAuthorityCaller = authorityCaller;

        return Promise.resolve({
          isAuthenticated: authenticated,
          userName: authenticated
            ? callerOmitted
              ? ''
              : (input.state.crossingCallerOverride ?? authorityCaller)
            : '',
        });
      }
    : UserBuilder.noAuthentication;

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
      userBuilder,
    }),
  );

  try {
    const factory = new ClientFactory({
      transports: [new RestTransportFactory()],
      preferredTransports: ['HTTP+JSON'],
    });

    const client = await factory.createFromAgentCard(agentCard);

    const request = createRequest(input.recorder.runId, input.context, crossingObservationEnabled);

    if (crossingObservationEnabled) {
      const requestMessage = request.message;

      if (requestMessage === undefined) {
        throw new Error('A2A crossing request is missing its user message.');
      }

      input.state.a2aAuthorityMessageId = requestMessage.messageId;

      if (input.state.crossingMessageIdOverride !== undefined) {
        requestMessage.messageId = input.state.crossingMessageIdOverride;
      }

      input.state.a2aRequestIdentity = {
        taskIdSuppliedByClient: requestMessage.taskId.trim().length > 0,
        contextIdSuppliedByClient: requestMessage.contextId.trim().length > 0,
      };
    }

    input.recorder.record({
      protocol: 'A2A',
      protocolVersion: '1.0',
      boundary: 'fixture-client -> a2a-rest',
      event: 'a2a.client.send',
      context: input.context,
      details: {
        binding: 'HTTP+JSON',
        transport: 'loopback-http',
        path: '/a2a',
      },
    });

    const response = await client.sendMessage(
      request,
      crossingObservationEnabled
        ? {
            serviceParameters: {
              authorization: localAuthorization,
            },
          }
        : undefined,
    );

    const responseText = extractMessageText(response);

    const responseContext = input.state.translatedContext;

    if (responseContext === undefined) {
      throw new Error('A2A executor did not persist translated context.');
    }

    input.recorder.record({
      protocol: 'A2A',
      protocolVersion: '1.0',
      boundary: 'a2a-rest -> fixture-client',
      event: 'a2a.client.receive',
      context: responseContext,
      details: {
        responseType: 'message',
      },
    });

    return responseText;
  } finally {
    await closeServer(server);
  }
}
