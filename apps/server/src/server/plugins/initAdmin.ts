import { Elysia } from "elysia";
import { eq } from "drizzle-orm";
import db from "@qiyu-allinai/db/connect";
import { user, role } from "@qiyu-allinai/db/entities/system";

// 从环境变量读取管理员配置
const ADMIN_CONFIG = {
  loginName: Bun.env.ADMIN_LOGIN_NAME || "admin",
  name: Bun.env.ADMIN_NAME || "系统管理员",
  password: Bun.env.ADMIN_PASSWORD || "admin123",
  email: Bun.env.ADMIN_EMAIL || "admin@example.com",
  phonenumber: Bun.env.ADMIN_PHONE || "13800138000",
};

const ADMIN_ROLE_CONFIG = {
  name: "系统管理员",
  key: "admin",
  sort: "1",
  dataScope: "1", // 全部数据权限
  status: "0", // 正常
  permissions: ["*:*:*"], // 所有权限
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

// 初始化管理员角色
async function initAdminRole(): Promise<string> {
  // 检查是否已存在
  const [existingRole] = await db.select().from(role)
    .where(eq(role.key, ADMIN_ROLE_CONFIG.key))
    .limit(1);
  
  if (existingRole) {
    console.log(`✅ Admin role already exists: ${existingRole.name} (${existingRole.id})`);
    return existingRole.id;
  }
  
  // 创建管理员角色
  const [newRole] = await db.insert(role).values({
    name: ADMIN_ROLE_CONFIG.name,
    key: ADMIN_ROLE_CONFIG.key,
    sort: ADMIN_ROLE_CONFIG.sort,
    dataScope: ADMIN_ROLE_CONFIG.dataScope,
    status: ADMIN_ROLE_CONFIG.status,
    permissions: ADMIN_ROLE_CONFIG.permissions,
    flag: true, // 标记为系统内置角色
    createdBy: "system",
    updatedBy: "system",
  }).returning();
  
  console.log(`✅ Admin role created: ${newRole.name} (${newRole.id})`);
  return newRole.id;
}

// 初始化管理员用户
async function initAdminUser(roleId: string): Promise<void> {
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
    roleId: roleId,
    roleIds: [roleId],
    permissions: ADMIN_ROLE_CONFIG.permissions,
    createdBy: "system",
    updatedBy: "system",
  }).returning();
  
  console.log(`✅ Admin user created: ${newUser.loginName} (${newUser.id})`);
  console.log(`   Email: ${ADMIN_CONFIG.email}`);
  console.log(`   Phone: ${ADMIN_CONFIG.phonenumber}`);
}

// 初始化函数
async function initialize(): Promise<void> {
  try {
    console.log("🔧 Initializing admin role and user...");
    
    const roleId = await initAdminRole();
    await initAdminUser(roleId);
    
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
