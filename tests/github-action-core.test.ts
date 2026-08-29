import { describe, expect, it } from 'vitest';

import { runCliTests } from '../src/cli/test-command.js';
import {
  executeValidatedGitHubAction,
  GitHubActionUsageError,
  validateGitHubActionRequest,
} from '../src/github-action/core.js';

describe('HandoffProbe GitHub Action core', () => {
  it('uses safe defaults and all stable attacks', () => {
    const request = validateGitHubActionRequest({
      target: undefined,
      tests: undefined,
      failOn: undefined,
      artifactName: undefined,
    });

    expect(request.target).toBe('secure');
    expect(request.failOn).toBe('high');
    expect(request.artifactName).toBe('handoffprobe-report');
    expect(request.bindings).toHaveLength(22);
  });

  it('validates comma-separated stable attack selection', () => {
    const request = validateGitHubActionRequest({
      target: 'secure',
      tests: 'HP-AUTH-001, HP-CRED-001',
      failOn: 'medium',
      artifactName: 'handoffprobe-ci',
    });

    expect(request.bindings.map((binding) => binding.definition.id)).toEqual([
      'HP-AUTH-001',
      'HP-CRED-001',
    ]);
  });

  it('rejects unsafe or unknown action inputs without echoing them', () => {
    expect(() =>
      validateGitHubActionRequest({
        target: 'remote-production',
        tests: undefined,
        failOn: undefined,
        artifactName: undefined,
      }),
    ).toThrow(GitHubActionUsageError);

    expect(() =>
      validateGitHubActionRequest({
        target: 'secure',
        tests: 'HP-NOT-REAL-999',
        failOn: 'high',
        artifactName: 'handoffprobe-report',
      }),
    ).toThrow(GitHubActionUsageError);

    expect(() =>
      validateGitHubActionRequest({
        target: 'secure',
        tests: undefined,
        failOn: 'extreme',
        artifactName: 'handoffprobe-report',
      }),
    ).toThrow(GitHubActionUsageError);

    expect(() =>
      validateGitHubActionRequest({
        target: 'secure',
        tests: undefined,
        failOn: 'high',
        artifactName: '../escape',
      }),
    ).toThrow(GitHubActionUsageError);
  });

  it('executes the scanner exactly once and derives JSON plus summary', async () => {
    const request = validateGitHubActionRequest({
      target: 'secure',
      tests: 'HP-AUTH-001',
      failOn: 'high',
      artifactName: 'handoffprobe-test',
    });

    let calls = 0;

    const execution = await executeValidatedGitHubAction(request, async (input) => {
      calls += 1;
      return runCliTests(input);
    });

    expect(calls).toBe(1);
    expect(execution.exitCode).toBe(0);
    expect(execution.result).toBe('pass');

    const report = JSON.parse(execution.jsonReport) as {
      selection: {
        count: number;
      };
      summary: {
        pass: number;
      };
    };

    expect(report.selection.count).toBe(1);
    expect(report.summary.pass).toBe(1);
    expect(execution.summary).toContain('# HandoffProbe');
    expect(execution.summary).toContain('Gate: PASS');
    expect(execution.summary).toContain('Report artifact: `handoffprobe-test`');
  });

  it('preserves vulnerability exit code 1 for a vulnerable run', async () => {
    const request = validateGitHubActionRequest({
      target: 'vulnerable',
      tests: 'HP-AUTH-001',
      failOn: 'info',
      artifactName: 'handoffprobe-vulnerable',
    });

    const execution = await executeValidatedGitHubAction(request);

    expect(execution.exitCode).toBe(1);
    expect(execution.result).toBe('fail');
    expect(execution.summary).toContain('Gate: FAIL');
  });
});
