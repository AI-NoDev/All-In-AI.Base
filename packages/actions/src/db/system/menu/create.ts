/**
 * 创建菜单
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { menu, menuSchemas } from '@qiyu-allinai/db/entities/system';
import type { MenuSelect, MenuInsert } from '@qiyu-allinai/db/entities/system/menu';

export const menuCreate = defineAction({
  meta: {
    name: 'system.menu.create',
    displayName: '创建菜单',
    description: `创建单个菜单项。

**必填字段：**
- name: 菜单名称
- type: 菜单类型，M=目录，C=菜单，F=按钮

**可选字段：**
- parentId: 父级菜单ID，null表示顶级
- path: 路由路径（菜单类型需要）
- component: 组件路径
- permission: 权限标识（按钮类型需要）
- icon: 图标 iconify ,例如：mdi:robot
- orderNum: 排序号，默认0
- visible: 是否可见，默认true
- status: 状态，"0"=正常，"1"=禁用

**示例 - 创建目录：**
\`\`\`json
{
  "data": {
    "name": "系统管理",
    "type": "M",
    "icon": "setting",
    "orderNum": 1
  }
}
\`\`\`

**示例 - 创建菜单：**
\`\`\`json
{
  "data": {
    "name": "用户管理",
    "type": "C",
    "parentId": "parent-uuid",
    "path": "/system/users",
    "component": "system/users/index"
  }
}
\`\`\``,
    tags: ['system', 'menu'],
    method: 'POST',
    path: '/api/system/menu',
  },
  schemas: {
    bodySchema: t.Object({ data: menuSchemas.insert }),
    outputSchema: menuSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(menu).values(input.data as MenuInsert).returning();
    return result as MenuSelect;
  },
});
