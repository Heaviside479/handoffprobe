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
  it('shows help when no arguments are supplied', () => {
    const capture = createCapture();

    const exitCode = runCli([], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stdout.join('\n')).toContain('HandoffProbe');
    expect(capture.stdout.join('\n')).toContain('handoffprobe list');
    expect(capture.stdout.join('\n')).toContain('explain <HP-ID>');
    expect(capture.stderr).toEqual([]);
  });

  it('shows the current version', () => {
    const capture = createCapture();

    const exitCode = runCli(['--version'], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stdout).toEqual(['HandoffProbe 0.0.0']);
    expect(capture.stderr).toEqual([]);
  });

  it('lists all 22 stable attacks in deterministic P0 then P1 order', () => {
    const capture = createCapture();

    const exitCode = runCli(['list'], capture.io);

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

  it('explains a stable attack from the canonical catalog', () => {
    const capture = createCapture();

    const exitCode = runCli(['explain', 'HP-AUTH-001'], capture.io);

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

  it('rejects an unknown attack ID and recommends list', () => {
    const capture = createCapture();

    const exitCode = runCli(['explain', 'HP-NOT-999'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('unknown attack ID "HP-NOT-999"');
    expect(capture.stderr.join('\n')).toContain('handoffprobe list');
  });

  it('requires exactly one ID for explain', () => {
    const capture = createCapture();

    const exitCode = runCli(['explain'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('"explain" requires exactly one HP-ID');
  });

  it('rejects extra positional arguments for list', () => {
    const capture = createCapture();

    const exitCode = runCli(['list', 'extra'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('"list" does not accept positional arguments');
  });

  it('keeps test explicitly unavailable until Phase 5.3', () => {
    const capture = createCapture();

    const exitCode = runCli(['test'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('not implemented yet');
  });

  it('returns a usage error for an unknown command', () => {
    const capture = createCapture();

    const exitCode = runCli(['wat'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('unknown command "wat"');
  });

  it('returns a usage error for an unknown option', () => {
    const capture = createCapture();

    const exitCode = runCli(['--unknown-option'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stderr.join('\n')).toContain('HandoffProbe');
  });
});
