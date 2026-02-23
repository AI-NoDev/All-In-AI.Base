/**
 * 获取登录日志Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { loginInfoSchemas } from './schemas';

export const loginInfoGetSchema = defineAction({
  meta: {
    name: 'system.loginInfo.getSchema',
    ignoreTools: true,
    displayName: '获取登录日志Schema',
    description: `获取登录日志表的JSON Schema定义。

**返回内容：**
- 字段名称和类型
- 必填/可选标识
- 字段约束

**使用场景：**
1. 前端动态生成查询表单
2. 数据导出时的格式参考
3. API文档生成`,
    tags: ['system', 'loginInfo'],
    method: 'GET',
    path: '/api/system/login-info/schema',
  },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(loginInfoSchemas.select) as Record<string, unknown>;
  },
});
