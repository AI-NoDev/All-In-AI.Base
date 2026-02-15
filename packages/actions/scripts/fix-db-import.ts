/**
 * Script to remove old db import from action files
 * Run with: bun packages/actions/scripts/fix-db-import.ts
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OLD_IMPORT = "import db from '@qiyu-allinai/db/connect';";

async function processFile(filePath: string): Promise<boolean> {
  const content = await readFile(filePath, 'utf-8');
  
  if (!content.includes(OLD_IMPORT)) {
    return false;
  }
  
  // Remove the old import line
  const newContent = content.replace(OLD_IMPORT + '\n', '');
  
  if (newContent !== content) {
    await writeFile(filePath, newContent, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

async function walkDir(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      files.push(...await walkDir(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function main() {
  const srcDir = join(process.cwd(), 'packages', 'actions', 'src');
  console.log(`Scanning: ${srcDir}`);
  const files = await walkDir(srcDir);
  console.log(`Found ${files.length} TypeScript files`);
  
  let fixed = 0;
  for (const file of files) {
    if (await processFile(file)) {
      fixed++;
    }
  }
  
  console.log(`\n🎉 Fixed ${fixed} files`);
}

main().catch(console.error);
