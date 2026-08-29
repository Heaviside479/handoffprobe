import type { CliFailOn } from '../cli/config.js';
import type { CliExecutionBinding, CliTargetFixture } from '../cli/execution-catalog.js';
import { renderJsonReport } from '../cli/reporters.js';
import {
  evaluateCliTestExitCode,
  resolveCliTestSelection,
  runCliTests,
} from '../cli/test-command.js';

import type { CliTestRun } from '../cli/test-command.js';

export type GitHubActionResult = 'pass' | 'fail' | 'error';

export interface GitHubActionRequest {
  readonly target: string | undefined;
  readonly tests: string | undefined;
  readonly failOn: string | undefined;
  readonly artifactName: string | undefined;
}

export interface ValidatedGitHubActionRequest {
  readonly target: CliTargetFixture;
  readonly failOn: CliFailOn;
  readonly artifactName: string;
  readonly bindings: readonly CliExecutionBinding[];
}

export interface GitHubActionExecution {
  readonly exitCode: 0 | 1 | 3;
  readonly result: GitHubActionResult;
  readonly jsonReport: string;
  readonly summary: string;
  readonly artifactName: string;
}

export type GitHubActionRunner = (input: {
  target: CliTargetFixture;
  bindings: readonly CliExecutionBinding[];
}) => Promise<CliTestRun>;

interface GitHubJsonReport {
  readonly schemaVersion: string;
  readonly handoffProbeVersion: string;
  readonly target: string;
  readonly protocols: {
    readonly a2a: string;
    readonly mcp: string;
  };
  readonly selection: {
    readonly count: number;
    readonly attackIds: readonly string[];
  };
  readonly threshold: string;
  readonly summary: {
    readonly pass: number;
    readonly fail: number;
    readonly notApplicable: number;
    readonly inconclusive: number;
    readonly error: number;
    readonly total: number;
  };
  readonly findings: readonly {
    readonly id: string;
    readonly title: string;
    readonly status: string;
    readonly severity: string;
  }[];
}

export class GitHubActionUsageError extends Error {
  public override readonly name = 'GitHubActionUsageError';
}

function parseTarget(value: string | undefined): CliTargetFixture {
  const trimmed = value?.trim();
  const normalized = trimmed === undefined || trimmed.length === 0 ? 'secure' : trimmed;

  if (normalized === 'secure' || normalized === 'vulnerable') {
    return normalized;
  }

  throw new GitHubActionUsageError('Invalid target; expected secure or vulnerable.');
}

function parseFailOn(value: string | undefined): CliFailOn {
  const trimmed = value?.trim();
  const normalized = trimmed === undefined || trimmed.length === 0 ? 'high' : trimmed;

  if (
    normalized === 'info' ||
    normalized === 'low' ||
    normalized === 'medium' ||
    normalized === 'high' ||
    normalized === 'critical'
  ) {
    return normalized;
  }

  throw new GitHubActionUsageError(
    'Invalid fail-on severity; expected info, low, medium, high, or critical.',
  );
}

function parseTests(value: string | undefined): readonly string[] | undefined {
  if (value === undefined || value.trim().length === 0) {
    return undefined;
  }

  const ids = value.split(',').map((id) => id.trim());

  if (ids.some((id) => id.length === 0)) {
    throw new GitHubActionUsageError(
      'Invalid tests input; expected comma-separated stable HP- IDs.',
    );
  }

  return ids;
}

function parseArtifactName(value: string | undefined): string {
  const trimmed = value?.trim();
  const normalized =
    trimmed === undefined || trimmed.length === 0 ? 'handoffprobe-report' : trimmed;

  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u.test(normalized) || normalized.includes('..')) {
    throw new GitHubActionUsageError('Invalid artifact-name; use a simple safe artifact name.');
  }

  return normalized;
}

export function validateGitHubActionRequest(
  request: GitHubActionRequest,
): ValidatedGitHubActionRequest {
  const target = parseTarget(request.target);
  const failOn = parseFailOn(request.failOn);
  const artifactName = parseArtifactName(request.artifactName);
  const requestedIds = parseTests(request.tests);
  const selection = resolveCliTestSelection(requestedIds);

  if (selection.unknownIds.length > 0) {
    throw new GitHubActionUsageError(
      'Invalid tests input; one or more attack IDs are not stable HandoffProbe IDs.',
    );
  }

  return {
    target,
    failOn,
    artifactName,
    bindings: selection.bindings,
  };
}

function resultFromExitCode(exitCode: 0 | 1 | 3): GitHubActionResult {
  if (exitCode === 0) {
    return 'pass';
  }

  if (exitCode === 1) {
    return 'fail';
  }

  return 'error';
}

export function renderGitHubActionSummary(
  jsonReport: string,
  artifactName: string,
  exitCode: 0 | 1 | 3,
): string {
  const report = JSON.parse(jsonReport) as GitHubJsonReport;
  const result = resultFromExitCode(exitCode).toUpperCase();

  const lines = [
    '# HandoffProbe',
    '',
    `- Version: ${report.handoffProbeVersion}`,
    `- Protocols: A2A ${report.protocols.a2a} → MCP ${report.protocols.mcp}`,
    `- Target: ${report.target}`,
    `- Selected attacks: ${report.selection.count}`,
    `- Fail on: ${report.threshold.toUpperCase()}`,
    `- Gate: ${result}`,
    `- Report artifact: \`${artifactName}\``,
    '',
    '## Summary',
    '',
    '| Status | Count |',
    '| --- | ---: |',
    `| PASS | ${report.summary.pass} |`,
    `| FAIL | ${report.summary.fail} |`,
    `| NOT_APPLICABLE | ${report.summary.notApplicable} |`,
    `| INCONCLUSIVE | ${report.summary.inconclusive} |`,
    `| ERROR | ${report.summary.error} |`,
    `| TOTAL | ${report.summary.total} |`,
  ];

  const failedFindings = report.findings.filter(
    (finding) => finding.status === 'fail' || finding.status === 'error',
  );

  if (failedFindings.length > 0) {
    lines.push(
      '',
      '## FAIL / ERROR findings',
      '',
      '| Status | ID | Severity | Title |',
      '| --- | --- | --- | --- |',
    );

    for (const finding of failedFindings) {
      lines.push(
        `| ${finding.status.toUpperCase()} | ${finding.id} | ${finding.severity.toUpperCase()} | ${finding.title.replace(/\|/gu, '\\|')} |`,
      );
    }
  }

  return lines.join('\n');
}

export async function executeValidatedGitHubAction(
  request: ValidatedGitHubActionRequest,
  runner: GitHubActionRunner = runCliTests,
): Promise<GitHubActionExecution> {
  const run = await runner({
    target: request.target,
    bindings: request.bindings,
  });

  const jsonReport = renderJsonReport(run, request.failOn);
  const exitCode = evaluateCliTestExitCode(run, request.failOn);

  return {
    exitCode,
    result: resultFromExitCode(exitCode),
    jsonReport,
    summary: renderGitHubActionSummary(jsonReport, request.artifactName, exitCode),
    artifactName: request.artifactName,
  };
}
