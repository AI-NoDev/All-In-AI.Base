/**
 * API密钥模块工具函数
 */

import { apiKey } from '@qiyu-allinai/db/entities/ai';

/** API密钥类型定义 */
export type ApiKeySelect = typeof apiKey.$inferSelect;
export type ApiKeyInsert = typeof apiKey.$inferInsert;

/**
 * 生成安全的随机 API Token
 * @returns token: 完整token, hash: 哈希值用于存储, prefix: 前缀用于显示
 */
export function generateToken(): { token: string; hash: string; prefix: string } {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = 'sk_' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const prefix = token.slice(0, 10) + '...';
  const hash = Bun.hash(token).toString(16);
  return { token, hash, prefix };
}
