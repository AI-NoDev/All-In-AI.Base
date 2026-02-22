/**
 * 列出所有会暴露给 AI 的 actions（没有 ignoreTools: true 的）
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const actionsRoot = join(import.meta.dir, '../src');

interface ActionInfo {
  name: string;
  displayName: string;
  path: string;
  file: string;
}

async function findActionFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (['test', 'scripts', 'core', 'memory', 'filter'].includes(entry.name)) continue;
        files.push(...await findActionFiles(fullPath));
      } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts') && entry.name !== 'index.ts' && entry.name !== 'schemas.ts' && entry.name !== 'utils.ts' && entry.name !== 'types.ts') {
        files.push(fullPath);
      }
    }
  } catch {
    // 目录不存在
  }
  
  return files;
}

async function extractActionInfo(filePath: string): Promise<ActionInfo | null> {
  const content = await readFile(filePath, 'utf-8');
  
  if (!content.includes('defineAction')) return null;
  
  // 检查是否有 ignoreTools: true
  if (/ignoreTools:\s*true/.test(content)) return null;
  
  // 检查是否是 getSchema 路由
  if (/path:\s*['"][^'"]*\/schema['"]/.test(content)) return null;
  
  // 提取 name
  const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
  const displayNameMatch = content.match(/displayName:\s*['"]([^'"]+)['"]/);
  const pathMatch = content.match(/path:\s*['"]([^'"]+)['"]/);
  
  if (!nameMatch) return null;
  
  return {
    name: nameMatch[1],
    displayName: displayNameMatch?.[1] || nameMatch[1],
    path: pathMatch?.[1] || '',
    file: filePath.replace(actionsRoot, ''),
  };
}

async function main() {
  console.log('查找 action 文件...\n');
  const files = await findActionFiles(actionsRoot);
  
  const aiActions: ActionInfo[] = [];
  const ignoredActions: ActionInfo[] = [];
  
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    if (!content.includes('defineAction')) continue;
    
    const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
    const displayNameMatch = content.match(/displayName:\s*['"]([^'"]+)['"]/);
    const pathMatch = content.match(/path:\s*['"]([^'"]+)['"]/);
    
    if (!nameMatch) continue;
    
    const info: ActionInfo = {
      name: nameMatch[1],
      displayName: displayNameMatch?.[1] || nameMatch[1],
      path: pathMatch?.[1] || '',
      file: file.replace(actionsRoot, ''),
    };
    
    const hasIgnore = /ignoreTools:\s*true/.test(content);
    const isSchema = /path:\s*['"][^'"]*\/schema['"]/.test(content);
    
    if (hasIgnore || isSchema) {
      ignoredActions.push(info);
    } else {
      aiActions.push(info);
    }
  }
  
  // 按模块分组
  const grouped = new Map<string, ActionInfo[]>();
  for (const action of aiActions) {
    const module = action.name.split('.').slice(0, 2).join('.');
    if (!grouped.has(module)) grouped.set(module, []);
    grouped.get(module)!.push(action);
  }
  
  console.log('=== 暴露给 AI 的 Actions ===\n');
  for (const [module, actions] of Array.from(grouped.entries()).sort()) {
    console.log(`\n【${module}】(${actions.length} 个)`);
    for (const action of actions.sort((a, b) => a.name.localeCompare(b.name))) {
      console.log(`  - ${action.name}: ${action.displayName}`);
    }
  }
  
  console.log(`\n\n=== 统计 ===`);
  console.log(`暴露给 AI: ${aiActions.length} 个`);
  console.log(`已忽略: ${ignoredActions.length} 个`);
  console.log(`总计: ${aiActions.length + ignoredActions.length} 个`);
}

main().catch(console.error);
