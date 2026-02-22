/**
 * 批量创建系统配置
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { config } from '@qiyu-allinai/db/entities/system';
import { configZodSchemas } from './schemas';
import type { ConfigSelect, ConfigInsert } from './utils';

export const configCreateMany = defineAction({
  meta: {
    name: 'system.config.createMany',
    ignoreTools: true,
    displayName: '批量创建系统配置',
    description: `批量创建多个系统配置记录。

**参数说明：**
- data: 配置数组，每个元素包含 name、key、value 等字段

**使用场景：**
1. 系统初始化时批量创建默认配置
2. 导入配置模板
3. 批量添加某个模块的配置项

**示例：**
\`\`\`json
{
  "data": [
    { "name": "系统名称", "key": "sys.name", "value": "AI管理系统", "isSystem": true },
    { "name": "系统Logo", "key": "sys.logo", "value": "/logo.png", "isSystem": true },
    { "name": "版权信息", "key": "sys.copyright", "value": "© 2024", "isSystem": true }
  ]
}
\`\`\``,
    tags: ['system', 'config'],
    method: 'POST',
    path: '/api/system/config/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(configZodSchemas.insert) }),
    outputSchema: z.array(configZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(config).values(input.data as ConfigInsert[]).returning();
    return results as ConfigSelect[];
  },
});
