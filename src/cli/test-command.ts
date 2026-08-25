import { CoreRunner } from '../core/index.js';

import type { CoreRunResult, FindingStatus } from '../core/index.js';

import { CLI_EXECUTION_CATALOG, getCliExecutionBinding } from './execution-catalog.js';

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

function statusLabel(status: FindingStatus): string {
  return status.toUpperCase();
}

export function renderCliTestRun(run: CliTestRun): string {
  const lines = [
    'HandoffProbe test',
    '',
    `Target: ${run.target}`,
    'Protocols: A2A 1.0 | MCP 2026-07-28',
    `Selected attacks: ${run.selectedIds.length}`,
    '',
  ];

  for (const result of run.results) {
    const finding = result.finding;

    lines.push(
      `${statusLabel(finding.status).padEnd(14)} ${finding.testId} ${finding.title} [${finding.severity.toUpperCase()}]`,
    );
    lines.push(`  ${finding.observedBehavior}`);
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
    'Security gate: informational in Phase 5.3; severity threshold exits are added in Phase 5.4.',
  );

  return lines.join('\n');
}
