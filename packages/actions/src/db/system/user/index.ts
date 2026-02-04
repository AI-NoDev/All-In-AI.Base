import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { user, userZodSchemas, config } from '@qiyu-allinai/db/entities/system';

type UserSelect = typeof user.$inferSelect & {
  salt: undefined
  password: undefined
};
type UserInsert = typeof user.$inferInsert;

// 空字符串转 undefined
const emptyToUndefined = (val: unknown) => (val === '' || val === null ? undefined : val);
const emptyArrayToUndefined = (val: unknown) => {
  if (!Array.isArray(val)) return val;
  if (val.length === 0 || (val.length === 1 && val[0] === '')) return undefined;
  return val;
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

// ============ Filter Schema ============
const userFilterSchema = z.object({
  // IN 查询
  ids: z.preprocess(emptyArrayToUndefined, z.array(z.uuid()).optional()),
  loginNames: z.preprocess(emptyArrayToUndefined, z.array(z.string()).optional()),
  // 精确匹配
  deptId: z.preprocess(emptyToUndefined, z.uuid().optional()),
  parentId: z.preprocess(emptyToUndefined, z.uuid().optional()),
  roleId: z.preprocess(emptyToUndefined, z.uuid().optional()),
  userType: z.preprocess(emptyToUndefined, z.string().optional()),
  sex: z.preprocess(emptyToUndefined, z.string().optional()),
  status: z.preprocess(emptyToUndefined, z.string().optional()),
  // 模糊匹配
  loginName: z.preprocess(emptyToUndefined, z.string().optional()),
  name: z.preprocess(emptyToUndefined, z.string().optional()),
  email: z.preprocess(emptyToUndefined, z.string().optional()),
  phonenumber: z.preprocess(emptyToUndefined, z.string().optional()),
  // 时间范围
  createdAtStart: z.preprocess(emptyToUndefined, z.iso.datetime().optional()),
  createdAtEnd: z.preprocess(emptyToUndefined, z.iso.datetime().optional()),
  loginDateStart: z.preprocess(emptyToUndefined, z.iso.datetime().optional()),
  loginDateEnd: z.preprocess(emptyToUndefined, z.iso.datetime().optional()),
}).optional();

const sortSchema = z.object({
  field: z.enum(['loginName', 'name', 'createdAt', 'updatedAt', 'loginDate']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: userFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const userGetByPagination = defineAction({
  meta: { name: 'system.user.getByPagination', displayName: '分页查询用户', description: '分页查询用户列表', tags: ['system', 'user'], method: 'POST', path: '/api/system/user/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(userZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    
    // Build conditions
    const conditions = [isNull(user.deletedAt)];
    
    if (filter) {
      // IN 查询
      if (filter.ids?.length) conditions.push(inArray(user.id, filter.ids));
      if (filter.loginNames?.length) conditions.push(inArray(user.loginName, filter.loginNames));
      // 精确匹配
      if (filter.deptId) conditions.push(eq(user.deptId, filter.deptId));
      if (filter.parentId) conditions.push(eq(user.parentId, filter.parentId));
      if (filter.roleId) conditions.push(eq(user.roleId, filter.roleId));
      if (filter.userType) conditions.push(eq(user.userType, filter.userType));
      if (filter.sex) conditions.push(eq(user.sex, filter.sex));
      if (filter.status) conditions.push(eq(user.status, filter.status));
      // 模糊匹配
      if (filter.loginName) conditions.push(ilike(user.loginName, `%${filter.loginName}%`));
      if (filter.name) conditions.push(ilike(user.name, `%${filter.name}%`));
      if (filter.email) conditions.push(ilike(user.email, `%${filter.email}%`));
      if (filter.phonenumber) conditions.push(ilike(user.phonenumber, `%${filter.phonenumber}%`));
      // 时间范围
      if (filter.createdAtStart) conditions.push(gte(user.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(user.createdAt, filter.createdAtEnd));
      if (filter.loginDateStart) conditions.push(gte(user.loginDate, new Date(filter.loginDateStart)));
      if (filter.loginDateEnd) conditions.push(lte(user.loginDate, new Date(filter.loginDateEnd)));
    }
    
    const whereClause = and(...conditions);
    
    // Build sort
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? user[sort.field as keyof typeof user.$inferSelect] : user.createdAt;
    
    const data = await db.select().from(user)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as any))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(user).where(whereClause);
    return { data: data.map(u=>({
      ...u,
      salt: undefined,
      password: undefined
    })) as UserSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const userGetByPk = defineAction({
  meta: { name: 'system.user.getByPk', displayName: '根据ID查询用户', description: '根据主键ID查询单个用户', tags: ['system', 'user'], method: 'GET', path: '/api/system/user/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: userZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(user).where(and(eq(user.id, input.id), isNull(user.deletedAt))).limit(1);
    return result ? ({
      ...result,
      salt: undefined,
      password: undefined
    } as UserSelect) : null;
  },
});

export const userCreate = defineAction({
  meta: { name: 'system.user.create', displayName: '创建用户', description: '创建单个用户', tags: ['system', 'user'], method: 'POST', path: '/api/system/user' },
  schemas: {
    bodySchema: z.object({ 
      data: userZodSchemas.insert,
    }),
    outputSchema: userZodSchemas.select,
  },
  execute: async (input, _context) => {
    const { data } = input;
    
    // 生成盐值和哈希密码
    const salt = generateSalt();
    const hashedPassword = await hashPassword(await getInitPassword(data.password), salt);
    
    const [result] = await db.insert(user).values({
      ...data,
      salt,
      password: hashedPassword,
    } as UserInsert).returning();
    
    return {
      ...result,
      salt: undefined,
      password: undefined,
    } as UserSelect;
  },
});

export const userCreateMany = defineAction({
  meta: { name: 'system.user.createMany', displayName: '批量创建用户', description: '批量创建多个用户', tags: ['system', 'user'], method: 'POST', path: '/api/system/user/batch' },
  schemas: {
    bodySchema: z.object({ 
      data: z.array(z.object({
        user: userZodSchemas.insert,
        password: z.string().min(6).max(50),
      })),
    }),
    outputSchema: z.array(userZodSchemas.select),
  },
  execute: async (input, _context) => {
    const usersToInsert: UserInsert[] = [];
    
    for (const item of input.data) {
      const salt = generateSalt();
      const hashedPassword = await hashPassword(item.password, salt);
      usersToInsert.push({
        ...item.user,
        salt,
        password: hashedPassword,
      } as UserInsert);
    }
    
    const results = await db.insert(user).values(usersToInsert).returning();
    return results.map(u => ({
      ...u,
      salt: undefined,
      password: undefined,
    })) as UserSelect[];
  },
});

// 系统管理员用户类型
const SYSTEM_ADMIN_USER_TYPE = '00';

// 检查是否是系统管理员
async function checkIsSystemAdmin(userId: string): Promise<boolean> {
  const [result] = await db.select({ userType: user.userType })
    .from(user)
    .where(and(eq(user.id, userId), isNull(user.deletedAt)))
    .limit(1);
  return result?.userType === SYSTEM_ADMIN_USER_TYPE;
}

export const userUpdate = defineAction({
  meta: { name: 'system.user.update', displayName: '更新用户', description: '根据ID更新单个用户', tags: ['system', 'user'], method: 'PUT', path: '/api/system/user/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    bodySchema: z.object({ data: userZodSchemas.update }),
    outputSchema: userZodSchemas.select,
  },
  execute: async (input, _context) => {
    // 检查是否是系统管理员
    if (await checkIsSystemAdmin(input.id)) {
      throw new Error('error.system.admin.cannot.modify');
    }
    
    const [result] = await db.update(user).set(input.data as Partial<UserInsert>).where(and(eq(user.id, input.id), isNull(user.deletedAt))).returning();
    return {
      ...result,
      salt: undefined,
      password: undefined
    } as UserSelect;
  },
});

export const userUpdateMany = defineAction({
  meta: { name: 'system.user.updateMany', displayName: '批量更新用户', description: '根据ID列表批量更新用户', tags: ['system', 'user'], method: 'PUT', path: '/api/system/user/batch' },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.uuid()), data: userZodSchemas.update }),
    outputSchema: z.array(userZodSchemas.select),
  },
  execute: async (input, _context) => {
    // 检查是否包含系统管理员
    for (const id of input.ids) {
      if (await checkIsSystemAdmin(id)) {
        throw new Error('error.system.admin.cannot.modify');
      }
    }
    
    const results: Array<typeof user.$inferSelect> = [];
    for (const id of input.ids) {
      const [result] = await db.update(user).set(input.data as Partial<UserInsert>).where(and(eq(user.id, id), isNull(user.deletedAt))).returning();
      if (result) results.push(result);
    }
    return results.map((u) => ({
      ...u,
      salt: undefined,
      password: undefined,
    })) as UserSelect[];
  },
});

export const userDeleteByPk = defineAction({
  meta: { name: 'system.user.deleteByPk', displayName: '删除用户', description: '根据ID软删除用户', tags: ['system', 'user'], method: 'DELETE', path: '/api/system/user/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    // 检查是否是系统管理员
    if (await checkIsSystemAdmin(input.id)) {
      throw new Error('error.system.admin.cannot.delete');
    }
    
    const [result] = await db.update(user).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName
    }).where(and(eq(user.id, input.id), isNull(user.deletedAt))).returning();
    return !!result;
  },
});

export const userGetSchema = defineAction({
  meta: { name: 'system.user.getSchema', ignoreTools: true, displayName: '获取用户Schema', description: '获取用户表的JSON Schema', tags: ['system', 'user'], method: 'GET', path: '/api/system/user/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(userZodSchemas.select) as Record<string, unknown>;
  },
});

// 获取初始密码配置
async function getInitPassword(pwd?: string | null): Promise<string> {
  if(pwd) return pwd
  const [result] = await db.select({ value: config.value })
    .from(config)
    .where(eq(config.key, 'sys.user.initPassword'))
    .limit(1);
  return result?.value || '123456';
}

export const userResetPassword = defineAction({
  meta: { name: 'system.user.resetPassword', displayName: '重置密码', description: '重置用户密码为初始密码', tags: ['system', 'user'], method: 'POST', path: '/api/system/user/:id/reset-password' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    // 检查是否是系统管理员
    if (await checkIsSystemAdmin(input.id)) {
      throw new Error('error.system.admin.cannot.modify');
    }
    
    // 获取初始密码
    const initPassword = await getInitPassword();
    
    // 生成新的盐值和哈希密码
    const salt = generateSalt();
    const hashedPassword = await hashPassword(initPassword, salt);
    
    // 更新用户密码
    const [result] = await db.update(user).set({
      salt,
      password: hashedPassword,
      updatedBy: context.currentUserName,
    }).where(and(eq(user.id, input.id), isNull(user.deletedAt))).returning();
    
    return { success: !!result };
  },
});

export const userActions = [userGetByPagination, userGetByPk, userCreate, userCreateMany, userUpdate, userUpdateMany, userDeleteByPk, userGetSchema, userResetPassword];
