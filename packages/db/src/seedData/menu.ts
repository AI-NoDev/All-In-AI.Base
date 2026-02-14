/**
 * 菜单种子数据
 * 基于前端 generated-pages.ts 生成
 */

import { eq } from 'drizzle-orm';
import db from '../connect';
import { menu, MENU_TYPE } from '../entities/system/menu';

interface MenuSeed {
  id: string;
  name: string;
  parentId: string | null;
  orderNum: number;
  path: string | null;
  type: string;
  visible: boolean;
  isCache: boolean;
  isFrame: boolean;
  isSystem: boolean;
  linkUrl: string | null;
  linkTarget: string | null;
  perms: string | null;
  icon: string | null;
  remark: string | null;
}

// 固定的 UUID，确保每次初始化数据一致
// 注意：UUID 必须符合 RFC 4122 标准，第17位必须是 8/9/a/b
const MENU_IDS = {
  // 一级目录
  PLATFORM: '10000000-0000-4000-8000-000000000001',
  COMMUNICATION: '10000000-0000-4000-8000-000000000002',
  AI: '10000000-0000-4000-8000-000000000003',
  KNOWLEDGE: '10000000-0000-4000-8000-000000000007',
  SYSTEM: '10000000-0000-4000-8000-000000000004',
  SETTINGS: '10000000-0000-4000-8000-000000000005',
  DEV: '10000000-0000-4000-8000-000000000006',
  
  // 平台
  DASHBOARD: '20000000-0000-4000-8000-000000000001',
  
  // 知识库
  MY_FILES: '20000000-0000-4000-8000-000000000040',
  SHARED_WITH_ME: '20000000-0000-4000-8000-000000000041',
  MY_SHARED: '20000000-0000-4000-8000-000000000042',
  FAVORITES: '20000000-0000-4000-8000-000000000043',
  
  // 沟通
  CONTACTS: '20000000-0000-4000-8000-000000000003',
  
  // 智能体
  AI_MODELS: '20000000-0000-4000-8000-000000000004',
  AI_AGENTS: '20000000-0000-4000-8000-000000000005',
  
  // 系统管理
  USERS: '20000000-0000-4000-8000-000000000010',
  ROLES: '20000000-0000-4000-8000-000000000011',
  MENUS: '20000000-0000-4000-8000-000000000012',
  PERMISSIONS: '20000000-0000-4000-8000-000000000013',
  DEPARTMENTS: '20000000-0000-4000-8000-000000000014',
  POSTS: '20000000-0000-4000-8000-000000000015',
  DICTS: '20000000-0000-4000-8000-000000000016',
  OPERATION_LOGS: '20000000-0000-4000-8000-000000000017',
  LOGIN_LOGS: '20000000-0000-4000-8000-000000000018',
  
  // 系统设置
  PREFERENCES: '20000000-0000-4000-8000-000000000020',
  SYSTEM_CONFIG: '20000000-0000-4000-8000-000000000021',
  
  // 开发模式
  PROJECT_CODE: '20000000-0000-4000-8000-000000000030',
} as const;

/**
 * 菜单种子数据
 * isSystem=true 的菜单为系统内置，不可删除
 */
