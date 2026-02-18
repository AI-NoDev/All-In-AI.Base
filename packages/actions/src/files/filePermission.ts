/**
 * 文件权限 Actions
 * 
 * 基于 Casbin 的文件系统权限管理 API
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../core/define';
import { ActionError } from '../core/errors';
import type { DrizzleDB } from '../core/types';
import { 
  FilePermissionAdapter, 
  type FilePermission,
  type PermissionEffect,
  type SubjectType,
  type ResourceType,
} from '@qiyu-allinai/db/casbin';
import { file, folder } from '@qiyu-allinai/db/entities/knowledge';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// 创建适配器实例
const getAdapter = (db: DrizzleDB) => new FilePermissionAdapter(db as PostgresJsDatabase);

// 检查用户是否有权限管理资源（创建人或有 manage 权限）
async function assertCanManagePermission(
  db: DrizzleDB,
  adapter: FilePermissionAdapter,
  userId: string,
  resourceType: ResourceType,
  resourceId: string
): Promise<void> {
  // 检查是否是资源创建人
  if (resourceType === 'file') {
    const [fileRecord] = await db.select({ createdById: file.createdById })
      .from(file)
      .where(and(eq(file.id, resourceId), isNull(file.deletedAt)))
      .limit(1);
    if (fileRecord?.createdById === userId) return;
  } else {
    const [folderRecord] = await db.select({ createdById: folder.createdById })
      .from(folder)
      .where(and(eq(folder.id, resourceId), isNull(folder.deletedAt)))
      .limit(1);
    if (folderRecord?.createdById === userId) return;
  }
  
  // 检查是否有 manage 权限
  const hasManage = await adapter.checkPermission(userId, resourceType, resourceId, 'manage');
  if (!hasManage) {
    throw ActionError.forbidden('error.files.permissionDenied');
  }
}

// ============ Schema 定义 ============

const subjectTypeSchema = z.enum(['user', 'role', 'dept']);
const resourceTypeSchema = z.enum(['file', 'folder']);
const permissionSchema = z.enum(['read', 'write', 'delete', 'manage']);
const effectSchema = z.enum(['allow', 'deny']);

const permissionEntrySchema = z.object({
  subjectType: subjectTypeSchema,
  subjectId: z.string(),
  permission: permissionSchema,
  effect: effectSchema.default('allow'),
});

const effectivePermissionSchema = z.object({
  permission: permissionSchema,
  effect: effectSchema,
  source: z.enum(['direct', 'inherited', 'role', 'dept']),
  sourceId: z.string().optional(),
});

// ============ Actions ============

/**
 * 获取资源的权限列表
 */
export const filePermissionGetForResource = defineAction({
  meta: {
    name: 'files.permission.getForResource',
    displayName: '获取资源权限',
    description: '获取文件或文件夹的权限列表',
    tags: ['files', 'permission'],
    method: 'GET',
    path: '/api/files/permission/:resourceType/:resourceId',
  },
  schemas: {
    paramsSchema: z.object({
      resourceType: resourceTypeSchema,
      resourceId: z.string(),
    }),
    outputSchema: z.array(z.object({
      subjectType: subjectTypeSchema,
      subjectId: z.string(),
      resourceType: resourceTypeSchema,
      resourceId: z.string(),
      permission: permissionSchema,
      effect: effectSchema,
    })),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getAdapter(db);
    return adapter.getPermissionsForResource(
      input.resourceType as ResourceType,
      input.resourceId
    );
  },
});

/**
 * 设置资源的权限（替换现有权限）
 */
