import { cloneSecurityContext } from '../../core/index.js';
import type { HandoffAdapter, SecurityContext } from '../../core/index.js';

export class P0IdentityHandoffAdapter implements HandoffAdapter {
  readonly id = 'p0-handoff:identity';

  translate(context: SecurityContext): SecurityContext {
    return cloneSecurityContext(context);
  }
}
