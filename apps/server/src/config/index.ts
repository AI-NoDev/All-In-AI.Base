/**
 * 服务器配置
 * 从环境变量读取，提供默认值
 */

import { dbActions, filesActions, devActions, wsActions } from "@qiyu-allinai/actions";
import type { ActionDefinition } from "@qiyu-allinai/actions";

// 合并所有 actions - 统一导出，确保全局一致
export const allActions: ActionDefinition[] = [
  ...dbActions,
  ...filesActions,
  ...devActions,
  ...wsActions,
];

// 构建 actions Map 用于快速查找
export const actionsMap = new Map<string, ActionDefinition>(
  allActions.map(a => [a.meta.name, a])
);

export const config = {
  // 服务器配置
  port: parseInt(Bun.env.PORT || "3000"),
  
  // JWT 配置
  jwt: {
    secret: Bun.env.JWT_SECRET || "your-secret-key-change-in-production",
    // Access Token 过期时间 (分钟)
    accessTokenExpMinutes: parseInt(Bun.env.ACCESS_TOKEN_EXP_MINUTES || "15"),
    // Refresh Token 过期时间 (天)
    refreshTokenExpDays: parseInt(Bun.env.REFRESH_TOKEN_EXP_DAYS || "7"),
  },
  
  // 数据库配置
  database: {
    url: Bun.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/allinai",
  },
  
  // 监控配置
  monitor: {
    // 原始数据保留天数（1秒粒度）
    rawRetentionDays: parseInt(Bun.env.MONITOR_RAW_RETENTION_DAYS || "3"),
    // 5分钟聚合数据保留天数
    aggregation5mRetentionDays: parseInt(Bun.env.MONITOR_5M_RETENTION_DAYS || "30"),
    // 1小时聚合数据保留天数
    aggregation1hRetentionDays: parseInt(Bun.env.MONITOR_1H_RETENTION_DAYS || "365"),
    // 采集间隔（毫秒）
    collectIntervalMs: 5000,
    // 批量写入间隔（毫秒）
    flushIntervalMs: 10000,
    // 5分钟聚合间隔（毫秒）
    aggregate5mIntervalMs: 5 * 60 * 1000,
    // 1小时聚合间隔（毫秒）
    aggregate1hIntervalMs: 60 * 60 * 1000,
    // 清理任务执行间隔（毫秒）
    cleanupIntervalMs: 60 * 60 * 1000,
  },
};

// 计算 JWT 过期时间字符串
export const jwtExpStrings = {
  accessToken: `${config.jwt.accessTokenExpMinutes}m`,
  refreshToken: `${config.jwt.refreshTokenExpDays}d`,
};

// 计算过期时间毫秒数
export const jwtExpMs = {
  accessToken: config.jwt.accessTokenExpMinutes * 60 * 1000,
  refreshToken: config.jwt.refreshTokenExpDays * 24 * 60 * 60 * 1000,
};

// 计算监控数据保留时间（秒）
export const monitorRetentionSeconds = {
  raw: config.monitor.rawRetentionDays * 24 * 3600,
  fiveMin: config.monitor.aggregation5mRetentionDays * 24 * 3600,
  oneHour: config.monitor.aggregation1hRetentionDays * 24 * 3600,
};

export default config;
