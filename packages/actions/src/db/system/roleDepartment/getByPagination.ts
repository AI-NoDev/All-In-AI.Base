/**
 * 分页查询角色部门关联
 */

import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { roleDepartment } from '@qiyu-allinai/db/entities/system';
import { roleDepartmentPaginationBodySchema, roleDepartmentZodSchemas } from './schemas';
import type { RoleDepartmentSelect } from './utils';

export const roleDepartmentGetByPagination = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.roleDepartment.getByPagination',
    displayName: '分页查询角色部门关联',
    description: `分页查询角色与部门的关联关系，用于数据权限控制。

**过滤参数 (filter)：**
- roleIds: 按角色ID列表查询，如 ["role-id-1", "role-id-2"]
- departmentIds: 按部门ID列表查询，如 ["dept-id-1", "dept-id-2"]
- roleId: 按单个角色ID精确查询
- departmentId: 按单个部门ID精确查询

**排序参数 (sort)：**
- field: roleId | departmentId
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
- 查询某角色关联的所有部门
- 查询某部门关联的所有角色
- 数据权限范围配置

**示例：**
\`\`\`json
{
  "filter": { "roleId": "550e8400-e29b-41d4-a716-446655440000" },
  "sort": { "field": "departmentId", "order": "asc" },
  "offset": 0,
  "limit": 20
}
\`\`\``,
    tags: ['system', 'roleDepartment'],
    method: 'POST',
    path: '/api/system/role-department/query',
  },
  schemas: {
    bodySchema: roleDepartmentPaginationBodySchema,
    outputSchema: z.object({ data: z.array(roleDepartmentZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.roleIds?.length) conditions.push(inArray(roleDepartment.roleId, filter.roleIds));
      if (filter.departmentIds?.length) conditions.push(inArray(roleDepartment.departmentId, filter.departmentIds));
      if (filter.roleId) conditions.push(eq(roleDepartment.roleId, filter.roleId));
      if (filter.departmentId) conditions.push(eq(roleDepartment.departmentId, filter.departmentId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? roleDepartment[sort.field as keyof RoleDepartmentSelect] : roleDepartment.roleId;

    const data = await db.select().from(roleDepartment)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(roleDepartment).where(whereClause);
    return { data: data as RoleDepartmentSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
