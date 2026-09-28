import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const read = (path: string): string => readFileSync(path, 'utf8');

interface ReleaseState {
  version: string;
  status: string;
  releaseCommit: string;
  stableAttacks: number;
  p0Attacks: number;
  p1Attacks: number;
  advancedAttacks: number;
  latestStableAttackId: string;
  reportSchema: string;
  protocolBaseline: {
    a2a: string;
    mcp: string;
  };
  candidate: {
    version: string;
    status: string;
    authorizedDate: string;
    npmStage: boolean;
    npmPublished: boolean;
    gitTagCreated: boolean;
    githubReleaseCreated: boolean;
  };
  prerelease: {
    version: string;
    status: string;
    publishedDate: string;
    npmTag: string;
    npmStage: boolean;
    npmPublished: boolean;
    provenanceVerified: boolean;
    registrySignaturesVerified: boolean;
    stageRunId: string;
    stageId: string;
    shasum: string;
    sourceCommit: string;
    gitTag: string;
    gitTagCreated: boolean;
    githubReleaseCreated: boolean;
    externalActionRunId: string;
    externalActionVerified: boolean;
  };
}

const releaseState = JSON.parse(read('docs/RELEASE_STATE.json')) as ReleaseState;
const packageJson = JSON.parse(read('package.json')) as {
  version: string;
  engines: { node: string };
};

describe('current release documentation contract', () => {
  const readme = read('README.md');
  const installation = read('docs/INSTALLATION.md');
  const usage = read('docs/USAGE.md');
  const releaseNotes = read('docs/V0_4_0_RELEASE_NOTES.md');
  const closeout = read('docs/R4_V0_4_0_POSTPUBLICATION_CLOSEOUT_20260917.md');

  it('keeps source candidate metadata aligned with the candidate state', () => {
    expect(packageJson.version).toBe(releaseState.candidate.version);
    expect(packageJson.engines.node).toBe('>=24 <25');

    expect(releaseState.candidate.version).toBe('1.0.0-rc.2');
    expect(releaseState.candidate.status).toBe('published-prerelease-and-verified');
    expect(releaseState.candidate.authorizedDate).toBe('2026-09-26');

    expect(releaseState.candidate.npmStage).toBe(true);
    expect(releaseState.candidate.npmPublished).toBe(true);
    expect(releaseState.candidate.gitTagCreated).toBe(true);
    expect(releaseState.candidate.githubReleaseCreated).toBe(true);

    expect(releaseState.prerelease.version).toBe('1.0.0-rc.2');
    expect(releaseState.prerelease.status).toBe('published-and-verified');
    expect(releaseState.prerelease.publishedDate).toBe('2026-09-28');
    expect(releaseState.prerelease.npmTag).toBe('next');
    expect(releaseState.prerelease.provenanceVerified).toBe(true);
    expect(releaseState.prerelease.registrySignaturesVerified).toBe(true);
    expect(releaseState.prerelease.stageRunId).toBe('36402476070');
    expect(releaseState.prerelease.stageId).toBe('b47b2fcc-924e-4a1c-a9e2-7f55d14b634c');
    expect(releaseState.prerelease.shasum).toBe('53852a5efc18a97ff74d575aed2a5ee5c7d5d176');
    expect(releaseState.prerelease.sourceCommit).toBe('6e23275162d95661d55d0d36d1723c5d18361e0b');
    expect(releaseState.prerelease.gitTag).toBe('v1.0.0-rc.2');
    expect(releaseState.prerelease.gitTagCreated).toBe(true);
    expect(releaseState.prerelease.githubReleaseCreated).toBe(true);
    expect(releaseState.prerelease.externalActionRunId).toBe('36405018499');
    expect(releaseState.prerelease.externalActionVerified).toBe(true);
  });

  it('keeps the verified public release state separate from the source candidate', () => {
    expect(releaseState.version).toBe('0.4.0');
    expect(releaseState.status).toBe('released-and-verified');
    expect(releaseState.stableAttacks).toBe(
      releaseState.p0Attacks + releaseState.p1Attacks + releaseState.advancedAttacks,
    );
  });

  it('keeps current-facing documentation aligned with the release identity', () => {
    for (const document of [readme, installation, usage]) {
      expect(document).toContain(releaseState.version);
    }

    expect(readme).toContain('handoffprobe@1.0.0-rc.2');
    expect(readme).toContain(`${releaseState.stableAttacks} stable attacks`);
    expect(usage).toContain(`${releaseState.stableAttacks} stable attacks`);
    expect(readme).toContain(releaseState.latestStableAttackId);
    expect(usage).toContain(releaseState.latestStableAttackId);
  });

  it('keeps release evidence aligned with the central release state', () => {
    expect(releaseNotes).toContain(releaseState.version);
    expect(releaseNotes).toContain(releaseState.latestStableAttackId);
    expect(closeout).toContain(releaseState.releaseCommit);
    expect(closeout).toContain(`public stable corpus: **${releaseState.stableAttacks} attacks**`);
    expect(closeout).toContain(releaseState.latestStableAttackId);
    expect(closeout).toContain(`report schema remains \`${releaseState.reportSchema}\``);
    expect(closeout).toContain(
      `protocol baseline remains A2A ${releaseState.protocolBaseline.a2a} → MCP ${releaseState.protocolBaseline.mcp}`,
    );
  });
});
