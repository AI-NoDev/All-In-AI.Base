/**
 * 文件系统权限管理 (基于 Casbin)
 * 
 * 类似 Windows/POSIX 的 ACL 权限模型：
 * - 支持用户、角色、部门三种主体
 * - 支持 read/write/delete/manage 四种权限
 * - 支持权限继承（子文件夹/文件继承父文件夹权限）
 * - 支持 allow/deny 规则（deny 优先）
 * 
 * Casbin 策略格式：
 * - p, sub, obj, act, eft  (权限策略)
 * - g, user, role          (用户-角色关系)
 * - g2, child, parent      (资源继承关系)
 * 
 * 示例：
 * - p, user:alice, folder:root, read, allow
 * - p, role:editor, folder:docs, write, allow
 * - p, dept:tech, folder:tech-docs, manage, allow
 * - g2, folder:sub, folder:parent  (sub 继承 parent 的权限)
 * - g2, file:doc1, folder:docs     (doc1 继承 docs 文件夹的权限)
 */

import { eq, and, or, like } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { casbinRule, CASBIN_POLICY_TYPES } from '../entities/system/casbinRule';

// ============ 常量定义 ============

/** 文件权限类型 */
export const FILE_PERMISSIONS = {
  /** 读取 - 查看文件内容/列出目录 */
  READ: 'read',
  /** 写入 - 修改文件/在目录中创建文件 */
  WRITE: 'write',
  /** 删除 - 删除文件/文件夹 */
  DELETE: 'delete',
  /** 管理 - 修改权限、移动、重命名 */
  MANAGE: 'manage',
} as const;

export type FilePermission = typeof FILE_PERMISSIONS[keyof typeof FILE_PERMISSIONS];

/** 权限效果 */
export const PERMISSION_EFFECTS = {
  ALLOW: 'allow',
  DENY: 'deny',
} as const;

export type PermissionEffect = typeof PERMISSION_EFFECTS[keyof typeof PERMISSION_EFFECTS];

/** 主体类型前缀 */
export const SUBJECT_PREFIXES = {
  USER: 'user:',
  ROLE: 'role:',
  DEPT: 'dept:',
} as const;

/** 资源类型前缀 */
export const RESOURCE_PREFIXES = {
  FILE: 'file:',
  FOLDER: 'folder:',
} as const;

// ============ 类型定义 ============

export type SubjectType = 'user' | 'role' | 'dept';
export type ResourceType = 'file' | 'folder';

export interface FilePermissionEntry {
  subjectType: SubjectType;
  subjectId: string;
  resourceType: ResourceType;
  resourceId: string;
  permission: FilePermission;
  effect: PermissionEffect;
}

export interface EffectivePermission {
  permission: FilePermission;
  effect: PermissionEffect;
  source: 'direct' | 'inherited' | 'role' | 'dept';
  sourceId?: string;
}

// ============ 辅助函数 ============

/** 构建主体标识 */
export function buildSubject(type: SubjectType, id: string): string {
  return `${type}:${id}`;
}

/** 构建资源标识 */
export function buildResource(type: ResourceType, id: string): string {
  return `${type}:${id}`;
}

/** 解析主体标识 */
export function parseSubject(subject: string): { type: SubjectType; id: string } | null {
  const match = subject.match(/^(user|role|dept):(.+)$/);
  if (!match) return null;
  return { type: match[1] as SubjectType, id: match[2] };
}

/** 解析资源标识 */
export function parseResource(resource: string): { type: ResourceType; id: string } | null {
  const match = resource.match(/^(file|folder):(.+)$/);
  if (!match) return null;
  return { type: match[1] as ResourceType, id: match[2] };
}

// ============ 文件权限适配器 ============

export class FilePermissionAdapter {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  // ============ 权限策略管理 ============

