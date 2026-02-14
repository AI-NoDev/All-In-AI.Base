import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, bigint, timestamp, boolean, char, jsonb, index } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_im_message_meta_displayName" as meta_displayName,
  "db_im_message_meta_verboseName" as meta_verboseName,
  "db_im_message_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_im_message_conversationId" as f_conversationId,
  "db_im_message_msgSeq" as f_msgSeq,
  "db_im_message_senderId" as f_senderId,
  "db_im_message_msgType" as f_msgType,
  "db_im_message_content" as f_content,
  "db_im_message_replyToId" as f_replyToId,
  "db_im_message_forwardFromId" as f_forwardFromId,
  "db_im_message_atUserIds" as f_atUserIds,
  "db_im_message_isRecalled" as f_isRecalled,
  "db_im_message_recalledAt" as f_recalledAt,
  "db_im_message_recalledById" as f_recalledById,
  "db_im_message_extra" as f_extra,
} from '@qiyu-allinai/i18n';
import { randomUUID } from "crypto";
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

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
    comment: f_conversationId,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_conversationId, cellType: "STRING" as const }
  },
  msgSeq: {
    field: bigint("msg_seq", { mode: "number" }).notNull(),
    comment: f_msgSeq,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_msgSeq, cellType: "NUMERIC" as const }
  },
  senderId: {
    field: uuid("sender_id").notNull(),
    comment: f_senderId,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_senderId, cellType: "STRING" as const }
  },
  msgType: {
    field: char("msg_type", { length: 2 }).notNull().default("01"),
    comment: f_msgType,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_msgType, cellType: "STRING" as const }
  },
  content: {
    field: jsonb("content").$type<MessageContent>().notNull(),
    comment: f_content,
    config: { canExport: false, canImport: false }
  },
  replyToId: {
    field: uuid("reply_to_id"),
    comment: f_replyToId,
    config: { canExport: false, canImport: false }
  },
  forwardFromId: {
    field: uuid("forward_from_id"),
    comment: f_forwardFromId,
    config: { canExport: false, canImport: false }
  },
  atUserIds: {
    field: jsonb("at_user_ids").$type<string[]>().default([]),
    comment: f_atUserIds,
    config: { canExport: false, canImport: false }
  },
  isRecalled: {
    field: boolean("is_recalled").notNull().default(false),
    comment: f_isRecalled,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_isRecalled, cellType: "STRING" as const }
  },
  recalledAt: {
    field: timestamp("recalled_at", { mode: 'string' }),
    comment: f_recalledAt,
    config: { canExport: false, canImport: false }
  },
  recalledById: {
    field: uuid("recalled_by_id"),
    comment: f_recalledById,
    config: { canExport: false, canImport: false }
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

export { messageFields };

// ============ Meta ============
export const messageMeta: EntityMeta = {
  name: 'im_message',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
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
    atUserIds: z.array(z.string()).describe(messageFields.atUserIds.comment()),
  }),
  select: createSelectZodSchema(message, {
    ...describeRefinements,
    atUserIds: z.array(z.string()).nullable().describe(messageFields.atUserIds.comment()),
  }),
  update: createUpdateZodSchema(message, {
    ...describeRefinements,
    atUserIds: z.array(z.string()).optional().describe(messageFields.atUserIds.comment()),
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
