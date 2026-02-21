/**
 * 短期记忆 (STM) 存储层
 * 使用 Redis 存储，支持 TTL 自动过期
 */

import { getRedis } from '@qiyu-allinai/cache';
import { 
  type ShortTermMemory, 
  REDIS_KEYS, 
  MEMORY_CONFIG 
} from './types';

/**
 * 生成 STM Redis Key
 */
function getStmKey(userId: string, sessionId: string, id: string): string {
  return `${REDIS_KEYS.STM_PREFIX}${userId}:${sessionId}:${id}`;
}

/**
 * 生成会话集合 Key
 */
function getSessionSetKey(userId: string, sessionId: string): string {
  return `${REDIS_KEYS.STM_SESSION_SET}${userId}:${sessionId}`;
}

/**
 * 创建短期记忆
 */
export async function createStm(memory: Omit<ShortTermMemory, 'id' | 'createdAt'>): Promise<ShortTermMemory> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const ttl = Math.min(memory.ttl || MEMORY_CONFIG.STM_DEFAULT_TTL, MEMORY_CONFIG.STM_MAX_TTL);
  
  const stm: ShortTermMemory = {
    ...memory,
    id,
    createdAt,
    ttl,
  };
  
  const key = getStmKey(memory.userId, memory.sessionId, id);
  const sessionSetKey = getSessionSetKey(memory.userId, memory.sessionId);
  
  // 存储记忆数据并设置过期时间
  await redis.set(key, JSON.stringify(stm));
  await redis.expire(key, ttl);
  
  // 添加到会话集合
  await redis.sadd(sessionSetKey, id);
  await redis.expire(sessionSetKey, ttl);
  
  return stm;
}

/**
 * 获取单条短期记忆
 */
export async function getStm(userId: string, sessionId: string, id: string): Promise<ShortTermMemory | null> {
  const redis = getRedis();
  const key = getStmKey(userId, sessionId, id);
  const data = await redis.get(key);
  
  if (!data) return null;
  return JSON.parse(data) as ShortTermMemory;
}

/**
 * 获取会话的所有短期记忆
 */
export async function getSessionStms(userId: string, sessionId: string): Promise<ShortTermMemory[]> {
  const redis = getRedis();
  const sessionSetKey = getSessionSetKey(userId, sessionId);
  
  // 获取会话中的所有记忆ID
  const ids = await redis.smembers(sessionSetKey);
  if (!ids || ids.length === 0) return [];
  
  // 批量获取记忆数据
  const memories: ShortTermMemory[] = [];
  for (const id of ids) {
    const key = getStmKey(userId, sessionId, id);
    const data = await redis.get(key);
    if (data) {
      memories.push(JSON.parse(data) as ShortTermMemory);
    } else {
      // 清理已过期的ID
      await redis.srem(sessionSetKey, id);
    }
  }
  
  // 按创建时间排序
  return memories.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * 更新短期记忆
 */
export async function updateStm(
  userId: string, 
  sessionId: string, 
  id: string, 
  updates: Partial<Pick<ShortTermMemory, 'content' | 'metadata' | 'importance'>>
): Promise<ShortTermMemory | null> {
  const existing = await getStm(userId, sessionId, id);
  if (!existing) return null;
  
  const redis = getRedis();
  const key = getStmKey(userId, sessionId, id);
  
  // 获取剩余 TTL
  const remainingTtl = await redis.ttl(key);
  if (remainingTtl <= 0) return null;
  
  const updated: ShortTermMemory = {
    ...existing,
    ...updates,
  };
  
  // 更新数据并保持剩余 TTL
  await redis.set(key, JSON.stringify(updated));
  await redis.expire(key, remainingTtl);
  return updated;
}

/**
 * 删除短期记忆
 */
export async function deleteStm(userId: string, sessionId: string, id: string): Promise<boolean> {
  const redis = getRedis();
  const key = getStmKey(userId, sessionId, id);
  const sessionSetKey = getSessionSetKey(userId, sessionId);
  
  const deleted = await redis.del(key);
  await redis.srem(sessionSetKey, id);
  
  return deleted > 0;
}

/**
 * 清空会话的所有短期记忆
 */
export async function clearSessionStms(userId: string, sessionId: string): Promise<number> {
  const redis = getRedis();
  const sessionSetKey = getSessionSetKey(userId, sessionId);
  
  const ids = await redis.smembers(sessionSetKey);
  if (!ids || ids.length === 0) return 0;
  
  let count = 0;
  for (const id of ids) {
    const key = getStmKey(userId, sessionId, id);
    const deleted = await redis.del(key);
    if (deleted > 0) count++;
  }
  
  await redis.del(sessionSetKey);
  return count;
}

/**
 * 延长短期记忆的 TTL
 */
export async function extendStmTtl(
  userId: string, 
  sessionId: string, 
  id: string, 
  additionalSeconds: number
): Promise<boolean> {
  const redis = getRedis();
  const key = getStmKey(userId, sessionId, id);
  
  const currentTtl = await redis.ttl(key);
  if (currentTtl <= 0) return false;
  
  const newTtl = Math.min(currentTtl + additionalSeconds, MEMORY_CONFIG.STM_MAX_TTL);
  await redis.expire(key, newTtl);
  
  // 同时延长会话集合的 TTL
  const sessionSetKey = getSessionSetKey(userId, sessionId);
  const sessionTtl = await redis.ttl(sessionSetKey);
  if (sessionTtl > 0 && sessionTtl < newTtl) {
    await redis.expire(sessionSetKey, newTtl);
  }
  
  return true;
}

/**
 * 获取会话中短期记忆的数量
 */
export async function countSessionStms(userId: string, sessionId: string): Promise<number> {
  const redis = getRedis();
  const sessionSetKey = getSessionSetKey(userId, sessionId);
  return await redis.scard(sessionSetKey);
}
