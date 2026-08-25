import { describe, expect, it } from 'vitest';

import { HandoffProbeCoreError, REDACTED_VALUE } from '../src/core/index.js';
import { renderCliRuntimeDiagnostic, sanitizeCliLine } from '../src/cli/diagnostics.js';
import { renderJsonReport, renderMarkdownReport } from '../src/cli/reporters.js';
import { runCli } from '../src/cli/run-cli.js';
import {
  evaluateCliTestExitCode,
  renderCliTestRun,
  resolveCliTestSelection,
  runCliTests,
} from '../src/cli/test-command.js';
import { CLI_PROTOCOL_BASELINE, CLI_PROTOCOLS } from '../src/cli/protocols.js';

import type { CliIo } from '../src/cli/run-cli.js';
import type { CliTestRun } from '../src/cli/test-command.js';

function createCapture(): {
  io: CliIo;
  stdout: string[];
  stderr: string[];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];

  return {
    stdout,
    stderr,
    io: {
      stdout(message) {
        stdout.push(message);
      },
      stderr(message) {
        stderr.push(message);
      },
    },
  };
}

async function oneRun(): Promise<CliTestRun> {
  const selection = resolveCliTestSelection(['HP-AUTH-001']);

  return runCliTests({
    target: 'secure',
    bindings: selection.bindings,
  });
}

describe('CLI Phase 5.6 hardening', () => {
  it('centralizes the explicit protocol baseline and exposes it in help', async () => {
    expect(CLI_PROTOCOLS).toEqual({
      a2a: '1.0',
      mcp: '2026-07-28',
    });

    expect(CLI_PROTOCOL_BASELINE).toBe('A2A 1.0 | MCP 2026-07-28');

    const capture = createCapture();

    const exitCode = await runCli(['--help'], capture.io);

    expect(exitCode).toBe(0);

    expect(capture.stdout.join('\n')).toContain(`Protocol baseline: ${CLI_PROTOCOL_BASELINE}`);
  });

  it('redacts secrets and line breaks from CLI-safe text', () => {
    const result = sanitizeCliLine('authorization: Bearer hp-line-secret\nnext line');

    expect(result).not.toContain('hp-line-secret');

    expect(result).not.toContain('\n');

    expect(result).toContain(REDACTED_VALUE);
  });

  it('renders deterministic secret-safe scanner diagnostics with troubleshooting', () => {
    const error = new HandoffProbeCoreError(
      'ADAPTER_ERROR',
      'Bearer hp-runtime-secret',
      'target.adapter',
      {
        token: 'hp-detail-secret',
      },
    );

    const first = renderCliRuntimeDiagnostic('scanner', error);

    const second = renderCliRuntimeDiagnostic('scanner', error);

    expect(first).toEqual(second);

    const output = first.join('\n');

    expect(output).toContain('ADAPTER_ERROR');

    expect(output).toContain('target.adapter');

    expect(output).toContain('Troubleshooting:');

    expect(output).not.toContain('hp-runtime-secret');

    expect(output).not.toContain('hp-detail-secret');
  });

  it('renders deterministic output diagnostics without raw OS paths or error messages', () => {
    const error = new Error('ENOENT /private/tmp/Bearer hp-path-secret/report.json');

    const first = renderCliRuntimeDiagnostic('output', error);

    const second = renderCliRuntimeDiagnostic('output', error);

    expect(first).toEqual(second);

    const output = first.join('\n');

    expect(output).toContain('output write failure');

    expect(output).toContain('Troubleshooting:');

    expect(output).not.toContain('ENOENT');

    expect(output).not.toContain('/private/tmp');

    expect(output).not.toContain('hp-path-secret');
  });

  it('redacts invalid CLI values before writing usage errors', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['test', '--reporter', 'Bearer hp-cli-secret'], capture.io);

    expect(exitCode).toBe(2);

    const output = capture.stderr.join('\n');

    expect(output).not.toContain('hp-cli-secret');

    expect(output).toContain(REDACTED_VALUE);
  });

  it('redacts finding text consistently in terminal JSON and Markdown reporters', async () => {
    const base = await oneRun();

    const first = base.results[0];

    if (first === undefined) {
      throw new Error('Expected one CLI result.');
    }

    const secretRun: CliTestRun = {
      ...base,
      results: [
        {
          ...first,
          finding: {
            ...first.finding,
            status: 'fail',
            title: 'Bearer hp-title-secret',
            expectedInvariant: 'apiKey=hp-invariant-secret',
            observedBehavior: 'password=hp-observed-secret',
            remediation: 'clientSecret=hp-remediation-secret',
          },
        },
      ],
      summary: {
        pass: 0,
        fail: 1,
        notApplicable: 0,
        inconclusive: 0,
        error: 0,
        total: 1,
      },
    };

    const terminal = renderCliTestRun(secretRun, 'high');

    const json = renderJsonReport(secretRun, 'high');

    const markdown = renderMarkdownReport(secretRun, 'high');

    const combined = [terminal, json, markdown].join('\n');

    for (const secret of [
      'hp-title-secret',
      'hp-invariant-secret',
      'hp-observed-secret',
      'hp-remediation-secret',
    ]) {
      expect(combined).not.toContain(secret);
    }

    expect(combined).toContain(REDACTED_VALUE);
  });

  it('keeps ERROR distinct from vulnerability FAIL across exit evaluation and reporters', async () => {
    const base = await oneRun();

    const first = base.results[0];

    if (first === undefined) {
      throw new Error('Expected one CLI result.');
    }

    const errorRun: CliTestRun = {
      ...base,
      results: [
        {
          ...first,
          finding: {
            ...first.finding,
            status: 'error',
          },
        },
      ],
      summary: {
        pass: 0,
        fail: 0,
        notApplicable: 0,
        inconclusive: 0,
        error: 1,
        total: 1,
      },
    };

    expect(evaluateCliTestExitCode(errorRun, 'info')).toBe(3);

    const terminal = renderCliTestRun(errorRun, 'info');

    const markdown = renderMarkdownReport(errorRun, 'info');

    const json = JSON.parse(renderJsonReport(errorRun, 'info')) as {
      summary: {
        fail: number;
        error: number;
      };
      findings: {
        status: string;
      }[];
    };

    expect(terminal).toContain('Security gate: ERROR');

    expect(markdown).toContain('- Gate: ERROR');

    expect(markdown).not.toContain('- Gate: FAIL');

    expect(json.summary.fail).toBe(0);
    expect(json.summary.error).toBe(1);

    expect(json.findings[0]?.status).toBe('error');
  });
});
