/**
 * Redis 连接管理
 * 使用 Bun 原生 Redis 支持
 */

import { RedisClient } from 'bun';

let redisClient: RedisClient | null = null;

/**
 * 获取 Redis URL
 */
function getRedisUrl(): string {
  return process.env.REDIS_URL || 'redis://localhost:6379';
}

/**
 * 获取 Redis 客户端单例
 */
export function getRedis(): RedisClient {
  if (!redisClient) {
    const redisUrl = getRedisUrl();
    redisClient = new RedisClient(redisUrl);
  }
  return redisClient;
}

/**
 * 关闭 Redis 连接
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    redisClient.close();
    redisClient = null;
  }
}

/**
 * 检查 Redis 连接
 */
export async function pingRedis(): Promise<boolean> {
  try {
    const redis = getRedis();
    const result = await redis.ping();
    return result === 'PONG';
  } catch {
    return false;
  }
}

/**
 * 重新连接 Redis
 */
export async function reconnectRedis(): Promise<boolean> {
  await closeRedis();
  try {
    getRedis();
    return await pingRedis();
  } catch {
    return false;
  }
}

// 导出类型
export type { RedisClient };
