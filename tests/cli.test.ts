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
    expect(capture.stdout.join('\n')).toContain('Usage:');
    expect(capture.stderr).toEqual([]);
  });

  it('shows the current version', () => {
    const capture = createCapture();

    const exitCode = runCli(['--version'], capture.io);

    expect(exitCode).toBe(0);
    expect(capture.stdout).toEqual(['HandoffProbe 0.0.0']);
    expect(capture.stderr).toEqual([]);
  });

  it('returns a usage error for an unimplemented command', () => {
    const capture = createCapture();

    const exitCode = runCli(['test'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('not implemented yet');
  });

  it('returns a usage error for an unknown option', () => {
    const capture = createCapture();

    const exitCode = runCli(['--unknown-option'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stderr.join('\n')).toContain('HandoffProbe');
  });
});
