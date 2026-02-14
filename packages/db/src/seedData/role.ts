/**
 * 角色种子数据
 */

import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { role, DATA_SCOPE, BUILTIN_ROLES } from '../entities/system/role';

export interface RoleSeed {
  key: string;
  name: string;
  description?: string;
  dataScope: string;
  sort: number;
  flag: boolean;
}

/**
 * 内置角色种子数据
 */
export const roleSeeds: RoleSeed[] = [
  {
    key: BUILTIN_ROLES.SUPER_ADMIN,
    name: '超级管理员',
    description: '拥有系统所有权限，不可删除',
    dataScope: DATA_SCOPE.ALL,
    sort: 1,
    flag: true, // 系统内置标识
  },
  {
    key: BUILTIN_ROLES.ADMIN,
    name: '管理员',
    description: '拥有大部分管理权限',
    dataScope: DATA_SCOPE.ALL,
    sort: 2,
    flag: true,
  },
  {
    key: BUILTIN_ROLES.USER,
    name: '普通用户',
    description: '普通用户，拥有基本操作权限',
    dataScope: DATA_SCOPE.SELF,
    sort: 3,
    flag: true,
  },
  {
    key: BUILTIN_ROLES.GUEST,
    name: '访客',
    description: '只读权限',
    dataScope: DATA_SCOPE.SELF,
    sort: 4,
    flag: true,
  },
];

/**
 * 初始化角色种子数据
 */
export async function initRoleSeeds(db: PostgresJsDatabase): Promise<Map<string, string>> {
  console.log('🔧 Initializing role seeds...');
  
  const keyToIdMap = new Map<string, string>();
  let created = 0;
  let skipped = 0;

  for (const seed of roleSeeds) {
    // 检查是否已存在
    const [existing] = await db.select().from(role)
      .where(eq(role.key, seed.key))
      .limit(1);

    if (existing) {
      keyToIdMap.set(seed.key, existing.id);
      skipped++;
      continue;
    }

    // 创建角色
    const [newRole] = await db.insert(role).values({
      key: seed.key,
      name: seed.name,
      description: seed.description,
      dataScope: seed.dataScope,
      sort: seed.sort,
      flag: seed.flag,
      status: '0',
      createdBy: 'system',
      updatedBy: 'system',
    }).returning();

    if (newRole) {
      keyToIdMap.set(seed.key, newRole.id);
      created++;
    }
  }

  console.log(`✅ Role seeds: ${created} created, ${skipped} skipped`);
  return keyToIdMap;
}
