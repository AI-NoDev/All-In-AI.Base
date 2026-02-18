import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { ActionError } from '../../../core/errors';
import { model, modelZodSchemas, provider } from '@qiyu-allinai/db/entities/ai';
import { generateText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

type ModelSelect = typeof model.$inferSelect;
type ModelInsert = typeof model.$inferInsert;

// ============ Filter Schema ============
const modelFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  modelIds: z.array(z.string()).optional(),
  providerId: z.string().optional(),
  providerIds: z.array(z.string()).optional(),
  name: z.string().optional(),
  modelId: z.string().optional(),
  status: z.string().optional(),
  supportTools: z.boolean().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'modelId', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: modelFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const modelGetByPagination = defineAction({
  meta: { name: 'ai.model.getByPagination', displayName: '分页查询AI模型', description: '分页查询AI模型列表', tags: ['ai', 'model'], method: 'POST', path: '/api/ai/model/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(modelZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(model.id, filter.ids));
      if (filter.modelIds?.length) conditions.push(inArray(model.modelId, filter.modelIds));
      if (filter.providerId) conditions.push(eq(model.providerId, filter.providerId));
      if (filter.providerIds?.length) conditions.push(inArray(model.providerId, filter.providerIds));
      if (filter.name) conditions.push(ilike(model.name, `%${filter.name}%`));
      if (filter.modelId) conditions.push(ilike(model.modelId, `%${filter.modelId}%`));
      if (filter.status) conditions.push(eq(model.status, filter.status));
      if (filter.supportTools !== undefined) conditions.push(eq(model.supportTools, filter.supportTools));
      if (filter.createdAtStart) conditions.push(gte(model.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(model.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? model[sort.field as keyof typeof model.$inferSelect] : model.createdAt;
    
    const data = await db.select().from(model).where(whereClause).orderBy(orderFn(sortColumn as any)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(model).where(whereClause);
    return { data: data as ModelSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const modelGetByPk = defineAction({
  meta: { name: 'ai.model.getByPk', displayName: '根据ID查询AI模型', description: '根据主键ID查询单个AI模型', tags: ['ai', 'model'], method: 'GET', path: '/api/ai/model/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: modelZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(model).where(eq(model.id, input.id)).limit(1);
    return (result as ModelSelect) ?? null;
  },
});

export const modelCreate = defineAction({
  meta: { name: 'ai.model.create', displayName: '创建AI模型', description: '创建单个AI模型', tags: ['ai', 'model'], method: 'POST', path: '/api/ai/model' },
  schemas: {
    bodySchema: z.object({ data: modelZodSchemas.insert }),
    outputSchema: modelZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(model).values(input.data as ModelInsert).returning();
    return result as ModelSelect;
  },
});

export const modelCreateMany = defineAction({
  meta: { name: 'ai.model.createMany', displayName: '批量创建AI模型', description: '批量创建多个AI模型', tags: ['ai', 'model'], method: 'POST', path: '/api/ai/model/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(modelZodSchemas.insert) }),
    outputSchema: z.array(modelZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(model).values(input.data as ModelInsert[]).returning();
    return results as ModelSelect[];
  },
});

export const modelUpdate = defineAction({
  meta: { name: 'ai.model.update', displayName: '更新AI模型', description: '根据ID更新单个AI模型', tags: ['ai', 'model'], method: 'PUT', path: '/api/ai/model/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: modelZodSchemas.update }),
    outputSchema: modelZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(model).set(input.data as Partial<ModelInsert>).where(eq(model.id, input.id)).returning();
    return result as ModelSelect;
  },
});

export const modelUpdateMany = defineAction({
  meta: { name: 'ai.model.updateMany', displayName: '批量更新AI模型', description: '根据ID列表批量更新AI模型', tags: ['ai', 'model'], method: 'PUT', path: '/api/ai/model/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: modelZodSchemas.update }),
    outputSchema: z.array(modelZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: ModelSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(model).set(input.data as Partial<ModelInsert>).where(eq(model.id, id)).returning();
      if (result) results.push(result as ModelSelect);
    }
    return results;
  },
});

export const modelDeleteByPk = defineAction({
  meta: { name: 'ai.model.deleteByPk', displayName: '删除AI模型', description: '根据ID删除AI模型', tags: ['ai', 'model'], method: 'DELETE', path: '/api/ai/model/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(model).where(eq(model.id, input.id)).returning();
    return !!result;
  },
});


export const modelGetSchema = defineAction({
  meta: { name: 'ai.model.getSchema', ignoreTools: true, displayName: '获取AI模型Schema', description: '获取AI模型表的JSON Schema', tags: ['ai', 'model'], method: 'GET', path: '/api/ai/model/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(modelZodSchemas.select) as Record<string, unknown>;
  },
});

// ============ Test Model Action ============
const thinkingItemSchema = z.object({
  type: z.string(),
  text: z.string(),
});

export const modelTest = defineAction({
  meta: { 
    name: 'ai.model.test', 
    displayName: '测试AI模型', 
    description: '发送测试消息验证模型是否正常工作', 
    tags: ['ai', 'model'], 
    method: 'POST', 
    path: '/api/ai/model/:id/test' 
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ 
      message: z.string().default('Hello, please respond with a brief greeting.') 
    }),
    outputSchema: z.object({ 
      success: z.boolean(),
      response: z.string().nullable(),
      thinking: z.array(thinkingItemSchema).nullable(),
      supportThinking: z.boolean(),
      error: z.string().nullable(),
      latencyMs: z.number(),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const startTime = Date.now();
    
    // Get model info
    const [modelInfo] = await db.select().from(model).where(eq(model.id, input.id)).limit(1);
    if (!modelInfo) {
      throw ActionError.notFound('error.ai.model.notFound');
    }
    
    // Get provider info
    const [providerInfo] = await db.select().from(provider).where(eq(provider.id, modelInfo.providerId)).limit(1);
    if (!providerInfo) {
      throw ActionError.notFound('error.ai.provider.notFound');
    }
    
    const supportThinking = modelInfo.supportThinking ?? false;
    
    try {
      const aiProvider = createOpenAICompatible({
        baseURL: providerInfo.baseUrl,
        apiKey: providerInfo.token,
        name: providerInfo.name,
      });
      
      const result = await generateText({
        model: aiProvider(modelInfo.modelId),
        messages: [{ role: 'user', content: input.message }],
      });
      
      const latencyMs = Date.now() - startTime;
      
      // Extract thinking content from reasoning steps if available
      let thinkingContent: { type: string; text: string }[] | null = null;
      if (supportThinking && result.reasoning) {
        // reasoning can be string or structured - handle both
        if (typeof result.reasoning === 'string') {
          thinkingContent = [{ type: 'reasoning', text: result.reasoning }];
        } else if (Array.isArray(result.reasoning)) {
          thinkingContent = result.reasoning;
        }
      }
      
      return {
        success: true,
        response: result.text,
        thinking: thinkingContent,
        supportThinking,
        error: null,
        latencyMs,
      };
    } catch (err) {
      const latencyMs = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return {
        success: false,
        response: null,
        thinking: null,
        supportThinking,
        error: errorMessage,
        latencyMs,
      };
    }
  },
});

export const modelActions = [modelGetByPagination, modelGetByPk, modelCreate, modelCreateMany, modelUpdate, modelUpdateMany, modelDeleteByPk, modelGetSchema, modelTest];
