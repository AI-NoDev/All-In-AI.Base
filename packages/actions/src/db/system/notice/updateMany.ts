/**
 * 批量更新通知公告
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice, noticeTypeboxSchemas } from '@qiyu-allinai/db/entities/system';
import type { NoticeSelect, NoticeInsert } from '@qiyu-allinai/db/entities/system/notice';

export const noticeUpdateMany = defineAction({
  meta: {
    name: 'system.notice.updateMany',
    ignoreTools: true,
    displayName: '批量更新通知公告',
    description: `根据ID列表批量更新通知公告，所有指定的通知将应用相同的更新数据。

**参数说明：**
- ids: 要更新的通知ID数组
- data: 更新的字段数据

**使用场景：**
1. 批量关闭过期通知：设置 status = "1"
2. 批量修改通知类型
3. 批量添加备注

**示例：**
\`\`\`json
{
  "ids": ["id1", "id2", "id3"],
  "data": {
    "status": "1",
    "remark": "已过期"
  }
}
\`\`\``,
    tags: ['system', 'notice'],
    method: 'PUT',
    path: '/api/system/notice/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: noticeTypeboxSchemas.update }),
    outputSchema: t.Array(noticeTypeboxSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    const results: NoticeSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(notice)
        .set(input.data as Partial<NoticeInsert>)
        .where(eq(notice.id, id))
        .returning();
      if (result) results.push(result as NoticeSelect);
    }
    return results;
  },
});
