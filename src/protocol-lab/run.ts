import { runProtocolFixture } from './fixture.js';

for (const fixture of ['secure', 'vulnerable'] as const) {
  const result = await runProtocolFixture(fixture);

  console.log();
  console.log(`===== ${fixture.toUpperCase()} FIXTURE =====`);

  console.log(
    JSON.stringify(
      {
        runId: result.runId,
        a2aProtocolVersion: result.a2aProtocolVersion,
        mcpProtocolVersion: result.mcpProtocolVersion,
        mcpEra: result.mcpEra,
        originalPrincipal: result.originalContext.principal,
        translatedPrincipal: result.translatedContext.principal,
        invoiceId: result.toolResult.invoiceId,
        evidence: result.evidence.map((event) => ({
          sequence: event.sequence,
          protocol: event.protocol,
          event: event.event,
          principal: event.context.principal,
        })),
      },
      null,
      2,
    ),
  );
}
