/**
 * 根据ID查询登录日志
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { loginInfo } from '@qiyu-allinai/db/entities/system';
import { loginInfoZodSchemas } from './schemas';
import type { LoginInfoSelect } from './utils';

export const loginInfoGetByPk = defineAction({
  meta: {
    name: 'system.loginInfo.getByPk',
    displayName: '根据ID查询登录日志',
    description: `根据主键ID查询单个登录日志详情。

**参数说明：**
- id: 登录日志的UUID主键

**返回值：**
- 成功：返回登录日志完整信息（loginName, ipaddr, loginLocation, browser, os, status, msg, loginTime等）
- 未找到：返回 null

**使用场景：**
1. 查看登录详情（浏览器、操作系统、地理位置等）
2. 分析登录失败原因
3. 安全审计

**示例：**
GET /api/system/login-info/550e8400-e29b-41d4-a716-446655440000`,
    tags: ['system', 'loginInfo'],
    method: 'GET',
    path: '/api/system/login-info/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: loginInfoZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(loginInfo).where(eq(loginInfo.id, input.id)).limit(1);
    return (result as LoginInfoSelect) ?? null;
  },
});
