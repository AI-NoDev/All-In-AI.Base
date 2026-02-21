/**
 * 获取节点 Schema
 */

import { z } from 'zod';
import { defineAction } from '../../core/define';
import { toJSONSchema } from '../../core/schema';
import { nodeZodSchemas } from '@qiyu-allinai/db/entities/knowledge';

export const nodeGetSchema = defineAction({
  meta: {
    name: 'knowledge.node.getSchema',
    displayName: '获取节点Schema',
    description: `获取知识库节点表的 JSON Schema 定义。

**返回：**
- JSON Schema 对象，描述节点数据结构

**使用场景：**
- 前端表单动态生成
- API 文档生成
- 数据验证`,
    tags: ['knowledge', 'node', 'schema'],
    method: 'GET',
    path: '/api/knowledge/nodes/schema',
    ignoreTools: true,
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(nodeZodSchemas.select) as Record<string, unknown>;
  },
});
