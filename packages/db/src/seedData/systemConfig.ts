/**
 * 系统参数种子数据
 */

import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { config } from '../entities/system/config';

export interface SystemConfigSeed {
  name: string;
  key: string;
  value: string;
  isSystem: boolean;
}

export const systemConfigSeeds: SystemConfigSeed[] = [
  // 网站基本信息
  {
    name: '网站名称',
    key: 'sys.site.name',
    value: 'All In AI Base System',
    isSystem: true,
  },
  {
    name: '网站 Logo',
    key: 'sys.site.logo',
    value: '',
    isSystem: true,
  },
  {
    name: '网站图标',
    key: 'sys.site.favicon',
    value: '',
    isSystem: true,
  },
  {
    name: '网站描述',
    key: 'sys.site.description',
    value: '企业级 AI 驱动管理系统',
    isSystem: true,
  },
  {
    name: '网站关键词',
    key: 'sys.site.keywords',
    value: 'AI,管理系统,企业级',
    isSystem: true,
  },
  // 版权信息
  {
    name: '版权信息',
    key: 'sys.site.copyright',
    value: '© 2024 All In AI. All rights reserved.',
    isSystem: true,
  },
  {
    name: 'ICP 备案号',
    key: 'sys.site.icp',
    value: '',
    isSystem: true,
  },
  // 用户相关
  {
    name: '用户初始密码',
    key: 'sys.user.initPassword',
    value: '123456',
    isSystem: true,
  },
  {
    name: '密码最小长度',
    key: 'sys.user.password.minLength',
    value: '6',
    isSystem: true,
  },
  {
    name: '登录失败锁定次数',
    key: 'sys.user.login.maxRetry',
    value: '5',
    isSystem: true,
  },
  {
    name: '登录失败锁定时间(分钟)',
    key: 'sys.user.login.lockTime',
    value: '30',
    isSystem: true,
  },
  // 文件上传
  {
    name: '文件上传大小限制(MB)',
    key: 'sys.file.maxSize',
    value: '50',
    isSystem: true,
  },
  {
    name: '允许上传的文件类型',
    key: 'sys.file.allowedTypes',
    value: 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar',
    isSystem: true,
  },
];

/**
 * 初始化系统配置种子数据
 */
export async function initSystemConfigSeeds(db: PostgresJsDatabase): Promise<void> {
  console.log('🔧 Initializing system config seeds...');
  
  let created = 0;
  let skipped = 0;

  for (const seed of systemConfigSeeds) {
    // 检查是否已存在
    const [existing] = await db.select().from(config)
      .where(eq(config.key, seed.key))
      .limit(1);

    if (existing) {
      skipped++;
      continue;
    }

    // 创建配置
    await db.insert(config).values({
      name: seed.name,
      key: seed.key,
      value: seed.value,
      isSystem: seed.isSystem,
      createdBy: 'system',
      updatedBy: 'system',
    });

    created++;
  }

  console.log(`✅ System config seeds: ${created} created, ${skipped} skipped`);
}
