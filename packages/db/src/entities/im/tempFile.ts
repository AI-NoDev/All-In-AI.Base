import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, bigint, timestamp, char, jsonb, index } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tIm, tImMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tIm('tempFile', field);

// ============ Fields ============
const tempFileOwnFields = {
  conversationId: {
    field: uuid("conversation_id"),
    comment: f('conversationId'),
    config: { canExport: false, canImport: false }
  },
  messageId: {
    field: uuid("message_id"),
    comment: f('messageId'),
    config: { canExport: false, canImport: false }
  },
  name: {
    field: varchar("name", { length: 255 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  originalName: {
    field: varchar("original_name", { length: 255 }).notNull(),
    comment: f('originalName'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('originalName'), cellType: "STRING" as const }
  },
  extension: {
    field: varchar("extension", { length: 32 }),
    comment: f('extension'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('extension'), cellType: "STRING" as const }
  },
  mimeType: {
    field: varchar("mime_type", { length: 128 }),
    comment: f('mimeType'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('mimeType'), cellType: "STRING" as const }
  },
  size: {
    field: bigint("size", { mode: "number" }).notNull().default(0),
    comment: f('size'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('size'), cellType: "NUMERIC" as const }
  },
  storageKey: {
    field: varchar("storage_key", { length: 512 }).notNull(),
    comment: f('storageKey'),
    config: { canExport: false, canImport: false }
  },
  bucket: {
    field: varchar("bucket", { length: 128 }).notNull(),
    comment: f('bucket'),
    config: { canExport: false, canImport: false }
  },
  region: {
    field: varchar("region", { length: 64 }),
    comment: f('region'),
    config: { canExport: false, canImport: false }
  },
  etag: {
    field: varchar("etag", { length: 128 }),
    comment: f('etag'),
    config: { canExport: false, canImport: false }
  },
  expiresAt: {
    field: timestamp("expires_at", { mode: 'string' }),
    comment: f('expiresAt'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('expiresAt'), cellType: "STRING" as const }
  },
  metadata: {
    field: jsonb("metadata").$type<Record<string, string>>().default({}),
    comment: f('metadata'),
    config: { canExport: false, canImport: false }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('status'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const tempFileFields = mergeFields(pkSchema, auditSchema, tempFileOwnFields);

// ============ Meta ============
export const tempFileMeta: EntityMeta = {
  name: 'im_temp_file',
  displayName: tImMeta('tempFile', 'displayName'),
  verboseName: tImMeta('tempFile', 'verboseName'),
  verboseNamePlural: tImMeta('tempFile', 'verboseNamePlural'),
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
export const tempFileZodSchemas = createZodSchemas(tempFile, tempFileFields);
