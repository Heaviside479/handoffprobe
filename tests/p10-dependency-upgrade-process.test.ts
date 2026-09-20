import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};
const npmrc = readFileSync('.npmrc', 'utf8');
const dependabot = readFileSync('.github/dependabot.yml', 'utf8');
const processRecord = readFileSync('docs/P10_4_DEPENDENCY_UPGRADE_PROCESS_20260919.md', 'utf8');
const roadmap = readFileSync('docs/ROADMAP.md', 'utf8');
const docsIndex = readFileSync('docs/README.md', 'utf8');

function expectExactVersions(entries: Record<string, string>) {
  for (const [name, version] of Object.entries(entries)) {
    expect(version, `${name} must remain exactly pinned`).toMatch(
      /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/,
    );
  }
}

describe('P10.4 dependency upgrade process', () => {
  it('keeps direct npm dependencies exactly pinned', () => {
    expectExactVersions(packageJson.dependencies);
    expectExactVersions(packageJson.devDependencies);
    expect(npmrc).toContain('save-exact=true');
    expect(npmrc).toContain('engine-strict=true');
  });

  it('configures weekly Dependabot discovery for npm and GitHub Actions', () => {
    expect(dependabot).toContain('version: 2');
    expect(dependabot).toContain('package-ecosystem: npm');
    expect(dependabot).toContain('package-ecosystem: github-actions');
    expect(dependabot.match(/interval: weekly/g)).toHaveLength(2);
    expect(dependabot.match(/timezone: Europe\/Vienna/g)).toHaveLength(2);
    expect(dependabot).toContain('versioning-strategy: increase');
  });

  it('requires the full dependency admission path', () => {
    expect(processRecord).toContain('npm ci');
    expect(processRecord).toContain('npm run check');
    expect(processRecord).toContain('npm run package:check');
    expect(processRecord).toContain('npm audit --audit-level=high');
    expect(processRecord).toContain('`Dependency Review`');
    expect(processRecord).toContain('`Quality (ubuntu-latest)`');
    expect(processRecord).toContain('`Quality (macos-latest)`');
    expect(processRecord).toContain('`Quality (windows-latest)`');
  });

  it('treats protocol SDK changes as compatibility-sensitive', () => {
    expect(processRecord).toContain('`@a2a-js/sdk`');
    expect(processRecord).toContain('`@modelcontextprotocol/client`');
    expect(processRecord).toContain('`@modelcontextprotocol/server`');
    expect(processRecord).toContain('A2A 1.0 -> MCP 2026-07-28');
    const normalizedProcessRecord = processRecord.replace(/\s+/g, ' ');

    expect(normalizedProcessRecord).toContain(
      'For A2A/MCP SDK changes, SDK package version and wire-protocol version must be reviewed as separate dimensions.',
    );
  });

  it('closes the dependency-process roadmap item without changing product version', () => {
    expect(packageJson.version).toBe('0.4.0');
    expect(roadmap).toContain('- [x] define the dependency upgrade process;');
    expect(roadmap).toContain(
      '- [x] ensure compatibility-matrix checks fail visibly on unsupported drift.',
    );
    expect(docsIndex).toContain('P10_4_DEPENDENCY_UPGRADE_PROCESS_20260919.md');
  });
});
