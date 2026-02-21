/**
 * 资源权限管理抽象基类 (基于 Casbin)
 * 
 * 提供通用的资源权限管理功能，子类可以继承并扩展
 * 
 * 支持：
 * - 用户、角色、部门三种主体
 * - 可配置的权限类型
 * - 权限继承（子资源继承父资源权限）
 * - allow/deny 规则（deny 优先）
 * 
 * Casbin 策略格式：
 * - p, sub, obj, act, eft  (权限策略)
 * - g, user, role          (用户-角色关系)
 * - g2, child, parent      (资源继承关系)
 */

import { eq, and, inArray } from 'drizzle-orm';
import type { PgDatabase } from 'drizzle-orm/pg-core';
import { casbinRule, CASBIN_POLICY_TYPES } from '../entities/system/casbinRule';

/** Drizzle Database 类型 (兼容 postgres-js 和 PGlite) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrizzleDB = PgDatabase<any, any, any>;

// ============ 通用常量 ============

/** 权限效果 */
export const PERMISSION_EFFECTS = {
  ALLOW: 'allow',
  DENY: 'deny',
} as const;

export type PermissionEffect = typeof PERMISSION_EFFECTS[keyof typeof PERMISSION_EFFECTS];

/** 主体类型 */
export type SubjectType = 'user' | 'role' | 'dept';

// ============ 通用类型 ============

export interface PermissionEntry<P extends string = string> {
  subjectType: SubjectType;
  subjectId: string;
  resourceId: string;
  permission: P;
  effect: PermissionEffect;
}

export interface EffectivePermission<P extends string = string> {
  permission: P;
  effect: PermissionEffect;
  source: 'direct' | 'inherited' | 'role' | 'dept';
  sourceId?: string;
}

// ============ 辅助函数 ============

/** 构建主体标识 */
export function buildSubject(type: SubjectType, id: string): string {
  return `${type}:${id}`;
}

/** 解析主体标识 */
export function parseSubject(subject: string): { type: SubjectType; id: string } | null {
  const match = subject.match(/^(user|role|dept):(.+)$/);
  if (!match || !match[1] || !match[2]) return null;
  return { type: match[1] as SubjectType, id: match[2] };
}

/**
 * 从资源字符串中提取资源 ID
 * 支持格式: node:xxx, folder:xxx, file:xxx 或纯 UUID
 * 用于兼容历史数据中可能存在的不同前缀格式
 */
export function parseResourceId(resource: string | null | undefined): string {
  if (!resource) return '';
  // 移除可能的前缀 (node:, folder:, file: 或其他 xxx: 格式)
  const match = resource.match(/^(?:[a-z]+):(.+)$/);
  return match?.[1] ?? resource;
}

// ============ 抽象基类 ============

/**
 * 资源权限适配器抽象基类
 * 
 * @template P 权限类型枚举
 */
export abstract class ResourcePermissionAdapter<P extends string = string> {
  protected db: DrizzleDB;
  
  /** 资源类型前缀，子类必须实现 */
  protected abstract readonly resourcePrefix: string;
  
  /** 支持的权限列表，子类必须实现 */
  protected abstract readonly permissions: readonly P[];

  constructor(db: DrizzleDB) {
    this.db = db;
  }

  // ============ 资源标识构建 ============

  /** 构建资源标识 */
  protected buildResource(resourceId: string): string {
    return `${this.resourcePrefix}:${resourceId}`;
  }

  /** 解析资源标识 */
  protected parseResource(resource: string): string | null {
    const prefix = `${this.resourcePrefix}:`;
    if (!resource.startsWith(prefix)) return null;
    return resource.substring(prefix.length);
  }

  // ============ 权限策略管理 ============

  /**
   * 添加权限策略
   */
  async addPermission(entry: PermissionEntry<P>): Promise<void> {
    const subject = buildSubject(entry.subjectType, entry.subjectId);
    const resource = this.buildResource(entry.resourceId);
    
    await this.db.insert(casbinRule).values({
      ptype: CASBIN_POLICY_TYPES.POLICY,
      v0: subject,
      v1: resource,
      v2: entry.permission,
      v3: entry.effect,
    }).onConflictDoNothing();
  }

  /**
   * 批量添加权限策略
   */
  async addPermissions(entries: PermissionEntry<P>[]): Promise<void> {
    if (entries.length === 0) return;
    
    const values = entries.map(entry => ({
      ptype: CASBIN_POLICY_TYPES.POLICY,
      v0: buildSubject(entry.subjectType, entry.subjectId),
      v1: this.buildResource(entry.resourceId),
      v2: entry.permission,
      v3: entry.effect,
    }));
    
    await this.db.insert(casbinRule).values(values).onConflictDoNothing();
  }

