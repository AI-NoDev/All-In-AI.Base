/**
 * 知识库节点权限管理 (继承自 ResourcePermissionAdapter)
 * 
 * 统一的知识库权限处理器，支持：
 * - 用户、角色、部门三种主体
 * - read/write/delete/manage 四种权限
 * - 权限继承（子节点继承父节点权限）
 * - allow/deny 规则（deny 优先）
 */

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { 
  ResourcePermissionAdapter, 
  type PermissionEntry, 
  type EffectivePermission,
  type SubjectType,
  type PermissionEffect,
} from './resourcePermission';

// ============ 知识库权限常量 ============

/** 知识库权限类型 */
export const KNOWLEDGE_PERMISSIONS = {
  /** 读取 - 查看节点内容/列出子节点 */
  READ: 'read',
  /** 写入 - 修改节点/在目录中创建子节点 */
  WRITE: 'write',
  /** 删除 - 删除节点 */
  DELETE: 'delete',
  /** 管理 - 修改权限、移动、重命名 */
  MANAGE: 'manage',
} as const;

export type KnowledgePermission = typeof KNOWLEDGE_PERMISSIONS[keyof typeof KNOWLEDGE_PERMISSIONS];

// ============ 类型别名 ============

export type KnowledgePermissionEntry = PermissionEntry<KnowledgePermission>;
export type KnowledgeEffectivePermission = EffectivePermission<KnowledgePermission>;

// ============ 知识库权限适配器 ============

/**
 * 知识库节点权限适配器
 * 
 * 继承自 ResourcePermissionAdapter，提供知识库特定的权限管理功能
 */
export class KnowledgePermissionAdapter extends ResourcePermissionAdapter<KnowledgePermission> {
  protected readonly resourcePrefix = 'node';
  protected readonly permissions = Object.values(KNOWLEDGE_PERMISSIONS) as readonly KnowledgePermission[];

  constructor(db: PostgresJsDatabase) {
    super(db);
  }

  // ============ 知识库特定方法 ============

  /**
   * 设置节点继承关系（别名方法，语义更清晰）
   */
  async setNodeParent(nodeId: string, parentId: string | null): Promise<void> {
    return this.setResourceParent(nodeId, parentId);
  }

  /**
   * 获取节点的祖先链（别名方法）
   */
  async getNodeAncestors(nodeId: string): Promise<string[]> {
    return this.getResourceAncestors(nodeId);
  }

  /**
   * 获取节点的所有权限策略（别名方法）
   */
  async getPermissionsForNode(nodeId: string): Promise<KnowledgePermissionEntry[]> {
    return this.getPermissionsForResource(nodeId);
  }

  /**
   * 设置节点的权限（别名方法）
   */
  async setPermissionsForNode(
    nodeId: string,
    entries: Omit<KnowledgePermissionEntry, 'resourceId'>[]
  ): Promise<void> {
    return this.setPermissionsForResource(nodeId, entries);
  }

  /**
   * 删除节点的所有权限（别名方法）
   */
  async deleteNodePermissions(nodeId: string): Promise<void> {
    return this.deleteResourcePermissions(nodeId);
  }

  /**
   * 批量删除多个节点的权限（别名方法）
   */
  async deleteNodesPermissions(nodeIds: string[]): Promise<void> {
    return this.deleteResourcesPermissions(nodeIds);
  }

  /**
   * 检查用户是否有节点的完全控制权限
   */
  async hasFullControl(userId: string, nodeId: string, ancestorIds?: string[]): Promise<boolean> {
    const permissions = await this.getEffectivePermissions(userId, nodeId, ancestorIds);
    const allowedPerms = permissions.filter(p => p.effect === 'allow').map(p => p.permission);
    
    return (
      allowedPerms.includes(KNOWLEDGE_PERMISSIONS.READ) &&
      allowedPerms.includes(KNOWLEDGE_PERMISSIONS.WRITE) &&
      allowedPerms.includes(KNOWLEDGE_PERMISSIONS.DELETE) &&
      allowedPerms.includes(KNOWLEDGE_PERMISSIONS.MANAGE)
    );
  }

  /**
   * 快速授予用户对节点的读取权限
   */
  async grantReadAccess(nodeId: string, userId: string): Promise<void> {
    await this.addPermission({
      subjectType: 'user',
      subjectId: userId,
      resourceId: nodeId,
      permission: KNOWLEDGE_PERMISSIONS.READ,
      effect: 'allow',
    });
  }

  /**
   * 快速授予用户对节点的编辑权限（读+写）
   */
  async grantEditAccess(nodeId: string, userId: string): Promise<void> {
    await this.addPermissions([
      {
        subjectType: 'user',
        subjectId: userId,
        resourceId: nodeId,
        permission: KNOWLEDGE_PERMISSIONS.READ,
        effect: 'allow',
      },
      {
        subjectType: 'user',
        subjectId: userId,
        resourceId: nodeId,
        permission: KNOWLEDGE_PERMISSIONS.WRITE,
        effect: 'allow',
      },
    ]);
  }

  /**
   * 快速授予用户对节点的完全控制权限
   */
  async grantFullControl(nodeId: string, userId: string): Promise<void> {
    await this.addPermissions([
      {
        subjectType: 'user',
        subjectId: userId,
        resourceId: nodeId,
        permission: KNOWLEDGE_PERMISSIONS.READ,
        effect: 'allow',
      },
      {
        subjectType: 'user',
        subjectId: userId,
        resourceId: nodeId,
        permission: KNOWLEDGE_PERMISSIONS.WRITE,
        effect: 'allow',
      },
      {
        subjectType: 'user',
        subjectId: userId,
        resourceId: nodeId,
        permission: KNOWLEDGE_PERMISSIONS.DELETE,
        effect: 'allow',
      },
      {
        subjectType: 'user',
        subjectId: userId,
        resourceId: nodeId,
        permission: KNOWLEDGE_PERMISSIONS.MANAGE,
        effect: 'allow',
      },
    ]);
  }

  /**
   * 撤销用户对节点的所有权限
   */
  async revokeAllAccess(nodeId: string, userId: string): Promise<void> {
    await this.removePermission({
      subjectType: 'user',
      subjectId: userId,
      resourceId: nodeId,
    });
  }
}

// 重新导出基类类型
export type { SubjectType, PermissionEffect };
