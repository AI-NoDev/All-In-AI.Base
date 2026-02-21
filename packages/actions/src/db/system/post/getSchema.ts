/**
 * 获取岗位Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { postZodSchemas } from './schemas';

export const postGetSchema = defineAction({
  meta: {
    name: 'system.post.getSchema',
    ignoreTools: true,
    displayName: '获取岗位Schema',
    description: `获取岗位表的JSON Schema定义，用于动态表单生成或数据验证。

**返回内容：**
- 字段名称和类型
- 必填/可选标识
- 字段约束（长度、格式等）

**使用场景：**
1. 前端动态生成表单
2. 数据导入时的格式验证
3. API文档生成`,
    tags: ['system', 'post'],
    method: 'GET',
    path: '/api/system/post/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(postZodSchemas.select) as Record<string, unknown>;
  },
});
