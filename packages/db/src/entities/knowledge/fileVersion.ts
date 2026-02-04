import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, bigint, timestamp, text } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tKnowledge, tKnowledgeMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';

const f = (field: string) => tKnowledge('fileVersion', field);

// ============ Fields ============
const fileVersionOwnFields = {
  fileId: {
    field: uuid("file_id").notNull(),
    comment: f('fileId'),
    config: { canExport: false, canImport: false }
  },
  versionNumber: {
    field: varchar("version_number", { length: 32 }).notNull(),
    comment: f('versionNumber'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('versionNumber'), cellType: "STRING" as const }
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
  s3VersionId: {
    field: varchar("s3_version_id", { length: 128 }),
    comment: f('s3VersionId'),
    config: { canExport: false, canImport: false }
  },
  etag: {
    field: varchar("etag", { length: 128 }),
    comment: f('etag'),
    config: { canExport: false, canImport: false }
  },
  size: {
    field: bigint("size", { mode: "number" }).notNull().default(0),
    comment: f('size'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('size'), cellType: "NUMERIC" as const }
  },
  changeLog: {
    field: text("change_log"),
    comment: f('changeLog'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('changeLog'), cellType: "TEXT" as const }
  },
  createdById: {
    field: uuid('created_by_id'),
    comment: f('createdById'),
    config: { canExport: false, canImport: false }
  },
  createdBy: {
    field: varchar('created_by', { length: 64 }).notNull(),
    comment: f('createdBy'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('createdBy'), cellType: "STRING" as const }
  },
  createdAt: {
    field: timestamp('created_at', { mode: 'string' }).notNull().default(sql`now()`),
    comment: f('createdAt'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('createdAt'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const fileVersionFields = mergeFields(pkSchema, fileVersionOwnFields);

// ============ Meta ============
export const fileVersionMeta: EntityMeta = {
  name: 'knowledge_file_version',
  displayName: tKnowledgeMeta('fileVersion', 'displayName'),
  verboseName: tKnowledgeMeta('fileVersion', 'verboseName'),
  verboseNamePlural: tKnowledgeMeta('fileVersion', 'verboseNamePlural'),
  permissions: createPermissions('knowledge_file_version'),
};

// ============ Table ============
export const fileVersion = pgTable(fileVersionMeta.name, getTableFields(fileVersionFields));

// ============ Config ============
export const fileVersionConfig = getFieldConfigs(fileVersionFields);

// ============ Schemas ============
export const fileVersionZodSchemas = createZodSchemas(fileVersion, fileVersionFields);
