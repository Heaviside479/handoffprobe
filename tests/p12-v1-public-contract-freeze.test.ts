import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const evidence = readFileSync('docs/P12_3_V1_PUBLIC_CONTRACT_FREEZE_20260921.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');
const packageJsonText = readFileSync('package.json', 'utf8');
const indexSource = readFileSync('src/index.ts', 'utf8');
const cliSpecification = readFileSync('docs/CLI_SPECIFICATION.md', 'utf8');
const configSource = readFileSync('src/cli/config.ts', 'utf8');
const reporterSource = readFileSync('src/cli/reporters.ts', 'utf8');
const findingSource = readFileSync('src/core/findings.ts', 'utf8');
const action = readFileSync('action.yml', 'utf8');
const attackCatalog = readFileSync('docs/ATTACK_CATALOG.md', 'utf8');
const compatibility = readFileSync('compatibility-matrix.json', 'utf8');
const migration = readFileSync('docs/MIGRATION.md', 'utf8');

const phase12 = roadmap.slice(
  roadmap.indexOf('# Phase 12 — HandoffProbe v1.0 GA'),
  roadmap.indexOf('# Phase 13 — Commercial validation'),
);

describe('P12.3 v1 public-contract freeze', () => {
  it('records a decision for all 13 required public surfaces', () => {
    const freezeDecisionRows = evidence.match(/^\| .* \| `FREEZE FOR V1` \| .* \|$/gm) ?? [];

    expect(freezeDecisionRows).toHaveLength(13);
    expect(evidence).toContain('0 surfaces classified as `CHANGE BEFORE V1`');
    expect(evidence).toContain('0 surfaces classified as `NOT PUBLIC V1 CONTRACT`');
  });

  it('freezes the package-root boundary without authorizing a release', () => {
    expect(indexSource).toContain('export const PRODUCT_NAME');
    expect(indexSource).toContain('export const PACKAGE_NAME');
    expect(indexSource).toContain('export const VERSION');
    expect(indexSource).toContain('export * from');
    expect(packageJsonText).toContain('./dist/index.js');
    expect(packageJsonText).toContain('./dist/index.d.ts');
    expect(packageJsonText).toContain('0.4.0');
    expect(evidence).toContain('Final GA authorization remains exclusively in P12.7');
  });

  it('freezes CLI commands, options and exit semantics', () => {
    for (const command of [
      '`handoffprobe test`',
      '`handoffprobe list`',
      '`handoffprobe explain <HP-ID>`',
      '`handoffprobe --version`',
      '`handoffprobe --help`',
    ]) {
      expect(cliSpecification).toContain(command);
    }

    expect(cliSpecification).toContain('Default threshold: `high`');
    expect(cliSpecification).toContain('### Exit 0');
    expect(cliSpecification).toContain('### Exit 1');
    expect(cliSpecification).toContain('### Exit 2');
    expect(cliSpecification).toContain('### Exit 3');
    expect(cliSpecification).toContain('ERROR must never be represented as exit 1');
  });

  it('freezes config and report schema version 1', () => {
    expect(configSource).toContain('CLI_CONFIG_SCHEMA_VERSION');
    expect(configSource).toContain('target');
    expect(configSource).toContain('tests');
    expect(configSource).toContain('failOn');
    expect(configSource).toContain('reporter');
    expect(configSource).toContain('output');

    expect(reporterSource).toContain('CLI_REPORT_SCHEMA_VERSION');
    for (const field of [
      'schemaVersion',
      'handoffProbeVersion',
      'target',
      'protocols',
      'selection',
      'threshold',
      'summary',
      'findings',
    ]) {
      expect(reporterSource).toContain(field);
    }
  });

  it('freezes finding status and severity meaning', () => {
    expect(findingSource).toMatch(/pass.*fail.*not_applicable.*inconclusive.*error/s);
    expect(findingSource).toMatch(/critical.*high.*medium.*low.*info/s);
    expect(findingSource).toContain('isSecurityFailure');
    expect(evidence).toContain('Only `fail` represents a vulnerability failure');
  });

  it('freezes GitHub Action inputs and outputs', () => {
    for (const input of ['  target:', '  tests:', '  fail-on:', '  artifact-name:']) {
      expect(action).toContain(input);
    }

    for (const output of ['  exit-code:', '  result:', '  report-path:', '  summary-path:']) {
      expect(action).toContain(output);
    }

    expect(action).toContain('default: secure');
    expect(action).toContain('default: high');
    expect(action).toContain('default: handoffprobe-report');
  });

  it('freezes the exact current stable HP identity set', () => {
    const stableSection = attackCatalog.slice(
      0,
      attackCatalog.indexOf('## Current-spec handoff backlog'),
    );

    const stableIds = [...stableSection.matchAll(/^### (HP-[A-Z]+-[0-9]{3}) —/gm)].map(
      (match) => match[1],
    );

    expect(stableIds).toEqual([
      'HP-AUTH-001',
      'HP-AUTH-002',
      'HP-AUTH-003',
      'HP-ID-001',
      'HP-ID-002',
      'HP-TENANT-001',
      'HP-TARGET-001',
      'HP-TARGET-002',
      'HP-APPROVAL-001',
      'HP-CRED-001',
      'HP-CRED-002',
      'HP-LIFECYCLE-001',
      'HP-AUTH-004',
      'HP-AUTH-005',
      'HP-REPLAY-001',
      'HP-REPLAY-002',
      'HP-REPLAY-003',
      'HP-APPROVAL-002',
      'HP-APPROVAL-003',
      'HP-RACE-001',
      'HP-RACE-002',
      'HP-AUDIT-001',
      'HP-AUTH-006',
    ]);
  });

  it('freezes runtime and protocol compatibility', () => {
    expect(compatibility).toContain('>=24 <25');
    expect(compatibility).toContain('1.0');
    expect(compatibility).toContain('2026-07-28');
    expect(evidence).toContain('Node.js `>=24 <25`');
    expect(evidence).toContain('A2A `1.0` -> MCP `2026-07-28`');
  });

  it('freezes published release and tag immutability', () => {
    expect(migration).toContain('Published tags and artifacts are immutable');
    expect(evidence).toContain('Published tags are never moved or rewritten');
  });

  it('records completed P12.2 and P12.3 repository admission', () => {
    expect(phase12).toContain(
      'Status: **COMPLETE — merged through protected PR #172 on 2026-09-21**',
    );
    expect(phase12).toContain(
      'Status: **COMPLETE — merged through protected PR #173 on 2026-09-22**',
    );
    expect(phase12).toContain(
      '- [x] merge through protected pull-request admission; PR #173 merged as `cc15661e9cdf5b77c3ff62599f2fbf5282f67d6c`.',
    );
  });

  it('indexes the P12.3 evidence record', () => {
    expect(docsIndex).toContain('P12_3_V1_PUBLIC_CONTRACT_FREEZE_20260921.md');
  });
});
