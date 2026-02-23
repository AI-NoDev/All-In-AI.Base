import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, bigint, timestamp, char, jsonb, index } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_im_tempFile_meta_displayName" as meta_displayName,
  "db_im_tempFile_meta_verboseName" as meta_verboseName,
  "db_im_tempFile_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_im_tempFile_conversationId" as f_conversationId,
  "db_im_tempFile_messageId" as f_messageId,
  "db_im_tempFile_name" as f_name,
  "db_im_tempFile_originalName" as f_originalName,
  "db_im_tempFile_extension" as f_extension,
  "db_im_tempFile_mimeType" as f_mimeType,
  "db_im_tempFile_size" as f_size,
  "db_im_tempFile_storageKey" as f_storageKey,
  "db_im_tempFile_bucket" as f_bucket,
  "db_im_tempFile_region" as f_region,
  "db_im_tempFile_etag" as f_etag,
  "db_im_tempFile_expiresAt" as f_expiresAt,
  "db_im_tempFile_metadata" as f_metadata,
  "db_im_tempFile_status" as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const tempFileOwnFields = {
  conversationId: {
    field: uuid("conversation_id"),
    comment: f_conversationId,
    config: { canExport: false, canImport: false }
  },
  messageId: {
    field: uuid("message_id"),
    comment: f_messageId,
    config: { canExport: false, canImport: false }
  },
  name: {
    field: varchar("name", { length: 255 }).notNull(),
    comment: f_name,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_name, cellType: "STRING" as const }
  },
  originalName: {
    field: varchar("original_name", { length: 255 }).notNull(),
    comment: f_originalName,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_originalName, cellType: "STRING" as const }
  },
  extension: {
    field: varchar("extension", { length: 32 }),
    comment: f_extension,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_extension, cellType: "STRING" as const }
  },
  mimeType: {
    field: varchar("mime_type", { length: 128 }),
    comment: f_mimeType,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_mimeType, cellType: "STRING" as const }
  },
  size: {
    field: bigint("size", { mode: "number" }).notNull().default(0),
    comment: f_size,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_size, cellType: "NUMERIC" as const }
  },
  storageKey: {
    field: varchar("storage_key", { length: 512 }).notNull(),
    comment: f_storageKey,
    config: { canExport: false, canImport: false }
  },
  bucket: {
    field: varchar("bucket", { length: 128 }).notNull(),
    comment: f_bucket,
    config: { canExport: false, canImport: false }
  },
  region: {
    field: varchar("region", { length: 64 }),
    comment: f_region,
    config: { canExport: false, canImport: false }
  },
  etag: {
    field: varchar("etag", { length: 128 }),
    comment: f_etag,
    config: { canExport: false, canImport: false }
  },
  expiresAt: {
    field: timestamp("expires_at", { mode: 'string' }),
    comment: f_expiresAt,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_expiresAt, cellType: "STRING" as const }
  },
  metadata: {
    field: jsonb("metadata").$type<Record<string, string>>().default({}),
    comment: f_metadata,
    config: { canExport: false, canImport: false }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f_status,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_status, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const tempFileFields = mergeFields(pkSchema, auditSchema, tempFileOwnFields);

// ============ Meta ============
export const tempFileMeta: EntityMeta = {
  name: 'im_temp_file',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('im_temp_file'),
};

// ============ Table ============
export const tempFile = pgTable(
  tempFileMeta.name, 
  getTableFields(tempFileFields),
  (table) => [
    index("idx_im_temp_file_conversation").on(table.conversationId),
    index("idx_im_temp_file_message").on(table.messageId),
    index("idx_im_temp_file_expires").on(table.expiresAt),
  ]
);

// ============ Config ============
export const tempFileConfig = getFieldConfigs(tempFileFields);

// ============ Schemas ============
export const tempFileSchemas = createTypeboxSchemas(tempFile);

// ============ Types ============
export type TempFileSelect = typeof tempFile.$inferSelect;
export type TempFileInsert = typeof tempFile.$inferInsert;
