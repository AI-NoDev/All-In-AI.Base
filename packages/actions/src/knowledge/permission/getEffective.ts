/**
 * 获取有效权限 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { KNOWLEDGE_PERMISSIONS } from '@qiyu-allinai/db/casbin';
import { node } from '@qiyu-allinai/db/entities/knowledge';
import { getPermissionAdapter } from '../utils';
import { nodeIdParamsSchema, effectivePermissionQuerySchema, effectivePermissionsOutputSchema } from './schemas';

export const permissionGetEffective = defineAction({
  meta: {
    ignoreTools: true,
    name: 'knowledge.permission.getEffective',
    displayName: '获取有效权限',
    description: `获取用户对节点的有效权限（考虑继承和角色）。

**路径参数：**
- id: 节点UUID

**查询参数：**
- userId: 可选，目标用户ID；不指定则查询当前用户

**返回：**
- data: 有效权限数组
  - permission: "read" | "write" | "delete" | "manage"
  - effect: "allow" | "deny"
  - source: "direct" | "inherited" | "role" | "dept"（权限来源）
  - sourceId: 来源ID（如角色ID）

**特殊情况：**
- 节点创建者自动拥有所有权限

**示例：**
GET /api/knowledge/nodes/node-uuid/effective-permissions?userId=user-uuid`,
    tags: ['knowledge', 'permission'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/effective-permissions',
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    querySchema: effectivePermissionQuerySchema,
    outputSchema: effectivePermissionsOutputSchema,
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
