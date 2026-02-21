/**
 * 快捷共享 Action
 */

import { defineAction } from '../../core/define';
import { getPermissionAdapter } from '../utils';
import { assertCanManagePermission } from './utils';
import { nodeIdParamsSchema, quickShareBodySchema, quickShareOutputSchema } from './schemas';

export const permissionQuickShare = defineAction({
  meta: {
    name: 'knowledge.permission.quickShare',
    displayName: '快捷共享',
    description: `快速共享节点给多个用户（简化的权限设置）。

**路径参数：**
- id: 节点UUID

**请求体参数：**
- userIds: 用户ID数组
- level: 共享级别
  - "read": 只读（read权限）
  - "edit": 可编辑（read + write权限）
  - "full": 完全控制（read + write + delete + manage权限）

**权限检查：**
- 需要是节点创建者或有 manage 权限

**返回：**
- success: 是否成功
- sharedCount: 实际共享的用户数（排除自己）

**示例：**
\`\`\`json
{
  "userIds": ["user1-uuid", "user2-uuid"],
  "level": "edit"
}
\`\`\``,
    tags: ['knowledge', 'permission'],
    method: 'POST',
    path: '/api/knowledge/nodes/:id/quick-share',
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    bodySchema: quickShareBodySchema,
    outputSchema: quickShareOutputSchema,
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
