/**
 * 批量创建角色部门关联
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { roleDepartment } from '@qiyu-allinai/db/entities/system';
import { roleDepartmentZodSchemas } from './schemas';
import type { RoleDepartmentSelect, RoleDepartmentInsert } from './utils';

export const roleDepartmentCreateMany = defineAction({
  meta: {
    name: 'system.roleDepartment.createMany',
    ignoreTools: true,
    displayName: '批量创建角色部门关联',
    description: `批量创建多个角色与部门的关联关系。

**请求体参数 (data)：**
- 数组，每个元素包含：
  - roleId: 角色UUID，必填
  - departmentId: 部门UUID，必填

**使用场景：**
- 为角色一次性配置多个部门的数据权限
- 批量导入角色部门关联

**示例：**
\`\`\`json
{
  "data": [
    { "roleId": "role-1", "departmentId": "dept-1" },
    { "roleId": "role-1", "departmentId": "dept-2" },
    { "roleId": "role-1", "departmentId": "dept-3" }
  ]
}
\`\`\``,
    tags: ['system', 'roleDepartment'],
    method: 'POST',
    path: '/api/system/role-department/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(roleDepartmentZodSchemas.insert) }),
    outputSchema: z.array(roleDepartmentZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(roleDepartment).values(input.data as RoleDepartmentInsert[]).returning();
    return results as RoleDepartmentSelect[];
  },
});
