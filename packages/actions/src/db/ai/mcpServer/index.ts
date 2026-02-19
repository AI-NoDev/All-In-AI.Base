import { z } from 'zod';
import { eq, sql, and, asc, desc, inArray, like } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { mcpServer, mcpServerZodSchemas } from '@qiyu-allinai/db/entities/ai';

type McpServerSelect = typeof mcpServer.$inferSelect;
type McpServerInsert = typeof mcpServer.$inferInsert;

// ============ Filter Schema ============
const mcpServerFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  name: z.string().optional(),
  isPublic: z.boolean().optional(),
  status: z.string().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['createdAt', 'name']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: mcpServerFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const mcpServerGetByPagination = defineAction({
  meta: { name: 'ai.mcpServer.getByPagination', displayName: '分页查询MCP服务', description: '分页查询MCP服务列表', tags: ['ai', 'mcpServer'], method: 'POST', path: '/api/ai/mcp-server/query' },
  schemas: {
    bodySchema: paginationBodySchema,
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
    const sortColumn = sort?.field ? mcpServer[sort.field as keyof typeof mcpServer.$inferSelect] : mcpServer.createdAt;
    
    const data = await db.select().from(mcpServer)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(mcpServer).where(whereClause);
    return { data: data as McpServerSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const mcpServerGetByPk = defineAction({
  meta: { name: 'ai.mcpServer.getByPk', displayName: '根据ID查询MCP服务', description: '根据主键ID查询单个MCP服务', tags: ['ai', 'mcpServer'], method: 'GET', path: '/api/ai/mcp-server/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: mcpServerZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(mcpServer).where(eq(mcpServer.id, input.id)).limit(1);
    return (result as McpServerSelect) ?? null;
  },
});

export const mcpServerCreate = defineAction({
  meta: { name: 'ai.mcpServer.create', displayName: '创建MCP服务', description: '创建单个MCP服务', tags: ['ai', 'mcpServer'], method: 'POST', path: '/api/ai/mcp-server' },
  schemas: {
    bodySchema: z.object({ data: mcpServerZodSchemas.insert }),
    outputSchema: mcpServerZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(mcpServer).values(input.data as McpServerInsert).returning();
    return result as McpServerSelect;
  },
});

export const mcpServerUpdate = defineAction({
  meta: { name: 'ai.mcpServer.update', displayName: '更新MCP服务', description: '根据ID更新单个MCP服务', tags: ['ai', 'mcpServer'], method: 'PUT', path: '/api/ai/mcp-server/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: mcpServerZodSchemas.update }),
    outputSchema: mcpServerZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(mcpServer).set(input.data as Partial<McpServerInsert>).where(eq(mcpServer.id, input.id)).returning();
    return result as McpServerSelect;
  },
});

export const mcpServerDeleteByPk = defineAction({
  meta: { name: 'ai.mcpServer.deleteByPk', displayName: '删除MCP服务', description: '根据ID删除MCP服务', tags: ['ai', 'mcpServer'], method: 'DELETE', path: '/api/ai/mcp-server/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(mcpServer).where(eq(mcpServer.id, input.id)).returning();
    return !!result;
  },
});

export const mcpServerGetSchema = defineAction({
  meta: { name: 'ai.mcpServer.getSchema', ignoreTools: true, displayName: '获取MCP服务Schema', description: '获取MCP服务表的JSON Schema', tags: ['ai', 'mcpServer'], method: 'GET', path: '/api/ai/mcp-server/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(mcpServerZodSchemas.select) as Record<string, unknown>;
  },
});

// MCP 配置输出 schema
const mcpConfigSchema = z.object({
  endpoint: z.string(),
  config: z.object({
    mcpServers: z.record(z.string(), z.object({
      url: z.string(),
      headers: z.object({
        Authorization: z.string(),
      }).optional(),
    })),
  }),
  configJson: z.string(),
});

export const mcpServerGetConfig = defineAction({
  meta: { name: 'ai.mcpServer.getConfig', displayName: '获取MCP配置', description: '获取MCP服务的配置JSON，用于集成到AI工具', tags: ['ai', 'mcpServer'], method: 'GET', path: '/api/ai/mcp-server/:id/config' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: mcpConfigSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [server] = await db.select().from(mcpServer).where(eq(mcpServer.id, input.id)).limit(1);
    if (!server) throw new Error('error.mcp.server.notFound');

    // 从环境变量或配置获取服务器基础 URL
    const baseUrl = process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 3030}`;
    // MCP 端点 - elysia-mcp 使用 Streamable HTTP transport
    const endpoint = `${baseUrl}/mcp/${server.id}`;
    
    const serverConfig: { url: string; headers?: { Authorization: string } } = { url: endpoint };
    if (!server.isPublic) {
      serverConfig.headers = { Authorization: 'Bearer <YOUR_API_KEY>' };
    }

    const config = {
      mcpServers: {
        [server.name]: serverConfig,
      },
    };

    return {
      endpoint,
      config,
      configJson: JSON.stringify(config, null, 2),
    };
  },
});

export const mcpServerActions = [mcpServerGetByPagination, mcpServerGetByPk, mcpServerCreate, mcpServerUpdate, mcpServerDeleteByPk, mcpServerGetSchema, mcpServerGetConfig];
