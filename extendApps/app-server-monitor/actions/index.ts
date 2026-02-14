/**
 * 服务器监控 Actions
 * 使用 systeminformation 采集服务器性能指标
 */

import { defineAction } from '@qiyu-allinai/actions';
import { z } from 'zod';
import si from 'systeminformation';

// 指标 Schema
const metricsSchema = z.object({
  timestamp: z.number(),
  cpu: z.object({
    usage: z.number(),
    cores: z.number(),
    loadavg: z.array(z.number()),
    temperature: z.number().optional(),
  }),
  memory: z.object({
    total: z.number(),
    used: z.number(),
    available: z.number(),
    usagePercent: z.number(),
    swapTotal: z.number().optional(),
    swapUsed: z.number().optional(),
    swapUsedPercent: z.number().optional(),
  }),
  disk: z.array(z.object({
    fs: z.string(),
    mount: z.string(),
    size: z.number(),
    used: z.number(),
    available: z.number(),
    usagePercent: z.number(),
  })),
  diskIO: z.object({
    readSpeed: z.number(),
    writeSpeed: z.number(),
  }).optional(),
  network: z.array(z.object({
    iface: z.string(),
    rxSec: z.number(),
    txSec: z.number(),
  })),
  system: z.object({
    uptime: z.number(),
    processes: z.number(),
    os: z.string(),
    hostname: z.string(),
    platform: z.string(),
    arch: z.string(),
  }),
});

export type ServerMetrics = z.infer<typeof metricsSchema>;

// 存储历史数据（最近60个点）
const metricsHistory: ServerMetrics[] = [];
const MAX_HISTORY = 60;

/**
 * 采集服务器指标
 */
export async function collectMetrics(): Promise<ServerMetrics> {
  const [cpuLoad, cpuInfo, mem, fsSize, networkStats, processes, osInfo, time, cpuTemp, disksIO] = 
    await Promise.all([
      si.currentLoad(),
      si.cpu(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.processes(),
      si.osInfo(),
      si.time(),
      si.cpuTemperature().catch(() => null),
      si.disksIO().catch(() => null),
    ]);

  const metrics: ServerMetrics = {
    timestamp: Date.now(),
    cpu: {
      usage: cpuLoad.currentLoad || 0,
      cores: cpuInfo.cores || 0,
      loadavg: (cpuLoad as { avgLoad?: number }).avgLoad 
        ? [(cpuLoad as { avgLoad: number }).avgLoad, 0, 0] 
        : [0, 0, 0],
      temperature: cpuTemp?.main ?? undefined,
    },
    memory: {
      total: mem.total,
      used: mem.used,
      available: mem.available,
      usagePercent: mem.total > 0 ? (mem.used / mem.total) * 100 : 0,
      swapTotal: mem.swaptotal || undefined,
      swapUsed: mem.swapused || undefined,
      swapUsedPercent: mem.swaptotal && mem.swaptotal > 0 
        ? (mem.swapused / mem.swaptotal) * 100 
        : undefined,
    },
    disk: fsSize.map(d => ({
      fs: d.fs,
      mount: d.mount,
      size: d.size,
      used: d.used,
      available: d.available,
      usagePercent: d.use,
    })),
    diskIO: disksIO ? {
      readSpeed: disksIO.rIO_sec || 0,
      writeSpeed: disksIO.wIO_sec || 0,
    } : undefined,
    network: networkStats.map(n => ({
      iface: n.iface,
      rxSec: n.rx_sec || 0,
      txSec: n.tx_sec || 0,
    })),
    system: {
      uptime: time.uptime,
      processes: processes.all,
      os: `${osInfo.distro || osInfo.platform} ${osInfo.release}`,
      hostname: osInfo.hostname,
      platform: osInfo.platform,
      arch: osInfo.arch,
    },
  };

  // 添加到历史记录
  metricsHistory.push(metrics);
  if (metricsHistory.length > MAX_HISTORY) {
    metricsHistory.shift();
  }

  return metrics;
}

/**
 * 获取历史数据
 */
export function getMetricsHistory(): ServerMetrics[] {
  return [...metricsHistory];
}

// 获取当前指标
export const serverMonitorGetMetrics = defineAction({
  meta: {
    name: 'app-server-monitor.getMetrics',
    displayName: '获取服务器指标',
    description: '获取当前服务器性能指标',
    tags: ['app-server-monitor', 'query'],
    method: 'GET',
    path: '/api/app-server-monitor/metrics',
  },
  schemas: {
    outputSchema: z.object({
      data: metricsSchema,
    }),
  },
  execute: async () => {
    const metrics = await collectMetrics();
    return { data: metrics };
  },
});

// 获取历史数据
export const serverMonitorGetHistory = defineAction({
  meta: {
    name: 'app-server-monitor.getHistory',
    displayName: '获取历史指标',
    description: '获取服务器性能历史数据',
    tags: ['app-server-monitor', 'query'],
    method: 'GET',
    path: '/api/app-server-monitor/history',
  },
  schemas: {
    outputSchema: z.object({
      data: z.array(metricsSchema),
    }),
  },
  execute: async () => {
    return { data: getMetricsHistory() };
  },
});

// 导出 actions 数组
export const actions = [serverMonitorGetMetrics, serverMonitorGetHistory];
