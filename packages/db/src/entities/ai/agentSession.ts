import { pgTable, uuid, varchar, text, integer, timestamp, boolean, char, jsonb, index } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_ai_agentSession_meta_displayName" as meta_displayName,
  "db_ai_agentSession_meta_verboseName" as meta_verboseName,
  "db_ai_agentSession_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_ai_agentSession_agentId" as f_agentId,
  "db_ai_agentSession_userId" as f_userId,
  "db_ai_agentSession_title" as f_title,
  "db_ai_agentSession_summary" as f_summary,
  "db_ai_agentSession_messageCount" as f_messageCount,
  "db_ai_agentSession_tokenUsage" as f_tokenUsage,
  "db_ai_agentSession_lastMessageAt" as f_lastMessageAt,
  "db_ai_agentSession_isArchived" as f_isArchived,
  "db_ai_agentSession_isPinned" as f_isPinned,
  "db_ai_agentSession_extra" as f_extra,
  "db_ai_agentSession_status" as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

// Token usage type
export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

// ============ Fields ============
const agentSessionOwnFields = {
  agentId: {
    field: uuid("agent_id").notNull(),
    comment: f_agentId,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_agentId, cellType: "STRING" as const }
  },
  userId: {
    field: uuid("user_id").notNull(),
    comment: f_userId,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_userId, cellType: "STRING" as const }
  },
  title: {
    field: varchar("title", { length: 255 }),
    comment: f_title,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_title, cellType: "STRING" as const }
  },
  summary: {
    field: text("summary"),
    comment: f_summary,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_summary, cellType: "TEXT" as const }
  },
  messageCount: {
    field: integer("message_count").notNull().default(0),
    comment: f_messageCount,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_messageCount, cellType: "NUMERIC" as const }
  },
  tokenUsage: {
    field: jsonb("token_usage").$type<TokenUsage>().default({ promptTokens: 0, completionTokens: 0, totalTokens: 0 }),
    comment: f_tokenUsage,
    config: { canExport: false, canImport: false }
  },
  lastMessageAt: {
    field: timestamp("last_message_at", { mode: 'string' }),
    comment: f_lastMessageAt,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_lastMessageAt, cellType: "STRING" as const }
  },
  isArchived: {
    field: boolean("is_archived").notNull().default(false),
    comment: f_isArchived,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_isArchived, cellType: "STRING" as const }
  },
  isPinned: {
    field: boolean("is_pinned").notNull().default(false),
    comment: f_isPinned,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_isPinned, cellType: "STRING" as const }
  },
  extra: {
    field: jsonb("extra").$type<Record<string, unknown>>().default({}),
    comment: f_extra,
    config: { canExport: false, canImport: false }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f_status,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_status, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const agentSessionFields = mergeFields(pkSchema, auditSchema, deletedSchema, agentSessionOwnFields);

// ============ Meta ============
export const agentSessionMeta: EntityMeta = {
  name: 'ai_agent_session',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_agent_session'),
};

// ============ Table ============
export const agentSession = pgTable(
  agentSessionMeta.name, 
  getTableFields(agentSessionFields),
  (table) => [
    index("idx_ai_agent_session_agent").on(table.agentId),
    index("idx_ai_agent_session_user").on(table.userId),
    index("idx_ai_agent_session_last_message").on(table.lastMessageAt),
  ]
);

// ============ Config ============
export const agentSessionConfig = getFieldConfigs(agentSessionFields);

// ============ Schemas ============
export const agentSessionZodSchemas = createZodSchemas(agentSession, agentSessionFields);
