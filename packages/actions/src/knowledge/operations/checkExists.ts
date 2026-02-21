/**
 * 检查节点是否存在 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node } from '@qiyu-allinai/db/entities/knowledge';
import { checkExistsBodySchema, checkExistsOutputSchema } from './schemas';

export const nodeCheckExists = defineAction({
  meta: { 
    name: 'knowledge.node.checkExists', 
    displayName: '检查节点是否存在', 
    description: `检查指定父节点下是否存在同名节点（批量检查）。

**请求体参数：**
- parentId: 父节点ID，可选，null表示根目录
- names: 要检查的名称数组，必填
- type: 节点类型筛选，可选 "folder" | "file"

**返回：**
- exists: 已存在的节点数组
  - name: 文件名
  - nodeId: 节点ID
  - type: 类型
  - size: 大小
  - updatedAt: 更新时间

**使用场景：**
- 上传前检查文件是否存在
- 批量操作前的冲突检测

**示例：**
\`\`\`json
{
  "parentId": "folder-uuid",
  "names": ["file1.txt", "file2.txt", "folder1"],
  "type": "file"
}
\`\`\``, 
    tags: ['knowledge', 'operations'], 
    method: 'POST', 
    path: '/api/knowledge/nodes/check-exists' 
  },
  schemas: {
    bodySchema: checkExistsBodySchema,
    outputSchema: checkExistsOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const parentId = input.parentId ?? null;
    const parentCondition = parentId === null ? isNull(node.parentId) : eq(node.parentId, parentId);
    
    const conditions = [
      parentCondition,
      isNull(node.deletedAt),
      eq(node.createdById, context.currentUserId),
    ];
    
    if (input.type) {
      conditions.push(eq(node.type, input.type));
    }
    
    const existingNodes = await db.select({
      id: node.id,
      name: node.name,
      type: node.type,
      size: node.size,
      updatedAt: node.updatedAt,
    }).from(node).where(and(...conditions));
    
    const nameSet = new Set(input.names);
    const matches = existingNodes.filter(n => nameSet.has(n.name));
    
    return {
      exists: matches.map(n => ({
        name: n.name,
        nodeId: n.id,
        type: n.type as 'folder' | 'file',
        size: n.size,
        updatedAt: n.updatedAt,
      })),
    };
  },
});
