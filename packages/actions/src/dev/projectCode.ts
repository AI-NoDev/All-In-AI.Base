/**
 * 项目代码浏览 Actions
 * 用于开发模式下浏览 monorepo 项目代码
 */

import { z } from 'zod';
import { defineAction } from '../core/define';
import { ActionError } from '../core/errors';
import * as fs from 'fs';
import * as path from 'path';

// 文件/目录项 Schema
const fileItemSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.enum(['file', 'directory']),
  size: z.number().optional(),
  extension: z.string().optional(),
});

type FileItem = z.infer<typeof fileItemSchema>;

// 忽略的目录和文件
const IGNORED_PATTERNS = [
  'node_modules',
  '.git',
  '.svelte-kit',
  '.turbo',
  'dist',
  'build',
  '.DS_Store',
  'Thumbs.db',
  '.env',
  '.env.local',
  'bun.lock',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

// 允许的文件扩展名
const ALLOWED_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.svelte', '.vue',
  '.json', '.yaml', '.yml',
  '.md', '.mdx',
  '.css', '.scss', '.less',
  '.html', '.xml',
  '.sql',
  '.sh', '.bash',
  '.dockerfile', '.dockerignore',
  '.gitignore', '.prettierrc', '.eslintrc',
];

/**
 * 获取 monorepo 根目录
 */
function getMonorepoRoot(): string {
  // 从当前工作目录向上查找包含 turbo.json 的目录
  let currentDir = process.cwd();
  
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, 'turbo.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  // 如果没找到，返回当前工作目录
  return process.cwd();
}

/**
 * 检查是否应该忽略该路径
 */
function shouldIgnore(name: string): boolean {
  return IGNORED_PATTERNS.some(pattern => {
    if (pattern.startsWith('.')) {
      return name === pattern || name.startsWith(pattern);
    }
    return name === pattern;
  });
}

/**
 * 检查文件扩展名是否允许
 */
function isAllowedFile(name: string): boolean {
  const ext = path.extname(name).toLowerCase();
  // 无扩展名的配置文件
  if (!ext && (name.startsWith('.') || ['Dockerfile', 'Makefile'].includes(name))) {
    return true;
  }
  return ALLOWED_EXTENSIONS.includes(ext);
}

/**
 * 获取项目根目录信息
 */
export const getProjectRoot = defineAction({
  meta: {
    ignoreTools: true,
    name: 'dev.projectCode.getRoot',
    displayName: '获取项目根目录',
    description: `获取 Turborepo monorepo 项目的根目录路径。

**返回：**
- root: 项目根目录绝对路径
- name: 项目名称（目录名）

**使用场景：**
- 开发模式下浏览项目代码结构
- 获取项目基础信息

**示例响应：**
\`\`\`json
{
  "root": "/home/user/ai-drive-system",
  "name": "ai-drive-system"
}
\`\`\``,
    tags: ['dev', 'project-code'],
    method: 'GET',
    path: '/api/dev/project-code/root',
  },
  schemas: {
    outputSchema: z.object({
      root: z.string(),
      name: z.string(),
    }),
  },
  execute: async () => {
    const root = getMonorepoRoot();
    return {
      root,
      name: path.basename(root),
    };
  },
});

/**
 * 读取目录内容
 */
