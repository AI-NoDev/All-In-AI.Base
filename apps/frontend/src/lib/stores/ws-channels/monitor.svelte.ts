/**
 * Monitor 频道 Hooks
 * 处理服务器监控相关的 WebSocket 消息
 */

import { wsStore } from '../websocket.svelte';

const CHANNEL = 'monitor';

// ============ Types ============
export interface MetricsSnapshot {
  cpu: number;
  memory: number;
  memoryUsed: number;
  memoryFree: number;
  disk: number;
  diskUsed: number;
  diskFree: number;
  diskTotal: number;
  netRx: number;
  netTx: number;
  loadAvg: number[];
  timestamp: number;
}

type MetricsHandler = (data: MetricsSnapshot) => void;

const metricsHandlers = new Set<MetricsHandler>();

// 频道消息处理
function handleChannelMessage(type: string, data: unknown) {
  switch (type) {
    case 'metrics':
      metricsHandlers.forEach(h => h(data as MetricsSnapshot));
      break;
  }
}

// ============ Public API ============
let isInitialized = false;

export function initMonitorChannel() {
  if (isInitialized) return;
  isInitialized = true;
  
  wsStore.onChannel(CHANNEL, handleChannelMessage);
  wsStore.subscribe([CHANNEL]);
}

export function destroyMonitorChannel() {
  if (!isInitialized) return;
  isInitialized = false;
  
  wsStore.unsubscribe([CHANNEL]);
  metricsHandlers.clear();
}

export function onMetrics(handler: MetricsHandler): () => void {
  metricsHandlers.add(handler);
  return () => metricsHandlers.delete(handler);
}

// 导出 Monitor 频道 hooks
export const monitorChannel = {
  init: initMonitorChannel,
  destroy: destroyMonitorChannel,
  onMetrics,
};
