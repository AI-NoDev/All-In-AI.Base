import { Elysia, t } from "elysia";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import db from "@qiyu-allinai/db/connect";
import { mcpServer, apiKey, apiKeyMcp } from "@qiyu-allinai/db/entities/ai";
import { dbActions, filesActions, devActions } from "@qiyu-allinai/actions";
import type { ActionDefinition } from "@qiyu-allinai/actions";

// MCP SDK uses Zod v3 internally, we need to cast our Zod v4 types
type ZodRawShapeCompat = Record<string, z.ZodTypeAny>;

// All available actions
const allActions = [...dbActions, ...filesActions, ...devActions];
const actionsMap = new Map<string, ActionDefinition>();
for (const action of allActions) {
  actionsMap.set(action.meta.name, action);
}

// Store server configs
interface McpServerConfig {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  actions: string[];
}
const serverConfigs = new Map<string, McpServerConfig>();

// Session storage: sessionId -> { server, clientTransport, userContext }
interface McpSession {
  server: McpServer;
  clientTransport: InstanceType<typeof InMemoryTransport>;
  serverTransport: InstanceType<typeof InMemoryTransport>;
  lastActivity: number;
  userContext: McpUserContext;
}
const sessions = new Map<string, McpSession>();

// Cleanup old sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes
  for (const [sessionId, session] of sessions) {
    if (now - session.lastActivity > timeout) {
      session.clientTransport.close();
      session.serverTransport.close();
      sessions.delete(sessionId);
      console.log(`[MCP] Cleaned up inactive session: ${sessionId}`);
    }
  }
}, 5 * 60 * 1000);

// ============ Helper Functions ============

/**
 * API Key verification result with user info
 */
interface ApiKeyVerifyResult {
  valid: boolean;
  error?: string;
  apiKeyId?: string;
  userId?: string;
  userName?: string;
}

/**
 * Verify API Key and check MCP access
 */
async function verifyApiKey(
  token: string | undefined,
  mcpServerId: string,
  isPublic: boolean
): Promise<ApiKeyVerifyResult> {
  if (isPublic) return { valid: true };
  if (!token) return { valid: false, error: "API key required" };

  const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
  const tokenHash = Bun.hash(cleanToken).toString(16);

  const [apiKeyRecord] = await db
    .select()
    .from(apiKey)
    .where(eq(apiKey.tokenHash, tokenHash))
    .limit(1);

  if (!apiKeyRecord) return { valid: false, error: "Invalid API key" };
  if (apiKeyRecord.isRevoked) return { valid: false, error: "API key has been revoked" };
  if (apiKeyRecord.expiresAt && new Date(apiKeyRecord.expiresAt) < new Date()) {
    return { valid: false, error: "API key has expired" };
  }

  if (!apiKeyRecord.accessAll) {
    const [access] = await db
      .select()
      .from(apiKeyMcp)
      .where(and(eq(apiKeyMcp.apiKeyId, apiKeyRecord.id), eq(apiKeyMcp.mcpServerId, mcpServerId)))
      .limit(1);
    if (!access) return { valid: false, error: "API key does not have access to this MCP server" };
  }

  // Update last used timestamp
  db.update(apiKey)
    .set({ lastUsedAt: new Date().toISOString() })
    .where(eq(apiKey.id, apiKeyRecord.id))
    .catch(console.error);

  const result: ApiKeyVerifyResult = { 
    valid: true, 
    apiKeyId: apiKeyRecord.id || undefined,
    userId: apiKeyRecord.createdById || undefined,
    userName: apiKeyRecord.createdBy ? `${apiKeyRecord.createdBy}(MCP)` : undefined,
  };
  return result;
}

/**
 * Build input schema shape for MCP tool
 */
function buildInputSchemaShape(action: ActionDefinition): ZodRawShapeCompat {
  const shape: ZodRawShapeCompat = {};
  if (action.schemas.paramsSchema) {
    shape.params = action.schemas.paramsSchema as z.ZodTypeAny;
  }
  if (action.schemas.querySchema) {
    shape.query = action.schemas.querySchema as z.ZodTypeAny;
  }
  if (action.schemas.bodySchema) {
    shape.body = action.schemas.bodySchema as z.ZodTypeAny;
  }
  return shape;
}

/**
 * Flatten MCP tool arguments to action input format
 * MCP tools receive { params, body, query }, actions expect flat input
 */
function flattenMcpArgs(args: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  // Spread params (URL path parameters like :id)
  if (args.params && typeof args.params === 'object') {
    Object.assign(result, args.params);
  }
  
  // Spread query (URL query parameters)
  if (args.query && typeof args.query === 'object') {
    Object.assign(result, args.query);
  }
  
  // Spread body (request body)
  if (args.body && typeof args.body === 'object') {
    Object.assign(result, args.body);
  }
  
  return result;
}

/**
 * User context for MCP session
 */
interface McpUserContext {
  userId: string;
  userName: string;
}

/**
 * Create MCP Server instance for a config
 */
