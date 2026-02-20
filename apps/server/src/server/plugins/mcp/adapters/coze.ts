import type { McpAdapter, JsonRpcRequest, JsonRpcResponse, McpSession } from "../types";

/**
 * Coze MCP adapter
 * 
 * Coze has different session handling requirements:
 * - May not persist session IDs between requests properly
 * - Needs stateless mode support or very short session timeout
 * - Returns error 702090704 when session is terminated (404)
 * 
 * According to MCP spec:
 * - When client receives HTTP 404 with session ID, it MUST start new session
 * - Server MAY terminate session at any time, responding with 404
 * 
 * Solution: For Coze, we operate in "stateless-like" mode:
 * - Each initialize request gets a fresh session
 * - Very short session timeout (2 minutes)
 * - Always accept requests without session ID for initialize
 */
export const cozeAdapter: McpAdapter = {
  name: "coze",

  detect(request: Request): boolean {
    const userAgent = request.headers.get("user-agent") || "";
    const cozeHeader = request.headers.get("x-coze-client");
    const origin = request.headers.get("origin") || "";
    const referer = request.headers.get("referer") || "";
    
    // Detect Coze client by various indicators
    const isCoze = (
      userAgent.toLowerCase().includes("coze") ||
      cozeHeader !== null ||
      userAgent.includes("ByteDance") ||
      userAgent.includes("Lark") ||
      origin.includes("coze.") ||
      origin.includes("coze.cn") ||
      referer.includes("coze.") ||
      referer.includes("coze.cn")
    );
    
    if (isCoze) {
      console.log(`[MCP:Coze] Detected Coze client - UA: ${userAgent.substring(0, 100)}`);
    }
    
    return isCoze;
  },

  getSessionId(request: Request): string | null {
    // Coze may use different header names (case-insensitive check)
    const headers = request.headers;
    return (
      headers.get("mcp-session-id") ||
      headers.get("Mcp-Session-Id") ||
      headers.get("x-mcp-session-id") ||
      headers.get("x-coze-session-id")
    );
  },

  setSessionId(headers: Record<string, string>, sessionId: string): void {
    // Set the standard MCP header
    headers["Mcp-Session-Id"] = sessionId;
    // Also set lowercase version for compatibility
    headers["mcp-session-id"] = sessionId;
    // Expose headers for CORS
    headers["Access-Control-Expose-Headers"] = "Mcp-Session-Id, mcp-session-id";
  },

  transformRequest(body: JsonRpcRequest): JsonRpcRequest {
    // Log the request method for debugging
    console.log(`[MCP:Coze] Request: method=${body.method}, id=${body.id}`);
    return body;
  },

  transformResponse(response: JsonRpcResponse): JsonRpcResponse {
    // Log errors for debugging
    if (response.error) {
      console.log(`[MCP:Coze] Response error: code=${response.error.code}, message=${response.error.message}`);
    }
    return response;
  },

  shouldReinitialize(request: Request, session: McpSession | undefined): boolean {
    // For Coze, we need to be more aggressive about reinitialization
    
    // 1. No existing session - always initialize
    if (!session) {
      console.log(`[MCP:Coze] No session found, will initialize new session`);
      return true;
    }
    
    // 2. Check for explicit reinit header
    const reinitHeader = request.headers.get("x-coze-reinit");
    if (reinitHeader === "true") {
      console.log(`[MCP:Coze] Reinit header set, will reinitialize`);
      return true;
    }
    
    // 3. Very short session timeout for Coze (2 minutes)
    // This helps avoid the "session terminated" error
    const cozeTimeout = 2 * 60 * 1000; // 2 minutes
    const sessionAge = Date.now() - session.lastActivity;
    
    if (sessionAge > cozeTimeout) {
      console.log(`[MCP:Coze] Session expired (${Math.round(sessionAge / 1000)}s old), will reinitialize`);
      return true;
    }
    
    // 4. Update last activity to keep session alive
    session.lastActivity = Date.now();
    
    return false;
  },
};

/**
 * Coze Stateless adapter - for completely stateless operation
 * Use this if the regular Coze adapter still has issues
 * 
 * In stateless mode:
 * - Every request creates a new session
 * - No session ID is tracked
 * - Higher overhead but guaranteed to work
 */
export const cozeStatelessAdapter: McpAdapter = {
  name: "coze-stateless",

  detect(request: Request): boolean {
    // Only use if explicitly requested via header
    const statelessHeader = request.headers.get("x-coze-stateless");
    return statelessHeader === "true";
  },

  getSessionId(_request: Request): string | null {
    // Always return null to force new session
    return null;
  },

  setSessionId(headers: Record<string, string>, sessionId: string): void {
    // Still set the header for protocol compliance
    headers["Mcp-Session-Id"] = sessionId;
    headers["mcp-session-id"] = sessionId;
    headers["Access-Control-Expose-Headers"] = "Mcp-Session-Id, mcp-session-id";
  },

  shouldReinitialize(_request: Request, _session: McpSession | undefined): boolean {
    // Always reinitialize in stateless mode
    return true;
  },
};
