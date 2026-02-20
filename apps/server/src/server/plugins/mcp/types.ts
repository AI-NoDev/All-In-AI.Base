import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { z } from "zod/v4";

// MCP SDK uses Zod v3 internally, we need to cast our Zod v4 types
export type ZodRawShapeCompat = Record<string, z.ZodTypeAny>;

/**
 * MCP Server configuration from database
 */
export interface McpServerConfig {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  actions: string[];
}

/**
 * User context for MCP session
 */
export interface McpUserContext {
  userId: string;
  userName: string;
}

/**
 * MCP Session with server and transports
 */
export interface McpSession {
  server: McpServer;
  clientTransport: InstanceType<typeof InMemoryTransport>;
  serverTransport: InstanceType<typeof InMemoryTransport>;
  lastActivity: number;
  userContext: McpUserContext;
}

/**
 * API Key verification result with user info
 */
export interface ApiKeyVerifyResult {
  valid: boolean;
  error?: string;
  apiKeyId?: string;
  userId?: string;
  userName?: string;
}

/**
 * JSON-RPC Request
 */
export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

/**
 * JSON-RPC Response
 */
export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

/**
 * MCP Adapter interface for different clients (Kiro, Coze, etc.)
 */
export interface McpAdapter {
  name: string;
  /**
   * Detect if this adapter should handle the request
   */
  detect(request: Request): boolean;
  /**
   * Extract session ID from request
   */
  getSessionId(request: Request): string | null;
  /**
   * Set session ID in response headers
   */
  setSessionId(headers: Record<string, string>, sessionId: string): void;
  /**
   * Transform request body if needed
   */
  transformRequest?(body: JsonRpcRequest): JsonRpcRequest;
  /**
   * Transform response if needed
   */
  transformResponse?(response: JsonRpcResponse): JsonRpcResponse;
  /**
   * Handle session initialization (for stateless clients like Coze)
   */
  shouldReinitialize?(request: Request, session: McpSession | undefined): boolean;
}
