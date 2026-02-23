import { pgTable, varchar, integer, boolean, uuid } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

/**
 * 权限资源表
 * 
 * 定义系统中所有可授权的资源和操作
 * 与 Casbin 策略配合使用，提供权限的元数据管理
 * 
 * 权限标识格式: module:resource:action
 * 例如: system:user:read, ai:agent:write
 */

// ============ Fields ============
const permissionOwnFields = {
  parentId: {
    field: uuid('parent_id'),
    comment: () => '父权限ID',
    config: { canExport: false, canImport: true, cellType: "STRING" as const }
  },
  name: {
    field: varchar('name', { length: 100 }).notNull(),
    comment: () => '权限名称',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  code: {
    field: varchar('code', { length: 100 }).notNull().unique(),
    comment: () => '权限标识',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  type: {
    field: varchar('type', { length: 20 }).notNull().default('action'),
    comment: () => '权限类型',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  module: {
    field: varchar('module', { length: 50 }),
    comment: () => '所属模块',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  resource: {
    field: varchar('resource', { length: 50 }),
    comment: () => '资源名称',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  action: {
    field: varchar('action', { length: 50 }),
    comment: () => '操作类型',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  description: {
    field: varchar('description', { length: 255 }),
    comment: () => '权限描述',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  orderNum: {
    field: integer('order_num').notNull().default(0),
    comment: () => '排序',
    config: { canExport: true, canImport: true, cellType: "NUMERIC" as const }
  },
  status: {
    field: boolean('status').notNull().default(true),
    comment: () => '状态',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const permissionFields = mergeFields(pkSchema, auditSchema, permissionOwnFields);

// ============ Meta ============
export const permissionMeta: EntityMeta = {
  name: 'system_permission',
  displayName: () => '权限管理',
  verboseName: () => '权限',
  verboseNamePlural: () => '权限列表',
  permissions: createPermissions('system_permission'),
};

// ============ Table ============
export const permission = pgTable(permissionMeta.name, getTableFields(permissionFields));

// ============ Config ============
export const permissionConfig = getFieldConfigs(permissionFields);

// ============ Schemas ============
export const permissionSchemas = createTypeboxSchemas(permission);

// ============ Types ============
export type PermissionSelect = typeof permission.$inferSelect;
export type PermissionInsert = typeof permission.$inferInsert;

// ============ 权限类型常量 ============
export const PERMISSION_TYPES = {
  /** 模块 */
  MODULE: 'module',
  /** 资源 */
  RESOURCE: 'resource',
  /** 操作 */
  ACTION: 'action',
} as const;

// ============ 标准操作常量 ============
export const STANDARD_ACTIONS = {
  /** 读取 */
  READ: 'read',
  /** 写入（创建/更新） */
  WRITE: 'write',
  /** 删除 */
  DELETE: 'delete',
  /** 管理（完全控制） */
  MANAGE: 'manage',
  /** 导出 */
  EXPORT: 'export',
  /** 导入 */
  IMPORT: 'import',
} as const;
