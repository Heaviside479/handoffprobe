export type SourceReferenceKind = 'spec' | 'research' | 'project';

export interface SourceReference {
  kind: SourceReferenceKind;
  title: string;
  locator: string;
  version?: string;
}
