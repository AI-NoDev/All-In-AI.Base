/**
 * 创建角色部门关联
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { roleDepartment } from '@qiyu-allinai/db/entities/system';
import { roleDepartmentZodSchemas } from './schemas';
import type { RoleDepartmentSelect, RoleDepartmentInsert } from './utils';

export const roleDepartmentCreate = defineAction({
  meta: {
    ignoreTools: true,
    name: 'system.roleDepartment.create',
    displayName: '创建角色部门关联',
    description: `创建单个角色与部门的关联关系。

**请求体参数 (data)：**
- roleId: 角色UUID，必填
- departmentId: 部门UUID，必填

**使用场景：**
- 为角色配置数据权限范围
- 角色可访问指定部门的数据

**示例：**
\`\`\`json
{
  "data": {
    "roleId": "550e8400-e29b-41d4-a716-446655440001",
    "departmentId": "550e8400-e29b-41d4-a716-446655440002"
  }
}
\`\`\``,
    tags: ['system', 'roleDepartment'],
    method: 'POST',
    path: '/api/system/role-department',
  },
  schemas: {
    bodySchema: z.object({ data: roleDepartmentZodSchemas.insert }),
    outputSchema: roleDepartmentZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(roleDepartment).values(input.data as RoleDepartmentInsert).returning();
    return result as RoleDepartmentSelect;
  },
});
