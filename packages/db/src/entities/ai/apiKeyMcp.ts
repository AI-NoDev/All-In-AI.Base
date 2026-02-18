import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { z } from 'zod';
import { 
  db_ai_apiKeyMcp_meta_displayName as meta_displayName,
  db_ai_apiKeyMcp_meta_verboseName as meta_verboseName,
  db_ai_apiKeyMcp_meta_verboseNamePlural as meta_verboseNamePlural,
  db_ai_apiKeyMcp_apiKeyId as f_apiKeyId,
  db_ai_apiKeyMcp_mcpServerId as f_mcpServerId,
} from '@qiyu-allinai/i18n';
import { createPermissions, type EntityMeta } from '../../utils/entity';

// ============ Table ============
// 多对多关联表：API Key <-> MCP Server
export const apiKeyMcp = pgTable('ai_api_key_mcp', {
  apiKeyId: uuid("api_key_id").notNull(),
  mcpServerId: uuid("mcp_server_id").notNull(),
}, (table) => [
  primaryKey({ columns: [table.apiKeyId, table.mcpServerId] }),
]);

// ============ Meta ============
export const apiKeyMcpMeta: EntityMeta = {
  name: 'ai_api_key_mcp',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_api_key_mcp'),
};

// ============ Schemas ============
export const apiKeyMcpZodSchemas = {
  select: z.object({
    apiKeyId: z.string().uuid(),
    mcpServerId: z.string().uuid(),
  }),
  insert: z.object({
    apiKeyId: z.string().uuid(),
    mcpServerId: z.string().uuid(),
  }),
};

// Field comments for documentation
export const apiKeyMcpFieldComments = {
  apiKeyId: f_apiKeyId,
  mcpServerId: f_mcpServerId,
};
