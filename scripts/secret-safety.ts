import { spawnSync } from 'node:child_process';
import { lstat, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

interface SecretRule {
  readonly id: string;
  readonly pattern: RegExp;
}

export interface SecretFinding {
  readonly file: string;
  readonly line: number;
  readonly rule: string;
}

const SECRET_RULES: readonly SecretRule[] = [
  {
    id: 'private-key',
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/u,
  },
  {
    id: 'github-token',
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/u,
  },
  {
    id: 'github-fine-grained-token',
    pattern: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/u,
  },
  {
    id: 'aws-access-key',
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/u,
  },
  {
    id: 'google-api-key',
    pattern: /\bAIza[0-9A-Za-z_-]{35}\b/u,
  },
  {
    id: 'npm-token',
    pattern: /\bnpm_[A-Za-z0-9]{36}\b/u,
  },
  {
    id: 'stripe-secret-key',
    pattern: /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/u,
  },
  {
    id: 'slack-token',
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/u,
  },
];

export function scanTextForSecrets(file: string, text: string): SecretFinding[] {
  const findings: SecretFinding[] = [];
  const lines = text.split(/\r?\n/u);

  for (const [index, line] of lines.entries()) {
    for (const rule of SECRET_RULES) {
      if (rule.pattern.test(line)) {
        findings.push({
          file,
          line: index + 1,
          rule: rule.id,
        });
      }
    }
  }

  return findings;
}

function listCandidateFiles(root: string): string[] {
  const result = spawnSync(
    'git',
    ['-C', root, 'ls-files', '-z', '--cached', '--others', '--exclude-standard'],
    {
      encoding: 'utf8',
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`git ls-files failed with exit code ${String(result.status)}`);
  }

  return result.stdout
    .split('\0')
    .filter((file) => file.length > 0)
    .sort((left, right) => left.localeCompare(right));
}

function isProbablyBinary(content: Buffer): boolean {
  return content.subarray(0, 8192).includes(0);
}

export async function scanRepository(root = process.cwd()): Promise<SecretFinding[]> {
  const findings: SecretFinding[] = [];

  for (const file of listCandidateFiles(root)) {
    const absolutePath = resolve(root, file);
    const stats = await lstat(absolutePath);

    if (!stats.isFile()) {
      continue;
    }

    const content = await readFile(absolutePath);

    if (isProbablyBinary(content)) {
      continue;
    }

    findings.push(...scanTextForSecrets(file, content.toString('utf8')));
  }

  return findings;
}

export function formatSecretFinding(finding: SecretFinding): string {
  return `[secret-safety] ${finding.rule} at ${finding.file}:${finding.line}`;
}

async function run(): Promise<number> {
  const findings = await scanRepository();

  if (findings.length === 0) {
    console.log('Secret safety: no credential patterns detected.');
    return 0;
  }

  console.error(`Secret safety: detected ${findings.length} potential secret(s).`);

  for (const finding of findings) {
    console.error(formatSecretFinding(finding));
  }

  return 1;
}

const invokedPath = process.argv[1] === undefined ? '' : resolve(process.argv[1]);
const modulePath = fileURLToPath(import.meta.url);

if (invokedPath === modulePath) {
  process.exitCode = await run();
}
