/**
 * 搜索节点 Action
 */

import { eq, and, isNull, ilike } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node, type NodeSelect } from '@qiyu-allinai/db/entities/knowledge';
import { searchBodySchema, searchOutputSchema } from './schemas';

export const nodeSearch = defineAction({
  meta: { 
    name: 'knowledge.node.search', 
    displayName: '搜索节点', 
    description: `全文搜索知识库节点（按名称模糊匹配）。

**请求体参数：**
- keyword: 搜索关键词，必填，1-100字符
- type: 节点类型筛选，可选 "folder" | "file"
- limit: 返回数量限制，默认20，最大50

**返回：**
- data: 匹配的节点数组

**使用场景：**
- 文件搜索
- 快速定位文件

**示例：**
\`\`\`json
{
  "keyword": "readme",
  "type": "file",
  "limit": 10
}
\`\`\``, 
    tags: ['knowledge', 'operations'], 
    method: 'POST', 
    path: '/api/knowledge/nodes/search' 
  },
  schemas: {
    bodySchema: searchBodySchema,
    outputSchema: searchOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const searchPattern = '%' + input.keyword + '%';
    
    const conditions = [
      isNull(node.deletedAt),
      eq(node.createdById, context.currentUserId),
      ilike(node.name, searchPattern),
    ];
    
    if (input.type) {
      conditions.push(eq(node.type, input.type));
    }
    
    const results = await db.select().from(node)
      .where(and(...conditions))
      .limit(input.limit);
    
    return { data: results as NodeSelect[] };
  },
});
