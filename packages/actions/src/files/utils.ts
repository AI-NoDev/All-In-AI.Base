/**
 * 文件操作工具函数
 * 
 * 注意：此文件仅用于旧的文件上传功能
 * 新的知识库操作请使用 knowledge/utils.ts
 */

import { KnowledgePermissionAdapter, type KnowledgePermission } from '@qiyu-allinai/db/casbin';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { DrizzleDB } from '../core/types';
import { ActionError } from '../core/errors';

// ============ 类型定义 ============

export type ResourceType = 'file' | 'folder';
export type PermissionType = 'read' | 'write' | 'delete' | 'manage';

export interface ResourceRecord {
  id: string;
  createdById: string | null;
}

// ============ 权限检查辅助函数 ============

/**
 * 检查用户对资源的操作权限
 * 1. 如果是创建人，直接允许
 * 2. 否则检查 Casbin 权限
 */
export async function checkResourcePermission(
  db: DrizzleDB,
  userId: string,
  resourceType: ResourceType,
  resource: ResourceRecord,
  permission: PermissionType
): Promise<boolean> {
  // 创建人拥有所有权限
  if (resource.createdById === userId) {
    return true;
  }
  
  // 检查 Casbin 权限 (使用新的 KnowledgePermissionAdapter)
  const adapter = new KnowledgePermissionAdapter(db as PostgresJsDatabase);
  return adapter.checkPermission(userId, resource.id, permission as KnowledgePermission);
}

/**
 * 检查并抛出权限错误
 */
export async function assertResourcePermission(
  db: DrizzleDB,
  userId: string,
  resourceType: ResourceType,
  resource: ResourceRecord,
  permission: PermissionType
): Promise<void> {
  const allowed = await checkResourcePermission(db, userId, resourceType, resource, permission);
  if (!allowed) {
    throw ActionError.forbidden('error.files.permissionDenied');
  }
}

// ============ 文本文件检测 ============

// 允许编辑的文本文件扩展名
export const TEXT_FILE_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'json', 'js', 'ts', 'jsx', 'tsx',
  'html', 'htm', 'css', 'scss', 'sass', 'less',
  'xml', 'yaml', 'yml', 'toml', 'ini', 'conf', 'cfg',
  'sh', 'bash', 'zsh', 'fish', 'bat', 'cmd', 'ps1',
  'py', 'rb', 'php', 'java', 'c', 'cpp', 'h', 'hpp',
  'go', 'rs', 'swift', 'kt', 'scala', 'clj',
  'sql', 'graphql', 'gql',
  'env', 'gitignore', 'dockerignore', 'editorconfig',
  'log', 'csv', 'tsv',
]);

// 允许编辑的 MIME 类型前缀
export const TEXT_MIME_PREFIXES = ['text/', 'application/json', 'application/xml', 'application/javascript'];

export function isTextFile(extension: string | null, mimeType: string | null): boolean {
  // 检查扩展名
  if (extension && TEXT_FILE_EXTENSIONS.has(extension.toLowerCase())) {
    return true;
  }
  // 检查 MIME 类型
  if (mimeType) {
    for (const prefix of TEXT_MIME_PREFIXES) {
      if (mimeType.startsWith(prefix)) {
        return true;
      }
    }
  }
  return false;
}

// ============ 其他工具函数 ============

/**
 * 转义正则表达式特殊字符
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
