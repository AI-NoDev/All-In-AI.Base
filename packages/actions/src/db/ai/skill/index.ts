import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { skill, skillZodSchemas } from '@qiyu-allinai/db/entities/ai';

type SkillSelect = typeof skill.$inferSelect;
type SkillInsert = typeof skill.$inferInsert;

// ============ Filter Schema ============
const skillFilterSchema = z.object({
  ids: z.array(z.uuid()).optional(),
  names: z.array(z.string()).optional(),
  parentId: z.uuid().optional(),
  folderId: z.uuid().optional(),
  fileId: z.uuid().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  isGroup: z.boolean().optional(),
  isA2a: z.boolean().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'orderNum', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: skillFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const skillGetByPagination = defineAction({
  meta: { name: 'ai.skill.getByPagination', displayName: '分页查询技能', description: '分页查询技能列表', tags: ['ai', 'skill'], method: 'POST', path: '/api/ai/skill/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(skillZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(skill.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(skill.name, filter.names));
      if (filter.parentId) conditions.push(eq(skill.parentId, filter.parentId));
      if (filter.folderId) conditions.push(eq(skill.folderId, filter.folderId));
      if (filter.fileId) conditions.push(eq(skill.fileId, filter.fileId));
      if (filter.name) conditions.push(ilike(skill.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(skill.status, filter.status));
      if (filter.isGroup !== undefined) conditions.push(eq(skill.isGroup, filter.isGroup));
      if (filter.isA2a !== undefined) conditions.push(eq(skill.isA2a, filter.isA2a));
      if (filter.createdAtStart) conditions.push(gte(skill.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(skill.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? skill[sort.field as keyof typeof skill.$inferSelect] : skill.createdAt;
    
    const data = await db.select().from(skill).where(whereClause).orderBy(orderFn(sortColumn as any)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(skill).where(whereClause);
    return { data: data as SkillSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const skillGetByPk = defineAction({
  meta: { name: 'ai.skill.getByPk', displayName: '根据ID查询技能', description: '根据主键ID查询单个技能', tags: ['ai', 'skill'], method: 'GET', path: '/api/ai/skill/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: skillZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(skill).where(eq(skill.id, input.id)).limit(1);
    return (result as SkillSelect) ?? null;
  },
});

export const skillCreate = defineAction({
  meta: { name: 'ai.skill.create', displayName: '创建技能', description: '创建单个技能', tags: ['ai', 'skill'], method: 'POST', path: '/api/ai/skill' },
  schemas: {
    bodySchema: z.object({ data: skillZodSchemas.insert }),
    outputSchema: skillZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(skill).values(input.data as SkillInsert).returning();
    return result as SkillSelect;
  },
});

export const skillCreateMany = defineAction({
  meta: { name: 'ai.skill.createMany', displayName: '批量创建技能', description: '批量创建多个技能', tags: ['ai', 'skill'], method: 'POST', path: '/api/ai/skill/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(skillZodSchemas.insert) }),
    outputSchema: z.array(skillZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(skill).values(input.data as SkillInsert[]).returning();
    return results as SkillSelect[];
  },
});

export const skillUpdate = defineAction({
  meta: { name: 'ai.skill.update', displayName: '更新技能', description: '根据ID更新单个技能', tags: ['ai', 'skill'], method: 'PUT', path: '/api/ai/skill/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    bodySchema: z.object({ data: skillZodSchemas.update }),
    outputSchema: skillZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(skill).set(input.data as Partial<SkillInsert>).where(eq(skill.id, input.id)).returning();
    return result as SkillSelect;
  },
});

export const skillUpdateMany = defineAction({
  meta: { name: 'ai.skill.updateMany', displayName: '批量更新技能', description: '根据ID列表批量更新技能', tags: ['ai', 'skill'], method: 'PUT', path: '/api/ai/skill/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.uuid()), data: skillZodSchemas.update }),
    outputSchema: z.array(skillZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: SkillSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(skill).set(input.data as Partial<SkillInsert>).where(eq(skill.id, id)).returning();
      if (result) results.push(result as SkillSelect);
    }
    return results;
  },
});

export const skillDeleteByPk = defineAction({
  meta: { name: 'ai.skill.deleteByPk', displayName: '删除技能', description: '根据ID删除技能', tags: ['ai', 'skill'], method: 'DELETE', path: '/api/ai/skill/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(skill).where(eq(skill.id, input.id)).returning();
    return !!result;
  },
});


export const skillGetSchema = defineAction({
  meta: { name: 'ai.skill.getSchema', ignoreTools: true, displayName: '获取AI技能Schema', description: '获取AI技能表的JSON Schema', tags: ['ai', 'skill'], method: 'GET', path: '/api/ai/skill/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(skillZodSchemas.select) as Record<string, unknown>;
  },
});

export const skillActions = [skillGetByPagination, skillGetByPk, skillCreate, skillCreateMany, skillUpdate, skillUpdateMany, skillDeleteByPk, skillGetSchema];
