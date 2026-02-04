import { pgTable, uuid, varchar, text, integer, bigint, char, jsonb, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tKnowledge, tKnowledgeMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

const f = (field: string) => tKnowledge('file', field);

// ============ Fields ============
const fileOwnFields = {
  folderId: {
    field: uuid("folder_id"),
    comment: f('folderId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('folderId'), cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 255 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
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
  versionId: {
    field: varchar("version_id", { length: 128 }),
    comment: f('versionId'),
    config: { canExport: false, canImport: false }
  },
  storageClass: {
    field: varchar("storage_class", { length: 32 }).default('STANDARD'),
    comment: f('storageClass'),
    config: { canExport: false, canImport: false }
  },
  metadata: {
    field: jsonb("metadata").$type<Record<string, string>>().default({}),
    comment: f('metadata'),
    config: { canExport: false, canImport: false }
  },
  tags: {
    field: jsonb("tags").$type<string[]>().default([]),
    comment: f('tags'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('tags'), importExcelColumnName: f('tags'), cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: f('description'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('description'), importExcelColumnName: f('description'), cellType: "TEXT" as const }
  },
  processStatus: {
    field: char("process_status", { length: 1 }).default("0"),
    comment: f('processStatus'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('processStatus'), cellType: "STRING" as const }
  },
  processResult: {
    field: jsonb("process_result").$type<{
      vectorized?: boolean;
      chunks?: number;
      error?: string;
    }>(),
    comment: f('processResult'),
    config: { canExport: false, canImport: false }
  },
  downloadCount: {
    field: integer("download_count").notNull().default(0),
    comment: f('downloadCount'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('downloadCount'), cellType: "NUMERIC" as const }
  },
  versionCount: {
    field: integer("version_count").notNull().default(0),
    comment: f('versionCount'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('versionCount'), cellType: "NUMERIC" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
  isPublic: {
    field: boolean("is_public").notNull().default(false),
    comment: f('isPublic'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isPublic'), importExcelColumnName: f('isPublic'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const fileFields = mergeFields(pkSchema, auditSchema, deletedSchema, fileOwnFields);

// ============ Meta ============
export const fileMeta: EntityMeta = {
  name: 'knowledge_file',
  displayName: tKnowledgeMeta('file', 'displayName'),
  verboseName: tKnowledgeMeta('file', 'verboseName'),
  verboseNamePlural: tKnowledgeMeta('file', 'verboseNamePlural'),
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
