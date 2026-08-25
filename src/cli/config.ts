import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { FindingSeverity } from '../core/index.js';

import type { CliTargetFixture } from './execution-catalog.js';

export type CliFailOn = FindingSeverity;
export type CliReporter = 'terminal' | 'json' | 'markdown';

export interface HandoffProbeConfig {
  target?: CliTargetFixture;
  tests?: readonly string[];
  failOn?: CliFailOn;
  reporter?: CliReporter;
  output?: string;
}

export const DEFAULT_FAIL_ON: CliFailOn = 'high';

const CONFIG_FILENAME = 'handoffprobe.config.json';

const ALLOWED_KEYS = new Set(['target', 'tests', 'failOn', 'reporter', 'output']);

const FAIL_ON_VALUES: readonly CliFailOn[] = ['info', 'low', 'medium', 'high', 'critical'];

const REPORTERS: readonly CliReporter[] = ['terminal', 'json', 'markdown'];

function configError(message: string): Error {
  return new Error(`${CONFIG_FILENAME}: ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseTarget(value: unknown): CliTargetFixture {
  if (value === 'secure' || value === 'vulnerable') {
    return value;
  }

  throw configError('"target" must be "secure" or "vulnerable".');
}

function parseTests(value: unknown): readonly string[] {
  if (!Array.isArray(value)) {
    throw configError('"tests" must be an array of non-empty HP-ID strings.');
  }

  const tests: string[] = [];

  for (const item of value as unknown[]) {
    if (typeof item !== 'string' || item.trim().length === 0) {
      throw configError('"tests" must be an array of non-empty HP-ID strings.');
    }

    tests.push(item);
  }

  return tests;
}

function parseFailOn(value: unknown): CliFailOn {
  if (typeof value === 'string' && FAIL_ON_VALUES.includes(value as CliFailOn)) {
    return value as CliFailOn;
  }

  throw configError('"failOn" must be info, low, medium, high, or critical.');
}

function parseReporter(value: unknown): CliReporter {
  if (typeof value === 'string' && REPORTERS.includes(value as CliReporter)) {
    return value as CliReporter;
  }

  throw configError('"reporter" must be terminal, json, or markdown.');
}

function parseOutput(value: unknown): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  throw configError('"output" must be a non-empty string.');
}

export function parseHandoffProbeConfig(value: unknown): HandoffProbeConfig {
  if (!isRecord(value)) {
    throw configError('top-level value must be a JSON object.');
  }

  const unknownKeys = Object.keys(value)
    .filter((key) => !ALLOWED_KEYS.has(key))
    .sort();

  if (unknownKeys.length > 0) {
    throw configError(
      `unknown key${unknownKeys.length === 1 ? '' : 's'}: ${unknownKeys.join(', ')}.`,
    );
  }

  const config: HandoffProbeConfig = {};

  if (value.target !== undefined) {
    config.target = parseTarget(value.target);
  }

  if (value.tests !== undefined) {
    config.tests = parseTests(value.tests);
  }

  if (value.failOn !== undefined) {
    config.failOn = parseFailOn(value.failOn);
  }

  if (value.reporter !== undefined) {
    config.reporter = parseReporter(value.reporter);
  }

  if (value.output !== undefined) {
    config.output = parseOutput(value.output);
  }

  return config;
}

export async function loadHandoffProbeConfig(cwd: string): Promise<HandoffProbeConfig> {
  const path = join(cwd, CONFIG_FILENAME);

  let source: string;

  try {
    source = await readFile(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }

    throw configError('could not be read.');
  }

  let value: unknown;

  try {
    value = JSON.parse(source) as unknown;
  } catch {
    throw configError('contains invalid JSON.');
  }

  return parseHandoffProbeConfig(value);
}
