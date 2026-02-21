/**
 * 获取定时任务Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { jobZodSchemas } from './schemas';

export const jobGetSchema = defineAction({
  meta: {
    name: 'system.job.getSchema',
    ignoreTools: true,
    displayName: '获取定时任务Schema',
    description: `获取定时任务表的JSON Schema定义。

**返回内容：**
- 字段名称和类型
- 必填/可选标识
- 字段约束

**使用场景：**
1. 前端动态生成任务编辑表单
2. 数据导入时的格式验证
3. API文档生成`,
    tags: ['system', 'job'],
    method: 'GET',
    path: '/api/system/job/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(jobZodSchemas.select) as Record<string, unknown>;
  },
});
