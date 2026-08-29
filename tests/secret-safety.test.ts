import { describe, expect, it } from 'vitest';

import {
  formatSecretFinding,
  scanRepository,
  scanTextForSecrets,
} from '../scripts/secret-safety.js';

describe('secret-safety scanner', () => {
  it('detects a synthetic GitHub token without exposing its value', () => {
    const token = ['gh', 'p_', 'A'.repeat(36)].join('');
    const findings = scanTextForSecrets('canary.txt', `token=${token}`);

    expect(findings).toEqual([
      {
        file: 'canary.txt',
        line: 1,
        rule: 'github-token',
      },
    ]);

    const rendered = findings.map(formatSecretFinding).join('\n');

    expect(rendered).not.toContain(token);
  });

  it('detects representative private-key and cloud credential canaries', () => {
    const privateKeyHeader = ['-----BEGIN ', 'PRIVATE KEY-----'].join('');
    const awsAccessKey = ['AKIA', 'A'.repeat(16)].join('');

    const findings = scanTextForSecrets('canaries.txt', `${privateKeyHeader}\n${awsAccessKey}`);

    expect(findings.map((finding) => finding.rule)).toEqual(['private-key', 'aws-access-key']);
  });

  it('does not treat redaction placeholders as credentials', () => {
    const findings = scanTextForSecrets(
      'safe.txt',
      ['token=[REDACTED]', 'secret=<redacted>', 'credential=***'].join('\n'),
    );

    expect(findings).toEqual([]);
  });

  it('finds no credential patterns in the current repository', async () => {
    await expect(scanRepository(process.cwd())).resolves.toEqual([]);
  });
});
