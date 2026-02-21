/**
 * 创建系统配置
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { config } from '@qiyu-allinai/db/entities/system';
import { configZodSchemas } from './schemas';
import type { ConfigSelect, ConfigInsert } from './utils';

export const configCreate = defineAction({
  meta: {
    name: 'system.config.create',
    displayName: '创建系统配置',
    description: `创建单个系统配置记录。

**必填字段：**
- name: 配置名称，如 "系统名称"、"邮件服务器"
- key: 配置键，唯一标识，如 "sys.name"、"mail.host"
- value: 配置值

**可选字段：**
- isSystem: 是否系统内置，默认 false
- remark: 备注说明

**配置键命名规范：**
- 使用点号分隔层级：module.submodule.key
- 系统配置：sys.*
- 邮件配置：mail.*
- 存储配置：storage.*

**使用场景：**
1. 添加新的系统参数
2. 配置第三方服务连接信息
3. 自定义业务参数

**示例：**
\`\`\`json
{
  "data": {
    "name": "邮件服务器地址",
    "key": "mail.host",
    "value": "smtp.example.com",
    "isSystem": false,
    "remark": "SMTP服务器地址"
  }
}
\`\`\``,
    tags: ['system', 'config'],
    method: 'POST',
    path: '/api/system/config',
  },
  schemas: {
    bodySchema: z.object({ data: configZodSchemas.insert }),
    outputSchema: configZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(config).values(input.data as ConfigInsert).returning();
    return result as ConfigSelect;
  },
});
