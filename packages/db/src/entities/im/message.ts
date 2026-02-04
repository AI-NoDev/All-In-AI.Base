import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, bigint, timestamp, boolean, char, jsonb, index } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tIm, tImMeta } from '../../i18n';
import { randomUUID } from "crypto";
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

const f = (field: string) => tIm('message', field);

// Message content types
export type TextContent = { text: string };
export type LinkContent = { url: string; title?: string; description?: string; thumbnail?: string };
export type ImageContent = { fileId: string; width?: number; height?: number; thumbnail?: string };
export type VideoContent = { fileId: string; duration?: number; width?: number; height?: number; thumbnail?: string };
export type AudioContent = { fileId: string; duration?: number };
export type FileContent = { fileId: string; name: string; size: number; mimeType?: string };
export type SystemContent = { action: string; params?: Record<string, unknown> };
export type RecallContent = { originalMsgSeq: number; recalledBy: string };

export type MessageContent = 
  | TextContent 
  | LinkContent 
  | ImageContent 
  | VideoContent 
  | AudioContent 
  | FileContent 
  | SystemContent 
  | RecallContent;

// ============ Fields ============
// Message table is append-only, no audit/deleted schemas
const messageFields = {
  id: {
    field: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
    comment: () => 'ID',
    config: { canExport: true, canImport: false, cellType: "STRING" as const }
  },
  conversationId: {
    field: uuid("conversation_id").notNull(),
    comment: f('conversationId'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('conversationId'), cellType: "STRING" as const }
  },
  msgSeq: {
    field: bigint("msg_seq", { mode: "number" }).notNull(),
    comment: f('msgSeq'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('msgSeq'), cellType: "NUMERIC" as const }
  },
  senderId: {
    field: uuid("sender_id").notNull(),
    comment: f('senderId'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('senderId'), cellType: "STRING" as const }
  },
  msgType: {
    field: char("msg_type", { length: 2 }).notNull().default("01"),
    comment: f('msgType'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('msgType'), cellType: "STRING" as const }
  },
  content: {
    field: jsonb("content").$type<MessageContent>().notNull(),
    comment: f('content'),
    config: { canExport: false, canImport: false }
  },
  replyToId: {
    field: uuid("reply_to_id"),
    comment: f('replyToId'),
    config: { canExport: false, canImport: false }
  },
  forwardFromId: {
    field: uuid("forward_from_id"),
    comment: f('forwardFromId'),
    config: { canExport: false, canImport: false }
  },
  atUserIds: {
    field: jsonb("at_user_ids").$type<string[]>().default([]),
    comment: f('atUserIds'),
    config: { canExport: false, canImport: false }
  },
  isRecalled: {
    field: boolean("is_recalled").notNull().default(false),
    comment: f('isRecalled'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('isRecalled'), cellType: "STRING" as const }
  },
  recalledAt: {
    field: timestamp("recalled_at", { mode: 'string' }),
    comment: f('recalledAt'),
    config: { canExport: false, canImport: false }
  },
  recalledById: {
    field: uuid("recalled_by_id"),
    comment: f('recalledById'),
    config: { canExport: false, canImport: false }
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

export { messageFields };

// ============ Meta ============
export const messageMeta: EntityMeta = {
  name: 'im_message',
  displayName: tImMeta('message', 'displayName'),
  verboseName: tImMeta('message', 'verboseName'),
  verboseNamePlural: tImMeta('message', 'verboseNamePlural'),
  permissions: createPermissions('im_message'),
};

// ============ Table ============
export const message = pgTable(
  messageMeta.name, 
  getTableFields(messageFields),
  (table) => [
    index("idx_im_message_conversation_seq").on(table.conversationId, table.msgSeq),
    index("idx_im_message_sender").on(table.senderId),
    index("idx_im_message_created_at").on(table.createdAt),
  ]
);

// ============ Config ============
export const messageConfig = getFieldConfigs(messageFields);

// ============ Schemas ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeRefinements = createDescribeRefinements(messageFields) as any;

export const messageZodSchemas = {
  insert: createInsertZodSchema(message, {
    ...describeRefinements,
    atUserIds: z.array(z.uuid()).describe(messageFields.atUserIds.comment()),
  }),
  select: createSelectZodSchema(message, {
    ...describeRefinements,
    atUserIds: z.array(z.uuid()).nullable().describe(messageFields.atUserIds.comment()),
  }),
  update: createUpdateZodSchema(message, {
    ...describeRefinements,
    atUserIds: z.array(z.uuid()).optional().describe(messageFields.atUserIds.comment()),
  }),
};

// ============ Message Type Constants ============
export const MESSAGE_TYPES = {
  TEXT: '01',
  LINK: '02',
  IMAGE: '03',
  VIDEO: '04',
  AUDIO: '05',
  FILE: '06',
  SYSTEM: '07',
  RECALL: '08',
} as const;
