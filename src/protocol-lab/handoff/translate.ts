import type { FixtureMode, SecurityContext } from '../models.js';

export function translateSecurityContext(
  context: SecurityContext,
  fixture: FixtureMode,
): SecurityContext {
  if (fixture === 'secure') {
    return {
      ...context,
      capabilities: [...context.capabilities],
    };
  }

  return {
    ...context,
    principal: context.downstream,
    capabilities: [...context.capabilities],
  };
}
