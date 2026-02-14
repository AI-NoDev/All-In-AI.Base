import { Elysia } from "elysia";
import { and, eq } from "drizzle-orm";
import db from "@qiyu-allinai/db/connect";
import { 
  user, casbinRule, 
  BUILTIN_ROLES, CASBIN_POLICY_TYPES 
} from "@qiyu-allinai/db/entities/system";
import { initAllDictSeeds } from "@qiyu-allinai/db/seedData";

// 从环境变量读取管理员配置
const ADMIN_CONFIG = {
  loginName: Bun.env.ADMIN_LOGIN_NAME || "admin",
  name: Bun.env.ADMIN_NAME || "系统管理员",
  password: Bun.env.ADMIN_PASSWORD || "admin123",
  email: Bun.env.ADMIN_EMAIL || "admin@example.com",
  phonenumber: Bun.env.ADMIN_PHONE || "13800138000",
};

// 密码哈希
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// 生成盐值
function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
}

// 为用户分配角色（通过 Casbin g 策略）
async function assignUserRole(userId: string, roleKey: string): Promise<void> {
  const userSub = `user:${userId}`;
  const roleSub = `role:${roleKey}`;
  
  // 检查是否已存在
  const [existing] = await db.select().from(casbinRule)
    .where(and(
      eq(casbinRule.ptype, CASBIN_POLICY_TYPES.ROLE_GROUPING),
      eq(casbinRule.v0, userSub),
      eq(casbinRule.v1, roleSub),
    ))
    .limit(1);
  
  if (existing) {
    return;
  }
  
  // 创建用户-角色关联
  await db.insert(casbinRule).values({
    ptype: CASBIN_POLICY_TYPES.ROLE_GROUPING,
    v0: userSub,
    v1: roleSub,
    v2: '',
    v3: '',
    v4: '',
    v5: '',
  });
}

// 初始化管理员用户
async function initAdminUser(): Promise<void> {
  // 检查是否已存在
  const [existingUser] = await db.select().from(user)
    .where(eq(user.loginName, ADMIN_CONFIG.loginName))
    .limit(1);
  
  if (existingUser) {
    // 用户已存在，更新密码
    const salt = generateSalt();
    const hashedPassword = await hashPassword(ADMIN_CONFIG.password, salt);
    
    await db.update(user).set({
      password: hashedPassword,
      salt: salt,
      updatedBy: "system",
    }).where(eq(user.id, existingUser.id));
    
    // 确保用户有超级管理员角色
    await assignUserRole(existingUser.id, BUILTIN_ROLES.SUPER_ADMIN);
    
    console.log(`✅ Admin user exists, password updated: ${existingUser.loginName}`);
    return;
  }
  
  // 生成密码
  const salt = generateSalt();
  const hashedPassword = await hashPassword(ADMIN_CONFIG.password, salt);
  
  // 创建管理员用户
  const [newUser] = await db.insert(user).values({
    loginName: ADMIN_CONFIG.loginName,
    name: ADMIN_CONFIG.name,
    password: hashedPassword,
    salt: salt,
    email: ADMIN_CONFIG.email,
    phonenumber: ADMIN_CONFIG.phonenumber,
    userType: "00", // 系统用户
    status: "0", // 正常
    createdBy: "system",
    updatedBy: "system",
  }).returning();
  
  if (newUser) {
    // 分配超级管理员角色
    await assignUserRole(newUser.id, BUILTIN_ROLES.SUPER_ADMIN);
    
    console.log(`✅ Admin user created: ${newUser.loginName} (${newUser.id})`);
    console.log(`   Email: ${ADMIN_CONFIG.email}`);
    console.log(`   Phone: ${ADMIN_CONFIG.phonenumber}`);
  }
}

// 初始化函数
async function initialize(): Promise<void> {
  try {
    console.log("🔧 Initializing admin user...");
    
    await initAdminUser();
    
    // 初始化字典种子数据
    await initAllDictSeeds(db);
    
    console.log("✅ Admin initialization completed");
  } catch (error) {
    console.error("❌ Admin initialization failed:", error);
  }
}

// Elysia 插件
export const initAdminPlugin = new Elysia({ name: "plugin/init-admin" })
  .onStart(async () => {
    await initialize();
  });
