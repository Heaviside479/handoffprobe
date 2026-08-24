import { HandoffProbeCoreError } from './errors.js';
import type { FindingSeverity, PropertyClass, ProtocolApplicability } from './findings.js';
import type { SourceReference } from './provenance.js';

export type AttackId = `HP-${string}`;

export type AttackPriority = 'P0' | 'P1' | 'advanced';

export type SideEffectClass = 'none' | 'synthetic' | 'external';

export interface AttackDefinition {
  id: AttackId;
  name: string;
  category: string;
  defaultSeverity: FindingSeverity;
  priority: AttackPriority;
  preconditions: readonly string[];
  mutationSteps: readonly string[];
  expectedInvariant: string;
  evidenceRequirements: readonly string[];
  applicability: ProtocolApplicability;
  propertyClass: PropertyClass;
  sourceReferences: readonly SourceReference[];
  sideEffectClass: SideEffectClass;
  destructive: boolean;
}

function validateAttackId(id: AttackId): void {
  const pattern = /^HP-[A-Z0-9]+(?:-[A-Z0-9]+)+$/;

  if (pattern.test(id)) {
    return;
  }

  throw new HandoffProbeCoreError(
    'INVALID_ATTACK_ID',
    `Invalid HandoffProbe attack ID: ${id}`,
    'attack-registry',
    {
      attackId: id,
    },
  );
}

export class AttackRegistry {
  private readonly attacks = new Map<AttackId, AttackDefinition>();

  register(definition: AttackDefinition): void {
    validateAttackId(definition.id);

    if (this.attacks.has(definition.id)) {
      throw new HandoffProbeCoreError(
        'DUPLICATE_ATTACK_ID',
        `Attack already registered: ${definition.id}`,
        'attack-registry',
        {
          attackId: definition.id,
        },
      );
    }

    this.attacks.set(definition.id, definition);
  }

  get(id: AttackId): AttackDefinition | undefined {
    return this.attacks.get(id);
  }

  require(id: AttackId): AttackDefinition {
    const definition = this.attacks.get(id);

    if (definition !== undefined) {
      return definition;
    }

    throw new HandoffProbeCoreError(
      'ATTACK_NOT_FOUND',
      `Attack is not registered: ${id}`,
      'attack-registry',
      {
        attackId: id,
      },
    );
  }

  list(): AttackDefinition[] {
    return [...this.attacks.values()].sort((left, right) => left.id.localeCompare(right.id));
  }
}
