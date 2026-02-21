/**
 * 获取任务日志Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { jobLogZodSchemas } from './schemas';

export const jobLogGetSchema = defineAction({
  meta: {
    name: 'system.jobLog.getSchema',
    ignoreTools: true,
    displayName: '获取任务日志Schema',
    description: `获取任务日志表的JSON Schema定义。

**返回内容：**
- 字段名称和类型
- 必填/可选标识
- 字段约束

**使用场景：**
1. 前端动态生成查询表单
2. 数据导出时的格式参考
3. API文档生成`,
    tags: ['system', 'jobLog'],
    method: 'GET',
    path: '/api/system/job-log/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(jobLogZodSchemas.select) as Record<string, unknown>;
  },
});
