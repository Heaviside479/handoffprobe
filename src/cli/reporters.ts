import { VERSION } from '../index.js';

import type { CliFailOn, CliReporter } from './config.js';
import { sanitizeCliLine } from './diagnostics.js';
import { CLI_PROTOCOL_BASELINE, CLI_PROTOCOLS } from './protocols.js';
import { evaluateCliTestExitCode, renderCliTestRun } from './test-command.js';

import type { CliTestRun } from './test-command.js';

export const CLI_REPORT_SCHEMA_VERSION = '1';

function gateStatus(run: CliTestRun, failOn: CliFailOn): 'PASS' | 'FAIL' | 'ERROR' {
  const exitCode = evaluateCliTestExitCode(run, failOn);

  if (exitCode === 3) {
    return 'ERROR';
  }

  if (exitCode === 1) {
    return 'FAIL';
  }

  return 'PASS';
}

function escapeMarkdownCell(value: string): string {
  return sanitizeCliLine(value).replace(/\|/g, '\\|');
}

export function renderJsonReport(run: CliTestRun, failOn: CliFailOn): string {
  const report = {
    schemaVersion: CLI_REPORT_SCHEMA_VERSION,
    handoffProbeVersion: VERSION,
    target: run.target,
    protocols: {
      a2a: CLI_PROTOCOLS.a2a,
      mcp: CLI_PROTOCOLS.mcp,
    },
    selection: {
      count: run.selectedIds.length,
      attackIds: [...run.selectedIds],
    },
    threshold: failOn,
    summary: {
      pass: run.summary.pass,
      fail: run.summary.fail,
      notApplicable: run.summary.notApplicable,
      inconclusive: run.summary.inconclusive,
      error: run.summary.error,
      total: run.summary.total,
    },
    findings: run.results.map((result) => {
      const finding = result.finding;

      return {
        id: finding.testId,
        title: sanitizeCliLine(finding.title),
        status: finding.status,
        severity: finding.severity,
        propertyClass: finding.propertyClass,
        expectedInvariant: sanitizeCliLine(finding.expectedInvariant),
        observedBehavior: sanitizeCliLine(finding.observedBehavior),
        evidence: {
          count: result.evidence.length,
          sequences: [...finding.evidenceSequences],
        },
        ...(finding.remediation === undefined
          ? {}
          : {
              remediation: sanitizeCliLine(finding.remediation),
            }),
      };
    }),
  };

  return JSON.stringify(report, null, 2);
}

export function renderMarkdownReport(run: CliTestRun, failOn: CliFailOn): string {
  const gate = gateStatus(run, failOn);

  const lines = [
    '# HandoffProbe Report',
    '',
    `- Version: ${VERSION}`,
    `- Target: ${run.target}`,
    `- Protocols: ${CLI_PROTOCOL_BASELINE}`,
    `- Selected attacks: ${run.selectedIds.length}`,
    `- Fail on: ${failOn.toUpperCase()}`,
    `- Gate: ${gate}`,
    '',
    '## Summary',
    '',
    '| Status | Count |',
    '| --- | ---: |',
    `| PASS | ${run.summary.pass} |`,
    `| FAIL | ${run.summary.fail} |`,
    `| NOT_APPLICABLE | ${run.summary.notApplicable} |`,
    `| INCONCLUSIVE | ${run.summary.inconclusive} |`,
    `| ERROR | ${run.summary.error} |`,
    `| TOTAL | ${run.summary.total} |`,
    '',
    '## Findings',
    '',
    '| Status | ID | Severity | Title | Evidence |',
    '| --- | --- | --- | --- | ---: |',
  ];

  for (const result of run.results) {
    const finding = result.finding;

    lines.push(
      `| ${finding.status.toUpperCase()} | ${
        finding.testId
      } | ${finding.severity.toUpperCase()} | ${escapeMarkdownCell(
        finding.title,
      )} | ${result.evidence.length} |`,
    );
  }

  const detailedResults = run.results.filter((result) => {
    return result.finding.status === 'fail' || result.finding.status === 'error';
  });

  lines.push('', '## FAIL / ERROR details', '');

  if (detailedResults.length === 0) {
    lines.push('None.');
  } else {
    for (const result of detailedResults) {
      const finding = result.finding;

      const sequences =
        finding.evidenceSequences.length === 0 ? 'none' : finding.evidenceSequences.join(', ');

      lines.push(
        `### ${finding.testId} — ${sanitizeCliLine(finding.title)}`,
        '',
        `- Status: ${finding.status.toUpperCase()}`,
        `- Severity: ${finding.severity.toUpperCase()}`,
        `- Observed behavior: ${sanitizeCliLine(finding.observedBehavior)}`,
        `- Evidence count: ${result.evidence.length}`,
        `- Evidence refs: ${sequences}`,
      );

      if (finding.remediation !== undefined) {
        lines.push(`- Remediation: ${sanitizeCliLine(finding.remediation)}`);
      }

      lines.push('');
    }
  }

  return lines.join('\n').trimEnd();
}

export function renderCliReport(run: CliTestRun, failOn: CliFailOn, reporter: CliReporter): string {
  if (reporter === 'json') {
    return renderJsonReport(run, failOn);
  }

  if (reporter === 'markdown') {
    return renderMarkdownReport(run, failOn);
  }

  return renderCliTestRun(run, failOn);
}
