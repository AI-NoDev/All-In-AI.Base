/**
 * 通知已读记录实体
 */

import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, createPermissions, createTypeboxSchemas,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_noticeRead_meta_displayName,
  db_system_noticeRead_meta_verboseName,
  db_system_noticeRead_meta_verboseNamePlural,
  db_system_noticeRead_noticeId,
  db_system_noticeRead_userId,
  db_system_noticeRead_readAt,
} from '@qiyu-allinai/i18n';

// ============ Fields ============
const noticeReadOwnFields = {
  noticeId: {
    field: uuid("notice_id").notNull(),
    comment: db_system_noticeRead_noticeId,
    config: { canExport: true, canImport: true }
  },
  userId: {
    field: uuid("user_id").notNull(),
    comment: db_system_noticeRead_userId,
    config: { canExport: true, canImport: true }
  },
  readAt: {
    field: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
    comment: db_system_noticeRead_readAt,
    config: { canExport: true, canImport: false }
  },
} satisfies FieldMap;

export const noticeReadFields = noticeReadOwnFields;

// ============ Meta ============
export const noticeReadMeta: EntityMeta = {
  name: 'system_notice_read',
  displayName: db_system_noticeRead_meta_displayName,
  verboseName: db_system_noticeRead_meta_verboseName,
  verboseNamePlural: db_system_noticeRead_meta_verboseNamePlural,
  permissions: createPermissions('system_notice_read'),
};

// ============ Table ============
export const noticeRead = pgTable(noticeReadMeta.name, getTableFields(noticeReadFields), (table) => [
  primaryKey({ columns: [table.noticeId, table.userId] }),
]);

// ============ Config ============
export const noticeReadConfig = getFieldConfigs(noticeReadFields);

// ============ Schemas (TypeBox) ============
export const noticeReadSchemas = createTypeboxSchemas(noticeRead);

// ============ Types (从 Drizzle 推导) ============
export type NoticeReadSelect = typeof noticeRead.$inferSelect;
export type NoticeReadInsert = typeof noticeRead.$inferInsert;
