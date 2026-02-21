/**
 * 更新权限
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { permission } from '@qiyu-allinai/db/entities/system';
import { permissionZodSchemas } from './schemas';
import type { PermissionSelect, PermissionInsert } from './utils';

export const permissionUpdate = defineAction({
  meta: {
    name: 'system.permission.update',
    displayName: '更新权限',
    description: `根据ID更新权限信息。

**路径参数：**
- id: 权限UUID，必填

**请求体参数 (data)：**
- code: 权限编码，可选
- name: 权限名称，可选
- type: 权限类型，可选
- module: 所属模块，可选
- parentId: 父级权限ID，可选
- status: 状态，可选
- orderNum: 排序号，可选
- remark: 备注，可选

**示例：**
PUT /api/system/permission/550e8400-e29b-41d4-a716-446655440000
\`\`\`json
{
  "data": {
    "name": "用户管理",
    "status": false,
    "orderNum": 10
  }
}
\`\`\``,
    tags: ['system', 'permission'],
    method: 'PUT',
    path: '/api/system/permission/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: permissionZodSchemas.update }),
    outputSchema: permissionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db
      .update(permission)
      .set(input.data as Partial<PermissionInsert>)
      .where(eq(permission.id, input.id))
      .returning();
    return result as PermissionSelect;
  },
});