export const readDirectory = defineAction({
  meta: {
    name: 'dev.projectCode.readDirectory',
    displayName: '读取目录',
    description: `读取指定目录下的文件和子目录列表。

**请求体参数：**
- relativePath: 相对于项目根目录的路径，可选，默认为根目录 ""

**返回：**
- items: 文件/目录列表，包含 name, path, type, size, extension
- currentPath: 当前目录相对路径

**过滤规则：**
- 自动忽略：node_modules, .git, .svelte-kit, dist, build 等
- 仅显示代码相关文件：.ts, .js, .svelte, .json, .md 等

**使用场景：**
- 开发模式下浏览项目目录结构
- 代码文件导航

**示例：**
\`\`\`json
{
  "relativePath": "packages/actions/src"
}
\`\`\``,
    tags: ['dev', 'project-code'],
    method: 'POST',
    path: '/api/dev/project-code/directory',
  },
  schemas: {
    bodySchema: z.object({
      relativePath: z.string().default(''),
    }),
    outputSchema: z.object({
      items: z.array(fileItemSchema),
      currentPath: z.string(),
    }),
  },
  execute: async (input) => {
    const root = getMonorepoRoot();
    const relativePath = input.relativePath ?? '';
    const targetPath = path.join(root, relativePath);
    
    // 安全检查：确保路径在项目根目录内
    const resolvedPath = path.resolve(targetPath);
    if (!resolvedPath.startsWith(root)) {
      throw ActionError.badRequest('error.dev.invalidPath');
    }
    
    if (!fs.existsSync(resolvedPath)) {
      throw ActionError.notFound('error.dev.pathNotFound');
    }
    
    const stats = fs.statSync(resolvedPath);
    if (!stats.isDirectory()) {
      throw ActionError.badRequest('error.dev.notDirectory');
    }
    
    const entries = fs.readdirSync(resolvedPath, { withFileTypes: true });
    const items: FileItem[] = [];
    
    for (const entry of entries) {
      if (shouldIgnore(entry.name)) continue;
      
      const itemPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        items.push({
          name: entry.name,
          path: itemPath,
          type: 'directory',
        });
      } else if (entry.isFile() && isAllowedFile(entry.name)) {
        const filePath = path.join(resolvedPath, entry.name);
        const fileStats = fs.statSync(filePath);
        items.push({
          name: entry.name,
          path: itemPath,
          type: 'file',
          size: fileStats.size,
          extension: path.extname(entry.name),
        });
      }
    }
    
    // 排序：目录在前，文件在后，按名称排序
    items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
    return {
      items,
      currentPath: relativePath,
    };
  },
});

/**
 * 读取文件内容
 */
export const readFileContent = defineAction({
  meta: {
    name: 'dev.projectCode.readFile',
    displayName: '读取文件',
    description: `读取指定代码文件的内容。

**请求体参数：**
- relativePath: 相对于项目根目录的文件路径，必填

**返回：**
- content: 文件内容（UTF-8）
- path: 文件相对路径
- name: 文件名
- extension: 文件扩展名
- size: 文件大小（字节）
- language: 编程语言（用于语法高亮）

**限制：**
- 最大文件大小：1MB
- 路径必须在项目根目录内（安全检查）

**使用场景：**
- 开发模式下查看代码文件内容
- 代码审查和分析

**示例：**
\`\`\`json
{
  "relativePath": "packages/actions/src/core/define.ts"
}
\`\`\``,
    tags: ['dev', 'project-code'],
    method: 'POST',
    path: '/api/dev/project-code/file',
  },
  schemas: {
    bodySchema: z.object({
      relativePath: z.string(),
    }),
    outputSchema: z.object({
      content: z.string(),
      path: z.string(),
      name: z.string(),
      extension: z.string(),
      size: z.number(),
      language: z.string(),
    }),
  },
  execute: async (input) => {
    const root = getMonorepoRoot();
    const relativePath = input.relativePath;
    const targetPath = path.join(root, relativePath);
    
    // 安全检查
    const resolvedPath = path.resolve(targetPath);
    if (!resolvedPath.startsWith(root)) {
      throw ActionError.badRequest('error.dev.invalidPath');
    }
    
    if (!fs.existsSync(resolvedPath)) {
      throw ActionError.notFound('error.dev.fileNotFound');
    }
    
    const stats = fs.statSync(resolvedPath);
    if (!stats.isFile()) {
      throw ActionError.badRequest('error.dev.notFile');
    }
    
    // 文件大小限制 (1MB)
    if (stats.size > 1024 * 1024) {
      throw ActionError.badRequest('error.dev.fileTooLarge');
    }
    
    const content = fs.readFileSync(resolvedPath, 'utf-8');
    const ext = path.extname(relativePath);
    
    // 根据扩展名推断语言
    const languageMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.mjs': 'javascript',
      '.cjs': 'javascript',
      '.svelte': 'svelte',
      '.vue': 'vue',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.md': 'markdown',
      '.mdx': 'markdown',
      '.css': 'css',
      '.scss': 'scss',
      '.less': 'less',
      '.html': 'html',
      '.xml': 'xml',
      '.sql': 'sql',
      '.sh': 'shell',
      '.bash': 'shell',
    };
    
    return {
      content,
      path: relativePath,
      name: path.basename(relativePath),
      extension: ext,
      size: stats.size,
      language: languageMap[ext] || 'plaintext',
    };
  },
});
