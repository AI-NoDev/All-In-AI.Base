/**
 * 更新部门
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { department, departmentSchemas } from '@qiyu-allinai/db/entities/system';
import { buildDeptMaterializedPath, updateChildrenMaterializedPath, type DepartmentSelect, type DepartmentInsert } from './utils';

export const departmentUpdate = defineAction({
  meta: {
    name: 'system.department.update',
    displayName: '更新部门',
    description: '根据ID更新单个部门',
    tags: ['system', 'department'],
    method: 'PUT',
    path: '/api/system/department/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    bodySchema: t.Object({ data: departmentSchemas.update }),
    outputSchema: departmentSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 获取当前部门信息
    const [current] = await db.select()
      .from(department)
      .where(and(eq(department.id, input.id), isNull(department.deletedAt)))
      .limit(1);
    
    if (!current) {
      throw ActionError.notFound('error.business.dataNotFound');
    }
    
    // 检查写入权限
    await checkWritePermission(db, context, BUSINESS_MODULE.DEPARTMENT, current.id);
    
    // 检查是否修改了父部门
    const parentChanged = input.data.parentId !== undefined && input.data.parentId !== current.parentId;
    
    const [result] = await db.update(department)
      .set(input.data as Partial<DepartmentInsert>)
      .where(and(eq(department.id, input.id), isNull(department.deletedAt)))
      .returning();
    
    if (!result) {
      throw ActionError.notFound('error.business.dataNotFound');
    }
    
    // 如果父部门变更，更新 materializedPath
    if (parentChanged) {
      const oldPath = current.materializedPath;
      const newPath = await buildDeptMaterializedPath(db, input.data.parentId || null, result.id);
      
      await db.update(department)
        .set({ materializedPath: newPath })
        .where(eq(department.id, result.id));
      
      // 更新所有子部门的 materializedPath
      await updateChildrenMaterializedPath(db, result.id, oldPath, newPath);
      
      return { ...result, materializedPath: newPath } as DepartmentSelect;
    }
    
    return result as DepartmentSelect;
  },
});
