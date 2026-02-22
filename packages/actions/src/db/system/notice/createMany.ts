/**
 * 批量创建通知公告
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { notice } from '@qiyu-allinai/db/entities/system';
import { noticeZodSchemas } from './schemas';
import type { NoticeSelect, NoticeInsert } from './utils';

export const noticeCreateMany = defineAction({
  meta: {
    name: 'system.notice.createMany',
    ignoreTools: true,
    displayName: '批量创建通知公告',
    description: `批量创建多个通知公告记录。

**参数说明：**
- data: 通知数组，每个元素包含 title、type、content 等字段

**使用场景：**
1. 批量导入历史通知
2. 系统初始化时创建默认通知
3. 批量发布多条公告

**示例：**
\`\`\`json
{
  "data": [
    { "title": "欢迎使用", "type": "1", "content": "欢迎使用本系统" },
    { "title": "使用须知", "type": "2", "content": "请遵守使用规范" }
  ]
}
\`\`\``,
    tags: ['system', 'notice'],
    method: 'POST',
    path: '/api/system/notice/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(noticeZodSchemas.insert) }),
    outputSchema: z.array(noticeZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results = await db.insert(notice).values(input.data as NoticeInsert[]).returning();
    return results as NoticeSelect[];
  },
});
