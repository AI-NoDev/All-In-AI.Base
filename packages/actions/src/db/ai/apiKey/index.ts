import { z } from 'zod';
import { eq, sql, and, asc, desc, inArray, like } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { apiKey, apiKeyZodSchemas, apiKeyMcp, mcpServer } from '@qiyu-allinai/db/entities/ai';

type ApiKeySelect = typeof apiKey.$inferSelect;
type ApiKeyInsert = typeof apiKey.$inferInsert;

// ============ Filter Schema ============
const apiKeyFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  name: z.string().optional(),
  isRevoked: z.boolean().optional(),
  status: z.string().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['createdAt', 'name', 'lastUsedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: apiKeyFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

// 扩展的 select schema，包含关联的 MCP 服务
const apiKeyWithMcpsSchema = apiKeyZodSchemas.select.extend({
  accessAll: z.boolean(),
  mcpServerIds: z.array(z.string()),
});

export const apiKeyGetByPagination = defineAction({
  meta: { name: 'ai.apiKey.getByPagination', displayName: '分页查询API密钥', description: '分页查询API密钥列表', tags: ['ai', 'apiKey'], method: 'POST', path: '/api/ai/api-key/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(apiKeyWithMcpsSchema), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(apiKey.id, filter.ids));
      if (filter.name) conditions.push(like(apiKey.name, `%${filter.name}%`));
      if (filter.isRevoked !== undefined) conditions.push(eq(apiKey.isRevoked, filter.isRevoked));
      if (filter.status) conditions.push(eq(apiKey.status, filter.status));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? apiKey[sort.field as keyof typeof apiKey.$inferSelect] : apiKey.createdAt;
    
    const data = await db.select().from(apiKey)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);
    
    // 获取每个 API Key 关联的 MCP 服务
    const result = await Promise.all(data.map(async (key) => {
      const mcps = await db.select({ mcpServerId: apiKeyMcp.mcpServerId })
        .from(apiKeyMcp)
        .where(eq(apiKeyMcp.apiKeyId, key.id));
      return { ...key, mcpServerIds: mcps.map(m => m.mcpServerId) };
    }));
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(apiKey).where(whereClause);
    return { data: result, total: Number(countResult[0]?.count ?? 0) };
  },
});

export const apiKeyGetByPk = defineAction({
  meta: { name: 'ai.apiKey.getByPk', displayName: '根据ID查询API密钥', description: '根据主键ID查询单个API密钥', tags: ['ai', 'apiKey'], method: 'GET', path: '/api/ai/api-key/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: apiKeyWithMcpsSchema.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(apiKey).where(eq(apiKey.id, input.id)).limit(1);
    if (!result) return null;
    
    const mcps = await db.select({ mcpServerId: apiKeyMcp.mcpServerId })
      .from(apiKeyMcp)
      .where(eq(apiKeyMcp.apiKeyId, result.id));
    
    return { ...result, mcpServerIds: mcps.map(m => m.mcpServerId) };
  },
});

// 生成安全的随机 token
function generateToken(): { token: string; hash: string; prefix: string } {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = 'sk_' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const prefix = token.slice(0, 10) + '...';
  const hash = Bun.hash(token).toString(16);
  return { token, hash, prefix };
}

export const apiKeyCreate = defineAction({
  meta: { name: 'ai.apiKey.create', displayName: '创建API密钥', description: '创建API密钥并关联MCP服务', tags: ['ai', 'apiKey'], method: 'POST', path: '/api/ai/api-key' },
  schemas: {
    bodySchema: z.object({ 
      data: z.object({
        name: z.string(),
        accessAll: z.boolean().default(true),
        mcpServerIds: z.array(z.string()).optional().default([]),
        expiresAt: z.string().optional(),
        remark: z.string().optional(),
      })
    }),
    outputSchema: z.object({
      id: z.string(),
      token: z.string(),
      tokenPrefix: z.string(),
    }),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName } = context;
    
    // 如果不是访问全部，需要验证 MCP Server 存在
    if (!input.data.accessAll && input.data.mcpServerIds && input.data.mcpServerIds.length > 0) {
      const servers = await db.select({ id: mcpServer.id })
        .from(mcpServer)
        .where(inArray(mcpServer.id, input.data.mcpServerIds));
      
      if (servers.length !== input.data.mcpServerIds.length) {
        throw new Error('error.business.dataNotFound');
      }
    }
    
    const { token, hash, prefix } = generateToken();
    
    // 创建 API Key
    const [result] = await db.insert(apiKey).values({
      name: input.data.name,
      tokenHash: hash,
      tokenPrefix: prefix,
      accessAll: input.data.accessAll,
      expiresAt: input.data.expiresAt,
      remark: input.data.remark,
      createdBy: currentUserName,
      updatedBy: currentUserName,
      createdById: currentUserId,
      updatedById: currentUserId,
    } as ApiKeyInsert).returning();
    
    if (!result) throw new Error('error.business.createFailed');
    
    // 如果不是访问全部，创建关联
    if (!input.data.accessAll && input.data.mcpServerIds && input.data.mcpServerIds.length > 0) {
      await db.insert(apiKeyMcp).values(
        input.data.mcpServerIds.map(mcpServerId => ({
          apiKeyId: result.id,
          mcpServerId,
        }))
      );
    }
    
    return { id: result.id, token, tokenPrefix: prefix };
  },
});

