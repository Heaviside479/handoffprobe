import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import { scanTextForSecrets } from './secret-safety.js';

const statusSchema = z.enum(['pass', 'fail', 'not_applicable', 'inconclusive', 'error']);

const severitySchema = z.enum(['critical', 'high', 'medium', 'low', 'info']);

const propertyClassSchema = z.enum([
  'spec_required',
  'spec_recommended',
  'hardening',
  'composition_responsibility',
]);

const retestStateSchema = z.enum([
  'not_started',
  'pending_customer_fix',
  'passed',
  'failed',
  'inconclusive',
  'not_applicable',
]);

const retestSchema = z
  .object({
    state: retestStateSchema,
    date: z.string().nullable(),
    evidenceSummary: z.string().nullable(),
    notes: z.string(),
  })
  .strict();

const findingSchema = z
  .object({
    id: z.string().regex(/^HP-ASMT-F[0-9]{3}$/u),
    sourceTestId: z
      .string()
      .regex(/^HP-[A-Z0-9-]+$/u)
      .nullable(),
    title: z.string().min(1),
    status: statusSchema,
    severity: severitySchema,
    propertyClass: propertyClassSchema,
    affectedBoundary: z.string().min(1),
    expectedInvariant: z.string().min(1),
    observedBehavior: z.string().min(1),
    evidenceSummary: z.string().min(1),
    evidenceRefs: z.array(z.string()),
    reproduction: z.string().min(1),
    impact: z.string().min(1),
    remediation: z.string().nullable(),
    retest: retestSchema,
  })
  .strict();

const summarySchema = z
  .object({
    pass: z.number().int().nonnegative(),
    fail: z.number().int().nonnegative(),
    notApplicable: z.number().int().nonnegative(),
    inconclusive: z.number().int().nonnegative(),
    error: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  })
  .strict();

export const commercialAssessmentSchema = z
  .object({
    schemaVersion: z.literal('1'),
    reportId: z.string().min(1),
    subject: z
      .object({
        organization: z.string().min(1),
        system: z.string().min(1),
      })
      .strict(),
    issueDate: z.string().min(1),
    handoffProbeVersion: z.string().min(1),
    protocols: z
      .object({
        a2a: z.string().min(1),
        mcp: z.string().min(1),
      })
      .strict(),
    authorization: z.string().min(1),
    scope: z
      .object({
        boundary: z.string().min(1),
        inScope: z.array(z.string().min(1)).min(1),
        outOfScope: z.array(z.string().min(1)).min(1),
        prerequisites: z.array(z.string().min(1)),
        limitations: z.array(z.string().min(1)).min(1),
      })
      .strict(),
    executiveSummary: z.string().min(1),
    methodology: z.array(z.string().min(1)).min(1),
    summary: summarySchema,
    findings: z.array(findingSchema),
    remediationPriorities: z.array(z.string().min(1)),
  })
  .strict()
  .superRefine((assessment, context) => {
    const expected = {
      pass: assessment.findings.filter((finding) => finding.status === 'pass').length,
      fail: assessment.findings.filter((finding) => finding.status === 'fail').length,
      notApplicable: assessment.findings.filter((finding) => finding.status === 'not_applicable')
        .length,
      inconclusive: assessment.findings.filter((finding) => finding.status === 'inconclusive')
        .length,
      error: assessment.findings.filter((finding) => finding.status === 'error').length,
      total: assessment.findings.length,
    };

    for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
      if (assessment.summary[key] !== expected[key]) {
        context.addIssue({
          code: 'custom',
          path: ['summary', key],
          message: `summary ${key} does not match findings`,
        });
      }
    }
  });

export type CommercialAssessment = z.infer<typeof commercialAssessmentSchema>;

function inline(value: string): string {
  return value
    .replace(/[\r\n]+/gu, ' ')
    .replace(/\|/gu, '\\|')
    .trim();
}

function bulletList(values: readonly string[]): string[] {
  if (values.length === 0) {
    return ['None recorded.'];
  }

  return values.map((value) => `- ${inline(value)}`);
}

