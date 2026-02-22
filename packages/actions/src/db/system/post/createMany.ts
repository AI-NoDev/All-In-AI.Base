/**
 * 批量创建岗位
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { post } from '@qiyu-allinai/db/entities/system';
import { postZodSchemas } from './schemas';
import type { PostSelect, PostInsert } from './utils';

export const postCreateMany = defineAction({
  meta: {
    name: 'system.post.createMany',
    ignoreTools: true,
    displayName: '批量创建岗位',
    description: `批量创建多个岗位记录，适用于初始化或批量导入场景。

**参数说明：**
- data: 岗位数组，每个元素包含 code、name 等字段

**使用场景：**
1. 系统初始化时批量创建岗位
2. 从Excel导入岗位数据
3. 复制其他系统的岗位配置

**示例：**
\`\`\`json
{
  "data": [
    { "code": "CEO", "name": "首席执行官", "sort": 1 },
    { "code": "CTO", "name": "技术总监", "sort": 2 },
    { "code": "CFO", "name": "财务总监", "sort": 3 }
  ]
}
\`\`\``,
    tags: ['system', 'post'],
    method: 'POST',
    path: '/api/system/post/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(postZodSchemas.insert) }),
    outputSchema: z.array(postZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(post).values(input.data as PostInsert[]).returning();
    return results as PostSelect[];
  },
});
