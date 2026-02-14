import { pgTable, uuid } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';

/**
 * 用户角色关联表
 * 
 * 注意: 此表保留用于向后兼容和快速查询用户角色关系
 * 
 * Casbin 集成说明:
 * - 主要的角色分配应通过 casbin_rule 表的 g 策略管理
 * - 此表可作为 Casbin 策略的数据源，同步到 casbin_rule
 * - 查询用户角色时，优先使用 Casbin API
 * 
 * 迁移策略:
 * 1. 保留此表用于 UI 管理和数据导入导出
 * 2. 通过触发器或应用层同步到 casbin_rule 表
 * 3. 权限检查统一使用 Casbin enforcer
 */

// ============ Fields ============
export const userRoleFields = {
  userId: {
    field: uuid('user_id').notNull(),
    comment: () => '用户ID',
    config: { canExport: false, canImport: false }
  },
  roleId: {
    field: uuid('role_id').notNull(),
    comment: () => '角色ID',
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

// ============ Meta ============
export const userRoleMeta: EntityMeta = {
  name: 'system_user_role',
  displayName: () => '用户角色关联',
  verboseName: () => '用户角色',
  verboseNamePlural: () => '用户角色',
  permissions: createPermissions('system_user_role'),
};

// ============ Table ============
export const userRole = pgTable(userRoleMeta.name, getTableFields(userRoleFields));

// ============ Config ============
export const userRoleConfig = getFieldConfigs(userRoleFields);

// ============ Schemas ============
export const userRoleZodSchemas = createZodSchemas(userRole, userRoleFields);