function findingBlock(finding: CommercialAssessment['findings'][number]): string[] {
  const evidenceRefs =
    finding.evidenceRefs.length === 0
      ? 'none'
      : finding.evidenceRefs.map((reference) => inline(reference)).join(', ');

  const remediation =
    finding.remediation === null
      ? 'No remediation required for this result.'
      : inline(finding.remediation);

  const retestDate = finding.retest.date === null ? 'not performed' : inline(finding.retest.date);

  const retestEvidence =
    finding.retest.evidenceSummary === null ? 'none' : inline(finding.retest.evidenceSummary);

  return [
    `### ${finding.id} - ${inline(finding.title)}`,
    '',
    `- Source test: ${finding.sourceTestId ?? 'assessment-specific observation'}`,
    `- Status: ${finding.status.toUpperCase()}`,
    `- Severity: ${finding.severity.toUpperCase()}`,
    `- Property class: ${finding.propertyClass}`,
    `- Affected boundary: ${inline(finding.affectedBoundary)}`,
    `- Expected invariant: ${inline(finding.expectedInvariant)}`,
    `- Observed behavior: ${inline(finding.observedBehavior)}`,
    `- Evidence summary: ${inline(finding.evidenceSummary)}`,
    `- Safe evidence references: ${evidenceRefs}`,
    `- Safe reproduction information: ${inline(finding.reproduction)}`,
    `- Security impact within scope: ${inline(finding.impact)}`,
    `- Recommended remediation: ${remediation}`,
    `- Retest state: ${finding.retest.state}`,
    `- Retest date: ${retestDate}`,
    `- Retest evidence summary: ${retestEvidence}`,
    `- Retest notes: ${inline(finding.retest.notes)}`,
    '',
  ];
}

function renderFindingGroup(
  findings: readonly CommercialAssessment['findings'][number][],
  emptyText: string,
): string[] {
  if (findings.length === 0) {
    return [emptyText, ''];
  }

  return findings.flatMap((finding) => findingBlock(finding));
}

export function renderCommercialAssessmentMarkdown(assessment: CommercialAssessment): string {
  const failures = assessment.findings.filter((finding) => finding.status === 'fail');
  const passes = assessment.findings.filter((finding) => finding.status === 'pass');
  const otherResults = assessment.findings.filter(
    (finding) => finding.status === 'not_applicable' || finding.status === 'inconclusive',
  );
  const errors = assessment.findings.filter((finding) => finding.status === 'error');

  const lines = [
    '# HandoffProbe Security Assessment',
    '',
    `**Report ID:** ${inline(assessment.reportId)}`,
    '',
    `**Organization:** ${inline(assessment.subject.organization)}`,
    '',
    `**Assessment subject:** ${inline(assessment.subject.system)}`,
    '',
    `**Issue date:** ${inline(assessment.issueDate)}`,
    '',
    `**HandoffProbe version:** ${inline(assessment.handoffProbeVersion)}`,
    '',
    `**Protocol baseline:** A2A ${inline(assessment.protocols.a2a)} -> MCP ${inline(
      assessment.protocols.mcp,
    )}`,
    '',
    '## Executive summary',
    '',
    assessment.executiveSummary.trim(),
    '',
    '## Authorization and agreed boundary',
    '',
    assessment.authorization.trim(),
    '',
    `**Affected handoff boundary:** ${inline(assessment.scope.boundary)}`,
    '',
    '## In scope',
    '',
    ...bulletList(assessment.scope.inScope),
    '',
    '## Out of scope',
    '',
    ...bulletList(assessment.scope.outOfScope),
    '',
    '## Prerequisites and environment assumptions',
    '',
    ...bulletList(assessment.scope.prerequisites),
    '',
    '## Limitations',
    '',
    ...bulletList(assessment.scope.limitations),
    '',
    '## Assessment methodology',
    '',
    ...bulletList(assessment.methodology),
    '',
    '## Result summary',
    '',
    '| Status | Count |',
    '| --- | ---: |',
    `| PASS | ${assessment.summary.pass} |`,
    `| FAIL | ${assessment.summary.fail} |`,
    `| NOT_APPLICABLE | ${assessment.summary.notApplicable} |`,
    `| INCONCLUSIVE | ${assessment.summary.inconclusive} |`,
    `| ERROR | ${assessment.summary.error} |`,
    `| TOTAL | ${assessment.summary.total} |`,
    '',
    '## Security findings',
    '',
    ...renderFindingGroup(failures, 'No security FAIL was demonstrated in the agreed scope.'),
    '## PASS / expected-behavior observations',
    '',
    ...renderFindingGroup(passes, 'No PASS observations were recorded.'),
    '## Other assessment results',
    '',
    ...renderFindingGroup(otherResults, 'No NOT_APPLICABLE or INCONCLUSIVE results were recorded.'),
    '## Scanner or environment errors',
    '',
    'Scanner or environment ERROR is not a vulnerability finding.',
    '',
    ...renderFindingGroup(errors, 'No scanner or environment errors were recorded.'),
    '## Remediation priorities',
    '',
    ...bulletList(assessment.remediationPriorities),
    '',
    '## Retest',
    '',
    ...assessment.findings.flatMap((finding) => [
      `- ${finding.id}: ${finding.retest.state}`,
      `  - Notes: ${inline(finding.retest.notes)}`,
    ]),
    '',
    '## Final limitations and non-certification statement',
    '',
    'This assessment covers only the written agreed scope.',
    '',
    'Untested surfaces are not implicitly secure. Results describe evidence from the tested context and are not a certification. Absence of findings does not prove absence of vulnerabilities. Scanner or environment ERROR is not a vulnerability finding. Third-party testing requires authorization.',
  ];

  return lines.join('\n').trimEnd() + '\n';
}

