/**
 * Casbin 策略种子数据
 * 定义角色的默认权限策略
 */

import { and, eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { casbinRule, CASBIN_POLICY_TYPES } from '../entities/system/casbinRule';
import { BUILTIN_ROLES } from '../entities/system/role';

export interface CasbinPolicySeed {
  ptype: string;
  v0: string;
  v1: string;
  v2?: string;
  v3?: string;
  v4?: string;
  v5?: string;
}

/**
 * 超级管理员权限策略
 * 拥有所有资源的所有操作权限
 */
const superAdminPolicies: CasbinPolicySeed[] = [
  // 超级管理员拥有所有权限
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.SUPER_ADMIN}`, v1: '*', v2: '*', v3: 'allow' },
];

/**
 * 管理员权限策略
 */
const adminPolicies: CasbinPolicySeed[] = [
  // 系统管理
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'system:user', v2: '*', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'system:role', v2: 'read', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'system:menu', v2: '*', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'system:department', v2: '*', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'system:post', v2: '*', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'system:dict', v2: '*', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'system:config', v2: '*', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'system:notice', v2: '*', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'system:log', v2: 'read', v3: 'allow' },
  // AI 管理
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'ai:*', v2: '*', v3: 'allow' },
  // 知识库
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'knowledge:*', v2: '*', v3: 'allow' },
  // IM
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: 'im:*', v2: '*', v3: 'allow' },
];

/**
 * 普通用户权限策略
 */
const userPolicies: CasbinPolicySeed[] = [
  // 基本读取权限
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'system:user', v2: 'read', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'system:department', v2: 'read', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'system:dict', v2: 'read', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'system:notice', v2: 'read', v3: 'allow' },
  // AI 使用权限
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'ai:agent', v2: 'read', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'ai:session', v2: '*', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'ai:model', v2: 'read', v3: 'allow' },
  // 知识库使用权限
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'knowledge:folder', v2: '*', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'knowledge:file', v2: '*', v3: 'allow' },
  // IM 使用权限
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'im:conversation', v2: '*', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.USER}`, v1: 'im:message', v2: '*', v3: 'allow' },
];

/**
 * 访客权限策略
 */
const guestPolicies: CasbinPolicySeed[] = [
  // 只读权限
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.GUEST}`, v1: 'system:notice', v2: 'read', v3: 'allow' },
  { ptype: CASBIN_POLICY_TYPES.POLICY, v0: `role:${BUILTIN_ROLES.GUEST}`, v1: 'system:dict', v2: 'read', v3: 'allow' },
];

/**
 * 所有 Casbin 策略种子数据
 */
export const casbinPolicySeeds: CasbinPolicySeed[] = [
  ...superAdminPolicies,
  ...adminPolicies,
  ...userPolicies,
  ...guestPolicies,
];

/**
 * 角色继承关系（可选）
 * 例如：admin 继承 user 的所有权限
 */
export const roleInheritanceSeeds: CasbinPolicySeed[] = [
  // admin 继承 user 权限
  { ptype: CASBIN_POLICY_TYPES.ROLE_GROUPING, v0: `role:${BUILTIN_ROLES.ADMIN}`, v1: `role:${BUILTIN_ROLES.USER}` },
  // user 继承 guest 权限
  { ptype: CASBIN_POLICY_TYPES.ROLE_GROUPING, v0: `role:${BUILTIN_ROLES.USER}`, v1: `role:${BUILTIN_ROLES.GUEST}` },
];

/**
 * 所有种子数据（包含策略和继承关系）
 */
export const allCasbinSeeds: CasbinPolicySeed[] = [
  ...casbinPolicySeeds,
  ...roleInheritanceSeeds,
];

/**
 * 初始化 Casbin 策略种子数据
 */
export async function initCasbinPolicySeeds(db: PostgresJsDatabase): Promise<void> {
  console.log('🔧 Initializing Casbin policy seeds...');
  
  let created = 0;
  let skipped = 0;

  for (const seed of allCasbinSeeds) {
    // 检查是否已存在（基于所有字段的唯一约束）
    const [existing] = await db.select().from(casbinRule)
      .where(and(
        eq(casbinRule.ptype, seed.ptype),
        eq(casbinRule.v0, seed.v0 ?? ''),
        eq(casbinRule.v1, seed.v1 ?? ''),
        eq(casbinRule.v2, seed.v2 ?? ''),
        eq(casbinRule.v3, seed.v3 ?? ''),
        eq(casbinRule.v4, seed.v4 ?? ''),
        eq(casbinRule.v5, seed.v5 ?? ''),
      ))
      .limit(1);

    if (existing) {
      skipped++;
      continue;
    }

    // 创建策略
    await db.insert(casbinRule).values({
      ptype: seed.ptype,
      v0: seed.v0 ?? '',
      v1: seed.v1 ?? '',
      v2: seed.v2 ?? '',
      v3: seed.v3 ?? '',
      v4: seed.v4 ?? '',
      v5: seed.v5 ?? '',
    });

    created++;
  }

  console.log(`✅ Casbin policy seeds: ${created} created, ${skipped} skipped`);
}