export const apiKeyUpdate = defineAction({
  meta: { name: 'ai.apiKey.update', displayName: '更新API密钥', description: '更新API密钥信息和关联的MCP服务', tags: ['ai', 'apiKey'], method: 'PUT', path: '/api/ai/api-key/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ 
      data: z.object({
        name: z.string().optional(),
        accessAll: z.boolean().optional(),
        mcpServerIds: z.array(z.string()).optional(),
        expiresAt: z.string().nullable().optional(),
        remark: z.string().nullable().optional(),
      })
    }),
    outputSchema: apiKeyZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db, currentUserName, currentUserId } = context;
    
    // 更新基本信息
    const updateData: Partial<ApiKeyInsert> = {
      updatedBy: currentUserName,
      updatedById: currentUserId,
    };
    if (input.data.name !== undefined) updateData.name = input.data.name;
    if (input.data.accessAll !== undefined) updateData.accessAll = input.data.accessAll;
    if (input.data.expiresAt !== undefined) updateData.expiresAt = input.data.expiresAt ?? undefined;
    if (input.data.remark !== undefined) updateData.remark = input.data.remark ?? undefined;
    
    const [result] = await db.update(apiKey)
      .set(updateData)
      .where(eq(apiKey.id, input.id))
      .returning();
    
    if (!result) throw new Error('error.business.dataNotFound');
    
    // 更新 MCP 关联（仅当 accessAll 为 false 时才需要关联）
    if (input.data.accessAll !== undefined || input.data.mcpServerIds !== undefined) {
      const newAccessAll = input.data.accessAll ?? result.accessAll;
      
      // 先删除旧关联
      await db.delete(apiKeyMcp).where(eq(apiKeyMcp.apiKeyId, input.id));
      
      // 如果不是访问全部，且有选择的 MCP，则创建关联
      if (!newAccessAll && input.data.mcpServerIds && input.data.mcpServerIds.length > 0) {
        await db.insert(apiKeyMcp).values(
          input.data.mcpServerIds.map(mcpServerId => ({
            apiKeyId: input.id,
            mcpServerId,
          }))
        );
      }
    }
    
    return result as ApiKeySelect;
  },
});

export const apiKeyRevoke = defineAction({
  meta: { name: 'ai.apiKey.revoke', displayName: '撤销API密钥', description: '撤销API密钥', tags: ['ai', 'apiKey'], method: 'POST', path: '/api/ai/api-key/:id/revoke' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db, currentUserName, currentUserId } = context;
    const [result] = await db.update(apiKey)
      .set({
        isRevoked: true,
        revokedAt: new Date().toISOString(),
        updatedBy: currentUserName,
        updatedById: currentUserId,
      } as Partial<ApiKeyInsert>)
      .where(eq(apiKey.id, input.id))
      .returning();
    return !!result;
  },
});

export const apiKeyDeleteByPk = defineAction({
  meta: { name: 'ai.apiKey.deleteByPk', displayName: '删除API密钥', description: '根据ID删除API密钥', tags: ['ai', 'apiKey'], method: 'DELETE', path: '/api/ai/api-key/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    // 先删除关联
    await db.delete(apiKeyMcp).where(eq(apiKeyMcp.apiKeyId, input.id));
    // 再删除 API Key
    const [result] = await db.delete(apiKey).where(eq(apiKey.id, input.id)).returning();
    return !!result;
  },
});

export const apiKeyGetSchema = defineAction({
  meta: { name: 'ai.apiKey.getSchema', ignoreTools: true, displayName: '获取API密钥Schema', description: '获取API密钥表的JSON Schema', tags: ['ai', 'apiKey'], method: 'GET', path: '/api/ai/api-key/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(apiKeyZodSchemas.select) as Record<string, unknown>;
  },
});

export const apiKeyActions = [
  apiKeyGetByPagination, 
  apiKeyGetByPk, 
  apiKeyCreate, 
  apiKeyUpdate, 
  apiKeyRevoke,
  apiKeyDeleteByPk, 
  apiKeyGetSchema
];
