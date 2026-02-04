import { z } from 'zod';
import { eq, and, isNull, ilike, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { department, departmentZodSchemas } from '@qiyu-allinai/db/entities/system';

type DepartmentSelect = typeof department.$inferSelect;
type DepartmentInsert = typeof department.$inferInsert;

// ============ Filter Schema ============
const departmentFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.uuid()).optional(),
  names: z.array(z.string()).optional(),
  // 精确匹配
  parentId: z.uuid().nullable().optional(),
  status: z.boolean().optional(),
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
  filter: departmentFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const departmentGetByPagination = defineAction({
  meta: { name: 'system.department.getByPagination', displayName: '分页查询部门', description: '分页查询部门列表，自动排除已删除数据', tags: ['system', 'department'], method: 'POST', path: '/api/system/department/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(departmentZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    
    // Build conditions
    const conditions = [isNull(department.deletedAt)];
    
    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(department.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(department.name, filter.names));
      // 精确匹配
      if (filter.parentId !== undefined) {
        conditions.push(filter.parentId === null ? isNull(department.parentId) : eq(department.parentId, filter.parentId));
      }
      if (filter.status !== undefined) conditions.push(eq(department.status, filter.status));
      // 模糊匹配
      if (filter.name) conditions.push(ilike(department.name, `%${filter.name}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(department.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(department.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = and(...conditions);
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? department[sort.field as keyof typeof department.$inferSelect] : department.createdAt;
    
    const data = await db.select().from(department)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(department).where(whereClause);
    return { data: data as DepartmentSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const departmentGetByPk = defineAction({
  meta: { name: 'system.department.getByPk', displayName: '根据ID查询部门', description: '根据主键ID查询单个部门', tags: ['system', 'department'], method: 'GET', path: '/api/system/department/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: departmentZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(department).where(and(eq(department.id, input.id), isNull(department.deletedAt))).limit(1);
    return (result as DepartmentSelect) ?? null;
  },
});

export const departmentCreate = defineAction({
  meta: { name: 'system.department.create', displayName: '创建部门', description: '创建单个部门', tags: ['system', 'department'], method: 'POST', path: '/api/system/department' },
  schemas: {
    bodySchema: z.object({ data: departmentZodSchemas.insert }),
    outputSchema: departmentZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(department).values(input.data as DepartmentInsert).returning();
    return result as DepartmentSelect;
  },
});

export const departmentCreateMany = defineAction({
  meta: { name: 'system.department.createMany', displayName: '批量创建部门', description: '批量创建多个部门', tags: ['system', 'department'], method: 'POST', path: '/api/system/department/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(departmentZodSchemas.insert) }),
    outputSchema: z.array(departmentZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(department).values(input.data as DepartmentInsert[]).returning();
    return results as DepartmentSelect[];
  },
});

export const departmentUpdate = defineAction({
  meta: { name: 'system.department.update', displayName: '更新部门', description: '根据ID更新单个部门', tags: ['system', 'department'], method: 'PUT', path: '/api/system/department/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    bodySchema: z.object({ data: departmentZodSchemas.update }),
    outputSchema: departmentZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(department).set(input.data as Partial<DepartmentInsert>).where(and(eq(department.id, input.id), isNull(department.deletedAt))).returning();
    return result as DepartmentSelect;
  },
});

export const departmentUpdateMany = defineAction({
  meta: { name: 'system.department.updateMany', displayName: '批量更新部门', description: '根据ID列表批量更新部门', tags: ['system', 'department'], method: 'PUT', path: '/api/system/department/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.uuid()), data: departmentZodSchemas.update }),
    outputSchema: z.array(departmentZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results: DepartmentSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(department).set(input.data as Partial<DepartmentInsert>).where(and(eq(department.id, id), isNull(department.deletedAt))).returning();
      if (result) results.push(result as DepartmentSelect);
    }
    return results;
  },
});

export const departmentDeleteByPk = defineAction({
  meta: { name: 'system.department.deleteByPk', displayName: '删除部门', description: '根据ID软删除部门', tags: ['system', 'department'], method: 'DELETE', path: '/api/system/department/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const [result] = await db.update(department).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName
    }).where(and(eq(department.id, input.id), isNull(department.deletedAt))).returning();
    return !!result;
  },
});


export const departmentGetSchema = defineAction({
  meta: { name: 'system.department.getSchema', ignoreTools: true, displayName: '获取部门Schema', description: '获取部门表的JSON Schema', tags: ['system', 'department'], method: 'GET', path: '/api/system/department/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(departmentZodSchemas.select) as Record<string, unknown>;
  },
});

export const departmentActions = [departmentGetByPagination, departmentGetByPk, departmentCreate, departmentCreateMany, departmentUpdate, departmentUpdateMany, departmentDeleteByPk, departmentGetSchema];
