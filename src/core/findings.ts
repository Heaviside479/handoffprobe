import type { SourceReference } from './provenance.js';

export type FindingStatus = 'pass' | 'fail' | 'not_applicable' | 'inconclusive' | 'error';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type PropertyClass =
  'spec_required' | 'spec_recommended' | 'hardening' | 'composition_responsibility';

export interface ProtocolApplicability {
  a2a: readonly string[];
  mcp: readonly string[];
}

export interface Finding {
  testId: `HP-${string}`;
  runId: string;
  correlationId: string;
  title: string;
  severity: FindingSeverity;
  status: FindingStatus;
  propertyClass: PropertyClass;
  applicability: ProtocolApplicability;
  expectedInvariant: string;
  observedBehavior: string;
  evidenceSequences: readonly number[];
  sources: readonly SourceReference[];
  remediation?: string;
}

export function isSecurityFailure(finding: Pick<Finding, 'status'>): boolean {
  return finding.status === 'fail';
}
