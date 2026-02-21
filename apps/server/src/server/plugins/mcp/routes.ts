import { Elysia, t } from "elysia";
import db from "@qiyu-allinai/db/connect";
import { mcpServer } from "@qiyu-allinai/db/entities/ai";
import type { JsonRpcRequest, JsonRpcResponse, McpUserContext } from "./types";
import { verifyApiKey } from "./auth";
import { 
  getServerConfigs, 
  getSessions, 
  getOrCreateSession, 
  closeSession,
  registerServerConfig,
  startSessionCleanup,
} from "./session";
import { getAdapter } from "./adapters";

/**
 * Create MCP routes
 */
export function createMcpRoutes(): Elysia {
  const app = new Elysia({ name: "mcp-routes" });

  // Streamable HTTP POST endpoint - handles JSON-RPC messages
  app.post(
    "/mcp/:id",
    async ({ params, body, request, set }) => {
      const serverConfigs = getServerConfigs();
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

      // Get appropriate adapter for this client
      const adapter = getAdapter(request);
      
      // Get or generate session ID
      let sessionId = adapter.getSessionId(request);
      if (!sessionId) {
        sessionId = crypto.randomUUID();
      }

      // Build user context from API key creator
      const userContext: McpUserContext = {
        userId: authResult.userId || "anonymous",
        userName: authResult.userName || "Anonymous(MCP)",
      };

      // Transform request body if adapter requires
      let jsonBody = body as JsonRpcRequest;
      if (adapter.transformRequest) {
        jsonBody = adapter.transformRequest(jsonBody);
      }

      try {
        const sessions = getSessions();
        let existingSession = sessions.get(sessionId);
        
        // Check if adapter requires reinitialization
        if (adapter.shouldReinitialize?.(request, existingSession)) {
          if (existingSession) {
            console.log(`[MCP:${adapter.name}] Reinitializing session: ${sessionId}`);
            await closeSession(sessionId);
          }
          // Generate new session ID for fresh start
          sessionId = crypto.randomUUID();
          console.log(`[MCP:${adapter.name}] Created new session ID: ${sessionId}`);
        }

        const session = await getOrCreateSession(params.id, sessionId, userContext);
        
        // Set session ID header using adapter
        const responseHeaders: Record<string, string> = {};
        adapter.setSessionId(responseHeaders, sessionId);
        Object.assign(set.headers, responseHeaders);

        // Send request through transport and wait for response
        const response = await new Promise<JsonRpcResponse>((resolve) => {
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

        // Transform response if adapter requires
        if (adapter.transformResponse) {
          return adapter.transformResponse(response);
        }
        return response;
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
      const adapter = getAdapter(request);
      const sessionId = adapter.getSessionId(request);
      if (sessionId) {
        await closeSession(sessionId);
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
      const serverConfigs = getServerConfigs();
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

/**
 * Initialize MCP plugin - load servers from database
 */
export async function initializeMcpServers(): Promise<void> {
  const servers = await db.select().from(mcpServer);
  console.log(`[MCP] Found ${servers.length} MCP servers in database`);

  for (const server of servers) {
    registerServerConfig({
      id: server.id,
      name: server.name,
      description: server.description,
      isPublic: server.isPublic,
      actions: server.actions,
    });
    console.log(`[MCP] Registered server: ${server.name} with ${server.actions.length} tools`);
  }

  // Start session cleanup
  startSessionCleanup();
}
