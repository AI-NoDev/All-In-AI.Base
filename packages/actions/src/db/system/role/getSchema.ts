/**
 * 获取角色Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { roleSchemas } from '@qiyu-allinai/db/entities/system/role';

export const roleGetSchema = defineAction({
  meta: {
    name: 'system.role.getSchema',
    ignoreTools: true,
    displayName: '获取角色Schema',
    description: `获取角色表的JSON Schema定义。

**返回：** JSON Schema 对象

**使用场景：**
- 前端动态生成表单
- API文档生成`,
    tags: ['system', 'role'],
    method: 'GET',
    path: '/api/system/role/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(roleSchemas.select) as Record<string, unknown>;
  },
});
