import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { roleDepartment, roleDepartmentZodSchemas } from '@qiyu-allinai/db/entities/system';

type RoleDepartmentSelect = typeof roleDepartment.$inferSelect;
type RoleDepartmentInsert = typeof roleDepartment.$inferInsert;

// ============ Filter Schema ============
const roleDepartmentFilterSchema = z.object({
  // IN 查询
  roleIds: z.array(z.string()).optional(),
  departmentIds: z.array(z.string()).optional(),
  // 精确匹配
  roleId: z.string().optional(),
  departmentId: z.string().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['roleId', 'departmentId']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: roleDepartmentFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const roleDepartmentGetByPagination = defineAction({
  meta: { name: 'system.roleDepartment.getByPagination', displayName: '分页查询角色部门关联', description: '分页查询角色部门关联列表', tags: ['system', 'roleDepartment'], method: 'POST', path: '/api/system/role-department/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(roleDepartmentZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      // IN 查询
      if (filter.roleIds?.length) conditions.push(inArray(roleDepartment.roleId, filter.roleIds));
      if (filter.departmentIds?.length) conditions.push(inArray(roleDepartment.departmentId, filter.departmentIds));
      // 精确匹配
      if (filter.roleId) conditions.push(eq(roleDepartment.roleId, filter.roleId));
      if (filter.departmentId) conditions.push(eq(roleDepartment.departmentId, filter.departmentId));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? roleDepartment[sort.field as keyof typeof roleDepartment.$inferSelect] : roleDepartment.roleId;
    
    const data = await db.select().from(roleDepartment)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(roleDepartment).where(whereClause);
    return { data: data as RoleDepartmentSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const roleDepartmentGetByPk = defineAction({
  meta: { name: 'system.roleDepartment.getByPk', displayName: '根据复合主键查询角色部门关联', description: '根据roleId和departmentId查询', tags: ['system', 'roleDepartment'], method: 'GET', path: '/api/system/role-department/:roleId/:departmentId' },
  schemas: {
    paramsSchema: z.object({ roleId: z.string(), departmentId: z.string() }),
    outputSchema: roleDepartmentZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(roleDepartment).where(and(eq(roleDepartment.roleId, input.roleId), eq(roleDepartment.departmentId, input.departmentId))).limit(1);
    return (result as RoleDepartmentSelect) ?? null;
  },
});

export const roleDepartmentCreate = defineAction({
  meta: { name: 'system.roleDepartment.create', displayName: '创建角色部门关联', description: '创建单个角色部门关联', tags: ['system', 'roleDepartment'], method: 'POST', path: '/api/system/role-department' },
  schemas: {
    bodySchema: z.object({ data: roleDepartmentZodSchemas.insert }),
    outputSchema: roleDepartmentZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(roleDepartment).values(input.data as RoleDepartmentInsert).returning();
    return result as RoleDepartmentSelect;
  },
});

export const roleDepartmentCreateMany = defineAction({
  meta: { name: 'system.roleDepartment.createMany', displayName: '批量创建角色部门关联', description: '批量创建多个角色部门关联', tags: ['system', 'roleDepartment'], method: 'POST', path: '/api/system/role-department/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(roleDepartmentZodSchemas.insert) }),
    outputSchema: z.array(roleDepartmentZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(roleDepartment).values(input.data as RoleDepartmentInsert[]).returning();
    return results as RoleDepartmentSelect[];
  },
});


export const roleDepartmentDeleteByPk = defineAction({
  meta: { name: 'system.roleDepartment.deleteByPk', displayName: '删除角色部门关联', description: '根据复合主键删除', tags: ['system', 'roleDepartment'], method: 'DELETE', path: '/api/system/role-department/:roleId/:departmentId' },
  schemas: {
    paramsSchema: z.object({ roleId: z.string(), departmentId: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(roleDepartment).where(and(eq(roleDepartment.roleId, input.roleId), eq(roleDepartment.departmentId, input.departmentId))).returning();
    return !!result;
  },
});


export const roleDepartmentGetSchema = defineAction({
  meta: { name: 'system.roleDepartment.getSchema', ignoreTools: true, displayName: '获取角色部门Schema', description: '获取角色部门表的JSON Schema', tags: ['system', 'roleDepartment'], method: 'GET', path: '/api/system/role-department/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(roleDepartmentZodSchemas.select) as Record<string, unknown>;
  },
});

export const roleDepartmentActions = [roleDepartmentGetByPagination, roleDepartmentGetByPk, roleDepartmentCreate, roleDepartmentCreateMany, roleDepartmentDeleteByPk, roleDepartmentGetSchema];