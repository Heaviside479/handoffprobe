import type { TargetAdapter, TargetExecutionResult } from './adapters.js';
import type { AttackDefinition } from './attacks.js';
import { HandoffProbeCoreError } from './errors.js';
import type { EvidenceEvent } from './evidence.js';
import type { Finding, FindingSeverity, FindingStatus } from './findings.js';
import { cloneSecurityContext } from './security-context.js';
import type { SecurityContext } from './security-context.js';

export type EvaluationStatus = Exclude<FindingStatus, 'error'>;

export interface AttackEvaluation {
  status: EvaluationStatus;
  observedBehavior: string;
  severity?: FindingSeverity;
  evidenceSequences?: readonly number[];
  remediation?: string;
}

export interface AttackCase {
  definition: AttackDefinition;

  evaluate(result: TargetExecutionResult): AttackEvaluation | Promise<AttackEvaluation>;
}

export interface CoreRunInput {
  attack: AttackCase;
  target: TargetAdapter;
  context: SecurityContext;
  runId: string;
  correlationId?: string;
  timeoutMs?: number;
}

export interface StructuredRunError {
  name: 'HandoffProbeCoreError';
  code: HandoffProbeCoreError['code'];
  message: string;
  stage: string;
  details: Readonly<Record<string, unknown>>;
}

export interface CoreRunResult {
  finding: Finding;
  evidence: readonly EvidenceEvent[];
  error?: StructuredRunError;
}

const DEFAULT_TIMEOUT_MS = 5_000;

function validateTimeout(timeoutMs: number): void {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new HandoffProbeCoreError(
      'INVALID_TIMEOUT',
      'Timeout must be a positive finite number.',
      'runner',
      {
        timeoutMs,
      },
    );
  }
}

function normalizeEvidence(
  evidence: readonly EvidenceEvent[],
  input: {
    testId: AttackDefinition['id'];
    runId: string;
    correlationId: string;
    provenance: AttackDefinition['sourceReferences'];
  },
): EvidenceEvent[] {
  return evidence.map((event) => ({
    ...event,
    runId: input.runId,
    correlationId: input.correlationId,
    testId: input.testId,
    context: cloneSecurityContext(event.context),
    details: {
      ...event.details,
    },
    provenance: [...event.provenance, ...input.provenance],
  }));
}

function errorFinding(input: {
  definition: AttackDefinition;
  runId: string;
  correlationId: string;
  error: HandoffProbeCoreError;
}): Finding {
  return {
    testId: input.definition.id,
    runId: input.runId,
    correlationId: input.correlationId,
    title: input.definition.name,
    severity: 'info',
    status: 'error',
    propertyClass: input.definition.propertyClass,
    applicability: input.definition.applicability,
    expectedInvariant: input.definition.expectedInvariant,
    observedBehavior: 'HandoffProbe could not execute or observe this test correctly.',
    evidenceSequences: [],
    sources: input.definition.sourceReferences,
  };
}

function structuredError(error: HandoffProbeCoreError): StructuredRunError {
  return {
    name: 'HandoffProbeCoreError',
    code: error.code,
    message: error.message,
    stage: error.stage,
    details: error.details,
  };
}

async function executeWithTimeout(
  target: TargetAdapter,
  input: {
    runId: string;
    correlationId: string;
    context: SecurityContext;
    timeoutMs: number;
  },
): Promise<TargetExecutionResult> {
  const controller = new AbortController();

  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();

      reject(
        new HandoffProbeCoreError(
          'TIMEOUT',
          `Target execution exceeded ${input.timeoutMs} ms.`,
          'target-execution',
          {
            targetId: target.id,
            timeoutMs: input.timeoutMs,
          },
        ),
      );
    }, input.timeoutMs);
  });

  try {
    return await Promise.race([
      target.execute({
        runId: input.runId,
        correlationId: input.correlationId,
        context: cloneSecurityContext(input.context),
        signal: controller.signal,
      }),
      timeout,
    ]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

export class CoreRunner {
  async run(input: CoreRunInput): Promise<CoreRunResult> {
    const correlationId = input.correlationId ?? `${input.runId}:${input.attack.definition.id}`;

    const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    try {
      validateTimeout(timeoutMs);
    } catch (error) {
      if (error instanceof HandoffProbeCoreError) {
        return {
          finding: errorFinding({
            definition: input.attack.definition,
            runId: input.runId,
            correlationId,
            error,
          }),
          evidence: [],
          error: structuredError(error),
        };
      }

      throw error;
    }

    let execution: TargetExecutionResult;

    try {
      execution = await executeWithTimeout(input.target, {
        runId: input.runId,
        correlationId,
        context: input.context,
        timeoutMs,
      });
    } catch (error) {
      const coreError =
        error instanceof HandoffProbeCoreError
          ? error
          : new HandoffProbeCoreError(
              'ADAPTER_ERROR',
              'Target adapter execution failed.',
              'target-execution',
              {
                targetId: input.target.id,
                causeName: error instanceof Error ? error.name : typeof error,
              },
            );

      return {
        finding: errorFinding({
          definition: input.attack.definition,
          runId: input.runId,
          correlationId,
          error: coreError,
        }),
        evidence: [],
        error: structuredError(coreError),
      };
    }

    const evidence = normalizeEvidence(execution.evidence, {
      testId: input.attack.definition.id,
      runId: input.runId,
      correlationId,
      provenance: input.attack.definition.sourceReferences,
    });

    let evaluation: AttackEvaluation;

    try {
      evaluation = await input.attack.evaluate({
        ...execution,
        evidence,
      });
    } catch (error) {
      const coreError = new HandoffProbeCoreError(
        'EVALUATION_ERROR',
        'Attack evaluation failed.',
        'attack-evaluation',
        {
          attackId: input.attack.definition.id,
          causeName: error instanceof Error ? error.name : typeof error,
        },
      );

      return {
        finding: errorFinding({
          definition: input.attack.definition,
          runId: input.runId,
          correlationId,
          error: coreError,
        }),
        evidence,
        error: structuredError(coreError),
      };
    }

    const finding: Finding = {
      testId: input.attack.definition.id,
      runId: input.runId,
      correlationId,
      title: input.attack.definition.name,
      severity: evaluation.severity ?? input.attack.definition.defaultSeverity,
      status: evaluation.status,
      propertyClass: input.attack.definition.propertyClass,
      applicability: input.attack.definition.applicability,
      expectedInvariant: input.attack.definition.expectedInvariant,
      observedBehavior: evaluation.observedBehavior,
      evidenceSequences: evaluation.evidenceSequences ?? evidence.map((event) => event.sequence),
      sources: input.attack.definition.sourceReferences,
      ...(evaluation.remediation === undefined
        ? {}
        : {
            remediation: evaluation.remediation,
          }),
    };

    return {
      finding,
      evidence,
    };
  }
}
