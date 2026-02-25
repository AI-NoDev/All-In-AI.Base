/**
 * 获取工作流Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { workflowSchemas } from './schemas';

export const workflowGetSchema = defineAction({
  meta: {
    name: 'ai.workflow.getSchema',
    ignoreTools: true,
    displayName: '获取工作流Schema',
    description: `获取工作流表的JSON Schema定义，用于动态表单生成或数据验证。

**返回：** JSON Schema 对象`,
    tags: ['ai', 'workflow'],
    method: 'GET',
    path: '/api/ai/workflow/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(workflowSchemas.select) as Record<string, unknown>;
  },
});
