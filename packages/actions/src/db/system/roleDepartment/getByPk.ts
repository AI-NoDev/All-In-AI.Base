/**
 * 根据复合主键查询角色部门关联
 */

import { t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { roleDepartment, roleDepartmentSchemas } from '@qiyu-allinai/db/entities/system';
import type { RoleDepartmentSelect } from '@qiyu-allinai/db/entities/system/roleDepartment';

export const roleDepartmentGetByPk = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.roleDepartment.getByPk',
    displayName: '根据复合主键查询角色部门关联',
    description: `根据角色ID和部门ID的复合主键查询关联记录。

**路径参数：**
- roleId: 角色UUID，必填
- departmentId: 部门UUID，必填

**返回：**
- 成功：返回关联对象 { roleId, departmentId }
- 未找到：返回 null

**示例：**
GET /api/system/role-department/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002`,
    tags: ['system', 'roleDepartment'],
    method: 'GET',
    path: '/api/system/role-department/:roleId/:departmentId',
  },
  schemas: {
    paramsSchema: t.Object({ roleId: t.String(), departmentId: t.String() }),
    outputSchema: t.Union([roleDepartmentSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(roleDepartment)
      .where(and(eq(roleDepartment.roleId, input.roleId), eq(roleDepartment.departmentId, input.departmentId)))
      .limit(1);
    return (result as RoleDepartmentSelect) ?? null;
  },
});