export const menuSeeds: MenuSeed[] = [
  // ============ 一级目录 ============
  {
    id: MENU_IDS.PLATFORM,
    name: '平台',
    parentId: null,
    orderNum: 1,
    path: null,
    type: MENU_TYPE.DIRECTORY,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: null,
    icon: 'tdesign:app',
    remark: '平台功能目录',
  },
  {
    id: MENU_IDS.COMMUNICATION,
    name: '沟通',
    parentId: null,
    orderNum: 2,
    path: null,
    type: MENU_TYPE.DIRECTORY,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: null,
    icon: 'tdesign:chat',
    remark: '沟通功能目录',
  },
  {
    id: MENU_IDS.AI,
    name: '智能体',
    parentId: null,
    orderNum: 3,
    path: null,
    type: MENU_TYPE.DIRECTORY,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: null,
    icon: 'mdi:robot-outline',
    remark: '智能体功能目录',
  },
  {
    id: MENU_IDS.KNOWLEDGE,
    name: '知识库',
    parentId: null,
    orderNum: 4,
    path: null,
    type: MENU_TYPE.DIRECTORY,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: null,
    icon: 'tdesign:folder-open',
    remark: '知识库功能目录',
  },
  {
    id: MENU_IDS.SYSTEM,
    name: '系统管理',
    parentId: null,
    orderNum: 5,
    path: null,
    type: MENU_TYPE.DIRECTORY,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: null,
    icon: 'tdesign:setting',
    remark: '系统管理目录',
  },
  {
    id: MENU_IDS.SETTINGS,
    name: '系统设置',
    parentId: null,
    orderNum: 6,
    path: null,
    type: MENU_TYPE.DIRECTORY,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: null,
    icon: 'tdesign:tools',
    remark: '系统设置目录',
  },

  // ============ 平台 ============
  {
    id: MENU_IDS.DASHBOARD,
    name: '首页',
    parentId: MENU_IDS.PLATFORM,
    orderNum: 1,
    path: '/dashboard',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'dashboard:view',
    icon: 'tdesign:home',
    remark: '首页仪表盘',
  },

  // ============ 知识库 ============
  {
    id: MENU_IDS.MY_FILES,
    name: '我的知识库',
    parentId: MENU_IDS.KNOWLEDGE,
    orderNum: 1,
    path: '/dashboard/knowledge/my-files',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'knowledge:view',
    icon: 'tdesign:folder',
    remark: '我的文件和文件夹',
  },
  {
    id: MENU_IDS.SHARED_WITH_ME,
    name: '收到的共享',
    parentId: MENU_IDS.KNOWLEDGE,
    orderNum: 2,
    path: '/dashboard/knowledge/shared-with-me',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'knowledge:view',
    icon: 'tdesign:user-transmit',
    remark: '他人共享给我的文件',
  },
  {
    id: MENU_IDS.MY_SHARED,
    name: '我的共享',
    parentId: MENU_IDS.KNOWLEDGE,
    orderNum: 3,
    path: '/dashboard/knowledge/my-shared',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'knowledge:view',
    icon: 'tdesign:share',
    remark: '我共享给他人的文件',
  },
  {
    id: MENU_IDS.FAVORITES,
    name: '收藏',
    parentId: MENU_IDS.KNOWLEDGE,
    orderNum: 4,
    path: '/dashboard/knowledge/favorites',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'knowledge:view',
    icon: 'tdesign:star',
    remark: '收藏的文件和文件夹',
  },

  // ============ 沟通 ============
  {
    id: MENU_IDS.CONTACTS,
    name: '联系人',
    parentId: MENU_IDS.COMMUNICATION,
    orderNum: 1,
    path: '/dashboard/contacts',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: null,
    icon: 'tdesign:user-talk',
    remark: '联系人与会话',
  },

  // ============ 智能体 ============
  {
    id: MENU_IDS.AI_MODELS,
    name: '模型管理',
    parentId: MENU_IDS.AI,
    orderNum: 1,
    path: '/dashboard/ai/models',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: null,
    icon: 'mdi:brain',
    remark: 'AI模型配置管理',
  },
  {
    id: MENU_IDS.AI_AGENTS,
    name: '智能体管理',
    parentId: MENU_IDS.AI,
    orderNum: 2,
    path: '/dashboard/ai/agents',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: null,
    icon: 'mdi:robot',
    remark: '智能体配置管理',
  },

  // ============ 系统管理 ============
  {
    id: MENU_IDS.USERS,
    name: '用户管理',
    parentId: MENU_IDS.SYSTEM,
    orderNum: 1,
    path: '/dashboard/system/users',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'system:user:view',
    icon: 'tdesign:user',
    remark: '系统用户管理',
  },
  {
    id: MENU_IDS.ROLES,
    name: '角色管理',
    parentId: MENU_IDS.SYSTEM,
    orderNum: 2,
    path: '/dashboard/system/roles',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'system:role:view',
    icon: 'tdesign:usergroup',
    remark: '系统角色管理',
  },
  {
    id: MENU_IDS.MENUS,
    name: '菜单管理',
    parentId: MENU_IDS.SYSTEM,
    orderNum: 3,
    path: '/dashboard/system/menus',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'system:menu:view',
    icon: 'tdesign:menu-application',
    remark: '系统菜单管理',
  },
  {
    id: MENU_IDS.PERMISSIONS,
    name: '权限管理',
    parentId: MENU_IDS.SYSTEM,
    orderNum: 4,
    path: '/dashboard/system/permissions',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'system:permission:view',
    icon: 'tdesign:secured',
    remark: '系统权限管理',
  },
  {
    id: MENU_IDS.DEPARTMENTS,
    name: '部门管理',
    parentId: MENU_IDS.SYSTEM,
    orderNum: 5,
    path: '/dashboard/system/departments',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'system:dept:view',
    icon: 'tdesign:tree-square-dot',
    remark: '组织部门管理',
  },
  {
    id: MENU_IDS.POSTS,
    name: '岗位管理',
    parentId: MENU_IDS.SYSTEM,
    orderNum: 6,
    path: '/dashboard/system/posts',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'system:post:view',
    icon: 'tdesign:user-business',
    remark: '岗位职位管理',
  },
  {
    id: MENU_IDS.DICTS,
    name: '字典管理',
    parentId: MENU_IDS.SYSTEM,
    orderNum: 7,
    path: '/dashboard/system/dicts',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'system:dict:view',
    icon: 'tdesign:book',
    remark: '数据字典管理',
  },
  {
    id: MENU_IDS.OPERATION_LOGS,
    name: '操作日志',
    parentId: MENU_IDS.SYSTEM,
    orderNum: 8,
    path: '/dashboard/system/operation-logs',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'system:operlog:view',
    icon: 'tdesign:history',
    remark: '系统操作日志',
  },
  {
    id: MENU_IDS.LOGIN_LOGS,
    name: '登录日志',
    parentId: MENU_IDS.SYSTEM,
    orderNum: 9,
    path: '/dashboard/system/login-logs',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'system:loginlog:view',
    icon: 'tdesign:login',
    remark: '用户登录日志',
  },

  // ============ 系统设置 ============
  {
    id: MENU_IDS.PREFERENCES,
    name: '个性化',
    parentId: MENU_IDS.SETTINGS,
    orderNum: 1,
    path: '/dashboard/preferences',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'settings:preferences:view',
    icon: 'tdesign:palette',
    remark: '个性化设置',
  },
  {
    id: MENU_IDS.SYSTEM_CONFIG,
    name: '系统参数',
    parentId: MENU_IDS.SETTINGS,
    orderNum: 2,
    path: '/dashboard/system-config',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'system:config:view',
    icon: 'tdesign:setting',
    remark: '系统参数配置',
  },

  // ============ 开发模式（仅开发环境显示） ============
  {
    id: MENU_IDS.DEV,
    name: '开发模式',
    parentId: null,
    orderNum: 99,
    path: null,
    type: MENU_TYPE.DIRECTORY,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: null,
    icon: 'tdesign:code',
    remark: '开发模式目录（仅开发环境可见）',
  },
  {
    id: MENU_IDS.PROJECT_CODE,
    name: '项目代码',
    parentId: MENU_IDS.DEV,
    orderNum: 1,
    path: '/dashboard/dev/project-code',
    type: MENU_TYPE.MENU,
    visible: true,
    isCache: true,
    isFrame: false,
    isSystem: true,
    linkUrl: null,
    linkTarget: null,
    perms: 'dev:project-code:view',
    icon: 'tdesign:file-code',
    remark: '浏览项目源代码（仅开发环境可见）',
  },
];