export const filePermissionSetForResource = defineAction({
  meta: {
    name: 'files.permission.setForResource',
    displayName: '设置资源权限',
    description: '设置文件或文件夹的权限（替换现有权限）',
    tags: ['files', 'permission'],
    method: 'POST',
    path: '/api/files/permission/:resourceType/:resourceId',
  },
  schemas: {
    paramsSchema: z.object({
      resourceType: resourceTypeSchema,
      resourceId: z.string(),
    }),
    bodySchema: z.object({
      permissions: z.array(permissionEntrySchema),
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getAdapter(db);
    
    // 权限检查：只有创建人或有 manage 权限的用户可以设置权限
    await assertCanManagePermission(db, adapter, context.currentUserId, input.resourceType as ResourceType, input.resourceId);
    
    await adapter.setPermissionsForResource(
      input.resourceType as ResourceType,
      input.resourceId,
      input.permissions.map(p => ({
        subjectType: p.subjectType as SubjectType,
        subjectId: p.subjectId,
        permission: p.permission as FilePermission,
        effect: p.effect as PermissionEffect,
      }))
    );
    return { success: true };
  },
});

/**
 * 添加单个权限
 */
export const filePermissionAdd = defineAction({
  meta: {
    name: 'files.permission.add',
    displayName: '添加权限',
    description: '为资源添加单个权限',
    tags: ['files', 'permission'],
    method: 'POST',
    path: '/api/files/permission',
  },
  schemas: {
    bodySchema: z.object({
      resourceType: resourceTypeSchema,
      resourceId: z.string(),
      subjectType: subjectTypeSchema,
      subjectId: z.string(),
      permission: permissionSchema,
      effect: effectSchema.default('allow'),
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getAdapter(db);
    
    // 权限检查：只有创建人或有 manage 权限的用户可以添加权限
    await assertCanManagePermission(db, adapter, context.currentUserId, input.resourceType as ResourceType, input.resourceId);
    
    await adapter.addPermission({
      resourceType: input.resourceType as ResourceType,
      resourceId: input.resourceId,
      subjectType: input.subjectType as SubjectType,
      subjectId: input.subjectId,
      permission: input.permission as FilePermission,
      effect: input.effect as PermissionEffect,
    });
    return { success: true };
  },
});

/**
 * 移除权限
 */
export const filePermissionRemove = defineAction({
  meta: {
    name: 'files.permission.remove',
    displayName: '移除权限',
    description: '移除资源的权限',
    tags: ['files', 'permission'],
    method: 'DELETE',
    path: '/api/files/permission/:resourceType/:resourceId/:subjectType/:subjectId/:permission',
  },
  schemas: {
    paramsSchema: z.object({
      resourceType: resourceTypeSchema,
      resourceId: z.string(),
      subjectType: subjectTypeSchema,
      subjectId: z.string(),
      permission: permissionSchema,
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getAdapter(db);
    
    // 权限检查：只有创建人或有 manage 权限的用户可以移除权限
    await assertCanManagePermission(db, adapter, context.currentUserId, input.resourceType as ResourceType, input.resourceId);
    
    await adapter.removePermission({
      resourceType: input.resourceType as ResourceType,
      resourceId: input.resourceId,
      subjectType: input.subjectType as SubjectType,
      subjectId: input.subjectId,
      permission: input.permission as FilePermission,
    });
    return { success: true };
  },
});

/**
 * 检查用户权限
 */
export const filePermissionCheck = defineAction({
  meta: {
    name: 'files.permission.check',
    displayName: '检查权限',
    description: '检查用户对资源的权限',
    tags: ['files', 'permission'],
    method: 'POST',
    path: '/api/files/permission/check',
  },
  schemas: {
    bodySchema: z.object({
      userId: z.string(),
      resourceType: resourceTypeSchema,
      resourceId: z.string(),
      permission: permissionSchema,
    }),
    outputSchema: z.object({ allowed: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getAdapter(db);
    const allowed = await adapter.checkPermission(
      input.userId,
      input.resourceType as ResourceType,
      input.resourceId,
      input.permission as FilePermission
    );
    return { allowed };
  },
});

/**
 * 获取用户对资源的有效权限
 */
export const filePermissionGetEffective = defineAction({
  meta: {
    name: 'files.permission.getEffective',
    displayName: '获取有效权限',
    description: '获取用户对资源的所有有效权限（包括继承的权限）',
    tags: ['files', 'permission'],
    method: 'GET',
    path: '/api/files/permission/effective/:resourceType/:resourceId',
  },
  schemas: {
    paramsSchema: z.object({
      resourceType: resourceTypeSchema,
      resourceId: z.string(),
    }),
    outputSchema: z.array(effectivePermissionSchema),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getAdapter(db);
    return adapter.getEffectivePermissions(
      context.currentUserId,
      input.resourceType as ResourceType,
      input.resourceId
    );
  },
});

/**
 * 设置资源的父级（用于权限继承）
 */
export const filePermissionSetParent = defineAction({
  meta: {
    name: 'files.permission.setParent',
    displayName: '设置资源父级',
    description: '设置文件或文件夹的父级文件夹（用于权限继承）',
    tags: ['files', 'permission'],
    method: 'POST',
    path: '/api/files/permission/parent',
  },
  schemas: {
    bodySchema: z.object({
      resourceType: resourceTypeSchema,
      resourceId: z.string(),
      parentFolderId: z.string().nullable(),
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getAdapter(db);
    
    // 权限检查：只有创建人或有 manage 权限的用户可以设置父级
    await assertCanManagePermission(db, adapter, context.currentUserId, input.resourceType as ResourceType, input.resourceId);
    
    await adapter.setResourceParent(
      input.resourceType as ResourceType,
      input.resourceId,
      input.parentFolderId
    );
    return { success: true };
  },
});

/**
 * 复制资源权限
 */
export const filePermissionCopy = defineAction({
  meta: {
    name: 'files.permission.copy',
    displayName: '复制权限',
    description: '将一个资源的权限复制到另一个资源',
    tags: ['files', 'permission'],
    method: 'POST',
    path: '/api/files/permission/copy',
  },
  schemas: {
    bodySchema: z.object({
      sourceType: resourceTypeSchema,
      sourceId: z.string(),
      targetType: resourceTypeSchema,
      targetId: z.string(),
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getAdapter(db);
    
    // 权限检查：需要对目标资源有 manage 权限
    await assertCanManagePermission(db, adapter, context.currentUserId, input.targetType as ResourceType, input.targetId);
    
    await adapter.copyPermissions(
      input.sourceType as ResourceType,
      input.sourceId,
      input.targetType as ResourceType,
      input.targetId
    );
    return { success: true };
  },
});

/**
 * 删除资源的所有权限
 */
export const filePermissionDeleteAll = defineAction({
  meta: {
    name: 'files.permission.deleteAll',
    displayName: '删除所有权限',
    description: '删除资源的所有权限和继承关系',
    tags: ['files', 'permission'],
    method: 'DELETE',
    path: '/api/files/permission/all/:resourceType/:resourceId',
  },
  schemas: {
    paramsSchema: z.object({
      resourceType: resourceTypeSchema,
      resourceId: z.string(),
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getAdapter(db);
    
    // 权限检查：只有创建人或有 manage 权限的用户可以删除所有权限
    await assertCanManagePermission(db, adapter, context.currentUserId, input.resourceType as ResourceType, input.resourceId);
    
    await adapter.deleteResourcePermissions(
      input.resourceType as ResourceType,
      input.resourceId
    );
    return { success: true };
  },
});

// 导出所有 Actions
export const filePermissionActions = [
  filePermissionGetForResource,
  filePermissionSetForResource,
  filePermissionAdd,
  filePermissionRemove,
  filePermissionCheck,
  filePermissionGetEffective,
  filePermissionSetParent,
  filePermissionCopy,
  filePermissionDeleteAll,
];
