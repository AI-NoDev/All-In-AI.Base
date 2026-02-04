import { pgTable, uuid } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';

const f = (field: string) => tSystem('userRole', field);

// ============ Fields ============
export const userRoleFields = {
  userId: {
    field: uuid('user_id').notNull(),
    comment: f('userId'),
    config: { canExport: false, canImport: false }
  },
  roleId: {
    field: uuid('role_id').notNull(),
    comment: f('roleId'),
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

// ============ Meta ============
export const userRoleMeta: EntityMeta = {
  name: 'system_user_role',
  displayName: tSystemMeta('userRole', 'displayName'),
  verboseName: tSystemMeta('userRole', 'verboseName'),
  verboseNamePlural: tSystemMeta('userRole', 'verboseNamePlural'),
  permissions: createPermissions('system_user_role'),
};

// ============ Table ============
export const userRole = pgTable(userRoleMeta.name, getTableFields(userRoleFields));

// ============ Config ============
export const userRoleConfig = getFieldConfigs(userRoleFields);

// ============ Schemas ============
export const userRoleZodSchemas = createZodSchemas(userRole, userRoleFields);
