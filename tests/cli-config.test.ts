import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { loadHandoffProbeConfig, parseHandoffProbeConfig } from '../src/cli/config.js';

async function withTempDirectory(run: (directory: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), 'handoffprobe-config-'));

  try {
    await run(directory);
  } finally {
    await rm(directory, {
      recursive: true,
      force: true,
    });
  }
}

describe('HandoffProbe CLI config', () => {
  it('treats an absent config file as an empty config', async () => {
    await withTempDirectory(async (directory) => {
      await expect(loadHandoffProbeConfig(directory)).resolves.toEqual({});
    });
  });

  it('parses the complete supported configuration schema', () => {
    expect(
      parseHandoffProbeConfig({
        target: 'vulnerable',
        tests: ['HP-AUTH-001', 'HP-CRED-001'],
        failOn: 'medium',
        reporter: 'json',
        output: 'handoffprobe-report.json',
      }),
    ).toEqual({
      target: 'vulnerable',
      tests: ['HP-AUTH-001', 'HP-CRED-001'],
      failOn: 'medium',
      reporter: 'json',
      output: 'handoffprobe-report.json',
    });
  });

  it('loads valid JSON from handoffprobe.config.json', async () => {
    await withTempDirectory(async (directory) => {
      await writeFile(
        join(directory, 'handoffprobe.config.json'),
        JSON.stringify({
          target: 'secure',
          tests: ['HP-AUTH-001'],
          failOn: 'critical',
        }),
      );

      await expect(loadHandoffProbeConfig(directory)).resolves.toEqual({
        target: 'secure',
        tests: ['HP-AUTH-001'],
        failOn: 'critical',
      });
    });
  });

  it('rejects unknown keys deterministically', () => {
    expect(() =>
      parseHandoffProbeConfig({
        zeta: true,
        alpha: true,
      }),
    ).toThrow('handoffprobe.config.json: unknown keys: alpha, zeta.');
  });

  it('rejects malformed JSON', async () => {
    await withTempDirectory(async (directory) => {
      await writeFile(join(directory, 'handoffprobe.config.json'), '{"failOn":"high",');

      await expect(loadHandoffProbeConfig(directory)).rejects.toThrow(
        'handoffprobe.config.json: contains invalid JSON.',
      );
    });
  });

  it('rejects invalid target values', () => {
    expect(() =>
      parseHandoffProbeConfig({
        target: 'production',
      }),
    ).toThrow('"target" must be "secure" or "vulnerable"');
  });

  it('rejects invalid tests and failOn values', () => {
    expect(() =>
      parseHandoffProbeConfig({
        tests: ['HP-AUTH-001', ''],
      }),
    ).toThrow('"tests" must be an array of non-empty HP-ID strings');

    expect(() =>
      parseHandoffProbeConfig({
        failOn: 'urgent',
      }),
    ).toThrow('"failOn" must be info, low, medium, high, or critical');
  });

  it('validates reserved reporter and output configuration', () => {
    expect(() =>
      parseHandoffProbeConfig({
        reporter: 'xml',
      }),
    ).toThrow('"reporter" must be terminal, json, or markdown');

    expect(() =>
      parseHandoffProbeConfig({
        output: '',
      }),
    ).toThrow('"output" must be a non-empty string');
  });
});
