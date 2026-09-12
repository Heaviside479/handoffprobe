import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  createSafeJsonAttachment,
  generateCommercialAssessmentPackage,
  readCommercialAssessment,
  renderCommercialAssessmentMarkdown,
} from '../scripts/commercial-assessment-report.js';

const FIXTURE = resolve(process.cwd(), 'fixtures/commercial-assessment/synthetic-assessment.json');

describe('commercial assessment report', () => {
  it('validates the synthetic fixture and renders the required report sections', async () => {
    const assessment = await readCommercialAssessment(FIXTURE);
    const markdown = renderCommercialAssessmentMarkdown(assessment);

    expect(assessment.summary).toEqual({
      pass: 1,
      fail: 1,
      notApplicable: 0,
      inconclusive: 0,
      error: 1,
      total: 3,
    });

    expect(markdown).toContain('# HandoffProbe Security Assessment');
    expect(markdown).toContain('## In scope');
    expect(markdown).toContain('## Out of scope');
    expect(markdown).toContain('## Limitations');
    expect(markdown).toContain('## Security findings');
    expect(markdown).toContain('HP-ASMT-F001');
    expect(markdown).toContain('## PASS / expected-behavior observations');
    expect(markdown).toContain('HP-ASMT-F002');
    expect(markdown).toContain('## Scanner or environment errors');
    expect(markdown).toContain('HP-ASMT-F003');
    expect(markdown).toContain('Scanner or environment ERROR is not a vulnerability finding.');
    expect(markdown).toContain('## Retest');
    expect(markdown).toContain('## Final limitations and non-certification statement');
  });

  it('creates an explicitly allowlisted safe JSON attachment', async () => {
    const assessment = await readCommercialAssessment(FIXTURE);
    const safe = createSafeJsonAttachment(assessment) as Record<string, unknown>;

    expect(Object.keys(safe)).toEqual([
      'schemaVersion',
      'reportId',
      'handoffProbeVersion',
      'protocols',
      'scope',
      'summary',
      'findings',
    ]);

    const findings = safe.findings as Array<Record<string, unknown>>;

    expect(findings).toHaveLength(3);
    expect(Object.keys(findings[0] ?? {})).toEqual([
      'id',
      'sourceTestId',
      'title',
      'status',
      'severity',
      'propertyClass',
      'affectedBoundary',
      'expectedInvariant',
      'observedBehavior',
      'evidenceSummary',
      'evidenceRefs',
      'impact',
      'remediation',
      'retest',
    ]);

    expect(safe).not.toHaveProperty('authorization');
    expect(safe).not.toHaveProperty('rawEvidence');
    expect(findings[0]).not.toHaveProperty('reproduction');
    expect(findings[0]).not.toHaveProperty('rawEvidence');
  });

  it('generates deterministic Markdown and safe JSON delivery artifacts', async () => {
    const directory = await mkdtemp(resolve(tmpdir(), 'handoffprobe-cv4-'));

    try {
      await generateCommercialAssessmentPackage(FIXTURE, directory);

      const markdown = await readFile(
        resolve(directory, 'handoffprobe-security-assessment.md'),
        'utf8',
      );

      const json = JSON.parse(
        await readFile(resolve(directory, 'handoffprobe-safe-findings.json'), 'utf8'),
      ) as {
        summary: {
          total: number;
        };
      };

      expect(markdown).toContain('HP-ASMT-SYNTH-001');
      expect(markdown).toContain('Synthetic Example Organization');
      expect(json.summary.total).toBe(3);

      const secondDirectory = await mkdtemp(resolve(tmpdir(), 'handoffprobe-cv4-'));

      try {
        await generateCommercialAssessmentPackage(FIXTURE, secondDirectory);

        const secondMarkdown = await readFile(
          resolve(secondDirectory, 'handoffprobe-security-assessment.md'),
          'utf8',
        );

        const secondJson = await readFile(
          resolve(secondDirectory, 'handoffprobe-safe-findings.json'),
          'utf8',
        );

        expect(secondMarkdown).toBe(markdown);
        expect(secondJson).toBe(
          await readFile(resolve(directory, 'handoffprobe-safe-findings.json'), 'utf8'),
        );
      } finally {
        await rm(secondDirectory, { recursive: true, force: true });
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
