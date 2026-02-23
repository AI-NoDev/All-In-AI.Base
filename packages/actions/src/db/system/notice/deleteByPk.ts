/**
 * 删除通知公告
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice } from '@qiyu-allinai/db/entities/system';

export const noticeDeleteByPk = defineAction({
  meta: {
    name: 'system.notice.deleteByPk',
    displayName: '删除通知公告',
    description: `根据ID物理删除通知公告（永久删除，不可恢复）。

**参数说明：**
- id: 通知公告UUID

**删除行为：**
- 物理删除：数据从数据库中永久移除
- 不可恢复：删除后无法找回

**返回值：**
- true: 删除成功
- false: 通知不存在

**注意事项：**
- 删除前建议确认通知已过期或不再需要
- 如需保留历史记录，建议使用 status="1" 关闭而非删除

**示例：**
DELETE /api/system/notice/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'notice'],
    method: 'DELETE',
    path: '/api/system/notice/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(notice).where(eq(notice.id, input.id)).returning();
    return !!result;
  },
});
