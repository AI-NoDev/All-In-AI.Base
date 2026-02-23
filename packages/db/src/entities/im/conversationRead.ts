import { sql } from "drizzle-orm";
import { pgTable, uuid, bigint, timestamp, integer, primaryKey, index } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_im_conversationRead_meta_displayName" as meta_displayName,
  "db_im_conversationRead_meta_verboseName" as meta_verboseName,
  "db_im_conversationRead_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_im_conversationRead_conversationId" as f_conversationId,
  "db_im_conversationRead_userId" as f_userId,
  "db_im_conversationRead_lastReadSeq" as f_lastReadSeq,
  "db_im_conversationRead_lastReadAt" as f_lastReadAt,
  "db_im_conversationRead_unreadCount" as f_unreadCount,
} from '@qiyu-allinai/i18n';

// ============ Fields ============
const conversationReadFields = {
  conversationId: {
    field: uuid("conversation_id").notNull(),
    comment: f_conversationId,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_conversationId, cellType: "STRING" as const }
  },
  userId: {
    field: uuid("user_id").notNull(),
    comment: f_userId,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_userId, cellType: "STRING" as const }
  },
  lastReadSeq: {
    field: bigint("last_read_seq", { mode: "number" }).notNull().default(0),
    comment: f_lastReadSeq,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_lastReadSeq, cellType: "NUMERIC" as const }
  },
  lastReadAt: {
    field: timestamp("last_read_at", { mode: 'string' }).notNull().default(sql`now()`),
    comment: f_lastReadAt,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_lastReadAt, cellType: "STRING" as const }
  },
  unreadCount: {
    field: integer("unread_count").notNull().default(0),
    comment: f_unreadCount,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_unreadCount, cellType: "NUMERIC" as const }
  },
} satisfies FieldMap;

export { conversationReadFields };

// ============ Meta ============
export const conversationReadMeta: EntityMeta = {
  name: 'im_conversation_read',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('im_conversation_read'),
};

// ============ Table ============
export const conversationRead = pgTable(
  conversationReadMeta.name, 
  getTableFields(conversationReadFields),
  (table) => [
    primaryKey({ columns: [table.conversationId, table.userId] }),
    index("idx_im_conversation_read_user").on(table.userId),
  ]
);

// ============ Config ============
export const conversationReadConfig = getFieldConfigs(conversationReadFields);

// ============ Schemas ============
export const conversationReadSchemas = createTypeboxSchemas(conversationRead);

// ============ Types ============
export type ConversationReadSelect = typeof conversationRead.$inferSelect;
export type ConversationReadInsert = typeof conversationRead.$inferInsert;
