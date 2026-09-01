import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

import { generateCrossingCorpusSubmission } from '../src/phase9/crossing-corpus/submission.js';

const outputArgument = process.argv[2];

if (outputArgument === undefined || outputArgument.trim().length === 0) {
  throw new Error('Usage: npx tsx scripts/phase9-crossing-corpus-submission.ts <output-directory>');
}

const repositoryStatus = execFileSync('git', ['status', '--porcelain'], {
  encoding: 'utf8',
}).trim();

if (repositoryStatus.length > 0) {
  throw new Error(
    'Submission generation requires a clean worktree so implementation evidence binds the exact executing commit.',
  );
}

const implementationCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();

const summary = await generateCrossingCorpusSubmission({
  outputDirectory: resolve(outputArgument),
  implementationCommit,
});

console.log(
  JSON.stringify(
    {
      ...summary,
      confirmedGrade: null,
      greenClaimed: false,
      effectScope: 'local_synthetic_mcp_receiver_execution',
    },
    null,
    2,
  ),
);