/**
 * 初始化菜单种子数据
 * 使用 upsert 策略，存在则更新，不存在则插入
 */
export async function initMenuSeeds(): Promise<void> {
  console.log('🔧 Initializing menu seeds...');
  
  let created = 0;
  let updated = 0;

  for (const seed of menuSeeds) {
    const existing = await db.select().from(menu).where(eq(menu.id, seed.id)).limit(1);
    
    if (existing.length > 0) {
      // 更新现有记录
      await db.update(menu)
        .set({
          name: seed.name,
          parentId: seed.parentId,
          orderNum: seed.orderNum,
          path: seed.path,
          type: seed.type,
          visible: seed.visible,
          isCache: seed.isCache,
          isFrame: seed.isFrame,
          isSystem: seed.isSystem,
          linkUrl: seed.linkUrl,
          linkTarget: seed.linkTarget,
          perms: seed.perms,
          icon: seed.icon,
          remark: seed.remark,
          updatedBy: 'system',
        })
        .where(eq(menu.id, seed.id));
      updated++;
    } else {
      // 插入新记录
      await db.insert(menu).values({
        ...seed,
        createdBy: 'system',
        updatedBy: 'system',
      });
      created++;
    }
  }
  
  console.log(`✅ Menu seeds: ${created} created, ${updated} updated`);
}

// 导出菜单ID常量和类型供其他模块使用
export { MENU_IDS, MENU_TYPE };
