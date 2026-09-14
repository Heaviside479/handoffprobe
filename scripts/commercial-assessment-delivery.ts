import { createWriteStream } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import PDFDocument from 'pdfkit';

import {
  generateCommercialAssessmentPackage,
  readCommercialAssessment,
  type CommercialAssessment,
} from './commercial-assessment-report.js';

type PdfDocument = InstanceType<typeof PDFDocument>;
type CommercialFinding = CommercialAssessment['findings'][number];

function inlinePdf(value: string): string {
  return value.replace(/[\r\n]+/gu, ' ').trim();
}

function ensureRoom(doc: PdfDocument, minimumHeight = 72): void {
  const bottom = doc.page.height - doc.page.margins.bottom - 28;

  if (doc.y + minimumHeight > bottom) {
    doc.addPage();
  }
}

function sectionHeading(doc: PdfDocument, title: string): void {
  ensureRoom(doc, 80);
  doc.moveDown(0.6);
  doc.font('Helvetica-Bold').fontSize(15).fillColor('#111111').text(title);
  doc.moveDown(0.35);
}

function subheading(doc: PdfDocument, title: string): void {
  ensureRoom(doc, 64);
  doc.moveDown(0.35);
  doc.font('Helvetica-Bold').fontSize(11.5).fillColor('#111111').text(title);
  doc.moveDown(0.2);
}

function paragraph(doc: PdfDocument, text: string): void {
  doc.font('Helvetica').fontSize(10).fillColor('#222222').text(text, {
    lineGap: 2,
  });
  doc.moveDown(0.55);
}

function bulletList(
  doc: PdfDocument,
  values: readonly string[],
  emptyText = 'None recorded.',
): void {
  if (values.length === 0) {
    paragraph(doc, emptyText);
    return;
  }

  for (const value of values) {
    ensureRoom(doc, 36);
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#222222')
      .text(`- ${inlinePdf(value)}`, {
        indent: 10,
        lineGap: 2,
      });
    doc.moveDown(0.2);
  }

  doc.moveDown(0.25);
}

function labelValue(doc: PdfDocument, label: string, value: string): void {
  ensureRoom(doc, 36);
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#222222').text(`${label}: `, {
    continued: true,
  });
  doc.font('Helvetica').text(inlinePdf(value), {
    lineGap: 2,
  });
  doc.moveDown(0.22);
}

function renderFinding(doc: PdfDocument, finding: CommercialFinding): void {
  ensureRoom(doc, 120);

  doc
    .font('Helvetica-Bold')
    .fontSize(11.5)
    .fillColor('#111111')
    .text(`${finding.id} - ${inlinePdf(finding.title)}`);
  doc.moveDown(0.25);

  labelValue(doc, 'Source test', finding.sourceTestId ?? 'assessment-specific observation');
  labelValue(doc, 'Status', finding.status.toUpperCase());
  labelValue(doc, 'Severity', finding.severity.toUpperCase());
  labelValue(doc, 'Property class', finding.propertyClass);
  labelValue(doc, 'Affected boundary', finding.affectedBoundary);
  labelValue(doc, 'Expected invariant', finding.expectedInvariant);
  labelValue(doc, 'Observed behavior', finding.observedBehavior);
  labelValue(doc, 'Evidence summary', finding.evidenceSummary);
  labelValue(
    doc,
    'Safe evidence references',
    finding.evidenceRefs.length === 0 ? 'none' : finding.evidenceRefs.join(', '),
  );
  labelValue(doc, 'Safe reproduction information', finding.reproduction);
  labelValue(doc, 'Security impact within scope', finding.impact);
  labelValue(
    doc,
    'Recommended remediation',
    finding.remediation ?? 'No remediation required for this result.',
  );
  labelValue(doc, 'Retest state', finding.retest.state);
  labelValue(doc, 'Retest date', finding.retest.date ?? 'not performed');
  labelValue(doc, 'Retest evidence summary', finding.retest.evidenceSummary ?? 'none');
  labelValue(doc, 'Retest notes', finding.retest.notes);

  doc.moveDown(0.4);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .lineWidth(0.5)
    .strokeColor('#CCCCCC')
    .stroke();
  doc.moveDown(0.45);
}

function renderFindingGroup(
  doc: PdfDocument,
  findings: readonly CommercialFinding[],
  emptyText: string,
): void {
  if (findings.length === 0) {
    paragraph(doc, emptyText);
    return;
  }

  for (const finding of findings) {
    renderFinding(doc, finding);
  }
}

function addPageFooters(doc: PdfDocument, reportId: string): void {
  const range = doc.bufferedPageRange();

  for (let index = 0; index < range.count; index += 1) {
    doc.switchToPage(range.start + index);
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#666666')
      .text(
        `${inlinePdf(reportId)} | Page ${String(index + 1)} of ${String(range.count)}`,
        doc.page.margins.left,
        doc.page.height - 32,
        {
          width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
          align: 'center',
          lineBreak: false,
        },
      );
  }
}

