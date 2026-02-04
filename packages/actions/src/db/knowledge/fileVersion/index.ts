import { z } from 'zod';
import { eq, ilike, and, sql, inArray, gte, lte, asc, desc } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { fileVersion, fileVersionZodSchemas } from '@qiyu-allinai/db/entities/knowledge';

type FileVersionSelect = typeof fileVersion.$inferSelect;
type FileVersionInsert = typeof fileVersion.$inferInsert;

// ============ Filter Schema ============
const fileVersionFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.uuid()).optional(),
  fileIds: z.array(z.uuid()).optional(),
  versionNumbers: z.array(z.string()).optional(),
  // 精确匹配
  fileId: z.uuid().optional(),
  // 模糊匹配
  versionNumber: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['versionNumber', 'size', 'createdAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: fileVersionFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const fileVersionGetByPagination = defineAction({
  meta: { name: 'knowledge.fileVersion.getByPagination', displayName: '分页查询文件版本', description: '分页查询文件版本列表', tags: ['knowledge', 'fileVersion'], method: 'POST', path: '/api/knowledge/file-version/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(fileVersionZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    
    // Build conditions
    const conditions = [];
    
    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(fileVersion.id, filter.ids));
      if (filter.fileIds?.length) conditions.push(inArray(fileVersion.fileId, filter.fileIds));
      if (filter.versionNumbers?.length) conditions.push(inArray(fileVersion.versionNumber, filter.versionNumbers));
      // 精确匹配
      if (filter.fileId) conditions.push(eq(fileVersion.fileId, filter.fileId));
      // 模糊匹配
      if (filter.versionNumber) conditions.push(ilike(fileVersion.versionNumber, `%${filter.versionNumber}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(fileVersion.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(fileVersion.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? fileVersion[sort.field as keyof typeof fileVersion.$inferSelect] : fileVersion.createdAt;
    
    const data = await db.select().from(fileVersion)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(fileVersion).where(whereClause);
    return { data: data as FileVersionSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const fileVersionGetByPk = defineAction({
  meta: { name: 'knowledge.fileVersion.getByPk', displayName: '根据ID查询文件版本', description: '根据主键ID查询单个文件版本', tags: ['knowledge', 'fileVersion'], method: 'GET', path: '/api/knowledge/file-version/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: fileVersionZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(fileVersion).where(eq(fileVersion.id, input.id)).limit(1);
    return (result as FileVersionSelect) ?? null;
  },
});

export const fileVersionCreate = defineAction({
  meta: { name: 'knowledge.fileVersion.create', displayName: '创建文件版本', description: '创建单个文件版本', tags: ['knowledge', 'fileVersion'], method: 'POST', path: '/api/knowledge/file-version' },
  schemas: {
    bodySchema: z.object({ data: fileVersionZodSchemas.insert }),
    outputSchema: fileVersionZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(fileVersion).values(input.data as FileVersionInsert).returning();
    return result as FileVersionSelect;
  },
});

export const fileVersionCreateMany = defineAction({
  meta: { name: 'knowledge.fileVersion.createMany', displayName: '批量创建文件版本', description: '批量创建多个文件版本', tags: ['knowledge', 'fileVersion'], method: 'POST', path: '/api/knowledge/file-version/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(fileVersionZodSchemas.insert) }),
    outputSchema: z.array(fileVersionZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(fileVersion).values(input.data as FileVersionInsert[]).returning();
    return results as FileVersionSelect[];
  },
});

export const fileVersionUpdate = defineAction({
  meta: { name: 'knowledge.fileVersion.update', displayName: '更新文件版本', description: '根据ID更新单个文件版本', tags: ['knowledge', 'fileVersion'], method: 'PUT', path: '/api/knowledge/file-version/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    bodySchema: z.object({ data: fileVersionZodSchemas.update }),
    outputSchema: fileVersionZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(fileVersion).set(input.data as Partial<FileVersionInsert>).where(eq(fileVersion.id, input.id)).returning();
    return result as FileVersionSelect;
  },
});

export const fileVersionUpdateMany = defineAction({
  meta: { name: 'knowledge.fileVersion.updateMany', displayName: '批量更新文件版本', description: '根据ID列表批量更新文件版本', tags: ['knowledge', 'fileVersion'], method: 'PUT', path: '/api/knowledge/file-version/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.uuid()), data: fileVersionZodSchemas.update }),
    outputSchema: z.array(fileVersionZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: FileVersionSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(fileVersion).set(input.data as Partial<FileVersionInsert>).where(eq(fileVersion.id, id)).returning();
      if (result) results.push(result as FileVersionSelect);
    }
    return results;
  },
});

export const fileVersionDeleteByPk = defineAction({
  meta: { name: 'knowledge.fileVersion.deleteByPk', displayName: '删除文件版本', description: '根据ID硬删除文件版本', tags: ['knowledge', 'fileVersion'], method: 'DELETE', path: '/api/knowledge/file-version/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(fileVersion).where(eq(fileVersion.id, input.id)).returning();
    return !!result;
  },
});


export const fileVersionGetSchema = defineAction({
  meta: { name: 'knowledge.fileVersion.getSchema', ignoreTools: true, displayName: '获取文件版本Schema', description: '获取文件版本表的JSON Schema', tags: ['knowledge', 'fileVersion'], method: 'GET', path: '/api/knowledge/file-version/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(fileVersionZodSchemas.select) as Record<string, unknown>;
  },
});

export const fileVersionActions = [fileVersionGetByPagination, fileVersionGetByPk, fileVersionCreate, fileVersionCreateMany, fileVersionUpdate, fileVersionUpdateMany, fileVersionDeleteByPk, fileVersionGetSchema];
