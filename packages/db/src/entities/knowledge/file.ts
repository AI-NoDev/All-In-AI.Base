import { pgTable, uuid, varchar, text, integer, bigint, char, jsonb, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_knowledge_file_meta_displayName" as meta_displayName,
  "db_knowledge_file_meta_verboseName" as meta_verboseName,
  "db_knowledge_file_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_knowledge_file_folderId" as f_folderId,
  "db_knowledge_file_name" as f_name,
  "db_knowledge_file_originalName" as f_originalName,
  "db_knowledge_file_extension" as f_extension,
  "db_knowledge_file_mimeType" as f_mimeType,
  "db_knowledge_file_size" as f_size,
  "db_knowledge_file_storageKey" as f_storageKey,
  "db_knowledge_file_bucket" as f_bucket,
  "db_knowledge_file_region" as f_region,
  "db_knowledge_file_etag" as f_etag,
  "db_knowledge_file_versionId" as f_versionId,
  "db_knowledge_file_storageClass" as f_storageClass,
  "db_knowledge_file_metadata" as f_metadata,
  "db_knowledge_file_tags" as f_tags,
  "db_knowledge_file_description" as f_description,
  "db_knowledge_file_processStatus" as f_processStatus,
  "db_knowledge_file_processResult" as f_processResult,
  "db_knowledge_file_downloadCount" as f_downloadCount,
  "db_knowledge_file_status" as f_status,
  "db_knowledge_file_isPublic" as f_isPublic,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

// ============ Fields ============
const fileOwnFields = {
  folderId: {
    field: uuid("folder_id"),
    comment: f_folderId,
    config: { canExport: false, canImport: true, importExcelColumnName: f_folderId, cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 255 }).notNull(),
    comment: f_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_name, importExcelColumnName: f_name, cellType: "STRING" as const }
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
  versionId: {
    field: varchar("version_id", { length: 128 }),
    comment: f_versionId,
    config: { canExport: false, canImport: false }
  },
  storageClass: {
    field: varchar("storage_class", { length: 32 }).default('STANDARD'),
    comment: f_storageClass,
    config: { canExport: false, canImport: false }
  },
  metadata: {
    field: jsonb("metadata").$type<Record<string, string>>().default({}),
    comment: f_metadata,
    config: { canExport: false, canImport: false }
  },
  tags: {
    field: jsonb("tags").$type<string[]>().default([]),
    comment: f_tags,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_tags, importExcelColumnName: f_tags, cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: f_description,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_description, importExcelColumnName: f_description, cellType: "TEXT" as const }
  },
  processStatus: {
    field: char("process_status", { length: 1 }).default("0"),
    comment: f_processStatus,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_processStatus, cellType: "STRING" as const }
  },
  processResult: {
    field: jsonb("process_result").$type<{
      vectorized?: boolean;
      chunks?: number;
      error?: string;
    }>(),
    comment: f_processResult,
    config: { canExport: false, canImport: false }
  },
  downloadCount: {
    field: integer("download_count").notNull().default(0),
    comment: f_downloadCount,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_downloadCount, cellType: "NUMERIC" as const }
  },
  versionCount: {
    field: integer("version_count").notNull().default(0),
    comment: f_downloadCount,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_downloadCount, cellType: "NUMERIC" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_status, importExcelColumnName: f_status, cellType: "STRING" as const }
  },
  isPublic: {
    field: boolean("is_public").notNull().default(false),
    comment: f_isPublic,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_isPublic, importExcelColumnName: f_isPublic, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const fileFields = mergeFields(pkSchema, auditSchema, deletedSchema, fileOwnFields);

// ============ Meta ============
export const fileMeta: EntityMeta = {
  name: 'knowledge_file',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('knowledge_file'),
};

// ============ Table ============
export const file = pgTable(
  fileMeta.name, 
  getTableFields(fileFields),
  (table) => [
    // Unique constraint: file name must be unique per folder per owner
    uniqueIndex('file_owner_folder_name_unique_idx').on(table.createdById, table.folderId, table.name),
  ]
);

// ============ Config ============
export const fileConfig = getFieldConfigs(fileFields);

// ============ Schemas ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeRefinements = createDescribeRefinements(fileFields) as any;

export const fileZodSchemas = {
  insert: createInsertZodSchema(file, {
    ...describeRefinements,
    tags: z.array(z.string()).describe(fileFields.tags.comment()),
  }),
  select: createSelectZodSchema(file, {
    ...describeRefinements,
    tags: z.array(z.string()).nullable().describe(fileFields.tags.comment()),
  }),
  update: createUpdateZodSchema(file, {
    ...describeRefinements,
    tags: z.array(z.string()).optional().describe(fileFields.tags.comment()),
  }),
};
