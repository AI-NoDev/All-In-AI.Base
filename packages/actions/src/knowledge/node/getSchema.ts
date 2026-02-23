/**
 * 获取节点 Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../core/define';
import { toJSONSchema } from '../../core/schema';
import { nodeSchemas } from '@qiyu-allinai/db/entities/knowledge';

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
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(nodeSchemas.select) as Record<string, unknown>;
  },
});
