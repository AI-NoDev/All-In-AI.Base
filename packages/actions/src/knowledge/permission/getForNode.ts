/**
 * 获取节点权限 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node } from '@qiyu-allinai/db/entities/knowledge';
import { getPermissionAdapter, assertNodePermission } from '../utils';
import { nodeIdParamsSchema, permissionsOutputSchema } from './schemas';

export const permissionGetForNode = defineAction({
  meta: {
    name: 'knowledge.permission.getForNode',
    displayName: '获取节点权限',
    description: `获取节点的权限列表（所有被授权的主体）。

**路径参数：**
- id: 节点UUID

**权限检查：**
- 需要对该节点有 read 权限

**返回：**
- permissions: 权限数组
  - subjectType: "user" | "role" | "dept"
  - subjectId: 主体ID
  - resourceId: 节点ID
  - permission: "read" | "write" | "delete" | "manage"
  - effect: "allow" | "deny"

**示例：**
GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/permissions`,
    tags: ['knowledge', 'permission'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/permissions',
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    outputSchema: permissionsOutputSchema,
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
