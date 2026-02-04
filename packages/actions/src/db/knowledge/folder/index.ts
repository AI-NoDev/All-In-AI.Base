import { z } from 'zod';
import { eq, and, isNull, ilike, sql, inArray, gte, lte, asc, desc } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { folder, folderZodSchemas } from '@qiyu-allinai/db/entities/knowledge';

type FolderSelect = typeof folder.$inferSelect;
type FolderInsert = typeof folder.$inferInsert;

// ============ Filter Schema ============
const folderFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.uuid()).optional(),
  names: z.array(z.string()).optional(),
  // 精确匹配
  parentId: z.uuid().nullable().optional(),
  // 模糊匹配
  name: z.string().optional(),
  // 时间范围
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'orderNum', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: folderFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const folderGetByPagination = defineAction({
  meta: { name: 'knowledge.folder.getByPagination', displayName: '分页查询文件夹', description: '分页查询文件夹列表，自动排除已删除数据', tags: ['knowledge', 'folder'], method: 'POST', path: '/api/knowledge/folder/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(folderZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    
    // Build conditions
    const conditions = [isNull(folder.deletedAt)];
    
    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(folder.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(folder.name, filter.names));
      // 精确匹配
      if (filter.parentId !== undefined) {
        conditions.push(filter.parentId === null ? isNull(folder.parentId) : eq(folder.parentId, filter.parentId));
      }
      // 模糊匹配
      if (filter.name) conditions.push(ilike(folder.name, `%${filter.name}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(folder.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(folder.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = and(...conditions);
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? folder[sort.field as keyof typeof folder.$inferSelect] : folder.createdAt;
    
    const data = await db.select().from(folder)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(folder).where(whereClause);
    return { data: data as FolderSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const folderGetByPk = defineAction({
  meta: { name: 'knowledge.folder.getByPk', displayName: '根据ID查询文件夹', description: '根据主键ID查询单个文件夹', tags: ['knowledge', 'folder'], method: 'GET', path: '/api/knowledge/folder/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: folderZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(folder).where(and(eq(folder.id, input.id), isNull(folder.deletedAt))).limit(1);
    return (result as FolderSelect) ?? null;
  },
});

export const folderCreate = defineAction({
  meta: { name: 'knowledge.folder.create', displayName: '创建文件夹', description: '创建单个文件夹', tags: ['knowledge', 'folder'], method: 'POST', path: '/api/knowledge/folder' },
  schemas: {
    bodySchema: z.object({ data: folderZodSchemas.insert }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    // 应用层唯一性检查：同一用户、同一父目录下不能有同名文件夹（排除已删除的）
    const existingConditions = [
      isNull(folder.deletedAt),
      eq(folder.name, input.data.name),
      eq(folder.createdById, context.currentUserId),
    ];
    
    // 处理 parentId 的 null 情况
    if (input.data.parentId) {
      existingConditions.push(eq(folder.parentId, input.data.parentId));
    } else {
      existingConditions.push(isNull(folder.parentId));
    }
    
    const [existing] = await db.select({ id: folder.id })
      .from(folder)
      .where(and(...existingConditions))
      .limit(1);
    
    if (existing) {
      throw new Error('error.knowledge.folder.nameExists');
    }
    
    // Auto-fill path based on parentId
    let path = '/';
    if (input.data.parentId) {
      const [parent] = await db.select().from(folder).where(eq(folder.id, input.data.parentId)).limit(1);
      if (parent) {
        path = parent.path === '/' ? `/${parent.name}` : `${parent.path}/${parent.name}`;
      }
    }
    const [result] = await db.insert(folder).values({ ...input.data, path } as FolderInsert).returning();
    return result as FolderSelect;
  },
});

export const folderCreateMany = defineAction({
  meta: { name: 'knowledge.folder.createMany', displayName: '批量创建文件夹', description: '批量创建多个文件夹', tags: ['knowledge', 'folder'], method: 'POST', path: '/api/knowledge/folder/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(folderZodSchemas.insert) }),
    outputSchema: z.array(folderZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(folder).values(input.data as FolderInsert[]).returning();
    return results as FolderSelect[];
  },
});

export const folderUpdate = defineAction({
  meta: { name: 'knowledge.folder.update', displayName: '更新文件夹', description: '根据ID更新单个文件夹', tags: ['knowledge', 'folder'], method: 'PUT', path: '/api/knowledge/folder/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    bodySchema: z.object({ data: folderZodSchemas.update }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, _context) => {
    const updateData = { ...input.data } as Partial<FolderInsert>;
    
    // If parentId is being updated, recalculate path
    if ('parentId' in input.data) {
      if (input.data.parentId) {
        const [parent] = await db.select().from(folder).where(eq(folder.id, input.data.parentId)).limit(1);
        if (parent) {
          updateData.path = parent.path === '/' ? `/${parent.name}` : `${parent.path}/${parent.name}`;
        }
      } else {
        updateData.path = '/';
      }
    }
    
    const [result] = await db.update(folder).set(updateData).where(and(eq(folder.id, input.id), isNull(folder.deletedAt))).returning();
    return result as FolderSelect;
  },
});

export const folderUpdateMany = defineAction({
  meta: { name: 'knowledge.folder.updateMany', displayName: '批量更新文件夹', description: '根据ID列表批量更新文件夹', tags: ['knowledge', 'folder'], method: 'PUT', path: '/api/knowledge/folder/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.uuid()), data: folderZodSchemas.update }),
    outputSchema: z.array(folderZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: FolderSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(folder).set(input.data as Partial<FolderInsert>).where(and(eq(folder.id, id), isNull(folder.deletedAt))).returning();
      if (result) results.push(result as FolderSelect);
    }
    return results;
  },
});

export const folderDeleteByPk = defineAction({
  meta: { name: 'knowledge.folder.deleteByPk', displayName: '删除文件夹', description: '根据ID软删除文件夹', tags: ['knowledge', 'folder'], method: 'DELETE', path: '/api/knowledge/folder/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const [result] = await db.update(folder).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName
    }).where(and(eq(folder.id, input.id), isNull(folder.deletedAt))).returning();
    return !!result;
  },
});


export const folderGetSchema = defineAction({
  meta: { name: 'knowledge.folder.getSchema', ignoreTools: true, displayName: '获取文件夹Schema', description: '获取文件夹表的JSON Schema', tags: ['knowledge', 'folder'], method: 'GET', path: '/api/knowledge/folder/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(folderZodSchemas.select) as Record<string, unknown>;
  },
});

export const folderActions = [folderGetByPagination, folderGetByPk, folderCreate, folderCreateMany, folderUpdate, folderUpdateMany, folderDeleteByPk, folderGetSchema];
