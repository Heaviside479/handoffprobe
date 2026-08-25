import type { AttackCase, SecurityContext } from '../../core/index.js';

import type { P1AuthorizationScenario, P1ReplayScenario } from '../../p1-fixture/index.js';

export interface P1AttackPlan {
  attack: AttackCase;

  scenario: P1AuthorizationScenario;

  createContext(): SecurityContext;
}

export interface P1ReplayAttackPlan {
  attack: AttackCase;

  scenario: P1ReplayScenario;

  createContext(): SecurityContext;
}
