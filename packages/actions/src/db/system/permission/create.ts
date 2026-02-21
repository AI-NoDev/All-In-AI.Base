/**
 * 创建权限
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { permission } from '@qiyu-allinai/db/entities/system';
import { permissionZodSchemas } from './schemas';
import type { PermissionSelect, PermissionInsert } from './utils';

export const permissionCreate = defineAction({
  meta: {
    name: 'system.permission.create',
    displayName: '创建权限',
    description: `创建单个权限记录。

**请求体参数 (data)：**
- code: 权限编码，必填，如 "system:user:view"
- name: 权限名称，必填，如 "查看用户"
- type: 权限类型，必填，可选值：menu(菜单), button(按钮), api(接口)
- module: 所属模块，必填，如 "system", "ai", "im"
- parentId: 父级权限ID，可选，null表示顶级权限
- status: 状态，可选，默认true(启用)
- orderNum: 排序号，可选，默认0
- remark: 备注，可选

**示例：**
\`\`\`json
{
  "data": {
    "code": "system:user:view",
    "name": "查看用户",
    "type": "menu",
    "module": "system",
    "parentId": null,
    "status": true,
    "orderNum": 1
  }
}
\`\`\``,
    tags: ['system', 'permission'],
    method: 'POST',
    path: '/api/system/permission',
  },
  schemas: {
    bodySchema: z.object({ data: permissionZodSchemas.insert }),
    outputSchema: permissionZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(permission).values(input.data as PermissionInsert).returning();
    return result as PermissionSelect;
  },
});
