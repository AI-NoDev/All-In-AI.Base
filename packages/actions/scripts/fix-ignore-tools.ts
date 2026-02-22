/**
 * 修正 ignoreTools 设置
 * 
 * 原则：只 ignore 那些 AI 不需要或不应该直接调用的 actions
 * 
 * 应该 ignore 的 actions：
 * - 所有 batch/many 操作（createMany, updateMany, deleteMany）
 * - 所有 getSchema 操作
 * - WebSocket 操作 ws.*
 * - 开发工具 dev.*
 * - 文件上传内部操作：files.*, public.*
 * - 知识库复杂操作：permission.*, share.*, version.*, upload.confirm/force/direct, checkExists, updateOrder
 * - IM 内部操作：groupMember.*, conversationRead.*, conversationHidden.*, tempFile.*, createGroup, dissolveGroup, findOrCreatePrivate
 * - AI 内部会话操作：agentMessage.*, agentSession.*, aiSession.*, aiSessionMessage.*
 * - 系统关联表操作：userRole.*, userPost.*, roleMenu.*, roleDepartment.*, casbinRule.*
 * - 系统敏感操作：user.resetPassword, token.*
 * 
 * 保留给 AI 使用的 actions（不设置 ignoreTools）：
 * - 所有模块的基本 CRUD：create, update, deleteByPk, getByPk, getByPagination
 * - 知识库：node 基本操作、content 读写、favorite、search、move、copy、getPath、getChildren、upload.getUrl
 * - AI 模块：agent, model, provider, userMemory, apiKey, mcpServer, toolGroup 的基本 CRUD
 * - IM 模块：conversation, message 的基本操作
 * - 系统模块：user, role, menu, department, config, dict, dictGroup, post, notice, job, jobLog, loginInfo, operationLog, permission 的基本 CRUD
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const actionsRoot = join(import.meta.dir, '../src');

// 应该 ignore 的模式（精确匹配）
const IGNORE_PATTERNS = [
  // 批量操作和 Schema
  /Many\.ts$/,
  /getSchema\.ts$/,
  
  // WebSocket
  /\/ws\//,
  
  // 开发工具
  /\/dev\//,
  
  // 文件上传内部操作
  /\/files\//,
  /publicUpload\.ts$/,
  
  // 知识库复杂操作
  /\/knowledge\/permission\//,
  /\/knowledge\/share\//,
  /\/knowledge\/version\//,
  /\/knowledge\/upload\/confirm\.ts$/,
  /\/knowledge\/upload\/force\.ts$/,
  /\/knowledge\/upload\/direct\.ts$/,
  /\/knowledge\/operations\/checkExists\.ts$/,
  /\/knowledge\/operations\/updateOrder\.ts$/,
  
  // IM 内部操作
  /\/db\/im\/groupMember\//,
  /\/db\/im\/conversationRead\//,
  /\/db\/im\/conversationHidden\//,
  /\/db\/im\/tempFile\//,
  /\/db\/im\/conversation\/createGroup\.ts$/,
  /\/db\/im\/conversation\/dissolveGroup\.ts$/,
  /\/db\/im\/conversation\/findOrCreatePrivate\.ts$/,
  
  // AI 内部会话操作
  /\/db\/ai\/agentMessage\//,
  /\/db\/ai\/agentSession\//,
  /\/db\/ai\/aiSession\//,
  /\/db\/ai\/aiSessionMessage\//,
  
  // 系统关联表操作
  /\/db\/system\/userRole\//,
  /\/db\/system\/userPost\//,
  /\/db\/system\/roleMenu\//,
  /\/db\/system\/roleDepartment\//,
  /\/db\/system\/casbinRule\//,
  /\/db\/system\/token\//,
  
  // 系统敏感操作
  /\/db\/system\/user\/resetPassword\.ts$/,
];

// 不需要 KEEP_PATTERNS，因为默认就是保留（不 ignore）

async function findActionFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // 跳过 test, scripts, core 目录
        if (['test', 'scripts', 'core', 'memory', 'filter'].includes(entry.name)) continue;
        files.push(...await findActionFiles(fullPath));
      } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts') && entry.name !== 'index.ts' && entry.name !== 'schemas.ts' && entry.name !== 'utils.ts' && entry.name !== 'types.ts') {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // 目录不存在
  }
  
  return files;
}

function shouldIgnore(filePath: string): boolean {
  // 规范化路径为正斜杠（Windows 兼容）
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // 检查是否匹配 ignore 模式
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.test(normalizedPath)) {
      return true;
    }
  }
  
  return false;
}

async function processFile(filePath: string): Promise<{ path: string; action: 'add' | 'remove' | 'skip' }> {
  const content = await readFile(filePath, 'utf-8');
  
  // 检查是否包含 defineAction
  if (!content.includes('defineAction')) {
    return { path: filePath, action: 'skip' };
  }
  
  const shouldHaveIgnore = shouldIgnore(filePath);
  const hasIgnore = /ignoreTools:\s*true/.test(content);
  
  if (shouldHaveIgnore && !hasIgnore) {
    // 需要添加 ignoreTools: true
    // 在 meta: { 后面的 name: 前面添加 ignoreTools: true,
    const newContent = content.replace(
      /(meta:\s*\{[\s\n]*)(name:\s*['"])/,
      '$1ignoreTools: true,\n    $2'
    );
    
    if (newContent !== content) {
      await writeFile(filePath, newContent);
      return { path: filePath, action: 'add' };
    } else {
      console.log(`  警告: 无法匹配 meta 格式: ${filePath}`);
    }
  } else if (!shouldHaveIgnore && hasIgnore) {
    // 需要移除 ignoreTools: true
    let newContent = content.replace(/ignoreTools:\s*true,\s*\n?\s*/g, '');
    newContent = newContent.replace(/,\s*ignoreTools:\s*true/g, '');
    
    if (newContent !== content) {
      await writeFile(filePath, newContent);
      return { path: filePath, action: 'remove' };
    }
  }
  
  return { path: filePath, action: 'skip' };
}

async function main() {
  console.log('查找 action 文件...');
  const files = await findActionFiles(actionsRoot);
  console.log(`找到 ${files.length} 个文件`);
  
  const results = {
    add: [] as string[],
    remove: [] as string[],
    skip: [] as string[],
  };
  
  for (const file of files) {
    const result = await processFile(file);
    results[result.action].push(result.path);
  }
  
  console.log('\n=== 结果 ===');
  console.log(`添加 ignoreTools: ${results.add.length} 个文件`);
  for (const f of results.add) {
    console.log(`  + ${f.replace(actionsRoot, '')}`);
  }
  
  console.log(`\n移除 ignoreTools: ${results.remove.length} 个文件`);
  for (const f of results.remove) {
    console.log(`  - ${f.replace(actionsRoot, '')}`);
  }
  
  console.log(`\n跳过: ${results.skip.length} 个文件`);
}

main().catch(console.error);
