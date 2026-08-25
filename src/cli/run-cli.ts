import { parseArgs } from 'node:util';

import { PRODUCT_NAME, VERSION } from '../index.js';

import { renderAttackExplanation, renderAttackList } from './discovery.js';

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
  handoffprobe test                Run security attacks (Phase 5.3)
  handoffprobe list                List all stable attacks
  handoffprobe explain <HP-ID>     Explain one stable attack

Options:
  -h, --help               Show this help
  -v, --version            Show version`;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function usageError(io: CliIo, message: string): number {
  io.stderr(`${PRODUCT_NAME}: ${message}`);
  io.stderr('Run "handoffprobe --help" for usage.');
  return 2;
}

export function runCli(args: readonly string[], io: CliIo): number {
  let parsed: ReturnType<typeof parseArgs>;

  try {
    parsed = parseArgs({
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
      },
    });
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

    io.stdout(renderAttackList());
    return 0;
  }

  if (command === 'explain') {
    if (parsed.positionals.length !== 2) {
      return usageError(io, '"explain" requires exactly one HP-ID.');
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
    return usageError(io, 'command "test" is not implemented yet.');
  }

  return usageError(io, `unknown command "${command}".`);
}
