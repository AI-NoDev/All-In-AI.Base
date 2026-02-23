/**
 * 批量更新部门
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { department, departmentSchemas } from '@qiyu-allinai/db/entities/system';
import type { DepartmentSelect, DepartmentInsert } from './utils';

export const departmentUpdateMany = defineAction({
  meta: {
    name: 'system.department.updateMany',
    ignoreTools: true,
    displayName: '批量更新部门',
    description: '根据ID列表批量更新部门',
    tags: ['system', 'department'],
    method: 'PUT',
    path: '/api/system/department/batch',
  },
  schemas: {
    bodySchema: t.Object({ ids: t.Array(t.String()), data: departmentSchemas.update }),
    outputSchema: t.Array(departmentSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 检查写入权限
    await checkWritePermission(db, context, BUSINESS_MODULE.DEPARTMENT);
    
    const results: DepartmentSelect[] = [];
    for (const id of input.ids) {
      const [result] = await db.update(department)
        .set(input.data as Partial<DepartmentInsert>)
        .where(and(eq(department.id, id), isNull(department.deletedAt)))
        .returning();
      if (result) results.push(result as DepartmentSelect);
    }
    return results;
  },
});
