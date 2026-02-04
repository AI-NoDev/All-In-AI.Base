import { pgTable, uuid } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';

const f = (field: string) => tSystem('roleDepartment', field);

// ============ Fields ============
export const roleDepartmentFields = {
  roleId: {
    field: uuid('role_id').notNull(),
    comment: f('roleId'),
    config: { canExport: false, canImport: false }
  },
  departmentId: {
    field: uuid('department_id').notNull(),
    comment: f('departmentId'),
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

// ============ Meta ============
export const roleDepartmentMeta: EntityMeta = {
  name: 'system_role_department',
  displayName: tSystemMeta('roleDepartment', 'displayName'),
  verboseName: tSystemMeta('roleDepartment', 'verboseName'),
  verboseNamePlural: tSystemMeta('roleDepartment', 'verboseNamePlural'),
  permissions: createPermissions('system_role_department'),
};

// ============ Table ============
export const roleDepartment = pgTable(roleDepartmentMeta.name, getTableFields(roleDepartmentFields));

// ============ Config ============
export const roleDepartmentConfig = getFieldConfigs(roleDepartmentFields);

// ============ Schemas ============
export const roleDepartmentZodSchemas = createZodSchemas(roleDepartment, roleDepartmentFields);
