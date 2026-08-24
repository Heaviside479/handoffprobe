import type { HandoffAdapter, SecurityContext } from '../../core/index.js';
import type { FixtureMode } from '../models.js';
import { translateSecurityContext } from './translate.js';

export class ProtocolLabHandoffAdapter implements HandoffAdapter {
  readonly id: string;

  constructor(readonly fixture: FixtureMode) {
    this.id = `protocol-lab-handoff:${fixture}`;
  }

  translate(context: SecurityContext): SecurityContext {
    return translateSecurityContext(context, this.fixture);
  }
}
