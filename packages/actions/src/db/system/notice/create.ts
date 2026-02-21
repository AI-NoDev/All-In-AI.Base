/**
 * 创建通知公告
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { notice } from '@qiyu-allinai/db/entities/system';
import { noticeZodSchemas } from './schemas';
import type { NoticeSelect, NoticeInsert } from './utils';

export const noticeCreate = defineAction({
  meta: {
    name: 'system.notice.create',
    displayName: '创建通知公告',
    description: `创建单个通知公告记录。

**必填字段：**
- title: 通知标题
- type: 通知类型，"1"=通知，"2"=公告
- content: 通知内容（支持富文本HTML）

**可选字段：**
- status: 状态，"0"=正常（默认），"1"=关闭
- remark: 备注说明

**审计字段（自动填充）：**
- createdBy/updatedBy: 创建人/更新人姓名
- createdAt/updatedAt: 创建/更新时间

**使用场景：**
1. 发布系统通知
2. 发布公司公告
3. 发布维护通知

**示例：**
\`\`\`json
{
  "data": {
    "title": "系统维护通知",
    "type": "1",
    "content": "<p>系统将于今晚22:00-24:00进行维护升级</p>",
    "status": "0"
  }
}
\`\`\``,
    tags: ['system', 'notice'],
    method: 'POST',
    path: '/api/system/notice',
  },
  schemas: {
    bodySchema: z.object({ data: noticeZodSchemas.insert }),
    outputSchema: noticeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(notice).values(input.data as NoticeInsert).returning();
    return result as NoticeSelect;
  },
});
