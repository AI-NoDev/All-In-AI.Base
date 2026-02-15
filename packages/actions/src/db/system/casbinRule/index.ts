import { z } from 'zod';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { casbinRule, casbinRuleZodSchemas, CASBIN_POLICY_TYPES } from '@qiyu-allinai/db/entities/system';

type CasbinRuleSelect = typeof casbinRule.$inferSelect;
type CasbinRuleInsert = typeof casbinRule.$inferInsert;

// ============ 获取角色的权限列表 ============
export const casbinRuleGetRolePermissions = defineAction({
  meta: {
    name: 'system.casbinRule.getRolePermissions',
    displayName: '获取角色权限',
    description: '获取指定角色的所有权限标识',
    tags: ['system', 'casbinRule'],
    method: 'GET',
    path: '/api/system/casbin-rule/role/:roleKey/permissions',
  },
  schemas: {
    paramsSchema: z.object({ roleKey: z.string() }),
    outputSchema: z.array(z.string()),
  },
  execute: async (input, context) => {
    const { db } = context;
    const roleSubject = `role:${input.roleKey}`;
    const rules = await db
      .select({ v1: casbinRule.v1 })
      .from(casbinRule)
      .where(and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v0, roleSubject)
      ));
    return rules.map(r => r.v1).filter((v): v is string => v !== null);
  },
});

// ============ 设置角色的权限列表 ============
export const casbinRuleSetRolePermissions = defineAction({
  meta: {
    name: 'system.casbinRule.setRolePermissions',
    displayName: '设置角色权限',
    description: '设置指定角色的权限列表（全量替换）',
    tags: ['system', 'casbinRule'],
    method: 'PUT',
    path: '/api/system/casbin-rule/role/:roleKey/permissions',
  },
  schemas: {
    paramsSchema: z.object({ roleKey: z.string() }),
    bodySchema: z.object({ permissionCodes: z.array(z.string()) }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const roleSubject = `role:${input.roleKey}`;
    
    // 删除该角色的所有权限策略
    await db.delete(casbinRule).where(and(
      eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
      eq(casbinRule.v0, roleSubject)
    ));
    
    // 插入新的权限策略
    if (input.permissionCodes.length > 0) {
      const newRules: CasbinRuleInsert[] = input.permissionCodes.map(code => ({
        ptype: CASBIN_POLICY_TYPES.POLICY,
        v0: roleSubject,
        v1: code,
        v2: '*',
        v3: 'allow',
      }));
      await db.insert(casbinRule).values(newRules);
    }
    
    return true;
  },
});

// ============ 获取用户的角色列表 ============
export const casbinRuleGetUserRoles = defineAction({
  meta: {
    name: 'system.casbinRule.getUserRoles',
    displayName: '获取用户角色',
    description: '获取指定用户的所有角色',
    tags: ['system', 'casbinRule'],
    method: 'GET',
    path: '/api/system/casbin-rule/user/:userId/roles',
  },
  schemas: {
    paramsSchema: z.object({ userId: z.string() }),
    outputSchema: z.array(z.string()),
  },
  execute: async (input, context) => {
    const { db } = context;
    const userSubject = `user:${input.userId}`;
    const rules = await db
      .select({ v1: casbinRule.v1 })
      .from(casbinRule)
      .where(and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.ROLE_GROUPING),
        eq(casbinRule.v0, userSubject)
      ));
    // 返回角色key（去掉 role: 前缀）
    return rules
      .map(r => r.v1)
      .filter((v): v is string => v !== null)
      .map(v => v.replace(/^role:/, ''));
  },
});

// ============ 设置用户的角色列表 ============
export const casbinRuleSetUserRoles = defineAction({
  meta: {
    name: 'system.casbinRule.setUserRoles',
    displayName: '设置用户角色',
    description: '设置指定用户的角色列表（全量替换）',
    tags: ['system', 'casbinRule'],
    method: 'PUT',
    path: '/api/system/casbin-rule/user/:userId/roles',
  },
  schemas: {
    paramsSchema: z.object({ userId: z.string() }),
    bodySchema: z.object({ roleKeys: z.array(z.string()) }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const userSubject = `user:${input.userId}`;
    
    // 删除该用户的所有角色分配
    await db.delete(casbinRule).where(and(
      eq(casbinRule.ptype, CASBIN_POLICY_TYPES.ROLE_GROUPING),
      eq(casbinRule.v0, userSubject)
    ));
    
    // 插入新的角色分配
    if (input.roleKeys.length > 0) {
      const newRules: CasbinRuleInsert[] = input.roleKeys.map(roleKey => ({
        ptype: CASBIN_POLICY_TYPES.ROLE_GROUPING,
        v0: userSubject,
        v1: `role:${roleKey}`,
      }));
      await db.insert(casbinRule).values(newRules);
    }
    
    return true;
  },
});

export const casbinRuleActions = [
  casbinRuleGetRolePermissions,
  casbinRuleSetRolePermissions,
  casbinRuleGetUserRoles,
  casbinRuleSetUserRoles,
];
