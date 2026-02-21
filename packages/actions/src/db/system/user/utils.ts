/**
 * 用户模块工具函数
 */

import { eq, and, isNull } from 'drizzle-orm';
import type { DrizzleDB } from '../../../core/types';
import { user, config } from '@qiyu-allinai/db/entities/system';

/** 系统管理员用户类型 */
export const SYSTEM_ADMIN_USER_TYPE = '00';

/** 用户类型定义 */
export type UserSelect = typeof user.$inferSelect & {
  salt: undefined;
  password: undefined;
};
export type UserInsert = typeof user.$inferInsert;

/**
 * 密码哈希
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 生成盐值
 */
export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 检查是否是系统管理员
 */
export async function checkIsSystemAdmin(db: DrizzleDB, userId: string): Promise<boolean> {
  const [result] = await db.select({ userType: user.userType })
    .from(user)
    .where(and(eq(user.id, userId), isNull(user.deletedAt)))
    .limit(1);
  return result?.userType === SYSTEM_ADMIN_USER_TYPE;
}

/**
 * 获取初始密码配置
 */
export async function getInitPassword(db: DrizzleDB, pwd?: string | null): Promise<string> {
  if (pwd) return pwd;
  const [result] = await db.select({ value: config.value })
    .from(config)
    .where(eq(config.key, 'sys.user.initPassword'))
    .limit(1);
  return result?.value || '123456';
}

/**
 * 移除用户敏感字段
 */
export function sanitizeUser(u: typeof user.$inferSelect): UserSelect {
  return {
    ...u,
    salt: undefined,
    password: undefined,
  } as UserSelect;
}
