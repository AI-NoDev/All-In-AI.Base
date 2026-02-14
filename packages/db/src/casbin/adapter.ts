import { eq, and } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { casbinRule, CASBIN_POLICY_TYPES } from '../entities/system/casbinRule';

/**
 * Casbin Drizzle Adapter
 * 
 * 实现 Casbin 的 Adapter 接口，用于将策略持久化到 PostgreSQL
 * 
 * 使用示例:
 * ```typescript
 * import { newEnforcer } from 'casbin';
 * import { DrizzleCasbinAdapter } from '@qiyu-allinai/db/casbin';
 * 
 * const adapter = new DrizzleCasbinAdapter(db);
 * const enforcer = await newEnforcer('model.conf', adapter);
 * ```
 */

export interface CasbinPolicy {
  ptype: string;
  v0?: string | null;
  v1?: string | null;
  v2?: string | null;
  v3?: string | null;
  v4?: string | null;
  v5?: string | null;
}

export class DrizzleCasbinAdapter {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  /**
   * 加载所有策略
   */
  async loadPolicy(): Promise<CasbinPolicy[]> {
    const rules = await this.db.select().from(casbinRule);
    return rules.map(rule => ({
      ptype: rule.ptype,
      v0: rule.v0,
      v1: rule.v1,
      v2: rule.v2,
      v3: rule.v3,
      v4: rule.v4,
      v5: rule.v5,
    }));
  }

  /**
   * 保存策略（清空后重新插入）
   */
  async savePolicy(policies: CasbinPolicy[]): Promise<void> {
    await this.db.delete(casbinRule);
    if (policies.length > 0) {
      await this.db.insert(casbinRule).values(policies);
    }
  }

  /**
   * 添加单条策略
   */
  async addPolicy(policy: CasbinPolicy): Promise<void> {
    await this.db.insert(casbinRule).values(policy);
  }

  /**
   * 添加多条策略
   */
  async addPolicies(policies: CasbinPolicy[]): Promise<void> {
    if (policies.length > 0) {
      await this.db.insert(casbinRule).values(policies);
    }
  }

  /**
   * 删除单条策略
   */
  async removePolicy(policy: CasbinPolicy): Promise<void> {
    const conditions = [eq(casbinRule.ptype, policy.ptype)];
    
    if (policy.v0) conditions.push(eq(casbinRule.v0, policy.v0));
    if (policy.v1) conditions.push(eq(casbinRule.v1, policy.v1));
    if (policy.v2) conditions.push(eq(casbinRule.v2, policy.v2));
    if (policy.v3) conditions.push(eq(casbinRule.v3, policy.v3));
    if (policy.v4) conditions.push(eq(casbinRule.v4, policy.v4));
    if (policy.v5) conditions.push(eq(casbinRule.v5, policy.v5));

    await this.db.delete(casbinRule).where(and(...conditions));
  }

  /**
   * 删除符合过滤条件的策略
   */
  async removeFilteredPolicy(
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void> {
    const conditions = [eq(casbinRule.ptype, ptype)];
    
    const fields = ['v0', 'v1', 'v2', 'v3', 'v4', 'v5'] as const;
    fieldValues.forEach((value, i) => {
      if (value) {
        const fieldName = fields[fieldIndex + i];
        if (fieldName) {
          conditions.push(eq(casbinRule[fieldName], value));
        }
      }
    });

    await this.db.delete(casbinRule).where(and(...conditions));
  }

  // ============ 便捷方法 ============

  /**
   * 为用户分配角色
   */
  async assignRoleToUser(userId: string, roleKey: string, domain?: string): Promise<void> {
    await this.addPolicy({
      ptype: CASBIN_POLICY_TYPES.ROLE_GROUPING,
      v0: `user:${userId}`,
      v1: `role:${roleKey}`,
      v2: domain,
    });
  }

  /**
   * 移除用户的角色
   */
  async removeRoleFromUser(userId: string, roleKey: string, domain?: string): Promise<void> {
    await this.removePolicy({
      ptype: CASBIN_POLICY_TYPES.ROLE_GROUPING,
      v0: `user:${userId}`,
      v1: `role:${roleKey}`,
      v2: domain,
    });
  }

  /**
   * 获取用户的所有角色
   */
  async getRolesForUser(userId: string, domain?: string): Promise<string[]> {
    const conditions = [
      eq(casbinRule.ptype, CASBIN_POLICY_TYPES.ROLE_GROUPING),
      eq(casbinRule.v0, `user:${userId}`),
    ];
    if (domain) {
      conditions.push(eq(casbinRule.v2, domain));
    }

    const rules = await this.db.select().from(casbinRule).where(and(...conditions));
    return rules.map(r => r.v1?.replace('role:', '') ?? '').filter(Boolean);
  }

  /**
   * 获取拥有某角色的所有用户
   */
  async getUsersForRole(roleKey: string, domain?: string): Promise<string[]> {
    const conditions = [
      eq(casbinRule.ptype, CASBIN_POLICY_TYPES.ROLE_GROUPING),
      eq(casbinRule.v1, `role:${roleKey}`),
    ];
    if (domain) {
      conditions.push(eq(casbinRule.v2, domain));
    }

    const rules = await this.db.select().from(casbinRule).where(and(...conditions));
    return rules.map(r => r.v0?.replace('user:', '') ?? '').filter(Boolean);
  }

  /**
   * 为角色添加权限
   */
  async addPermissionForRole(
    roleKey: string, 
    resource: string, 
    action: string, 
    effect: string = 'allow'
  ): Promise<void> {
    await this.addPolicy({
      ptype: CASBIN_POLICY_TYPES.POLICY,
      v0: `role:${roleKey}`,
      v1: resource,
      v2: action,
      v3: effect,
    });
  }

  /**
   * 移除角色的权限
   */
  async removePermissionForRole(
    roleKey: string, 
    resource: string, 
    action: string
  ): Promise<void> {
    await this.removePolicy({
      ptype: CASBIN_POLICY_TYPES.POLICY,
      v0: `role:${roleKey}`,
      v1: resource,
      v2: action,
    });
  }

  /**
   * 获取角色的所有权限
   */
  async getPermissionsForRole(roleKey: string): Promise<Array<{ resource: string; action: string; effect: string }>> {
    const rules = await this.db.select().from(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v0, `role:${roleKey}`)
      )
    );
    return rules.map(r => ({
      resource: r.v1 ?? '',
      action: r.v2 ?? '',
      effect: r.v3 ?? 'allow',
    }));
  }
}
