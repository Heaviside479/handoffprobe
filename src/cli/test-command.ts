import { CoreRunner } from '../core/index.js';
import { VERSION } from '../index.js';

import type { CoreRunResult, FindingSeverity, FindingStatus } from '../core/index.js';

import type { CliFailOn } from './config.js';
import { sanitizeCliLine } from './diagnostics.js';
import { CLI_EXECUTION_CATALOG, getCliExecutionBinding } from './execution-catalog.js';
import { CLI_PROTOCOL_BASELINE } from './protocols.js';

import type { CliExecutionBinding, CliTargetFixture } from './execution-catalog.js';

export interface CliTestSelection {
  readonly bindings: readonly CliExecutionBinding[];
  readonly unknownIds: readonly string[];
}

export interface CliTestSummary {
  readonly pass: number;
  readonly fail: number;
  readonly notApplicable: number;
  readonly inconclusive: number;
  readonly error: number;
  readonly total: number;
}

export interface CliTestRun {
  readonly target: CliTargetFixture;
  readonly selectedIds: readonly string[];
  readonly results: readonly CoreRunResult[];
  readonly summary: CliTestSummary;
}

const SEVERITY_RANK: Readonly<Record<FindingSeverity, number>> = {
  info: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function resolveCliTestSelection(
  requestedIds: readonly string[] | undefined,
): CliTestSelection {
  if (requestedIds === undefined || requestedIds.length === 0) {
    return {
      bindings: CLI_EXECUTION_CATALOG,
      unknownIds: [],
    };
  }

  const requested = new Set(requestedIds);
  const unknownIds: string[] = [];

  for (const id of requested) {
    if (getCliExecutionBinding(id) === undefined) {
      unknownIds.push(id);
    }
  }

  return {
    bindings: CLI_EXECUTION_CATALOG.filter((binding) => requested.has(binding.definition.id)),
    unknownIds,
  };
}

function summarize(results: readonly CoreRunResult[]): CliTestSummary {
  const counts: Record<FindingStatus, number> = {
    pass: 0,
    fail: 0,
    not_applicable: 0,
    inconclusive: 0,
    error: 0,
  };

  for (const result of results) {
    counts[result.finding.status] += 1;
  }

  return {
    pass: counts.pass,
    fail: counts.fail,
    notApplicable: counts.not_applicable,
    inconclusive: counts.inconclusive,
    error: counts.error,
    total: results.length,
  };
}

export async function runCliTests(input: {
  target: CliTargetFixture;
  bindings: readonly CliExecutionBinding[];
}): Promise<CliTestRun> {
  const runner = new CoreRunner();
  const results: CoreRunResult[] = [];

  for (const binding of input.bindings) {
    const id = binding.definition.id;

    const result = await runner.run({
      attack: binding.attack,
      target: binding.createTarget(input.target),
      context: binding.createContext(),
      runId: `cli:${input.target}:${id}`,
      correlationId: `cli:${input.target}:${id}:correlation`,
    });

    results.push(result);
  }

  return {
    target: input.target,
    selectedIds: input.bindings.map((binding) => binding.definition.id),
    results,
    summary: summarize(results),
  };
}

export function evaluateCliTestExitCode(run: CliTestRun, failOn: CliFailOn): 0 | 1 | 3 {
  if (run.summary.error > 0) {
    return 3;
  }

  const thresholdRank = SEVERITY_RANK[failOn];

  const securityFailure = run.results.some((result) => {
    return (
      result.finding.status === 'fail' && SEVERITY_RANK[result.finding.severity] >= thresholdRank
    );
  });

  return securityFailure ? 1 : 0;
}

function statusLabel(status: FindingStatus): string {
  return status.toUpperCase();
}

function gateLabel(exitCode: 0 | 1 | 3, failOn: CliFailOn): string {
  const threshold = failOn.toUpperCase();

  if (exitCode === 3) {
    return 'Security gate: ERROR (scanner/runtime result present; not reported as a vulnerability gate failure).';
  }

  if (exitCode === 1) {
    return `Security gate: FAIL (at least one vulnerability FAIL at or above ${threshold}).`;
  }

  return `Security gate: PASS (no vulnerability FAIL at or above ${threshold}).`;
}

export function renderCliTestRun(run: CliTestRun, failOn: CliFailOn): string {
  const exitCode = evaluateCliTestExitCode(run, failOn);

  const lines = [
    'HandoffProbe test',
    `Version: ${VERSION}`,
    '',
    `Target: ${run.target}`,
    `Protocols: ${CLI_PROTOCOL_BASELINE}`,
    `Selected attacks: ${run.selectedIds.length}`,
    `Fail on: ${failOn.toUpperCase()}`,
    '',
  ];

  for (const result of run.results) {
    const finding = result.finding;

    lines.push(
      `${statusLabel(finding.status).padEnd(14)} ${finding.testId} ${sanitizeCliLine(
        finding.title,
      )} [${finding.severity.toUpperCase()}]`,
    );

    lines.push(`  ${sanitizeCliLine(finding.observedBehavior)}`);

    const evidenceRefs =
      finding.evidenceSequences.length === 0 ? 'none' : finding.evidenceSequences.join(', ');

    lines.push(`  Evidence: ${result.evidence.length}; refs: ${evidenceRefs}`);
  }

  lines.push(
    '',
    'Summary:',
    `  PASS: ${run.summary.pass}`,
    `  FAIL: ${run.summary.fail}`,
    `  NOT_APPLICABLE: ${run.summary.notApplicable}`,
    `  INCONCLUSIVE: ${run.summary.inconclusive}`,
    `  ERROR: ${run.summary.error}`,
    `  TOTAL: ${run.summary.total}`,
    '',
    gateLabel(exitCode, failOn),
  );

  return lines.join('\n');
}
