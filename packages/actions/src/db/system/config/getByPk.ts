/**
 * 根据ID查询系统配置
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { config } from '@qiyu-allinai/db/entities/system';
import { configZodSchemas } from './schemas';
import type { ConfigSelect } from './utils';

export const configGetByPk = defineAction({
  meta: {
    name: 'system.config.getByPk',
    displayName: '根据ID查询系统配置',
    description: `根据主键ID查询单个系统配置详情。

**参数说明：**
- id: 配置的UUID主键

**返回值：**
- 成功：返回配置完整信息（id, name, key, value, isSystem等）
- 未找到：返回 null

**使用场景：**
1. 查看配置详情
2. 编辑配置前获取当前数据
3. 验证配置是否存在

**示例：**
GET /api/system/config/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'config'],
    method: 'GET',
    path: '/api/system/config/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: configZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(config).where(eq(config.id, input.id)).limit(1);
    return (result as ConfigSelect) ?? null;
  },
});
