/**
 * 知识库节点版本实体 (仅用于文件类型节点)
 */

import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, bigint, timestamp, text, index } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { pkSchema } from '../base/pkSchema';

// ============ Fields ============
const nodeVersionOwnFields = {
  nodeId: {
    field: uuid("node_id").notNull(),
    comment: () => '节点ID',
    config: { canExport: false, canImport: false }
  },
  versionNumber: {
    field: varchar("version_number", { length: 32 }).notNull(),
    comment: () => '版本号',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '版本号', cellType: "STRING" as const }
  },
  storageKey: {
    field: varchar("storage_key", { length: 512 }).notNull(),
    comment: () => '存储键',
    config: { canExport: false, canImport: false }
  },
  bucket: {
    field: varchar("bucket", { length: 128 }).notNull(),
    comment: () => '存储桶',
    config: { canExport: false, canImport: false }
  },
  s3VersionId: {
    field: varchar("s3_version_id", { length: 128 }),
    comment: () => 'S3版本ID',
    config: { canExport: false, canImport: false }
  },
  etag: {
    field: varchar("etag", { length: 128 }),
    comment: () => 'ETag',
    config: { canExport: false, canImport: false }
  },
  size: {
    field: bigint("size", { mode: "number" }).notNull().default(0),
    comment: () => '文件大小',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '文件大小', cellType: "NUMERIC" as const }
  },
  changeLog: {
    field: text("change_log"),
    comment: () => '变更日志',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '变更日志', cellType: "TEXT" as const }
  },
  createdById: {
    field: uuid('created_by_id'),
    comment: () => '创建人ID',
    config: { canExport: false, canImport: false }
  },
  createdBy: {
    field: varchar('created_by', { length: 64 }).notNull(),
    comment: () => '创建人',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '创建人', cellType: "STRING" as const }
  },
  createdAt: {
    field: timestamp('created_at', { mode: 'string' }).notNull().default(sql`now()`),
    comment: () => '创建时间',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '创建时间', cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const nodeVersionFields = mergeFields(pkSchema, nodeVersionOwnFields);

// ============ Meta ============
export const nodeVersionMeta: EntityMeta = {
  name: 'knowledge_node_version',
  displayName: () => '节点版本',
  verboseName: () => '节点版本',
  verboseNamePlural: () => '节点版本列表',
  permissions: createPermissions('knowledge_node_version'),
};

// ============ Table ============
export const nodeVersion = pgTable(
  nodeVersionMeta.name, 
  getTableFields(nodeVersionFields),
  (table) => [
    index('node_version_node_id_idx').on(table.nodeId),
  ]
);

// ============ Config ============
export const nodeVersionConfig = getFieldConfigs(nodeVersionFields);

// ============ Schemas ============
export const nodeVersionSchemas = createTypeboxSchemas(nodeVersion);

// ============ 类型导出 ============
export type NodeVersionSelect = typeof nodeVersion.$inferSelect;
export type NodeVersionInsert = typeof nodeVersion.$inferInsert;
