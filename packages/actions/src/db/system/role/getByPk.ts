/**
 * 根据ID查询角色
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { role, roleSchemas } from '@qiyu-allinai/db/entities/system';
import type { RoleSelect } from '@qiyu-allinai/db/entities/system/role';

export const roleGetByPk = defineAction({
  meta: {
    name: 'system.role.getByPk',
    displayName: '根据ID查询角色',
    description: `根据主键ID查询单个角色的详细信息。

**路径参数：**
- id: 角色的UUID

**返回：**
- 找到时返回完整的角色对象
- 未找到或已删除时返回 null

**示例：**
GET /api/system/role/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'role'],
    method: 'GET',
    path: '/api/system/role/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([roleSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(role)
      .where(and(eq(role.id, input.id), isNull(role.deletedAt)))
      .limit(1);
    return (result as RoleSelect) ?? null;
  },
});