export function createSafeJsonAttachment(assessment: CommercialAssessment): object {
  return {
    schemaVersion: assessment.schemaVersion,
    reportId: assessment.reportId,
    handoffProbeVersion: assessment.handoffProbeVersion,
    protocols: {
      a2a: assessment.protocols.a2a,
      mcp: assessment.protocols.mcp,
    },
    scope: {
      boundary: assessment.scope.boundary,
      inScope: [...assessment.scope.inScope],
      outOfScope: [...assessment.scope.outOfScope],
      limitations: [...assessment.scope.limitations],
    },
    summary: {
      pass: assessment.summary.pass,
      fail: assessment.summary.fail,
      notApplicable: assessment.summary.notApplicable,
      inconclusive: assessment.summary.inconclusive,
      error: assessment.summary.error,
      total: assessment.summary.total,
    },
    findings: assessment.findings.map((finding) => ({
      id: finding.id,
      sourceTestId: finding.sourceTestId,
      title: finding.title,
      status: finding.status,
      severity: finding.severity,
      propertyClass: finding.propertyClass,
      affectedBoundary: finding.affectedBoundary,
      expectedInvariant: finding.expectedInvariant,
      observedBehavior: finding.observedBehavior,
      evidenceSummary: finding.evidenceSummary,
      evidenceRefs: [...finding.evidenceRefs],
      impact: finding.impact,
      remediation: finding.remediation,
      retest: {
        state: finding.retest.state,
        date: finding.retest.date,
        evidenceSummary: finding.retest.evidenceSummary,
        notes: finding.retest.notes,
      },
    })),
  };
}

function assertSecretSafe(file: string, text: string): void {
  const findings = scanTextForSecrets(file, text);

  if (findings.length !== 0) {
    const rules = findings.map((finding) => finding.rule).join(', ');
    throw new Error(`Refusing to write ${file}: potential secret pattern detected (${rules})`);
  }
}

export async function readCommercialAssessment(path: string): Promise<CommercialAssessment> {
  const raw = JSON.parse(await readFile(path, 'utf8')) as unknown;
  return commercialAssessmentSchema.parse(raw);
}

export async function generateCommercialAssessmentPackage(
  inputPath: string,
  outputDirectory: string,
): Promise<void> {
  const assessment = await readCommercialAssessment(inputPath);

  const markdown = renderCommercialAssessmentMarkdown(assessment);
  const safeJson = JSON.stringify(createSafeJsonAttachment(assessment), null, 2) + '\n';

  assertSecretSafe('handoffprobe-security-assessment.md', markdown);
  assertSecretSafe('handoffprobe-safe-findings.json', safeJson);

  await mkdir(outputDirectory, { recursive: true });

  await writeFile(
    resolve(outputDirectory, 'handoffprobe-security-assessment.md'),
    markdown,
    'utf8',
  );

  await writeFile(resolve(outputDirectory, 'handoffprobe-safe-findings.json'), safeJson, 'utf8');
}

async function run(): Promise<number> {
  const [inputPath, outputDirectory] = process.argv.slice(2);

  if (inputPath === undefined || outputDirectory === undefined) {
    console.error(
      'Usage: tsx scripts/commercial-assessment-report.ts <assessment.json> <output-directory>',
    );
    return 2;
  }

  try {
    await generateCommercialAssessmentPackage(resolve(inputPath), resolve(outputDirectory));
    return 0;
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

const invokedPath = process.argv[1] === undefined ? '' : resolve(process.argv[1]);
const modulePath = fileURLToPath(import.meta.url);

if (invokedPath === modulePath) {
  process.exitCode = await run();
}
