import type { AttackDefinition } from '../core/index.js';

import { CLI_EXECUTION_CATALOG, getCliExecutionBinding } from './execution-catalog.js';

function upper(value: string): string {
  return value.toUpperCase();
}

function numbered(values: readonly string[]): string[] {
  return values.map((value, index) => `  ${index + 1}. ${value}`);
}

function bullets(values: readonly string[]): string[] {
  return values.map((value) => `  - ${value}`);
}

function renderSource(definition: AttackDefinition): string[] {
  return definition.sourceReferences.map((source) => {
    const version = source.version === undefined ? '' : ` (${source.version})`;

    return `  - [${source.kind}] ${source.title}${version} — ${source.locator}`;
  });
}

export function renderAttackList(): string {
  const definitions = CLI_EXECUTION_CATALOG.map((binding) => binding.definition);

  const idWidth = Math.max('ID'.length, ...definitions.map((definition) => definition.id.length));
  const priorityWidth = Math.max(
    'PRIORITY'.length,
    ...definitions.map((definition) => definition.priority.length),
  );
  const severityWidth = Math.max(
    'SEVERITY'.length,
    ...definitions.map((definition) => definition.defaultSeverity.length),
  );
  const categoryWidth = Math.max(
    'CATEGORY'.length,
    ...definitions.map((definition) => definition.category.length),
  );

  const header = [
    'ID'.padEnd(idWidth),
    'PRIORITY'.padEnd(priorityWidth),
    'SEVERITY'.padEnd(severityWidth),
    'CATEGORY'.padEnd(categoryWidth),
    'NAME',
  ].join('  ');

  const rows = definitions.map((definition) =>
    [
      definition.id.padEnd(idWidth),
      definition.priority.padEnd(priorityWidth),
      upper(definition.defaultSeverity).padEnd(severityWidth),
      definition.category.padEnd(categoryWidth),
      definition.name,
    ].join('  '),
  );

  return [`HandoffProbe attacks (${definitions.length})`, '', header, ...rows].join('\n');
}

export function renderAttackExplanation(id: string): string | undefined {
  const binding = getCliExecutionBinding(id);

  if (binding === undefined) {
    return undefined;
  }

  const definition = binding.definition;

  return [
    `${definition.id} — ${definition.name}`,
    '',
    `Priority: ${definition.priority}`,
    `Severity: ${upper(definition.defaultSeverity)}`,
    `Category: ${definition.category}`,
    `Property class: ${definition.propertyClass}`,
    `Side effects: ${definition.sideEffectClass}`,
    `Destructive: ${definition.destructive ? 'yes' : 'no'}`,
    '',
    'Protocols:',
    `  A2A: ${definition.applicability.a2a.join(', ') || 'not applicable'}`,
    `  MCP: ${definition.applicability.mcp.join(', ') || 'not applicable'}`,
    '',
    'Expected invariant:',
    `  ${definition.expectedInvariant}`,
    '',
    'Preconditions:',
    ...numbered(definition.preconditions),
    '',
    'Mutation steps:',
    ...numbered(definition.mutationSteps),
    '',
    'Required evidence:',
    ...bullets(definition.evidenceRequirements),
    '',
    'Sources:',
    ...renderSource(definition),
  ].join('\n');
}
