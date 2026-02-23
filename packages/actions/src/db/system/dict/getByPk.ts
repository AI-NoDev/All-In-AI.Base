/**
 * 根据ID查询字典
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dict, dictSchemas } from '@qiyu-allinai/db/entities/system';
import type { DictSelect } from '@qiyu-allinai/db/entities/system/dict';

export const dictGetByPk = defineAction({
  meta: {
    name: 'system.dict.getByPk',
    displayName: '根据ID查询字典',
    description: `根据主键ID查询单个字典项的详细信息。

**路径参数：**
- id: 字典项的UUID

**返回：**
- 找到时返回完整的字典对象
- 未找到或已删除时返回 null

**示例：**
GET /api/system/dict/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'dict'],
    method: 'GET',
    path: '/api/system/dict/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([dictSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(dict)
      .where(and(eq(dict.id, input.id), isNull(dict.deletedAt)))
      .limit(1);
    return (result as DictSelect) ?? null;
  },
});
