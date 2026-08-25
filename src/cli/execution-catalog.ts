import {
  HP_APPROVAL_001,
  HP_APPROVAL_002,
  HP_APPROVAL_003,
  HP_AUDIT_001,
  HP_AUTH_001,
  HP_AUTH_002,
  HP_AUTH_003,
  HP_AUTH_004,
  HP_AUTH_005,
  HP_CRED_001,
  HP_CRED_002,
  HP_ID_001,
  HP_ID_002,
  HP_LIFECYCLE_001,
  HP_RACE_001,
  HP_RACE_002,
  HP_REPLAY_001,
  HP_REPLAY_002,
  HP_REPLAY_003,
  HP_TARGET_001,
  HP_TARGET_002,
  HP_TENANT_001,
} from '../attacks/index.js';

import type {
  P0AttackPlan,
  P1ApprovalAttackPlan,
  P1AttackPlan,
  P1AuditAttackPlan,
  P1RaceAttackPlan,
  P1ReplayAttackPlan,
} from '../attacks/index.js';

import type {
  AttackCase,
  AttackDefinition,
  SecurityContext,
  TargetAdapter,
} from '../core/index.js';

import { P0TargetAdapter } from '../p0-fixture/index.js';

import {
  P1ApprovalTargetAdapter,
  P1AuditTargetAdapter,
  P1AuthorizationTargetAdapter,
  P1RaceTargetAdapter,
  P1ReplayTargetAdapter,
} from '../p1-fixture/index.js';

export type CliTargetFixture = 'secure' | 'vulnerable';

export interface CliExecutionBinding {
  readonly attack: AttackCase;
  readonly definition: AttackDefinition;

  createContext(): SecurityContext;
  createTarget(fixture: CliTargetFixture): TargetAdapter;
}

function createBinding(
  attack: AttackCase,
  createContext: () => SecurityContext,
  createTarget: (fixture: CliTargetFixture) => TargetAdapter,
): CliExecutionBinding {
  return {
    attack,
    definition: attack.definition,
    createContext,
    createTarget,
  };
}

function bindP0(plan: P0AttackPlan): CliExecutionBinding {
  return createBinding(
    plan.attack,
    () => plan.createContext(),
    (fixture) => {
      return new P0TargetAdapter(fixture, plan.scenario, plan.handoffAdapter);
    },
  );
}

function bindP1Authorization(plan: P1AttackPlan): CliExecutionBinding {
  return createBinding(
    plan.attack,
    () => plan.createContext(),
    (fixture) => {
      return new P1AuthorizationTargetAdapter(fixture, plan.scenario);
    },
  );
}

function bindP1Replay(plan: P1ReplayAttackPlan): CliExecutionBinding {
  return createBinding(
    plan.attack,
    () => plan.createContext(),
    (fixture) => {
      return new P1ReplayTargetAdapter(fixture, plan.scenario);
    },
  );
}

function bindP1Approval(plan: P1ApprovalAttackPlan): CliExecutionBinding {
  return createBinding(
    plan.attack,
    () => plan.createContext(),
    (fixture) => {
      return new P1ApprovalTargetAdapter(fixture, plan.scenario);
    },
  );
}

function bindP1Race(plan: P1RaceAttackPlan): CliExecutionBinding {
  return createBinding(
    plan.attack,
    () => plan.createContext(),
    (fixture) => {
      return new P1RaceTargetAdapter(fixture, plan.scenario);
    },
  );
}

function bindP1Audit(plan: P1AuditAttackPlan): CliExecutionBinding {
  return createBinding(
    plan.attack,
    () => plan.createContext(),
    (fixture) => {
      return new P1AuditTargetAdapter(fixture, plan.scenario);
    },
  );
}

const catalog: readonly CliExecutionBinding[] = [
  bindP0(HP_APPROVAL_001),
  bindP0(HP_AUTH_001),
  bindP0(HP_AUTH_002),
  bindP0(HP_AUTH_003),
  bindP0(HP_CRED_001),
  bindP0(HP_CRED_002),
  bindP0(HP_ID_001),
  bindP0(HP_ID_002),
  bindP0(HP_LIFECYCLE_001),
  bindP0(HP_TARGET_001),
  bindP0(HP_TARGET_002),
  bindP0(HP_TENANT_001),

  bindP1Approval(HP_APPROVAL_002),
  bindP1Approval(HP_APPROVAL_003),
  bindP1Audit(HP_AUDIT_001),
  bindP1Authorization(HP_AUTH_004),
  bindP1Authorization(HP_AUTH_005),
  bindP1Race(HP_RACE_001),
  bindP1Race(HP_RACE_002),
  bindP1Replay(HP_REPLAY_001),
  bindP1Replay(HP_REPLAY_002),
  bindP1Replay(HP_REPLAY_003),
];

const ids = catalog.map((binding) => binding.definition.id);
const uniqueIds = new Set(ids);

if (catalog.length !== 22 || uniqueIds.size !== catalog.length) {
  throw new Error(
    `CLI execution catalog must contain exactly 22 unique stable attacks; received ${catalog.length} entries and ${uniqueIds.size} unique IDs.`,
  );
}

export const CLI_EXECUTION_CATALOG: readonly CliExecutionBinding[] = catalog;

export const CLI_EXECUTION_CATALOG_BY_ID: ReadonlyMap<string, CliExecutionBinding> = new Map(
  catalog.map((binding) => [binding.definition.id, binding]),
);

export function getCliExecutionBinding(id: string): CliExecutionBinding | undefined {
  return CLI_EXECUTION_CATALOG_BY_ID.get(id);
}
