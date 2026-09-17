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

  it('keeps package metadata aligned with the central release state', () => {
    expect(packageJson.version).toBe(releaseState.version);
    expect(packageJson.engines.node).toBe('>=24 <25');
    expect(releaseState.status).toBe('released-and-verified');
    expect(releaseState.stableAttacks).toBe(
      releaseState.p0Attacks + releaseState.p1Attacks + releaseState.advancedAttacks,
    );
  });

  it('keeps current-facing documentation aligned with the release identity', () => {
    for (const document of [readme, installation, usage]) {
      expect(document).toContain(releaseState.version);
    }

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
