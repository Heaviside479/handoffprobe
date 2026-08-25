import { describe, expect, it } from 'vitest';

import { HP_AUDIT_001, HP_RACE_001, HP_RACE_002 } from '../src/attacks/p1/index.js';

import type { P1AuditAttackPlan, P1RaceAttackPlan } from '../src/attacks/p1/index.js';

import { CoreRunner } from '../src/core/index.js';

import { P1AuditTargetAdapter, P1RaceTargetAdapter } from '../src/p1-fixture/index.js';

import type { P1FixtureMode } from '../src/p1-fixture/index.js';

async function runRace(plan: P1RaceAttackPlan, fixture: P1FixtureMode, runId: string) {
  return new CoreRunner().run({
    attack: plan.attack,
    target: new P1RaceTargetAdapter(fixture, plan.scenario),
    context: plan.createContext(),
    runId,
  });
}

async function runAudit(plan: P1AuditAttackPlan, fixture: P1FixtureMode, runId: string) {
  return new CoreRunner().run({
    attack: plan.attack,
    target: new P1AuditTargetAdapter(fixture, plan.scenario),
    context: plan.createContext(),
    runId,
  });
}

function events(result: {
  evidence: readonly {
    event: string;
  }[];
}): string[] {
  return result.evidence.map((event) => event.event);
}

describe('P1 race and audit attacks', () => {
  it('registers the final three stable P1 IDs', () => {
    expect(HP_RACE_001.attack.definition.id).toBe('HP-RACE-001');

    expect(HP_RACE_002.attack.definition.id).toBe('HP-RACE-002');

    expect(HP_AUDIT_001.attack.definition.id).toBe('HP-AUDIT-001');

    expect(HP_RACE_001.attack.definition.priority).toBe('P1');

    expect(HP_AUDIT_001.attack.definition.defaultSeverity).toBe('medium');
  });

  it('HP-RACE-001 passes against secure target', async () => {
    const result = await runRace(HP_RACE_001, 'secure', 'p1-race-001-secure');

    expect(result.finding.status).toBe('pass');

    expect(events(result).filter((event) => event === 'p1.race.arrive')).toHaveLength(2);

    expect(events(result).filter((event) => event === 'p1.race.side_effect')).toHaveLength(1);

    expect(events(result)).toContain('p1.race.blocked');
  });

  it('HP-RACE-001 fails against vulnerable target', async () => {
    const result = await runRace(HP_RACE_001, 'vulnerable', 'p1-race-001-vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(events(result).filter((event) => event === 'p1.race.side_effect')).toHaveLength(2);
  });

  it('HP-RACE-002 passes against secure target', async () => {
    const result = await runRace(HP_RACE_002, 'secure', 'p1-race-002-secure');

    expect(result.finding.status).toBe('pass');

    expect(events(result)).toContain('p1.partial.capture');

    expect(events(result)).toContain('p1.partial.invalidate');

    expect(events(result)).toContain('p1.partial.blocked');

    expect(events(result)).not.toContain('mcp.tool.call');
  });

  it('HP-RACE-002 fails against vulnerable target', async () => {
    const result = await runRace(HP_RACE_002, 'vulnerable', 'p1-race-002-vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(events(result)).toContain('p1.partial.side_effect');

    expect(events(result)).toContain('mcp.tool.call');
  });

  it('HP-AUDIT-001 passes against secure target', async () => {
    const result = await runAudit(HP_AUDIT_001, 'secure', 'p1-audit-001-secure');

    expect(result.finding.status).toBe('pass');

    expect(events(result)).toContain('p1.audit.lineage_mutation');

    expect(events(result)).toContain('p1.audit.blocked');

    expect(events(result)).not.toContain('mcp.tool.call');

    const mutationEvent = result.evidence.find(
      (event) => event.event === 'p1.audit.lineage_mutation',
    );

    expect(mutationEvent?.context.lifecycle).toBeUndefined();
  });

  it('HP-AUDIT-001 fails against vulnerable target', async () => {
    const result = await runAudit(HP_AUDIT_001, 'vulnerable', 'p1-audit-001-vulnerable');

    expect(result.finding.status).toBe('fail');

    expect(events(result)).toContain('p1.audit.bypassed');

    expect(events(result)).toContain('handoff.translate');

    expect(events(result)).toContain('mcp.tool.call');

    expect(events(result)).toContain('p1.audit.final');

    const finalEvent = result.evidence.find((event) => event.event === 'p1.audit.final');

    expect(finalEvent?.details.missingElement).toBe('taskId');

    expect(finalEvent?.details.translatedHasTaskBinding).toBe(false);

    expect(finalEvent?.details.lineageReconstructable).toBe(false);

    const finalAuditEvent = result.evidence.find((event) => event.event === 'p1.audit.final');

    expect(finalAuditEvent?.context.lifecycle).toBeUndefined();
  });

  it('parallel race evidence is deterministic', async () => {
    const first = await runRace(HP_RACE_001, 'secure', 'p1-race-repeat-a');

    const second = await runRace(HP_RACE_001, 'secure', 'p1-race-repeat-b');

    expect(events(first)).toEqual(events(second));

    expect(first.evidence.map((event) => event.sequence)).toEqual(
      second.evidence.map((event) => event.sequence),
    );
  });

  it('audit-break evidence is deterministic', async () => {
    const first = await runAudit(HP_AUDIT_001, 'vulnerable', 'p1-audit-repeat-a');

    const second = await runAudit(HP_AUDIT_001, 'vulnerable', 'p1-audit-repeat-b');

    expect(first.finding.status).toBe('fail');

    expect(second.finding.status).toBe('fail');

    expect(events(first)).toEqual(events(second));
  });
});
