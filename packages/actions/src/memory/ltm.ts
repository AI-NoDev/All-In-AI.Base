/**
 * 长期记忆 (LTM) 存储层
 * 使用 PostgreSQL + pgvector 存储，支持语义检索
 */

import { eq, and, desc, sql, inArray, isNull, or, gt } from 'drizzle-orm';
import db from '@qiyu-allinai/db/connect';
import { userMemory } from '@qiyu-allinai/db/entities/ai';
import type { LongTermMemory, PersistentMemoryType } from './types';
import { PERSISTENT_MEMORY_TYPES } from './types';

interface CreateLtmInput {
  userId: string;
  agentId?: string | null;
  sessionId?: string | null;
  memoryType: PersistentMemoryType;
  content: string;
  metadata?: Record<string, unknown> | null;
  importance?: number;
  expireAt?: string | null;
  embedding?: number[] | null;
  createdBy: string;
  updatedBy: string;
}

interface UpdateLtmInput {
  content?: string;
  metadata?: Record<string, unknown> | null;
  importance?: number;
  expireAt?: string | null;
  embedding?: number[] | null;
  status?: string;
  updatedBy: string;
}

interface LtmFilter {
  userId?: string;
  agentId?: string | null;
  sessionId?: string | null;
  memoryType?: PersistentMemoryType | PersistentMemoryType[];
  status?: string;
  includeExpired?: boolean;
}

/**
 * 创建长期记忆
 */
export async function createLtm(input: CreateLtmInput): Promise<LongTermMemory> {
  // 验证记忆类型
  if (!PERSISTENT_MEMORY_TYPES.includes(input.memoryType)) {
    throw new Error(`Invalid memory type: ${input.memoryType}. STM should use Redis.`);
  }
  
  const [result] = await db.insert(userMemory).values({
    userId: input.userId,
    agentId: input.agentId,
    sessionId: input.sessionId,
    memoryType: input.memoryType,
    content: input.content,
    metadata: input.metadata || {},
    importance: input.importance ?? 5,
    expireAt: input.expireAt,
    embedding: input.embedding,
    status: '0',
    accessCount: 0,
    createdBy: input.createdBy,
    updatedBy: input.updatedBy,
  }).returning();
  
  return result as LongTermMemory;
}

/**
 * 获取单条长期记忆
 */
export async function getLtm(id: string): Promise<LongTermMemory | null> {
  const [result] = await db.select()
    .from(userMemory)
    .where(eq(userMemory.id, id))
    .limit(1);
  
  return result as LongTermMemory | null;
}

/**
 * 更新长期记忆
 */
export async function updateLtm(id: string, input: UpdateLtmInput): Promise<LongTermMemory | null> {
  const [result] = await db.update(userMemory)
    .set({
      ...input,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(userMemory.id, id))
    .returning();
  
  return result as LongTermMemory | null;
}

/**
 * 删除长期记忆（软删除）
 */
export async function deleteLtm(id: string, deletedBy: string): Promise<boolean> {
  const [result] = await db.update(userMemory)
    .set({
      status: '1', // 标记为删除
      updatedBy: deletedBy,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(userMemory.id, id))
    .returning();
  
  return !!result;
}

/**
 * 查询长期记忆列表
 */
export async function queryLtms(
  filter: LtmFilter,
  options: { limit?: number; offset?: number } = {}
): Promise<{ data: LongTermMemory[]; total: number }> {
  const { limit = 20, offset = 0 } = options;
  const conditions = [];
  
  if (filter.userId) {
    conditions.push(eq(userMemory.userId, filter.userId));
  }
  
  if (filter.agentId !== undefined) {
    conditions.push(filter.agentId === null 
      ? isNull(userMemory.agentId) 
      : eq(userMemory.agentId, filter.agentId));
  }
  
  if (filter.sessionId !== undefined) {
    conditions.push(filter.sessionId === null 
      ? isNull(userMemory.sessionId) 
      : eq(userMemory.sessionId, filter.sessionId));
  }
  
  if (filter.memoryType) {
    if (Array.isArray(filter.memoryType)) {
      conditions.push(inArray(userMemory.memoryType, filter.memoryType));
    } else {
      conditions.push(eq(userMemory.memoryType, filter.memoryType));
    }
  } else {
    // 默认只查询持久化类型
    conditions.push(inArray(userMemory.memoryType, [...PERSISTENT_MEMORY_TYPES]));
  }
  
  if (filter.status !== undefined) {
    conditions.push(eq(userMemory.status, filter.status));
  } else {
    // 默认只查询未删除的
    conditions.push(eq(userMemory.status, '0'));
  }
  
  // 是否包含已过期的记忆
  if (!filter.includeExpired) {
    const now = new Date().toISOString();
    conditions.push(or(isNull(userMemory.expireAt), gt(userMemory.expireAt, now)));
  }
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  // 查询数据
  const data = await db.select()
    .from(userMemory)
    .where(whereClause)
    .orderBy(desc(userMemory.createdAt))
    .limit(limit)
    .offset(offset);
  
  // 查询总数
  const [countResult] = await db.select({ count: sql<number>`count(*)` })
    .from(userMemory)
    .where(whereClause);
  
  return {
    data: data as LongTermMemory[],
    total: Number(countResult?.count || 0),
  };
}

/**
 * 增加访问计数
 */
export async function incrementAccessCount(id: string): Promise<void> {
  await db.update(userMemory)
    .set({
      accessCount: sql`${userMemory.accessCount} + 1`,
      lastAccessAt: new Date().toISOString(),
    })
    .where(eq(userMemory.id, id));
}

/**
 * 批量删除长期记忆
 */
export async function deleteLtmsByIds(ids: string[], deletedBy: string): Promise<number> {
  const result = await db.update(userMemory)
    .set({
      status: '1',
      updatedBy: deletedBy,
      updatedAt: new Date().toISOString(),
    })
    .where(inArray(userMemory.id, ids))
    .returning();
  
  return result.length;
}

/**
 * 清理过期的长期记忆
 */
export async function cleanupExpiredLtms(): Promise<number> {
  const now = new Date().toISOString();
  const result = await db.update(userMemory)
    .set({
      status: '1',
      updatedAt: now,
    })
    .where(and(
      eq(userMemory.status, '0'),
      gt(sql`${userMemory.expireAt}`, sql`'1970-01-01'`), // 有过期时间
      sql`${userMemory.expireAt} < ${now}` // 已过期
    ))
    .returning();
  
  return result.length;
}