import { monitorDb } from './db';
import { monitorRetentionSeconds } from '../config';
import type { MetricsSnapshot } from './collector';

interface MetricRecord {
  type: string;
  value: number;
  created_at: number;
}

// 内存缓存 - RingBuffer
const BUFFER_SIZE = 60; // 60个采集点
const metricsBuffer: MetricsSnapshot[] = [];
let lastFlushedTime = 0;

export function addToBuffer(snapshot: MetricsSnapshot) {
  metricsBuffer.push(snapshot);
  if (metricsBuffer.length > BUFFER_SIZE) {
    metricsBuffer.shift();
  }
}

export function getLatestMetrics(): MetricsSnapshot | null {
  return metricsBuffer[metricsBuffer.length - 1] || null;
}

export function getBufferedMetrics(): MetricsSnapshot[] {
  return [...metricsBuffer];
}

// 批量写入数据库
export function flushToDatabase() {
  if (metricsBuffer.length === 0) return;

  const records: MetricRecord[] = [];
  let maxTime = lastFlushedTime;

  for (const snapshot of metricsBuffer) {
    if (snapshot.timestamp <= lastFlushedTime) continue;
    if (snapshot.timestamp > maxTime) maxTime = snapshot.timestamp;

    // 只添加有效的记录（值不为 null/undefined/NaN）
    if (typeof snapshot.cpu === 'number' && !isNaN(snapshot.cpu)) {
      records.push({ type: 'cpu', value: snapshot.cpu, created_at: snapshot.timestamp });
    }
    if (typeof snapshot.memory === 'number' && !isNaN(snapshot.memory)) {
      records.push({ type: 'memory', value: snapshot.memory, created_at: snapshot.timestamp });
    }
    if (typeof snapshot.disk === 'number' && !isNaN(snapshot.disk)) {
      records.push({ type: 'disk', value: snapshot.disk, created_at: snapshot.timestamp });
    }
    if (typeof snapshot.netRx === 'number' && !isNaN(snapshot.netRx)) {
      records.push({ type: 'net_rx', value: snapshot.netRx, created_at: snapshot.timestamp });
    }
    if (typeof snapshot.netTx === 'number' && !isNaN(snapshot.netTx)) {
      records.push({ type: 'net_tx', value: snapshot.netTx, created_at: snapshot.timestamp });
    }
  }

  if (records.length === 0) return;

  const stmt = monitorDb.prepare('INSERT INTO metrics_raw (type, value, created_at) VALUES (?, ?, ?)');
  const insertMany = monitorDb.transaction((items: MetricRecord[]) => {
    for (const item of items) {
      stmt.run(item.type, item.value, item.created_at);
    }
  });

  insertMany(records);
  lastFlushedTime = maxTime;
}

// 聚合数据
export function aggregate5m() {
  const now = Math.floor(Date.now() / 1000);
  const fiveMinAgo = now - 300;
  
  const types = ['cpu', 'memory', 'disk', 'net_rx', 'net_tx'];
  
  for (const type of types) {
    const result = monitorDb.query<{ avg: number; max: number; min: number }, [string, number]>(
      `SELECT AVG(value) as avg, MAX(value) as max, MIN(value) as min 
       FROM metrics_raw WHERE type = ? AND created_at >= ?`
    ).get(type, fiveMinAgo);

    if (result && result.avg !== null) {
      monitorDb.run(
        'INSERT INTO metrics_5m (type, avg, max, min, created_at) VALUES (?, ?, ?, ?, ?)',
        [type, result.avg, result.max, result.min, now]
      );
    }
  }
}

export function aggregate1h() {
  const now = Math.floor(Date.now() / 1000);
  const oneHourAgo = now - 3600;
  
  const types = ['cpu', 'memory', 'disk', 'net_rx', 'net_tx'];
  
  for (const type of types) {
    const result = monitorDb.query<{ avg: number; max: number; min: number }, [string, number]>(
      `SELECT AVG(avg) as avg, MAX(max) as max, MIN(min) as min 
       FROM metrics_5m WHERE type = ? AND created_at >= ?`
    ).get(type, oneHourAgo);

    if (result && result.avg !== null) {
      monitorDb.run(
        'INSERT INTO metrics_1h (type, avg, max, min, created_at) VALUES (?, ?, ?, ?, ?)',
        [type, result.avg, result.max, result.min, now]
      );
    }
  }
}

// 清理过期数据
export function cleanupOldData() {
  const now = Math.floor(Date.now() / 1000);

  const rawCutoff = now - monitorRetentionSeconds.raw;
  const fiveMinCutoff = now - monitorRetentionSeconds.fiveMin;
  const oneHourCutoff = now - monitorRetentionSeconds.oneHour;

  monitorDb.run('DELETE FROM metrics_raw WHERE created_at < ?', [rawCutoff]);
  monitorDb.run('DELETE FROM metrics_5m WHERE created_at < ?', [fiveMinCutoff]);
  monitorDb.run('DELETE FROM metrics_1h WHERE created_at < ?', [oneHourCutoff]);
  
  console.log(`Monitor cleanup: raw < ${new Date(rawCutoff * 1000).toISOString()}, 5m < ${new Date(fiveMinCutoff * 1000).toISOString()}, 1h < ${new Date(oneHourCutoff * 1000).toISOString()}`);
}

// 查询历史数据
interface AggregatedMetric {
  timestamp: number;
  avg: number;
  max: number;
  min: number;
}

export function queryMetrics(type: string, range: string): AggregatedMetric[] {
  const now = Math.floor(Date.now() / 1000);
  
  let table: string;
  let since: number;
  
  switch (range) {
    case '1h':
      table = 'metrics_raw';
      since = now - 3600;
      break;
    case '24h':
      table = 'metrics_5m';
      since = now - 24 * 3600;
      break;
    case '7d':
      table = 'metrics_1h';
      since = now - 7 * 24 * 3600;
      break;
    case '30d':
      table = 'metrics_1h';
      since = now - 30 * 24 * 3600;
      break;
    default:
      table = 'metrics_5m';
      since = now - 24 * 3600;
  }

  if (table === 'metrics_raw') {
    const rows = monitorDb.query<{ value: number; created_at: number }, [string, number]>(
      `SELECT value, created_at FROM ${table} WHERE type = ? AND created_at >= ? ORDER BY created_at ASC`
    ).all(type, since);
    
    return rows.map(r => ({
      timestamp: r.created_at,
      avg: r.value,
      max: r.value,
      min: r.value,
    }));
  }

  const rows = monitorDb.query<{ avg: number; max: number; min: number; created_at: number }, [string, number]>(
    `SELECT avg, max, min, created_at FROM ${table} WHERE type = ? AND created_at >= ? ORDER BY created_at ASC`
  ).all(type, since);

  return rows.map(r => ({
    timestamp: r.created_at,
    avg: r.avg,
    max: r.max,
    min: r.min,
  }));
}
