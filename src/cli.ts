#!/usr/bin/env node
import { runCli } from './cli/run-cli.js';

const exitCode = runCli(process.argv.slice(2), {
  stdout(message) {
    process.stdout.write(`${message}\n`);
  },

  stderr(message) {
    process.stderr.write(`${message}\n`);
  },
});

process.exitCode = exitCode;
