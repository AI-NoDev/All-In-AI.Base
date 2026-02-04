import { pgTable, uuid, varchar, text, integer, timestamp, boolean, char, jsonb, index } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tAi, tAiMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

const f = (field: string) => tAi('agentSession', field);

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
    comment: f('agentId'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('agentId'), cellType: "STRING" as const }
  },
  userId: {
    field: uuid("user_id").notNull(),
    comment: f('userId'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('userId'), cellType: "STRING" as const }
  },
  title: {
    field: varchar("title", { length: 255 }),
    comment: f('title'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('title'), cellType: "STRING" as const }
  },
  summary: {
    field: text("summary"),
    comment: f('summary'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('summary'), cellType: "TEXT" as const }
  },
  messageCount: {
    field: integer("message_count").notNull().default(0),
    comment: f('messageCount'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('messageCount'), cellType: "NUMERIC" as const }
  },
  tokenUsage: {
    field: jsonb("token_usage").$type<TokenUsage>().default({ promptTokens: 0, completionTokens: 0, totalTokens: 0 }),
    comment: f('tokenUsage'),
    config: { canExport: false, canImport: false }
  },
  lastMessageAt: {
    field: timestamp("last_message_at", { mode: 'string' }),
    comment: f('lastMessageAt'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('lastMessageAt'), cellType: "STRING" as const }
  },
  isArchived: {
    field: boolean("is_archived").notNull().default(false),
    comment: f('isArchived'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('isArchived'), cellType: "STRING" as const }
  },
  isPinned: {
    field: boolean("is_pinned").notNull().default(false),
    comment: f('isPinned'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('isPinned'), cellType: "STRING" as const }
  },
  extra: {
    field: jsonb("extra").$type<Record<string, unknown>>().default({}),
    comment: f('extra'),
    config: { canExport: false, canImport: false }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('status'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const agentSessionFields = mergeFields(pkSchema, auditSchema, deletedSchema, agentSessionOwnFields);

// ============ Meta ============
export const agentSessionMeta: EntityMeta = {
  name: 'ai_agent_session',
  displayName: tAiMeta('agentSession', 'displayName'),
  verboseName: tAiMeta('agentSession', 'verboseName'),
  verboseNamePlural: tAiMeta('agentSession', 'verboseNamePlural'),
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
