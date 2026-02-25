import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import db from "@qiyu-allinai/db/connect";
import { allActions, actionsMap } from "../../../config";
import type { ActionDefinition } from "@qiyu-allinai/actions";
import type { McpServerConfig, McpSession, McpUserContext } from "./types";
import { buildInputSchemaShape, flattenMcpArgs } from "./utils";

// Session storage: sessionId -> McpSession
const sessions = new Map<string, McpSession>();

// Server configs storage
const serverConfigs = new Map<string, McpServerConfig>();

/**
 * Get server configs map
 */
export function getServerConfigs(): Map<string, McpServerConfig> {
  return serverConfigs;
}

/**
 * Get sessions map
 */
export function getSessions(): Map<string, McpSession> {
  return sessions;
}

/**
 * Register a server config
 */
export function registerServerConfig(config: McpServerConfig): void {
  serverConfigs.set(config.id, config);
}

/**
 * Create MCP Server instance for a config
 */
export function createMcpServerInstance(config: McpServerConfig, userContext: McpUserContext): McpServer {
  const server = new McpServer({
    name: config.name,
    version: "1.0.0",
  });

  const availableActions = config.actions
    .map((name) => actionsMap.get(name))
    .filter((a): a is ActionDefinition => !!a);

  // Register tools
  for (const action of availableActions) {
    const inputSchemaShape = buildInputSchemaShape(action);
    
    // Cast to unknown first to bypass Zod v4 vs v3 type incompatibility
    (server.tool as Function)(
      action.meta.name,
      action.meta.description || action.meta.displayName,
      inputSchemaShape,
      async (args: Record<string, unknown>) => {
        try {
          // Flatten { params, body, query } to flat input
          const flatInput = flattenMcpArgs(args);
          
          const result = await action.execute(flatInput, {
            db,
            token: "",
            currentUserId: userContext.userId,
            currentUserName: userContext.userName,
          });
          return {
            content: [{
              type: "text" as const,
              text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
            }],
          };
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
        }
      }
    );
  }

  return server;
}

/**
 * Get or create session
 */
export async function getOrCreateSession(
  serverId: string, 
  sessionId: string, 
  userContext: McpUserContext
): Promise<McpSession> {
  let session = sessions.get(sessionId);
  if (session) {
    session.lastActivity = Date.now();
    return session;
  }

  const config = serverConfigs.get(serverId);
  if (!config) {
    throw new Error("MCP server not found");
  }

  // Create new server and transports
  const server = createMcpServerInstance(config, userContext);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  // Connect server to transport
  await server.connect(serverTransport);

  session = {
    server,
    clientTransport,
    serverTransport,
    lastActivity: Date.now(),
    userContext,
  };
  sessions.set(sessionId, session);

  console.log(`[MCP] Created new session: ${sessionId} for server: ${config.name}, user: ${userContext.userName}`);
  return session;
}

/**
 * Close and remove a session
 */
export async function closeSession(sessionId: string): Promise<void> {
  const session = sessions.get(sessionId);
  if (session) {
    await session.clientTransport.close();
    await session.serverTransport.close();
    sessions.delete(sessionId);
    console.log(`[MCP] Closed session: ${sessionId}`);
  }
}

/**
 * Start session cleanup interval
 */
export function startSessionCleanup(intervalMs = 5 * 60 * 1000, timeoutMs = 30 * 60 * 1000): NodeJS.Timeout {
  return setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of sessions) {
      if (now - session.lastActivity > timeoutMs) {
        session.clientTransport.close();
        session.serverTransport.close();
        sessions.delete(sessionId);
        console.log(`[MCP] Cleaned up inactive session: ${sessionId}`);
      }
    }
  }, intervalMs);
}
