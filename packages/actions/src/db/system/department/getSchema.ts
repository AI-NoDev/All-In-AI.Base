/**
 * 获取部门 Schema
 */

import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { departmentZodSchemas } from '@qiyu-allinai/db/entities/system';

export const departmentGetSchema = defineAction({
  meta: {
    name: 'system.department.getSchema',
    ignoreTools: true,
    displayName: '获取部门Schema',
    description: '获取部门表的JSON Schema',
    tags: ['system', 'department'],
    method: 'GET',
    path: '/api/system/department/schema',
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(departmentZodSchemas.select) as Record<string, unknown>;
  },
});
