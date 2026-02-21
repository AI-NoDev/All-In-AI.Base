/**
 * 根据ID查询通知公告
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { notice } from '@qiyu-allinai/db/entities/system';
import { noticeZodSchemas } from './schemas';
import type { NoticeSelect } from './utils';

export const noticeGetByPk = defineAction({
  meta: {
    name: 'system.notice.getByPk',
    displayName: '根据ID查询通知公告',
    description: `根据主键ID查询单个通知公告详情。

**参数说明：**
- id: 通知公告的UUID主键

**返回值：**
- 成功：返回通知完整信息（id, title, type, content, status等）
- 未找到：返回 null

**使用场景：**
1. 查看通知详情页
2. 编辑通知前获取当前数据
3. 验证通知是否存在

**示例：**
GET /api/system/notice/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'notice'],
    method: 'GET',
    path: '/api/system/notice/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: noticeZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(notice).where(eq(notice.id, input.id)).limit(1);
    return (result as NoticeSelect) ?? null;
  },
});
