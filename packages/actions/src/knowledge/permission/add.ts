/**
 * 添加权限 Action
 */

import { defineAction } from '../../core/define';
import type { KnowledgePermission, SubjectType } from '@qiyu-allinai/db/casbin';
import { getPermissionAdapter } from '../utils';
import { assertCanManagePermission } from './utils';
import { nodeIdParamsSchema, permissionEntrySchema, successOutputSchema } from './schemas';

export const permissionAdd = defineAction({
  meta: {
    ignoreTools: true,
    name: 'knowledge.permission.add',
    displayName: '添加权限',
    description: `为节点添加单个权限条目。

**路径参数：**
- id: 节点UUID

**请求体参数：**
- subjectType: "user" | "role" | "dept"
- subjectId: 主体ID
- permission: "read" | "write" | "delete" | "manage"
- effect: "allow" | "deny"，默认 "allow"

**权限检查：**
- 需要是节点创建者或有 manage 权限

**返回：**
- success: 是否成功

**示例：**
\`\`\`json
{
  "subjectType": "user",
  "subjectId": "user-uuid",
  "permission": "write",
  "effect": "allow"
}
\`\`\``,
    tags: ['knowledge', 'permission'],
    method: 'POST',
    path: '/api/knowledge/nodes/:id/permissions',
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    bodySchema: permissionEntrySchema,
    outputSchema: successOutputSchema,
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
