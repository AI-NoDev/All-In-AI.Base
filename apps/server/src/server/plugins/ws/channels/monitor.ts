/**
 * Monitor 频道处理器
 * 处理服务器监控相关的 WebSocket 消息
 */

import { connectionManager } from '../connection-manager';
import { onMetrics } from '../../../../monitor/scheduler';
import type { WsChannelHandler, WsUser } from '../types';
import type { MetricsSnapshot } from '../../../../monitor/collector';

const CHANNEL = 'monitor';

// 存储每个连接的取消订阅函数
const metricsUnsubscribers = new Map<string, () => void>();

export const monitorChannelHandler: WsChannelHandler = {
  channel: CHANNEL,

  onMessage: async (wsId, user, type, data, requestId) => {
    switch (type) {
      case 'ping':
        connectionManager.send(wsId, {
          channel: CHANNEL,
          type: 'pong',
        });
        break;
      default:
        connectionManager.send(wsId, {
          channel: CHANNEL,
          type: 'error',
          data: { message: `Unknown monitor message type: ${type}` },
        });
    }
  },

  onSubscribe: (wsId, user) => {
    // 订阅指标更新
    const unsubscribe = onMetrics((snapshot: MetricsSnapshot) => {
      connectionManager.send(wsId, {
        channel: CHANNEL,
        type: 'metrics',
        data: snapshot,
      });
    });
    
    metricsUnsubscribers.set(wsId, unsubscribe);
    console.log(`[Monitor] User ${user.loginName} subscribed to metrics`);
  },

  onUnsubscribe: (wsId, user) => {
    const unsubscribe = metricsUnsubscribers.get(wsId);
    if (unsubscribe) {
      unsubscribe();
      metricsUnsubscribers.delete(wsId);
    }
    console.log(`[Monitor] User ${user.loginName} unsubscribed from metrics`);
  },

  onDisconnect: (wsId, user) => {
    const unsubscribe = metricsUnsubscribers.get(wsId);
    if (unsubscribe) {
      unsubscribe();
      metricsUnsubscribers.delete(wsId);
    }
  },
};
