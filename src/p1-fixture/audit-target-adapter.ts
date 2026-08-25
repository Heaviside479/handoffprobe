import { cloneSecurityContext } from '../core/index.js';

import type {
  HandoffAdapter,
  SecurityContext,
  TargetAdapter,
  TargetExecutionInput,
  TargetExecutionResult,
} from '../core/index.js';

import type { P0A2aRunState } from '../p0-fixture/a2a/executor.js';
import { executeP0A2aFixture } from '../p0-fixture/a2a/harness.js';

import type { P0Scenario } from '../p0-fixture/index.js';

import { EvidenceRecorder } from '../protocol-lab/evidence.js';

import { createP1FixtureState, recordP1AuditLineage } from './state.js';

import type { P1FixtureState } from './state.js';
import type { P1FixtureMode } from './target-adapter.js';

export interface P1AuditScenario {
  id: string;
  originalTaskId: string;
  delegationId: string;
  handoffId: string;
  mcpRequestId: string;
  p0Scenario: P0Scenario;
}

export interface P1AuditTargetOutput {
  scenarioId: string;
  fixture: P1FixtureMode;
  originalPrincipal: string;
  expectedTaskId: string;
  observedTaskId: string | null;
  delegationId: string;
  handoffId: string;
  mcpRequestId: string;
  missingElement: string;
  lineageReconstructable: boolean;
  translatedHasTaskBinding: boolean;
  executed: boolean;
  sideEffectId: string | null;
  sideEffectCounterBefore: number;
  sideEffectCounterAfter: number;
}

class P1AuditLineageBreakingHandoffAdapter implements HandoffAdapter {
  readonly id = 'p1-audit-drop-governing-task';

  translate(input: SecurityContext): SecurityContext {
    const translated = cloneSecurityContext(input);

    /*
     * The governing application task is intentionally lost
     * at the protocol handoff.
     */
    delete translated.lifecycle;

    return translated;
  }
}

async function executeProtectedAuditAction(input: {
  recorder: EvidenceRecorder;
  state: P1FixtureState;
  context: SecurityContext;
  scenario: P0Scenario;
}) {
  const runState: P0A2aRunState = {};

  await executeP0A2aFixture({
    recorder: input.recorder,
    state: runState,
    fixtureState: input.state,
    context: cloneSecurityContext(input.context),
    handoffAdapter: new P1AuditLineageBreakingHandoffAdapter(),
    scenario: input.scenario,
    enforcementMode: 'enforce',
  });

  const mcpResult = runState.mcpResult;

  if (mcpResult === undefined) {
    throw new Error('P1 audit execution produced no MCP result.');
  }

  return {
    executed: mcpResult.envelope.authorization.executed,
    translatedContext: runState.translatedContext,
  };
}

export class P1AuditTargetAdapter implements TargetAdapter {
  readonly id: string;

  constructor(
    readonly fixture: P1FixtureMode,
    readonly scenario: P1AuditScenario,
  ) {
    this.id = ['p1', fixture, scenario.id].join(':');
  }