  /**
   * 添加权限策略
   */
  async addPermission(entry: FilePermissionEntry): Promise<void> {
    const subject = buildSubject(entry.subjectType, entry.subjectId);
    const resource = buildResource(entry.resourceType, entry.resourceId);
    
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
  async addPermissions(entries: FilePermissionEntry[]): Promise<void> {
    if (entries.length === 0) return;
    
    const values = entries.map(entry => ({
      ptype: CASBIN_POLICY_TYPES.POLICY,
      v0: buildSubject(entry.subjectType, entry.subjectId),
      v1: buildResource(entry.resourceType, entry.resourceId),
      v2: entry.permission,
      v3: entry.effect,
    }));
    
    await this.db.insert(casbinRule).values(values).onConflictDoNothing();
  }

  /**
   * 移除权限策略
   */
  async removePermission(entry: Partial<FilePermissionEntry>): Promise<void> {
    const conditions = [eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY)];
    
    if (entry.subjectType && entry.subjectId) {
      conditions.push(eq(casbinRule.v0, buildSubject(entry.subjectType, entry.subjectId)));
    }
    if (entry.resourceType && entry.resourceId) {
      conditions.push(eq(casbinRule.v1, buildResource(entry.resourceType, entry.resourceId)));
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
  async getPermissionsForResource(
    resourceType: ResourceType, 
    resourceId: string
  ): Promise<FilePermissionEntry[]> {
    const resource = buildResource(resourceType, resourceId);
    
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
        resourceType,
        resourceId,
        permission: rule.v2 as FilePermission,
        effect: rule.v3 as PermissionEffect,
      };
    }).filter((e): e is FilePermissionEntry => e !== null);
  }

  /**
   * 设置资源的权限（替换现有权限）
   */
  async setPermissionsForResource(
    resourceType: ResourceType,
    resourceId: string,
    entries: Omit<FilePermissionEntry, 'resourceType' | 'resourceId'>[]
  ): Promise<void> {
    const resource = buildResource(resourceType, resourceId);
    
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
   * 设置资源继承关系（文件/文件夹继承父文件夹）
   */
  async setResourceParent(
    childType: ResourceType,
    childId: string,
    parentFolderId: string | null
  ): Promise<void> {
    const child = buildResource(childType, childId);
    
    // 删除现有继承关系
    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.RESOURCE_GROUPING),
        eq(casbinRule.v0, child)
      )
    );
    
    // 添加新继承关系
    if (parentFolderId) {
      const parent = buildResource('folder', parentFolderId);
      await this.db.insert(casbinRule).values({
        ptype: CASBIN_POLICY_TYPES.RESOURCE_GROUPING,
        v0: child,
        v1: parent,
      });
    }
  }

  /**
   * 获取资源的父级链（用于权限继承计算）
   */
  async getResourceAncestors(
    resourceType: ResourceType,
    resourceId: string
  ): Promise<string[]> {
    const ancestors: string[] = [];
    let current = buildResource(resourceType, resourceId);
    
    // 最多遍历 20 层防止无限循环
    for (let i = 0; i < 20; i++) {
      const rule = await this.db.select().from(casbinRule).where(
        and(
          eq(casbinRule.ptype, CASBIN_POLICY_TYPES.RESOURCE_GROUPING),
          eq(casbinRule.v0, current)
        )
      ).limit(1);
      
      if (rule.length === 0 || !rule[0].v1) break;
      
      ancestors.push(rule[0].v1);
      current = rule[0].v1;
    }
    
    return ancestors;
  }

  // ============ 权限检查 ============

  /**
   * 检查用户对资源的权限
   * 
   * 权限计算顺序：
   * 1. 检查直接权限（deny 优先）
   * 2. 检查角色权限
   * 3. 检查部门权限
   * 4. 检查继承权限（递归父级）
   */
  async checkPermission(
    userId: string,
    resourceType: ResourceType,
    resourceId: string,
    permission: FilePermission
  ): Promise<boolean> {
    const resource = buildResource(resourceType, resourceId);
    const userSubject = buildSubject('user', userId);
    
    // 获取用户的角色
    const userRoles = await this.getUserRoles(userId);
    const roleSubjects = userRoles.map(r => buildSubject('role', r));
    
    // 获取用户的部门（需要从外部传入或查询）
    // 这里简化处理，实际应该查询用户的部门
    const deptSubjects: string[] = [];
    
    // 所有可能的主体
    const allSubjects = [userSubject, ...roleSubjects, ...deptSubjects];
    
    // 获取资源及其所有祖先
    const ancestors = await this.getResourceAncestors(resourceType, resourceId);
    const allResources = [resource, ...ancestors];
    
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
    resourceType: ResourceType,
    resourceId: string
  ): Promise<EffectivePermission[]> {
    const resource = buildResource(resourceType, resourceId);
    const userSubject = buildSubject('user', userId);
    
    // 获取用户的角色
    const userRoles = await this.getUserRoles(userId);
    
    // 获取资源及其所有祖先
    const ancestors = await this.getResourceAncestors(resourceType, resourceId);
    const allResources = [resource, ...ancestors];
    
    // 查询所有相关权限
    const rules = await this.db.select().from(casbinRule).where(
      eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY)
    );
    
    const effectivePerms: EffectivePermission[] = [];
    const permissionSet = new Set<string>();
    
    for (const perm of Object.values(FILE_PERMISSIONS)) {
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
            sourceId: i === 0 ? undefined : res,
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
  async deleteResourcePermissions(
    resourceType: ResourceType,
    resourceId: string
  ): Promise<void> {
    const resource = buildResource(resourceType, resourceId);
    
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
   * 复制资源权限到另一个资源
   */
  async copyPermissions(
    sourceType: ResourceType,
    sourceId: string,
    targetType: ResourceType,
    targetId: string
  ): Promise<void> {
    const permissions = await this.getPermissionsForResource(sourceType, sourceId);
    
    const targetPermissions = permissions.map(p => ({
      subjectType: p.subjectType,
      subjectId: p.subjectId,
      permission: p.permission,
      effect: p.effect,
    }));
    
    await this.setPermissionsForResource(targetType, targetId, targetPermissions);
  }
}
