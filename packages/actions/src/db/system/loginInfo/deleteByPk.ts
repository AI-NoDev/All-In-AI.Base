/**
 * 删除登录日志
 */

import { t } from 'elysia';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { loginInfo } from '@qiyu-allinai/db/entities/system';

export const loginInfoDeleteByPk = defineAction({
  meta: {
    name: 'system.loginInfo.deleteByPk',
    displayName: '删除登录日志',
    description: `根据ID物理删除登录日志（永久删除，不可恢复）。

**参数说明：**
- id: 登录日志UUID

**删除行为：**
- 物理删除：数据从数据库中永久移除
- 不可恢复：删除后无法找回

**返回值：**
- true: 删除成功
- false: 日志不存在

**注意事项：**
- 登录日志通常需要保留用于审计
- 建议设置定期清理策略而非手动删除
- 删除前确认符合安全合规要求

**示例：**
DELETE /api/system/login-info/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'loginInfo'],
    method: 'DELETE',
    path: '/api/system/login-info/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(loginInfo).where(eq(loginInfo.id, input.id)).returning();
    return !!result;
  },
});
