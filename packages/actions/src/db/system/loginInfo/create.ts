/**
 * 创建登录日志
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { loginInfo, loginInfoSchemas } from '@qiyu-allinai/db/entities/system';
import type { LoginInfoSelect, LoginInfoInsert } from '@qiyu-allinai/db/entities/system/loginInfo';

export const loginInfoCreate = defineAction({
  meta: {
    name: 'system.loginInfo.create',
    displayName: '创建登录日志',
    description: `创建单个登录日志记录（通常由系统自动调用）。

**必填字段：**
- loginName: 登录账号
- ipaddr: 登录IP地址
- status: 登录状态，"0"=成功，"1"=失败

**可选字段：**
- loginLocation: 登录地点（根据IP解析）
- browser: 浏览器类型
- os: 操作系统
- msg: 提示消息（失败时记录原因）
- loginTime: 登录时间

**使用场景：**
1. 用户登录成功后记录
2. 用户登录失败后记录（含失败原因）
3. 安全审计日志

**示例：**
\`\`\`json
{
  "data": {
    "loginName": "admin",
    "ipaddr": "192.168.1.100",
    "loginLocation": "内网IP",
    "browser": "Chrome 120",
    "os": "Windows 10",
    "status": "0",
    "msg": "登录成功",
    "loginTime": "2024-01-01T10:00:00Z"
  }
}
\`\`\``,
    tags: ['system', 'loginInfo'],
    method: 'POST',
    path: '/api/system/login-info',
  },
  schemas: {
    bodySchema: t.Object({ data: loginInfoSchemas.insert }),
    outputSchema: loginInfoSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(loginInfo).values(input.data as LoginInfoInsert).returning();
    return result as LoginInfoSelect;
  },
});
