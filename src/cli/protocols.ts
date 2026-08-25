export const CLI_PROTOCOLS = {
  a2a: '1.0',
  mcp: '2026-07-28',
} as const;

export const CLI_PROTOCOL_BASELINE = `A2A ${CLI_PROTOCOLS.a2a} | MCP ${CLI_PROTOCOLS.mcp}`;
