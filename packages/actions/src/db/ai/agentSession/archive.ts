/**
 * 归档Agent会话
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { agentSession } from '@qiyu-allinai/db/entities/ai';
import { agentSessionZodSchemas } from './schemas';
import type { AgentSessionSelect } from './utils';

export const agentSessionArchive = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ai.agentSession.archive',
    displayName: '归档Agent会话',
    description: `归档或取消归档指定Agent会话。

**路径参数：**
- id: 会话UUID

**请求体：**
- isArchived: true=归档，false=取消归档

**归档行为：**
- 归档后会话不会出现在默认列表中
- 可通过 filter.isArchived = true 查看归档会话
- 归档不会删除会话数据

**使用场景：**
1. 整理会话列表，归档不常用的会话
2. 恢复误归档的会话

**示例：**
\`\`\`json
// PUT /api/ai/agent-session/xxx/archive
{ "isArchived": true }
\`\`\``,
    tags: ['ai', 'agentSession'],
    method: 'PUT',
    path: '/api/ai/agent-session/:id/archive',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ isArchived: z.boolean() }),
    outputSchema: agentSessionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(agentSession)
      .set({
        isArchived: input.isArchived,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(agentSession.id, input.id), isNull(agentSession.deletedAt)))
      .returning();
    return result as AgentSessionSelect;
  },
});
