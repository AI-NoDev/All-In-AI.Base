import { z } from 'zod';
import { eq, and, isNull, ilike, sql, inArray, gte, lte, asc, desc } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { file, fileZodSchemas } from '@qiyu-allinai/db/entities/knowledge';

type FileSelect = typeof file.$inferSelect;
type FileInsert = typeof file.$inferInsert;

// ============ Filter Schema ============
const fileFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.string()).optional(),
  names: z.array(z.string()).optional(),
  extensions: z.array(z.string()).optional(),
  // 精确匹配
  folderId: z.string().nullable().optional(),
  mimeType: z.string().optional(),
  processStatus: z.enum(['0', '1', '2']).optional(),
  status: z.enum(['0', '1']).optional(),
  // 模糊匹配
  name: z.string().optional(),
  extension: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'size', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: fileFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const fileGetByPagination = defineAction({
  meta: { name: 'knowledge.file.getByPagination', displayName: '分页查询文件', description: '分页查询文件列表，自动排除已删除数据', tags: ['knowledge', 'file'], method: 'POST', path: '/api/knowledge/file/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(fileZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    
    // Build conditions
    const conditions = [isNull(file.deletedAt)];
    
    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(file.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(file.name, filter.names));
      if (filter.extensions?.length) conditions.push(inArray(file.extension, filter.extensions));
      // 精确匹配
      if (filter.folderId !== undefined) {
        conditions.push(filter.folderId === null ? isNull(file.folderId) : eq(file.folderId, filter.folderId));
      }
      if (filter.mimeType) conditions.push(eq(file.mimeType, filter.mimeType));
      if (filter.processStatus) conditions.push(eq(file.processStatus, filter.processStatus));
      if (filter.status) conditions.push(eq(file.status, filter.status));
      // 模糊匹配
      if (filter.name) conditions.push(ilike(file.name, `%${filter.name}%`));
      if (filter.extension) conditions.push(ilike(file.extension, `%${filter.extension}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(file.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(file.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = and(...conditions);
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? file[sort.field as keyof typeof file.$inferSelect] : file.createdAt;
    
    const data = await db.select().from(file)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(file).where(whereClause);
    return { data: data as FileSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const fileGetByPk = defineAction({
  meta: { name: 'knowledge.file.getByPk', displayName: '根据ID查询文件', description: '根据主键ID查询单个文件', tags: ['knowledge', 'file'], method: 'GET', path: '/api/knowledge/file/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: fileZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(file).where(and(eq(file.id, input.id), isNull(file.deletedAt))).limit(1);
    return (result as FileSelect) ?? null;
  },
});

export const fileCreate = defineAction({
  meta: { name: 'knowledge.file.create', displayName: '创建文件', description: '创建单个文件记录', tags: ['knowledge', 'file'], method: 'POST', path: '/api/knowledge/file' },
  schemas: {
    bodySchema: z.object({ data: fileZodSchemas.insert }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(file).values(input.data as FileInsert).returning();
    return result as FileSelect;
  },
});

export const fileCreateMany = defineAction({
  meta: { name: 'knowledge.file.createMany', displayName: '批量创建文件', description: '批量创建多个文件记录', tags: ['knowledge', 'file'], method: 'POST', path: '/api/knowledge/file/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(fileZodSchemas.insert) }),
    outputSchema: z.array(fileZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(file).values(input.data as FileInsert[]).returning();
    return results as FileSelect[];
  },
});

export const fileUpdate = defineAction({
  meta: { name: 'knowledge.file.update', displayName: '更新文件', description: '根据ID更新单个文件', tags: ['knowledge', 'file'], method: 'PUT', path: '/api/knowledge/file/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: fileZodSchemas.update }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(file).set(input.data as Partial<FileInsert>).where(and(eq(file.id, input.id), isNull(file.deletedAt))).returning();
    return result as FileSelect;
  },
});

export const fileUpdateMany = defineAction({
  meta: { name: 'knowledge.file.updateMany', displayName: '批量更新文件', description: '根据ID列表批量更新文件', tags: ['knowledge', 'file'], method: 'PUT', path: '/api/knowledge/file/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: fileZodSchemas.update }),
    outputSchema: z.array(fileZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: FileSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(file).set(input.data as Partial<FileInsert>).where(and(eq(file.id, id), isNull(file.deletedAt))).returning();
      if (result) results.push(result as FileSelect);
    }
    return results;
  },
});

export const fileDeleteByPk = defineAction({
  meta: { name: 'knowledge.file.deleteByPk', displayName: '删除文件', description: '根据ID软删除文件', tags: ['knowledge', 'file'], method: 'DELETE', path: '/api/knowledge/file/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const [result] = await db.update(file).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName
    }).where(and(eq(file.id, input.id), isNull(file.deletedAt))).returning();
    return !!result;
  },
});


export const fileGetSchema = defineAction({
  meta: { name: 'knowledge.file.getSchema', ignoreTools: true, displayName: '获取文件Schema', description: '获取文件表的JSON Schema', tags: ['knowledge', 'file'], method: 'GET', path: '/api/knowledge/file/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(fileZodSchemas.select) as Record<string, unknown>;
  },
});

export const fileActions = [fileGetByPagination, fileGetByPk, fileCreate, fileCreateMany, fileUpdate, fileUpdateMany, fileDeleteByPk, fileGetSchema];
