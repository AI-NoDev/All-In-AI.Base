import { pgTable, uuid } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';

const f = (field: string) => tSystem('roleMenu', field);

// ============ Fields ============
export const roleMenuFields = {
  roleId: {
    field: uuid('role_id').notNull(),
    comment: f('roleId'),
    config: { canExport: false, canImport: false }
  },
  menuId: {
    field: uuid('menu_id').notNull(),
    comment: f('menuId'),
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

// ============ Meta ============
export const roleMenuMeta: EntityMeta = {
  name: 'system_role_menu',
  displayName: tSystemMeta('roleMenu', 'displayName'),
  verboseName: tSystemMeta('roleMenu', 'verboseName'),
  verboseNamePlural: tSystemMeta('roleMenu', 'verboseNamePlural'),
  permissions: createPermissions('system_role_menu'),
};

// ============ Table ============
export const roleMenu = pgTable(roleMenuMeta.name, getTableFields(roleMenuFields));

// ============ Config ============
export const roleMenuConfig = getFieldConfigs(roleMenuFields);

// ============ Schemas ============
export const roleMenuZodSchemas = createZodSchemas(roleMenu, roleMenuFields);
