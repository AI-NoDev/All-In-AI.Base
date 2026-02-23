import { pgTable, uuid } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';

// ============ Fields ============
export const roleDepartmentFields = {
  roleId: {
    field: uuid('role_id').notNull(),
    comment: () => '角色ID',
    config: { canExport: false, canImport: false }
  },
  departmentId: {
    field: uuid('department_id').notNull(),
    comment: () => '部门ID',
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

// ============ Meta ============
export const roleDepartmentMeta: EntityMeta = {
  name: 'system_role_department',
  displayName: () => '角色部门关联',
  verboseName: () => '角色部门',
  verboseNamePlural: () => '角色部门',
  permissions: createPermissions('system_role_department'),
};

// ============ Table ============
export const roleDepartment = pgTable(roleDepartmentMeta.name, getTableFields(roleDepartmentFields));

// ============ Config ============
export const roleDepartmentConfig = getFieldConfigs(roleDepartmentFields);

// ============ Schemas ============
export const roleDepartmentSchemas = createTypeboxSchemas(roleDepartment);

// ============ Types ============
export type RoleDepartmentSelect = typeof roleDepartment.$inferSelect;
export type RoleDepartmentInsert = typeof roleDepartment.$inferInsert;
