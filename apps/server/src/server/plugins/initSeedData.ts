import { Elysia } from "elysia";
import db from "@qiyu-allinai/db/connect";
import {
  initSystemConfigSeeds,
  initPermissionSeeds,
  initRoleSeeds,
  initCasbinPolicySeeds,
  initMenuSeeds,
  initRoleMenuSeeds,
} from "@qiyu-allinai/db/seedData";

/**
 * 初始化所有种子数据
 */
async function initializeSeeds(): Promise<void> {
  try {
    console.log("🌱 Starting seed data initialization...");
    
    // 1. 初始化系统配置
    await initSystemConfigSeeds(db);
    
    // 2. 初始化权限
    await initPermissionSeeds(db);
    
    // 3. 初始化角色（返回角色 key -> id 映射）
    await initRoleSeeds(db);
    
    // 4. 初始化 Casbin 策略
    await initCasbinPolicySeeds(db);
    
    // 5. 初始化菜单
    await initMenuSeeds();
    
    // 6. 初始化角色-菜单关联
    await initRoleMenuSeeds(db);
    
    console.log("🌱 Seed data initialization completed");
  } catch (error) {
    console.error("❌ Seed data initialization failed:", error);
  }
}

/**
 * 种子数据初始化插件
 */
export const initSeedDataPlugin = new Elysia({ name: "plugin/init-seed-data" })
  .onStart(async () => {
    await initializeSeeds();
  });
