import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface CompatibilityMatrix {
  runtime: { nodeEngine: string; ciNode: string };
  ci: { platforms: string[] };
  protocols: { a2a: string; mcp: string };
  protocolDependencies: Record<string, string>;
  documentation: { compatibilityBaseline: string };
}

export interface CompatibilitySnapshot {
  nodeEngine: string | undefined;
  ciNode: string | undefined;
  ciPlatforms: string[];
  protocols: { a2a: string | undefined; mcp: string | undefined };
  dependencies: Record<string, string | undefined>;
  compatibilityBaseline: string;
}

function readText(root: string, path: string): string {
  return readFileSync(resolve(root, path), 'utf8');
}

export function loadCompatibilityMatrix(root = process.cwd()): CompatibilityMatrix {
  return JSON.parse(readText(root, 'compatibility-matrix.json')) as CompatibilityMatrix;
}

export function loadCompatibilitySnapshot(root = process.cwd()): CompatibilitySnapshot {
  const packageJson = JSON.parse(readText(root, 'package.json')) as {
    engines?: { node?: string };
    dependencies?: Record<string, string>;
  };
  const workflow = readText(root, '.github/workflows/ci.yml');
  const protocols = readText(root, 'src/cli/protocols.ts');
  const matrix = loadCompatibilityMatrix(root);

  return {
    nodeEngine: packageJson.engines?.node,
    ciNode: /node-version:\s*['"]?([^\s'"]+)/.exec(workflow)?.[1],
    ciPlatforms: [
      ...workflow.matchAll(/^\s*-\s+(ubuntu-latest|macos-latest|windows-latest)\s*$/gm),
    ].flatMap((match) => (match[1] === undefined ? [] : [match[1]])),
    protocols: {
      a2a: /a2a:\s*'([^']+)'/.exec(protocols)?.[1],
      mcp: /mcp:\s*'([^']+)'/.exec(protocols)?.[1],
    },
    dependencies: Object.fromEntries(
      Object.keys(matrix.protocolDependencies).map((name) => [
        name,
        packageJson.dependencies?.[name],
      ]),
    ),
    compatibilityBaseline: readText(root, matrix.documentation.compatibilityBaseline),
  };
}

export function collectCompatibilityDrift(
  matrix: CompatibilityMatrix,
  actual: CompatibilitySnapshot,
): string[] {
  const drift: string[] = [];
  const compare = (label: string, expected: string, found: string | undefined) => {
    if (found !== expected) {
      drift.push(`${label}: expected "${expected}", found "${found ?? 'missing'}"`);
    }
  };

  compare('runtime.nodeEngine', matrix.runtime.nodeEngine, actual.nodeEngine);
  compare('ci.node', matrix.runtime.ciNode, actual.ciNode);

  const expectedPlatforms = [...matrix.ci.platforms].sort();
  const actualPlatforms = [...actual.ciPlatforms].sort();
  if (JSON.stringify(actualPlatforms) !== JSON.stringify(expectedPlatforms)) {
    drift.push(
      `ci.platforms: expected [${expectedPlatforms.join(', ')}], found [${actualPlatforms.join(', ')}]`,
    );
  }

  compare('protocols.a2a', matrix.protocols.a2a, actual.protocols.a2a);
  compare('protocols.mcp', matrix.protocols.mcp, actual.protocols.mcp);

  for (const [name, version] of Object.entries(matrix.protocolDependencies)) {
    compare(`protocolDependencies.${name}`, version, actual.dependencies[name]);
  }

  const baseline = actual.compatibilityBaseline;
  const baselineLines = baseline.split('\n').map((line) => line.replace(/\s+/g, ' ').trim());

  const requiredText = [
    `Node.js \`${matrix.runtime.nodeEngine}\``,
    `**A2A ${matrix.protocols.a2a} → MCP ${matrix.protocols.mcp}**`,
    ...matrix.ci.platforms,
  ];

  for (const expected of requiredText) {
    if (!baseline.includes(expected)) {
      drift.push(`documentation.baseline: missing "${expected}"`);
    }
  }

  for (const [name, version] of Object.entries(matrix.protocolDependencies)) {
    const found = baselineLines.some(
      (line) => line.includes(`\`${name}\``) && line.includes(`\`${version}\``),
    );
    if (!found) {
      drift.push(`documentation.baseline: missing "${name}@${version}"`);
    }
  }

  return drift;
}

export function runCompatibilityCheck(root = process.cwd()): string[] {
  return collectCompatibilityDrift(loadCompatibilityMatrix(root), loadCompatibilitySnapshot(root));
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : undefined;
const currentPath = fileURLToPath(import.meta.url);

if (invokedPath === currentPath) {
  const drift = runCompatibilityCheck();

  if (drift.length > 0) {
    console.error('Compatibility matrix drift detected:');
    for (const issue of drift) {
      console.error(`- ${issue}`);
    }
    process.exitCode = 1;
  } else {
    console.log('Compatibility matrix: OK');
  }
}
