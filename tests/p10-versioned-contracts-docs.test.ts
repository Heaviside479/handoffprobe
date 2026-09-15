import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { CLI_CONFIG_SCHEMA_VERSION, parseHandoffProbeConfig } from '../src/cli/config.js';
import { CLI_REPORT_SCHEMA_VERSION } from '../src/cli/reporters.js';

const policy = readFileSync(
  new URL('../docs/P10_2_VERSIONED_CONTRACTS_POLICY_20260915.md', import.meta.url),
  'utf8',
);

const roadmap = readFileSync(new URL('../docs/ROADMAP.md', import.meta.url), 'utf8');

describe('P10.2 versioned contracts', () => {
  it('pins report and config schema version 1 as strings', () => {
    expect(CLI_REPORT_SCHEMA_VERSION).toBe('1');
    expect(CLI_CONFIG_SCHEMA_VERSION).toBe('1');
  });

  it('preserves the exact config v1 shape without an in-band schema marker', () => {
    expect(
      parseHandoffProbeConfig({
        target: 'secure',
        tests: ['HP-AUTH-001'],
        failOn: 'high',
        reporter: 'json',
        output: 'handoffprobe-report.json',
      }),
    ).toEqual({
      target: 'secure',
      tests: ['HP-AUTH-001'],
      failOn: 'high',
      reporter: 'json',
      output: 'handoffprobe-report.json',
    });

    expect(() =>
      parseHandoffProbeConfig({
        schemaVersion: '1',
      }),
    ).toThrow('unknown key: schemaVersion');
  });

  it('documents compatibility, deprecation and migration policy', () => {
    expect(policy).toContain('### COMPATIBLE');
    expect(policy).toContain('### DEPRECATED');
    expect(policy).toContain('### BREAKING');
    expect(policy).toContain('## Test and attack deprecation policy');
    expect(policy).toContain('## Migration expectations');
    expect(policy).toContain('Patch releases before v1.0 must preserve existing public contracts.');
  });

  it('records the P10.2 exit gate as satisfied', () => {
    const start = roadmap.indexOf('### P10.2 — versioned contracts and compatibility policy');
    const end = roadmap.indexOf('### P10.3', start);
    const section = roadmap.slice(start, end);

    expect(section).toContain('Status: **COMPLETE — 2026-09-15**');
    expect(section).toContain('P10_2_VERSIONED_CONTRACTS_POLICY_20260915.md');
    expect(section).not.toContain('- [ ]');
  });
});
