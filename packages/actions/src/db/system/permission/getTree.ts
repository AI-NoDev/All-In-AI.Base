/**
 * 获取权限树
 */

import { z } from 'zod';
import { asc } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { permission } from '@qiyu-allinai/db/entities/system';
import { permissionZodSchemas } from './schemas';
import type { PermissionSelect } from './utils';

export const permissionGetTree = defineAction({
  meta: {
    name: 'system.permission.getTree',
    displayName: '获取权限树',
    description: `获取完整的权限树结构，按排序号升序排列。

**返回：**
- 返回所有权限的扁平列表，按 orderNum 升序排列
- 前端可根据 parentId 构建树形结构

**使用场景：**
- 权限管理页面展示权限树
- 角色授权时选择权限
- 菜单配置时关联权限

**返回字段：**
- id: 权限ID
- code: 权限编码
- name: 权限名称
- type: 权限类型
- module: 所属模块
- parentId: 父级ID（null表示顶级）
- status: 状态
- orderNum: 排序号

**示例：**
GET /api/system/permission/tree`,
    tags: ['system', 'permission'],
    method: 'GET',
    path: '/api/system/permission/tree',
  },
  schemas: {
    outputSchema: z.array(permissionZodSchemas.select),
  },
  execute: async (_input, context) => {
    const { db } = context;
    const data = await db
      .select()
      .from(permission)
      .orderBy(asc(permission.orderNum));
    return data as PermissionSelect[];
  },
});
