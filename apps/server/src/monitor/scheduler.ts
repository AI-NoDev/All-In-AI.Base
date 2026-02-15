import { collectMetrics } from './collector';
import { addToBuffer, flushToDatabase, aggregate5m, aggregate1h, cleanupOldData } from './storage';
import { config } from '../config';

let collectInterval: ReturnType<typeof setInterval> | null = null;
let flushInterval: ReturnType<typeof setInterval> | null = null;
let aggregate5mInterval: ReturnType<typeof setInterval> | null = null;
let aggregate1hInterval: ReturnType<typeof setInterval> | null = null;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

type MetricsListener = (snapshot: Awaited<ReturnType<typeof collectMetrics>>) => void;
const listeners: Set<MetricsListener> = new Set();

export function onMetrics(listener: MetricsListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function startScheduler() {
  // 每1秒采集一次
  collectInterval = setInterval(async () => {
    try {
      const snapshot = await collectMetrics();
      addToBuffer(snapshot);
      // 通知所有监听者
      listeners.forEach(listener => listener(snapshot));
    } catch (e) {
      console.error('Failed to collect metrics:', e);
    }
  }, config.monitor.collectIntervalMs);

  // 每10秒批量写入数据库
  flushInterval = setInterval(() => {
    try {
      flushToDatabase();
    } catch (e) {
      console.error('Failed to flush metrics:', e);
    }
  }, config.monitor.flushIntervalMs);

  // 每5分钟聚合一次
  aggregate5mInterval = setInterval(() => {
    try {
      aggregate5m();
    } catch (e) {
      console.error('Failed to aggregate 5m metrics:', e);
    }
  }, config.monitor.aggregate5mIntervalMs);

  // 每1小时聚合一次
  aggregate1hInterval = setInterval(() => {
    try {
      aggregate1h();
    } catch (e) {
      console.error('Failed to aggregate 1h metrics:', e);
    }
  }, config.monitor.aggregate1hIntervalMs);

  // 每1小时清理一次过期数据
  cleanupInterval = setInterval(() => {
    try {
      cleanupOldData();
    } catch (e) {
      console.error('Failed to cleanup old data:', e);
    }
  }, config.monitor.cleanupIntervalMs);

  console.log(`Monitor scheduler started with config: raw=${config.monitor.rawRetentionDays}d, 5m=${config.monitor.aggregation5mRetentionDays}d, 1h=${config.monitor.aggregation1hRetentionDays}d`);
}

export function stopScheduler() {
  if (collectInterval) clearInterval(collectInterval);
  if (flushInterval) clearInterval(flushInterval);
  if (aggregate5mInterval) clearInterval(aggregate5mInterval);
  if (aggregate1hInterval) clearInterval(aggregate1hInterval);
  if (cleanupInterval) clearInterval(cleanupInterval);
  console.log('Monitor scheduler stopped');
}
