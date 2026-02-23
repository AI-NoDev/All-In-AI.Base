/**
 * 创建部门
 */

import { t } from 'elysia';
import { defineAction } from '../../../core/define';
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { department, departmentSchemas } from '@qiyu-allinai/db/entities/system';
import { buildDeptMaterializedPath, type DepartmentSelect, type DepartmentInsert } from './utils';

export const departmentCreate = defineAction({
  meta: {
    name: 'system.department.create',
    displayName: '创建部门',
    description: '创建单个部门',
    tags: ['system', 'department'],
    method: 'POST',
    path: '/api/system/department',
  },
  schemas: {
    bodySchema: t.Object({ data: departmentSchemas.insert }),
    outputSchema: departmentSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 检查写入权限
    await checkWritePermission(db, context, BUSINESS_MODULE.DEPARTMENT, input.data.parentId);
    
    // 先插入获取 ID
    const [result] = await db.insert(department)
      .values(input.data as DepartmentInsert)
      .returning();
    
    // 构建并更新 materializedPath
    const materializedPath = await buildDeptMaterializedPath(db, input.data.parentId || null, result.id);
    await db.update(department)
      .set({ materializedPath })
      .where({ id: result.id } as Parameters<typeof db.update>[0]);
    
    return { ...result, materializedPath } as DepartmentSelect;
  },
});
