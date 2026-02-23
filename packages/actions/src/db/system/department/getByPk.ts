/**
 * 根据ID查询部门
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { department, departmentSchemas } from '@qiyu-allinai/db/entities/system';
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
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Union([departmentSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(department)
      .where(and(eq(department.id, input.id), isNull(department.deletedAt)))
      .limit(1);
    return (result as DepartmentSelect) ?? null;
  },
});
