/**
 * 迁移脚本：将 db 从直接 import 改为从 context 获取
 * 
 * 运行: bun packages/actions/scripts/migrate-db-to-context.ts
 */
const DB_DIR = `${import.meta.dir}/../src/db`;

async function findActionFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await Array.fromAsync(new Bun.Glob('**/index.ts').scan({ cwd: dir, absolute: true }));
  
  for (const entry of entries) {
    // 跳过测试文件和模块汇总文件
    if (entry.includes('.test.') || entry.endsWith('/db/index.ts')) continue;
    
    const parts = entry.split(/[/\\]/);
    const parentDir = parts[parts.length - 2];
    
    // 只处理实体目录下的 index.ts
    if (!['db', 'system', 'ai', 'im', 'knowledge'].includes(parentDir)) {
      files.push(entry);
    }
  }
  
  return files;
}

async function migrateFile(filePath: string): Promise<boolean> {
  const file = Bun.file(filePath);
  let content = await file.text();
  
  // 跳过已经迁移的文件
  if (content.includes("import type { DrizzleDB }") && !content.includes("import db from '@qiyu-allinai/db/connect'")) {
    console.log(`⏭️  Already migrated: ${filePath}`);
    return false;
  }
  
  // 跳过没有 db import 的文件
  if (!content.includes("import db from '@qiyu-allinai/db/connect'")) {
    console.log(`⏭️  No db import: ${filePath}`);
    return false;
  }
  
  let modified = false;
  
  // 1. 移除 db import
  if (content.includes("import db from '@qiyu-allinai/db/connect';")) {
    content = content.replace(/import db from '@qiyu-allinai\/db\/connect';\n/g, '');
    modified = true;
  }
  
  // 2. 添加 DrizzleDB import
  if (!content.includes("import type { DrizzleDB }")) {
    // 在 defineAction import 后添加
    content = content.replace(
      /(import { defineAction } from ['"]\.\.\/\.\.\/\.\.\/core\/define['"];?\n)/,
      "$1import type { DrizzleDB } from '../../../core/types';\n"
    );
    modified = true;
  }
  
  // 3. 修改 execute 函数
  // 将 _context 改为 context 并添加 db 解构
  content = content.replace(
    /execute: async \(input, _context\) => \{/g,
    'execute: async (input, context) => {\n    const { db } = context;'
  );
  
  // 对于已经使用 context 但没有 db 解构的
  content = content.replace(
    /execute: async \(input, context\) => \{\n(?!    const \{ db \})/g,
    'execute: async (input, context) => {\n    const { db } = context;\n'
  );
  
  if (modified || content !== await file.text()) {
    await Bun.write(filePath, content);
    console.log(`✅ Migrated: ${filePath}`);
    return true;
  }
  
  return false;
}

async function main() {
  console.log('🔍 Finding action files...');
  const files = await findActionFiles(DB_DIR);
  
  console.log(`📁 Found ${files.length} action files\n`);
  
  let migratedCount = 0;
  for (const file of files.sort()) {
    try {
      if (await migrateFile(file)) {
        migratedCount++;
      }
    } catch (err) {
      console.error(`❌ Error migrating ${file}:`, err);
    }
  }
  
  console.log(`\n✨ Migration complete! Migrated ${migratedCount} files.`);
  console.log('\n⚠️  Note: Files with helper functions using db may need manual fixes.');
}

main().catch(console.error);
