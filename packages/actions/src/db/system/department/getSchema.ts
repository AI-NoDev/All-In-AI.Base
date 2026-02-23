/**
 * 获取部门 Schema
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { departmentSchemas } from '@qiyu-allinai/db/entities/system';

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
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async () => {
    return toJSONSchema(departmentSchemas.select) as Record<string, unknown>;
  },
});
