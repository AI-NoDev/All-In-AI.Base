import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, bigint, integer, timestamp, char, jsonb, index } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_ai_aiSessionMessage_meta_displayName" as meta_displayName,
  "db_ai_aiSessionMessage_meta_verboseName" as meta_verboseName,
  "db_ai_aiSessionMessage_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_ai_aiSessionMessage_sessionId" as f_sessionId,
  "db_ai_aiSessionMessage_msgSeq" as f_msgSeq,
  "db_ai_aiSessionMessage_role" as f_role,
  "db_ai_aiSessionMessage_content" as f_content,
  "db_ai_aiSessionMessage_contentType" as f_contentType,
  "db_ai_aiSessionMessage_toolCalls" as f_toolCalls,
  "db_ai_aiSessionMessage_toolResults" as f_toolResults,
  "db_ai_aiSessionMessage_tokenCount" as f_tokenCount,
  "db_ai_aiSessionMessage_latencyMs" as f_latencyMs,
  "db_ai_aiSessionMessage_finishReason" as f_finishReason,
  "db_ai_aiSessionMessage_extra" as f_extra,
} from '@qiyu-allinai/i18n';
import { randomUUID } from "crypto";

// Tool call type
export type ToolCall = {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
};

// Tool result type
export type ToolResult = {
  callId: string;
  name: string;
  result: unknown;
  error?: string;
};

// Message content types
export type TextMessageContent = { type: 'text'; text: string; reasoning?: string };
export type ImageMessageContent = { type: 'image'; url: string; alt?: string };
export type FileMessageContent = { type: 'file'; fileId: string; name: string; mimeType?: string };
export type AISessionMessageContent = TextMessageContent | ImageMessageContent | FileMessageContent | Array<TextMessageContent | ImageMessageContent | FileMessageContent>;

// Token usage type (matches AI SDK LanguageModelUsage)
export type TokenUsage = {
  totalTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
  inputTokenDetails?: {
    noCacheTokens?: number;
    cacheReadTokens?: number;
    cacheWriteTokens?: number;
  };
  outputTokenDetails?: {
    textTokens?: number;
    reasoningTokens?: number;
  };
};

// ============ Fields ============
// AI session message table is append-only
const aiSessionMessageFields = {
  id: {
    field: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
    comment: () => 'ID',
    config: { canExport: true, canImport: false, cellType: "STRING" as const }
  },
  sessionId: {
    field: uuid("session_id").notNull(),
    comment: f_sessionId,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_sessionId, cellType: "STRING" as const }
  },
  msgSeq: {
    field: bigint("msg_seq", { mode: "number" }).notNull(),
    comment: f_msgSeq,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_msgSeq, cellType: "NUMERIC" as const }
  },
  role: {
    field: varchar("role", { length: 16 }).notNull(),
    comment: f_role,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_role, cellType: "STRING" as const }
  },
  content: {
    field: jsonb("content").$type<AISessionMessageContent>(),
    comment: f_content,
    config: { canExport: false, canImport: false }
  },
  contentType: {
    field: char("content_type", { length: 2 }).notNull().default("01"),
    comment: f_contentType,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_contentType, cellType: "STRING" as const }
  },
  toolCalls: {
    field: jsonb("tool_calls").$type<ToolCall[]>(),
    comment: f_toolCalls,
    config: { canExport: false, canImport: false }
  },
  toolResults: {
    field: jsonb("tool_results").$type<ToolResult[]>(),
    comment: f_toolResults,
    config: { canExport: false, canImport: false }
  },
  tokenUsage: {
    field: jsonb("token_usage").$type<TokenUsage>(),
    comment: f_tokenCount,
    config: { canExport: false, canImport: false }
  },
  latencyMs: {
    field: integer("latency_ms"),
    comment: f_latencyMs,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_latencyMs, cellType: "NUMERIC" as const }
  },
  finishReason: {
    field: varchar("finish_reason", { length: 32 }),
    comment: f_finishReason,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_finishReason, cellType: "STRING" as const }
  },
  extra: {
    field: jsonb("extra").$type<Record<string, unknown>>().default({}),
    comment: f_extra,
    config: { canExport: false, canImport: false }
  },
  createdAt: {
    field: timestamp('created_at', { mode: 'string' }).notNull().default(sql`now()`),
    comment: () => 'Created At',
    config: { canExport: true, canImport: false, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export { aiSessionMessageFields };

// ============ Meta ============
export const aiSessionMessageMeta: EntityMeta = {
  name: 'ai_session_message',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_session_message'),
};

// ============ Table ============
export const aiSessionMessage = pgTable(
  aiSessionMessageMeta.name, 
  getTableFields(aiSessionMessageFields),
  (table) => [
    index("idx_ai_session_message_session_seq").on(table.sessionId, table.msgSeq),
    index("idx_ai_session_message_created_at").on(table.createdAt),
  ]
);

// ============ Config ============
export const aiSessionMessageConfig = getFieldConfigs(aiSessionMessageFields);

// ============ Schemas ============
export const aiSessionMessageZodSchemas = createZodSchemas(aiSessionMessage, aiSessionMessageFields);

// ============ Role Constants ============
export const AI_SESSION_MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  TOOL: 'tool',
} as const;

// ============ Content Type Constants ============
export const AI_SESSION_MESSAGE_CONTENT_TYPES = {
  TEXT: '01',
  IMAGE: '02',
  FILE: '03',
  MIXED: '04',
} as const;
