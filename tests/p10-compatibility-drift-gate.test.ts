import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  collectCompatibilityDrift,
  loadCompatibilityMatrix,
  loadCompatibilitySnapshot,
  runCompatibilityCheck,
} from '../scripts/compatibility-matrix-check.js';

const matrix = loadCompatibilityMatrix();
const snapshot = loadCompatibilitySnapshot();

describe('P10.4 compatibility drift gate', () => {
  it('accepts the current supported compatibility matrix', () => {
    expect(runCompatibilityCheck()).toEqual([]);
  });

  it('pins the current runtime, platform, protocol and SDK baseline', () => {
    const rawMatrix = JSON.parse(readFileSync('compatibility-matrix.json', 'utf8')) as {
      schemaVersion: number;
    };

    expect(rawMatrix.schemaVersion).toBe(1);
    expect(matrix.runtime).toEqual({
      nodeEngine: '>=24 <25',
      ciNode: '24',
    });
    expect(matrix.ci.platforms).toEqual(['ubuntu-latest', 'macos-latest', 'windows-latest']);
    expect(matrix.protocols).toEqual({
      a2a: '1.0',
      mcp: '2026-07-28',
    });
    expect(matrix.protocolDependencies).toEqual({
      '@a2a-js/sdk': '1.1.0',
      '@modelcontextprotocol/client': '2.0.0',
      '@modelcontextprotocol/server': '2.0.0',
    });
  });

  it('reports runtime and platform drift with explicit expected and found values', () => {
    expect(
      collectCompatibilityDrift(matrix, {
        ...snapshot,
        ciNode: '25',
      }),
    ).toContain('ci.node: expected "24", found "25"');

    expect(
      collectCompatibilityDrift(matrix, {
        ...snapshot,
        nodeEngine: '>=25 <26',
      }),
    ).toContain('runtime.nodeEngine: expected ">=24 <25", found ">=25 <26"');

    expect(
      collectCompatibilityDrift(matrix, {
        ...snapshot,
        ciPlatforms: ['ubuntu-latest', 'macos-latest'],
      }),
    ).toContain(
      'ci.platforms: expected [macos-latest, ubuntu-latest, windows-latest], found [macos-latest, ubuntu-latest]',
    );
  });

  it('reports protocol, SDK and documentation drift visibly', () => {
    expect(
      collectCompatibilityDrift(matrix, {
        ...snapshot,
        protocols: {
          ...snapshot.protocols,
          mcp: '2099-01-01',
        },
      }),
    ).toContain('protocols.mcp: expected "2026-07-28", found "2099-01-01"');

    expect(
      collectCompatibilityDrift(matrix, {
        ...snapshot,
        dependencies: {
          ...snapshot.dependencies,
          '@a2a-js/sdk': '9.9.9',
        },
      }),
    ).toContain('protocolDependencies.@a2a-js/sdk: expected "1.1.0", found "9.9.9"');

    expect(
      collectCompatibilityDrift(matrix, {
        ...snapshot,
        compatibilityBaseline: snapshot.compatibilityBaseline.replaceAll(
          'windows-latest',
          'windows-next',
        ),
      }),
    ).toContain('documentation.baseline: missing "windows-latest"');
  });

  it('runs the compatibility gate inside the normal repository check', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts['compatibility:check']).toBe(
      'tsx scripts/compatibility-matrix-check.ts',
    );
    expect(packageJson.scripts.check).toContain('npm run compatibility:check');
    expect(packageJson.scripts['format:check']).toContain('compatibility-matrix.json');
  });
});