  /**
   * 移除权限策略
   */
  async removePermission(entry: Partial<PermissionEntry<P>>): Promise<void> {
    const conditions = [eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY)];
    
    if (entry.subjectType && entry.subjectId) {
      conditions.push(eq(casbinRule.v0, buildSubject(entry.subjectType, entry.subjectId)));
    }
    if (entry.resourceId) {
      conditions.push(eq(casbinRule.v1, this.buildResource(entry.resourceId)));
    }
    if (entry.permission) {
      conditions.push(eq(casbinRule.v2, entry.permission));
    }
    if (entry.effect) {
      conditions.push(eq(casbinRule.v3, entry.effect));
    }
    
    await this.db.delete(casbinRule).where(and(...conditions));
  }

  /**
   * 获取资源的所有权限策略
   */
  async getPermissionsForResource(resourceId: string): Promise<PermissionEntry<P>[]> {
    const resource = this.buildResource(resourceId);
    
    const rules = await this.db.select().from(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v1, resource)
      )
    );
    
    return rules.map(rule => {
      const subject = parseSubject(rule.v0 ?? '');
      if (!subject) return null;
      
      return {
        subjectType: subject.type,
        subjectId: subject.id,
        resourceId,
        permission: rule.v2 as P,
        effect: rule.v3 as PermissionEffect,
      };
    }).filter((e): e is PermissionEntry<P> => e !== null);
  }

  /**
   * 设置资源的权限（替换现有权限）
   */
  async setPermissionsForResource(
    resourceId: string,
    entries: Omit<PermissionEntry<P>, 'resourceId'>[]
  ): Promise<void> {
    const resource = this.buildResource(resourceId);
    
    // 删除现有权限
    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v1, resource)
      )
    );
    
    // 添加新权限
    if (entries.length > 0) {
      const values = entries.map(entry => ({
        ptype: CASBIN_POLICY_TYPES.POLICY,
        v0: buildSubject(entry.subjectType, entry.subjectId),
        v1: resource,
        v2: entry.permission,
        v3: entry.effect,
      }));
      
      await this.db.insert(casbinRule).values(values);
    }
  }

  // ============ 资源继承管理 ============

  /**
   * 设置资源继承关系
   */
  async setResourceParent(resourceId: string, parentId: string | null): Promise<void> {
    const child = this.buildResource(resourceId);
    
    // 删除现有继承关系
    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.RESOURCE_GROUPING),
        eq(casbinRule.v0, child)
      )
    );
    
    // 添加新继承关系
    if (parentId) {
      const parent = this.buildResource(parentId);
      await this.db.insert(casbinRule).values({
        ptype: CASBIN_POLICY_TYPES.RESOURCE_GROUPING,
        v0: child,
        v1: parent,
      });
    }
  }

  /**
   * 获取资源的祖先链（用于权限继承计算）
   */
  async getResourceAncestors(resourceId: string): Promise<string[]> {
    const ancestors: string[] = [];
    let current = this.buildResource(resourceId);
    
    // 最多遍历 20 层防止无限循环
    for (let i = 0; i < 20; i++) {
      const rules = await this.db.select().from(casbinRule).where(
        and(
          eq(casbinRule.ptype, CASBIN_POLICY_TYPES.RESOURCE_GROUPING),
          eq(casbinRule.v0, current)
        )
      ).limit(1);
      
      if (rules.length === 0 || !rules[0]?.v1) break;
      
      const parentId = this.parseResource(rules[0].v1);
      if (!parentId) break;
      
      ancestors.push(parentId);
      current = rules[0].v1;
    }
    
    return ancestors;
  }

  // ============ 权限检查 ============

  /**
   * 检查用户对资源的权限
   * 
   * @param userId 用户ID
   * @param resourceId 资源ID
   * @param permission 权限类型
   * @param ancestorIds 可选的祖先ID列表（避免额外查询）
   */
  async checkPermission(
    userId: string,
    resourceId: string,
    permission: P,
    ancestorIds?: string[]
  ): Promise<boolean> {
    const resource = this.buildResource(resourceId);
    const userSubject = buildSubject('user', userId);
    
    // 获取用户的角色
    const userRoles = await this.getUserRoles(userId);
    const roleSubjects = userRoles.map(r => buildSubject('role', r));
    
    // 所有可能的主体
    const allSubjects = [userSubject, ...roleSubjects];
    
    // 获取资源及其所有祖先
    const ancestors = ancestorIds ?? await this.getResourceAncestors(resourceId);
    const allResources = [resource, ...ancestors.map(id => this.buildResource(id))];
    
    // 查询所有相关权限
    const rules = await this.db.select().from(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v2, permission)
      )
    );
    
    // 过滤相关规则
    const relevantRules = rules.filter(rule => 
      allSubjects.includes(rule.v0 ?? '') && 
      allResources.includes(rule.v1 ?? '')
    );
    
    // 检查是否有 deny 规则
    const hasDeny = relevantRules.some(rule => rule.v3 === PERMISSION_EFFECTS.DENY);
    if (hasDeny) return false;
    
    // 检查是否有 allow 规则
    const hasAllow = relevantRules.some(rule => rule.v3 === PERMISSION_EFFECTS.ALLOW);
    return hasAllow;
  }

  /**
   * 获取用户对资源的所有有效权限
   */
  async getEffectivePermissions(
    userId: string,
    resourceId: string,
    ancestorIds?: string[]
  ): Promise<EffectivePermission<P>[]> {
    const resource = this.buildResource(resourceId);
    const userSubject = buildSubject('user', userId);
    
    // 获取用户的角色
    const userRoles = await this.getUserRoles(userId);
    
    // 获取资源及其所有祖先
    const ancestors = ancestorIds ?? await this.getResourceAncestors(resourceId);
    const allResources = [resource, ...ancestors.map(id => this.buildResource(id))];
    
    // 查询所有相关权限
    const rules = await this.db.select().from(casbinRule).where(
      eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY)
    );
    
    const effectivePerms: EffectivePermission<P>[] = [];
    const permissionSet = new Set<string>();
    
    for (const perm of this.permissions) {
      // 检查直接用户权限
      for (let i = 0; i < allResources.length; i++) {
        const res = allResources[i];
        const rule = rules.find(r => 
          r.v0 === userSubject && 
          r.v1 === res && 
          r.v2 === perm
        );
        
        if (rule && !permissionSet.has(perm)) {
          effectivePerms.push({
            permission: perm,
            effect: rule.v3 as PermissionEffect,
            source: i === 0 ? 'direct' : 'inherited',
            sourceId: i === 0 ? undefined : ancestors[i - 1],
          });
          permissionSet.add(perm);
          break;
        }
      }
      
      // 检查角色权限
      if (!permissionSet.has(perm)) {
        for (const roleKey of userRoles) {
          const roleSubject = buildSubject('role', roleKey);
          for (const res of allResources) {
            const rule = rules.find(r => 
              r.v0 === roleSubject && 
              r.v1 === res && 
              r.v2 === perm
            );
            
            if (rule) {
              effectivePerms.push({
                permission: perm,
                effect: rule.v3 as PermissionEffect,
                source: 'role',
                sourceId: roleKey,
              });
              permissionSet.add(perm);
              break;
            }
          }
          if (permissionSet.has(perm)) break;
        }
      }
    }
    
    return effectivePerms;
  }

  // ============ 用户角色管理 ============

  /**
   * 获取用户的所有角色
   */
  async getUserRoles(userId: string): Promise<string[]> {
    const userSubject = buildSubject('user', userId);
    
    const rules = await this.db.select().from(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.ROLE_GROUPING),
        eq(casbinRule.v0, userSubject)
      )
    );
    
    return rules
      .map(r => r.v1?.replace('role:', '') ?? '')
      .filter(Boolean);
  }

  // ============ 批量操作 ============

  /**
   * 删除资源的所有权限和继承关系
   */
  async deleteResourcePermissions(resourceId: string): Promise<void> {
    const resource = this.buildResource(resourceId);
    
    // 删除权限策略
    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v1, resource)
      )
    );
    
    // 删除继承关系（作为子级）
    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.RESOURCE_GROUPING),
        eq(casbinRule.v0, resource)
      )
    );
    
    // 删除继承关系（作为父级）
    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.RESOURCE_GROUPING),
        eq(casbinRule.v1, resource)
      )
    );
  }

  /**
   * 批量删除多个资源的权限
   */
  async deleteResourcesPermissions(resourceIds: string[]): Promise<void> {
    if (resourceIds.length === 0) return;
    
    const resources = resourceIds.map(id => this.buildResource(id));
    
    // 删除权限策略
    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        inArray(casbinRule.v1, resources)
      )
    );
    
    // 删除继承关系
    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.RESOURCE_GROUPING),
        inArray(casbinRule.v0, resources)
      )
    );
    
    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.RESOURCE_GROUPING),
        inArray(casbinRule.v1, resources)
      )
    );
  }

  /**
   * 复制资源权限到另一个资源
   */
  async copyPermissions(sourceId: string, targetId: string): Promise<void> {
    const permissions = await this.getPermissionsForResource(sourceId);
    
    const targetPermissions = permissions.map(p => ({
      subjectType: p.subjectType,
      subjectId: p.subjectId,
      permission: p.permission,
      effect: p.effect,
    }));
    
    await this.setPermissionsForResource(targetId, targetPermissions);
  }
}
