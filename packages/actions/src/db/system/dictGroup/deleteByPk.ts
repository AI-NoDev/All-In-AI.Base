/**
 * 删除字典组
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { dictGroup } from '@qiyu-allinai/db/entities/system';

export const dictGroupDeleteByPk = defineAction({
  meta: {
    name: 'system.dictGroup.deleteByPk',
    displayName: '删除字典组',
    description: `根据Key物理删除字典组（永久删除，不可恢复）。

**参数说明：**
- key: 字典组键

**删除行为：**
- 物理删除：数据从数据库中永久移除
- 不可恢复：删除后无法找回
- 关联的字典项也应一并删除

**返回值：**
- true: 删除成功
- false: 字典组不存在

**注意事项：**
- 删除前确认没有功能依赖此字典组
- 建议先禁用（status="1"）而非直接删除

**示例：**
DELETE /api/system/dict-group/sys_user_sex`,
    tags: ['system', 'dictGroup'],
    method: 'DELETE',
    path: '/api/system/dict-group/:key',
  },
  schemas: {
    paramsSchema: z.object({ key: z.string().min(1).max(100) }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.delete(dictGroup).where(eq(dictGroup.key, input.key)).returning();
    return !!result;
  },
});
