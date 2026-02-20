import type { McpAdapter, JsonRpcRequest, JsonRpcResponse, McpSession } from "../types";

/**
 * Default MCP adapter for standard clients (Kiro, Cursor, etc.)
 * Uses session-based approach with mcp-session-id header
 */
export const defaultAdapter: McpAdapter = {
  name: "default",

  detect(_request: Request): boolean {
    // Default adapter is the fallback, always returns false
    // It will be used when no other adapter matches
    return false;
  },

  getSessionId(request: Request): string | null {
    return request.headers.get("mcp-session-id");
  },

  setSessionId(headers: Record<string, string>, sessionId: string): void {
    headers["mcp-session-id"] = sessionId;
  },

  shouldReinitialize(_request: Request, _session: McpSession | undefined): boolean {
    // Default adapter doesn't need reinitialization
    return false;
  },
};