function createMcpServerInstance(config: McpServerConfig, userContext: McpUserContext): McpServer {
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
async function getOrCreateSession(
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


// JSON-RPC types
interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

/**
 * Create MCP plugin that loads all servers from database
 */
export async function createMcpPlugin() {
  const app = new Elysia({ name: "mcp-plugin" });

  // Load all MCP servers from database
  const servers = await db.select().from(mcpServer);
  console.log(`[MCP] Found ${servers.length} MCP servers in database`);

  // Store configs
  for (const server of servers) {
    const config: McpServerConfig = {
      id: server.id,
      name: server.name,
      description: server.description,
      isPublic: server.isPublic,
      actions: server.actions,
    };
    serverConfigs.set(server.id, config);
    console.log(`[MCP] Registered server: ${config.name} with ${config.actions.length} tools`);
  }

  // Streamable HTTP POST endpoint - handles JSON-RPC messages
  app.post(
    "/mcp/:id",
    async ({ params, body, request, set }) => {
      const config = serverConfigs.get(params.id);
      if (!config) {
        set.status = 404;
        return { jsonrpc: "2.0", error: { code: -32001, message: "MCP server not found" }, id: null };
      }

      // Verify API key
      const authHeader = request.headers.get("authorization");
      const authResult = await verifyApiKey(authHeader ?? undefined, params.id, config.isPublic);
      if (!authResult.valid) {
        set.status = 401;
        return { jsonrpc: "2.0", error: { code: -32002, message: authResult.error }, id: null };
      }

      const jsonBody = body as JsonRpcRequest;
      
      // Get or create session
      let sessionId = request.headers.get("mcp-session-id");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
      }

      // Build user context from API key creator
      const userContext: McpUserContext = {
        userId: authResult.userId || "anonymous",
        userName: authResult.userName || "Anonymous(MCP)",
      };

      try {
        const session = await getOrCreateSession(params.id, sessionId, userContext);
        
        // Set session ID header
        set.headers["mcp-session-id"] = sessionId;

        // Send request through transport and wait for response
        return new Promise<JsonRpcResponse>((resolve) => {
          const messageHandler = (message: unknown) => {
            const msg = message as JsonRpcResponse;
            if (msg.id === jsonBody.id) {
              session.clientTransport.onmessage = undefined;
              resolve(msg);
            }
          };
          
          session.clientTransport.onmessage = messageHandler;
          session.clientTransport.send(jsonBody).catch((err) => {
            resolve({
              jsonrpc: "2.0",
              id: jsonBody.id,
              error: { code: -32603, message: err instanceof Error ? err.message : "Internal error" },
            });
          });

          // Timeout after 30 seconds
          setTimeout(() => {
            session.clientTransport.onmessage = undefined;
            resolve({
              jsonrpc: "2.0",
              id: jsonBody.id,
              error: { code: -32603, message: "Request timeout" },
            });
          }, 30000);
        });
      } catch (err) {
        console.error(`[MCP] Error handling request:`, err);
        set.status = 500;
        return { 
          jsonrpc: "2.0", 
          error: { code: -32603, message: err instanceof Error ? err.message : "Internal error" }, 
          id: jsonBody.id ?? null,
        };
      }
    },
    {
      body: t.Any(),
      params: t.Object({ id: t.String() }),
    }
  );

  // DELETE endpoint - close session
  app.delete(
    "/mcp/:id",
    async ({ params, request, set }) => {
      const sessionId = request.headers.get("mcp-session-id");
      if (sessionId) {
        const session = sessions.get(sessionId);
        if (session) {
          await session.clientTransport.close();
          await session.serverTransport.close();
          sessions.delete(sessionId);
          console.log(`[MCP] Closed session: ${sessionId}`);
        }
      }
      set.status = 204;
      return null;
    },
    { params: t.Object({ id: t.String() }) }
  );

  // Info endpoint
  app.get(
    "/mcp/:id/info",
    async ({ params, set }) => {
      const config = serverConfigs.get(params.id);
      if (!config) {
        set.status = 404;
        return { error: "MCP server not found" };
      }

      const baseUrl = process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 3030}`;
      
      return {
        name: config.name,
        description: config.description,
        version: "1.0.0",
        protocolVersion: "2024-11-05",
        endpoint: `${baseUrl}/mcp/${params.id}`,
        capabilities: { tools: { listChanged: false } },
        toolCount: config.actions.length,
      };
    },
    { params: t.Object({ id: t.String() }) }
  );

  // List all MCP servers
  app.get("/mcp", async () => {
    const servers = await db.select().from(mcpServer);
    const baseUrl = process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 3030}`;
    
    return {
      servers: servers.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        isPublic: s.isPublic,
        endpoint: `${baseUrl}/mcp/${s.id}`,
        toolCount: s.actions.length,
      })),
    };
  });

  return app;
}

// Placeholder plugin
export const mcpPlugin = new Elysia({ name: "mcp-placeholder" });
