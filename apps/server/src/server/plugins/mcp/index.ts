import { Elysia } from "elysia";
import { createMcpRoutes, initializeMcpServers } from "./routes";
import { createStdioRoutes } from "./stdio";

// Re-export types
export type {
  McpServerConfig,
  McpUserContext,
  McpSession,
  ApiKeyVerifyResult,
  JsonRpcRequest,
  JsonRpcResponse,
  McpAdapter,
} from "./types";

// Re-export adapters
export { getAdapter, defaultAdapter, cozeAdapter } from "./adapters";

// Re-export session management
export {
  getServerConfigs,
  getSessions,
  getOrCreateSession,
  closeSession,
  registerServerConfig,
  startSessionCleanup,
  createMcpServerInstance,
} from "./session";

// Re-export auth
export { verifyApiKey } from "./auth";

// Re-export utils
export { buildInputSchemaShape, flattenMcpArgs } from "./utils";

/**
 * Create MCP plugin that loads all servers from database
 */
export async function createMcpPlugin(): Promise<Elysia> {
  // Initialize servers from database
  await initializeMcpServers();
  
  // Create and return routes (core + stdio)
  const coreRoutes = createMcpRoutes();
  const stdioRoutes = createStdioRoutes();
  
  return new Elysia({ name: "mcp-plugin" })
    .use(coreRoutes)
    .use(stdioRoutes);
}

// Placeholder plugin for lazy loading
export const mcpPlugin = new Elysia({ name: "mcp-placeholder" });
