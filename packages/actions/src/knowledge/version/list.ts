/**
 * 获取版本列表 Action
 */

import { eq, and, isNull, desc } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeVersion, NODE_TYPES, type NodeVersionSelect } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';
import { nodeIdParamsSchema, versionListOutputSchema } from './schemas';

export const versionList = defineAction({
  meta: {
    ignoreTools: true,
    name: 'knowledge.version.list',
    displayName: '获取版本列表',
    description: `获取文件的所有历史版本列表。

**路径参数：**
- id: 文件节点UUID

**权限检查：**
- 需要对该节点有 read 权限

**限制：**
- 仅支持文件类型节点

**返回：**
- data: 版本数组，按创建时间倒序

**示例：**
GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/versions`,
    tags: ['knowledge', 'version'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/versions',
  },
  schemas: {
    paramsSchema: nodeIdParamsSchema,
    outputSchema: versionListOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FILE)))
      .limit(1);
    
    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }
    
    await assertNodePermission(db, context.currentUserId, nodeRecord, 'read');
    
    const versions = await db.select().from(nodeVersion)
      .where(eq(nodeVersion.nodeId, input.id))
      .orderBy(desc(nodeVersion.createdAt));
    
    return { data: versions as NodeVersionSelect[] };
  },
});
