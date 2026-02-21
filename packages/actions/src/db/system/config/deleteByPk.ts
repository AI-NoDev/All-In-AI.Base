/**
 * 删除系统配置
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { config } from '@qiyu-allinai/db/entities/system';

export const configDeleteByPk = defineAction({
  meta: {
    name: 'system.config.deleteByPk',
    displayName: '删除系统配置',
    description: `根据ID物理删除系统配置（永久删除，不可恢复）。

**参数说明：**
- id: 配置UUID

**删除行为：**
- 物理删除：数据从数据库中永久移除
- 不可恢复：删除后无法找回

**返回值：**
- true: 删除成功
- false: 配置不存在

**注意事项：**
- 系统内置配置（isSystem=true）不建议删除
- 删除前确认没有功能依赖此配置
- 建议先备份配置值

**示例：**
DELETE /api/system/config/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'config'],
    method: 'DELETE',
    path: '/api/system/config/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(config).where(eq(config.id, input.id)).returning();
    return !!result;
  },
});
