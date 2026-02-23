/**
 * 删除部门
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { checkManagePermission, BUSINESS_MODULE } from '../../../core/deptPermission';
import { department } from '@qiyu-allinai/db/entities/system';

export const departmentDeleteByPk = defineAction({
  meta: {
    name: 'system.department.deleteByPk',
    displayName: '删除部门',
    description: '根据ID软删除部门',
    tags: ['system', 'department'],
    method: 'DELETE',
    path: '/api/system/department/:id',
  },
  schemas: {
    paramsSchema: t.Object({ id: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 检查是否有子部门
    const [hasChildren] = await db.select({ id: department.id })
      .from(department)
      .where(and(eq(department.parentId, input.id), isNull(department.deletedAt)))
      .limit(1);
    
    if (hasChildren) {
      throw ActionError.badRequest('error.department.hasChildren');
    }
    
    // 检查管理权限
    await checkManagePermission(db, context, BUSINESS_MODULE.DEPARTMENT, input.id);
    
    const [result] = await db.update(department).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName,
    }).where(and(eq(department.id, input.id), isNull(department.deletedAt))).returning();
    
    return !!result;
  },
});
