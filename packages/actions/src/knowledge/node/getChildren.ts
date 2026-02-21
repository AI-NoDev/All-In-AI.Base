/**
 * 获取子节点
 */

import { z } from 'zod';
import { eq, and, isNull, asc } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node, nodeZodSchemas, type NodeSelect } from '@qiyu-allinai/db/entities/knowledge';

export const nodeGetChildren = defineAction({
  meta: {
    name: 'knowledge.node.getChildren',
    displayName: '获取子节点',
    description: `获取指定父节点下的所有子节点。

**路径参数：**
- id: 父节点ID，使用 "root" 表示根目录

**查询参数：**
- type: 可选，筛选类型 "folder" | "file"

**返回：**
- data: 子节点数组，按类型和名称排序（文件夹在前）

**使用场景：**
- 文件管理器目录浏览
- 获取文件夹内容

**示例：**
GET /api/knowledge/nodes/root/children?type=folder`,
    tags: ['knowledge', 'node', 'query'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/children',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    querySchema: z.object({
      type: z.enum(['folder', 'file']).optional(),
    }).optional(),
    outputSchema: z.object({ data: z.array(nodeZodSchemas.select) }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const parentId = input.id === 'root' ? null : input.id;
    
    const conditions = [
      isNull(node.deletedAt),
      eq(node.createdById, context.currentUserId),
      parentId === null ? isNull(node.parentId) : eq(node.parentId, parentId),
    ];
    
    if (input.type) {
      conditions.push(eq(node.type, input.type));
    }
    
    const data = await db.select().from(node)
      .where(and(...conditions))
      .orderBy(asc(node.type), asc(node.orderNum), asc(node.name));
    
    return { data: data as NodeSelect[] };
  },
});
