import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import * as packageRoot from '../src/index.js';
import { DEFAULT_FAIL_ON } from '../src/cli/config.js';
import { validateGitHubActionRequest } from '../src/github-action/core.js';

import type {
  AttackDefinition,
  CoreRunInput,
  Finding,
  HandoffAdapter,
  P0AttackPlan,
  P1AttackPlan,
  SecurityContext,
  SourceReference,
  TargetAdapter,
} from '../src/index.js';

const evidence = readFileSync('docs/P12_4_GA_HARDENING_BACKLOG_20260922.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');
const compatibility = readFileSync('docs/P10_1_COMPATIBILITY_BASELINE_20260915.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  version: string;
  engines: { node: string };
  exports: Record<string, unknown>;
  files: string[];
};
const attackCatalog = readFileSync('docs/ATTACK_CATALOG.md', 'utf8');
const mcpQueue = readFileSync('docs/MCP_3354_VERIFIABLE_RESULTS_QUEUE_20260917.md', 'utf8');
const redditQueue = readFileSync('docs/REDDIT_MCP_EDGE_CASE_QUEUE_20260918.md', 'utf8');

type FrozenV1TypeSmoke = [
  AttackDefinition,
  CoreRunInput,
  Finding,
  HandoffAdapter,
  P0AttackPlan,
  P1AttackPlan,
  SecurityContext,
  SourceReference,
  TargetAdapter,
];

const frozenV1TypeSmoke: FrozenV1TypeSmoke | undefined = undefined;

const REQUIRED_RUNTIME_EXPORTS = [
  'PRODUCT_NAME',
  'PACKAGE_NAME',
  'VERSION',
  'AttackRegistry',
  'HandoffProbeCoreError',
  'isSecurityFailure',
  'REDACTED_VALUE',
  'redactText',
  'redactRecord',
  'CoreRunner',
  'cloneSecurityContext',
  'HP_APPROVAL_001_AMOUNT',
  'HP_APPROVAL_001',
  'P0_APPROVAL_001_VARIANTS',
  'HP_AUTH_001',
  'HP_AUTH_002',
  'HP_AUTH_003',
  'P0_AUTHORIZATION_ATTACKS',
  'HP_CRED_001',
  'HP_CRED_002',
  'P0_CREDENTIAL_ATTACKS',
  'P0_CREDENTIAL_BASELINE',
  'HP_ID_001',
  'HP_ID_002',
  'P0_IDENTITY_ATTACKS',
  'P0_IDENTITY_BASELINE',
  'HP_LIFECYCLE_001',
  'P0_LIFECYCLE_BASELINE',
  'HP_TARGET_001',
  'HP_TARGET_002',
  'P0_TARGET_ATTACKS',
  'P0_TARGET_BASELINE',
  'HP_TENANT_001_LOSS',
  'HP_TENANT_001',
  'P0_TENANT_001_VARIANTS',
  'P0_TENANT_BASELINE',
  'HP_APPROVAL_002',
  'HP_APPROVAL_003',
  'P1_APPROVAL_ATTACKS',
  'HP_AUDIT_001',
  'P1_AUDIT_ATTACKS',
  'HP_AUTH_004',
  'HP_AUTH_005',
  'HP_AUTH_006',
  'P1_AUTHORIZATION_ATTACKS',
  'HP_RACE_001',
  'HP_RACE_002',
  'P1_RACE_ATTACKS',
  'HP_REPLAY_001',
  'HP_REPLAY_002',
  'HP_REPLAY_003',
  'P1_REPLAY_ATTACKS',
] as const;

