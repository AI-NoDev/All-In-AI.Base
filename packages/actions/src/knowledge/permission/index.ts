/**
 * 知识库权限管理 Actions
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import type { DrizzleDB } from '../../core/types';
import { 
  KnowledgePermissionAdapter, 
  KNOWLEDGE_PERMISSIONS,
  type KnowledgePermission,
  type SubjectType,
} from '@qiyu-allinai/db/casbin';
import { node } from '@qiyu-allinai/db/entities/knowledge';
import { getPermissionAdapter, assertNodePermission } from '../utils';

// ============ Schema 定义 ============

const subjectTypeSchema = z.enum(['user', 'role', 'dept']);
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

// ============ 检查是否可以管理权限 ============
async function assertCanManagePermission(
  db: DrizzleDB,
  adapter: KnowledgePermissionAdapter,
  userId: string,
  nodeId: string
): Promise<void> {
  const [nodeRecord] = await db.select({ createdById: node.createdById })
    .from(node)
    .where(and(eq(node.id, nodeId), isNull(node.deletedAt)))
    .limit(1);
  
  if (nodeRecord?.createdById === userId) return;
  
  const hasManage = await adapter.checkPermission(userId, nodeId, 'manage');
  if (!hasManage) {
    throw ActionError.forbidden('error.knowledge.permissionDenied');
  }
}

// ============ 获取节点权限 ============
export const permissionGetForNode = defineAction({
  meta: {
    name: 'knowledge.permission.getForNode',
    displayName: '获取节点权限',
    description: '获取节点的权限列表',
    tags: ['knowledge', 'permission'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/permissions',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({
      permissions: z.array(z.object({
        subjectType: subjectTypeSchema,
        subjectId: z.string(),
        resourceId: z.string(),
        permission: permissionSchema,
        effect: effectSchema,
      })),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getPermissionAdapter(db);
    
    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }
    
    await assertNodePermission(db, context.currentUserId, nodeRecord, 'read');
    
    const permissions = await adapter.getPermissionsForNode(input.id);
    return { permissions };
  },
});

// ============ 设置节点权限 ============
export const permissionSetForNode = defineAction({
  meta: {
    name: 'knowledge.permission.setForNode',
    displayName: '设置节点权限',
    description: '设置节点的权限（替换现有权限）',
    tags: ['knowledge', 'permission'],
    method: 'PUT',
    path: '/api/knowledge/nodes/:id/permissions',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({
      permissions: z.array(permissionEntrySchema),
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getPermissionAdapter(db);
    
    await assertCanManagePermission(db, adapter, context.currentUserId, input.id);
    
    await adapter.setPermissionsForNode(input.id, input.permissions);
    
    return { success: true };
  },
});

// ============ 添加权限 ============
export const permissionAdd = defineAction({
  meta: {
    name: 'knowledge.permission.add',
    displayName: '添加权限',
    description: '为节点添加权限',
    tags: ['knowledge', 'permission'],
    method: 'POST',
    path: '/api/knowledge/nodes/:id/permissions',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: permissionEntrySchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getPermissionAdapter(db);
    
    await assertCanManagePermission(db, adapter, context.currentUserId, input.id);
    
    await adapter.addPermission({
      subjectType: input.subjectType as SubjectType,
      subjectId: input.subjectId,
      resourceId: input.id,
      permission: input.permission as KnowledgePermission,
      effect: input.effect,
    });
    
    return { success: true };
  },
});

// ============ 移除权限 ============
export const permissionRemove = defineAction({
  meta: {
    name: 'knowledge.permission.remove',
    displayName: '移除权限',
    description: '移除节点的权限',
    tags: ['knowledge', 'permission'],
    method: 'DELETE',
    path: '/api/knowledge/nodes/:id/permissions/:subjectType/:subjectId',
  },
  schemas: {
    paramsSchema: z.object({
      id: z.string(),
      subjectType: subjectTypeSchema,
      subjectId: z.string(),
    }),
    querySchema: z.object({
      permission: permissionSchema.optional(),
    }).optional(),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getPermissionAdapter(db);
    
    await assertCanManagePermission(db, adapter, context.currentUserId, input.id);
    
    await adapter.removePermission({
      subjectType: input.subjectType as SubjectType,
      subjectId: input.subjectId,
      resourceId: input.id,
      permission: input.permission as KnowledgePermission | undefined,
    });
    
    return { success: true };
  },
});

// ============ 获取有效权限 ============
export const permissionGetEffective = defineAction({
  meta: {
    name: 'knowledge.permission.getEffective',
    displayName: '获取有效权限',
    description: '获取用户对节点的有效权限',
    tags: ['knowledge', 'permission'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/effective-permissions',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    querySchema: z.object({
      userId: z.string().optional(),
    }).optional(),
    outputSchema: z.object({ data: z.array(effectivePermissionSchema) }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getPermissionAdapter(db);
    
    const targetUserId = input.userId || context.currentUserId;
    
    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }
    
    // 如果是创建人，返回所有权限
    if (nodeRecord.createdById === targetUserId) {
      return { data: Object.values(KNOWLEDGE_PERMISSIONS).map(p => ({
        permission: p,
        effect: 'allow' as const,
        source: 'direct' as const,
      })) };
    }
    
    const ancestorIds = nodeRecord.materializedPath 
      ? nodeRecord.materializedPath.split('/').filter(Boolean)
      : [];
    
    const permissions = await adapter.getEffectivePermissions(targetUserId, input.id, ancestorIds);
    return { data: permissions };
  },
});

// ============ 快捷共享 ============
export const permissionQuickShare = defineAction({
  meta: {
    name: 'knowledge.permission.quickShare',
    displayName: '快捷共享',
    description: '快速共享节点给用户',
    tags: ['knowledge', 'permission'],
    method: 'POST',
    path: '/api/knowledge/nodes/:id/quick-share',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({
      userIds: z.array(z.string()),
      level: z.enum(['read', 'edit', 'full']),
    }),
    outputSchema: z.object({ success: z.boolean(), sharedCount: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getPermissionAdapter(db);
    
    await assertCanManagePermission(db, adapter, context.currentUserId, input.id);
    
    let sharedCount = 0;
    
    for (const userId of input.userIds) {
      if (userId === context.currentUserId) continue;
      
      if (input.level === 'read') {
        await adapter.grantReadAccess(input.id, userId);
      } else if (input.level === 'edit') {
        await adapter.grantEditAccess(input.id, userId);
      } else {
        await adapter.grantFullControl(input.id, userId);
      }
      sharedCount++;
    }
    
    return { success: true, sharedCount };
  },
});

// ============ 取消共享 ============
export const permissionRevokeShare = defineAction({
  meta: {
    name: 'knowledge.permission.revokeShare',
    displayName: '取消共享',
    description: '取消用户对节点的所有权限',
    tags: ['knowledge', 'permission'],
    method: 'POST',
    path: '/api/knowledge/nodes/:id/revoke-share',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({
      userIds: z.array(z.string()),
    }),
    outputSchema: z.object({ success: z.boolean(), revokedCount: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getPermissionAdapter(db);
    
    await assertCanManagePermission(db, adapter, context.currentUserId, input.id);
    
    let revokedCount = 0;
    
    for (const userId of input.userIds) {
      await adapter.revokeAllAccess(input.id, userId);
      revokedCount++;
    }
    
    return { success: true, revokedCount };
  },
});

export const permissionActions = [
  permissionGetForNode,
  permissionSetForNode,
  permissionAdd,
  permissionRemove,
  permissionGetEffective,
  permissionQuickShare,
  permissionRevokeShare,
];
