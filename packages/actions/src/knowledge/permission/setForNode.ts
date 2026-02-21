/**
 * 设置节点权限 Action
 */

import { defineAction } from '../../core/define';
import { getPermissionAdapter } from '../utils';
import { assertCanManagePermission } from './utils';
import { nodeIdParamsSchema, setPermissionsBodySchema, successOutputSchema } from './schemas';

export const permissionSetForNode = defineAction({
  meta: {
    name: 'knowledge.permission.setForNode',
    displayName: '设置节点权限',
    description: `设置节点的权限（替换现有所有权限）。

**路径参数：**
- id: 节点UUID

**请求体参数：**
- permissions: 权限数组
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
  "permissions": [
    { "subjectType": "user", "subjectId": "user-uuid", "permission": "read" },
    { "subjectType": "role", "subjectId": "role-uuid", "permission": "write" }
  ]
}
\`\`\``,
    tags: ['knowledge', 'permission'],
    method: 'PUT',
    path: '/api/knowledge/nodes/:id/permissions',
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    bodySchema: setPermissionsBodySchema,
    outputSchema: successOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const adapter = getPermissionAdapter(db);
    
    await assertCanManagePermission(db, adapter, context.currentUserId, input.id);
    
    await adapter.setPermissionsForNode(input.id, input.permissions);
    
    return { success: true };
  },
});
