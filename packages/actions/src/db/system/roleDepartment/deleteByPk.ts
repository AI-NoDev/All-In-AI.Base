/**
 * 删除角色部门关联
 */

import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { roleDepartment } from '@qiyu-allinai/db/entities/system';

export const roleDepartmentDeleteByPk = defineAction({
  meta: {
    name: 'system.roleDepartment.deleteByPk',
    displayName: '删除角色部门关联',
    description: `根据复合主键删除角色与部门的关联关系。

**路径参数：**
- roleId: 角色UUID，必填
- departmentId: 部门UUID，必填

**返回：**
- true: 删除成功
- false: 删除失败（关联不存在）

**示例：**
DELETE /api/system/role-department/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002`,
    tags: ['system', 'roleDepartment'],
    method: 'DELETE',
    path: '/api/system/role-department/:roleId/:departmentId',
  },
  schemas: {
    paramsSchema: z.object({ roleId: z.string(), departmentId: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(roleDepartment)
      .where(and(eq(roleDepartment.roleId, input.roleId), eq(roleDepartment.departmentId, input.departmentId)))
      .returning();
    return !!result;
  },
});
