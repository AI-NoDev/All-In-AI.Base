/**
 * 部门级别数据权限管理
 * 
 * 提供粗粒度的部门级别数据权限控制，支持：
 * - 4种数据范围：仅自己、当前部门、当前部门及子孙部门、自定义部门
 * - 3种权限范围：只读、可写、管理
 * - 适用于业务表：知识库、智能体、用户、部门、即时通讯
 * 
 * 设计说明：
 * - 部门权限是粗粒度的，用于控制用户可以访问哪些部门的数据
 * - 与资源权限（如知识库节点权限）是互补关系，不是替代关系
 * - 部门权限优先级：自定义 > 当前部门及子孙 > 当前部门 > 仅自己
 */

import { eq, and, like } from 'drizzle-orm';
import type { PgDatabase } from 'drizzle-orm/pg-core';
import { casbinRule, CASBIN_POLICY_TYPES } from '../entities/system/casbinRule';

/** Drizzle Database 类型 (兼容 postgres-js 和 PGlite) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrizzleDB = PgDatabase<any, any, any>;

// ============ 数据范围常量 ============

/** 数据范围类型 */
export const DATA_SCOPE = {
  /** 仅自己的数据 */
  SELF: 'self',
  /** 当前部门数据 */
  DEPT: 'dept',
  /** 当前部门及子孙部门数据 */
  DEPT_AND_CHILDREN: 'dept_children',
  /** 自定义部门数据 */
  CUSTOM: 'custom',
} as const;

export type DataScope = typeof DATA_SCOPE[keyof typeof DATA_SCOPE];

/** 权限范围类型 */
export const PERMISSION_SCOPE = {
  /** 只读 - 仅查看 */
  READ: 'read',
  /** 可写 - 查看和编辑 */
  WRITE: 'write',
  /** 管理 - 查看、编辑、删除、管理权限 */
  MANAGE: 'manage',
} as const;

export type PermissionScope = typeof PERMISSION_SCOPE[keyof typeof PERMISSION_SCOPE];

/** 业务模块类型 */
export const BUSINESS_MODULE = {
  /** 用户 */
  USER: 'user',
  /** 部门 */
  DEPARTMENT: 'department',
} as const;

export type BusinessModule = typeof BUSINESS_MODULE[keyof typeof BUSINESS_MODULE];

// ============ 类型定义 ============

/** 部门数据权限配置 */
export interface DeptDataPermission {
  /** 用户ID */
  userId: string;
  /** 业务模块 */
  module: BusinessModule;
  /** 数据范围 */
  dataScope: DataScope;
  /** 权限范围 */
  permissionScope: PermissionScope;
  /** 自定义部门ID列表（仅当 dataScope 为 custom 时有效） */
  customDeptIds?: string[];
}

/** 部门数据权限查询结果 */
export interface DeptDataPermissionResult {
  /** 数据范围 */
  dataScope: DataScope;
  /** 权限范围 */
  permissionScope: PermissionScope;
  /** 可访问的部门ID列表（已解析） */
  accessibleDeptIds: string[];
  /** 是否可以访问所有数据（系统管理员） */
  hasAllAccess: boolean;
}

/** 部门信息（用于查询） */
export interface DeptInfo {
  id: string;
  parentId: string | null;
  materializedPath: string;
}

// ============ 部门数据权限适配器 ============

/**
 * 部门数据权限适配器
 * 
 * Casbin 策略格式：
 * - p, user:{userId}, module:{module}, dataScope, permissionScope, customDeptIds
 * 
 * 示例：
 * - p, user:123, module:knowledge, dept_children, write, null
 * - p, user:456, module:agent, custom, read, dept1,dept2,dept3
 */
export class DepartmentPermissionAdapter {
  private db: DrizzleDB;

  constructor(db: DrizzleDB) {
    this.db = db;
  }

  // ============ 策略管理 ============

