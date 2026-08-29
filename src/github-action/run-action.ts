import { appendFile, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import {
  executeValidatedGitHubAction,
  GitHubActionUsageError,
  validateGitHubActionRequest,
} from './core.js';

import type { GitHubActionRequest, GitHubActionResult } from './core.js';

type ActionExitCode = 0 | 1 | 2 | 3;

interface ActionOutputs {
  readonly 'exit-code': string;
  readonly result: string;
  readonly 'report-path': string;
  readonly 'summary-path': string;
  readonly 'artifact-path': string;
  readonly 'artifact-name': string;
}

function requestFromEnvironment(): GitHubActionRequest {
  return {
    target: process.env.HANDOFFPROBE_ACTION_TARGET,
    tests: process.env.HANDOFFPROBE_ACTION_TESTS,
    failOn: process.env.HANDOFFPROBE_ACTION_FAIL_ON,
    artifactName: process.env.HANDOFFPROBE_ACTION_ARTIFACT_NAME,
  };
}

async function createOutputDirectory(): Promise<string> {
  const configuredRoot = process.env.RUNNER_TEMP?.trim();
  const root =
    configuredRoot === undefined || configuredRoot.length === 0
      ? tmpdir()
      : resolve(configuredRoot);

  return mkdtemp(join(root, 'handoffprobe-action-'));
}

function renderFailureSummary(reason: 'input' | 'runtime'): string {
  const detail =
    reason === 'input'
      ? 'The HandoffProbe action received invalid configuration.'
      : 'HandoffProbe could not complete the scanner/runtime operation.';

  return [
    '# HandoffProbe',
    '',
    '- Gate: ERROR',
    `- Result: ${detail}`,
    '',
    'No raw runtime exception or secret-bearing input is included in this summary.',
  ].join('\n');
}

async function appendStepSummary(summary: string): Promise<void> {
  const path = process.env.GITHUB_STEP_SUMMARY;

  if (path === undefined || path.trim().length === 0) {
    return;
  }

  await appendFile(path, `${summary}\n`, 'utf8');
}

async function writeActionOutputs(outputs: ActionOutputs): Promise<void> {
  const path = process.env.GITHUB_OUTPUT;

  if (path === undefined || path.trim().length === 0) {
    throw new Error('GITHUB_OUTPUT is unavailable.');
  }

  const outputNames: readonly (keyof ActionOutputs)[] = [
    'exit-code',
    'result',
    'report-path',
    'summary-path',
    'artifact-path',
    'artifact-name',
  ];

  for (const name of outputNames) {
    const value = outputs[name];

    if (value.includes('\n') || value.includes('\r')) {
      throw new Error('Action output contains an invalid newline.');
    }

    await appendFile(path, `${name}=${value}\n`, 'utf8');
  }
}

async function main(): Promise<void> {
  const outputDirectory = await createOutputDirectory();
  const summaryPath = join(outputDirectory, 'handoffprobe-summary.md');

  let exitCode: ActionExitCode = 3;
  let result: GitHubActionResult = 'error';
  let reportPath = '';
  let artifactName = '';
  let summary = renderFailureSummary('runtime');

  try {
    const validated = validateGitHubActionRequest(requestFromEnvironment());

    artifactName = validated.artifactName;

    try {
      const execution = await executeValidatedGitHubAction(validated);

      exitCode = execution.exitCode;
      result = execution.result;
      summary = execution.summary;
      reportPath = join(outputDirectory, 'handoffprobe-report.json');

      await writeFile(reportPath, `${execution.jsonReport}\n`, 'utf8');
    } catch {
      exitCode = 3;
      result = 'error';
      summary = renderFailureSummary('runtime');
    }
  } catch (error) {
    if (error instanceof GitHubActionUsageError) {
      exitCode = 2;
      result = 'error';
      summary = renderFailureSummary('input');
    } else {
      exitCode = 3;
      result = 'error';
      summary = renderFailureSummary('runtime');
    }
  }

  await writeFile(summaryPath, `${summary}\n`, 'utf8');
  await appendStepSummary(summary);

  const artifactPath = artifactName.length === 0 ? '' : outputDirectory;

  await writeActionOutputs({
    'exit-code': String(exitCode),
    result,
    'report-path': reportPath,
    'summary-path': summaryPath,
    'artifact-path': artifactPath,
    'artifact-name': artifactName,
  });

  console.log(`HandoffProbe action result: ${result}; exit code: ${String(exitCode)}.`);
}

await main();
