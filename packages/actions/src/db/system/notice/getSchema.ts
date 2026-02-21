/**
 * 获取通知公告Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { noticeZodSchemas } from './schemas';

export const noticeGetSchema = defineAction({
  meta: {
    name: 'system.notice.getSchema',
    ignoreTools: true,
    displayName: '获取通知公告Schema',
    description: `获取通知公告表的JSON Schema定义，用于动态表单生成或数据验证。

**返回内容：**
- 字段名称和类型
- 必填/可选标识
- 字段约束（长度、格式等）

**使用场景：**
1. 前端动态生成通知编辑表单
2. 数据导入时的格式验证
3. API文档生成`,
    tags: ['system', 'notice'],
    method: 'GET',
    path: '/api/system/notice/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(noticeZodSchemas.select) as Record<string, unknown>;
  },
});
