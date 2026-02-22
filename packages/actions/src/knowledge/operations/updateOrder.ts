/**
 * 更新节点排序 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node } from '@qiyu-allinai/db/entities/knowledge';
import { checkNodePermission } from '../utils';
import { updateOrderBodySchema, updateOrderOutputSchema } from './schemas';

export const nodeUpdateOrder = defineAction({
  meta: { 
    ignoreTools: true,
    name: 'knowledge.node.updateOrder',
    displayName: '更新节点排序', 
    description: `批量更新节点排序号。

**请求体参数：**
- items: 排序项数组
  - id: 节点UUID
  - orderNum: 新排序号（整数）

**权限检查：**
- 逐个检查 write 权限，无权限的节点会被跳过

**返回：**
- success: 是否成功
- updatedCount: 实际更新的节点数量

**使用场景：**
- 拖拽排序
- 自定义文件顺序

**示例：**
\`\`\`json
{
  "items": [
    { "id": "uuid1", "orderNum": 1 },
    { "id": "uuid2", "orderNum": 2 },
    { "id": "uuid3", "orderNum": 3 }
  ]
}
\`\`\``, 
    tags: ['knowledge', 'operations'], 
    method: 'PUT', 
    path: '/api/knowledge/nodes/order' 
  },
  schemas: {
    bodySchema: updateOrderBodySchema,
    outputSchema: updateOrderOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    let updatedCount = 0;
    
    for (const item of input.items) {
      const [existing] = await db.select().from(node)
        .where(and(eq(node.id, item.id), isNull(node.deletedAt)))
        .limit(1);
      
      if (!existing) continue;
      
      const hasPermission = await checkNodePermission(db, context.currentUserId, existing, 'write');
      if (!hasPermission) continue;
      
      await db.update(node)
        .set({
          orderNum: item.orderNum,
          updatedBy: context.currentUserName,
          updatedById: context.currentUserId,
        })
        .where(eq(node.id, item.id));
      
      updatedCount++;
    }
    
    return { success: true, updatedCount };
  },
});
