import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { PACKAGE_NAME, PRODUCT_NAME, VERSION } from '../src/index.js';

interface PackageManifest {
  name: string;
  version: string;
  private?: boolean;
  description: string;
  license: string;
  type: string;
  engines?: {
    node?: string;
  };
  bin?: Record<string, string>;
  main?: string;
  types?: string;
  exports?: Record<string, unknown>;
  files?: string[];
  scripts?: Record<string, string>;
  repository?: {
    type?: string;
    url?: string;
  };
  bugs?: {
    url?: string;
  };
  homepage?: string;
  keywords?: string[];
  publishConfig?: {
    access?: string;
  };
}

interface PackageLock {
  name: string;
  version: string;
  packages?: Record<
    string,
    {
      name?: string;
      version?: string;
    }
  >;
}

const EXPECTED_KEYWORDS = [
  'a2a',
  'mcp',
  'ai-agents',
  'agent-security',
  'security-testing',
  'protocol-security',
  'handoff-security',
];

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

describe('v0.1 package release metadata', () => {
  it('locks the public npm identity and registry metadata', async () => {
    const manifest = await readJson<PackageManifest>('package.json');

    expect(manifest.name).toBe('handoffprobe');
    expect(manifest.version).toBe('0.1.0');
    expect('private' in manifest).toBe(false);
    expect(manifest.description).toBe('Adversarial security testing for AI agent handoffs');
    expect(manifest.license).toBe('Apache-2.0');
    expect(manifest.repository).toEqual({
      type: 'git',
      url: 'git+https://github.com/Heaviside479/handoffprobe.git',
    });
    expect(manifest.bugs).toEqual({
      url: 'https://github.com/Heaviside479/handoffprobe/issues',
    });
    expect(manifest.homepage).toBe('https://github.com/Heaviside479/handoffprobe#readme');
    expect(manifest.keywords).toEqual(EXPECTED_KEYWORDS);
    expect(manifest.publishConfig).toEqual({
      access: 'public',
    });
  });

  it('preserves the runtime and package surface', async () => {
    const manifest = await readJson<PackageManifest>('package.json');

    expect(manifest.type).toBe('module');
    expect(manifest.engines?.node).toBe('>=24 <25');
    expect(manifest.bin).toEqual({
      handoffprobe: './dist/cli.js',
    });
    expect(manifest.main).toBe('./dist/index.js');
    expect(manifest.types).toBe('./dist/index.d.ts');
    expect(manifest.exports).toEqual({
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
      },
    });
    expect(manifest.files).toEqual(['dist', 'fixtures/phase9/a2a-mcp-crossing-v2']);
    expect(manifest.scripts?.prepack).toBe('npm run build');
  });

  it('keeps package-lock release identity synchronized', async () => {
    const lock = await readJson<PackageLock>('package-lock.json');

    expect(lock.name).toBe('handoffprobe');
    expect(lock.version).toBe('0.1.0');
    expect(lock.packages?.['']?.name).toBe('handoffprobe');
    expect(lock.packages?.['']?.version).toBe('0.1.0');
  });

  it('keeps exported CLI identity synchronized with npm metadata', () => {
    expect(PRODUCT_NAME).toBe('HandoffProbe');
    expect(PACKAGE_NAME).toBe('handoffprobe');
    expect(VERSION).toBe('0.1.0');
  });
});
