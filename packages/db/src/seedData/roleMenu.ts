/**
 * 角色-菜单关联种子数据
 * 定义各角色的默认菜单权限
 */

import { eq, and } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { roleMenu } from '../entities/system/roleMenu';
import { role, BUILTIN_ROLES } from '../entities/system/role';
import { MENU_IDS } from './menu';

/**
 * 所有菜单 ID 列表
 */
const ALL_MENU_IDS = Object.values(MENU_IDS);

/**
 * 各角色的菜单配置
 */
interface RoleMenuConfig {
  roleKey: string;
  menuIds: string[];
}

/**
 * 超级管理员 - 所有菜单
 */
const superAdminMenus: string[] = ALL_MENU_IDS;

/**
 * 管理员 - 除权限管理和开发模式外的所有菜单
 */
const adminMenus: string[] = [
  // 平台
  MENU_IDS.PLATFORM,
  MENU_IDS.DASHBOARD,
  // 知识库
  MENU_IDS.KNOWLEDGE,
  MENU_IDS.MY_FILES,
  MENU_IDS.SHARED_WITH_ME,
  MENU_IDS.MY_SHARED,
  MENU_IDS.FAVORITES,
  // 沟通
  MENU_IDS.COMMUNICATION,
  MENU_IDS.CONTACTS,
  // 智能体
  MENU_IDS.AI,
  MENU_IDS.AI_MODELS,
  MENU_IDS.AI_AGENTS,
  // 系统管理（部分）
  MENU_IDS.SYSTEM,
  MENU_IDS.USERS,
  MENU_IDS.ROLES,
  MENU_IDS.MENUS,
  MENU_IDS.DEPARTMENTS,
  MENU_IDS.POSTS,
  MENU_IDS.DICTS,
  MENU_IDS.OPERATION_LOGS,
  MENU_IDS.LOGIN_LOGS,
  // 系统设置
  MENU_IDS.SETTINGS,
  MENU_IDS.PREFERENCES,
  MENU_IDS.SYSTEM_CONFIG,
];

/**
 * 普通用户 - 基本功能菜单
 */
const userMenus: string[] = [
  // 平台
  MENU_IDS.PLATFORM,
  MENU_IDS.DASHBOARD,
  // 知识库
  MENU_IDS.KNOWLEDGE,
  MENU_IDS.MY_FILES,
  MENU_IDS.SHARED_WITH_ME,
  MENU_IDS.MY_SHARED,
  MENU_IDS.FAVORITES,
  // 沟通
  MENU_IDS.COMMUNICATION,
  MENU_IDS.CONTACTS,
  // 智能体（只读）
  MENU_IDS.AI,
  MENU_IDS.AI_AGENTS,
  // 系统设置（仅个性化）
  MENU_IDS.SETTINGS,
  MENU_IDS.PREFERENCES,
];

/**
 * 访客 - 最小菜单
 */
const guestMenus: string[] = [
  // 平台
  MENU_IDS.PLATFORM,
  MENU_IDS.DASHBOARD,
];

/**
 * 角色菜单配置
 */
export const roleMenuConfigs: RoleMenuConfig[] = [
  { roleKey: BUILTIN_ROLES.SUPER_ADMIN, menuIds: superAdminMenus },
  { roleKey: BUILTIN_ROLES.ADMIN, menuIds: adminMenus },
  { roleKey: BUILTIN_ROLES.USER, menuIds: userMenus },
  { roleKey: BUILTIN_ROLES.GUEST, menuIds: guestMenus },
];

/**
 * 初始化角色-菜单关联种子数据
 */
export async function initRoleMenuSeeds(db: PostgresJsDatabase): Promise<void> {
  console.log('🔧 Initializing role-menu seeds...');
  
  let created = 0;
  let skipped = 0;

  for (const config of roleMenuConfigs) {
    // 获取角色 ID
    const [roleRecord] = await db.select().from(role)
      .where(eq(role.key, config.roleKey))
      .limit(1);

    if (!roleRecord) {
      console.warn(`Role not found: ${config.roleKey}`);
      continue;
    }

    const roleId = roleRecord.id;

    for (const menuId of config.menuIds) {
      // 检查是否已存在
      const [existing] = await db.select().from(roleMenu)
        .where(and(
          eq(roleMenu.roleId, roleId),
          eq(roleMenu.menuId, menuId)
        ))
        .limit(1);

      if (existing) {
        skipped++;
        continue;
      }

      // 创建关联
      await db.insert(roleMenu).values({
        roleId,
        menuId,
      });

      created++;
    }
  }

  console.log(`✅ Role-menu seeds: ${created} created, ${skipped} skipped`);
}
