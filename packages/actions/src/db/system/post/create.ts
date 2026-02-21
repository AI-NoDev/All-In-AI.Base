/**
 * 创建岗位
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { post } from '@qiyu-allinai/db/entities/system';
import { postZodSchemas } from './schemas';
import type { PostSelect, PostInsert } from './utils';

export const postCreate = defineAction({
  meta: {
    name: 'system.post.create',
    displayName: '创建岗位',
    description: `创建单个岗位记录。

**必填字段：**
- code: 岗位编码，唯一标识，如 "CEO"、"CTO"、"PM"
- name: 岗位名称，如 "首席执行官"、"技术总监"

**可选字段：**
- sort: 排序号，数字越小越靠前，默认0
- status: 状态，"0"=正常（默认），"1"=禁用
- remark: 备注说明

**审计字段（自动填充）：**
- createdBy/updatedBy: 创建人/更新人姓名
- createdAt/updatedAt: 创建/更新时间

**使用场景：**
1. 新增组织架构中的岗位
2. 初始化系统岗位数据

**示例：**
\`\`\`json
{
  "data": {
    "code": "PM",
    "name": "项目经理",
    "sort": 10,
    "status": "0",
    "remark": "负责项目管理"
  }
}
\`\`\``,
    tags: ['system', 'post'],
    method: 'POST',
    path: '/api/system/post',
  },
  schemas: {
    bodySchema: z.object({ data: postZodSchemas.insert }),
    outputSchema: postZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.insert(post).values(input.data as PostInsert).returning();
    return result as PostSelect;
  },
});
