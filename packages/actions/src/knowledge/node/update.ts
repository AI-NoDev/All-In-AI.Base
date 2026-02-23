/**
 * 更新节点
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeSchemas, NODE_TYPES, type NodeSelect, type NodeInsert } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';
import { nodeUpdateBodySchema } from './schemas';

export const nodeUpdate = defineAction({
  meta: {
    name: 'knowledge.node.update',
    displayName: '更新节点',
    description: `更新节点信息（重命名、修改描述等）。

**路径参数：**
- id: 节点UUID

**请求体参数（均可选）：**
- name: 新名称，1-255字符
- description: 描述
- icon: 图标（文件夹）
- color: 颜色（文件夹）
- orderNum: 排序号
- isPublic: 是否公开
- tags: 标签数组

**权限检查：**
- 需要对该节点有 write 权限

**返回：**
- 更新后的节点完整信息

**示例：**
\`\`\`json
{
  "name": "新文件名.md",
  "description": "更新的描述",
  "tags": ["重要", "工作"]
}
\`\`\``,
    tags: ['knowledge', 'node', 'mutation'],
    method: 'PUT',
    path: '/api/knowledge/nodes/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: nodeUpdateBodySchema,
    outputSchema: nodeSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [existing] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!existing) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }
    
    await assertNodePermission(db, context.currentUserId, existing, 'write');
    
    const updateData: Partial<NodeInsert> = {
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    };
    
    if (input.name !== undefined) {
      updateData.name = input.name;
      if (existing.type === NODE_TYPES.FILE) {
        updateData.originalName = input.name;
        const ext = input.name.split('.').pop() || '';
        updateData.extension = ext;
      }
    }
    if (input.description !== undefined) updateData.description = input.description;
    if (input.icon !== undefined) updateData.icon = input.icon;
    if (input.color !== undefined) updateData.color = input.color;
    if (input.orderNum !== undefined) updateData.orderNum = input.orderNum;
    if (input.isPublic !== undefined) updateData.isPublic = input.isPublic;
    if (input.tags !== undefined) updateData.tags = input.tags;
    
    const [result] = await db.update(node)
      .set(updateData)
      .where(eq(node.id, input.id))
      .returning();
    
    return result as NodeSelect;
  },
});
