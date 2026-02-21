/**
 * 权限种子数据
 * 定义系统中所有可授权的资源和操作
 */

import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { permission } from '../entities/system/permission';
import { PERMISSION_TYPES, STANDARD_ACTIONS } from '../entities/system/permission';

export interface PermissionSeed {
  code: string;
  name: string;
  type: string;
  module?: string;
  resource?: string;
  action?: string;
  description?: string;
  orderNum: number;
  children?: PermissionSeed[];
}

/**
 * 生成模块权限树
 */
function createModulePermissions(
  module: string,
  moduleName: string,
  resources: Array<{ code: string; name: string; actions?: string[] }>,
  baseOrder: number
): PermissionSeed {
  return {
    code: module,
    name: moduleName,
    type: PERMISSION_TYPES.MODULE,
    module,
    orderNum: baseOrder,
    children: resources.map((resource, idx) => ({
      code: `${module}:${resource.code}`,
      name: resource.name,
      type: PERMISSION_TYPES.RESOURCE,
      module,
      resource: resource.code,
      orderNum: idx + 1,
      children: (resource.actions || ['read', 'write', 'delete', 'manage']).map((action, actionIdx) => ({
        code: `${module}:${resource.code}:${action}`,
        name: getActionName(action),
        type: PERMISSION_TYPES.ACTION,
        module,
        resource: resource.code,
        action,
        orderNum: actionIdx + 1,
      })),
    })),
  };
}

function getActionName(action: string): string {
  const actionNames: Record<string, string> = {
    [STANDARD_ACTIONS.READ]: '查看',
    [STANDARD_ACTIONS.WRITE]: '编辑',
    [STANDARD_ACTIONS.DELETE]: '删除',
    [STANDARD_ACTIONS.MANAGE]: '管理',
    [STANDARD_ACTIONS.EXPORT]: '导出',
    [STANDARD_ACTIONS.IMPORT]: '导入',
  };
  return actionNames[action] || action;
}

/**
 * 权限种子数据（树形结构）
 * 基于实际的前端路由和后端 Actions 定义
 */
export const permissionSeeds: PermissionSeed[] = [
  // 系统管理模块
  createModulePermissions('system', '系统管理', [
    { code: 'user', name: '用户管理', actions: ['read', 'write', 'delete', 'manage', 'export', 'import'] },
    { code: 'role', name: '角色管理' },
    { code: 'menu', name: '菜单管理' },
    { code: 'permission', name: '权限管理' },
    { code: 'department', name: '部门管理' },
    { code: 'post', name: '岗位管理' },
    { code: 'dict', name: '字典管理' },
    { code: 'config', name: '参数配置' },
    { code: 'log', name: '日志管理', actions: ['read', 'delete', 'export'] },
    { code: 'casbin', name: '策略管理' },
  ], 1),

  // AI 模块
  createModulePermissions('ai', 'AI 管理', [
    { code: 'provider', name: '服务商管理' },
    { code: 'model', name: '模型管理' },
    { code: 'agent', name: 'Agent 管理' },
    { code: 'apikey', name: 'API 密钥管理' },
    { code: 'mcp', name: 'MCP 服务器管理' },
    { code: 'session', name: '会话管理', actions: ['read', 'delete'] },
  ], 2),

  // 知识库模块
  createModulePermissions('knowledge', '知识库', [
    { code: 'node', name: '文件/文件夹管理', actions: ['read', 'write', 'delete', 'manage', 'export'] },
    { code: 'share', name: '共享管理' },
    { code: 'favorite', name: '收藏管理', actions: ['read', 'write', 'delete'] },
    { code: 'version', name: '版本管理', actions: ['read', 'write', 'delete'] },
  ], 3),

  // 即时通讯模块
  createModulePermissions('im', '即时通讯', [
    { code: 'conversation', name: '会话管理' },
    { code: 'message', name: '消息管理', actions: ['read', 'delete'] },
    { code: 'group', name: '群组管理' },
  ], 4),

  // 服务器监控模块
  createModulePermissions('monitor', '服务器监控', [
    { code: 'overview', name: '概览', actions: ['read'] },
    { code: 'charts', name: '图表', actions: ['read'] },
    { code: 'processes', name: '进程管理', actions: ['read', 'manage'] },
    { code: 'ports', name: '端口监控', actions: ['read'] },
  ], 5),

  // 开发模块
  createModulePermissions('dev', '开发工具', [
    { code: 'code', name: '项目代码', actions: ['read'] },
  ], 99),
];

/**
 * 扁平化权限树（用于数据库插入）
 */
export function flattenPermissions(
  permissions: PermissionSeed[],
  parentCode?: string
): Array<Omit<PermissionSeed, 'children'> & { parentCode?: string }> {
  const result: Array<Omit<PermissionSeed, 'children'> & { parentCode?: string }> = [];

  for (const perm of permissions) {
    const { children, ...permData } = perm;

    result.push({
      ...permData,
      parentCode,
    });

    if (children && children.length > 0) {
      result.push(...flattenPermissions(children, perm.code));
    }
  }

  return result;
}

/**
 * 获取扁平化的权限列表
 */
export const flatPermissionSeeds = flattenPermissions(permissionSeeds);

/**
 * 初始化权限种子数据
 */
export async function initPermissionSeeds(db: PostgresJsDatabase): Promise<void> {
  console.log('🔧 Initializing permission seeds...');
  
  const flatSeeds = flattenPermissions(permissionSeeds);
  const codeToIdMap = new Map<string, string>();
  let created = 0;
  let skipped = 0;

  for (const seed of flatSeeds) {
    // 检查是否已存在
    const [existing] = await db.select().from(permission)
      .where(eq(permission.code, seed.code))
      .limit(1);

    if (existing) {
      codeToIdMap.set(seed.code, existing.id);
      skipped++;
      continue;
    }

    // 获取父级 ID
    const parentId = seed.parentCode ? codeToIdMap.get(seed.parentCode) : undefined;

    // 创建权限
    const [newPerm] = await db.insert(permission).values({
      code: seed.code,
      name: seed.name,
      type: seed.type,
      module: seed.module,
      resource: seed.resource,
      action: seed.action,
      description: seed.description,
      orderNum: seed.orderNum,
      parentId,
      status: true,
      createdBy: 'system',
      updatedBy: 'system',
    }).returning();

    if (newPerm) {
      codeToIdMap.set(seed.code, newPerm.id);
      created++;
    }
  }

  console.log(`✅ Permission seeds: ${created} created, ${skipped} skipped`);
}
