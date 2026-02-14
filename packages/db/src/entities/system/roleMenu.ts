import { pgTable, uuid } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';

/**
 * 角色菜单关联表
 * 
 * 注意: 此表保留用于向后兼容和菜单权限管理
 * 
 * Casbin 集成说明:
 * - 菜单权限可通过 casbin_rule 表的 p 策略管理
 * - 此表用于 UI 层面的菜单分配管理
 * - 实际权限检查应使用 Casbin enforcer
 * 
 * 迁移策略:
 * 1. 保留此表用于菜单树的角色分配 UI
 * 2. 菜单的权限标识 (perms) 同步到 casbin_rule
 * 3. 前端菜单渲染基于此表，权限检查使用 Casbin
 */

// ============ Fields ============
export const roleMenuFields = {
  roleId: {
    field: uuid('role_id').notNull(),
    comment: () => '角色ID',
    config: { canExport: false, canImport: false }
  },
  menuId: {
    field: uuid('menu_id').notNull(),
    comment: () => '菜单ID',
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

// ============ Meta ============
export const roleMenuMeta: EntityMeta = {
  name: 'system_role_menu',
  displayName: () => '角色菜单关联',
  verboseName: () => '角色菜单',
  verboseNamePlural: () => '角色菜单',
  permissions: createPermissions('system_role_menu'),
};

// ============ Table ============
export const roleMenu = pgTable(roleMenuMeta.name, getTableFields(roleMenuFields));

// ============ Config ============
export const roleMenuConfig = getFieldConfigs(roleMenuFields);

// ============ Schemas ============
export const roleMenuZodSchemas = createZodSchemas(roleMenu, roleMenuFields);
