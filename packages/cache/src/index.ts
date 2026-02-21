/**
 * Cache 包入口
 * 导出 Redis 单例和工具函数
 */

export { 
  getRedis, 
  closeRedis, 
  pingRedis, 
  reconnectRedis,
  type RedisClient 
} from './redis';

// 默认导出 Redis 单例获取函数
export { getRedis as default } from './redis';
