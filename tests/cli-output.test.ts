import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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

async function withTempDirectory(run: (directory: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), 'handoffprobe-output-'));

  try {
    await run(directory);
  } finally {
    await rm(directory, {
      recursive: true,
      force: true,
    });
  }
}

describe('CLI reporter and output routing', () => {
  it('emits JSON only when --reporter json is selected without --output', async () => {
    const capture = createCapture();

    const exitCode = await runCli(
      ['test', '--test', 'HP-AUTH-001', '--reporter', 'json'],
      capture.io,
    );

    expect(exitCode).toBe(0);
    expect(capture.stderr).toEqual([]);
    expect(capture.stdout).toHaveLength(1);

    const output = capture.stdout[0] ?? '';

    expect(() => {
      JSON.parse(output);
    }).not.toThrow();

    expect(output.trim().startsWith('{')).toBe(true);
    expect(output).not.toContain('HandoffProbe test\n');
  });

  it('emits Markdown to stdout when selected without --output', async () => {
    const capture = createCapture();

    const exitCode = await runCli(
      ['test', '--test', 'HP-AUTH-001', '--reporter', 'markdown'],
      capture.io,
    );

    expect(exitCode).toBe(0);
    expect(capture.stderr).toEqual([]);
    expect(capture.stdout[0]).toContain('# HandoffProbe Report');
    expect(capture.stdout[0]).toContain('- Gate: PASS');
  });

  it('writes the selected report to --output and keeps stdout empty', async () => {
    await withTempDirectory(async (directory) => {
      const capture = createCapture();

      const exitCode = await runCli(
        ['test', '--test', 'HP-AUTH-001', '--reporter', 'json', '--output', 'report.json'],
        capture.io,
        directory,
      );

      expect(exitCode).toBe(0);
      expect(capture.stdout).toEqual([]);
      expect(capture.stderr).toEqual([]);

      const output = await readFile(join(directory, 'report.json'), 'utf8');

      const parsed = JSON.parse(output) as {
        target: string;
        threshold: string;
      };

      expect(parsed.target).toBe('secure');
      expect(parsed.threshold).toBe('high');
    });
  });

  it('uses reporter and output from config and lets CLI override reporter', async () => {
    await withTempDirectory(async (directory) => {
      await writeFile(
        join(directory, 'handoffprobe.config.json'),
        JSON.stringify({
          tests: ['HP-AUTH-001'],
          reporter: 'markdown',
          output: 'report.txt',
        }),
      );

      const firstCapture = createCapture();

      const firstExit = await runCli(['test'], firstCapture.io, directory);

      expect(firstExit).toBe(0);
      expect(firstCapture.stdout).toEqual([]);

      const markdown = await readFile(join(directory, 'report.txt'), 'utf8');

      expect(markdown).toContain('# HandoffProbe Report');

      const secondCapture = createCapture();

      const secondExit = await runCli(['test', '--reporter', 'json'], secondCapture.io, directory);

      expect(secondExit).toBe(0);
      expect(secondCapture.stdout).toEqual([]);

      const json = await readFile(join(directory, 'report.txt'), 'utf8');

      expect(() => {
        JSON.parse(json);
      }).not.toThrow();
    });
  });

  it('still returns security exit 1 after successfully writing a vulnerable report', async () => {
    await withTempDirectory(async (directory) => {
      const capture = createCapture();

      const exitCode = await runCli(
        [
          'test',
          '--target',
          'vulnerable',
          '--test',
          'HP-AUTH-001',
          '--reporter',
          'json',
          '--output',
          'vulnerable.json',
        ],
        capture.io,
        directory,
      );

      expect(exitCode).toBe(1);
      expect(capture.stdout).toEqual([]);
      expect(capture.stderr).toEqual([]);

      const report = await readFile(join(directory, 'vulnerable.json'), 'utf8');

      expect(report).toContain('"status": "fail"');
      expect(report).toContain('"severity": "high"');
    });
  });

  it('returns runtime exit 3 when the output file cannot be written', async () => {
    await withTempDirectory(async (directory) => {
      const capture = createCapture();

      const exitCode = await runCli(
        ['test', '--test', 'HP-AUTH-001', '--output', 'missing/report.txt'],
        capture.io,
        directory,
      );

      expect(exitCode).toBe(3);
      expect(capture.stdout).toEqual([]);
      expect(capture.stderr.join('\n')).toContain('output write failure');
    });
  });

  it('rejects an invalid CLI reporter as usage exit 2', async () => {
    const capture = createCapture();

    const exitCode = await runCli(['test', '--reporter', 'xml'], capture.io);

    expect(exitCode).toBe(2);
    expect(capture.stdout).toEqual([]);
    expect(capture.stderr.join('\n')).toContain('expected terminal, json, or markdown');
  });
});
