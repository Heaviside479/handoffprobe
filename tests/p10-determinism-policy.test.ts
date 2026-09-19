import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const SOURCE_ROOT = join(ROOT, 'src');

const FORBIDDEN_PRODUCTIVE_PATTERNS = [
  { name: 'Math.random', pattern: /\bMath\.random\s*\(/ },
  { name: 'randomUUID', pattern: /\brandomUUID\s*\(/ },
  { name: 'randomBytes', pattern: /\brandomBytes\s*\(/ },
  { name: 'getRandomValues', pattern: /\bgetRandomValues\s*\(/ },
  { name: 'Date.now', pattern: /\bDate\.now\s*\(/ },
] as const;

function collectTypeScriptFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectTypeScriptFiles(path);
      }

      return entry.isFile() && entry.name.endsWith('.ts') ? [path] : [];
    })
    .sort();
}

describe('P10.3 determinism policy', () => {
  it('keeps packaged source free of ambient randomness and wall-clock seeding', () => {
    const violations: string[] = [];

    for (const file of collectTypeScriptFiles(SOURCE_ROOT)) {
      const source = readFileSync(file, 'utf8');

      for (const forbidden of FORBIDDEN_PRODUCTIVE_PATTERNS) {
        if (forbidden.pattern.test(source)) {
          violations.push(`${relative(ROOT, file)}: ${forbidden.name}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('records the future randomized-coverage seed contract without adding a public seed surface', () => {
    const policy = readFileSync(join(ROOT, 'docs/P10_3_DETERMINISM_BASELINE_20260915.md'), 'utf8');

    expect(policy).toContain('randomized generation must require an explicit deterministic seed');
    expect(policy).toContain('identical seed plus identical normalized inputs');
    expect(policy).toContain('does not add a speculative seed option');
    expect(policy).toContain('The package remains `0.3.0`.');
  });

  it('tracks completed P10.3 roadmap items', () => {
    const roadmap = readFileSync(join(ROOT, 'docs/ROADMAP.md'), 'utf8');

    expect(roadmap).toContain(
      '- [x] define deterministic seed handling where randomized coverage is introduced;',
    );
    expect(roadmap).toContain('- [x] add reproducible performance benchmarks;');
    expect(roadmap).toContain('- [x] add concurrency tests;');
    expect(roadmap).toContain('- [x] harden structured diagnostic logs;');
    expect(roadmap).toContain('- [x] expand redaction regression tests;');
    expect(roadmap).toContain('- [x] document benchmark environment and acceptable variance.');
  });

  it('records the evidence-backed benchmark variance policy', () => {
    const benchmark = readFileSync(
      join(ROOT, 'docs/P10_3_PERFORMANCE_BENCHMARK_20260919.md'),
      'utf8',
    );

    expect(benchmark).toContain('advisory variance envelope of **15%**');
    expect(benchmark).toContain('within-session coefficient of variation is `<= 15%`');
    expect(benchmark).toContain('cross-session median drift is `<= 15%`');
    expect(benchmark).toContain('13.823%');
    expect(benchmark).toContain('9.901%');
    expect(benchmark).toContain('not automatic release blockers');
  });
});
