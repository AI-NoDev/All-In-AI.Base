/**
 * 分页查询版本 Action
 */

import { eq, and, sql, inArray, gte, lte, asc, desc } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { nodeVersion, type NodeVersionSelect } from '@qiyu-allinai/db/entities/knowledge';
import { versionPaginationBodySchema, versionPaginationOutputSchema } from './schemas';

export const versionGetByPagination = defineAction({
  meta: {
    ignoreTools: true,
    name: 'knowledge.version.getByPagination',
    displayName: '分页查询版本',
    description: `分页查询文件版本列表。

**请求体参数：**
- filter: 过滤条件，可选
  - nodeIds: 节点ID数组（IN查询）
  - nodeId: 单个节点ID
  - versionNumber: 版本号模糊匹配
  - createdAtStart/createdAtEnd: 创建时间范围
- sort: 排序，可选
  - field: "versionNumber" | "size" | "createdAt"
  - order: "asc" | "desc"
- offset: 偏移量，默认0
- limit: 每页数量，默认20，最大100

**返回：**
- data: 版本数组
- total: 总数

**示例：**
\`\`\`json
{
  "filter": { "nodeId": "file-uuid" },
  "sort": { "field": "createdAt", "order": "desc" },
  "limit": 10
}
\`\`\``,
    tags: ['knowledge', 'version'],
    method: 'POST',
    path: '/api/knowledge/versions/query',
  },
  schemas: {
    bodySchema: versionPaginationBodySchema,
    outputSchema: versionPaginationOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    
    const conditions = [];
    
    if (filter) {
      if (filter.nodeIds?.length) conditions.push(inArray(nodeVersion.nodeId, filter.nodeIds));
      if (filter.nodeId) conditions.push(eq(nodeVersion.nodeId, filter.nodeId));
      if (filter.versionNumber) conditions.push(sql`${nodeVersion.versionNumber} ILIKE ${'%' + filter.versionNumber + '%'}`);
      if (filter.createdAtStart) conditions.push(gte(nodeVersion.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(nodeVersion.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    
    let sortColumn;
    if (sort?.field === 'versionNumber') {
      sortColumn = nodeVersion.versionNumber;
    } else if (sort?.field === 'size') {
      sortColumn = nodeVersion.size;
    } else {
      sortColumn = nodeVersion.createdAt;
    }
    
    const data = await db.select().from(nodeVersion)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(nodeVersion)
      .where(whereClause);
    
    return { data: data as NodeVersionSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
