import { pgTable, varchar, char, boolean, integer } from 'drizzle-orm/pg-core';
import { 
  mergeFields, getTableFields, getFieldConfigs, createPermissions, createTypeboxSchemas,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_role_meta_displayName,
  db_system_role_meta_verboseName,
  db_system_role_meta_verboseNamePlural,
  db_system_role_name,
  db_system_role_key,
  db_system_role_sort,
  db_system_role_dataScope,
  db_system_role_status,
  db_system_role_flag,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

/**
 * 角色表
 */

// ============ Fields ============
const roleOwnFields = {
  name: {
    field: varchar('name', { length: 30 }).notNull(),
    comment: db_system_role_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_role_name, importExcelColumnName: db_system_role_name, cellType: "STRING" as const }
  },
  key: {
    field: varchar('key', { length: 100 }).notNull().unique(),
    comment: db_system_role_key,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_role_key, importExcelColumnName: db_system_role_key, cellType: "STRING" as const }
  },
  sort: {
    field: integer('sort').notNull().default(0),
    comment: db_system_role_sort,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_role_sort, importExcelColumnName: db_system_role_sort, cellType: "NUMERIC" as const }
  },
  dataScope: {
    field: varchar('data_scope', { length: 1 }).default('5'),
    comment: db_system_role_dataScope,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_role_dataScope, importExcelColumnName: db_system_role_dataScope, cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: db_system_role_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_role_status, importExcelColumnName: db_system_role_status, cellType: "STRING" as const }
  },
  flag: {
    field: boolean('flag').default(false),
    comment: db_system_role_flag,
    config: { canExport: false, canImport: false }
  },
  description: {
    field: varchar('description', { length: 255 }),
    comment: () => '角色描述',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const roleFields = mergeFields(pkSchema, auditSchema, deletedSchema, roleOwnFields);

// ============ Meta ============
export const roleMeta: EntityMeta = {
  name: 'system_role',
  displayName: db_system_role_meta_displayName,
  verboseName: db_system_role_meta_verboseName,
  verboseNamePlural: db_system_role_meta_verboseNamePlural,
  permissions: createPermissions('system_role'),
};

// ============ Table ============
export const role = pgTable(roleMeta.name, getTableFields(roleFields));

// ============ Config ============
export const roleConfig = getFieldConfigs(roleFields);

// ============ Schemas (TypeBox) ============
export const roleSchemas = createTypeboxSchemas(role);

// ============ Types (从 Drizzle 推导) ============
export type RoleSelect = typeof role.$inferSelect;
export type RoleInsert = typeof role.$inferInsert;

// ============ 数据范围常量 ============
export const DATA_SCOPE = {
  ALL: '1',
  CUSTOM: '2',
  DEPT: '3',
  DEPT_AND_CHILD: '4',
  SELF: '5',
} as const;

// ============ 内置角色 ============
export const BUILTIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;
