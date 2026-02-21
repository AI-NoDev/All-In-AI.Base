/**
 * 更新角色
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { role } from '@qiyu-allinai/db/entities/system';
import { roleZodSchemas } from './schemas';
import { checkIsAdminRole } from './utils';
import type { RoleSelect, RoleInsert } from './utils';

export const roleUpdate = defineAction({
  meta: {
    name: 'system.role.update',
    displayName: '更新角色',
    description: `根据ID更新单个角色的信息。

**路径参数：**
- id: 角色的UUID

**请求体 (data)：** 要更新的字段，所有字段均为可选
- name: 角色名称
- key: 角色标识
- status: 状态，"0"=正常，"1"=禁用
- sort: 排序号
- remark: 备注

**注意事项：**
- 管理员角色（key=admin）不允许修改

**示例：**
\`\`\`json
PUT /api/system/role/xxx-uuid
{
  "data": { "status": "1", "remark": "已禁用" }
}
\`\`\``,
    tags: ['system', 'role'],
    method: 'PUT',
    path: '/api/system/role/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: roleZodSchemas.update }),
    outputSchema: roleZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    if (await checkIsAdminRole(db, input.id)) {
      throw ActionError.forbidden('error.system.adminRole.cannot.modify');
    }
    
    const [result] = await db.update(role)
      .set(input.data as Partial<RoleInsert>)
      .where(and(eq(role.id, input.id), isNull(role.deletedAt)))
      .returning();
    return result as RoleSelect;
  },
});
