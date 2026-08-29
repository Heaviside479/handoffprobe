import { describe, expect, it } from 'vitest';

import type { CliIo } from '../src/cli/run-cli.js';
import { runCli } from '../src/cli/run-cli.js';

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

describe('runCli', () => {
  it('shows help when no arguments are supplied', async () => {
    const capture = createCapture();

    const exitCode = await runCli([], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stdout.join('\n')).toContain('HandoffProbe');
    expect(capture.stdout.join('\n')).toContain('handoffprobe test');
    expect(capture.stdout.join('\n')).toContain('handoffprobe list');
    expect(capture.stdout.join('\n')).toContain('explain <HP-ID>');
    expect(capture.stdout.join('\n')).toContain('--target <target>');
    expect(capture.stdout.join('\n')).toContain('--test <HP-ID>');
    expect(capture.stdout.join('\n')).toContain('--fail-on <severity>');
    expect(capture.stderr).toEqual([]);
  });

  it('shows the current version', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['--version'], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stdout).toEqual(['HandoffProbe 0.1.0']);
    expect(capture.stderr).toEqual([]);
  });

  it('lists all 22 stable attacks in deterministic P0 then P1 order', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['list'], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stderr).toEqual([]);
    expect(capture.stdout).toHaveLength(1);

    const output = capture.stdout[0] ?? '';

    expect(output).toContain('HandoffProbe attacks (22)');
    expect(output).toContain('HP-AUTH-001');
    expect(output).toContain('HP-AUDIT-001');
    expect(output).toContain('HP-REPLAY-003');

    expect(output.indexOf('HP-TENANT-001')).toBeLessThan(output.indexOf('HP-APPROVAL-002'));

    const stableRows = output.split('\n').filter((line) => line.startsWith('HP-'));

    expect(stableRows).toHaveLength(22);
  });

  it('explains a stable attack from the canonical catalog', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['explain', 'HP-AUTH-001'], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stderr).toEqual([]);
    expect(capture.stdout).toHaveLength(1);

    const output = capture.stdout[0] ?? '';

    expect(output).toContain('HP-AUTH-001 — Delegated authority amplification');
    expect(output).toContain('Priority: P0');
    expect(output).toContain('Severity: HIGH');
    expect(output).toContain('Expected invariant:');
    expect(output).toContain('Preconditions:');
    expect(output).toContain('Mutation steps:');
    expect(output).toContain('Required evidence:');
    expect(output).toContain('A2A: 1.0');
    expect(output).toContain('MCP: 2026-07-28');
    expect(output).toContain('Sources:');
  });

  it('rejects an unknown explain attack ID and recommends list', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['explain', 'HP-NOT-999'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('unknown attack ID "HP-NOT-999"');
    expect(capture.stderr.join('\n')).toContain('handoffprobe list');
  });

  it('requires exactly one ID for explain', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['explain'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('"explain" requires exactly one HP-ID');
  });

  it('rejects extra positional arguments for list', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['list', 'extra'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('"list" does not accept positional arguments');
  });

  it('runs all 22 attacks against the secure target by default', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['test'], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stderr).toEqual([]);
    expect(capture.stdout).toHaveLength(1);

    const output = capture.stdout[0] ?? '';

    expect(output).toContain('HandoffProbe test');
    expect(output).toContain('Target: secure');
    expect(output).toContain('Protocols: A2A 1.0 | MCP 2026-07-28');
    expect(output).toContain('Selected attacks: 22');
    expect(output).toContain('Fail on: HIGH');
    expect(output).toContain('PASS: 22');
    expect(output).toContain('FAIL: 0');
    expect(output).toContain('ERROR: 0');
    expect(output).toContain('TOTAL: 22');
    expect(output).toContain('Security gate: PASS');
  });

  it('returns exit 1 for a HIGH vulnerability at the default HIGH threshold', async () => {
    const capture = createCapture();

    const exitCode = await runCli(
      ['test', '--target', 'vulnerable', '--test', 'HP-CRED-001', '--test', 'HP-AUTH-001'],
      capture.io,
    );

    expect(exitCode).toBe(1);
    expect(capture.stderr).toEqual([]);

    const output = capture.stdout[0] ?? '';

    expect(output).toContain('Target: vulnerable');
    expect(output).toContain('Selected attacks: 2');
    expect(output).toContain('Fail on: HIGH');
    expect(output).toContain('PASS: 0');
    expect(output).toContain('FAIL: 2');
    expect(output).toContain('TOTAL: 2');
    expect(output).toContain('Security gate: FAIL');

    expect(output.indexOf('HP-AUTH-001')).toBeLessThan(output.indexOf('HP-CRED-001'));
  });

  it('keeps a HIGH vulnerability visible but returns exit 0 at CRITICAL threshold', async () => {
    const capture = createCapture();

    const exitCode = await runCli(
      ['test', '--target', 'vulnerable', '--test', 'HP-AUTH-001', '--fail-on', 'critical'],
      capture.io,
    );

    expect(exitCode).toBe(0);

    const output = capture.stdout[0] ?? '';

    expect(output).toContain('FAIL           HP-AUTH-001');
    expect(output).toContain('FAIL: 1');
    expect(output).toContain('Fail on: CRITICAL');
    expect(output).toContain('Security gate: PASS');
  });

  it('returns exit 1 for a MEDIUM vulnerability at MEDIUM threshold', async () => {
    const capture = createCapture();

    const exitCode = await runCli(
      ['test', '--target', 'vulnerable', '--test', 'HP-CRED-001', '--fail-on', 'medium'],
      capture.io,
    );

    expect(exitCode).toBe(1);

    const output = capture.stdout[0] ?? '';

    expect(output).toContain('FAIL           HP-CRED-001');
    expect(output).toContain('Fail on: MEDIUM');
    expect(output).toContain('Security gate: FAIL');
  });

  it('deduplicates repeated test selection', async () => {
    const capture = createCapture();

    const exitCode = await runCli(
      ['test', '--test', 'HP-AUTH-001', '--test', 'HP-AUTH-001'],
      capture.io,
    );

    expect(exitCode).toBe(0);

    const output = capture.stdout[0] ?? '';

    expect(output).toContain('Selected attacks: 1');
    expect(output).toContain('PASS: 1');
    expect(output).toContain('TOTAL: 1');
  });

  it('rejects unknown selected attack IDs and recommends list', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['test', '--test', 'HP-NOT-999'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('unknown attack ID: HP-NOT-999');
    expect(capture.stderr.join('\n')).toContain('handoffprobe list');
  });

  it('rejects an invalid bundled target', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['test', '--target', 'production'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('expected secure or vulnerable');
  });

  it('rejects an invalid fail-on severity', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['test', '--fail-on', 'urgent'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('expected info, low, medium, high, or critical');
  });

  it('rejects positional arguments for test', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['test', 'extra'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('"test" does not accept positional arguments');
  });

  it('rejects test-only options for discovery commands', async () => {
    const listCapture = createCapture();
    const explainCapture = createCapture();

    const listExit = await runCli(['list', '--fail-on', 'high'], listCapture.io);

    const explainExit = await runCli(
      ['explain', 'HP-AUTH-001', '--test', 'HP-AUTH-001'],
      explainCapture.io,
    );

    expect(listExit).toBe(2);
    expect(explainExit).toBe(2);
    expect(listCapture.stderr.join('\n')).toContain('"list" does not accept test options');
    expect(explainCapture.stderr.join('\n')).toContain('"explain" does not accept test options');
  });

  it('rejects unknown commands and unknown options as usage errors', async () => {
    const commandCapture = createCapture();
    const optionCapture = createCapture();

    const commandExit = await runCli(['wat'], commandCapture.io);

    const optionExit = await runCli(['--unknown-option'], optionCapture.io);

    expect(commandExit).toBe(2);
    expect(optionExit).toBe(2);
    expect(commandCapture.stdout).toEqual([]);
    expect(commandCapture.stderr.join('\n')).toContain('unknown command "wat"');
    expect(optionCapture.stderr.join('\n')).toContain('HandoffProbe');
  });
});