export async function renderCommercialAssessmentPdf(
  assessment: CommercialAssessment,
  outputPath: string,
): Promise<void> {
  const doc = new PDFDocument({
    size: 'A4',
    bufferPages: true,
    margins: {
      top: 54,
      bottom: 54,
      left: 54,
      right: 54,
    },
    info: {
      Title: 'HandoffProbe Security Assessment',
      Author: 'Heaviside Solutions',
      Subject: assessment.subject.system,
      Keywords: 'HandoffProbe security assessment A2A MCP',
    },
  });

  const stream = createWriteStream(outputPath);
  const completion = new Promise<void>((resolvePromise, rejectPromise) => {
    stream.once('finish', resolvePromise);
    stream.once('error', rejectPromise);
    doc.once('error', rejectPromise);
  });

  doc.pipe(stream);

  doc
    .font('Helvetica-Bold')
    .fontSize(23)
    .fillColor('#111111')
    .text('HandoffProbe Security Assessment');
  doc.moveDown(0.25);
  doc.font('Helvetica').fontSize(10).fillColor('#555555').text(`Report ID: ${assessment.reportId}`);
  doc.moveDown(0.8);

  labelValue(doc, 'Organization', assessment.subject.organization);
  labelValue(doc, 'Assessment subject', assessment.subject.system);
  labelValue(doc, 'Issue date', assessment.issueDate);
  labelValue(doc, 'HandoffProbe version', assessment.handoffProbeVersion);
  labelValue(
    doc,
    'Protocol baseline',
    `A2A ${assessment.protocols.a2a} -> MCP ${assessment.protocols.mcp}`,
  );

  sectionHeading(doc, 'Executive summary');
  paragraph(doc, assessment.executiveSummary);

  sectionHeading(doc, 'Authorization and agreed boundary');
  paragraph(doc, assessment.authorization);
  labelValue(doc, 'Affected handoff boundary', assessment.scope.boundary);

  sectionHeading(doc, 'In scope');
  bulletList(doc, assessment.scope.inScope);

  sectionHeading(doc, 'Out of scope');
  bulletList(doc, assessment.scope.outOfScope);

  sectionHeading(doc, 'Prerequisites and environment assumptions');
  bulletList(doc, assessment.scope.prerequisites);

  sectionHeading(doc, 'Limitations');
  bulletList(doc, assessment.scope.limitations);

  sectionHeading(doc, 'Assessment methodology');
  bulletList(doc, assessment.methodology);

  sectionHeading(doc, 'Result summary');
  labelValue(doc, 'PASS', String(assessment.summary.pass));
  labelValue(doc, 'FAIL', String(assessment.summary.fail));
  labelValue(doc, 'NOT_APPLICABLE', String(assessment.summary.notApplicable));
  labelValue(doc, 'INCONCLUSIVE', String(assessment.summary.inconclusive));
  labelValue(doc, 'ERROR', String(assessment.summary.error));
  labelValue(doc, 'TOTAL', String(assessment.summary.total));

  const failures = assessment.findings.filter((finding) => finding.status === 'fail');
  const passes = assessment.findings.filter((finding) => finding.status === 'pass');
  const otherResults = assessment.findings.filter(
    (finding) => finding.status === 'not_applicable' || finding.status === 'inconclusive',
  );
  const errors = assessment.findings.filter((finding) => finding.status === 'error');

  sectionHeading(doc, 'Security findings');
  renderFindingGroup(doc, failures, 'No security FAIL was demonstrated in the agreed scope.');

  sectionHeading(doc, 'PASS / expected-behavior observations');
  renderFindingGroup(doc, passes, 'No PASS observations were recorded.');

  sectionHeading(doc, 'Other assessment results');
  renderFindingGroup(doc, otherResults, 'No NOT_APPLICABLE or INCONCLUSIVE results were recorded.');

  sectionHeading(doc, 'Scanner or environment errors');
  paragraph(doc, 'Scanner or environment ERROR is not a vulnerability finding.');
  renderFindingGroup(doc, errors, 'No scanner or environment errors were recorded.');

  sectionHeading(doc, 'Remediation priorities');
  bulletList(doc, assessment.remediationPriorities);

  sectionHeading(doc, 'Retest');
  for (const finding of assessment.findings) {
    subheading(doc, `${finding.id} - ${finding.retest.state}`);
    paragraph(doc, finding.retest.notes);
  }

  sectionHeading(doc, 'Final limitations and non-certification statement');
  paragraph(doc, 'This assessment covers only the written agreed scope.');
  paragraph(
    doc,
    'Untested surfaces are not implicitly secure. Results describe evidence from the tested context and are not a certification. Absence of findings does not prove absence of vulnerabilities. Scanner or environment ERROR is not a vulnerability finding. Third-party testing requires authorization.',
  );

  addPageFooters(doc, assessment.reportId);
  doc.end();

  await completion;
}

export async function generateCommercialAssessmentDelivery(
  inputPath: string,
  outputDirectory: string,
): Promise<void> {
  const assessment = await readCommercialAssessment(inputPath);

  await generateCommercialAssessmentPackage(inputPath, outputDirectory);
  await renderCommercialAssessmentPdf(
    assessment,
    resolve(outputDirectory, 'handoffprobe-security-assessment.pdf'),
  );
}

async function run(): Promise<number> {
  const [inputPath, requestedOutputDirectory] = process.argv.slice(2);

  if (inputPath === undefined) {
    console.error(
      'Usage: npx tsx scripts/commercial-assessment-delivery.ts <assessment.json> [output-directory]',
    );
    return 2;
  }

  const resolvedInput = resolve(inputPath);
  const outputDirectory =
    requestedOutputDirectory === undefined
      ? resolve(dirname(resolvedInput), 'delivery')
      : resolve(requestedOutputDirectory);

  try {
    await generateCommercialAssessmentDelivery(resolvedInput, outputDirectory);
    console.log(`Assessment delivery package written to ${outputDirectory}`);
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
