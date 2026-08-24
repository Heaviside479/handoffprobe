import type { P0AuthorizationDecision } from '../authorization.js';
import type { P0FixtureSnapshot } from '../state.js';

export type P0McpToolName = 'read_invoice' | 'update_invoice' | 'refund_payment' | 'send_email';

export type P0EnforcementMode = 'enforce' | 'bypass';

export interface P0ToolAuthorization {
  policyMode: P0EnforcementMode;
  invariantAllowed: boolean;
  executed: boolean;
  decision: P0AuthorizationDecision | null;
  approvalMatches: boolean | null;
  semanticBindingMatches: boolean;
  reasons: string[];
}

export interface P0ToolEnvelope {
  tool: P0McpToolName;
  authorization: P0ToolAuthorization;
  before: P0FixtureSnapshot;
  after: P0FixtureSnapshot;
  output: unknown;
}

export interface P0McpExecutionResult {
  era: 'modern';
  envelope: P0ToolEnvelope;
}
