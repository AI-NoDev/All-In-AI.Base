/**
 * 记忆系统类型定义
 */

import { t, type Static } from 'elysia';

// ============ 记忆类型 ============
export const MEMORY_TYPES = {
  STM: 'STM',             // 短期记忆 (Redis)
  LTM: 'LTM',             // 长期记忆 (PostgreSQL)
  PREFERENCE: 'PREFERENCE', // 偏好记忆 (PostgreSQL)
  FACT: 'FACT',           // 事实记忆 (PostgreSQL)
  EPISODIC: 'EPISODIC',   // 情景记忆 (PostgreSQL)
} as const;

export type MemoryType = typeof MEMORY_TYPES[keyof typeof MEMORY_TYPES];

// 持久化记忆类型（存 PostgreSQL）
export const PERSISTENT_MEMORY_TYPES = ['LTM', 'PREFERENCE', 'FACT', 'EPISODIC'] as const;
export type PersistentMemoryType = typeof PERSISTENT_MEMORY_TYPES[number];

// ============ STM 短期记忆 (Redis) ============
export interface ShortTermMemory {
  id: string;
  userId: string;
  sessionId: string;
  agentId?: string;
  content: string;
  metadata?: Record<string, unknown>;
  importance: number;
  createdAt: string;
  ttl: number; // 秒
}

export const shortTermMemorySchema = t.Object({
  id: t.String({ description: '记忆ID' }),
  userId: t.String({ description: '用户ID' }),
  sessionId: t.String({ description: '会话ID' }),
  agentId: t.Optional(t.String({ description: '智能体ID' })),
  content: t.String({ description: '记忆内容' }),
  metadata: t.Optional(t.Record(t.String(), t.Unknown(), { description: '元数据' })),
  importance: t.Number({ minimum: 1, maximum: 10, default: 5, description: '重要度' }),
  createdAt: t.String({ description: '创建时间' }),
  ttl: t.Number({ default: 1800, description: '过期时间(秒)' }), // 默认30分钟
});

export type ShortTermMemorySchema = Static<typeof shortTermMemorySchema>;

// ============ LTM 长期记忆 (PostgreSQL) ============
export interface LongTermMemory {
  id: string;
  userId: string;
  agentId?: string | null;
  sessionId?: string | null;
  memoryType: PersistentMemoryType;
  content: string;
  metadata?: Record<string, unknown> | null;
  importance: number;
  accessCount: number;
  lastAccessAt?: string | null;
  expireAt?: string | null;
  embedding?: number[] | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============ 统一记忆接口 ============
export interface Memory {
  id: string;
  userId: string;
  sessionId?: string | null;
  agentId?: string | null;
  memoryType: MemoryType;
  content: string;
  metadata?: Record<string, unknown> | null;
  importance: number;
  createdAt: string;
  // STM 特有
  ttl?: number;
  // LTM 特有
  accessCount?: number;
  lastAccessAt?: string | null;
  expireAt?: string | null;
  embedding?: number[] | null;
}

// ============ 记忆检索结果 ============
export interface MemorySearchResult {
  memory: Memory;
  score: number; // 相似度分数
  source: 'stm' | 'ltm';
}

// ============ Redis Key 前缀 ============
export const REDIS_KEYS = {
  STM_PREFIX: 'memory:stm:',           // memory:stm:{userId}:{sessionId}:{id}
  STM_SESSION_SET: 'memory:stm:session:', // memory:stm:session:{userId}:{sessionId} -> Set of memory IDs
  STM_USER_SET: 'memory:stm:user:',    // memory:stm:user:{userId} -> Set of session IDs
} as const;

// ============ 默认配置 ============
export const MEMORY_CONFIG = {
  STM_DEFAULT_TTL: 1800,      // 30分钟
  STM_MAX_TTL: 86400,         // 最大24小时
  STM_MAX_PER_SESSION: 100,   // 每个会话最多100条STM
  LTM_SEARCH_LIMIT: 20,       // LTM检索默认返回数量
} as const;
