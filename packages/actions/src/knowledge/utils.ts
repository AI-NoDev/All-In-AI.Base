/**
 * 知识库工具函数
 */

import { KnowledgePermissionAdapter, type KnowledgePermission } from '@qiyu-allinai/db/casbin';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { DrizzleDB } from '../core/types';
import { ActionError } from '../core/errors';

// ============ 节点类型定义 ============

/** 节点权限检查所需的最小字段 */
export interface NodePermissionFields {
  id: string;
  createdById: string | null;
  materializedPath: string;
}

// ============ 权限检查 ============

/**
 * 获取权限适配器实例
 */
export function getPermissionAdapter(db: DrizzleDB): KnowledgePermissionAdapter {
  return new KnowledgePermissionAdapter(db as PostgresJsDatabase);
}

/**
 * 检查用户对节点的操作权限
 * 1. 如果是创建人，直接允许
 * 2. 否则检查 Casbin 权限
 */
export async function checkNodePermission(
  db: DrizzleDB,
  userId: string,
  node: NodePermissionFields,
  permission: KnowledgePermission
): Promise<boolean> {
  // 创建人拥有所有权限（确保 createdById 不为 null 且匹配）
  if (node.createdById && node.createdById === userId) {
    return true;
  }
  
  // 从物化路径解析祖先ID
  const ancestorIds = parseMaterializedPath(node.materializedPath);
  
  // 检查 Casbin 权限
  const adapter = getPermissionAdapter(db);
  return adapter.checkPermission(userId, node.id, permission, ancestorIds);
}

/**
 * 检查并抛出权限错误
 */
export async function assertNodePermission(
  db: DrizzleDB,
  userId: string,
  node: NodePermissionFields,
  permission: KnowledgePermission
): Promise<void> {
  const allowed = await checkNodePermission(db, userId, node, permission);
  if (!allowed) {
    throw ActionError.forbidden('error.knowledge.permissionDenied');
  }
}

// ============ 路径工具 ============

/**
 * 构建可读路径
 * @param parentPath 父节点路径
 * @param parentName 父节点名称
 */
export function buildPath(parentPath: string | null, parentName: string | null): string {
  if (!parentPath || !parentName) return '/';
  return `${parentPath}${parentName}/`;
}

/**
 * 构建物化路径 (UUID路径)
 * @param parentMaterializedPath 父节点物化路径
 * @param parentId 父节点ID
 */
export function buildMaterializedPath(parentMaterializedPath: string | null, parentId: string | null): string {
  if (!parentId) return '';
  if (!parentMaterializedPath) return parentId;
  return `${parentMaterializedPath}/${parentId}`;
}

/**
 * 解析物化路径为祖先ID数组
 */
export function parseMaterializedPath(materializedPath: string | null): string[] {
  if (!materializedPath) return [];
  return materializedPath.split('/').filter(Boolean);
}

/**
 * 检查是否是祖先节点（防止循环移动）
 */
export function isAncestor(targetMaterializedPath: string, nodeId: string): boolean {
  const ancestors = parseMaterializedPath(targetMaterializedPath);
  return ancestors.includes(nodeId);
}

// ============ 文本文件检测 ============

/** 文本文件扩展名 */
export const TEXT_FILE_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'json', 'xml', 'yaml', 'yml',
  'html', 'htm', 'css', 'scss', 'sass', 'less',
  'js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs',
  'py', 'rb', 'php', 'java', 'c', 'cpp', 'h', 'hpp',
  'go', 'rs', 'swift', 'kt', 'scala', 'clj',
  'sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd',
  'sql', 'graphql', 'gql',
  'env', 'ini', 'conf', 'cfg', 'toml',
  'log', 'csv', 'tsv',
  'vue', 'svelte', 'astro',
]);

/** 文本 MIME 类型前缀 */
export const TEXT_MIME_PREFIXES = [
  'text/',
  'application/json',
  'application/xml',
  'application/javascript',
  'application/typescript',
  'application/x-yaml',
  'application/x-sh',
];

/**
 * 检查是否是文本文件
 */
export function isTextFile(extension: string | null, mimeType: string | null): boolean {
  if (extension && TEXT_FILE_EXTENSIONS.has(extension.toLowerCase())) {
    return true;
  }
  if (mimeType) {
    return TEXT_MIME_PREFIXES.some(prefix => mimeType.startsWith(prefix));
  }
  return false;
}

// ============ 文件名工具 ============

/**
 * 转义正则特殊字符
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 生成唯一文件名（处理冲突）
 */
export function generateUniqueName(baseName: string, extension: string, existingNames: Set<string>): string {
  const ext = extension ? `.${extension}` : '';
  let newName = `${baseName}${ext}`;
  let copyNum = 1;
  
  while (existingNames.has(newName)) {
    newName = `${baseName}(${copyNum})${ext}`;
    copyNum++;
  }
  
  return newName;
}

/**
 * 解析文件名和扩展名
 */
export function parseFileName(name: string): { baseName: string; extension: string } {
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1 || lastDot === 0) {
    return { baseName: name, extension: '' };
  }
  return {
    baseName: name.substring(0, lastDot),
    extension: name.substring(lastDot + 1),
  };
}
