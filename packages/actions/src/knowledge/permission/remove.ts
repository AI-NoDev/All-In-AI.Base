/**
 * 移除权限 Action
 */

import { defineAction } from '../../core/define';
import type { KnowledgePermission, SubjectType } from '@qiyu-allinai/db/casbin';
import { getPermissionAdapter } from '../utils';
import { assertCanManagePermission } from './utils';
import { removePermissionParamsSchema, removePermissionQuerySchema, successOutputSchema } from './schemas';

export const permissionRemove = defineAction({
  meta: {
    name: 'knowledge.permission.remove',
    displayName: '移除权限',
    description: `移除节点的权限条目。

**路径参数：**
- id: 节点UUID
- subjectType: "user" | "role" | "dept"
- subjectId: 主体ID

**查询参数：**
- permission: 可选，指定移除的权限类型；不指定则移除该主体的所有权限

**权限检查：**
- 需要是节点创建者或有 manage 权限

**返回：**
- success: 是否成功

**示例：**
DELETE /api/knowledge/nodes/node-uuid/permissions/user/user-uuid?permission=write`,
    tags: ['knowledge', 'permission'],
    method: 'DELETE',
    path: '/api/knowledge/nodes/:id/permissions/:subjectType/:subjectId',
  },
  schemas: {
    paramsSchema: removePermissionParamsSchema,
    querySchema: removePermissionQuerySchema,
    outputSchema: successOutputSchema,
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
