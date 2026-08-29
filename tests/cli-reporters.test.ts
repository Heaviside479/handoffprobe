import { describe, expect, it } from 'vitest';

import {
  CLI_REPORT_SCHEMA_VERSION,
  renderJsonReport,
  renderMarkdownReport,
} from '../src/cli/reporters.js';
import { renderCliTestRun, resolveCliTestSelection, runCliTests } from '../src/cli/test-command.js';

async function runOne(target: 'secure' | 'vulnerable', id: string) {
  const selection = resolveCliTestSelection([id]);

  return runCliTests({
    target,
    bindings: selection.bindings,
  });
}

describe('CLI reporters', () => {
  it('renders terminal version and evidence references deterministically', async () => {
    const run = await runOne('secure', 'HP-AUTH-001');

    const first = renderCliTestRun(run, 'high');
    const second = renderCliTestRun(run, 'high');

    expect(first).toBe(second);
    expect(first).toContain('Version: 0.1.0');
    expect(first).toContain('Protocols: A2A 1.0 | MCP 2026-07-28');
    expect(first).toContain('Evidence:');
    expect(first).toContain('refs:');
  });

  it('renders deterministic JSON with the specified top-level schema', async () => {
    const run = await runOne('secure', 'HP-AUTH-001');

    const first = renderJsonReport(run, 'high');
    const second = renderJsonReport(run, 'high');

    expect(first).toBe(second);

    const parsed = JSON.parse(first) as Record<string, unknown>;

    expect(Object.keys(parsed)).toEqual([
      'schemaVersion',
      'handoffProbeVersion',
      'target',
      'protocols',
      'selection',
      'threshold',
      'summary',
      'findings',
    ]);

    expect(parsed.schemaVersion).toBe(CLI_REPORT_SCHEMA_VERSION);
    expect(parsed.handoffProbeVersion).toBe('0.1.0');
    expect(parsed.target).toBe('secure');
    expect(parsed.threshold).toBe('high');

    const findings = parsed.findings as Record<string, unknown>[];

    expect(findings).toHaveLength(1);
    expect(findings[0]?.id).toBe('HP-AUTH-001');

    const evidence = findings[0]?.evidence as Record<string, unknown>;

    expect(typeof evidence.count).toBe('number');
    expect(Array.isArray(evidence.sequences)).toBe(true);
  });

  it('does not serialize raw EvidenceEvent context or details into JSON', async () => {
    const run = await runOne('secure', 'HP-AUTH-001');

    const output = renderJsonReport(run, 'high');

    expect(output).not.toContain('"context"');
    expect(output).not.toContain('"details"');
    expect(output).not.toContain('"provenance"');
  });

  it('renders deterministic Markdown with metadata, summary and FAIL details', async () => {
    const run = await runOne('vulnerable', 'HP-AUTH-001');

    const first = renderMarkdownReport(run, 'high');

    const second = renderMarkdownReport(run, 'high');

    expect(first).toBe(second);
    expect(first).toContain('# HandoffProbe Report');
    expect(first).toContain('- Version: 0.1.0');
    expect(first).toContain('- Protocols: A2A 1.0 | MCP 2026-07-28');
    expect(first).toContain('- Gate: FAIL');
    expect(first).toContain('## Summary');
    expect(first).toContain('## Findings');
    expect(first).toContain('## FAIL / ERROR details');
    expect(first).toContain('### HP-AUTH-001');
    expect(first).toContain('Evidence count:');
    expect(first).toContain('Evidence refs:');
  });
});
