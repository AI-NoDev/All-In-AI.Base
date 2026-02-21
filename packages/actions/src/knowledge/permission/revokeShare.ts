/**
 * 取消共享 Action
 */

import { defineAction } from '../../core/define';
import { getPermissionAdapter } from '../utils';
import { assertCanManagePermission } from './utils';
import { nodeIdParamsSchema, revokeShareBodySchema, revokeShareOutputSchema } from './schemas';

export const permissionRevokeShare = defineAction({
  meta: {
    name: 'knowledge.permission.revokeShare',
    displayName: '取消共享',
    description: `取消用户对节点的所有权限（批量撤销）。

**路径参数：**
- id: 节点UUID

**请求体参数：**
- userIds: 用户ID数组

**权限检查：**
- 需要是节点创建者或有 manage 权限

**返回：**
- success: 是否成功
- revokedCount: 撤销的用户数

**示例：**
\`\`\`json
{
  "userIds": ["user1-uuid", "user2-uuid"]
}
\`\`\``,
    tags: ['knowledge', 'permission'],
    method: 'POST',
    path: '/api/knowledge/nodes/:id/revoke-share',
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    bodySchema: revokeShareBodySchema,
    outputSchema: revokeShareOutputSchema,
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
