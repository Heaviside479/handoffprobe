import { parseArgs } from 'node:util';

import { PRODUCT_NAME, VERSION } from '../index.js';

import { renderAttackExplanation, renderAttackList } from './discovery.js';
import { renderCliTestRun, resolveCliTestSelection, runCliTests } from './test-command.js';

import type { CliTargetFixture } from './execution-catalog.js';

export interface CliIo {
  stdout(message: string): void;
  stderr(message: string): void;
}

const HELP = `${PRODUCT_NAME}

Adversarial security testing for AI agent handoffs.

Usage:
  handoffprobe <command> [arguments]
  handoffprobe [options]

Commands:
  handoffprobe test [options]      Run bundled security attacks
  handoffprobe list                List all stable attacks
  handoffprobe explain <HP-ID>     Explain one stable attack

Test options:
  --target <target>                secure | vulnerable (default: secure)
  --test <HP-ID>                   Select one attack; repeatable

Options:
  -h, --help                       Show this help
  -v, --version                    Show version`;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function usageError(io: CliIo, message: string): number {
  io.stderr(`${PRODUCT_NAME}: ${message}`);
  io.stderr('Run "handoffprobe --help" for usage.');
  return 2;
}

function parseCliArgs(args: readonly string[]) {
  return parseArgs({
    args: [...args],
    allowPositionals: true,
    strict: true,
    options: {
      help: {
        type: 'boolean',
        short: 'h',
      },
      version: {
        type: 'boolean',
        short: 'v',
      },
      target: {
        type: 'string',
      },
      test: {
        type: 'string',
        multiple: true,
      },
    },
  });
}

function hasTestOptions(values: ReturnType<typeof parseCliArgs>['values']): boolean {
  return values.target !== undefined || values.test !== undefined;
}

function parseTarget(value: string | undefined): CliTargetFixture | undefined {
  if (value === undefined || value === 'secure') {
    return 'secure';
  }

  if (value === 'vulnerable') {
    return 'vulnerable';
  }

  return undefined;
}

export async function runCli(args: readonly string[], io: CliIo): Promise<number> {
  let parsed: ReturnType<typeof parseCliArgs>;

  try {
    parsed = parseCliArgs(args);
  } catch (error) {
    return usageError(io, errorMessage(error));
  }

  if (parsed.values.version === true) {
    io.stdout(`${PRODUCT_NAME} ${VERSION}`);
    return 0;
  }

  if (parsed.values.help === true || parsed.positionals.length === 0) {
    io.stdout(HELP);
    return 0;
  }

  const command = parsed.positionals[0];

  if (command === undefined) {
    return usageError(io, 'unable to determine command.');
  }

  if (command === 'list') {
    if (parsed.positionals.length !== 1) {
      return usageError(io, '"list" does not accept positional arguments.');
    }

    if (hasTestOptions(parsed.values)) {
      return usageError(io, '"list" does not accept test options.');
    }

    io.stdout(renderAttackList());
    return 0;
  }

  if (command === 'explain') {
    if (parsed.positionals.length !== 2) {
      return usageError(io, '"explain" requires exactly one HP-ID.');
    }

    if (hasTestOptions(parsed.values)) {
      return usageError(io, '"explain" does not accept test options.');
    }

    const id = parsed.positionals[1];

    if (id === undefined) {
      return usageError(io, '"explain" requires exactly one HP-ID.');
    }

    const explanation = renderAttackExplanation(id);

    if (explanation === undefined) {
      io.stderr(`${PRODUCT_NAME}: unknown attack ID "${id}".`);
      io.stderr('Run "handoffprobe list" to see stable attack IDs.');
      return 2;
    }

    io.stdout(explanation);
    return 0;
  }

  if (command === 'test') {
    if (parsed.positionals.length !== 1) {
      return usageError(io, '"test" does not accept positional arguments.');
    }

    const target = parseTarget(parsed.values.target);

    if (target === undefined) {
      return usageError(
        io,
        `invalid target "${parsed.values.target ?? ''}"; expected secure or vulnerable.`,
      );
    }

    const selection = resolveCliTestSelection(parsed.values.test);

    if (selection.unknownIds.length > 0) {
      io.stderr(
        `${PRODUCT_NAME}: unknown attack ID${selection.unknownIds.length === 1 ? '' : 's'}: ${selection.unknownIds.join(', ')}.`,
      );
      io.stderr('Run "handoffprobe list" to see stable attack IDs.');
      return 2;
    }

    try {
      const run = await runCliTests({
        target,
        bindings: selection.bindings,
      });

      io.stdout(renderCliTestRun(run));

      return run.summary.error > 0 ? 3 : 0;
    } catch (error) {
      io.stderr(`${PRODUCT_NAME}: scanner runtime failure: ${errorMessage(error)}`);
      return 3;
    }
  }

  return usageError(io, `unknown command "${command}".`);
}
