/**
 * 获取菜单Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { menuSchemas } from '@qiyu-allinai/db/entities/system';

export const menuGetSchema = defineAction({
  meta: {
    name: 'system.menu.getSchema',
    ignoreTools: true,
    displayName: '获取菜单Schema',
    description: `获取菜单表的JSON Schema定义。

**返回：** JSON Schema 对象

**使用场景：**
- 前端动态生成表单
- API文档生成`,
    tags: ['system', 'menu'],
    method: 'GET',
    path: '/api/system/menu/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(menuSchemas.select) as Record<string, unknown>;
  },
});