  async execute(input: TargetExecutionInput): Promise<TargetExecutionResult> {
    if (input.signal.aborted) {
      throw new Error('P1 audit execution was aborted before start.');
    }

    const originalContext = cloneSecurityContext(input.context);

    const recorder = new EvidenceRecorder(input.runId, this.fixture, input.correlationId);

    const state = createP1FixtureState();

    const originalTaskId = originalContext.lifecycle?.taskId;

    if (originalTaskId !== this.scenario.originalTaskId) {
      throw new Error('P1 audit baseline requires the expected governing task.');
    }

    const before = state.sideEffectCounter;

    recorder.record({
      protocol: 'CORE',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'upstream-security-context -> audit-baseline',
      event: 'p1.audit.baseline',
      context: originalContext,
      details: {
        originalPrincipal: originalContext.principal,
        taskId: this.scenario.originalTaskId,
        delegationId: this.scenario.delegationId,
        handoffId: this.scenario.handoffId,
        mcpRequestId: this.scenario.mcpRequestId,
        lineageComplete: true,
      },
    });

    /*
     * Apply the actual mutation once up front so secure and
     * vulnerable modes observe the same broken handoff state.
     */
    const breakingHandoff = new P1AuditLineageBreakingHandoffAdapter();

    const mutatedContext = breakingHandoff.translate(originalContext);

    const translatedHasTaskBinding =
      mutatedContext.lifecycle?.taskId === this.scenario.originalTaskId;

    recorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'audit-baseline -> translated-security-context',
      event: 'p1.audit.lineage_mutation',
      context: mutatedContext,
      details: {
        missingElement: 'taskId',
        expectedTaskId: this.scenario.originalTaskId,
        observedTaskId: mutatedContext.lifecycle?.taskId ?? null,
        delegationId: this.scenario.delegationId,
        handoffId: this.scenario.handoffId,
        mcpRequestId: this.scenario.mcpRequestId,

        /*
         * HandoffProbe's own recorder correlation is test
         * plumbing, not a replacement for the application's
         * governing security binding.
         */
        harnessCorrelationIsNotApplicationBinding: true,
      },
    });

    if (translatedHasTaskBinding) {
      throw new Error('P1 audit mutation failed to remove the governing task binding.');
    }

    if (this.fixture === 'secure') {
      recorder.record({
        protocol: 'HANDOFF',
        protocolVersion: 'handoffprobe-p1-v1',
        boundary: 'mandatory-lineage-policy -> mcp',
        event: 'p1.audit.blocked',
        context: mutatedContext,
        details: {
          missingElement: 'taskId',
          reason: 'mandatory_audit_lineage_missing',
          sideEffectCounter: state.sideEffectCounter,
        },
      });

      const output: P1AuditTargetOutput = {
        scenarioId: this.scenario.id,
        fixture: this.fixture,
        originalPrincipal: originalContext.principal,
        expectedTaskId: this.scenario.originalTaskId,
        observedTaskId: null,
        delegationId: this.scenario.delegationId,
        handoffId: this.scenario.handoffId,
        mcpRequestId: this.scenario.mcpRequestId,
        missingElement: 'taskId',
        lineageReconstructable: false,
        translatedHasTaskBinding: false,
        executed: false,
        sideEffectId: null,
        sideEffectCounterBefore: before,
        sideEffectCounterAfter: state.sideEffectCounter,
      };

      return {
        originalContext,
        translatedContext: cloneSecurityContext(mutatedContext),
        evidence: recorder.events,
        output,
      };
    }

    recorder.record({
      protocol: 'HANDOFF',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'mandatory-lineage-policy -> mcp',
      event: 'p1.audit.bypassed',
      context: mutatedContext,
      details: {
        missingElement: 'taskId',
        reason: 'mandatory_audit_lineage_ignored',
      },
    });

    const protectedResult = await executeProtectedAuditAction({
      recorder,
      state,
      context: originalContext,
      scenario: this.scenario.p0Scenario,
    });

    const translated = protectedResult.translatedContext;

    if (translated === undefined) {
      throw new Error('P1 audit execution produced no translated context.');
    }

    const finalHasTaskBinding = translated.lifecycle?.taskId === this.scenario.originalTaskId;

    const sideEffectId = protectedResult.executed
      ? [
          'side-effect',
          this.scenario.p0Scenario.tool,
          translated.resource,
          String(state.sideEffectCounter),
        ].join(':')
      : null;

    recordP1AuditLineage(state, {
      correlationId: recorder.correlationId,
      principal: originalContext.principal,
      taskId: '<missing>',
      delegationId: this.scenario.delegationId,
      handoffId: this.scenario.handoffId,
      mcpRequestId: this.scenario.mcpRequestId,
      ...(sideEffectId === null ? {} : { sideEffectId }),
    });

    const lineageReconstructable = finalHasTaskBinding;

    recorder.record({
      protocol: 'CORE',
      protocolVersion: 'handoffprobe-p1-v1',
      boundary: 'protected-side-effect -> audit-correlation',
      event: 'p1.audit.final',
      context: translated,
      details: {
        originalPrincipal: originalContext.principal,
        expectedTaskId: this.scenario.originalTaskId,
        observedTaskId: translated.lifecycle?.taskId ?? null,
        delegationId: this.scenario.delegationId,
        handoffId: this.scenario.handoffId,
        mcpRequestId: this.scenario.mcpRequestId,
        sideEffectId,
        executed: protectedResult.executed,
        missingElement: 'taskId',
        lineageReconstructable,
        translatedHasTaskBinding: finalHasTaskBinding,
      },
    });

    const output: P1AuditTargetOutput = {
      scenarioId: this.scenario.id,
      fixture: this.fixture,
      originalPrincipal: originalContext.principal,
      expectedTaskId: this.scenario.originalTaskId,
      observedTaskId: translated.lifecycle?.taskId ?? null,
      delegationId: this.scenario.delegationId,
      handoffId: this.scenario.handoffId,
      mcpRequestId: this.scenario.mcpRequestId,
      missingElement: 'taskId',
      lineageReconstructable,
      translatedHasTaskBinding: finalHasTaskBinding,
      executed: protectedResult.executed,
      sideEffectId,
      sideEffectCounterBefore: before,
      sideEffectCounterAfter: state.sideEffectCounter,
    };

    return {
      originalContext,
      translatedContext: cloneSecurityContext(translated),
      evidence: recorder.events,
      output,
    };
  }
}
