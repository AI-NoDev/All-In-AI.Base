/**
 * 根据ID查询权限
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { permission } from '@qiyu-allinai/db/entities/system';
import { permissionZodSchemas } from './schemas';
import type { PermissionSelect } from './utils';

export const permissionGetByPk = defineAction({
  meta: {
    name: 'system.permission.getByPk',
    displayName: '根据ID查询权限',
    description: `根据权限ID查询单个权限详情。

**路径参数：**
- id: 权限UUID，必填

**返回：**
- 成功：返回权限对象，包含 id, code, name, type, module, parentId, status, orderNum 等字段
- 未找到：返回 null

**示例：**
GET /api/system/permission/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'permission'],
    method: 'GET',
    path: '/api/system/permission/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: permissionZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db
      .select()
      .from(permission)
      .where(eq(permission.id, input.id))
      .limit(1);
    return (result as PermissionSelect) ?? null;
  },
});
