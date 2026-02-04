/**
 * 种子数据初始化脚本
 * 运行: bun run seed
 */

import db from '../src/connect';
import { config } from '../src/entities/system';
import { systemConfigSeeds } from '../src/seedData';
import { eq } from 'drizzle-orm';

const SYSTEM_USER = 'system';

async function seedSystemConfig() {
  console.log('🌱 开始初始化系统参数...');
  
  let created = 0;
  let skipped = 0;

  for (const seed of systemConfigSeeds) {
    // 检查是否已存在
    const existing = await db
      .select()
      .from(config)
      .where(eq(config.key, seed.key))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  ⏭️  跳过: ${seed.key} (已存在)`);
      skipped++;
      continue;
    }

    // 插入新记录
    await db.insert(config).values({
      name: seed.name,
      key: seed.key,
      value: seed.value,
      isSystem: seed.isSystem,
      createdBy: SYSTEM_USER,
      updatedBy: SYSTEM_USER,
    });

    console.log(`  ✅ 创建: ${seed.key}`);
    created++;
  }

  console.log(`\n📊 系统参数: 创建 ${created} 条, 跳过 ${skipped} 条`);
}

async function main() {
  console.log('🚀 开始初始化种子数据...\n');

  try {
    await seedSystemConfig();
    // 后续可以添加更多种子数据函数
    // await seedDicts();
    // await seedMenus();
    
    console.log('\n✨ 种子数据初始化完成!');
  } catch (error) {
    console.error('\n❌ 种子数据初始化失败:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();
