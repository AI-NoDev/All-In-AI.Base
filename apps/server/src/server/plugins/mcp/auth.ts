import { eq, and } from "drizzle-orm";
import db from "@qiyu-allinai/db/connect";
import { apiKey, apiKeyMcp } from "@qiyu-allinai/db/entities/ai";
import type { ApiKeyVerifyResult } from "./types";

/**
 * Verify API Key and check MCP access
 */
export async function verifyApiKey(
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

  // Update last used timestamp (fire and forget)
  db.update(apiKey)
    .set({ lastUsedAt: new Date().toISOString() })
    .where(eq(apiKey.id, apiKeyRecord.id))
    .catch(console.error);

  return { 
    valid: true, 
    apiKeyId: apiKeyRecord.id || undefined,
    userId: apiKeyRecord.createdById || undefined,
    userName: apiKeyRecord.createdBy ? `${apiKeyRecord.createdBy}(MCP)` : undefined,
  };
}