describe('P12.4 internal GA hardening and backlog disposition', () => {
  it('keeps all frozen runtime package-root exports available while allowing additions', () => {
    for (const name of REQUIRED_RUNTIME_EXPORTS) {
      expect(packageRoot).toHaveProperty(name);
    }

    expect(frozenV1TypeSmoke).toBeUndefined();
  });

  it('keeps the frozen npm root export and runtime boundary', () => {
    expect(packageJson.version).toBe('0.4.0');
    expect(packageJson.engines.node).toBe('>=24 <25');
    expect(packageJson.exports).toEqual({
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
      },
    });
    expect(packageJson.files).toEqual(['dist', 'DISCLOSURE']);
  });

  it('keeps CLI and Action defaults on one scanner contract', () => {
    const request = validateGitHubActionRequest({
      target: undefined,
      tests: undefined,
      failOn: undefined,
      artifactName: undefined,
    });

    expect(DEFAULT_FAIL_ON).toBe('high');
    expect(request.target).toBe('secure');
    expect(request.failOn).toBe(DEFAULT_FAIL_ON);
    expect(request.bindings).toHaveLength(23);
    expect(request.artifactName).toBe('handoffprobe-report');
  });

  it('records the current v1 compatibility reconciliation without rewriting history', () => {
    expect(compatibility).toContain('## P12.4 v1 freeze reconciliation — 2026-09-22');
    expect(compatibility).toContain('source/package version `0.4.0`');
    expect(compatibility).toContain('23 stable attacks');
    expect(compatibility).toContain('Node.js `>=24 <25`');
    expect(compatibility).toContain('A2A `1.0` -> MCP `2026-07-28`');
    expect(compatibility).toContain(
      'historical record of the earlier `0.3.0` / 22-attack baseline',
    );
  });

  it('classifies every deferred catalog candidate without manufacturing a pre-GA attack', () => {
    const expected = [
      ['HP-STATE-001', 'POST-GA'],
      ['HP-CACHE-001', 'POST-GA'],
      ['HP-MRTR-001', 'POST-GA'],
      ['HP-MRTR-002', 'POST-GA'],
      ['HP-ROUTING-001', 'POST-GA'],
      ['HP-VERSION-001', 'POST-GA'],
      ['HP-CONTENT-001', 'RESEARCH ONLY'],
      ['HP-CARD-001', 'RESEARCH ONLY'],
    ] as const;

    for (const [id, classification] of expected) {
      expect(attackCatalog).toContain(`### ${id}`);

      const row = evidence
        .split('\n')
        .find((line) => line.includes(`\`${id}\``) && line.includes(`\`${classification}\``));

      expect(row).toBeDefined();
    }

    expect(evidence).toContain('- `PRE-GA REQUIRED`: 0;');
    expect(evidence).toContain('- `POST-GA`: 6;');
    expect(evidence).toContain('- `RESEARCH ONLY`: 2;');
  });

  it('preserves existing research results as refinements or no-add decisions', () => {
    expect(mcpQueue).toContain(
      'PUBLIC RESULT RETURN COMPLETE — REFINEMENT; DIRECT AUTHOR REVIEW RECEIVED 2026-09-22; PROPOSAL / CHANGELOG TRACEABILITY RECORDED.',
    );
    expect(mcpQueue).toContain('No new stable attack is admitted');

    expect(redditQueue).toContain('HP-RACE-002 REFINEMENT / NO ADD; external response PENDING');
    expect(redditQueue).toContain('HP-APPROVAL-002 REFINEMENT / NO ADD; external response PENDING');
    expect(redditQueue).toContain('HP-TARGET-001 REFINEMENT / NO ADD; external response PENDING');
    expect(redditQueue).toContain('PROTOCOL SEMANTICS / NO ADD; external response PENDING');
  });

  it('records completed P12.4 protected admission', () => {
    expect(roadmap).toContain('Status: **COMPLETE**');
    expect(roadmap).toContain('- 0 `PRE-GA REQUIRED`;');
    expect(roadmap).toContain('- 6 deferred backlog candidates classified `POST-GA`;');
    expect(roadmap).toContain('- 2 deferred backlog candidates classified `RESEARCH ONLY`;');
    expect(roadmap).toContain('- [x] pass complete repository validation;');
    expect(roadmap).toContain('- [x] pass package validation;');
    expect(roadmap).toContain('- [x] merge through protected pull-request admission.');
    expect(evidence).toContain(
      'protected merge commit: `5ec9d06057b1a17ad3d299d79c9105a964018c0e`',
    );
  });

  it('indexes the P12.4 evidence record', () => {
    expect(docsIndex).toContain('P12_4_GA_HARDENING_BACKLOG_20260922.md');
  });
});