  /**
   * 设置用户的部门数据权限
   */
  async setPermission(permission: DeptDataPermission): Promise<void> {
    const subject = `user:${permission.userId}`;
    const resource = `module:${permission.module}`;
    const customDepts = permission.customDeptIds?.join(',') || null;

    // 先删除现有权限
    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v0, subject),
        eq(casbinRule.v1, resource)
      )
    );

    // 添加新权限
    await this.db.insert(casbinRule).values({
      ptype: CASBIN_POLICY_TYPES.POLICY,
      v0: subject,
      v1: resource,
      v2: permission.dataScope,
      v3: permission.permissionScope,
      v4: customDepts,
    });
  }

  /**
   * 批量设置用户的部门数据权限
   */
  async setPermissions(permissions: DeptDataPermission[]): Promise<void> {
    for (const permission of permissions) {
      await this.setPermission(permission);
    }
  }

  /**
   * 获取用户对某模块的部门数据权限
   */
  async getPermission(userId: string, module: BusinessModule): Promise<DeptDataPermission | null> {
    const subject = `user:${userId}`;
    const resource = `module:${module}`;

    const [rule] = await this.db.select().from(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v0, subject),
        eq(casbinRule.v1, resource)
      )
    ).limit(1);

    if (!rule) return null;

    return {
      userId,
      module,
      dataScope: rule.v2 as DataScope,
      permissionScope: rule.v3 as PermissionScope,
      customDeptIds: rule.v4 ? rule.v4.split(',') : undefined,
    };
  }

  /**
   * 获取用户的所有部门数据权限
   */
  async getAllPermissions(userId: string): Promise<DeptDataPermission[]> {
    const subject = `user:${userId}`;

    const rules = await this.db.select().from(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v0, subject),
        like(casbinRule.v1, 'module:%')
      )
    );

    return rules.map(rule => ({
      userId,
      module: rule.v1?.replace('module:', '') as BusinessModule,
      dataScope: rule.v2 as DataScope,
      permissionScope: rule.v3 as PermissionScope,
      customDeptIds: rule.v4 ? rule.v4.split(',') : undefined,
    }));
  }

  /**
   * 删除用户对某模块的部门数据权限
   */
  async removePermission(userId: string, module: BusinessModule): Promise<void> {
    const subject = `user:${userId}`;
    const resource = `module:${module}`;

    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v0, subject),
        eq(casbinRule.v1, resource)
      )
    );
  }

  /**
   * 删除用户的所有部门数据权限
   */
  async removeAllPermissions(userId: string): Promise<void> {
    const subject = `user:${userId}`;

    await this.db.delete(casbinRule).where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v0, subject),
        like(casbinRule.v1, 'module:%')
      )
    );
  }

  // ============ 权限检查 ============

  /**
   * 解析用户对某模块的数据权限
   * 
   * @param userId 用户ID
   * @param userDeptId 用户所属部门ID
   * @param module 业务模块
   * @param allDepts 所有部门列表（用于计算子孙部门）
   * @param isSystemAdmin 是否是系统管理员
   */
  async resolvePermission(
    userId: string,
    userDeptId: string | null,
    module: BusinessModule,
    allDepts: DeptInfo[],
    isSystemAdmin: boolean = false
  ): Promise<DeptDataPermissionResult> {
    // 系统管理员拥有所有权限
    if (isSystemAdmin) {
      return {
        dataScope: DATA_SCOPE.CUSTOM,
        permissionScope: PERMISSION_SCOPE.MANAGE,
        accessibleDeptIds: allDepts.map(d => d.id),
        hasAllAccess: true,
      };
    }

    const permission = await this.getPermission(userId, module);

    // 没有配置权限，默认只能访问自己的数据
    if (!permission) {
      return {
        dataScope: DATA_SCOPE.SELF,
        permissionScope: PERMISSION_SCOPE.READ,
        accessibleDeptIds: [],
        hasAllAccess: false,
      };
    }

    let accessibleDeptIds: string[] = [];

    switch (permission.dataScope) {
      case DATA_SCOPE.SELF:
        // 仅自己的数据，不需要部门ID
        accessibleDeptIds = [];
        break;

      case DATA_SCOPE.DEPT:
        // 当前部门数据
        if (userDeptId) {
          accessibleDeptIds = [userDeptId];
        }
        break;

      case DATA_SCOPE.DEPT_AND_CHILDREN:
        // 当前部门及子孙部门
        if (userDeptId) {
          const userDept = allDepts.find(d => d.id === userDeptId);
          if (userDept) {
            // 使用 materializedPath 查找所有子孙部门
            const userPath = userDept.materializedPath || userDeptId;
            accessibleDeptIds = allDepts
              .filter(d => 
                d.id === userDeptId || 
                d.materializedPath.startsWith(userPath + '/')
              )
              .map(d => d.id);
          }
        }
        break;

      case DATA_SCOPE.CUSTOM:
        // 自定义部门
        accessibleDeptIds = permission.customDeptIds || [];
        break;
    }

    return {
      dataScope: permission.dataScope,
      permissionScope: permission.permissionScope,
      accessibleDeptIds,
      hasAllAccess: false,
    };
  }

  /**
   * 检查用户是否可以访问指定部门的数据
   */
  async canAccessDept(
    userId: string,
    userDeptId: string | null,
    targetDeptId: string,
    module: BusinessModule,
    allDepts: DeptInfo[],
    isSystemAdmin: boolean = false
  ): Promise<boolean> {
    const result = await this.resolvePermission(userId, userDeptId, module, allDepts, isSystemAdmin);
    
    if (result.hasAllAccess) return true;
    if (result.dataScope === DATA_SCOPE.SELF) return false;
    
    return result.accessibleDeptIds.includes(targetDeptId);
  }

  /**
   * 检查用户是否有写权限
   */
  async canWrite(
    userId: string,
    module: BusinessModule,
    isSystemAdmin: boolean = false
  ): Promise<boolean> {
    if (isSystemAdmin) return true;

    const permission = await this.getPermission(userId, module);
    if (!permission) return false;

    return permission.permissionScope === PERMISSION_SCOPE.WRITE || 
           permission.permissionScope === PERMISSION_SCOPE.MANAGE;
  }

  /**
   * 检查用户是否有管理权限
   */
  async canManage(
    userId: string,
    module: BusinessModule,
    isSystemAdmin: boolean = false
  ): Promise<boolean> {
    if (isSystemAdmin) return true;

    const permission = await this.getPermission(userId, module);
    if (!permission) return false;

    return permission.permissionScope === PERMISSION_SCOPE.MANAGE;
  }
}

// ============ 辅助函数 ============

/**
 * 根据 materializedPath 获取部门的所有子孙部门ID
 */
export function getDescendantDeptIds(
  deptId: string,
  deptPath: string,
  allDepts: DeptInfo[]
): string[] {
  const pathPrefix = deptPath ? `${deptPath}/` : `${deptId}/`;
  return allDepts
    .filter(d => d.materializedPath.startsWith(pathPrefix))
    .map(d => d.id);
}

/**
 * 根据 materializedPath 获取部门的所有祖先部门ID
 */
export function getAncestorDeptIds(materializedPath: string): string[] {
  if (!materializedPath) return [];
  return materializedPath.split('/').filter(Boolean);
}

/**
 * 构建部门的 materializedPath
 */
export function buildMaterializedPath(parentPath: string | null, deptId: string): string {
  if (!parentPath) return deptId;
  return `${parentPath}/${deptId}`;
}
