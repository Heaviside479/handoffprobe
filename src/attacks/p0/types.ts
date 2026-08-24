import type { AttackCase, HandoffAdapter, SecurityContext } from '../../core/index.js';

import type { P0Scenario } from '../../p0-fixture/index.js';

export interface P0AttackPlan {
  attack: AttackCase;
  scenario: P0Scenario;
  handoffAdapter: HandoffAdapter;

  createContext(): SecurityContext;
}
