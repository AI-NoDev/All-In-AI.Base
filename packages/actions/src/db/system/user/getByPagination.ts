/**
 * 分页查询用户
 */

import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { checkReadPermission, BUSINESS_MODULE, DATA_SCOPE } from '../../../core/deptPermission';
import { user, userZodSchemas } from '@qiyu-allinai/db/entities/system';
import { paginationBodySchema } from './schemas';
import { sanitizeUser, type UserSelect } from './utils';

export const userGetByPagination = defineAction({
  meta: {
    name: 'system.user.getByPagination',
    displayName: '分页查询用户',
    description: '分页查询用户列表',
    tags: ['system', 'user'],
    method: 'POST',
    path: '/api/system/user/query',
  },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(userZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    const { filter, sort, offset, limit } = input;
    
    // 获取部门级数据权限
    const permFilter = await checkReadPermission(db, context, BUSINESS_MODULE.USER);
    
    // Build conditions
    const conditions = [isNull(user.deletedAt)];
    
    // 应用部门级数据权限过滤
    if (!permFilter.hasAllAccess) {
      if (permFilter.dataScope === DATA_SCOPE.SELF) {
        conditions.push(eq(user.id, currentUserId));
      } else if (permFilter.deptIds.length > 0) {
        conditions.push(inArray(user.deptId, permFilter.deptIds));
      } else {
        conditions.push(eq(user.id, currentUserId));
      }
    }
    
    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(user.id, filter.ids));
      if (filter.loginNames?.length) conditions.push(inArray(user.loginName, filter.loginNames));
      // 精确匹配
      if (filter.deptId) conditions.push(eq(user.deptId, filter.deptId));
      if (filter.userType) conditions.push(eq(user.userType, filter.userType));
      if (filter.sex) conditions.push(eq(user.sex, filter.sex));
      if (filter.status) conditions.push(eq(user.status, filter.status));
      // 模糊匹配
      if (filter.loginName) conditions.push(ilike(user.loginName, `%${filter.loginName}%`));
      if (filter.name) conditions.push(ilike(user.name, `%${filter.name}%`));
      if (filter.email) conditions.push(ilike(user.email, `%${filter.email}%`));
      if (filter.phonenumber) conditions.push(ilike(user.phonenumber, `%${filter.phonenumber}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(user.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(user.createdAt, filter.createdAtEnd));
      if (filter.loginDateStart) conditions.push(gte(user.loginDate, new Date(filter.loginDateStart)));
      if (filter.loginDateEnd) conditions.push(lte(user.loginDate, new Date(filter.loginDateEnd)));
    }
    
    const whereClause = and(...conditions);
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? user[sort.field as keyof typeof user.$inferSelect] : user.createdAt;
    
    const data = await db.select().from(user)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof asc>[0]))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(user).where(whereClause);
    return { data: data.map(sanitizeUser) as UserSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
