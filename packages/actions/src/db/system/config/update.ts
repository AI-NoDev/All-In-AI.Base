/**
 * 更新系统配置
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { config } from '@qiyu-allinai/db/entities/system';
import { configZodSchemas } from './schemas';
import type { ConfigSelect, ConfigInsert } from './utils';

export const configUpdate = defineAction({
  meta: {
    name: 'system.config.update',
    displayName: '更新系统配置',
    description: `根据ID更新单个系统配置信息。

**路径参数：**
- id: 配置UUID

**可更新字段：**
- name: 配置名称
- key: 配置键（建议不要修改已使用的key）
- value: 配置值
- isSystem: 是否系统内置
- remark: 备注

**使用场景：**
1. 修改配置值
2. 更新配置说明
3. 调整配置属性

**注意事项：**
- 系统内置配置（isSystem=true）修改需谨慎
- 修改 key 可能影响依赖此配置的功能

**示例：**
\`\`\`json
// PUT /api/system/config/550e8400-e29b-41d4-a716-446655440000
{
  "data": {
    "value": "新的配置值",
    "remark": "更新于2024-01-01"
  }
}
\`\`\``,
    tags: ['system', 'config'],
    method: 'PUT',
    path: '/api/system/config/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: configZodSchemas.update }),
    outputSchema: configZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(config)
      .set(input.data as Partial<ConfigInsert>)
      .where(eq(config.id, input.id))
      .returning();
    return result as ConfigSelect;
  },
});
