/**
 * 批量更新角色
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { role } from '@qiyu-allinai/db/entities/system';
import { roleZodSchemas } from './schemas';
import { checkIsAdminRole } from './utils';
import type { RoleSelect, RoleInsert } from './utils';

export const roleUpdateMany = defineAction({
  meta: {
    name: 'system.role.updateMany',
    displayName: '批量更新角色',
    description: `根据ID列表批量更新多个角色。

**请求体：**
- ids: 要更新的角色ID数组
- data: 更新数据对象

**注意事项：**
- 如果列表中包含管理员角色，会抛出错误

**示例：**
\`\`\`json
{
  "ids": ["role-id-1", "role-id-2"],
  "data": { "status": "1" }
}
\`\`\`

**返回：** 更新成功的角色对象数组`,
    tags: ['system', 'role'],
    method: 'PUT',
    path: '/api/system/role/batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: roleZodSchemas.update }),
    outputSchema: z.array(roleZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: RoleSelect[] = [];
    
    for (const id of input.ids) {
      if (await checkIsAdminRole(db, id)) {
        throw ActionError.forbidden('error.system.adminRole.cannot.modify');
      }
      const [result] = await db.update(role)
        .set(input.data as Partial<RoleInsert>)
        .where(and(eq(role.id, id), isNull(role.deletedAt)))
        .returning();
      if (result) results.push(result as RoleSelect);
    }
    return results;
  },
});
