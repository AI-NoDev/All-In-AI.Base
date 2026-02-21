/**
 * 获取节点路径 Action
 */

import { eq, and, isNull, inArray } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node } from '@qiyu-allinai/db/entities/knowledge';
import { nodeIdParamsSchema, pathOutputSchema } from './schemas';

export const nodeGetPath = defineAction({
  meta: { 
    name: 'knowledge.node.getPath', 
    displayName: '获取节点路径', 
    description: `获取节点的完整路径（面包屑导航）。

**路径参数：**
- id: 节点UUID

**返回：**
- data: 路径节点数组（从根到当前节点）
  - id: 节点ID
  - name: 节点名称
  - type: 节点类型

**使用场景：**
- 面包屑导航
- 显示文件完整路径

**示例响应：**
\`\`\`json
{
  "data": [
    { "id": "root-folder", "name": "文档", "type": "folder" },
    { "id": "sub-folder", "name": "项目", "type": "folder" },
    { "id": "current-file", "name": "readme.md", "type": "file" }
  ]
}
\`\`\``, 
    tags: ['knowledge', 'operations'], 
    method: 'GET', 
    path: '/api/knowledge/nodes/:id/path' 
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    outputSchema: pathOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [existing] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!existing) {
      return { data: [] };
    }
    
    const ancestorIds = existing.materializedPath 
      ? existing.materializedPath.split('/').filter(Boolean) 
      : [];
    
    if (ancestorIds.length === 0) {
      return { data: [{ id: existing.id, name: existing.name, type: existing.type as 'folder' | 'file' }] };
    }
    
    const ancestors = await db.select({ id: node.id, name: node.name, type: node.type })
      .from(node)
      .where(and(inArray(node.id, ancestorIds), isNull(node.deletedAt)));
    
    const ancestorMap = new Map(ancestors.map(a => [a.id, a]));
    const sortedAncestors = ancestorIds
      .map(id => ancestorMap.get(id))
      .filter((a): a is typeof ancestors[0] => a !== undefined);
    
    return {
      data: [
        ...sortedAncestors.map(a => ({ id: a.id, name: a.name, type: a.type as 'folder' | 'file' })),
        { id: existing.id, name: existing.name, type: existing.type as 'folder' | 'file' },
      ],
    };
  },
});
