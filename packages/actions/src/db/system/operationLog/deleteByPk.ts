/**
 * 删除操作日志
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { operationLog } from '@qiyu-allinai/db/entities/system';

export const operationLogDeleteByPk = defineAction({
  meta: {
    name: 'system.operationLog.deleteByPk',
    displayName: '删除操作日志',
    description: `根据ID物理删除操作日志（永久删除，不可恢复）。

**参数说明：**
- id: 操作日志UUID

**删除行为：**
- 物理删除：数据从数据库中永久移除
- 不可恢复：删除后无法找回

**返回值：**
- true: 删除成功
- false: 日志不存在

**注意事项：**
- 操作日志通常需要保留用于审计
- 建议设置定期清理策略而非手动删除
- 删除前确认符合安全合规要求

**示例：**
DELETE /api/system/operation-log/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'operationLog'],
    method: 'DELETE',
    path: '/api/system/operation-log/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(operationLog).where(eq(operationLog.id, input.id)).returning();
    return !!result;
  },
});
