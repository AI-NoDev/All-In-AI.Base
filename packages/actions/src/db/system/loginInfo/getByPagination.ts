/**
 * 分页查询登录日志
 */

import { z } from 'zod';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { loginInfo } from '@qiyu-allinai/db/entities/system';
import { loginInfoPaginationBodySchema, loginInfoZodSchemas } from './schemas';
import type { LoginInfoSelect } from './utils';

export const loginInfoGetByPagination = defineAction({
  meta: {
    name: 'system.loginInfo.getByPagination',
    displayName: '分页查询登录日志',
    description: `分页查询登录日志列表，用于审计和安全监控。

**过滤参数 (filter)：**
- ids: 按ID列表精确查询
- loginNames: 按登录账号列表精确查询
- status: 按状态过滤，"0"=成功，"1"=失败
- loginName: 按登录账号模糊搜索
- ipaddr: 按IP地址模糊搜索，如 "192.168" 匹配内网IP
- loginTimeStart/loginTimeEnd: 登录时间范围
- createdAtStart/createdAtEnd: 记录创建时间范围

**排序参数 (sort)：**
- field: loginName | ipaddr | loginTime | createdAt
- order: asc | desc

**分页参数：**
- offset: 起始位置，默认0
- limit: 每页数量，1-100，默认20

**使用场景：**
1. 查看某用户的登录历史：filter.loginName = "admin"
2. 查看登录失败记录：filter.status = "1"
3. 查看某IP的登录记录：filter.ipaddr = "192.168.1"
4. 查看今日登录记录：设置 loginTimeStart/loginTimeEnd

**示例：**
\`\`\`json
{
  "filter": { "status": "1", "loginName": "admin" },
  "sort": { "field": "loginTime", "order": "desc" },
  "offset": 0,
  "limit": 50
}
\`\`\``,
    tags: ['system', 'loginInfo'],
    method: 'POST',
    path: '/api/system/login-info/query',
  },
  schemas: {
    bodySchema: loginInfoPaginationBodySchema,
    outputSchema: z.object({ data: z.array(loginInfoZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    const conditions = [];

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(loginInfo.id, filter.ids));
      if (filter.loginNames?.length) conditions.push(inArray(loginInfo.loginName, filter.loginNames));
      if (filter.status) conditions.push(eq(loginInfo.status, filter.status));
      if (filter.loginName) conditions.push(ilike(loginInfo.loginName, `%${filter.loginName}%`));
      if (filter.ipaddr) conditions.push(ilike(loginInfo.ipaddr, `%${filter.ipaddr}%`));
      if (filter.createdAtStart) conditions.push(gte(loginInfo.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(loginInfo.createdAt, filter.createdAtEnd));
      if (filter.loginTimeStart) conditions.push(gte(loginInfo.loginTime, new Date(filter.loginTimeStart)));
      if (filter.loginTimeEnd) conditions.push(lte(loginInfo.loginTime, new Date(filter.loginTimeEnd)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? loginInfo[sort.field as keyof LoginInfoSelect] : loginInfo.createdAt;

    const data = await db.select().from(loginInfo)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof orderFn>[0]))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(loginInfo).where(whereClause);
    return { data: data as LoginInfoSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
