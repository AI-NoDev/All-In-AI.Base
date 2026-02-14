/**
 * 重置种子数据脚本
 * 删除所有种子数据表的数据，然后重新初始化
 * 运行: bun run resetSeedData
 */

import { sql } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import db from '../src/connect';
import {
  initSystemConfigSeeds,
  initPermissionSeeds,
  initRoleSeeds,
  initCasbinPolicySeeds,
  initMenuSeeds,
  initRoleMenuSeeds,
} from '../src/seedData';

// 需要清空的表（按依赖顺序，先删除有外键依赖的表）
const TABLES_TO_CLEAR = [
  'system_role_menu',      // 角色-菜单关联（依赖 role, menu）
  'system_user_role',      // 用户-角色关联（依赖 user, role）
  'system_user_post',      // 用户-岗位关联（依赖 user, post）
  'system_role_department', // 角色-部门关联（依赖 role, department）
  'casbin_rule',           // Casbin 策略
  'system_permission',     // 权限
  'system_menu',           // 菜单
  'system_role',           // 角色
  'system_config',         // 系统配置
];

/**
 * 清空指定表的数据
 */
async function clearTable(tableName: string): Promise<void> {
  try {
    // 使用 TRUNCATE 快速清空表，CASCADE 处理外键约束
    await db.execute(sql.raw(`TRUNCATE TABLE "${tableName}" CASCADE`));
    console.log(`  ✅ 已清空: ${tableName}`);
  } catch (error) {
    // 检查错误信息
    const errorStr = String(error);
    // 如果表不存在，忽略错误
    if (errorStr.includes('does not exist') || errorStr.includes('42P01')) {
      console.log(`  ⏭️  跳过: ${tableName} (表不存在)`);
    } else {
      console.error(`  ❌ 清空失败: ${tableName}`, errorStr);
      throw error;
    }
  }
}

/**
 * 清空所有种子数据表
 */
async function clearAllSeedTables(): Promise<void> {
  console.log('\n🗑️  开始清空种子数据表...\n');
  
  for (const tableName of TABLES_TO_CLEAR) {
    await clearTable(tableName);
  }
  
  console.log('\n✅ 所有种子数据表已清空\n');
}

/**
 * 重新初始化所有种子数据
 */
async function reinitializeSeedData(): Promise<void> {
  console.log('🌱 开始重新初始化种子数据...\n');
  
  // 按依赖顺序初始化（先初始化被依赖的表）
  
  // 1. 系统配置（无依赖）
  await initSystemConfigSeeds(db as unknown as PostgresJsDatabase);
  
  // 2. 权限（无依赖）
  await initPermissionSeeds(db as unknown as PostgresJsDatabase);
  
  // 3. 角色（无依赖）
  await initRoleSeeds(db as unknown as PostgresJsDatabase);
  
  // 4. Casbin 策略（依赖角色 key，但不依赖角色 ID）
  await initCasbinPolicySeeds(db as unknown as PostgresJsDatabase);
  
  // 5. 菜单（无依赖）
  await initMenuSeeds();
  
  // 6. 角色-菜单关联（依赖角色和菜单）
  await initRoleMenuSeeds(db as unknown as PostgresJsDatabase);
  
  console.log('\n✅ 所有种子数据已重新初始化\n');
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  console.log('🚀 开始重置种子数据...');
  console.log('⚠️  警告: 此操作将删除所有种子数据并重新创建！\n');
  
  try {
    // 1. 清空所有种子数据表
    await clearAllSeedTables();
    
    // 2. 重新初始化种子数据
    await reinitializeSeedData();
    
    console.log('✨ 种子数据重置完成！');
  } catch (error) {
    console.error('\n❌ 种子数据重置失败:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

main();
