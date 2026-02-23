/**
 * 知识库文件版本 Schemas (TypeBox)
 */

import { t } from 'elysia';
import { nodeVersionSchemas, nodeSchemas } from '@qiyu-allinai/db/entities/knowledge';

// ============ 参数 Schemas ============
export const nodeIdParamsSchema = t.Object({
  id: t.String({ description: '节点 ID' }),
});

export const versionIdParamsSchema = t.Object({
  id: t.String({ description: '版本 ID' }),
});

// ============ 输出 Schemas ============
export const versionListOutputSchema = t.Object({
  data: t.Array(nodeVersionSchemas.select, { description: '版本列表' }),
});

export const downloadUrlOutputSchema = t.Object({
  url: t.String({ description: '下载 URL' }),
  expiresAt: t.String({ description: 'URL 过期时间' }),
});

// ============ 分页查询 Schemas ============
export const versionFilterSchema = t.Optional(t.Object({
  nodeIds: t.Optional(t.Array(t.String({ description: '节点 ID' }), { description: '节点 ID 列表，批量查询' })),
  nodeId: t.Optional(t.String({ description: '节点 ID，单个查询' })),
  versionNumber: t.Optional(t.String({ description: '版本号' })),
  createdAtStart: t.Optional(t.String({ format: 'date-time', description: '创建时间起始' })),
  createdAtEnd: t.Optional(t.String({ format: 'date-time', description: '创建时间结束' })),
}, { description: '过滤条件' }));

export const versionPaginationBodySchema = t.Object({
  filter: versionFilterSchema,
  sort: t.Optional(t.Object({
    field: t.Union([t.Literal('versionNumber'), t.Literal('size'), t.Literal('createdAt')], { description: '排序字段' }),
    order: t.Union([t.Literal('asc'), t.Literal('desc')], { description: '排序方向' }),
  }, { description: '排序配置' })),
  offset: t.Integer({ minimum: 0, default: 0, description: '偏移量' }),
  limit: t.Integer({ minimum: 1, maximum: 100, default: 20, description: '每页数量' }),
});

export const versionPaginationOutputSchema = t.Object({
  data: t.Array(nodeVersionSchemas.select, { description: '版本列表' }),
  total: t.Number({ description: '总数' }),
});

// ============ 导出 Schemas ============
export { nodeVersionSchemas, nodeSchemas };
