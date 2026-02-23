/**
 * 角色模块工具函数
 */

import { eq } from 'drizzle-orm';
import type { DrizzleDB } from '../../../core/types';
import { role } from '@qiyu-allinai/db/entities/system';

/** 管理员角色标识 */
export const ADMIN_ROLE_KEY = 'admin';

/**
 * 检查是否为管理员角色
 */
export async function checkIsAdminRole(db: DrizzleDB, id: string): Promise<boolean> {
  const [result] = await db.select({ key: role.key }).from(role).where(eq(role.id, id)).limit(1);
  return result?.key === ADMIN_ROLE_KEY;
}
