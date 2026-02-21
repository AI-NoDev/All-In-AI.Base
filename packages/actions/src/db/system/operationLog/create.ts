/**
 * 创建操作日志
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { operationLog } from '@qiyu-allinai/db/entities/system';
import { operationLogZodSchemas } from './schemas';
import type { OperationLogSelect, OperationLogInsert } from './utils';

export const operationLogCreate = defineAction({
  meta: {
    name: 'system.operationLog.create',
    displayName: '创建操作日志',
    description: `创建单个操作日志记录（通常由系统自动调用）。

**必填字段：**
- title: 操作模块，如 "用户管理"、"角色管理"
- name: 操作人员姓名
- method: 请求方法，如 "POST"、"PUT"、"DELETE"
- url: 请求URL

**可选字段：**
- businessType: 业务类型（0=其它，1=新增，2=修改，3=删除）
- param: 请求参数（JSON字符串）
- result: 返回结果（JSON字符串）
- status: 操作状态，"0"=成功，"1"=失败
- errorMsg: 错误消息
- time: 操作时间
- costTime: 耗时（毫秒）

**使用场景：**
1. API请求拦截器自动记录
2. 关键业务操作手动记录
3. 安全审计日志

**示例：**
\`\`\`json
{
  "data": {
    "title": "用户管理",
    "name": "admin",
    "method": "POST",
    "url": "/api/system/user",
    "businessType": 1,
    "param": "{\\"name\\":\\"张三\\"}",
    "status": "0",
    "costTime": 150
  }
}
\`\`\``,
    tags: ['system', 'operationLog'],
    method: 'POST',
    path: '/api/system/operation-log',
  },
  schemas: {
    bodySchema: z.object({ data: operationLogZodSchemas.insert }),
    outputSchema: operationLogZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(operationLog).values(input.data as OperationLogInsert).returning();
    return result as OperationLogSelect;
  },
});
