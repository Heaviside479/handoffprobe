import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { generateCommercialAssessmentDelivery } from '../scripts/commercial-assessment-delivery.js';

const FIXTURE = resolve(process.cwd(), 'fixtures/commercial-assessment/synthetic-assessment.json');

describe('commercial assessment PDF delivery', () => {
  it('generates Markdown, safe JSON and a valid PDF delivery package', async () => {
    const directory = await mkdtemp(resolve(tmpdir(), 'handoffprobe-cv4-pdf-'));

    try {
      await generateCommercialAssessmentDelivery(FIXTURE, directory);

      const markdown = await readFile(
        resolve(directory, 'handoffprobe-security-assessment.md'),
        'utf8',
      );
      const safeJson = JSON.parse(
        await readFile(resolve(directory, 'handoffprobe-safe-findings.json'), 'utf8'),
      ) as {
        reportId: string;
        summary: {
          total: number;
        };
      };
      const pdf = await readFile(resolve(directory, 'handoffprobe-security-assessment.pdf'));

      expect(markdown).toContain('HP-ASMT-SYNTH-001');
      expect(safeJson.reportId).toBe('HP-ASMT-SYNTH-001');
      expect(safeJson.summary.total).toBe(3);
      expect(pdf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
      expect(pdf.length).toBeGreaterThan(5000);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
