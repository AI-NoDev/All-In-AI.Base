/**
 * 获取版本 Schema Action
 */

import { t } from 'elysia';
import { defineAction } from '../../core/define';
import { toJSONSchema } from '../../core/schema';
import { nodeVersionSchemas } from './schemas';

export const versionGetSchema = defineAction({
  meta: {
    name: 'knowledge.version.getSchema',
    displayName: '获取版本Schema',
    description: `获取文件版本表的 JSON Schema 定义。

**返回：**
- JSON Schema 对象，描述版本数据结构

**使用场景：**
- 前端表单动态生成
- API 文档生成`,
    tags: ['knowledge', 'version'],
    method: 'GET',
    path: '/api/knowledge/versions/schema',
    ignoreTools: true,
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(nodeVersionSchemas.select) as Record<string, unknown>;
  },
});
