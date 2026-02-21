/**
 * 根据ID查询部门
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { department, departmentZodSchemas } from '@qiyu-allinai/db/entities/system';
import type { DepartmentSelect } from './utils';

export const departmentGetByPk = defineAction({
  meta: {
    name: 'system.department.getByPk',
    displayName: '根据ID查询部门',
    description: '根据主键ID查询单个部门',
    tags: ['system', 'department'],
    method: 'GET',
    path: '/api/system/department/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: departmentZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(department)
      .where(and(eq(department.id, input.id), isNull(department.deletedAt)))
      .limit(1);
    return (result as DepartmentSelect) ?? null;
  },
});
