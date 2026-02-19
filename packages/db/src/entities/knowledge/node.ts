/**
 * 知识库节点实体 (统一文件和文件夹)
 * 
 * 设计说明：
 * - 使用 type 字段区分 folder/file
 * - path: 可读路径 /folder1/folder2/
 * - materializedPath: UUID 路径 uuid1/uuid2/ (用于高效查询祖先/后代)
 * - 文件夹特有字段: icon, color, orderNum
 * - 文件特有字段: storageKey, bucket, mimeType, size, extension 等
 */

import { pgTable, uuid, varchar, text, integer, bigint, char, jsonb, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

// ============ 节点类型 ============
export const NODE_TYPES = {
  FOLDER: 'folder',
  FILE: 'file',
} as const;

export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES];

// ============ Fields ============
const nodeOwnFields = {
  // 基础字段
  type: {
    field: varchar("type", { length: 16 }).notNull().$type<NodeType>(),
    comment: () => '节点类型',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '节点类型', importExcelColumnName: () => '节点类型', cellType: "STRING" as const }
  },
  parentId: {
    field: uuid("parent_id"),
    comment: () => '父节点ID',
    config: { canExport: false, canImport: true, importExcelColumnName: () => '父节点ID', cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 255 }).notNull(),
    comment: () => '名称',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '名称', importExcelColumnName: () => '名称', cellType: "STRING" as const }
  },
  // 路径字段
  path: {
    field: text("path").notNull().default('/'),
    comment: () => '可读路径',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '路径', cellType: "STRING" as const }
  },
  materializedPath: {
    field: text("materialized_path").notNull().default(''),
    comment: () => 'UUID物化路径',
    config: { canExport: false, canImport: false }
  },
  description: {
    field: text("description"),
    comment: () => '描述',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '描述', importExcelColumnName: () => '描述', cellType: "TEXT" as const }
  },
  
  // 文件夹特有字段
  icon: {
    field: varchar("icon", { length: 64 }),
    comment: () => '图标',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '图标', importExcelColumnName: () => '图标', cellType: "STRING" as const }
  },
  color: {
    field: varchar("color", { length: 32 }),
    comment: () => '颜色',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '颜色', importExcelColumnName: () => '颜色', cellType: "STRING" as const }
  },
  orderNum: {
    field: integer("order_num").notNull().default(0),
    comment: () => '排序号',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '排序号', importExcelColumnName: () => '排序号', cellType: "NUMERIC" as const }
  },
  
  // 文件特有字段
  originalName: {
    field: varchar("original_name", { length: 255 }),
    comment: () => '原始文件名',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '原始文件名', cellType: "STRING" as const }
  },
  extension: {
    field: varchar("extension", { length: 32 }),
    comment: () => '扩展名',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '扩展名', cellType: "STRING" as const }
  },
  mimeType: {
    field: varchar("mime_type", { length: 128 }),
    comment: () => 'MIME类型',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => 'MIME类型', cellType: "STRING" as const }
  },
  size: {
    field: bigint("size", { mode: "number" }).notNull().default(0),
    comment: () => '文件大小',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '文件大小', cellType: "NUMERIC" as const }
  },
  storageKey: {
    field: varchar("storage_key", { length: 512 }),
    comment: () => '存储键',
    config: { canExport: false, canImport: false }
  },
  bucket: {
    field: varchar("bucket", { length: 128 }),
    comment: () => '存储桶',
    config: { canExport: false, canImport: false }
  },
  region: {
    field: varchar("region", { length: 64 }),
    comment: () => '存储区域',
    config: { canExport: false, canImport: false }
  },
  etag: {
    field: varchar("etag", { length: 128 }),
    comment: () => 'ETag',
    config: { canExport: false, canImport: false }
  },
  versionId: {
    field: varchar("version_id", { length: 128 }),
    comment: () => 'S3版本ID',
    config: { canExport: false, canImport: false }
  },
  storageClass: {
    field: varchar("storage_class", { length: 32 }).default('STANDARD'),
    comment: () => '存储类型',
    config: { canExport: false, canImport: false }
  },
  metadata: {
    field: jsonb("metadata").$type<Record<string, string>>().default({}),
    comment: () => '元数据',
    config: { canExport: false, canImport: false }
  },
  tags: {
    field: jsonb("tags").$type<string[]>().default([]),
    comment: () => '标签',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '标签', importExcelColumnName: () => '标签', cellType: "STRING" as const }
  },
  
  // 状态字段
  processStatus: {
    field: char("process_status", { length: 1 }).default("0"),
    comment: () => '处理状态',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '处理状态', cellType: "STRING" as const }
  },
  processResult: {
    field: jsonb("process_result").$type<{
      vectorized?: boolean;
      chunks?: number;
      error?: string;
    }>(),
    comment: () => '处理结果',
    config: { canExport: false, canImport: false }
  },
  downloadCount: {
    field: integer("download_count").notNull().default(0),
    comment: () => '下载次数',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '下载次数', cellType: "NUMERIC" as const }
  },
  versionCount: {
    field: integer("version_count").notNull().default(0),
    comment: () => '版本数量',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '版本数量', cellType: "NUMERIC" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: () => '状态',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '状态', importExcelColumnName: () => '状态', cellType: "STRING" as const }
  },
  isPublic: {
    field: boolean("is_public").notNull().default(false),
    comment: () => '是否公开',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '是否公开', importExcelColumnName: () => '是否公开', cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const nodeFields = mergeFields(pkSchema, auditSchema, deletedSchema, nodeOwnFields);

// ============ Meta ============
export const nodeMeta: EntityMeta = {
  name: 'knowledge_node',
  displayName: () => '知识库节点',
  verboseName: () => '知识库节点',
  verboseNamePlural: () => '知识库节点列表',
  permissions: createPermissions('knowledge_node'),
};

// ============ Table ============
export const node = pgTable(
  nodeMeta.name, 
  getTableFields(nodeFields),
  (table) => [
    // 唯一约束: 同一父节点下同一用户的节点名称唯一
    uniqueIndex('node_owner_parent_name_unique_idx').on(table.createdById, table.parentId, table.name),
    // 物化路径索引 (用于祖先/后代查询)
    index('node_materialized_path_idx').on(table.materializedPath),
    // 父节点索引
    index('node_parent_id_idx').on(table.parentId),
    // 类型索引
    index('node_type_idx').on(table.type),
    // 创建人索引
    index('node_created_by_id_idx').on(table.createdById),
  ]
);

// ============ Config ============
export const nodeConfig = getFieldConfigs(nodeFields);

// ============ Schemas ============
export const nodeZodSchemas = {
  insert: createInsertZodSchema(node, {
    type: z.enum(['folder', 'file']).describe(nodeFields.type.comment()),
    tags: z.array(z.string()).describe(nodeFields.tags.comment()),
  }),
  select: createSelectZodSchema(node, {
    type: z.enum(['folder', 'file']).describe(nodeFields.type.comment()),
    tags: z.array(z.string()).nullable().describe(nodeFields.tags.comment()),
  }),
  update: createUpdateZodSchema(node, {
    type: z.enum(['folder', 'file']).optional().describe(nodeFields.type.comment()),
    tags: z.array(z.string()).optional().describe(nodeFields.tags.comment()),
  }),
};

// ============ 类型导出 ============
export type NodeSelect = typeof node.$inferSelect;
export type NodeInsert = typeof node.$inferInsert;
