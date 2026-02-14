import { z } from 'zod';
import { eq, ilike, and, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { config, configZodSchemas } from '@qiyu-allinai/db/entities/system';

type ConfigSelect = typeof config.$inferSelect;
type ConfigInsert = typeof config.$inferInsert;

// ============ Filter Schema ============
const configFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.string()).optional(),
  names: z.array(z.string()).optional(),
  keys: z.array(z.string()).optional(),
  // 精确匹配
  isSystem: z.boolean().optional(),
  // 模糊匹配
  name: z.string().optional(),
  key: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'key', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: configFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const configGetByPagination = defineAction({
  meta: { name: 'system.config.getByPagination', displayName: '分页查询配置', description: '分页查询配置列表', tags: ['system', 'config'], method: 'POST', path: '/api/system/config/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(configZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    
    // Build conditions
    const conditions = [];
    
    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(config.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(config.name, filter.names));
      if (filter.keys?.length) conditions.push(inArray(config.key, filter.keys));
      // 精确匹配
      if (filter.isSystem !== undefined) conditions.push(eq(config.isSystem, filter.isSystem));
      // 模糊匹配
      if (filter.name) conditions.push(ilike(config.name, `%${filter.name}%`));
      if (filter.key) conditions.push(ilike(config.key, `%${filter.key}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(config.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(config.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? config[sort.field as keyof typeof config.$inferSelect] : config.createdAt;
    
    const data = await db.select().from(config)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(config).where(whereClause);
    return { data: data as ConfigSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const configGetByPk = defineAction({
  meta: { name: 'system.config.getByPk', displayName: '根据ID查询配置', description: '根据主键ID查询单个配置', tags: ['system', 'config'], method: 'GET', path: '/api/system/config/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: configZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(config).where(eq(config.id, input.id)).limit(1);
    return (result as ConfigSelect) ?? null;
  },
});

export const configCreate = defineAction({
  meta: { name: 'system.config.create', displayName: '创建配置', description: '创建单个配置', tags: ['system', 'config'], method: 'POST', path: '/api/system/config' },
  schemas: {
    bodySchema: z.object({ data: configZodSchemas.insert }),
    outputSchema: configZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(config).values(input.data as ConfigInsert).returning();
    return result as ConfigSelect;
  },
});

export const configCreateMany = defineAction({
  meta: { name: 'system.config.createMany', displayName: '批量创建配置', description: '批量创建多个配置', tags: ['system', 'config'], method: 'POST', path: '/api/system/config/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(configZodSchemas.insert) }),
    outputSchema: z.array(configZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(config).values(input.data as ConfigInsert[]).returning();
    return results as ConfigSelect[];
  },
});

export const configUpdate = defineAction({
  meta: { name: 'system.config.update', displayName: '更新配置', description: '根据ID更新单个配置', tags: ['system', 'config'], method: 'PUT', path: '/api/system/config/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: configZodSchemas.update }),
    outputSchema: configZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(config).set(input.data as Partial<ConfigInsert>).where(eq(config.id, input.id)).returning();
    return result as ConfigSelect;
  },
});

export const configUpdateMany = defineAction({
  meta: { name: 'system.config.updateMany', displayName: '批量更新配置', description: '根据ID列表批量更新配置', tags: ['system', 'config'], method: 'PUT', path: '/api/system/config/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: configZodSchemas.update }),
    outputSchema: z.array(configZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: ConfigSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(config).set(input.data as Partial<ConfigInsert>).where(eq(config.id, id)).returning();
      if (result) results.push(result as ConfigSelect);
    }
    return results;
  },
});

export const configDeleteByPk = defineAction({
  meta: { name: 'system.config.deleteByPk', displayName: '删除配置', description: '根据ID删除配置', tags: ['system', 'config'], method: 'DELETE', path: '/api/system/config/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(config).where(eq(config.id, input.id)).returning();
    return !!result;
  },
});


export const configGetSchema = defineAction({
  meta: { name: 'system.config.getSchema', ignoreTools: true, displayName: '获取配置Schema', description: '获取配置表的JSON Schema', tags: ['system', 'config'], method: 'GET', path: '/api/system/config/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(configZodSchemas.select) as Record<string, unknown>;
  },
});

export const configActions = [configGetByPagination, configGetByPk, configCreate, configCreateMany, configUpdate, configUpdateMany, configDeleteByPk, configGetSchema];
