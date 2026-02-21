/**
 * 更新通知公告
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice } from '@qiyu-allinai/db/entities/system';
import { noticeZodSchemas } from './schemas';
import type { NoticeSelect, NoticeInsert } from './utils';

export const noticeUpdate = defineAction({
  meta: {
    name: 'system.notice.update',
    displayName: '更新通知公告',
    description: `根据ID更新单个通知公告信息。

**路径参数：**
- id: 通知公告UUID

**可更新字段：**
- title: 通知标题
- type: 通知类型，"1"=通知，"2"=公告
- content: 通知内容
- status: 状态，"0"=正常，"1"=关闭
- remark: 备注

**使用场景：**
1. 修改通知内容
2. 关闭过期通知
3. 更改通知类型

**示例：**
\`\`\`json
// PUT /api/system/notice/550e8400-e29b-41d4-a716-446655440000
{
  "data": {
    "title": "系统维护通知（已完成）",
    "status": "1"
  }
}
\`\`\``,
    tags: ['system', 'notice'],
    method: 'PUT',
    path: '/api/system/notice/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: noticeZodSchemas.update }),
    outputSchema: noticeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(notice)
      .set(input.data as Partial<NoticeInsert>)
      .where(eq(notice.id, input.id))
      .returning();
    return result as NoticeSelect;
  },
});
