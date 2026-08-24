import { parseArgs } from 'node:util';

import { PRODUCT_NAME, VERSION } from '../index.js';

export interface CliIo {
  stdout(message: string): void;
  stderr(message: string): void;
}

const HELP = `${PRODUCT_NAME}

Adversarial security testing for AI agent handoffs.

Usage:
  handoffprobe [options]

Options:
  -h, --help       Show this help
  -v, --version    Show version

HandoffProbe is currently in the implementation bootstrap stage.
Security-test commands will be added in subsequent roadmap phases.`;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
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
    io.stderr(`${PRODUCT_NAME}: ${errorMessage(error)}`);
    io.stderr('Run "handoffprobe --help" for usage.');
    return 2;
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
    io.stderr(`${PRODUCT_NAME}: unable to determine command.`);
    return 2;
  }

  io.stderr(`${PRODUCT_NAME}: command "${command}" is not implemented yet.`);
  io.stderr('Run "handoffprobe --help" for usage.');

  return 2;
}
