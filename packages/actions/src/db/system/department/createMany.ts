/**
 * 批量创建部门
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { department, departmentZodSchemas } from '@qiyu-allinai/db/entities/system';
import { buildDeptMaterializedPath, type DepartmentSelect, type DepartmentInsert } from './utils';

export const departmentCreateMany = defineAction({
  meta: {
    name: 'system.department.createMany',
    ignoreTools: true,
    displayName: '批量创建部门',
    description: '批量创建多个部门',
    tags: ['system', 'department'],
    method: 'POST',
    path: '/api/system/department/batch',
  },
  schemas: {
    bodySchema: z.object({ data: z.array(departmentZodSchemas.insert) }),
    outputSchema: z.array(departmentZodSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 检查写入权限
    await checkWritePermission(db, context, BUSINESS_MODULE.DEPARTMENT);
    
    const results: DepartmentSelect[] = [];
    
    for (const data of input.data) {
      const [result] = await db.insert(department)
        .values(data as DepartmentInsert)
        .returning();
      
      // 构建并更新 materializedPath
      const materializedPath = await buildDeptMaterializedPath(db, data.parentId || null, result.id);
      await db.update(department)
        .set({ materializedPath })
        .where(eq(department.id, result.id));
      
      results.push({ ...result, materializedPath } as DepartmentSelect);
    }
    
    return results;
  },
});
