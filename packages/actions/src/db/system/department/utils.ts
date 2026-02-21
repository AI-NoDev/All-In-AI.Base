/**
 * 部门模块工具函数
 */

import { eq, and, isNull } from 'drizzle-orm';
import type { DrizzleDB } from '../../../core/types';
import { department } from '@qiyu-allinai/db/entities/system';
import { buildMaterializedPath } from '@qiyu-allinai/db/casbin';

/** 部门类型定义 */
export type DepartmentSelect = typeof department.$inferSelect;
export type DepartmentInsert = typeof department.$inferInsert;

/**
 * 获取父部门的 materializedPath
 */
export async function getParentMaterializedPath(
  db: DrizzleDB,
  parentId: string | null
): Promise<string | null> {
  if (!parentId) return null;
  
  const [parent] = await db.select({ materializedPath: department.materializedPath })
    .from(department)
    .where(and(eq(department.id, parentId), isNull(department.deletedAt)))
    .limit(1);
  
  return parent?.materializedPath || null;
}

/**
 * 构建部门的 materializedPath
 */
export async function buildDeptMaterializedPath(
  db: DrizzleDB,
  parentId: string | null,
  deptId: string
): Promise<string> {
  const parentPath = await getParentMaterializedPath(db, parentId);
  return buildMaterializedPath(parentPath, deptId);
}

/**
 * 更新子部门的 materializedPath
 */
export async function updateChildrenMaterializedPath(
  db: DrizzleDB,
  deptId: string,
  oldPath: string,
  newPath: string
): Promise<void> {
  // 获取所有子部门
  const children = await db.select()
    .from(department)
    .where(and(
      eq(department.parentId, deptId),
      isNull(department.deletedAt)
    ));
  
  for (const child of children) {
    const childNewPath = child.materializedPath.replace(oldPath, newPath);
    await db.update(department)
      .set({ materializedPath: childNewPath })
      .where(eq(department.id, child.id));
    
    // 递归更新子部门的子部门
    await updateChildrenMaterializedPath(db, child.id, child.materializedPath, childNewPath);
  }
}
