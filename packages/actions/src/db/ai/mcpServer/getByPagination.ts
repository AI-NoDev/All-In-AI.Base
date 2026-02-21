/**
 * 分页查询MCP服务
 */

import { z } from 'zod';
import { eq, sql, and, asc, desc, inArray, like } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { mcpServer } from '@qiyu-allinai/db/entities/ai';
import { mcpServerPaginationBodySchema, mcpServerZodSchemas } from './schemas';
import type { McpServerSelect } from './utils';

export const mcpServerGetByPagination = defineAction({
  meta: {
    name: 'ai.mcpServer.getByPagination',
    displayName: '分页查询MCP服务',
    description: `分页查询MCP服务列表，支持多种过滤和排序方式。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- name: 按名称模糊搜索
- isPublic: 是否公开访问，true=公开，false=需要API Key
- status: 按状态过滤，"0"=正常，"1"=禁用

**排序参数 (sort)：**
- field: createdAt | name
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**示例：**
\`\`\`json
{
  "filter": { "isPublic": true, "status": "0" },
  "sort": { "field": "name", "order": "asc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['ai', 'mcpServer'],
    method: 'POST',
    path: '/api/ai/mcp-server/query',
  },
  schemas: {
    bodySchema: mcpServerPaginationBodySchema,
    outputSchema: z.object({ data: z.array(mcpServerZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(mcpServer.id, filter.ids));
      if (filter.name) conditions.push(like(mcpServer.name, `%${filter.name}%`));
      if (filter.isPublic !== undefined) conditions.push(eq(mcpServer.isPublic, filter.isPublic));
      if (filter.status) conditions.push(eq(mcpServer.status, filter.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? mcpServer[sort.field as keyof McpServerSelect] : mcpServer.createdAt;

    const data = await db.select().from(mcpServer)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(mcpServer).where(whereClause);
    return { data: data as McpServerSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
