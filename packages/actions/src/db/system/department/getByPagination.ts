/**
 * 分页查询部门
 */

import { z } from 'zod';
import { eq, and, isNull, ilike, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { checkReadPermission, BUSINESS_MODULE, DATA_SCOPE } from '../../../core/deptPermission';
import { department, departmentZodSchemas } from '@qiyu-allinai/db/entities/system';
import { paginationBodySchema } from './schemas';
import type { DepartmentSelect } from './utils';

export const departmentGetByPagination = defineAction({
  meta: {
    name: 'system.department.getByPagination',
    displayName: '分页查询部门',
    description: '分页查询部门列表，自动排除已删除数据',
    tags: ['system', 'department'],
    method: 'POST',
    path: '/api/system/department/query',
  },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(departmentZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    
    // 获取部门级数据权限
    const permFilter = await checkReadPermission(db, context, BUSINESS_MODULE.DEPARTMENT);
    
    // Build conditions
    const conditions = [isNull(department.deletedAt)];
    
    // 应用部门级数据权限过滤
    if (!permFilter.hasAllAccess) {
      if (permFilter.dataScope === DATA_SCOPE.SELF) {
        // 仅自己部门
        if (context.currentUserDeptId) {
          conditions.push(eq(department.id, context.currentUserDeptId));
        }
      } else if (permFilter.deptIds.length > 0) {
        conditions.push(inArray(department.id, permFilter.deptIds));
      }
    }
    
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
      .orderBy(orderFn(sortColumn as Parameters<typeof asc>[0]))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(department).where(whereClause);
    return { data: data as DepartmentSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
