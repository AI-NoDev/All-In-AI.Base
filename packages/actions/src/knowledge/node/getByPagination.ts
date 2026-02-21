/**
 * 分页查询节点
 */

import { z } from 'zod';
import { eq, and, isNull, ilike, sql, inArray, gte, lte, asc, desc } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node, nodeZodSchemas, type NodeSelect } from '@qiyu-allinai/db/entities/knowledge';
import { nodePaginationBodySchema } from './schemas';

export const nodeGetByPagination = defineAction({
  meta: {
    name: 'knowledge.node.getByPagination',
    displayName: '分页查询节点',
    description: `分页查询知识库节点列表，自动筛选当前用户的节点。

**请求体参数：**
- filter: 过滤条件，可选
  - ids: 节点ID数组（IN查询）
  - types: 类型数组 ["folder", "file"]
  - parentId: 父节点ID，null表示根目录
  - type: 单个类型 "folder" | "file"
  - name: 名称模糊匹配
  - extension: 扩展名模糊匹配
  - createdAtStart/createdAtEnd: 创建时间范围
  - isPublic: 是否公开
- sort: 排序，可选
  - field: "name" | "type" | "size" | "orderNum" | "createdAt" | "updatedAt"
  - order: "asc" | "desc"
- offset: 偏移量，默认0
- limit: 每页数量，默认20，最大100

**返回：**
- data: 节点数组
- total: 总数

**示例：**
\`\`\`json
{
  "filter": { "parentId": null, "type": "folder" },
  "sort": { "field": "name", "order": "asc" },
  "limit": 20, "offset": 0
}
\`\`\``,
    tags: ['knowledge', 'node', 'query'],
    method: 'POST',
    path: '/api/knowledge/nodes/query',
  },
  schemas: {
    bodySchema: nodePaginationBodySchema,
    outputSchema: z.object({ data: z.array(nodeZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    
    const conditions = [
      isNull(node.deletedAt),
      eq(node.createdById, context.currentUserId),
    ];
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(node.id, filter.ids));
      if (filter.types?.length) conditions.push(inArray(node.type, filter.types));
      if (filter.parentId !== undefined) {
        conditions.push(filter.parentId === null ? isNull(node.parentId) : eq(node.parentId, filter.parentId));
      }
      if (filter.type) conditions.push(eq(node.type, filter.type));
      if (filter.name) conditions.push(ilike(node.name, `%${filter.name}%`));
      if (filter.extension) conditions.push(ilike(node.extension, `%${filter.extension}%`));
      if (filter.createdAtStart) conditions.push(gte(node.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(node.createdAt, filter.createdAtEnd));
      if (filter.isPublic !== undefined) conditions.push(eq(node.isPublic, filter.isPublic));
    }
    
    const whereClause = and(...conditions);
    
    const orderDirection = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field || 'createdAt';
    
    const getOrderBy = () => {
      switch (sortField) {
        case 'name': return orderDirection(node.name);
        case 'type': return orderDirection(node.type);
        case 'size': return orderDirection(node.size);
        case 'orderNum': return orderDirection(node.orderNum);
        case 'updatedAt': return orderDirection(node.updatedAt);
        default: return orderDirection(node.createdAt);
      }
    };
    
    const data = await db.select().from(node)
      .where(whereClause)
      .orderBy(getOrderBy())
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(node).where(whereClause);
    return { data: data as NodeSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
