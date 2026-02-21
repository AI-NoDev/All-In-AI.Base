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
 * Solution: For Coze, we operate in fully stateless mode:
 * - Every request creates a fresh session
 * - No session persistence between requests
 * - This avoids all session termination issues
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

  getSessionId(_request: Request): string | null {
    // Always return null to force new session for each request
    // This is the key fix - Coze doesn't handle session persistence well
    return null;
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

  shouldReinitialize(_request: Request, _session: McpSession | undefined): boolean {
    // Always reinitialize for Coze - fully stateless mode
    // This completely avoids the "session terminated (404)" error
    return true;
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
