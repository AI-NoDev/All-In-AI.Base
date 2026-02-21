/**
 * 部门级数据权限校验工具
 * 
 * 为业务模块提供统一的部门级数据权限校验功能
 */

import { eq, and, isNull, inArray } from 'drizzle-orm';
import type { DrizzleDB, ActionContext } from './types';
import { ActionError } from './errors';
import { 
  DepartmentPermissionAdapter, 
  DATA_SCOPE, 
  PERMISSION_SCOPE,
  BUSINESS_MODULE,
  type BusinessModule,
  type DeptInfo,
  type DeptDataPermissionResult,
} from '@qiyu-allinai/db/casbin';
import { department } from '@qiyu-allinai/db/entities/system';

/** 系统管理员用户类型 */
export const SYSTEM_ADMIN_USER_TYPE = '00';

/** 权限校验结果 */
export interface PermissionCheckResult {
  /** 是否有权限 */
  hasPermission: boolean;
  /** 数据范围 */
  dataScope: string;
  /** 可访问的部门ID列表 */
  accessibleDeptIds: string[];
  /** 是否拥有所有权限（系统管理员） */
  hasAllAccess: boolean;
}

/** 数据权限过滤条件 */
export interface DataPermissionFilter {
  /** 数据范围 */
  dataScope: string;
  /** 可访问的部门ID列表 */
  deptIds: string[];
  /** 是否拥有所有权限 */
  hasAllAccess: boolean;
  /** 当前用户ID（用于 SELF 范围） */
  currentUserId: string;
}

/**
 * 检查当前用户是否是系统管理员
 */
export function isSystemAdmin(userType: string | null | undefined): boolean {
  return userType === SYSTEM_ADMIN_USER_TYPE;
}

/**
 * 获取所有部门信息（用于部门权限计算）
 */
export async function getAllDepts(db: DrizzleDB): Promise<DeptInfo[]> {
  const depts = await db.select({
    id: department.id,
    parentId: department.parentId,
    materializedPath: department.materializedPath,
  }).from(department).where(isNull(department.deletedAt));
  return depts;
}

/**
 * 解析用户对指定模块的数据权限
 */
export async function resolveDataPermission(
  db: DrizzleDB,
  context: ActionContext,
  module: BusinessModule
): Promise<DataPermissionFilter> {
  const { currentUserId, currentUserDeptId, currentUserType } = context;
  const isSysAdmin = isSystemAdmin(currentUserType);
  const allDepts = await getAllDepts(db);
  
  const adapter = new DepartmentPermissionAdapter(db);
  const result = await adapter.resolvePermission(
    currentUserId,
    currentUserDeptId || null,
    module,
    allDepts,
    isSysAdmin
  );
  
  return {
    dataScope: result.dataScope,
    deptIds: result.accessibleDeptIds,
    hasAllAccess: result.hasAllAccess,
    currentUserId,
  };
}

/**
 * 检查用户是否有读取权限
 */
export async function checkReadPermission(
  db: DrizzleDB,
  context: ActionContext,
  module: BusinessModule
): Promise<DataPermissionFilter> {
  return resolveDataPermission(db, context, module);
}

/**
 * 检查用户是否有写入权限（创建/更新）
 */
export async function checkWritePermission(
  db: DrizzleDB,
  context: ActionContext,
  module: BusinessModule,
  targetDeptId?: string | null
): Promise<void> {
  const isSysAdmin = isSystemAdmin(context.currentUserType);
  if (isSysAdmin) return;
  
  const adapter = new DepartmentPermissionAdapter(db);
  const canWrite = await adapter.canWrite(context.currentUserId, module, isSysAdmin);
  
  if (!canWrite) {
    throw ActionError.forbidden('error.permission.noWriteAccess');
  }
  
  // 如果指定了目标部门，检查是否有该部门的访问权限
  if (targetDeptId) {
    const allDepts = await getAllDepts(db);
    const canAccess = await adapter.canAccessDept(
      context.currentUserId,
      context.currentUserDeptId || null,
      targetDeptId,
      module,
      allDepts,
      isSysAdmin
    );
    
    if (!canAccess) {
      throw ActionError.forbidden('error.permission.noDeptAccess');
    }
  }
}

/**
 * 检查用户是否有管理权限（删除/管理）
 */
export async function checkManagePermission(
  db: DrizzleDB,
  context: ActionContext,
  module: BusinessModule,
  targetDeptId?: string | null
): Promise<void> {
  const isSysAdmin = isSystemAdmin(context.currentUserType);
  if (isSysAdmin) return;
  
  const adapter = new DepartmentPermissionAdapter(db);
  const canManage = await adapter.canManage(context.currentUserId, module, isSysAdmin);
  
  if (!canManage) {
    throw ActionError.forbidden('error.permission.noManageAccess');
  }
  
  // 如果指定了目标部门，检查是否有该部门的访问权限
  if (targetDeptId) {
    const allDepts = await getAllDepts(db);
    const canAccess = await adapter.canAccessDept(
      context.currentUserId,
      context.currentUserDeptId || null,
      targetDeptId,
      module,
      allDepts,
      isSysAdmin
    );
    
    if (!canAccess) {
      throw ActionError.forbidden('error.permission.noDeptAccess');
    }
  }
}

/**
 * 构建部门权限过滤的 SQL 条件
 * 返回需要添加到 WHERE 子句的条件
 */
export function buildDeptPermissionConditions<T extends { deptId: unknown; id?: unknown; createdById?: unknown }>(
  table: T,
  filter: DataPermissionFilter
): ReturnType<typeof eq>[] {
  const conditions: ReturnType<typeof eq>[] = [];
  
  if (filter.hasAllAccess) {
    // 系统管理员，不添加额外条件
    return conditions;
  }
  
  if (filter.dataScope === DATA_SCOPE.SELF) {
    // 仅自己的数据
    if ('createdById' in table && table.createdById !== undefined) {
      conditions.push(eq(table.createdById as Parameters<typeof eq>[0], filter.currentUserId));
    } else if ('id' in table && table.id !== undefined) {
      // 对于用户表，使用 id 字段
      conditions.push(eq(table.id as Parameters<typeof eq>[0], filter.currentUserId));
    }
  } else if (filter.deptIds.length > 0) {
    // 按部门过滤
    conditions.push(inArray(table.deptId as Parameters<typeof inArray>[0], filter.deptIds));
  } else {
    // 没有任何部门权限，只能看自己创建的
    if ('createdById' in table && table.createdById !== undefined) {
      conditions.push(eq(table.createdById as Parameters<typeof eq>[0], filter.currentUserId));
    }
  }
  
  return conditions;
}

// 重新导出常量和类型
export { DATA_SCOPE, PERMISSION_SCOPE, BUSINESS_MODULE };
export type { BusinessModule, DeptInfo, DeptDataPermissionResult };
