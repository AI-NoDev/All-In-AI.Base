/**
 * 删除字典
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dict } from '@qiyu-allinai/db/entities/system';

export const dictDeleteByPk = defineAction({
  meta: {
    name: 'system.dict.deleteByPk',
    displayName: '删除字典',
    description: `根据ID软删除字典项。

**路径参数：**
- id: 字典项的UUID

**注意事项：**
- 软删除，数据保留但标记为已删除
- 删除后前端下拉框等组件将不再显示该选项

**返回：**
- true: 删除成功
- false: 未找到或删除失败

**示例：**
DELETE /api/system/dict/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'dict'],
    method: 'DELETE',
    path: '/api/system/dict/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserName } = context;
    const [result] = await db.update(dict)
      .set({
        deletedAt: new Date().toISOString(),
        deletedById: currentUserId,
        deletedBy: currentUserName,
      })
      .where(and(eq(dict.id, input.id), isNull(dict.deletedAt)))
      .returning();
    return !!result;
  },
});
