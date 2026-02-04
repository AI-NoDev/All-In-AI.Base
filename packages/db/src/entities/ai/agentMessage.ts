import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, bigint, integer, timestamp, char, jsonb, index } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tAi, tAiMeta } from '../../i18n';
import { randomUUID } from "crypto";

const f = (field: string) => tAi('agentMessage', field);

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
export type TextMessageContent = { type: 'text'; text: string };
export type ImageMessageContent = { type: 'image'; url: string; alt?: string };
export type FileMessageContent = { type: 'file'; fileId: string; name: string; mimeType?: string };
export type AgentMessageContent = TextMessageContent | ImageMessageContent | FileMessageContent | Array<TextMessageContent | ImageMessageContent | FileMessageContent>;

// ============ Fields ============
// Agent message table is append-only
const agentMessageFields = {
  id: {
    field: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
    comment: () => 'ID',
    config: { canExport: true, canImport: false, cellType: "STRING" as const }
  },
  sessionId: {
    field: uuid("session_id").notNull(),
    comment: f('sessionId'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('sessionId'), cellType: "STRING" as const }
  },
  msgSeq: {
    field: bigint("msg_seq", { mode: "number" }).notNull(),
    comment: f('msgSeq'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('msgSeq'), cellType: "NUMERIC" as const }
  },
  role: {
    field: varchar("role", { length: 16 }).notNull(),
    comment: f('role'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('role'), cellType: "STRING" as const }
  },
  content: {
    field: jsonb("content").$type<AgentMessageContent>(),
    comment: f('content'),
    config: { canExport: false, canImport: false }
  },
  contentType: {
    field: char("content_type", { length: 2 }).notNull().default("01"),
    comment: f('contentType'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('contentType'), cellType: "STRING" as const }
  },
  toolCalls: {
    field: jsonb("tool_calls").$type<ToolCall[]>(),
    comment: f('toolCalls'),
    config: { canExport: false, canImport: false }
  },
  toolResults: {
    field: jsonb("tool_results").$type<ToolResult[]>(),
    comment: f('toolResults'),
    config: { canExport: false, canImport: false }
  },
  tokenCount: {
    field: integer("token_count").default(0),
    comment: f('tokenCount'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('tokenCount'), cellType: "NUMERIC" as const }
  },
  modelId: {
    field: uuid("model_id"),
    comment: f('modelId'),
    config: { canExport: false, canImport: false }
  },
  latencyMs: {
    field: integer("latency_ms"),
    comment: f('latencyMs'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('latencyMs'), cellType: "NUMERIC" as const }
  },
  finishReason: {
    field: varchar("finish_reason", { length: 32 }),
    comment: f('finishReason'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('finishReason'), cellType: "STRING" as const }
  },
  extra: {
    field: jsonb("extra").$type<Record<string, unknown>>().default({}),
    comment: f('extra'),
    config: { canExport: false, canImport: false }
  },
  createdAt: {
    field: timestamp('created_at', { mode: 'string' }).notNull().default(sql`now()`),
    comment: () => 'Created At',
    config: { canExport: true, canImport: false, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export { agentMessageFields };

// ============ Meta ============
export const agentMessageMeta: EntityMeta = {
  name: 'ai_agent_message',
  displayName: tAiMeta('agentMessage', 'displayName'),
  verboseName: tAiMeta('agentMessage', 'verboseName'),
  verboseNamePlural: tAiMeta('agentMessage', 'verboseNamePlural'),
  permissions: createPermissions('ai_agent_message'),
};

// ============ Table ============
export const agentMessage = pgTable(
  agentMessageMeta.name, 
  getTableFields(agentMessageFields),
  (table) => [
    index("idx_ai_agent_message_session_seq").on(table.sessionId, table.msgSeq),
    index("idx_ai_agent_message_created_at").on(table.createdAt),
  ]
);

// ============ Config ============
export const agentMessageConfig = getFieldConfigs(agentMessageFields);

// ============ Schemas ============
export const agentMessageZodSchemas = createZodSchemas(agentMessage, agentMessageFields);

// ============ Role Constants ============
export const AGENT_MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  TOOL: 'tool',
} as const;

// ============ Content Type Constants ============
export const AGENT_MESSAGE_CONTENT_TYPES = {
  TEXT: '01',
  IMAGE: '02',
  FILE: '03',
  MIXED: '04',
} as const;
