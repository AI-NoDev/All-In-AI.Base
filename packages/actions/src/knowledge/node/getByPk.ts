/**
 * 根据ID查询节点
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node, nodeSchemas, type NodeSelect } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';

export const nodeGetByPk = defineAction({
  meta: {
    name: 'knowledge.node.getByPk',
    displayName: '根据ID查询节点',
    description: `根据主键ID查询单个节点详情。

**路径参数：**
- id: 节点UUID

**返回：**
- 节点完整信息，包含 id, name, type, path, size, mimeType 等
- 如果节点不存在或无权限，返回 null

**权限检查：**
- 需要对该节点有 read 权限

**示例：**
GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['knowledge', 'node', 'query'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([nodeSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!result) return null;
    
    await assertNodePermission(db, context.currentUserId, result, 'read');
    
    return result as NodeSelect;
  },
});
