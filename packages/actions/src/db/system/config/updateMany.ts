/**
 * 批量更新系统配置
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { config } from '@qiyu-allinai/db/entities/system';
import { configZodSchemas } from './schemas';
import type { ConfigSelect, ConfigInsert } from './utils';

export const configUpdateMany = defineAction({
  meta: {
    name: 'system.config.updateMany',
    ignoreTools: true,
    displayName: '批量更新系统配置',
    description: `根据ID列表批量更新系统配置，所有指定的配置将应用相同的更新数据。

**参数说明：**
- ids: 要更新的配置ID数组
- data: 更新的字段数据

**使用场景：**
1. 批量修改配置属性
2. 批量添加备注
3. 批量调整 isSystem 标识

**示例：**
\`\`\`json
{
  "ids": ["id1", "id2", "id3"],
  "data": {
    "isSystem": false,
    "remark": "已迁移为自定义配置"
  }
}
\`\`\``,
    tags: ['system', 'config'],
    method: 'PUT',
    path: '/api/system/config/batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()), data: configZodSchemas.update }),
    outputSchema: z.array(configZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: ConfigSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(config)
        .set(input.data as Partial<ConfigInsert>)
        .where(eq(config.id, id))
        .returning();
      if (result) results.push(result as ConfigSelect);
    }
    return results;
  },
});
