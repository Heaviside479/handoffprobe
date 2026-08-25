import type { AttackCase, SecurityContext } from '../../core/index.js';

import type { P1AuthorizationScenario } from '../../p1-fixture/index.js';

export interface P1AttackPlan {
  attack: AttackCase;

  scenario: P1AuthorizationScenario;

  createContext(): SecurityContext;
}
