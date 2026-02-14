import { pgTable, serial, varchar, index, uniqueIndex } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';

/**
 * Casbin 策略规则表
 * 
 * 策略类型 (ptype):
 * - p: 权限策略 (sub, obj, act, eft)
 * - g: 角色继承 (user, role, domain)
 * - g2: 资源继承 (resource, parent)
 * 
 * 示例策略:
 * - p, role:admin, /api/*, *, allow          # 管理员可访问所有 API
 * - p, role:editor, article, write, allow    # 编辑者可写文章
 * - g, user:alice, role:admin                # alice 是管理员
 * - g, user:bob, role:editor, tenant:1       # bob 在租户1是编辑者
 */

// ============ Fields ============
export const casbinRuleFields = {
  id: {
    field: serial('id').primaryKey(),
    comment: () => '主键ID',
    config: { canExport: false, canImport: false }
  },
  ptype: {
    field: varchar('ptype', { length: 100 }).notNull(),
    comment: () => '策略类型',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  v0: {
    field: varchar('v0', { length: 100 }),
    comment: () => '主体/用户',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  v1: {
    field: varchar('v1', { length: 100 }),
    comment: () => '对象/角色',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  v2: {
    field: varchar('v2', { length: 100 }),
    comment: () => '动作/域',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  v3: {
    field: varchar('v3', { length: 100 }),
    comment: () => '效果/扩展',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  v4: {
    field: varchar('v4', { length: 100 }),
    comment: () => '扩展字段4',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  v5: {
    field: varchar('v5', { length: 100 }),
    comment: () => '扩展字段5',
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
} satisfies FieldMap;

// ============ Meta ============
export const casbinRuleMeta: EntityMeta = {
  name: 'casbin_rule',
  displayName: () => 'Casbin策略',
  verboseName: () => '策略规则',
  verboseNamePlural: () => '策略规则列表',
  permissions: {
    read: 'system:casbin:read',
    write: 'system:casbin:write',
    manage: 'system:casbin:manage',
  },
};

// ============ Table ============
export const casbinRule = pgTable(
  casbinRuleMeta.name, 
  getTableFields(casbinRuleFields),
  (table) => [
    index('idx_casbin_rule_ptype').on(table.ptype),
    index('idx_casbin_rule_v0').on(table.v0),
    index('idx_casbin_rule_v1').on(table.v1),
    index('idx_casbin_rule_v0_v1').on(table.v0, table.v1),
    uniqueIndex('uniq_casbin_rule').on(
      table.ptype, table.v0, table.v1, table.v2, table.v3, table.v4, table.v5
    ),
  ]
);

// ============ Config ============
export const casbinRuleConfig = getFieldConfigs(casbinRuleFields);

// ============ Schemas ============
export const casbinRuleZodSchemas = createZodSchemas(casbinRule, casbinRuleFields);

// ============ 策略类型常量 ============
export const CASBIN_POLICY_TYPES = {
  /** 权限策略: sub, obj, act, eft */
  POLICY: 'p',
  /** 角色继承: user, role, domain */
  ROLE_GROUPING: 'g',
  /** 资源继承: resource, parent */
  RESOURCE_GROUPING: 'g2',
} as const;

// ============ 辅助函数 ============

/** 创建权限策略 */
export function createPolicy(sub: string, obj: string, act: string, eft: string = 'allow') {
  return { ptype: 'p', v0: sub, v1: obj, v2: act, v3: eft };
}

/** 创建角色继承 */
export function createRoleGrouping(user: string, role: string, domain?: string) {
  return { ptype: 'g', v0: user, v1: role, v2: domain };
}

/** 创建资源继承 */
export function createResourceGrouping(resource: string, parent: string) {
  return { ptype: 'g2', v0: resource, v1: parent };
}
